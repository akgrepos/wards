import { describe, expect, it } from 'vitest';
import { parseInline } from './inline.mjs';
import { parseBlocks } from './load.mjs';
import { bandsOf, doseOnlyItem, isMonitorItem, labelSplit, monitorKind, numberedPrefix } from './display.mjs';
import { proseFindings } from './prose.mjs';

const items = (md) => parseBlocks(md.split('\n')).find((b) => b.t === 'list').items;

describe('bandsOf', () => {
  it('splits a note written as score bands', () => {
    const t = '4 or more: possible delirium (with or without cognitive impairment). 1–3: possible cognitive impairment. 0: delirium unlikely (still possible if item 4 is incomplete).';
    expect(bandsOf(t)).toEqual([
      { range: '4 or more', text: 'possible delirium (with or without cognitive impairment)' },
      { range: '1–3', text: 'possible cognitive impairment' },
      { range: '0', text: 'delirium unlikely (still possible if item 4 is incomplete)' },
    ]);
  });
  it('leaves an ordinary note whole', () => {
    expect(bandsOf('The 4AT is a screen. A clinician confirms the diagnosis.')).toBeNull();
    expect(bandsOf('0: only one band')).toBeNull();
  });
});

describe('label and number prefixes', () => {
  it('splits "Label: explanation" and "1. item"', () => {
    expect(labelSplit('Inattention: difficulty focusing')).toEqual({ label: 'Inattention:', rest: 'difficulty focusing' });
    expect(labelSplit('A whole sentence. Then more: not a label')).toBeNull();
    expect(numberedPrefix('2. Inattention: x')).toEqual({ n: 2, rest: 'Inattention: x' });
    expect(numberedPrefix('Inattention')).toBeNull();
  });
});

describe('Monitor convention', () => {
  it('recognizes an item whose children are only What, When and Action', () => {
    const [a, b] = items('- Delirium screen:\n  - What: 4AT\n  - When: every shift\n  - Action: restart the search\n- ECG patterns:\n  - ECG: peaked T\n  - Action: treat');
    expect(isMonitorItem(a)).toBe(true);
    expect(isMonitorItem(b)).toBe(false);
    expect(monitorKind(a.children[2].inlines)).toMatchObject({ kind: 'action' });
  });
});

describe('doseOnlyItem', () => {
  it('accepts a dose, or a label and doses joined by "or"', () => {
    expect(doseOnlyItem(parseInline('{{dose:a|pill}}.'))?.pills).toHaveLength(1);
    const d = doseOnlyItem(parseInline('Alternatives: {{dose:a|pill}} or {{dose:b|pill}}.'));
    expect(d?.pills).toHaveLength(2);
    expect(d?.label[0].v).toBe('Alternatives: ');
  });
  it('refuses a dose inside a sentence', () => {
    expect(doseOnlyItem(parseInline('Use {{dose:a|pill}} rather than a benzodiazepine.'))).toBeNull();
    expect(doseOnlyItem(parseInline('First line: {{dose:a|pill}}. Older adults: {{dose:b|pill}}.'))).toBeNull();
  });
});

describe('display checks (warnings)', () => {
  const card = (lines) => ({ file: 'c.md', id: 'c', title: 'Card', aliases: [], related: {}, sections: [{ key: 'monitor', title: 'Monitor', blocks: parseBlocks(lines.split('\n')), subsections: [] }], nestedLines: [] });
  const rules = (lines, data) => proseFindings({ cards: [card(lines)], data }).map((f) => f.rule);
  it('flags a visible "Action:" label but not the Monitor block that shows it as Then', () => {
    expect(rules('- Screen:\n  - What: 4AT\n  - Action: restart ^[x]')).not.toContain('actionlabel');
    expect(rules('- Action: restart the search ^[x]')).toContain('actionlabel');
    expect(rules('- STEMI:\n  - ECG: ST elevation\n  - Action: reperfusion')).toContain('actionlabel');
  });
  it('flags two dose pills on one line', () => {
    expect(rules('- First: {{dose:a|pill}}. Older: {{dose:b|pill}}.')).toContain('dosepills');
    expect(rules('- Alternatives: {{dose:a|pill}}.')).not.toContain('dosepills');
  });
  it('flags a four-digit year in criteria text, not in the name or sources', () => {
    const data = { criteria: { x: { name: 'X 2021', title: 'X score', short: 'X', items: ['Age 65 or older'], sources: ['x-2021'] }, y: { title: 'Y score, 2021', short: 'Y', sources: [] } } };
    const f = proseFindings({ cards: [], data }).filter((r) => r.rule === 'criteriayear');
    expect(f.map((r) => r.card)).toEqual(['criteria:y']);
  });
});

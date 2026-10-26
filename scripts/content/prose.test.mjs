import { describe, expect, it } from 'vitest';
import { parseBlocks } from './load.mjs';
import { parseInline } from './inline.mjs';
import { BANNED, deepNestLines, monitorGap, proseFindings, proseSummary, titleCase, vagueIn } from './prose.mjs';
import { checkContent, checkWarnings } from './check.mjs';

// A card whose one section (default Treatment) is the given markdown lines.
const card = (lines, { key = 'treatment', title = 'Treatment', ...extra } = {}) => ({
  file: 'c.md', id: 'c', title: 'Card', aliases: [], related: {}, sections: [{ key, title, blocks: parseBlocks(lines.split('\n')), subsections: [] }], ...extra,
});
const found = (c, others = []) => proseFindings({ cards: [c, ...others] }).filter((f) => f.card === c.id);
const rules = (c, others) => found(c, others).map((f) => f.rule);
const hits = (text) => BANNED.filter(([, re]) => re.test(text)).map(([name]) => name);

describe('abbreviation rule (error)', () => {
  it('flags U for units after a number, not U/L or U-500 or U.S.', () => {
    expect(hits('Give 10 U of insulin.')).toContain('U for units');
    expect(hits('Give 10U now.')).toContain('U for units');
    expect(hits('ALT 40 U/L. Use U-500 insulin. In the U.S. only. 5 units.')).toEqual([]);
  });
  it('flags IU, but not an anti-Xa level in IU/mL or the word "IUD"', () => {
    expect(hits('Give 500 IU.')).toEqual(['IU']);
    expect(hits('Anti-Xa 0.3 IU/mL.')).toEqual([]);
    expect(hits('An IUD is placed.')).toEqual([]);
  });
  it('flags QD and QOD', () => {
    expect(hits('Aspirin QD.')).toEqual(['QD']);
    expect(hits('Take qod.')).toEqual(['QOD']);
    expect(hits('Order a QDS panel.')).toEqual([]);
  });
  it('flags a trailing zero and a missing leading zero on a dose, not on a lab value', () => {
    expect(hits('Give 5.0 mg.')).toEqual(['trailing zero']);
    expect(hits('Give 2.0 mg/kg.')).toEqual(['trailing zero']);
    expect(hits('Give .5 mg.')).toEqual(['missing leading zero']);
    expect(hits('Creatinine 1.0 mg/dL. Hgb 7.0 g/dL. pH 7.0. INR 2.0. Give 0.5 mg and 10 mg.')).toEqual([]);
  });
  it('flags µg (both characters), except as a concentration', () => {
    expect(hits('Give 50 µg.')).toEqual(['µg']);
    expect(hits('Give 50 μg/kg.')).toEqual(['µg']);
    expect(hits('MIC 8 µg/mL. D-dimer 500 µg/L.')).toEqual([]);
  });
  it('flags MS, MSO4, MgSO4, D/C, HS and DC as discharge or stop', () => {
    expect(hits('Give MS 2 mg.')).toEqual(['MS']);
    expect(hits('Give MSO4.')).toEqual(['MSO4']);
    expect(hits('Give MgSO4.')).toEqual(['MgSO4']);
    expect(hits('D/C the drip.')).toEqual(['D/C']);
    expect(hits('Dose HS.')).toEqual(['HS']);
    expect(hits('DC the drip. DC\'d today.')).toEqual(['DC']);
  });
  it('leaves lookalikes alone', () => {
    expect(hits('hs-troponin and HS-CRP. Ms. Smith. Mrs. Jones. DC cardioversion. Msec. CMS. MSSA. AMS.')).toEqual([]);
  });
  it('is an error, and reads prose, not dose inserts', () => {
    expect(found(card('- Give MS 2 mg.'))[0]).toMatchObject({ rule: 'abbreviation', severity: 'error' });
    expect(rules(card('- Give {{dose:morphine-iv}} (10 U).'))).toEqual(['abbreviation']);
    expect(rules(card('- Give {{dose:morphine-iv}} now.'))).toEqual([]);
  });
  it('reads the definition and table headings, and fails checkContent', () => {
    const c = card('| Drug | Dose |\n|---|---|\n| A | 1 |', { definition: { inlines: parseInline('Needs 5.0 mg.'), sources: [] } });
    expect(rules(c)).toEqual(['abbreviation']);
    expect(proseSummary(found(c)).find((r) => r.rule === 'abbreviation')).toMatchObject({ cards: 1, severity: 'error' });
  });
  it('is in the errors from checkContent, and not in its warnings', () => {
    const content = { systems: [], cards: [card('- Give 5.0 mg.')], data: {} };
    expect(checkContent(content).join('\n')).toMatch(/abbreviation rule/);
    expect(checkWarnings(content).join('\n')).not.toMatch(/abbreviation rule/);
  });
});

describe('vague-word rule (warning)', () => {
  it('finds the vague words', () => {
    expect(vagueIn('Monitor closely.')).toHaveLength(1);
    expect(vagueIn('Check frequently.')).toHaveLength(1);
    expect(vagueIn('Consider CT.')).toHaveLength(1);
    expect(vagueIn('Review the labs.')).toHaveLength(1);
    expect(vagueIn('Get brain imaging.')).toHaveLength(1);
  });
  it('lets a systematic review stand, and plain action words', () => {
    expect(vagueIn('A systematic review found benefit. Check BMP every 6 hours.')).toEqual([]);
  });
  it('flags medication on its own, not as a bold label or a named process', () => {
    expect(rules(card('- Stop the medication.'))).toEqual(['vague']);
    expect(rules(card('- **Medications:** anticholinergics'))).toEqual([]);
    expect(rules(card('- Do a medication reconciliation.'))).toEqual([]);
  });
  it('is a warning', () => {
    expect(found(card('- Consider CT.'))[0].severity).toBe('warn');
  });
});

describe('repeat rule (warning)', () => {
  const two = (a, b) => ({ ...card(a), sections: [{ key: 'treatment', title: 'Treatment', blocks: parseBlocks(a.split('\n')), subsections: [] }, { key: 'monitor', title: 'Monitor', blocks: parseBlocks(b.split('\n')), subsections: [] }] });
  it('flags nearly the same line in two sections', () => {
    const c = two('- Stop the drug if QTc rises above 500 ms.', '- Stop the drug if the QTc rises above 500 ms.');
    expect(rules(c)).toContain('repeat');
  });
  it('does not flag different lines, or a summary in At a Glance', () => {
    expect(rules(two('- Give fluids at the start.', '- Recheck sodium every 6 hours.'))).not.toContain('repeat');
    const c = { ...two('- Stop the drug if QTc rises above 500 ms.', '- Weigh daily.'), sections: [{ key: 'at-a-glance', title: 'At a Glance', blocks: parseBlocks(['- Stop the drug if QTc rises above 500 ms.']), subsections: [] }, { key: 'treatment', title: 'Treatment', blocks: parseBlocks(['- Stop the drug if QTc rises above 500 ms.']), subsections: [] }] };
    expect(rules(c)).not.toContain('repeat');
  });
});

describe('link rule (warning)', () => {
  const other = { ...card('- x'), id: 'renal-hyponatremia', file: 'o.md', title: 'Hyponatremia' };
  it('flags a live card named in plain text, not a link or the card itself', () => {
    expect(rules(card('- Check for hyponatremia.'), [other])).toEqual(['link']);
    expect(rules(card('- Check for [[renal-hyponatremia|hyponatremia]].'), [other])).toEqual([]);
    expect(proseFindings({ cards: [other] }).map((f) => f.rule)).toEqual([]);
  });
  it('does not flag a card that is not written yet', () => {
    expect(rules(card('- Check for hyponatremia.'))).toEqual([]);
  });
});

describe('treatment length rule (warning)', () => {
  const bullets = (n) => Array.from({ length: n }, (_, i) => `- Step ${i} now.`).join('\n');
  it('flags more than 25 bullets, children included', () => {
    expect(rules(card(bullets(26)))).toEqual(['length']);
    expect(rules(card(bullets(25)))).toEqual([]);
    expect(rules(card('- A\n  - b\n'.repeat(13)))).toEqual(['length']);
  });
});

describe('monitor rule (warning)', () => {
  it('wants a when and an action', () => {
    expect(monitorGap('Check potassium every 6 hours. Hold the drug if above 5.5.')).toEqual([]);
    expect(monitorGap('Potassium.')).toEqual(['when', 'action']);
    expect(monitorGap('Check potassium every 6 hours.')).toEqual(['action']);
    expect(monitorGap('Stop the drug if the QTc exceeds 500 ms.')).toEqual([]);
  });
  it('reads a lead-in together with its sub-bullets', () => {
    const ok = card('- Recheck sodium:\n  - every 6 hours\n  - stop hypertonic saline at 130', { key: 'monitor', title: 'Monitor' });
    expect(rules(ok)).toEqual([]);
    expect(rules(card('- Sodium.', { key: 'monitor', title: 'Monitor' }))).toEqual(['monitor']);
  });
  it('only reads the Monitor section', () => {
    expect(rules(card('- Sodium.'))).toEqual([]);
  });
});

describe('nesting rule (warning)', () => {
  it('finds a bullet nested two levels deep, outside numbered steps', () => {
    expect(deepNestLines('---\nid: x\n---\n## Treatment\n- a\n  - b\n    - c\n')).toEqual([7]);
    expect(deepNestLines('- a\n  - b\n')).toEqual([]);
  });
  it('allows the body of a numbered step', () => {
    expect(deepNestLines('1. Step\n    - a\n      - b\n')).toEqual([]);
  });
  it('is reported from the loader\'s line numbers', () => {
    expect(rules(card('- a', { nestedLines: [9] }))).toEqual(['nesting']);
  });
});

describe('capitalization rule (warning)', () => {
  it('spots title case, not sentence case or one proper noun', () => {
    expect(titleCase('Give Fluids Early')).toBe(true);
    expect(titleCase('Give fluids early')).toBe(false);
    expect(titleCase('Give thiamine before glucose')).toBe(false);
    expect(titleCase('Start Wernicke treatment')).toBe(false);
  });
  it('flags step titles and table headings', () => {
    expect(rules(card('1. Give Fluids Early\n  - 1 L now'))).toEqual(['caps']);
    expect(rules(card('| Drug Class Name | dose |\n|---|---|\n| A | 1 |'))).toEqual(['caps']);
    expect(rules(card('| Drug | Dose. |\n|---|---|\n| A | 1 |'))).toEqual(['caps']);
    expect(rules(card('1. Give fluids early\n  - 1 L now'))).toEqual([]);
  });
});

describe('warning-home rule (error)', () => {
  const more = (lines, extra = {}) => ({ ...card('- x'), id: 'new-card', sections: [{ key: 'more', title: 'More Information', blocks: parseBlocks(lines.split('\n')), subsections: [] }], ...extra });
  it('is an error for an unmarked danger line in More Information', () => {
    expect(found(more('- Fondaparinux is contraindicated.'))[0]).toMatchObject({ rule: 'warninghome', severity: 'error' });
    expect(rules(more('- Do not restart the drug.'))).toEqual(['warninghome']);
    expect(rules(more('- Avoid NSAIDs.'))).toEqual(['warninghome']);
  });
  it('passes a line marked [!also-above], its sub-bullets, and lines with no danger word', () => {
    expect(rules(more('- Fondaparinux is contraindicated. [!also-above]'))).toEqual([]);
    expect(rules(more('- Never use these: [!also-above]\n  - drug a'))).toEqual([]);
    expect(rules(more('- Evidence is mixed.'))).toEqual([]);
  });
  it('does not read Treatment', () => {
    expect(rules(card('- Avoid NSAIDs.'))).toEqual([]);
  });
  it('stays a warning for a card on the unswept list', () => {
    expect(found(more('- Avoid NSAIDs.', { id: 'cardio-adhf' }))[0].severity).toBe('warn');
  });
});

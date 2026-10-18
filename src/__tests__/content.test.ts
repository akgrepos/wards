import { describe, expect, it } from 'vitest';
import { loadContent } from '../../scripts/content/load.mjs';
import { checkContent } from '../../scripts/content/check.mjs';
import { parseBlocks } from '../../scripts/content/load.mjs';

const real = loadContent(process.cwd(), { includeExamples: true }) as never as Parameters<typeof checkContent>[0];
type AnyCard = Record<string, unknown>;

function withCard(md: string, extra: AnyCard = {}) {
  const blocks = (lines: string) => parseBlocks(lines.split('\n'));
  const base = JSON.parse(JSON.stringify(real));
  const card = {
    file: 'test.md', id: 'test-card', type: 'condition', variant: null, system: 'renal', group: 'condition', subsection: 'Test Disorders',
    title: 'Test', aliases: [], related: {}, example: true, unknownSections: [], unknownSubsections: [],
    definition: null, basedOn: [], reviewed: null,
    sections: [{ key: 'at-a-glance', title: 'At a Glance', blocks: blocks(md), subsections: [] }],
    ...extra,
  };
  base.cards.push(card);
  return checkContent(base);
}
function withDose(fields: Record<string, unknown>) {
  const base = JSON.parse(JSON.stringify(real));
  base.data.dose['test-dose'] = { drug_name: 'Testdrug', indication: 'Test', route: 'IV', amount: 1, unit: 'mg', frequency: 'once', sources: ['example-guideline-a'], _file: 'test.yaml', ...fields };
  return checkContent(base).join('\n');
}
const kp = (extra: string) => `- One ^[example-guideline-a]\n- Two ^[example-guideline-a]\n- Three ^[example-guideline-a]\n${extra}`;

describe('content checks', () => {
  it('all content passes', () => {
    expect(checkContent(real)).toEqual([]);
  });
  it('rejects a dose typed as text', () => {
    expect(withCard(kp('- Give 40 mg daily ^[example-guideline-a]')).join()).toMatch(/dose typed as text/);
  });
  it('allows concentrations like mmol/L', () => {
    expect(withCard(kp('- Level above 6.5 mmol/L ^[example-guideline-a]'))).toEqual([]);
  });
  it('rejects a line without a source', () => {
    expect(withCard(kp('- An unsourced claim')).join()).toMatch(/has no source/);
  });
  it('rejects an unknown source and an unknown insert', () => {
    const e = withCard(kp('- Text {{threshold:nope}} ^[no-such-source]')).join();
    expect(e).toMatch(/unknown source "no-such-source"/);
    expect(e).toMatch(/unknown threshold "nope"/);
  });
  it('requires 3–6 bullets in At a Glance', () => {
    expect(withCard('- Only one ^[example-guideline-a]').join()).toMatch(/3–6 bullets/);
  });
  it('puts every dose on a line of its own, never inside a sentence', () => {
    expect(withCard(kp('- Give {{dose:example-drug-standard}} now ^[example-guideline-a]')).join()).toMatch(/on a line of its own/);
    expect(withCard(kp('\n{{dose:example-drug-standard}}'))).toEqual([]);
  });
  it('checks scale, comparison and time blocks', () => {
    expect(withCard(kp(':::scale Grades\n- Mild: low ^[example-guideline-a]\n:::')).join()).toMatch(/needs 2–5 items/);
    expect(withCard(kp(':::compare Q\n- A: yes ^[example-guideline-a]\n- B ^[example-guideline-a]\n:::')).join()).toMatch(/"Label: text"/);
    expect(withCard(kp(':::times Recheck\n- 1 h\n:::')).join()).toMatch(/has no source/);
    expect(withCard(kp(':::chart X\n- a\n:::')).join()).toMatch(/unknown block/);
  });
  it('needs a definition and a reviewed date on topic pages', () => {
    const e = withCard(kp(''), { example: false }).join();
    expect(e).toMatch(/one-line "definition"/);
    expect(e).toMatch(/"reviewed" date/);
  });
  it('allows ### only inside More Information', () => {
    expect(withCard(kp(''), { unknownSubsections: ['At a Glance › Extra'] }).join()).toMatch(/not a More Information subsection/);
  });
  it('checks the dose sheet fields', () => {
    expect(withDose({ frequency: undefined })).toMatch(/needs a "frequency" or a "rate"/);
    expect(withDose({ frequency: undefined, rate: 'over 10 minutes' })).toBe('');
    expect(withDose({ boxed: 'x' })).toMatch(/unknown dose field "boxed"/);
    expect(withDose({ alternative: { dose: 'no-such-dose' } })).toMatch(/alternative dose "no-such-dose" does not exist/);
    expect(withDose({ cautions: 'one string' })).toMatch(/cautions must be a list/);
  });
});

describe('card format', () => {
  it('reads numbered steps with their own content, and containers', () => {
    const b = parseBlocks(['1. Stabilize', '   - Calcium first. ^[s]', '', '   {{dose:x}}', '2. Shift', '', ':::times Recheck ^[s]', '- 1 h', '- 2 h', ':::']) as { t: string; items: { blocks?: { t: string }[]; text?: string }[] }[];
    expect(b.map((x) => x.t)).toEqual(['steps', 'times']);
    expect(b[0].items[0].blocks!.map((x) => x.t)).toEqual(['list', 'insert']);
    expect(b[1].items.map((x) => x.text)).toEqual(['1 h', '2 h']);
  });
  it('the migrated cards use the new sections', () => {
    const hk = real.cards.find((c) => (c as { id: string }).id === 'renal-hyperkalemia') as unknown as { sections: { key: string; subsections: { key: string }[] }[] };
    expect(hk.sections.map((s) => s.key)).toEqual(['at-a-glance', 'severity', 'causes', 'presentation', 'diagnosis', 'treatment', 'monitor', 'when-to-call', 'more', 'pearls']);
    expect(hk.sections.find((s) => s.key === 'more')!.subsections.map((s) => s.key)).toEqual(['guidelines-differ', 'special-populations', 'complications', 'after-acute', 'epi-patho']);
    const aki = real.cards.find((c) => (c as { id: string }).id === 'renal-aki') as unknown as { sections: { key: string }[] };
    expect(aki.sections.map((s) => s.key)).toEqual(['at-a-glance', 'definition', 'first-steps', 'causes', 'presentation', 'diagnosis', 'treatment', 'when-to-call', 'more', 'pearls']);
  });
});

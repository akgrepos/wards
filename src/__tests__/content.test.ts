import { describe, expect, it } from 'vitest';
import { loadContent } from '../../scripts/content/load.mjs';
import { checkContent } from '../../scripts/content/check.mjs';
import { parseBlocks } from '../../scripts/content/load.mjs';

const real = loadContent(process.cwd(), { includeExamples: true }) as never as Parameters<typeof checkContent>[0];

function withCard(md: string) {
  const blocks = (lines: string) => parseBlocks(lines.split('\n'));
  const base = JSON.parse(JSON.stringify(real));
  const card = {
    file: 'test.md', id: 'test-card', type: 'condition', variant: null, system: 'renal', group: 'condition', order: 1,
    title: 'Test', aliases: [], related: {}, example: true, unknownSections: [],
    sections: [{ key: 'key-points', title: 'Key points', collapsed: false, summary: null, blocks: blocks(md), more: [], moreTitle: null }],
  };
  base.cards.push(card);
  return checkContent(base);
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
    const e = withCard(kp('- Text {{dose:nope}} ^[no-such-source]')).join();
    expect(e).toMatch(/unknown source "no-such-source"/);
    expect(e).toMatch(/unknown dose "nope"/);
  });
  it('requires 3–6 key points', () => {
    expect(withCard('- Only one ^[example-guideline-a]').join()).toMatch(/3–6 bullets/);
  });
});

import { describe, it, expect } from 'vitest';
import { checkStyle } from '../../scripts/content/style.mjs';

const item = (text: string, strong = false) => ({ inlines: strong ? [{ t: 'strong', v: 'Label' }, { t: 'text', v: text }] : [{ t: 'text', v: text }], sources: [], children: [] });
const card = (items: unknown[]) => ({ file: 'c.md', sections: [{ blocks: [{ t: 'list', items }], subsections: [] }] });

describe('writing-style lint', () => {
  it('passes one-idea bullets in one shape', () => {
    expect(checkStyle({ cards: [card([item('Give fluids.'), item('Recheck in 4 hours.'), item('Call renal.')])] })).toEqual([]);
  });
  it('warns on a bullet with several sentences', () => {
    expect(checkStyle({ cards: [card([item('Give fluids. Then recheck. Then call renal.')])] }).join()).toMatch(/one idea per bullet/);
  });
  it('warns when a list mixes labelled and plain bullets', () => {
    expect(checkStyle({ cards: [card([item('a', true), item('b', true), item('c')])] }).join()).toMatch(/parallel items/);
  });
});

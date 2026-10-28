import { describe, expect, it } from 'vitest';
import { parseBlocks } from './load.mjs';
import { tagTerms, strayBackslashes, termMatcher } from './terms.mjs';
import { checkTerm } from './check.mjs';

const terms = {
  catatonia: { term: 'catatonia', aliases: ['catatonic'], definition: 'd', group: 'psych', sources: ['s'] },
  'hypoactive-delirium': { term: 'hypoactive delirium', definition: 'd', group: 'neuro', sources: ['s'] },
  dka: { term: 'diabetic ketoacidosis', aliases: ['DKA'], definition: 'd', group: 'endo', card: 'endo-dka', sources: ['s'] },
  pres: { term: 'posterior reversible encephalopathy syndrome', aliases: ['PRES'], definition: 'd', group: 'neuro', sources: ['s'] },
};
const card = (lines, extra = {}) => ({
  file: 'c.md', id: 'c', title: 'Card', aliases: [], sections: [{ key: 'causes', title: 'Causes', blocks: parseBlocks(lines.split('\n')), subsections: [] }], ...extra,
});
const kinds = (c) => c.sections[0].blocks[0].inlines ?? c.sections[0].blocks[0].items[0].inlines;
const tagged = (c) => kinds(c).filter((x) => x.t === 'insert' && x.kind === 'term').map((x) => `${x.id}:${x.label}`);

describe('tagging terms', () => {
  it('tags only the first mention in a section, and an alias counts', () => {
    const c = card('- Catatonia is seen. The catatonic patient shows catatonia again. ^[s]');
    tagTerms([c], terms);
    expect(tagged(c)).toEqual(['catatonia:Catatonia']);
    expect(kinds(c).map((x) => x.v ?? '').join('')).toContain('The catatonic patient');
  });
  it('tags again in the next section', () => {
    const c = card('- catatonia ^[s]');
    c.sections.push({ key: 'more', title: 'More', blocks: parseBlocks(['- catatonia ^[s]']), subsections: [] });
    tagTerms([c], terms);
    expect(c.sections[1].blocks[0].items[0].inlines.some((x) => x.t === 'insert')).toBe(true);
  });
  it('prefers the longer name', () => {
    const c = card('- Hypoactive delirium is missed. ^[s]');
    tagTerms([c], terms);
    expect(tagged(c)).toEqual(['hypoactive-delirium:Hypoactive delirium']);
  });
  it('a backslash turns tagging off for that spot and is removed', () => {
    const c = card('- \\catatonia then catatonia ^[s]');
    tagTerms([c], terms);
    expect(tagged(c)).toEqual(['catatonia:catatonia']);
    expect(kinds(c)[0].v).toBe('catatonia then ');
    expect(strayBackslashes([c])).toEqual([]);
  });
  it('reports a backslash that is not before a term', () => {
    const c = card('- a \\nothing here ^[s]');
    tagTerms([c], terms);
    expect(strayBackslashes([c]).length).toBe(1);
  });
  it('leaves links, doses, bold words and the card\'s own term alone', () => {
    const c = card('- **Catatonia:** see [[psych-x|catatonia]] and {{dose:x|pill}} ^[s]');
    tagTerms([c], terms);
    expect(tagged(c)).toEqual([]);
    const own = card('- catatonia ^[s]', { id: 'psych-catatonia', title: 'Catatonia' });
    tagTerms([own], terms);
    expect(tagged(own)).toEqual([]);
    const linked = card('- DKA and diabetic ketoacidosis ^[s]', { id: 'endo-dka' });
    tagTerms([linked], terms);
    expect(tagged(linked)).toEqual([]);
  });
  it('matches an abbreviation only in capitals, and whole words only', () => {
    const c = card('- pres, presence, DKA ^[s]');
    tagTerms([c], terms);
    expect(tagged(c)).toEqual(['dka:DKA']);
    expect(termMatcher(terms)('non-catatonia').length).toBe(0);
  });
});

describe('term checks', () => {
  const systems = [{ id: 'psych' }];
  const ok = { term: 'x', definition: 'A word.', group: 'psych', sources: ['s'] };
  const run = (item, cards = []) => checkTerm('x', item, { cards, data: {}, systems });
  it('accepts a complete term', () => expect(run(ok)).toEqual([]));
  it('needs a known system, a real card, and a snippet of 2 to 4 lines on a card', () => {
    expect(run({ ...ok, group: 'nope' }).join()).toMatch(/system id/);
    expect(run({ ...ok, card: 'gone' }).join()).toMatch(/not a card/);
    expect(run({ ...ok, snippet: ['a', 'b'] }).join()).toMatch(/needs "card"/);
    expect(run({ ...ok, card: 'c', snippet: ['a'] }, [{ id: 'c' }]).join()).toMatch(/2 to 4/);
    expect(run({ ...ok, card: 'c', snippet: ['a', 'b'] }, [{ id: 'c' }])).toEqual([]);
  });
});

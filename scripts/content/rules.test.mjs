import { describe, expect, it } from 'vitest';
import { parseBlocks } from './load.mjs';
import { allowedNames, namesIn, ruleFindings, ruleSummary } from './rules.mjs';
import { checkWarnings } from './check.mjs';

// A card whose "Treatment" section is the given markdown lines.
const card = (lines, extra = {}) => ({
  file: 'c.md', id: 'c', title: 'Card', aliases: [], related: {}, sections: [{ key: 'treatment', title: 'Treatment', blocks: parseBlocks(lines.split('\n')), subsections: [] }], ...extra,
});
const find = (c, opts = {}) => ruleFindings({ cards: [c, ...(opts.others ?? [])], data: opts.data ?? {}, unchecked: opts.unchecked ?? [] }).filter((f) => f.card === c.id);
const rules = (c, opts) => find(c, opts).map((f) => f.rule);

describe('bullet rule', () => {
  it('passes short one-idea bullets', () => {
    expect(rules(card('- Give fluids.\n- Recheck in 4 hours.'))).toEqual([]);
  });
  it('flags three sentences, and a bullet over 160 characters', () => {
    expect(rules(card('- Give fluids. Then recheck. Then call renal.'))).toEqual(['bullet']);
    expect(rules(card(`- ${'a'.repeat(170)}`))).toEqual(['bullet']);
  });
  it('allows two sentences', () => {
    expect(rules(card('- Give fluids. Then recheck in 4 hours.'))).toEqual([]);
  });
  it('checks sub-bullets inside numbered steps', () => {
    expect(rules(card(`1. Step\n  - ${'a'.repeat(170)}`))).toEqual(['bullet']);
  });
});

describe('parallel rule', () => {
  it('flags a list that mixes bold-label bullets with plain ones', () => {
    expect(rules(card('- **A:** x\n- **B:** y\n- plain'))).toEqual(['parallel']);
    expect(rules(card('- **A:** x\n- **B:** y\n- **C:** z'))).toEqual([]);
  });
});

describe('table rule', () => {
  it('passes a 3-column table with short cells', () => {
    expect(rules(card('| Drug | Dose | Route |\n|---|---|---|\n| A | 1 | IV |'))).toEqual([]);
  });
  it('flags 4 columns, and a cell over 25 characters', () => {
    expect(rules(card('| A | B | C | D |\n|---|---|---|---|\n| 1 | 2 | 3 | 4 |'))).toEqual(['table']);
    expect(rules(card('| A | B |\n|---|---|\n| 1 | a long explanation of what this means |'))).toEqual(['table']);
  });
});

describe('scale rule', () => {
  it('flags a table whose first column holds severity or risk levels', () => {
    expect(rules(card('| Level | Meaning |\n|---|---|\n| Mild | a |\n| Severe | b |'))).toEqual(['scale']);
    expect(rules(card('| Risk | Plan |\n|---|---|\n| Low | a |\n| Intermediate | b |\n| High | c |'))).toEqual(['scale']);
    expect(rules(card('| Stage | Plan |\n|---|---|\n| Stage 1 | a |\n| Stage 2 | b |'))).toEqual(['scale']);
  });
  it('does not flag one level word, or a :::scale block', () => {
    expect(rules(card('| Level | Meaning |\n|---|---|\n| Mild | a |\n| Other | b |'))).toEqual([]);
    expect(rules(card(':::scale Severity\n- Mild: a\n- Severe: b\n:::'))).toEqual([]);
  });
  it('flags a bullet ladder found by the loader', () => {
    expect(rules(card('- x', { severityLines: [4] }))).toEqual(['scale']);
  });
});

describe('names rule', () => {
  const data = {
    criteria: { 'idsa-ats': { name: 'IDSA/ATS severe CAP criteria', title: 'IDSA/ATS severe CAP criteria, 2007', short: 'IDSA/ATS severe CAP' } },
    calc: { curb: { name: 'CURB-65', short: 'CURB-65', match: ['CURB-65'] } },
  };
  it('finds society and study names', () => {
    expect(namesIn('The ACC and AHA recommend this.')).toEqual(['ACC', 'AHA']);
    expect(namesIn('The American Thoracic Society advises it.')).toEqual(['American Thoracic Society']);
    expect(namesIn('In the DELIVER trial, benefit held. Smith et al. agreed.')).toEqual(['DELIVER trial', 'et al']);
    expect(namesIn('Surviving Sepsis Campaign guidance.')).toEqual(['Surviving Sepsis Campaign']);
  });
  it('does not flag ordinary words that look like study names', () => {
    expect(namesIn('This study is small. Iron studies help. An ICU study. The trial ended.')).toEqual([]);
  });
  it('allows names inside a criteria set or score that is used in the text', () => {
    const allowed = allowedNames(data);
    expect(namesIn('Severe CAP by IDSA/ATS severe CAP criteria.', allowed)).toEqual([]);
    expect(namesIn('Severe CAP by the IDSA.', allowed)).toEqual(['IDSA']);
    expect(namesIn('CURB-65 at 2 or more.', allowed)).toEqual([]);
  });
  it('flags a card whose bullet names a society', () => {
    expect(rules(card('- Per ACEP, sedate early.'), { data })).toEqual(['names']);
    expect(rules(card('- Sedate early.'), { data })).toEqual([]);
  });
});

describe('title rule', () => {
  it('flags a title over 32 characters', () => {
    expect(rules(card('- x', { title: 'A'.repeat(33) }))).toEqual(['title']);
    expect(rules(card('- x', { title: 'A'.repeat(32) }))).toEqual([]);
  });
});

describe('related rule', () => {
  it('flags a related card that does not list this one back', () => {
    const a = card('- x', { id: 'a', related: { see: ['b'] } });
    const b = card('- x', { id: 'b', related: {} });
    expect(rules(a, { others: [b] })).toEqual(['related']);
    expect(rules(b, { others: [a] })).toEqual([]);
    expect(rules({ ...b, related: { see: ['a'] } }, { others: [a] })).toEqual([]);
  });
});

describe('alias rule', () => {
  it('flags an unquoted number alias, and not a quoted one or one with words', () => {
    expect(rules(card('- x', { aliases: [988] }))).toEqual(['alias']);
    expect(rules(card('- x', { aliases: ['988', 'suicide hotline 988'] }))).toEqual([]);
  });
});

describe('levels', () => {
  const bad = '- Give fluids. Then recheck. Then call renal.';
  it('makes a finding an error for a card in unchecked.txt, and a warning for an existing card', () => {
    const base = { systems: [], data: {} };
    expect(find(card(bad), { unchecked: ['c'] })[0].isNew).toBe(true);
    expect(find(card(bad))[0].isNew).toBe(false);
    expect(checkWarnings({ ...base, cards: [card(bad)] }).join()).toMatch(/bullet rule/);
    expect(checkWarnings({ ...base, cards: [card(bad)], unchecked: ['c'] }).join()).not.toMatch(/bullet rule/);
  });
  it('summarizes the existing cards each rule flags', () => {
    const s = ruleSummary(ruleFindings({ cards: [card(bad), card(bad, { id: 'd' })], data: {}, unchecked: ['d'] }));
    expect(s.find((r) => r.rule === 'bullet')).toEqual({ rule: 'bullet', cards: 1, places: 1 });
  });
});

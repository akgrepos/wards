import { describe, expect, it } from 'vitest';
import { parseBlocks } from './load.mjs';
import { fingerprint, clinicalTokens } from './fingerprint.mjs';
import { classifyCard, gateCard, highest, tinyChange } from './tier-rules.mjs';
import { setCheckedLine, setVerification, checkFingerprints } from './checked.mjs';
import { loadContent } from './load.mjs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dose = { drug_name: 'Drug', amount: '500', unit: 'mg', frequency: 'every 8 hours', sources: ['s1'], verification: { read: 'not-verified', source: 's1', date: '2026-10-01' } };
const card = (lines, data = { dose: { d1: dose } }, extra = {}) => ({
  card: { id: 'c', title: 'T', aliases: [], related: {}, definition: null, emergency: null, checked: null, ...extra, sections: [{ key: 'treatment', title: 'Treatment', blocks: parseBlocks(lines), subsections: [] }] },
  data,
});
const base = ['- Give 500 mg every 8 hours for 7 days. ^[s1]', '- Avoid in pregnancy. ^[s2]', '{{dose:d1}}'];

describe('fingerprint', () => {
  it('ignores prose wording and the dose verification note', () => {
    const a = card(base);
    const b = card(['- Give 500 mg every 8 hours for 7 days, then stop. ^[s1]', '- Not for pregnancy. ^[s2]', '{{dose:d1}}'], { dose: { d1: { ...dose, verification: { read: 'full-text', source: 's1', date: '2026-10-24' } } } });
    expect(fingerprint(a)).toBe(fingerprint(b));
  });
  it('changes with a number, a citation on a numeric line, or a dose field', () => {
    const f = fingerprint(card(base));
    expect(fingerprint(card(['- Give 500 mg every 8 hours for 10 days. ^[s1]', '- Avoid in pregnancy. ^[s2]', '{{dose:d1}}']))).not.toBe(f);
    expect(fingerprint(card(['- Give 500 mg every 8 hours for 7 days. ^[s3]', '- Avoid in pregnancy. ^[s2]', '{{dose:d1}}']))).not.toBe(f);
    expect(fingerprint(card(base, { dose: { d1: { ...dose, amount: '1000' } } }))).not.toBe(f);
  });
  it('does not read digits inside insert or link ids as numbers', () => {
    expect(clinicalTokens('see [[renal-aki-2]] then 5 mg {{dose:x-1g}}').sort()).toEqual(['5mg', '{{dose:x-1g}}'].sort());
  });
});

describe('tier rules', () => {
  const tier = (after, before = card(base)) => classifyCard(before, after);
  it('tier 0: only spacing, punctuation, capitals or tiny spelling', () => {
    expect(tier(card(['- Give 500 mg  every 8 hours for 7 days . ^[s1]', '- avoid in pregnancy. ^[s2]', '{{dose:d1}}'])).tier).toBe('tier-0');
    expect(tier(card(['- Give 500 mg every 8 hours for 7 days. ^[s1]', '- Avoid in pregnnacy. ^[s2]', '{{dose:d1}}'])).tier).toBe('tier-0');
    expect(tinyChange({ text: 'a 5 mg', sources: [] }, { text: 'a 6 mg', sources: [] })).toBe(false);
  });
  it('tier 1: wording changed, fingerprint the same', () => {
    expect(tier(card(['- Give 500 mg every 8 hours for 7 days. ^[s1]', '- Do not use in pregnancy. ^[s2]', '{{dose:d1}}'])).tier).toBe('tier-1');
    expect(tier(card([...base, '- A new teaching pearl. ^[s2]'])).tier).toBe('tier-1');
  });
  it('tier 1: a card field changed', () => {
    expect(tier(card(base, undefined, { title: 'New title' })).tier).toBe('tier-1');
  });
  it('tier 2: a number, a dose, a citation on a numeric line, or a new card', () => {
    expect(tier(card(['- Give 500 mg every 8 hours for 14 days. ^[s1]', '- Avoid in pregnancy. ^[s2]', '{{dose:d1}}']))).toMatchObject({ tier: 'tier-2' });
    expect(tier(card(base, { dose: { d1: { ...dose, frequency: 'every 12 hours' } } })).reasons.join()).toMatch(/dose\/d1/);
    expect(tier(card(['- Give 500 mg every 8 hours for 7 days. ^[s9]', '- Avoid in pregnancy. ^[s2]', '{{dose:d1}}'])).reasons.join()).toMatch(/citation/);
    expect(classifyCard(undefined, card(base)).tier).toBe('tier-2');
  });
  it('a care-changing claim with no number change stays tier 1', () => {
    expect(tier(card(['- Give 500 mg every 8 hours for 7 days. ^[s1]', '- Safe in pregnancy. ^[s2]', '{{dose:d1}}'])).tier).toBe('tier-1');
  });
  it('nothing to report when only the stamp changed', () => {
    expect(tier(card(base, undefined, { checked: { date: '2026-10-24', by: 'opus', scope: 'x', fingerprint: 'abc' } }))).toBeNull();
  });
  it('mixed takes the highest', () => {
    expect(highest(['tier-0', 'tier-2', 'tier-1'])).toBe('tier-2');
  });
});

describe('gate', () => {
  it('passes a matching stamp, a carry, or a draft already on the base list; fails the rest', () => {
    const fp = 'f'.repeat(16);
    expect(gateCard({ id: 'c', checked: { fingerprint: fp, by: 'opus', date: 'd' } }, fp, []).ok).toBe(true);
    expect(gateCard({ id: 'c', checked: { fingerprint: fp, carried: 'why' } }, fp, []).note).toMatch(/carried/);
    expect(gateCard({ id: 'c', checked: null }, fp, ['c']).ok).toBe(true);
    expect(gateCard({ id: 'c', checked: { fingerprint: 'a'.repeat(16) } }, fp, []).ok).toBe(false);
    expect(gateCard({ id: 'c', checked: null }, fp, []).ok).toBe(false);
  });
});

describe('stamp editing', () => {
  const src = '---\nid: c\nchecked: { date: 2026-10-21, by: owner, scope: owner review }\nrelated:\n  tools: []\n---\nbody\n';
  it('replaces the checked line and leaves the rest', () => {
    const out = setCheckedLine(src, { date: '2026-10-24', by: 'opus', scope: 'doses, numbers', fingerprint: '0123456789abcdef', carried: '2026-10-24: reworded' });
    expect(out).toContain('checked: { date: 2026-10-24, by: opus, scope: "doses, numbers", fingerprint: "0123456789abcdef", carried: "2026-10-24: reworded" }');
    expect(out.replace(/checked:.*\n/, '')).toBe(src.replace(/checked:.*\n/, ''));
  });
  it('adds the line before related when there is none', () => {
    expect(setCheckedLine('---\nid: c\nrelated:\n  tools: []\n---\nb\n', { date: '2026-10-24', by: 'opus', scope: 's', fingerprint: 'a'.repeat(16) })).toMatch(/id: c\nchecked: .*\nrelated:/);
  });
  it('replaces a dose verification block', () => {
    const y = 'drug_name: X\nsources: [s]\nverification:\n  source: s\n  read: not-verified\n  date: 2026-10-01\n';
    expect(setVerification(y, { source: 's', read: 'full-text', date: '2026-10-24' })).toBe('drug_name: X\nsources: [s]\nverification:\n  source: s\n  read: full-text\n  date: 2026-10-24\n');
  });
});

describe('real content', () => {
  it('every stamped card matches its fingerprint', () => {
    const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
    expect(checkFingerprints(loadContent(root, { includeExamples: true, tag: false }))).toEqual([]);
  });
});

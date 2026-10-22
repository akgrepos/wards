import { describe, expect, it } from 'vitest';
import { loadContent } from '../../scripts/content/load.mjs';
import { checkCoverage } from '../../scripts/content/coverage.mjs';
import { byClass, closestDrugs, drugsCovering, togglePick } from '../coverage';
import type { CoverageGrid } from '../content/types';

const real = loadContent(process.cwd(), { includeExamples: true }) as never as Parameters<typeof checkCoverage>[2] & { data: { coverage: Record<string, CoverageGrid> } };
const grid = real.data.coverage['empiric-antimicrobials'];

// A small grid so the expected answers can be read off by eye.
const small: CoverageGrid = {
  title: 't', sources: [],
  levels: { R: { word: 'Reliable', meaning: 'a' }, V: { word: 'Variable', meaning: 'b' }, N: { word: 'None', meaning: 'c' } },
  columns: [{ id: 'a', name: 'A', short: 'A' }, { id: 'b', name: 'B', short: 'B' }, { id: 'c', name: 'C', short: 'C' }],
  rows: [
    { drug: 'One', class: 'X', cells: { a: 'R', b: 'R', c: 'N' }, note: 'n', sources: [] },
    { drug: 'Two', class: 'Y', cells: { a: 'R', b: 'V', c: 'R' }, note: 'n', sources: [] },
    { drug: 'Three', class: 'X', cells: { a: 'N', b: 'R', c: 'R' }, note: 'n', sources: [] },
  ],
};
const names = (rs: { drug: string }[]) => rs.map((r) => r.drug);

describe('coverage filtering', () => {
  it('lists only drugs that cover every picked organism (reliable only)', () => {
    expect(names(drugsCovering(small, ['a'], 'reliable'))).toEqual(['One', 'Two']);
    expect(names(drugsCovering(small, ['a', 'b'], 'reliable'))).toEqual(['One']);
    expect(names(drugsCovering(small, ['a', 'b', 'c'], 'reliable'))).toEqual([]);
  });
  it('counts variable as covered only when asked', () => {
    expect(names(drugsCovering(small, ['b', 'c'], 'reliable'))).toEqual(['Three']);
    expect(names(drugsCovering(small, ['b', 'c'], 'reliable-or-variable'))).toEqual(['Two', 'Three']);
  });
  it('lists nothing when nothing is picked', () => {
    expect(drugsCovering(small, [], 'reliable')).toEqual([]);
  });
  it('offers the closest drugs when none covers everything, most covered first', () => {
    const c = closestDrugs(small, ['a', 'b', 'c'], 'reliable');
    expect(c.map((x) => [x.row.drug, x.count])).toEqual([['One', 2], ['Two', 2], ['Three', 2]]);
    expect(closestDrugs(small, ['a', 'c'], 'reliable').map((x) => x.row.drug)).toEqual(['One', 'Three']);
  });
  it('groups by class in order of first appearance', () => {
    expect(byClass(small.rows).map((g) => [g.name, names(g.rows)])).toEqual([['X', ['One', 'Three']], ['Y', ['Two']]]);
  });
  it('allows at most three picks', () => {
    expect(togglePick(['a', 'b', 'c'], 'd')).toEqual(['a', 'b', 'c']);
    expect(togglePick(['a', 'b'], 'c')).toEqual(['a', 'b', 'c']);
    expect(togglePick(['a', 'b'], 'a')).toEqual(['b']);
  });
  it('answers a real bedside question: reliable for Pseudomonas and anaerobes', () => {
    expect(names(drugsCovering(grid, ['pseudomonas', 'anaerobes'], 'reliable'))).toEqual(['Piperacillin-tazobactam', 'Meropenem']);
  });
});

describe('coverage data', () => {
  it('the Empiric Antimicrobials grid matches the schema', () => {
    expect(checkCoverage('empiric-antimicrobials', grid, real)).toEqual([]);
  });
  it('rejects a missing cell, an unknown level, an unknown source and a source left out of the top-level list', () => {
    const bad = JSON.parse(JSON.stringify(grid));
    delete bad.rows[0].cells.vre;
    bad.rows[1].cells.mrsa = 'X';
    bad.rows[2].sources = ['no-such-source'];
    bad.sources = bad.sources.filter((s: string) => s !== 'idsa-mrsa-2011');
    const e = checkCoverage('x', bad, real).join('\n');
    expect(e).toMatch(/no cell for "vre"/);
    expect(e).toMatch(/"mrsa": a cell is R, V or N/);
    expect(e).toMatch(/unknown source "no-such-source"/);
    expect(e).toMatch(/idsa-mrsa-2011" is missing from the top-level/);
  });
});

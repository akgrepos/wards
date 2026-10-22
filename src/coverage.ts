import type { CoverageGrid, CoverageLevel, CoverageRow } from './content/types';

// The most organism groups that can be picked at once (more would leave almost no drug that covers them all).
export const MAX_ORGANISMS = 3;

// Which cells count as covered: reliable only, or reliable and variable (a variable cell depends on the isolate's
// susceptibility, local resistance or dose, and is stated in the legend).
export type CoverageMode = 'reliable' | 'reliable-or-variable';
export const covers = (level: CoverageLevel, mode: CoverageMode) => (mode === 'reliable' ? level === 'R' : level !== 'N');

// Drugs that cover every picked organism group, in the grid's order. Nothing picked: nothing listed.
export function drugsCovering(grid: CoverageGrid, picked: string[], mode: CoverageMode): CoverageRow[] {
  if (!picked.length) return [];
  return grid.rows.filter((r) => picked.every((id) => covers(r.cells[id], mode)));
}

// When no drug covers every pick: the ones that cover most of them (at least one), best first, ties in the grid's order.
export function closestDrugs(grid: CoverageGrid, picked: string[], mode: CoverageMode, limit = 6): { row: CoverageRow; count: number }[] {
  return grid.rows
    .map((row, i) => ({ row, i, count: picked.filter((id) => covers(row.cells[id], mode)).length }))
    .filter((x) => x.count > 0 && x.count < picked.length)
    .sort((a, b) => b.count - a.count || a.i - b.i)
    .slice(0, limit)
    .map(({ row, count }) => ({ row, count }));
}

// Rows grouped by class, classes in the order they first appear.
export function byClass(rows: CoverageRow[]): { name: string; rows: CoverageRow[] }[] {
  const out: { name: string; rows: CoverageRow[] }[] = [];
  for (const r of rows) {
    const g = out.find((x) => x.name === r.class);
    if (g) g.rows.push(r); else out.push({ name: r.class, rows: [r] });
  }
  return out;
}

// A pick toggled on or off; a fourth pick is ignored.
export const togglePick = (picked: string[], id: string, max = MAX_ORGANISMS): string[] =>
  picked.includes(id) ? picked.filter((x) => x !== id) : picked.length >= max ? picked : [...picked, id];

export const LEVEL_TO_MARK = { R: 'full', V: 'partial', N: 'none' } as const;

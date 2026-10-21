// The arithmetic of the in-app calculators (docs/DATA-TYPES.md, 7). The items, points, bands and normal ranges are data
// (content/data/calc/*.yaml); only the formulas live here. Nothing is saved.
import type { CalcBand, CalcBandSet, CalcResultDef } from './content/types';

export const totalPoints = (points: number[], checked: boolean[]) => points.reduce((sum, p, i) => sum + (checked[i] ? p : 0), 0);

/** The band holding a total (bands have inclusive `from` and `to`; a missing end is open). */
export const bandFor = (set: CalcBandSet, total: number): CalcBand | undefined =>
  set.bands.find((b) => (b.from === undefined || total >= b.from) && (b.to === undefined || total <= b.to));

type Values = Record<string, number>;
const FORMULAS: Record<string, (v: Values) => number> = {
  // Calculated osmolality: 2 × Na + glucose/18 + BUN/2.8 (mEq/L and mg/dL).
  osmolality: (v) => 2 * v.na + v.glucose / 18 + v.bun / 2.8,
  // Effective (tonic) osmolality leaves out BUN, which crosses cell membranes.
  'effective-osmolality': (v) => 2 * v.na + v.glucose / 18,
  'anion-gap': (v) => v.na - (v.cl + v.hco3),
  // Figge: 2.5 mEq/L per 1 g/dL that albumin is below 4.0 g/dL.
  'albumin-corrected-anion-gap': (v) => v.na - (v.cl + v.hco3) + 2.5 * (4 - v.albumin),
  // Katz: sodium falls 1.6 mEq/L for each 100 mg/dL of glucose above 100; nothing is subtracted below 100.
  'corrected-sodium': (v) => v.na + (1.6 * Math.max(0, v.glucose - 100)) / 100,
};

/** One result of a formula calculator, or null while an input it needs is empty. */
export function computeResult(r: CalcResultDef, values: Record<string, number | null>): string | null {
  const v: Values = {};
  for (const id of r.needs) {
    const x = values[id];
    if (x === null || x === undefined || !Number.isFinite(x)) return null;
    v[id] = x;
  }
  // Round half away from zero at the stated decimals, avoiding binary rounding surprises (e.g. 12.45).
  const f = 10 ** r.decimals;
  const n = FORMULAS[r.fn](v);
  return (Math.sign(n) * Math.round(Math.abs(n) * f + 1e-9) / f).toFixed(r.decimals);
}

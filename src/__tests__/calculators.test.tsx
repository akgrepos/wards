import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { computeResult } from '../calculators';
import { content } from '../content';
import type { Calc, CalcResultDef } from '../content/types';
import { CalculatorSheet } from '../ui/Calculator';

const calc = (id: string) => content.data.calc![id] as Calc;
const result = (id: string, fn: string, values: Record<string, number | null>) =>
  computeResult(calc(id).calculator!.results!.find((r: CalcResultDef) => r.fn === fn)!, values);

describe('formula calculators', () => {
  it('serum osmolality: 2 Na + glucose/18 + BUN/2.8', () => {
    expect(result('serum-osmolality', 'osmolality', { na: 140, glucose: 90, bun: 14 })).toBe('290');
    expect(result('serum-osmolality', 'effective-osmolality', { na: 130, glucose: 600 })).toBe('293');
    expect(result('serum-osmolality', 'osmolality', { na: 140, glucose: null, bun: 14 })).toBeNull();
  });
  it('anion gap, with and without the albumin correction', () => {
    expect(result('anion-gap', 'anion-gap', { na: 140, cl: 104, hco3: 24 })).toBe('12');
    expect(result('anion-gap', 'albumin-corrected-anion-gap', { na: 140, cl: 104, hco3: 24, albumin: 2 })).toBe('17');
    expect(result('anion-gap', 'albumin-corrected-anion-gap', { na: 140, cl: 104, hco3: 24, albumin: null })).toBeNull();
    expect(result('anion-gap', 'anion-gap', { na: 120, cl: 100, hco3: 25 })).toBe('-5');
  });
  it("Winter's formula: expected PaCO2 = 1.5 x HCO3 + 8", () => {
    expect(result('winters-formula', 'winters-expected-pco2', { hco3: 8 })).toBe('20');
    expect(result('winters-formula', 'winters-expected-pco2', { hco3: 15 })).toBe('31');
  });
  it('corrected sodium: 1.6 per 100 mg/dL of glucose above 100, never downward', () => {
    expect(result('corrected-sodium', 'corrected-sodium', { na: 130, glucose: 600 })).toBe('138.0');
    expect(result('corrected-sodium', 'corrected-sodium', { na: 130, glucose: 100 })).toBe('130.0');
    expect(result('corrected-sodium', 'corrected-sodium', { na: 130, glucose: 50 })).toBe('130.0');
    expect(result('corrected-sodium', 'corrected-sodium', { na: 128, glucose: 450 })).toBe('133.6');
  });
});

describe('calculator sheet', () => {
  afterEach(cleanup);
  it('shows a formula result while typing', () => {
    render(<CalculatorSheet id="corrected-sodium" />);
    fireEvent.change(screen.getByLabelText(/Measured sodium/), { target: { value: '130' } });
    fireEvent.change(screen.getByLabelText(/Glucose/), { target: { value: '600' } });
    expect(screen.getByText('138.0 mEq/L')).toBeTruthy();
  });
});

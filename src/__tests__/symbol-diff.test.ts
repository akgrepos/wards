import { describe, expect, it } from 'vitest';
import { compareLines } from '../../scripts/symbol-diff.mjs';

describe('table symbol comparison', () => {
  it('accepts word → symbol swaps', () => {
    expect(compareLines('| Ferritin | Low | Normal or high |', '| Ferritin | ↓ | = or ↑ |')).toEqual([]);
    expect(compareLines('| Weight | Below 100 ng/mL |', '| Weight | <100 ng/mL |')).toEqual([]);
    expect(compareLines('| BMI of 40 or more |', '| BMI ≥40 |')).toEqual([]);
  });
  it('accepts a symbol moved behind its noun', () => {
    expect(compareLines('| High PaCO₂ |', '| PaCO₂ ↑ |')).toEqual([]);
  });
  it('flags a changed number, a dropped word or a wrong symbol', () => {
    expect(compareLines('| Ferritin | Low |', '| Ferritin | ↑ |').length).toBeGreaterThan(0);
    expect(compareLines('| Below 100 ng/mL |', '| <10 ng/mL |').length).toBeGreaterThan(0);
    expect(compareLines('| Low-risk patients |', '| Low-risk |').length).toBeGreaterThan(0);
  });
});

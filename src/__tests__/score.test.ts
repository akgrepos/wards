import { describe, expect, it } from 'vitest';
import { content } from '../content';
import { scoreResult } from '../ui/Calculator';
import type { Calc } from '../content/types';

const k = (content.data.calc!['4at'] as Calc).calculator!;

describe('score result', () => {
  it('adds points and waits until every item is answered', () => {
    expect(scoreResult(k, { alertness: 1 })).toMatchObject({ total: 4, done: false, text: null });
  });
  it('maps the total to its band', () => {
    expect(scoreResult(k, { alertness: 0, orientation: 0, attention: 0, acute: 0 }).text).toMatch(/unlikely/);
    expect(scoreResult(k, { alertness: 0, orientation: 1, attention: 1, acute: 0 }).text).toMatch(/cognitive impairment/);
    expect(scoreResult(k, { alertness: 1, orientation: 0, attention: 0, acute: 0 })).toMatchObject({ total: 4 });
  });
  it('applies a yes/no rule', () => {
    const rule = { ...k, bands: undefined, rule: { all: ['alertness', 'orientation'], any: ['attention', 'acute'], yes: 'yes', no: 'no' } };
    expect(scoreResult(rule, { alertness: 1, orientation: 2, attention: 0, acute: 1 }).text).toBe('yes');
    expect(scoreResult(rule, { alertness: 1, orientation: 2, attention: 0, acute: 0 }).text).toBe('no');
  });
});

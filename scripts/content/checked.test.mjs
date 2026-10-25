import { describe, expect, it } from 'vitest';
import { unsettledDoses } from './checked.mjs';

const doses = {
  a: { verification: { read: 'not-verified' } },
  b: { verification: { read: 'fda-label' } },
  c: { verification: { read: 'not-verified' } },
};

describe('unsettledDoses', () => {
  it('lists doses that are still not-verified and not settled by this stamp', () => {
    expect(unsettledDoses(doses, [], [])).toEqual(['a', 'c']);
  });
  it('accepts a real --read state or a dose named as left open', () => {
    expect(unsettledDoses(doses, ['a=fda-label@label-x'], ['c'])).toEqual([]);
  });
  it('does not accept --read with not-verified as a way around the rule', () => {
    expect(unsettledDoses(doses, ['a=not-verified'], [])).toEqual(['a', 'c']);
  });
});

import { describe, expect, it } from 'vitest';
import { checkNumericAliases } from './aliases.mjs';

describe('checkNumericAliases', () => {
  it('warns on an alias that is only digits, and not on one with words', () => {
    const warnings = checkNumericAliases({ cards: [{ file: 'a.md', aliases: ['988', 'suicide hotline 988'] }] });
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('"988"');
  });
});

import { describe, it, expect } from 'vitest';
import { versionFromDates } from './version.mjs';

describe('versionFromDates', () => {
  it('uses the newest date and counts that day\'s commits', () => {
    expect(versionFromDates(['2026-10-24', '2026-10-24', '2026-10-23'])).toBe('2026.10.24.2');
    expect(versionFromDates(['2026-10-25', '2026-10-24'])).toBe('2026.10.25.1');
  });
  it('returns null with no history', () => expect(versionFromDates([])).toBeNull());
});

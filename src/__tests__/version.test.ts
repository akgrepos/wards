import { describe, expect, it } from 'vitest';
import { APP_VERSION } from '../version';

describe('version', () => {
  it('is date-based (YYYY.MM.DD.N), stamped by the build', () => {
    expect(APP_VERSION).toMatch(/^\d{4}\.\d{2}\.\d{2}\.\d+$/);
  });
});

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { APP_VERSION } from '../version';

describe('version', () => {
  it('is date-based (YYYY.MM.DD, optionally .2, .3 …)', () => {
    expect(APP_VERSION).toMatch(/^\d{4}\.\d{2}\.\d{2}(\.\d+)?$/);
  });

  it('matches the newest entry in CHANGELOG.md', () => {
    const changelog = readFileSync('CHANGELOG.md', 'utf8');
    const newest = changelog.match(/^## (\S+)/m)?.[1];
    expect(newest).toBe(APP_VERSION);
  });
});

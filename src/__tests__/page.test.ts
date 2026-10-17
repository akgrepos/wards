import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const html = readFileSync('index.html', 'utf8');

describe('index.html', () => {
  it('stays hidden from search engines', () => {
    expect(html).toContain('<meta name="robots" content="noindex, nofollow" />');
  });

  it('only runs the app’s own scripts', () => {
    expect(html).toMatch(/Content-Security-Policy[^>]*script-src 'self';/);
    expect(html).not.toMatch(/<script>(?!<\/script>)/);
  });
});

import { describe, it, expect } from 'vitest';
import { render, splice } from './changelog.mjs';

describe('changelog', () => {
  it('lists merged PRs after the cutoff, newest first, by day', () => {
    const prs = [
      { number: 1, title: 'Old', mergedAt: '2026-10-20T10:00:00Z' },
      { number: 3, title: 'Second', mergedAt: '2026-10-26T10:00:00Z' },
      { number: 2, title: 'First ', mergedAt: '2026-10-25T10:00:00Z' },
    ];
    expect(render(prs, '2026-10-24T20:00:00Z')).toBe('\n## 2026.10.26\n\n- Second (#3)\n\n## 2026.10.25\n\n- First (#2)');
  });
  it('replaces only the part between the markers', () => {
    expect(splice('a\n<!-- auto:start -->old\n<!-- auto:end -->\nb', 'NEW')).toBe('a\n<!-- auto:start -->NEW\n<!-- auto:end -->\nb');
  });
});

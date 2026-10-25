import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addMiss, addRecent, addSearch, clearMisses, clearRecent, clearSearches, getMisses, getRecent, getSearches, missesThisWeek, pagesOpenedThisWeek, RECENT_MAX, SEARCHES_MAX, WEEK_MS } from '../storage';
import { updateFailed } from '../UpdatePrompt';

vi.mock('virtual:pwa-register/react', () => ({ useRegisterSW: () => ({ needRefresh: [false], updateServiceWorker: () => {} }) }));

beforeEach(() => { localStorage.clear(); clearRecent(); clearSearches(); clearMisses(); });

describe('stored lists (on this phone only)', () => {
  it('forgets the Favorites list an earlier version saved', async () => {
    localStorage.setItem('wards:favorites', JSON.stringify(['a']));
    vi.resetModules();
    await import('../storage');
    expect(localStorage.getItem('wards:favorites')).toBeNull();
  });

  it('Recent keeps the last 30, newest first, each once', () => {
    for (let i = 1; i <= 33; i++) addRecent(`card-${i}`, i);
    addRecent('card-5', 100);
    expect(RECENT_MAX).toBe(30);
    expect(getRecent().slice(0, 3).map((r) => r.id)).toEqual(['card-5', 'card-33', 'card-32']);
    expect(getRecent()).toHaveLength(RECENT_MAX);
    expect(getRecent().map((r) => r.id)).not.toContain('card-3');
  });

  it('counts the different pages opened in the last seven days', () => {
    const now = 10 * WEEK_MS;
    addRecent('old', now - WEEK_MS - 1);
    addRecent('a', now - 3 * 24 * 3600 * 1000);
    addRecent('b', now - 1000);
    addRecent('a', now - 500);
    addRecent('gone', now - 100);
    expect(pagesOpenedThisWeek(now)).toBe(3);
    expect(pagesOpenedThisWeek(now, (id) => id !== 'gone')).toBe(2);
    expect(pagesOpenedThisWeek(now + WEEK_MS)).toBe(0);
  });

  it('counts searches with no result in the last seven days, keeping only the time', () => {
    const now = 10 * WEEK_MS;
    addMiss(now - WEEK_MS - 5);
    addMiss(now - 2000);
    addMiss(now - 1000);
    expect(missesThisWeek(now)).toBe(2);
    addMiss(now);
    expect(getMisses().every((t) => typeof t === 'number')).toBe(true);
    expect(getMisses()).toHaveLength(3); // the old one was dropped when this was added
    expect(missesThisWeek(now + WEEK_MS + 1)).toBe(0);
    clearMisses();
    expect(missesThisWeek(now)).toBe(0);
  });

  it('Recent Searches keeps the last ten typed, newest first, each once', () => {
    for (let i = 1; i <= 12; i++) addSearch(`query ${i}`);
    addSearch('Query 5');
    expect(getSearches()).toHaveLength(SEARCHES_MAX);
    expect(getSearches().slice(0, 3)).toEqual(['Query 5', 'query 12', 'query 11']);
    addSearch('a');
    addSearch('  ');
    expect(getSearches()).not.toContain('a');
    clearSearches();
    expect(getSearches()).toEqual([]);
  });

  it('ignores damaged saved data', () => {
    localStorage.setItem('wards:recent', '{not json');
    expect(getRecent()).toEqual([]);
    addRecent('x', 1);
    expect(getRecent().map((r) => r.id)).toEqual(['x']);
  });

  it('keeps working when the phone refuses storage (private browsing)', () => {
    const set = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('QuotaExceeded'); });
    const get = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('SecurityError'); });
    expect(() => addRecent('a', 1)).not.toThrow();
    set.mockRestore();
    get.mockRestore();
  });
});

describe('update banner', () => {
  it('reports a failed update only right after a try, while the update still waits', () => {
    expect(updateFailed(true, null, 1000)).toBe(false);
    expect(updateFailed(true, 1000, 5000)).toBe(true);
    expect(updateFailed(false, 1000, 5000)).toBe(false);
    expect(updateFailed(true, 1000, 1000 + 2 * 60 * 1000)).toBe(false);
  });
});

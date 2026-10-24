import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addRecent, clearRecent, getRecent, RECENT_MAX } from '../storage';
import { updateFailed } from '../UpdatePrompt';

vi.mock('virtual:pwa-register/react', () => ({ useRegisterSW: () => ({ needRefresh: [false], updateServiceWorker: () => {} }) }));

beforeEach(() => { localStorage.clear(); clearRecent(); });

describe('stored lists (on this phone only)', () => {
  it('forgets the Favorites list an earlier version saved', async () => {
    localStorage.setItem('wards:favorites', JSON.stringify(['a']));
    vi.resetModules();
    await import('../storage');
    expect(localStorage.getItem('wards:favorites')).toBeNull();
  });

  it('Recent keeps the last five, newest first, each once', () => {
    for (let i = 1; i <= 7; i++) addRecent(`card-${i}`, i);
    addRecent('card-5', 100);
    expect(getRecent().map((r) => r.id)).toEqual(['card-5', 'card-7', 'card-6', 'card-4', 'card-3']);
    expect(getRecent()).toHaveLength(RECENT_MAX);
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

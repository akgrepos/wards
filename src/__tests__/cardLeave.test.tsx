import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// The offline/update service worker doesn't exist in tests; pretend no update is waiting.
vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: () => ({ needRefresh: [false, () => {}], offlineReady: [false, () => {}], updateServiceWorker: () => {} }),
}));

window.matchMedia ??= ((query: string) => ({ matches: false, media: query, addEventListener: () => {}, removeEventListener: () => {} })) as unknown as typeof window.matchMedia;
window.IntersectionObserver ??= class { observe() {} disconnect() {} unobserve() {} takeRecords() { return []; } root = null; rootMargin = ''; thresholds = []; } as unknown as typeof IntersectionObserver;
window.scrollTo = () => {};
Element.prototype.scrollIntoView ??= () => {};

const { App } = await import('../App');
const { resetRouterForTests } = await import('../router');
const { clearRecent } = await import('../storage');

const wait = (ms: number) => act(() => new Promise((r) => setTimeout(r, ms)));

beforeEach(() => { localStorage.clear(); clearRecent(); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('leaving a card that is still scrolling to a section', () => {
  it('stops looking for the section once the page is gone', async () => {
    cleanup();
    resetRouterForTests();
    history.replaceState(null, '', '#/card/renal-aki/diagnosis');
    render(<App />);
    // Nothing is laid out in tests, so the scroll keeps waiting for its section.
    await wait(20);
    cleanup();
    const lookups = vi.spyOn(document, 'getElementById');
    await wait(1500);
    expect(lookups).not.toHaveBeenCalled();
  });
});

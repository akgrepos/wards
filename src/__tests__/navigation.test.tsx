import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
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
const { parseRoute, reopenLastPage, resetRouterForTests, REOPEN_WITHIN_MS } = await import('../router');
const { clearReading, clearRecent, setRapidShortcuts } = await import('../storage');

// Start each test as a fresh launch at the given address.
function launch(hash: string) {
  cleanup();
  resetRouterForTests();
  history.replaceState(null, '', hash || location.pathname);
}
const tick = () => act(() => new Promise((r) => setTimeout(r, 20)));
const go = async (hash: string) => { await act(async () => { location.hash = hash; }); await tick(); };
const back = () => screen.getAllByRole('button', { name: /^Back to/ })[0];

beforeEach(() => { localStorage.clear(); clearRecent(); clearReading(); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('addresses', () => {
  it('reads every page’s address', () => {
    expect(parseRoute('')).toEqual({ name: 'home' });
    expect(parseRoute('#/')).toEqual({ name: 'home' });
    expect(parseRoute('#/topics')).toEqual({ name: 'topics' });
    expect(parseRoute('#/card/renal-aki/when-to-call')).toEqual({ name: 'card', id: 'renal-aki', section: 'escalation' });
    expect(parseRoute('#/emergencies')).toEqual({ name: 'emergencies' });
    expect(parseRoute('#/library')).toEqual({ name: 'library' });
    expect(parseRoute('#/library/pathways')).toEqual({ name: 'library-list', id: 'pathways' });
    expect(parseRoute('#/search')).toEqual({ name: 'search' });
    expect(parseRoute('#/system/renal')).toEqual({ name: 'system', id: 'renal' });
    expect(parseRoute('#/card/renal-aki')).toEqual({ name: 'card', id: 'renal-aki', section: undefined });
    expect(parseRoute('#/card/renal-aki/diagnosis')).toEqual({ name: 'card', id: 'renal-aki', section: 'diagnosis' });
    expect(parseRoute('#/nonsense/page')).toEqual({ name: 'not-found' });
  });
});

describe('reopening the last page', () => {
  const save = (hash: string, ageMs: number) => localStorage.setItem('wards:last', JSON.stringify({ hash, y: 0, t: Date.now() - ageMs }));

  it('reopens a card open in the last 30 minutes', () => {
    launch('');
    save('#/card/renal-aki', 5 * 60 * 1000);
    reopenLastPage();
    expect(location.hash).toBe('#/card/renal-aki');
  });

  it('starts on Home after 30 minutes', () => {
    launch('');
    save('#/card/renal-aki', REOPEN_WITHIN_MS + 1000);
    reopenLastPage();
    expect(location.hash).toBe('');
  });

  it('starts on Home if the card no longer exists', () => {
    launch('');
    save('#/card/renamed-card', 1000);
    reopenLastPage();
    expect(location.hash).toBe('');
  });

  it('starts on Home when the saved page is from an older version without a time', () => {
    launch('');
    localStorage.setItem('wards:last', JSON.stringify({ hash: '#/card/renal-aki', y: 0 }));
    reopenLastPage();
    expect(location.hash).toBe('');
  });

  it('never dead-ends: Back from a reopened card goes up to its system, then Topics', async () => {
    launch('');
    save('#/card/renal-aki', 1000);
    reopenLastPage();
    const historyBack = vi.spyOn(history, 'back');
    render(<App />);
    expect(back().getAttribute('aria-label')).toBe('Back to Kidney, Electrolytes and Urology');
    await act(async () => { fireEvent.click(back()); });
    expect(location.hash).toBe('#/system/renal');
    expect(back().getAttribute('aria-label')).toBe('Back to Topics');
    await act(async () => { fireEvent.click(back()); });
    expect(location.hash).toBe('#/topics');
    expect(screen.getAllByText('Systems').length).toBeGreaterThan(0);
    expect(historyBack).not.toHaveBeenCalled();
  });
});

describe('Back', () => {
  it('after a link from one card to another, is named for the card it returns to', async () => {
    launch('#/');
    render(<App />);
    await go('#/card/renal-aki');
    await go('#/card/renal-hyperkalemia');
    expect(back().getAttribute('aria-label')).toBe('Back to Acute Kidney Injury');
    const historyBack = vi.spyOn(history, 'back').mockImplementation(() => {});
    fireEvent.click(back());
    expect(historyBack).toHaveBeenCalledOnce();
  });

  it('from a card opened on Home is named for Home', async () => {
    launch('#/');
    render(<App />);
    await go('#/card/renal-aki');
    expect(back().getAttribute('aria-label')).toBe('Back to Reference');
  });
});

describe('tabs', () => {
  it('show each tab’s first page', async () => {
    launch('#/');
    render(<App />);
    expect(screen.getAllByText('Reference').length).toBeGreaterThan(0);
    await act(async () => { fireEvent.click(screen.getByRole('tab', { name: 'Topics' })); });
    expect(location.hash).toBe('#/topics');
    expect(screen.getAllByText('Kidney, Electrolytes and Urology').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Coming Soon').length).toBeGreaterThan(0);
    await act(async () => { fireEvent.click(screen.getByRole('tab', { name: 'Library' })); });
    expect(screen.getByText('Medscape Drug Interaction Checker')).toBeTruthy();
    await act(async () => { fireEvent.click(screen.getByRole('tab', { name: 'Rapids' })); });
    expect(screen.getByText('Calcium, insulin-dextrose, remove K⁺')).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Rapids' }).getAttribute('aria-selected')).toBe('true');
  });

  it('Topics shows all systems on request', async () => {
    launch('#/topics');
    render(<App />);
    const before = screen.getAllByText('Coming Soon').length;
    fireEvent.click(screen.getByText(/^Show All \d+ Systems$/));
    expect(screen.getAllByText('Coming Soon').length).toBeGreaterThan(before);
  });

  it('hides empty Library lists, and removed pages fall back to the Library', () => {
    launch('#/library/criteria');
    render(<App />);
    expect(screen.getByText('Medscape Drug Interaction Checker')).toBeTruthy();
    expect(screen.queryByText('Medications')).toBeNull();
    expect(screen.queryByText('Criteria and Staging')).toBeNull();
    expect(screen.queryByText('Scores and Calculators')).toBeNull();
  });
});

describe('Page Not Found', () => {
  it('has a way home', async () => {
    launch('#/card/does-not-exist');
    render(<App />);
    expect(screen.getAllByText('Page Not Found').length).toBeGreaterThan(0);
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Go to Home' })); });
    expect(location.hash).toBe('#/');
    expect(screen.getAllByText('Reference').length).toBeGreaterThan(0);
  });
});

describe('search', () => {
  it('finds a card by an alias and Close returns to the previous screen', async () => {
    launch('#/topics');
    render(<App />);
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Search' })); });
    await tick();
    expect(location.hash).toBe('#/search');
    fireEvent.change(screen.getByPlaceholderText('Search Wards'), { target: { value: 'hyperK' } });
    expect(screen.getAllByRole('link').some((a) => a.getAttribute('href') === '#/card/renal-hyperkalemia')).toBe(true);
    const historyBack = vi.spyOn(history, 'back').mockImplementation(() => {});
    fireEvent.click(screen.getByRole('button', { name: 'Close Search' }));
    expect(historyBack).toHaveBeenCalledOnce();
  });

  it('says so when nothing matches', () => {
    launch('#/search');
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText('Search Wards'), { target: { value: 'zzzz' } });
    expect(screen.getByText('No Results')).toBeTruthy();
  });
});

describe('Home lists', () => {
  it('a page opened shows on Home in Recent and Continue Reading; pages have no Favorites star', async () => {
    setRapidShortcuts(['renal-hyperkalemia']);
    launch('#/card/renal-hyperkalemia');
    render(<App />);
    expect(screen.queryByRole('button', { name: /Favorites/ })).toBeNull();
    await act(async () => { fireEvent.click(screen.getByRole('tab', { name: 'Home' })); });
    expect(screen.getAllByText('Hyperkalemia').length).toBe(3); // Continue Reading, Rapids shortcut, Recent
    expect(screen.queryByText('Favorites')).toBeNull();
    expect(screen.getByText('Continue Reading')).toBeTruthy();
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Clear' })); });
    expect(screen.getByText('Nothing Opened Yet')).toBeTruthy();
  });

  it('show empty states on a new phone', () => {
    launch('#/');
    render(<App />);
    expect(screen.queryByText(/Favorites/)).toBeNull();
    expect(screen.getByText('Nothing Opened Yet')).toBeTruthy();
    expect(screen.queryByText('Continue Reading')).toBeNull();
  });
});

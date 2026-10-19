import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { APP_VERSION } from '../version';

// The offline/update service worker doesn't exist in tests; pretend no update is waiting.
vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: () => ({ needRefresh: [false, () => {}], offlineReady: [false, () => {}], updateServiceWorker: () => {} }),
}));

window.matchMedia ??= ((query: string) => ({ matches: false, media: query, addEventListener: () => {}, removeEventListener: () => {} })) as unknown as typeof window.matchMedia;
window.IntersectionObserver ??= class { observe() {} disconnect() {} unobserve() {} takeRecords() { return []; } root = null; rootMargin = ''; thresholds = []; } as unknown as typeof IntersectionObserver;
window.scrollTo = () => {};

const { App } = await import('../App');

describe('App', () => {
  it('home has its sections and the tab bar; Settings shows the version', async () => {
    location.hash = '#/';
    render(<App />);
    expect(screen.getAllByText('Reference').length).toBeGreaterThan(0);
    expect(screen.getByText('Rapids', { selector: '.akg-list__header-title' })).toBeTruthy();
    for (const tab of ['Home', 'Rapids', 'Topics', 'Library']) expect(screen.getByRole('tab', { name: tab })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Search' })).toBeTruthy();
    await act(async () => { location.hash = '#/settings'; });
    await act(() => new Promise((r) => setTimeout(r, 20)));
    expect(screen.getByText(APP_VERSION)).toBeTruthy();
  });

  it('opens a card by its link, with sections, dose rows and All Sources', async () => {
    location.hash = '#/card/example-condition';
    render(<App />);
    expect(screen.getAllByText('Example Condition').length).toBeGreaterThan(0);
    expect(screen.getAllByText('At a Glance').length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /^Exampledrug 10 mg IV once/ })).toBeTruthy();
    expect(screen.getByText('All Sources')).toBeTruthy();
  });

  it('shows Not Found for an unknown card', async () => {
    await act(async () => { location.hash = '#/card/does-not-exist'; });
    render(<App />);
    expect(screen.getAllByText('Page Not Found').length).toBeGreaterThan(0);
  });
});

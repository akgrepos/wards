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
  it('home lists the systems and the version', () => {
    location.hash = '#/';
    render(<App />);
    expect(screen.getAllByText('Wards').length).toBeGreaterThan(0);
    expect(screen.getByText('Cardiology')).toBeTruthy();
    expect(screen.getByText('Library')).toBeTruthy();
    expect(screen.getByText(`Version ${APP_VERSION}`)).toBeTruthy();
  });

  it('opens a card by its link, with sections, inserts and source pills', async () => {
    location.hash = '#/card/example-condition';
    render(<App />);
    expect(screen.getAllByText('Example Condition').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Key Points').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Exampledrug 10 mg IV once').length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /^Source:/ }).length).toBeGreaterThan(0);
    expect(screen.getByText('Sources')).toBeTruthy();
  });

  it('shows Not Found for an unknown card', async () => {
    await act(async () => { location.hash = '#/card/does-not-exist'; });
    render(<App />);
    expect(screen.getAllByText('Page Not Found').length).toBeGreaterThan(0);
  });
});

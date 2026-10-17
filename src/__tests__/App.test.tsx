import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { APP_VERSION } from '../version';

// The offline/update service worker doesn't exist in tests; pretend no update is waiting.
vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: () => ({ needRefresh: [false, () => {}], offlineReady: [false, () => {}], updateServiceWorker: () => {} }),
}));

window.matchMedia ??= ((query: string) => ({
  matches: false,
  media: query,
  addEventListener: () => {},
  removeEventListener: () => {},
})) as unknown as typeof window.matchMedia;

const { App } = await import('../App');

describe('App', () => {
  it('shows the title and the version', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Wards' })).toBeTruthy();
    expect(screen.getByText(`Version ${APP_VERSION}`)).toBeTruthy();
  });
});

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
const { resetRouterForTests } = await import('../router');

function launch(hash: string) {
  cleanup();
  resetRouterForTests();
  history.replaceState(null, '', hash);
  render(<App />);
}
const tap = async (name: RegExp | string) => { await act(async () => { fireEvent.click(screen.getByRole('button', { name })); }); };
const layout = async (name: string) => { await act(async () => { fireEvent.click(screen.getByRole('radio', { name })); }); };
const hasText = (t: string | RegExp) => screen.queryAllByText(t).length > 0;

beforeEach(() => { localStorage.clear(); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('pathway page (test layouts)', () => {
  it('flowchart: answering walks the route to the End; the other answers switch it; Start Over clears it', async () => {
    launch('#/pathway/hyperkalemia-management');
    expect(document.querySelector('.page-title')!.textContent).toBe('Acute Hyperkalemia Management');
    expect(hasText('ECG changes of hyperkalemia?')).toBe(false);
    await tap(/^Confirmed or likely/);
    await tap(/^Yes/);
    expect(hasText('Cardiac membrane stabilization')).toBe(true);
    expect(document.querySelector('.pw-box--caution')).toBeTruthy();
    await tap(/^Severe/);
    expect(hasText('Monitoring and etiology')).toBe(true);
    expect(document.querySelector('.pw-terminal')).toBeTruthy();
    // No list of every treatment at the end (owner, 2026-10-19).
    expect(hasText('Treatments on Your Path')).toBe(false);
    // Another answer to an earlier question replaces the route after it.
    await tap(/^No.*Switch to/);
    expect(hasText('Cardiac membrane stabilization')).toBe(false);
    expect(document.querySelector('.pw-terminal')).toBeNull();
    await act(async () => { fireEvent.click(screen.getAllByRole('button', { name: 'Start Over' })[0]); });
    expect(hasText('ECG changes of hyperkalemia?')).toBe(false);
  });

  it('steps: one step at a time; actions need Continue; Back undoes the last step', async () => {
    launch('#/pathway/hyperkalemia-management');
    await layout('Steps');
    await tap(/^Confirmed or likely/);
    await tap(/^Yes/);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Cardiac membrane stabilization');
    await tap('Continue');
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Severity?');
    await tap('Back');
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Cardiac membrane stabilization');
  });

  it('stages: finished stages fold to one line; answers are kept when switching layouts, and the layout is remembered', async () => {
    launch('#/pathway/hyperkalemia-management');
    await tap(/^Confirmed or likely/);
    await layout('Stages');
    const folded = screen.getByRole('button', { name: /Confirmed or likely.*Change/ });
    expect(folded.getAttribute('aria-expanded')).toBe('false');
    await act(async () => { fireEvent.click(folded); });
    expect(folded.getAttribute('aria-expanded')).toBe('true');
    expect(hasText('Not reached yet')).toBe(true);
    launch('#/pathway/hyperkalemia-management');
    expect(screen.getByRole('radio', { name: 'Stages' }).getAttribute('aria-checked')).toBe('true');
    // Answers aren't kept between visits.
    expect(screen.queryByRole('button', { name: /Confirmed or likely.*Change/ })).toBeNull();
  });

  it('the AKI pathway works too, and the Rapids page links to its pathway', async () => {
    launch('#/pathway/aki-evaluation');
    await tap(/^No; stable elevated SCr/);
    expect(hasText('Not AKI by KDIGO criteria')).toBe(true);
    expect(document.querySelector('.pw-terminal')).toBeTruthy();
    launch('#/emergency/renal-hyperkalemia');
    const row = document.querySelector('.pathway-row a') as HTMLElement;
    expect(row.getAttribute('href')).toBe('#/pathway/hyperkalemia-management');
  });
});

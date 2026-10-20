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
const tap = async (name: RegExp | string) => { await act(async () => { fireEvent.click(screen.getAllByRole('button', { name })[0]); }); };
const layout = async (name: string) => { await act(async () => { fireEvent.click(screen.getByRole('radio', { name })); }); };
const hasText = (t: string | RegExp) => screen.queryAllByText(t).length > 0;

beforeEach(() => { localStorage.clear(); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('pathway page (test layouts)', () => {
  it('opens in I (Stages); answering walks the route to the End; Start Over clears it', async () => {
    launch('#/pathway/hyperkalemia-management');
    expect(document.querySelector('.page-title')!.textContent).toBe('Acute Hyperkalemia Management');
    // The switch shows letters only (owner), with full names for VoiceOver.
    expect(screen.getAllByRole('radio').map((r) => r.textContent)).toEqual(['I', 'K', 'A', 'L']);
    expect(screen.getByRole('radio', { name: 'I, Stages' }).getAttribute('aria-checked')).toBe('true');
    expect(hasText('ECG changes of hyperkalemia?')).toBe(false);
    await tap(/^Confirmed or likely/);
    await tap(/^Yes/);
    expect(hasText(/Cardiac membrane stabilization/)).toBe(true);
    await tap(/^Severe/);
    expect(hasText('Monitoring and etiology')).toBe(true);
    expect(document.querySelector('.pw-end--reached')).toBeTruthy();
    // No list of every treatment at the end (owner, 2026-10-19).
    expect(hasText('Treatments on Your Path')).toBe(false);
    await act(async () => { fireEvent.click(screen.getAllByRole('button', { name: 'Start Over' })[0]); });
    expect(hasText('ECG changes of hyperkalemia?')).toBe(false);
  });

  it('I: finished stages fold to one line; the layout is remembered, answers are not', async () => {
    launch('#/pathway/hyperkalemia-management');
    await tap(/^Confirmed or likely/);
    const folded = screen.getByRole('button', { name: /Confirmed or likely.*Change/ });
    expect(folded.getAttribute('aria-expanded')).toBe('false');
    await act(async () => { fireEvent.click(folded); });
    expect(folded.getAttribute('aria-expanded')).toBe('true');
    expect(hasText('Not reached yet')).toBe(true);
    await layout('K, Choice lists');
    launch('#/pathway/hyperkalemia-management');
    expect(screen.getByRole('radio', { name: 'K, Choice lists' }).getAttribute('aria-checked')).toBe('true');
    expect(hasText('ECG changes of hyperkalemia?')).toBe(false);
  });

  it('K: each question is a list; the chosen answer is checked; tapping another switches the route', async () => {
    launch('#/pathway/hyperkalemia-management');
    await layout('K, Choice lists');
    await tap(/^Confirmed or likely/);
    await tap(/^Yes/);
    expect(document.querySelectorAll('[aria-checked="true"].akg-list-row, .akg-list-row [aria-checked="true"], [aria-checked="true"]').length).toBeGreaterThan(0);
    expect(hasText('Cardiac membrane stabilization')).toBe(true);
    await tap(/^No/);
    expect(hasText('Cardiac membrane stabilization')).toBe(false);
    expect(hasText('Severity?')).toBe(true);
  });

  it('A: one step at a time; actions need Continue; Your Path lists earlier answers; Change goes back', async () => {
    launch('#/pathway/hyperkalemia-management');
    await layout('A, One step at a time');
    const heading = () => document.querySelector('.pw-one__step h2')!.textContent;
    expect(heading()).toBe('True hyperkalemia?');
    await tap(/^Confirmed or likely/);
    expect(heading()).toBe('ECG changes of hyperkalemia?');
    await tap(/^Yes/);
    expect(heading()).toBe('Cardiac membrane stabilization');
    await tap('Continue');
    expect(heading()).toBe('Severity?');
    await tap('Your Path (2)');
    expect(screen.getByRole('dialog').textContent).toContain('Confirmed or likely');
    await tap(/^Confirmed or likely.*True hyperkalemia/);
    expect(heading()).toBe('True hyperkalemia?');
    await tap(/^Confirmed or likely/);
    await tap(/^Yes/);
    await tap('Continue');
    await tap(/^Severe/);
    await tap('Continue');
    await tap('Continue');
    expect(heading()).toBe('Monitoring and etiology');
    expect(document.querySelector('.pw-end--reached')).toBeTruthy();
  });

  it('L: opens full screen over everything; answers at the bottom; Close keeps the place', async () => {
    launch('#/pathway/hyperkalemia-management');
    await layout('L, Full screen');
    expect(screen.queryByRole('dialog')).toBeNull();
    await tap('Start Pathway');
    expect(screen.getByRole('dialog').textContent).toContain('True hyperkalemia?');
    await tap(/^Confirmed or likely/);
    await tap(/^Yes/);
    expect(screen.getByRole('dialog').textContent).toContain('Cardiac membrane stabilization');
    await tap('Continue');
    expect(screen.getByRole('dialog').textContent).toContain('Severity?');
    await tap('Close');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('button', { name: /Continue Pathway/ })).toBeTruthy();
  });

  it('the AKI pathway works too, and the Rapids page links to its pathway', async () => {
    launch('#/pathway/aki-evaluation');
    await tap(/^No; stable elevated SCr/);
    expect(hasText('Not AKI by KDIGO criteria')).toBe(true);
    expect(document.querySelector('.pw-end--reached')).toBeTruthy();
    launch('#/emergency/renal-hyperkalemia');
    const row = document.querySelector('.pathway-row a') as HTMLElement;
    expect(row.getAttribute('href')).toBe('#/pathway/hyperkalemia-management');
  });
});

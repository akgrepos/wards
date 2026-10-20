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
  it('opens in Stages; answering walks the route to the End; Start Over clears it', async () => {
    launch('#/pathway/hyperkalemia-management');
    expect(document.querySelector('.page-title')!.textContent).toBe('Acute Hyperkalemia Management');
    expect(screen.getByRole('radio', { name: 'Stages' }).getAttribute('aria-checked')).toBe('true');
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

  it('stages: finished stages fold to one line; the layout is remembered, answers are not', async () => {
    launch('#/pathway/hyperkalemia-management');
    await tap(/^Confirmed or likely/);
    const folded = screen.getByRole('button', { name: /Confirmed or likely.*Change/ });
    expect(folded.getAttribute('aria-expanded')).toBe('false');
    await act(async () => { fireEvent.click(folded); });
    expect(folded.getAttribute('aria-expanded')).toBe('true');
    expect(hasText('Not reached yet')).toBe(true);
    await layout('Tree');
    launch('#/pathway/hyperkalemia-management');
    expect(screen.getByRole('radio', { name: 'Tree' }).getAttribute('aria-checked')).toBe('true');
    expect(hasText('Your answer:')).toBe(false);
  });

  it('tree: answers stay in place; "Other answer" switches the route; the line ends in End', async () => {
    launch('#/pathway/hyperkalemia-management');
    await layout('Tree');
    await tap(/^Confirmed or likely/);
    await tap(/^Yes/);
    await tap(/^Severe/);
    expect(hasText('Your answer:')).toBe(true);
    expect(document.querySelector('.pw-tree__dot--caution')).toBeTruthy();
    expect(document.querySelector('.pw-tree__node--end:not(.pw-tree__node--ahead)')).toBeTruthy();
    await tap(/^Other answer:\s*No/);
    expect(hasText('Cardiac membrane stabilization')).toBe(false);
    expect(document.querySelector('.pw-tree__node--ahead')).toBeTruthy();
  });

  it('map: the step is in the panel, with any doses since the last answer; the chart switches branches', async () => {
    launch('#/pathway/hyperkalemia-management');
    await layout('Map');
    await tap(/^Confirmed or likely/);
    await tap(/^Yes/);
    const panel = document.querySelector('.pw-panel')!;
    expect(panel.textContent).toContain('Cardiac membrane stabilization');
    expect(panel.textContent).toContain('Severity?');
    expect(panel.querySelector('.dose-rows')).toBeTruthy();
    await tap('Switch to No');
    expect(hasText('Cardiac membrane stabilization')).toBe(false);
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

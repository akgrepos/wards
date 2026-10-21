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
const { forgetPathways } = await import('../screens/PathwayScreen');

function launch(hash: string) {
  cleanup();
  resetRouterForTests();
  history.replaceState(null, '', hash);
  render(<App />);
}
const tap = async (name: RegExp | string) => { await act(async () => { fireEvent.click(screen.getAllByRole('button', { name })[0]); }); };
const answer = (name: RegExp) => screen.getAllByRole('button', { name }).find((b) => b.closest('.pw-answer'))!;
const choose = async (name: RegExp) => { await act(async () => { fireEvent.click(answer(name)); }); };
const box = (title: string) => [...document.querySelectorAll('.pw-box')].find((b) => b.querySelector('h2')?.textContent === title)!;

beforeEach(() => { localStorage.clear(); forgetPathways(); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('pathways (focused, levelled flowcharts)', () => {
  it('a card lists its pathways as rows under the title, not inside a section', () => {
    launch('#/card/renal-aki');
    const row = document.querySelector('.card-head .pathway-row a') as HTMLElement;
    expect(row.getAttribute('href')).toBe('#/pathway/aki-cause-workup');
    expect(row.textContent).toContain('Cause Workup');
    expect(document.querySelectorAll('.akg-content-section .pathway-row').length).toBe(0);
  });

  it('equivalent answers share a level; each leads to its own box with the card\'s dose rows', async () => {
    launch('#/pathway/hyperkalemia-treatment');
    expect(screen.getByRole('group', { name: 'Hyperkalemia: Treatment pathway' })).toBeTruthy();
    for (const t of ['IV calcium', 'Shift K⁺; consider removal', 'Shift K⁺, add albuterol, remove K⁺']) expect(box(t)).toBeTruthy();
    // Doses show as the card's own dose rows.
    expect(box('IV calcium').textContent).toContain('Calcium gluconate 10%');
    // Answers further down wait until their question is on the route.
    expect((answer(/^Severe/) as HTMLButtonElement).disabled).toBe(true);
    await choose(/^Yes/);
    expect(answer(/^Yes/).getAttribute('aria-pressed')).toBe('true');
    expect(box('IV calcium').className).toContain('pw-box--on');
    expect(box('Severity?').className).toContain('pw-box--now');
    await choose(/^Severe/);
    expect(box('Shift K⁺, add albuterol, remove K⁺').className).toContain('pw-box--on');
    // The moderate regimen is ruled out and fades; boxes still ahead stay readable.
    expect(box('Shift K⁺; consider removal').className).toContain('pw-box--off');
    expect(box('Recheck K⁺ and glucose').className).toContain('pw-box--ahead');
  });

  it('branches merge again: mild skips the shift regimens and rejoins at the kidney question', async () => {
    launch('#/pathway/hyperkalemia-treatment');
    await choose(/^Normal ECG/);
    await choose(/^Mild/);
    expect(box('Kidney function and dialysis?').className).toContain('pw-box--now');
  });

  it('dose rows open dose sheets; links open the card; old addresses still work', async () => {
    launch('#/pathway/hyperkalemia');
    await tap(/^Calcium gluconate 10%/);
    expect(screen.getByRole('dialog').textContent).toContain('Calcium gluconate');
    launch('#/pathway/hyperkalemia-treatment');
    await tap(/^Hyperkalemic cardiac arrest/);
    expect(document.querySelector('.card-head h1')!.textContent).toBe('Hyperkalemia');
    launch('#/pathway/aki-evaluation');
    expect(screen.getByRole('group', { name: 'Acute Kidney Injury: Cause Workup pathway' })).toBeTruthy();
  });

  it('answers are kept after leaving and coming back; Start Over clears them', async () => {
    launch('#/pathway/hyperkalemia-treatment');
    await choose(/^Yes/);
    launch('#/pathway/hyperkalemia-treatment');
    expect(answer(/^Yes/).getAttribute('aria-pressed')).toBe('true');
    await tap('Start Over');
    expect(answer(/^Yes/).getAttribute('aria-pressed')).toBe('false');
  });

  it('the Rapids page and the Library link to the pathway', () => {
    launch('#/emergency/renal-hyperkalemia');
    expect((document.querySelector('.pathway-row a') as HTMLElement).getAttribute('href')).toBe('#/pathway/hyperkalemia-treatment');
    launch('#/library/pathways');
    expect(screen.getByText('Hyperkalemia: Treatment')).toBeTruthy();
    expect(screen.getByText('Acute Kidney Injury: Cause Workup')).toBeTruthy();
  });
});

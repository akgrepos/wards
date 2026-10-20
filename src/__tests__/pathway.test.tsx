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

describe('pathways (whole-card maps)', () => {
  it('the card shows its pathway as a row under the title, not inside a section', () => {
    launch('#/card/renal-aki');
    const row = document.querySelector('.card-head .pathway-row a') as HTMLElement;
    expect(row.getAttribute('href')).toBe('#/pathway/aki-evaluation');
    expect(document.querySelectorAll('.akg-content-section .pathway-row').length).toBe(0);
  });

  it('draws every box at once; only questions on the route can be answered; the route fills in', async () => {
    launch('#/pathway/aki-evaluation');
    for (const t of ['Meets KDIGO criteria for AKI?', 'Relieve the obstruction', 'Acute tubular injury (ATN) likely', 'Possible HRS-AKI']) expect(box(t)).toBeTruthy();
    // Answers further down wait until their question is on the route.
    expect((answer(/^Granular casts/) as HTMLButtonElement).disabled).toBe(true);
    await choose(/^Yes$/);
    expect(answer(/^Yes$/).getAttribute('aria-pressed')).toBe('true');
    expect(box('Stage it; start the common orders').className).toContain('pw-box--on');
    expect(box('Urgent RRT indication?').className).toContain('pw-box--now');
    expect(box('Not AKI by KDIGO criteria').className).toContain('pw-box--off');
  });

  it('a detour rejoins the main path', async () => {
    launch('#/pathway/aki-evaluation');
    await choose(/^Yes$/);
    await act(async () => { fireEvent.click(document.querySelectorAll('[data-question="refractory"] .akg-button')[1] as HTMLElement); });
    expect(box('Urinary tract obstruction?').className).toContain('pw-box--now');
    await choose(/^Hydronephrosis/);
    expect(box('Relieve the obstruction').className).toContain('pw-box--on');
    await choose(/^No: other causes too/);
    expect(box('Volume status and hemodynamics?').className).toContain('pw-box--now');
  });

  it('links open dose sheets and the card at a subheading or step; old addresses still work', async () => {
    launch('#/pathway/hyperkalemia-management');
    expect(screen.getByRole('group', { name: 'Hyperkalemia pathway' })).toBeTruthy();
    await tap(/^Calcium gluconate 10%/);
    expect(screen.getByRole('dialog').textContent).toContain('Calcium gluconate');
    launch('#/pathway/hyperkalemia');
    await tap(/^Elimination · Treatment/);
    expect(document.querySelector('.card-head h1')!.textContent).toBe('Hyperkalemia');
    expect(document.getElementById('a-treatment-elimination')).toBeTruthy();
  });

  it('answers are kept after leaving and coming back; Start Over clears them', async () => {
    launch('#/pathway/hyperkalemia');
    await choose(/^Confirmed or likely/);
    launch('#/pathway/hyperkalemia');
    expect(answer(/^Confirmed or likely/).getAttribute('aria-pressed')).toBe('true');
    await tap('Start Over');
    expect(answer(/^Confirmed or likely/).getAttribute('aria-pressed')).toBe('false');
  });

  it('the Rapids page and the Library link to the pathway', () => {
    launch('#/emergency/renal-hyperkalemia');
    expect((document.querySelector('.pathway-row a') as HTMLElement).getAttribute('href')).toBe('#/pathway/hyperkalemia');
    launch('#/library/pathways');
    expect(screen.getByText('AKI Evaluation')).toBeTruthy();
  });
});

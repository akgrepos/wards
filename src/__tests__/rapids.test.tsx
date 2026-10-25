import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
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
const { parseRoute, reopenLastPage, resetRouterForTests, tabFor } = await import('../router');
const { getTimed, setTimed } = await import('../storage');
const timed = await import('../timed');

const HK = 'renal-hyperkalemia';
const T0 = new Date(2026, 9, 19, 14, 30, 0).getTime();
const min = (n: number) => T0 + n * 60000;

function launch(hash: string) {
  cleanup();
  resetRouterForTests();
  history.replaceState(null, '', hash || location.pathname);
}
const tick = () => act(() => new Promise((r) => setTimeout(r, 20)));

beforeEach(() => { localStorage.clear(); setTimed(null); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.useRealTimers(); });

describe('Rapids addresses', () => {
  it('reads the emergency and Timed Mode addresses, both in the Rapids tab', () => {
    expect(parseRoute('#/emergency/renal-hyperkalemia')).toEqual({ name: 'emergency', id: HK });
    expect(parseRoute('#/timed')).toEqual({ name: 'timed' });
    expect(tabFor({ name: 'emergency', id: HK })).toBe('emergencies');
    expect(tabFor({ name: 'timed' })).toBe('emergencies');
  });

  it('the Rapids tab lists the emergency by system with its hint, and opens its page', async () => {
    launch('#/emergencies');
    render(<App />);
    expect(screen.getByText('Nephrology and Urology')).toBeTruthy();
    const row = screen.getByText('Calcium, insulin-dextrose, remove K⁺').closest('a')!;
    expect(row.getAttribute('href')).toBe('#/emergency/renal-hyperkalemia');
  });

  it('a topic without an emergency has no emergency page and no Do Now button', async () => {
    launch('#/emergency/renal-aki');
    render(<App />);
    expect(screen.getByText('Page Not Found')).toBeTruthy();
    launch('#/card/renal-aki');
    render(<App />);
    expect(screen.queryByRole('button', { name: 'Do Now' })).toBeNull();
  });

  it('the topic page’s Do Now button opens the pop-up, which opens the full emergency', async () => {
    launch(`#/card/${HK}`);
    render(<App />);
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Do Now' })); });
    const sheet = screen.getByRole('dialog');
    expect(within(sheet).getByText('Stabilize the myocardium')).toBeTruthy();
    expect(within(sheet).getByRole('button', { name: 'Start Timed Mode' })).toBeTruthy();
    await act(async () => { fireEvent.click(within(sheet).getByRole('button', { name: 'Open Full Emergency' })); });
    await tick();
    expect(location.hash).toBe(`#/emergency/${HK}`);
  });

  it('the emergency page shows the Do Now steps with tappable doses, and the topic pop-up', async () => {
    launch(`#/emergency/${HK}`);
    render(<App />);
    expect(screen.getByText('Rapids', { selector: '.akg-tag, .akg-tag *' })).toBeTruthy();
    expect(screen.getByText('Do Now')).toBeTruthy();
    // One drug per dose row, each opening its dose sheet.
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /^Regular insulin 10 units IV.*Warning: Hypoglycemia/ })); });
    expect(within(screen.getByRole('dialog')).getAllByText('Dose').length).toBeGreaterThan(0);
    // The topic pop-up: At a Glance, then Open Full Topic.
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Topic Summary' })); });
    const sheet = screen.getByRole('dialog');
    expect(within(sheet).getByText('At a Glance')).toBeTruthy();
    await act(async () => { fireEvent.click(within(sheet).getByRole('button', { name: 'Open Full Topic' })); });
    await tick();
    expect(location.hash).toBe(`#/card/${HK}`);
  });
});

describe('Timed Mode, step by step', () => {
  it('works through the doses in order: Mark Given, Skip, the alternative instead, Undo', () => {
    timed.startTimed(HK, T0);
    timed.markGiven(min(1)); // calcium gluconate
    expect(getTimed()!.log).toEqual([{ step: 0, dose: 'calcium-gluconate-hyperkalemia', kind: 'given', t: min(1) }]);
    expect(timed.progress(getTimed()!).current).toEqual({ step: 1, dose: 'insulin-regular-hyperkalemia' });
    timed.markGiven(min(2)); // insulin
    timed.skip(min(3)); // dextrose 50%
    expect(timed.progress(getTimed()!).current).toEqual({ step: 1, dose: 'dextrose-10-infusion-hyperkalemia' });
    timed.undoLast();
    expect(timed.progress(getTimed()!).current).toEqual({ step: 1, dose: 'dextrose-50-hyperkalemia' });
    expect(timed.progress(getTimed()!).stepsDone).toBe(1);
  });

  it('logs the alternative when it was given instead (calcium chloride in arrest)', () => {
    timed.startTimed(HK, T0);
    timed.giveAlternative(min(1));
    const e = getTimed()!.log[0];
    expect(e).toMatchObject({ dose: 'calcium-chloride-hyperkalemia', for: 'calcium-gluconate-hyperkalemia', kind: 'given' });
    expect(timed.progress(getTimed()!).current?.step).toBe(1);
  });

  it('a double tap logs once', () => {
    timed.startTimed(HK, T0);
    timed.markGiven(min(1));
    timed.markGiven(min(1) + 100);
    expect(getTimed()!.log).toHaveLength(1);
  });

  it('shows clock time and elapsed time, and what’s due next from the topic’s recheck times', () => {
    timed.startTimed(HK, T0);
    timed.markGiven(min(2)); // calcium
    timed.markGiven(min(5)); // insulin
    const s = getTimed()!;
    expect(timed.when(s, min(2) + 10000)).toMatch(/\(\+02:10\)$/);
    const due = timed.dueNext(s, min(6));
    expect(due.map((d) => d.text)).toEqual(['Glucose check, 30 min after Regular insulin', 'K⁺ check, 1 h after the first dose']);
    expect(due.map((d) => d.t)).toEqual([min(35), min(62)]);
  });

  it('the summary text has only drugs, doses and times', () => {
    timed.startTimed(HK, T0);
    timed.markGiven(min(2));
    timed.endTimed(min(7));
    const text = timed.summaryText(getTimed()!);
    expect(text).toMatch(/^Hyperkalemia: Timed Mode/);
    expect(text).toMatch(/07:00 total/);
    expect(text).toMatch(/\(\+02:00\) Calcium gluconate 10% 30 mL IV over 10 minutes/);
    expect(text).toMatch(/Due next:\n.*K⁺ check, 1 h after the first dose/);
  });
});

describe('Timed Mode on screen', () => {
  it('starts from the emergency page, full screen without the tab bar', async () => {
    launch(`#/emergency/${HK}`);
    render(<App />);
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Start Timed Mode' })); });
    await tick();
    expect(location.hash).toBe('#/timed');
    expect(screen.queryByRole('tab', { name: 'Home' })).toBeNull();
    expect(screen.getByText(/Step 1 of 4/)).toBeTruthy();
    expect(getTimed()?.card).toBe(HK);
  });

  it('survives the app closing: a relaunch returns to Timed Mode at the same step, with the log', async () => {
    timed.startTimed(HK, Date.now() - 5 * 60000);
    timed.markGiven(Date.now() - 4 * 60000);
    launch('');
    reopenLastPage();
    expect(location.hash).toBe('#/timed');
    render(<App />);
    expect(screen.getByText(/Step 2 of 4/)).toBeTruthy();
    expect(screen.getByText('Log')).toBeTruthy();
    expect(screen.getByText('Calcium gluconate 10% 30 mL IV over 10 minutes')).toBeTruthy();
    // The timer counts from when Timed Mode started, not from the relaunch.
    expect(screen.getByText(/^0[45]:\d\d$/)).toBeTruthy();
  });

  it('Mark Given logs the dose; Minimize keeps the timer in a bar above the tab bar that returns to it', async () => {
    timed.startTimed(HK);
    launch(`#/emergency/${HK}`);
    render(<App />);
    await act(async () => { location.hash = '#/timed'; });
    await tick();
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Mark Given' })); });
    expect(getTimed()!.log).toHaveLength(1);
    expect(screen.getByText(/Step 2 of 4/)).toBeTruthy();
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Minimize Timed Mode' })); });
    await tick();
    expect(location.hash).toBe(`#/emergency/${HK}`);
    expect(screen.getByRole('button', { name: 'Resume Timed Mode' })).toBeTruthy();
    expect(screen.getByText(/Given at .* \(\+00:\d\d\)/)).toBeTruthy();
    const bar = screen.getByRole('button', { name: /Hyperkalemia Timed Mode, elapsed time/ });
    await act(async () => { fireEvent.click(bar); });
    await tick();
    expect(location.hash).toBe('#/timed');
  });

  it('End asks first, then shows the summary until Done, which clears it', async () => {
    timed.startTimed(HK, Date.now() - 60000);
    timed.markGiven(Date.now() - 30000);
    launch(`#/emergency/${HK}`);
    render(<App />);
    await act(async () => { location.hash = '#/timed'; });
    await tick();
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'End Timed Mode' })); });
    expect(screen.getByText('End Timed Mode?')).toBeTruthy();
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Cancel' })); });
    expect(getTimed()!.end).toBeUndefined();
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'End Timed Mode' })); });
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'End' })); });
    await tick();
    expect(getTimed()!.end).toBeTypeOf('number');
    expect(location.hash).toBe(`#/emergency/${HK}`);
    const summary = screen.getByRole('dialog');
    expect(within(summary).getByText('What Was Given')).toBeTruthy();
    expect(within(summary).getByText('Calcium gluconate 10% 30 mL IV over 10 minutes')).toBeTruthy();
    expect(within(summary).getByText('Due Next')).toBeTruthy();
    // No timer bar once ended.
    expect(screen.queryByRole('button', { name: /Timed Mode, elapsed time/ })).toBeNull();
    await act(async () => { fireEvent.click(within(summary).getAllByRole('button', { name: 'Done' }).find((b) => b.classList.contains('akg-button--prominent'))!); });
    expect(getTimed()).toBeNull();
  });

  it('only one Timed Mode at a time', async () => {
    timed.startTimed('some-other-emergency');
    launch(`#/emergency/${HK}`);
    render(<App />);
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Start Timed Mode' })); });
    expect(screen.getByText('Timed Mode Is Running')).toBeTruthy();
    expect(getTimed()!.card).toBe('some-other-emergency');
  });
});

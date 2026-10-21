import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { loadContent } from '../../scripts/content/load.mjs';
import { checkContent } from '../../scripts/content/check.mjs';

vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: () => ({ needRefresh: [false, () => {}], offlineReady: [false, () => {}], updateServiceWorker: () => {} }),
}));
window.matchMedia ??= ((query: string) => ({ matches: false, media: query, addEventListener: () => {}, removeEventListener: () => {} })) as unknown as typeof window.matchMedia;
window.IntersectionObserver ??= class { observe() {} disconnect() {} unobserve() {} takeRecords() { return []; } root = null; rootMargin = ''; thresholds = []; } as unknown as typeof IntersectionObserver;
window.scrollTo = () => {};
Element.prototype.scrollIntoView ??= () => {};

// jsdom has no layout: give every box a phone-column width and 11 px text.
const WIDTH = 340;
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, get() { return WIDTH; } });
  Element.prototype.getBoundingClientRect = function () { return { height: 11, width: 11, top: 0, left: 0, right: 11, bottom: 11, x: 0, y: 0, toJSON() {} } as DOMRect; };
});

const { App } = await import('../App');
const { resetRouterForTests } = await import('../router');
function launch(hash: string) { cleanup(); resetRouterForTests(); history.replaceState(null, '', hash); render(<App />); }
const tick = () => act(() => new Promise((r) => setTimeout(r, 30)));
afterEach(() => cleanup());

const real = loadContent(process.cwd(), { includeExamples: true }) as never as Parameters<typeof checkContent>[0];
function withMedia(id: string, change: (m: Record<string, any>) => void) {
  const base = JSON.parse(JSON.stringify(real));
  change(base.data.media[id]);
  return checkContent(base).join('\n');
}

describe('ECG media items: content checks', () => {
  it('all four figures pass', () => { expect(checkContent(real)).toEqual([]); });
  it('a recording names a dataset source with its license', () => {
    expect(withMedia('ecg-af', (m) => { m.recording.dataset = 'acc-aha-af-2023'; })).toMatch(/not a dataset/);
    expect(withMedia('ecg-af', (m) => { m.recording.dataset = 'nope'; })).toMatch(/unknown dataset/);
  });
  it('keeps 10 seconds at most and the same length in every lead', () => {
    expect(withMedia('ecg-af', (m) => { m.recording.leads.II += ' 1'.repeat(300); })).toMatch(/same number of samples|10 seconds at most/);
  });
  it('a card shows 4 seconds at most, inside the recording, of a lead it has', () => {
    expect(withMedia('ecg-af', (m) => { m.show.to = 6; })).toMatch(/4 seconds at most/);
    expect(withMedia('ecg-af', (m) => { m.show.lead = 'V6'; })).toMatch(/not in the recording/);
  });
  it('marks are a known kind, inside the part shown, with short labels', () => {
    expect(withMedia('ecg-af', (m) => { m.marks[0].from = 9; })).toMatch(/inside the part shown/);
    expect(withMedia('ecg-af', (m) => { m.marks[0].kind = 'arrow'; })).toMatch(/kind must be one of/);
    expect(withMedia('ecg-af', (m) => { m.marks[0].label = 'a label that is far too long to fit'; })).toMatch(/24 characters/);
  });
  it('a drawing needs waves and beats, or a sine', () => {
    expect(withMedia('ecg-hyperkalemia', (m) => { delete m.panels[0].beats; })).toMatch(/beats/);
    expect(withMedia('ecg-hyperkalemia', (m) => { m.panels[3].waves = [[1, 0, 0.01]]; })).toMatch(/either "waves"/);
  });
});

describe('ECG figures on cards', () => {
  it('AF: the strip, its measurements, caption and credit; full screen scrolls and zooms', async () => {
    launch('#/card/cardio-atrial-fibrillation');
    await tick();
    expect(screen.getByText(/every R-R interval differs/)).toBeTruthy();
    const credit = document.querySelector('.ecg-figure .akg-figure__credit')!;
    expect(credit.textContent).toBe('PTB-XL record 08215 · excerpt, smoothed for display · CC BY 4.0 · 25 mm/s · 10 mm/mV');
    expect(credit.querySelector('a')!.getAttribute('href')).toBe('https://creativecommons.org/licenses/by/4.0/');
    for (const t of ['R-R 602 ms', 'R-R 748 ms', 'R-R 872 ms', 'no P waves']) expect(screen.getByText(t)).toBeTruthy();
    // True scale: 3 s shown + 2 mm margins across the column; 5 mm between heavy grid lines.
    const k = WIDTH / (3 * 25 + 2);
    const major = document.querySelector('.ecg-grid-major')!.getAttribute('d')!;
    const xs = [...major.matchAll(/M([\d.]+) 0V/g)].map((m) => Number(m[1]));
    expect(xs[1] - xs[0]).toBeCloseTo(5 * k, 0);
    fireEvent.click(screen.getByRole('button', { name: /View full screen: Lead II rhythm strip/ }));
    await tick();
    expect(screen.getByRole('button', { name: 'Zoom In' })).toBeTruthy();
    expect((screen.getByRole('button', { name: 'Zoom Out' }) as HTMLButtonElement).disabled).toBe(true);
    const dlg = screen.getByRole('dialog');
    expect([...dlg.querySelectorAll('.ecg-lead')].map((n) => n.textContent)).toEqual(['II', 'V1']);
    expect(dlg.querySelector('.ecg-mark-text')).toBeNull(); // full screen: raw, no marks
    fireEvent.click(screen.getByRole('button', { name: 'Zoom In' }));
    expect((screen.getByRole('button', { name: 'Zoom Out' }) as HTMLButtonElement).disabled).toBe(false);
  });
  it('NSTE-ACS: ST at the J point and T depth, cited to the 2026 definition', async () => {
    launch('#/card/cardio-nste-acs');
    await tick();
    expect(screen.getByText('ST −0.9 mm at J')).toBeTruthy();
    expect(screen.getByText('T −4.0 mm')).toBeTruthy();
    expect(screen.getByText(/Counts only if new or dynamic/)).toBeTruthy();
  });
  it('Hypokalemia: T and U heights, and the missing potassium said plainly', async () => {
    launch('#/card/renal-hypokalemia');
    await tick();
    expect(screen.getByText('T 0.7')).toBeTruthy();
    expect(screen.getByText('U 1.4')).toBeTruthy();
    expect(screen.getByText(/Serum K⁺ is not available in the database/)).toBeTruthy();
    expect(document.querySelector('.ecg-figure .akg-figure__credit')!.textContent).toMatch(/^Zheng '22 record JS01656 · excerpt/);
  });
  it('Hyperkalemia: four drawn stages with numbers on the drawings, not enlargeable', async () => {
    launch('#/card/renal-hyperkalemia');
    await tick();
    for (const t of ['Peaked T waves', 'Flat P, long PR', 'Wide QRS', 'Sine wave']) expect(screen.getAllByText(t).length).toBeGreaterThan(0);
    for (const t of ['9.5 mm', '220 ms', '180 ms']) expect(screen.getByText(t)).toBeTruthy();
    expect(screen.getByText(/Drawing based on KDIGO/)).toBeTruthy();
    expect(screen.queryByRole('button', { name: /View full screen: Peaked/ })).toBeNull();
  });
});

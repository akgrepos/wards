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
const answer = (name: RegExp) => screen.getAllByRole('button', { name }).find((b) => b.closest('.pw-answer'))! as HTMLButtonElement;
const choose = async (name: RegExp) => { await act(async () => { fireEvent.click(answer(name)); }); };
const box = (title: string) => [...document.querySelectorAll('.pw-box, .pw-question')].find((b) => b.querySelector('h2')?.textContent === title)!;
const cellOf = (title: string) => box(title).closest('.pw-cell')!;

beforeEach(() => { localStorage.clear(); forgetPathways(); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('pathways (focused decision trees)', () => {
  it('a card lists its pathways as rows under the title, not inside a section', () => {
    launch('#/card/renal-aki');
    const row = document.querySelector('.card-head .pathway-row a') as HTMLElement;
    expect(row.getAttribute('href')).toBe('#/pathway/aki-cause-workup');
    expect(row.textContent).toContain('Cause Workup');
    expect(document.querySelectorAll('.akg-content-section .pathway-row').length).toBe(0);
  });

  it('questions are headings, answers are decisions, steps show the card\'s dose rows', () => {
    launch('#/pathway/hyperkalemia-treatment');
    expect(screen.getByRole('group', { name: 'Hyperkalemia: Treatment pathway' })).toBeTruthy();
    expect(box('Severity?').className).toContain('pw-question');
    for (const t of ['IV calcium', 'Shift K⁺. Consider removal', 'Shift K⁺, add albuterol, remove K⁺']) expect(box(t).className).toContain('pw-box');
    expect(box('IV calcium').textContent).toContain('Calcium gluconate 10%');
    // Every answer is a choice button, tappable from the start; nothing is chosen yet.
    expect(answer(/^Severe/).className).toContain('akg-button--choice');
    expect(answer(/^Severe/).disabled).toBe(false);
    expect(answer(/^Severe/).getAttribute('aria-pressed')).toBe('false');
    // The first unanswered question is the current step; no level rules or Now tags any more.
    expect(box('ECG changes of hyperkalemia?').getAttribute('aria-current')).toBe('step');
    expect(document.querySelectorAll('.pw-level, .pw-now').length).toBe(0);
  });

  it('choosing one answer grays the others and fades what only they lead to; tapping it again undoes', async () => {
    launch('#/pathway/hyperkalemia-treatment');
    await choose(/^Severe/);
    expect(answer(/^Severe/).getAttribute('aria-pressed')).toBe('true');
    expect(answer(/^Severe/).className).toContain('akg-button--selected');
    expect(answer(/^Moderate/).className).toContain('akg-button--unselected');
    expect(answer(/^Moderate/).disabled).toBe(false);
    expect(cellOf('Shift K⁺. Consider removal').className).toContain('pw-cell--off');
    expect(box('Shift K⁺, add albuterol, remove K⁺').className).toContain('pw-box--on');
    // Steps every route shares stay at full strength.
    expect(cellOf('Recheck K⁺ and glucose').className).not.toContain('pw-cell--off');
    // The ECG question is still unanswered, so it stays the current step.
    expect(box('ECG changes of hyperkalemia?').getAttribute('aria-current')).toBe('step');
    await choose(/^Severe/);
    expect(answer(/^Severe/).getAttribute('aria-pressed')).toBe('false');
    expect(answer(/^Moderate/).className).not.toContain('akg-button--unselected');
    expect(cellOf('Shift K⁺. Consider removal').className).not.toContain('pw-cell--off');
  });

  it('choosing an answer on a ruled-out question drops the choice that ruled it out', async () => {
    launch('#/pathway/aki-cause-workup');
    await choose(/^No$/);
    expect(cellOf('Urinary tract obstruction?').className).toContain('pw-cell--off');
    expect(answer(/^Obstruction/).className).toContain('akg-button--unselected');
    await choose(/^Obstruction/);
    expect(answer(/^Obstruction/).getAttribute('aria-pressed')).toBe('true');
    expect(answer(/^No$/).getAttribute('aria-pressed')).toBe('false');
    expect(cellOf('Urinary tract obstruction?').className).not.toContain('pw-cell--off');
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

  it('choices are kept after leaving and coming back; Clear forgets them', async () => {
    launch('#/pathway/hyperkalemia-treatment');
    await choose(/^Yes/);
    launch('#/pathway/hyperkalemia-treatment');
    expect(answer(/^Yes/).getAttribute('aria-pressed')).toBe('true');
    await tap('Clear');
    expect(answer(/^Yes/).getAttribute('aria-pressed')).toBe('false');
  });

  it('the Rapids page and the Library link to the pathway', () => {
    launch('#/emergency/renal-hyperkalemia');
    expect((document.querySelector('.pathway-row a') as HTMLElement).getAttribute('href')).toBe('#/pathway/hyperkalemia-treatment');
    launch('#/library/pathways');
    expect(screen.getByText('Hyperkalemia: Treatment')).toBeTruthy();
    expect(screen.getByText('Acute Kidney Injury: Cause Workup')).toBeTruthy();
  });

  it('choosing past two blocking choices drops only those; unrelated choices stay', async () => {
    const { content } = await import('../content');
    const { choose } = await import('../screens/PathwayScreen');
    const p = content.data.pathway!['aki-cause-workup'];
    const ans = (q: string, label: string) => p.nodes[q].answers!.findIndex((a) => a.label === label);
    // Cirrhosis branch chosen, then the route above it ruled out twice (not AKI; obstruction).
    let c: Record<string, number> = { 'cirrhosis-response': ans('cirrhosis-response', 'No'), confirm: ans('confirm', 'No'), obstruction: ans('obstruction', 'Obstruction') };
    c = choose(p, c, 'perfusion', ans('perfusion', 'Hemorrhage'));
    expect(c.confirm).toBeUndefined();
    expect(c.obstruction).toBeUndefined();
    expect(c.perfusion).toBe(ans('perfusion', 'Hemorrhage'));
    expect(c['cirrhosis-response']).toBe(ans('cirrhosis-response', 'No'));
  });

  // Lines run straight down from each box and turn only just above the box they point to, so the column under a box
  // must stay clear down to there (owner, 2026-10-21: no line runs through a box).
  it('no line has to pass through another box', async () => {
    const { content } = await import('../content');
    for (const id of Object.keys(content.data.pathway!)) {
      const p = content.data.pathway![id];
      const cells: { k: string; at: [number, number]; span: number }[] = [];
      for (const [k, n] of Object.entries(p.nodes)) {
        cells.push({ k, at: n.at, span: n.span ?? 1 });
        n.answers?.forEach((a, j) => cells.push({ k: `${k}#${j}`, at: a.at, span: a.span ?? 1 }));
      }
      const byKey = new Map(cells.map((c) => [c.k, c]));
      const edges: [string, string][] = [];
      for (const [k, n] of Object.entries(p.nodes)) {
        n.answers?.forEach((a, j) => edges.push([k, `${k}#${j}`], [`${k}#${j}`, a.to]));
        if (n.next) edges.push([k, n.next]);
      }
      for (const [from, to] of edges) {
        const a = byKey.get(from)!, b = byKey.get(to)!;
        expect(b.at[1], `${id}: ${to} sits below ${from}`).toBeGreaterThan(a.at[1]);
        const x = a.at[0] + a.span / 2;
        for (const c of cells) {
          if (c.k === from || c.k === to || c.at[1] <= a.at[1] || c.at[1] >= b.at[1]) continue;
          expect(x > c.at[0] && x < c.at[0] + c.span, `${id}: the line ${from} → ${to} crosses ${c.k}`).toBe(false);
        }
      }
    }
  });
});

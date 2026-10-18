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
const { resetRouterForTests } = await import('../router');
const { getCardScroll, setCardScroll, clearPageMemory } = await import('../storage');

function launch(hash: string) {
  cleanup();
  resetRouterForTests();
  history.replaceState(null, '', hash);
  render(<App />);
}
const tick = () => act(() => new Promise((r) => setTimeout(r, 30)));
const isOpen = (name: string) => screen.getAllByRole('button', { name }).find((b) => b.hasAttribute('aria-expanded'))!.getAttribute('aria-expanded') === 'true';
const dialog = () => screen.getByRole('dialog');

beforeEach(() => { localStorage.clear(); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('topic page', () => {
  it('has the header: type and system tags, definition, based-on line and reviewed date', () => {
    launch('#/card/renal-hyperkalemia');
    expect(screen.getByText('Condition')).toBeTruthy();
    expect(screen.getAllByText('Kidney, Electrolytes and Urology').length).toBeGreaterThan(0);
    expect(screen.getByText(/cutoffs vary by laboratory/)).toBeTruthy();
    expect(screen.getByRole('button', { name: /^Based on: UKKA '26, KDIGO '20/ })).toBeTruthy();
    expect(screen.getByText('Reviewed Oct 2026')).toBeTruthy();
  });

  it('shows the sections in order, with severity bands, time chips, steps and comparisons', () => {
    launch('#/card/renal-hyperkalemia');
    for (const t of ['At a Glance', 'Severity', 'Causes', 'Presentation', 'Diagnosis', 'Treatment', 'Monitor', 'When to Call', 'More Information', 'Pearls']) {
      expect(screen.getAllByText(t).length).toBeGreaterThan(0);
    }
    expect(document.querySelector('.akg-scale-bar, [class*="scale"]')).toBeTruthy();
    expect(screen.getByText('24 h')).toBeTruthy();
    expect(screen.getByText('Intracellular shift')).toBeTruthy();
    expect(screen.getAllByText('Insulin dose').length).toBeGreaterThan(0);
    // No pill on every line: one source line per section.
    expect(document.querySelectorAll('.akg-source-pill').length).toBe(0);
    expect(screen.getAllByRole('button', { name: /^Sources?:/ }).length).toBeGreaterThan(8);
  });

  it('shows each dose as its own row, never two drugs on one line', () => {
    launch('#/card/renal-hyperkalemia');
    const rows = screen.getAllByRole('button', { name: /Opens dose details/ });
    expect(rows.length).toBeGreaterThanOrEqual(9);
    expect(screen.getAllByRole('button', { name: /^Regular insulin 10 units IV/ }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /^Dextrose 50% 50 mL IV/ }).length).toBeGreaterThan(0);
  });

  it('a section source line lists that section’s sources with View Citation links', async () => {
    launch('#/card/renal-hyperkalemia');
    const line = screen.getAllByRole('button', { name: /^Sources?:/ }).find((b) => b.closest('#sec-at-a-glance'))!;
    await act(async () => { fireEvent.click(line); });
    expect(within(dialog()).getByText('For At a Glance')).toBeTruthy();
    expect(within(dialog()).getAllByText('View Citation').length).toBe(2);
  });
});

describe('dose sheet', () => {
  it('shows the drug, its fields, the alternative, interactions and sources', async () => {
    launch('#/card/renal-hyperkalemia');
    await act(async () => { fireEvent.click(screen.getAllByRole('button', { name: /^Calcium gluconate 10% 30 mL IV over 10 minutes/ })[0]); });
    const d = within(dialog());
    expect(d.getAllByText('Dose').length).toBe(2); // the bar title and the dose row
    expect(d.getByText('Calcium gluconate 10%')).toBeTruthy();
    for (const label of ['Rate', 'Give when', 'Repeat', 'Onset · lasts']) expect(d.getByText(label)).toBeTruthy();
    expect(d.getByText('1–3 minutes · 30–60 minutes')).toBeTruthy();
    expect(d.getByText('Check Interactions')).toBeTruthy();
    expect(d.queryByText('Boxed warning')).toBeNull(); // left empty when the sources don't say
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    fireEvent.click(d.getByText('Check Interactions'));
    expect(open).toHaveBeenCalledWith('https://reference.medscape.com/drug-interactionchecker', '_blank', 'noopener');
    // The alternative opens in the same sheet (one sheet at a time).
    await act(async () => { fireEvent.click(d.getByText('Calcium chloride 10%')); });
    expect(within(dialog()).getByText('Calcium chloride 10%', { selector: '[class*="heading"], h2, h1' })).toBeTruthy();
  });

  it('shows cautions, and a boxed warning only when the label is cited', async () => {
    launch('#/card/renal-hyperkalemia');
    await act(async () => { fireEvent.click(screen.getAllByRole('button', { name: /^Patiromer 8.4 g PO/ })[0]); });
    const d = within(dialog());
    expect(d.getByText('Cautions')).toBeTruthy();
    expect(d.getByText(/Binds magnesium/)).toBeTruthy();
    expect(d.getByText('Boxed warning')).toBeTruthy();
    await act(async () => { fireEvent.click(d.getByRole('button', { name: /^Source: Veltassa/ })); });
    expect(d.getByText('View Citation')).toBeTruthy();
  });
});

describe('remembered sections', () => {
  it('a closed section stays closed when the page is opened again', async () => {
    launch('#/card/renal-hyperkalemia');
    expect(isOpen('Causes')).toBe(true);
    await act(async () => { fireEvent.click(screen.getAllByRole('button', { name: 'Causes' }).find((b) => b.hasAttribute('aria-expanded'))!); });
    expect(isOpen('Causes')).toBe(false);
    launch('#/card/renal-hyperkalemia');
    expect(isOpen('Causes')).toBe(false);
    expect(isOpen('Severity')).toBe(true);
  });

  it('More Information subsections start closed and are remembered', async () => {
    launch('#/card/renal-hyperkalemia');
    expect(isOpen('Special Populations')).toBe(false);
    await act(async () => { fireEvent.click(screen.getAllByRole('button', { name: 'Special Populations' }).find((b) => b.hasAttribute('aria-expanded'))!); });
    launch('#/card/renal-hyperkalemia');
    expect(isOpen('Special Populations')).toBe(true);
  });

  it('the Contents menu lists the sections and collapses all', async () => {
    launch('#/card/renal-hyperkalemia');
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Contents' })); });
    const menu = within(screen.getByRole('menu', { name: 'Contents' }));
    for (const t of ['At a Glance', 'Treatment', 'More Information', 'Related', 'Sources']) expect(menu.getByText(t)).toBeTruthy();
    expect(menu.getAllByRole('menuitemcheckbox', { checked: true }).length + menu.queryAllByRole('menuitem').filter((m) => m.getAttribute('aria-checked') === 'true').length).toBeGreaterThan(0);
    await act(async () => { fireEvent.click(menu.getByText('Collapse All')); });
    expect(screen.queryByRole('menu')).toBeNull();
    expect(isOpen('Treatment')).toBe(false);
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Contents' })); });
    await act(async () => { fireEvent.click(within(screen.getByRole('menu')).getByText('Expand All')); });
    expect(isOpen('Treatment')).toBe(true);
  });

  it('choosing a closed section in Contents opens it', async () => {
    launch('#/card/renal-hyperkalemia');
    await act(async () => { fireEvent.click(screen.getAllByRole('button', { name: 'Monitor' }).find((b) => b.hasAttribute('aria-expanded'))!); });
    expect(isOpen('Monitor')).toBe(false);
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Contents' })); });
    await act(async () => { fireEvent.click(within(screen.getByRole('menu')).getByText('Monitor')); });
    expect(isOpen('Monitor')).toBe(true);
  });

  it('a section link opens the subsection it points to', async () => {
    launch('#/card/renal-hyperkalemia/special-populations');
    await tick();
    expect(isOpen('Special Populations')).toBe(true);
    expect(location.hash).toBe('#/card/renal-hyperkalemia');
  });

  it('scroll positions are kept per page and cleared with page memory', () => {
    setCardScroll('renal-aki', 812.4);
    expect(getCardScroll('renal-aki')).toBe(812);
    clearPageMemory();
    expect(getCardScroll('renal-aki')).toBeUndefined();
  });
});

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
  it('has the header: type and system tags, definition and checked date (no based-on line)', () => {
    launch('#/card/renal-hyperkalemia');
    expect(screen.getByText('Condition')).toBeTruthy();
    expect(screen.getAllByText('Kidney, Electrolytes and Urology').length).toBeGreaterThan(0);
    expect(screen.getByText(/Cutoffs vary by laboratory/)).toBeTruthy();
    expect(screen.queryByRole('button', { name: /^Based on/ })).toBeNull();
    expect(screen.getByText('Checked Oct 24, 2026')).toBeTruthy();
  });

  it('shows Checked with the stamp date and no Reviewed label on a card', () => {
    launch('#/card/cardio-chest-pain');
    expect(screen.getByText('Checked Oct 21, 2026')).toBeTruthy();
    expect(screen.queryByText(/^Reviewed/)).toBeNull();
  });

  it('shows the sections in order, with severity bands, time chips, steps and comparisons', () => {
    launch('#/card/renal-hyperkalemia');
    for (const t of ['At a Glance', 'Severity', 'Causes', 'Presentation', 'Diagnosis', 'Treatment', 'Monitor', 'Escalation', 'More Information', 'Pearls']) {
      expect(screen.getAllByText(t).length).toBeGreaterThan(0);
    }
    expect(document.querySelector('.akg-scale-bar, [class*="scale"]')).toBeTruthy();
    expect(screen.getByText('24 h')).toBeTruthy();
    expect(screen.getByText('Intracellular shift')).toBeTruthy();
    expect(screen.getAllByText('Insulin dose').length).toBeGreaterThan(0);
    // Sources are per line, shown on demand; no source line ends a section (owner, 2026-10-19).
    expect(document.querySelectorAll('.akg-source-pill').length).toBe(0);
    expect(document.querySelectorAll('.akg-source-line').length).toBe(0);
  });

  it('shows each dose as its own row, never two drugs on one line', () => {
    launch('#/card/renal-hyperkalemia');
    const rows = screen.getAllByRole('button', { name: /Opens dose details/ });
    expect(rows.length).toBeGreaterThanOrEqual(9);
    expect(screen.getAllByRole('button', { name: /^Regular insulin 10 units IV/ }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /^Dextrose 50% 50 mL IV/ }).length).toBeGreaterThan(0);
  });

  it('with sources shown, a pill lists that line’s sources with View Citation links', async () => {
    launch('#/card/renal-hyperkalemia');
    await showSources();
    const pill = document.querySelector('#sec-at-a-glance .line-pill') as HTMLElement;
    await act(async () => { fireEvent.click(pill); });
    expect(dialog().querySelector('.akg-panel--quote')!.textContent).toMatch(/^At a Glance · /);
    expect(within(dialog()).getAllByText('View Citation').length).toBeGreaterThan(0);
  });
});

const showSources = async () => {
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Contents' })); });
  await act(async () => { fireEvent.click(within(screen.getByRole('menu')).getByText('Show Sources')); });
};

describe('dose sheet', () => {
  it('shows the drug, its fields, the alternative, interactions and sources', async () => {
    launch('#/card/renal-hyperkalemia');
    await act(async () => { fireEvent.click(screen.getAllByRole('button', { name: /^Calcium gluconate 10% 30 mL IV over 10 minutes/ })[0]); });
    const d = within(dialog());
    expect(d.getAllByText('Dose').length).toBe(1); // the bar title; the dose itself is the large line
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

  it('a link to a section of the same page scrolls there without opening the page again', async () => {
    launch('#/card/renal-aki');
    await tick();
    act(() => { fireEvent.click(screen.getByRole('button', { name: 'Diagnosis' })); });
    expect(isOpen('Diagnosis')).toBe(false);
    const link = screen.getByText('first-line tests in Diagnosis');
    await act(async () => { fireEvent.click(link); });
    await tick();
    expect(isOpen('Diagnosis')).toBe(true);
    expect(location.hash).toBe('#/card/renal-aki');
  });

  it('a card link opens a sheet with part of the other card and a row that opens the full card', async () => {
    launch('#/card/renal-aki');
    const btn = screen.getAllByRole('button', { name: 'Hyperkalemia' }).find((b) => b.closest('ul ul'))!;
    await act(async () => { fireEvent.click(btn); });
    await tick();
    const row = within(dialog()).getByText(/^Open full /);
    expect(row).toBeTruthy();
  });

  it('nested bullets and links woven into the sentence', () => {
    launch('#/card/renal-aki');
    expect(screen.getAllByRole('button', { name: 'Hyperkalemia' }).some((l) => l.closest('ul ul'))).toBe(true);
    expect(screen.queryByText(/\(Hyperkalemia\)/)).toBeNull();
  });

  it('values are tappable only when the pop-up adds something the line does not show', async () => {
    launch('#/card/renal-hyperkalemia');
    const scale = document.querySelector('.scale-block') as HTMLElement;
    expect(within(scale).queryAllByRole('button')).toHaveLength(0);
    // Stacked bands (name over detail), never side by side.
    expect(scale.querySelectorAll('.akg-grade-list--bands .akg-grade-list__band').length).toBeGreaterThanOrEqual(2);
    expect(scale.querySelector('.akg-grade-list__name')?.textContent).toBeTruthy();
    expect(within(scale).getByText('≥6.5 mEq/L')).toBeTruthy();
    // Every Hyperkalemia cutoff's pop-up only repeated its line, so none is tappable (owner, 2026-10-19).
    for (const v of ['≥6.5 mEq/L', '≥6.0 mEq/L', '>6.5 mEq/L', '<126 mg/dL', '>200 mg/dL']) {
      expect(screen.queryByRole('button', { name: v })).toBeNull();
      expect(screen.getAllByText(v).length).toBeGreaterThan(0);
    }
    // AKI: the urinary indices table is plain; the contrast eGFR cutoffs add a caveat, so they open a pop-up.
    launch('#/card/renal-aki');
    const table = screen.getByText(/\(on diuretics\)/).closest('table') as HTMLElement;
    expect(within(table).queryAllByRole('button')).toHaveLength(0);
    expect(within(table).getByText('<1 %')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '<30 mL/min/1.73 m²' }));
    await tick();
    expect(within(dialog()).getByText(/contraindicated \(e\.g\. heart failure\)/)).toBeTruthy();
  });

  it('causes are one grouped list with a Cannot miss tag', () => {
    launch('#/card/renal-hyperkalemia');
    expect(screen.getByText('Impaired excretion:')).toBeTruthy();
    expect(screen.getByText('Cannot miss')).toBeTruthy();
  });

  it('Compare Onset and Duration opens all agents, fastest first', async () => {
    launch('#/card/renal-hyperkalemia');
    expect(screen.queryByText('Onset and duration')).toBeNull();
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Compare Onset and Duration' })); });
    const names = within(dialog()).getAllByRole('rowheader').map((c) => c.textContent);
    expect(names).toEqual(['Hemodialysis', 'Calcium gluconate 10%', 'Furosemide', 'Albuterol (nebulized)', 'Insulin-dextrose', 'Sodium zirconium cyclosilicate', 'Patiromer']);
  });

  it('the quote-mark button shows one source pill per line; a pill lists that line\'s sources', async () => {
    launch('#/card/renal-aki');
    expect(document.querySelector('.line-pill')).toBeNull();
    await showSources();
    expect(document.querySelector('.line-pill')).not.toBeNull();
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Contents' })); });
    expect(within(screen.getByRole('menu')).getByText('Hide Sources')).toBeTruthy();
    await act(async () => { fireEvent.keyDown(document, { key: 'Escape' }); });
    // "First: exclude obstruction, …" cites KDIGO 2012 and NICE 2024: one pill, the first source and "+1".
    const pill = screen.getAllByRole('button', { name: "Sources: KDIGO '12, NICE '24" })[0];
    expect(pill.textContent).toBe("KDIGO '12+1");
    await act(async () => { fireEvent.click(pill); });
    expect(dialog().querySelector('.akg-panel--quote')!.textContent).toMatch(/^At a Glance · First: exclude obstruction/);
    expect(within(dialog()).getAllByRole('link', { name: /View Citation/ }).length).toBe(2);
    // Common practice alone shows the stethoscope pill.
    expect(screen.getAllByRole('button', { name: 'Common clinical practice' }).length).toBeGreaterThan(0);
  });

  it('criteria, staging and notes each have their own labelled box', () => {
    launch('#/card/renal-aki');
    const crit = document.querySelector('.akg-panel--definition')!;
    expect(crit.querySelector('.akg-panel__label')!.textContent).toBe('Criteria');
    const stages = [...document.querySelectorAll('.staging .akg-grade-list__band')];
    expect(stages.map((c) => c.querySelector('.akg-grade-list__name')!.textContent)).toEqual(['Stage 1', 'Stage 2', 'Stage 3']);
    expect(stages.map((c) => [...c.classList].find((k) => k.startsWith('akg-tone--')))).toEqual(['akg-tone--mild', 'akg-tone--moderate', 'akg-tone--severe']);
    const notes = [...document.querySelectorAll('.akg-panel--note')].map((n) => n.textContent);
    expect(notes.some((t) => t!.startsWith('Note') && t!.includes('Postrenal AKI is not identified by urine indices'))).toBe(true);
    const indices = screen.getByRole('columnheader', { name: 'ATN' }).closest('table')!;
    expect(within(indices).getByRole('rowheader', { name: 'Sediment' })).toBeTruthy();
  });

  it('a regimen shows its options joined by Or, parts joined by Plus, one dose row per drug', async () => {
    launch('#/card/id-cap');
    const box = [...document.querySelectorAll('.regimen')].find((r) => r.textContent!.includes('Inpatient, not severe'))!;
    expect(box.querySelector('.akg-panel__label')!.textContent).toBe('Regimen');
    const joins = [...box.querySelectorAll('.regimen-join')].map((j) => j.textContent);
    expect(joins).toContain('Or');
    expect(joins).toContain('Plus');
    expect(within(box as HTMLElement).getAllByText('One of:').length).toBeGreaterThan(0);
    await act(async () => { fireEvent.click(within(box as HTMLElement).getAllByRole('button', { name: /^Ceftriaxone/ })[0]); });
    expect(within(dialog()).getAllByText(/Ceftriaxone/).length).toBeGreaterThan(0);
  });

  it('numbered steps show their numbers', () => {
    launch('#/card/id-cap');
    const markers = [...document.querySelectorAll('.akg-step-list')][0].querySelectorAll(':scope > .akg-step > .akg-step__marker');
    expect([...markers].map((m) => m.textContent)).toEqual(['1', '2', '3', '4', '5']);
  });

  it('scroll positions are kept per page and cleared with page memory', () => {
    setCardScroll('renal-aki', 812.4);
    expect(getCardScroll('renal-aki')).toBe(812);
    clearPageMemory();
    expect(getCardScroll('renal-aki')).toBeUndefined();
  });
});

describe('MDCalc links', () => {
  it('a score named on a card is a link that opens MDCalc outside the app, and the card says so', () => {
    launch('#/card/id-cap');
    const curb = screen.getAllByRole('link', { name: /^PSI\. Opens MDCalc in Safari, needs internet\.$/ })[0];
    expect(curb.getAttribute('href')).toBe('https://www.mdcalc.com/calc/33/psi-port-score-pneumonia-severity-index-cap');
    expect(curb.getAttribute('target')).toBe('_blank');
    expect(curb.getAttribute('rel')).toContain('noopener');
    expect(screen.getByText(/open MDCalc in Safari and need internet/)).toBeTruthy();
  });
  it('keeps the words the content used, such as a capital letter', () => {
    launch('#/card/endo-dka');
    expect(screen.getAllByRole('button', { name: 'Anion gap' }).length).toBeGreaterThan(0);
  });
  it('a score with an in-app calculator opens it, with the MDCalc link as its last row', () => {
    launch('#/card/id-cap');
    fireEvent.click(screen.getAllByRole('button', { name: 'CURB-65' })[0]);
    expect(screen.getByText('CURB-65 pneumonia severity')).toBeTruthy();
    fireEvent.click(screen.getByText('Age ≥65 years'));
    expect(screen.getByText('1 point')).toBeTruthy();
    expect(screen.getByRole('link', { name: /CURB-65 on MDCalc/ }).getAttribute('href')).toContain('mdcalc.com');
  });
  it('a card without scores has no such note', () => {
    launch('#/card/renal-iv-fluids');
    expect(screen.queryByText(/open MDCalc in Safari/)).toBeNull();
  });
});

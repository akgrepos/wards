import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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
const dialog = () => screen.getByRole('dialog');

beforeEach(() => { localStorage.clear(); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('drug record on the dose sheet', () => {
  it('shows the drug-wide warnings once, above the dose’s own cautions', async () => {
    launch('#/card/id-cap');
    await act(async () => { fireEvent.click(screen.getAllByRole('button', { name: /^Ceftriaxone/ })[0]); });
    const d = within(dialog());
    const title = d.getByText('Ceftriaxone warnings');
    expect(d.getAllByText('Ceftriaxone warnings').length).toBe(1);
    expect(d.getByText(/Never mix with calcium-containing IV solutions/)).toBeTruthy();
    expect(d.getByText('Kidney and liver')).toBeTruthy();
    // The drug section comes before the dose's own Cautions section.
    const own = d.getByText('Cautions');
    expect(title.compareDocumentPosition(own) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    // The label is among the sheet's sources.
    expect(d.getAllByRole('button', { name: /^Source: /i }).length).toBeGreaterThan(0);
  });

  it('a drug with no boxed warning shows its cautions and the kidney and liver line, but no boxed warning', async () => {
    launch('#/card/renal-hyperkalemia');
    await act(async () => { fireEvent.click(screen.getAllByRole('button', { name: /^Patiromer 8.4 g PO/ })[0]); });
    const d = within(dialog());
    expect(d.getByText('Patiromer warnings')).toBeTruthy();
    expect(d.getByText('Kidney and liver')).toBeTruthy();
    expect(d.queryByText('Boxed warning')).toBeNull();
  });
});

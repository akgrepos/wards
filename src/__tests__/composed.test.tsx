import { act, cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: () => ({ needRefresh: [false, () => {}], offlineReady: [false, () => {}], updateServiceWorker: () => {} }),
}));
window.matchMedia ??= ((query: string) => ({ matches: false, media: query, addEventListener: () => {}, removeEventListener: () => {} })) as unknown as typeof window.matchMedia;
window.IntersectionObserver ??= class { observe() {} disconnect() {} unobserve() {} takeRecords() { return []; } root = null; rootMargin = ''; thresholds = []; } as unknown as typeof IntersectionObserver;
window.scrollTo = () => {};
Element.prototype.scrollIntoView ??= () => {};

const { App } = await import('../App');
const { resetRouterForTests } = await import('../router');
const { content } = await import('../content');

afterEach(() => cleanup());

// What the phone shows for one card: the card's page rendered the way the app renders it.
function composed(id: string): string {
  cleanup();
  resetRouterForTests();
  history.replaceState(null, '', `#/card/${id}`);
  const { container } = render(<App />);
  return container.textContent ?? '';
}

// Anything here on a finished page means a reference or a piece of syntax was never turned into text.
const LEFTOVERS: [string, RegExp][] = [
  ['a missing item', /\[missing [a-z]+: /],
  ['an unresolved insert {{…}}', /\{\{/],
  ['an unresolved link [[…]]', /\[\[/],
  ['a leftover source marker ^[…]', /\^\[/],
  ['"undefined"', /\bundefined\b/],
  ['"NaN"', /\bNaN\b/],
  ['"[object"', /\[object /],
  ['a scaffold placeholder', /\b(TODO|TBD|FIXME|SCAFFOLD)\b/],
];

describe('every card, as the phone shows it', () => {
  const cards = content.cards;
  it('has cards to test', () => expect(cards.length).toBeGreaterThan(10));
  for (const card of cards) {
    it(`${card.id} has no leftovers and no empty section`, async () => {
      const text = composed(card.id);
      await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
      const page = document.body.textContent ?? text;
      const problems: string[] = [];
      for (const [what, re] of LEFTOVERS) {
        const m = page.match(re);
        if (m) problems.push(`${what}: …${page.slice(Math.max(0, m.index! - 40), m.index! + 60)}…`);
      }
      // Every section the card has must show its heading and some text of its own.
      for (const s of card.sections) {
        if (!s.blocks.length && !s.subsections.length) problems.push(`section "${s.title}" has no content`);
        if (!page.includes(s.title)) problems.push(`section "${s.title}" is not on the page`);
      }
      if (!page.includes(card.title)) problems.push('the title is not on the page');
      expect(problems).toEqual([]);
    });
  }
});

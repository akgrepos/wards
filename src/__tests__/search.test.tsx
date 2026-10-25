import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import full from 'virtual:wards-content-full';
import { splitContent } from '../../scripts/content/split.mjs';
import { search, type GroupKey } from '../content/search';
import { content } from '../content';
import { resetRouterForTests } from '../router';
import { missesThisWeek } from '../storage';

// The offline/update service worker doesn't exist in tests; pretend no update is waiting.
vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: () => ({ needRefresh: [false, () => {}], offlineReady: [false, () => {}], updateServiceWorker: () => {} }),
}));
window.matchMedia ??= ((query: string) => ({ matches: false, media: query, addEventListener: () => {}, removeEventListener: () => {} })) as unknown as typeof window.matchMedia;
window.IntersectionObserver ??= class { observe() {} disconnect() {} unobserve() {} takeRecords() { return []; } root = null; rootMargin = ''; thresholds = []; } as unknown as typeof IntersectionObserver;
window.scrollTo = () => {};
Element.prototype.scrollIntoView ??= () => {};
const { App } = await import('../App');

const keys = (q: string) => search(q, content).groups.map((g) => g.key);
const group = (q: string, key: GroupKey) => search(q, content).groups.find((g) => g.key === key)?.hits ?? [];

describe('search index', () => {
  const idx = content.search!;
  const dataOf = (id: string) => (full.data.calc as Record<string, { calculator?: unknown }>)[id];

  it('holds section headings (with More Information subsections), drugs and calculators', () => {
    expect(idx.sections.length).toBeGreaterThan(100);
    expect(idx.sections.some(([, , , parent]) => parent === 'More Information')).toBe(true);
    expect(idx.drugs.length).toBeGreaterThan(50);
    expect(idx.tools.map((t) => t[0])).toContain('anion-gap');
  });

  it('only lists calculators that open inside the app, each with the cards that use it', () => {
    for (const [id, , , , cardIndexes] of idx.tools) {
      expect(dataOf(id).calculator).toBeTruthy();
      expect(cardIndexes.length).toBeGreaterThan(0);
    }
  });

  it('every row points at a real card and the section really exists in it', () => {
    for (const [ci, key] of idx.sections) expect(content.cards[ci]?.sections.some((s) => s.key === key || s.subsections.some((x) => x.key === key))).toBe(true);
    for (const [, , ci, key] of idx.drugs) {
      const card = content.cards[ci];
      expect(card).toBeTruthy();
      if (key) expect(card.sections.some((s) => s.key === key || s.subsections.some((x) => x.key === key))).toBe(true);
    }
  });

  it('has no card text: staying small keeps the app quick to start', () => {
    expect(JSON.stringify(idx).length).toBeLessThan(70_000);
  });

  it('holds the smaller names: scale and comparison names, bands, criteria titles, bold bullet labels, calculator short names', () => {
    const labels = idx.labels!;
    const text = (id: string) => labels.filter(([ci]) => content.cards[ci].id === id).map(([, , t]) => t);
    expect(labels.length).toBeGreaterThan(300);
    expect(text('pulm-vte-diagnosis')).toEqual(expect.arrayContaining(['PE severity', 'Acute PE clinical category', 'Simplified PE Severity Index (sPESI)', 'Wells score for PE']));
    expect(text('renal-hyponatremia')).toEqual(expect.arrayContaining(['Hypovolemic', 'Symptoms by severity']));
    // never repeats a heading of the same card, and every row points at a real section
    for (const [ci, key, t] of labels) {
      expect(content.cards[ci].sections.some((x) => x.key === key) || idx.sections.some((r) => r[0] === ci && r[1] === key)).toBe(true);
      expect(idx.sections.some((r) => r[0] === ci && r[1] === key && r[2] === t)).toBe(false);
    }
  });

  it('finds the section that shows a dose, also through a regimen, and the brand names', () => {
    const card = (id: string, sections: unknown[]) => ({ file: `${id}.md`, id, type: 'topic', variant: null, system: 's', group: 'condition', subsection: null, title: id, aliases: [], related: {}, example: false, contentsSub: [], definition: null, basedOn: [], checked: null, reviewed: null, emergency: null, sections });
    const sec = (key: string, blocks: unknown[], subsections: unknown[] = []) => ({ key, title: key, blocks, subsections });
    const doc = {
      systems: [],
      cards: [
        card('c1', [sec('diagnosis', []), sec('treatment', [{ t: 'insert', kind: 'regimen', id: 'r1' }]), sec('more', [], [{ key: 'extra', title: 'Extra', description: null, blocks: [{ t: 'insert', kind: 'dose', id: 'd2' }] }])]),
        card('c2', [sec('treatment', [{ t: 'insert', kind: 'dose', id: 'd1' }])]),
      ],
      data: {
        regimen: { r1: { name: 'R', options: [{ doses: ['d1'] }], sources: [] } },
        dose: { d1: { drug_name: 'Testdrug', brand: 'Testbrand' }, d2: { drug_name: 'Otherdrug' } },
        calc: { k1: { name: 'Plain link', short: 'link', match: [] }, k2: { name: 'Score', short: 'score', match: ['sc'], calculator: { kind: 'formula' } } },
      },
    };
    (doc.cards[0].sections[1] as { blocks: unknown[] }).blocks.push({ t: 'paragraph', inlines: [{ t: 'insert', kind: 'calc', id: 'k1' }, { t: 'insert', kind: 'calc', id: 'k2' }], sources: [] });
    const out = (splitContent(doc as never).index as { search: NonNullable<typeof content.search> }).search;
    expect(out.drugs).toEqual([
      ['Testdrug', 'Testbrand', 0, 'treatment', 'treatment', ''],
      ['Otherdrug', '', 0, 'extra', 'Extra', ''],
      ['Testdrug', 'Testbrand', 1, 'treatment', 'treatment', ''],
    ]);
    expect(out.sections.filter(([ci]) => ci === 0).map((r) => r[1])).toEqual(['diagnosis', 'treatment', 'more', 'extra']);
    expect(out.tools).toEqual([['k2', 'Score', 'score', 'sc', [0]]]);
  });
});

describe('search ranking and groups', () => {
  it('says nothing for empty or punctuation-only input', () => {
    expect(search('', content).groups).toEqual([]);
    expect(search('  ?! ', content).groups).toEqual([]);
  });

  it('one letter lists card titles that start with it, in one group, and says to keep typing', () => {
    const r = search('c', content);
    expect(r.oneLetter).toBe(true);
    expect(r.groups).toHaveLength(1);
    expect(r.groups[0].hits.length).toBeGreaterThan(1);
    for (const h of r.groups[0].hits) expect(h.title.toLowerCase().startsWith('c')).toBe(true);
  });

  it('two letters run the full search', () => {
    expect(search('ce', content).oneLetter).toBe(false);
  });

  it('a drug: its own card first, then each dose in another card, with the section that shows it', () => {
    const hits = group('ceftriaxone', 'drugs');
    expect(hits[0].subtitle.startsWith('Drug · ')).toBe(true);
    expect(hits[0].cardId).toBe('ceftriaxone');
    const doses = hits.slice(1);
    expect(doses.length).toBeGreaterThan(1);
    for (const h of doses) {
      expect(h.title).toBe('Ceftriaxone');
      expect(h.subtitle).toMatch(/^Dose in .+ · /);
      expect(h.cardId).not.toBe('ceftriaxone');
    }
    expect(doses.some((h) => h.section)).toBe(true);
  });

  it('a brand name finds the drug, naming the brand in the subtitle', () => {
    const hits = group('tylenol', 'drugs');
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].title).toBe('Acetaminophen');
    expect(hits[0].subtitle).toMatch(/^Tylenol · Dose in /);
    expect(hits[0].markSubtitle).toBe(true);
  });

  it('a card found by an alias says which alias', () => {
    const withAlias = content.cards.find((c) => c.type !== 'medication' && c.aliases.length > 0)!;
    const alias = withAlias.aliases.find((a) => !withAlias.title.toLowerCase().includes(a.toLowerCase()))!;
    const hit = group(alias, 'cards').find((h) => h.cardId === withAlias.id)!;
    expect(hit.subtitle).toContain(`also called “${alias}”`);
    expect(hit.markSubtitle).toBe(true);
  });

  it('a heading is found together with its card name or alias ("SIADH severity" for the Severity heading of a card with that alias)', () => {
    const card = content.cards.find((c) => c.sections.some((s) => s.key === 'severity') && c.aliases.some((a) => /^[a-z0-9]+$/i.test(a) && !/severity/i.test(a)))!;
    const alias = card.aliases.find((a) => /^[a-z0-9]+$/i.test(a) && !/severity/i.test(a))!;
    const hits = group(`${alias} severity`, 'sections');
    expect(hits.some((h) => h.cardId === card.id && h.title === 'Severity')).toBe(true);
    // A word that is neither in the heading nor in the card finds nothing.
    expect(group(`${alias} qzxv`, 'sections')).toEqual([]);
  });

  it('a title that starts with what was typed ranks before one that only contains it', () => {
    const hits = group('hyperkalemia', 'cards');
    expect(hits[0].title.toLowerCase().startsWith('hyperkalemia')).toBe(true);
  });

  it('section headings: title is the heading, subtitle says where, a tap opens that section', () => {
    const hit = group('guidelines differ', 'sections')[0];
    expect(hit.title).toBe('Where Guidelines Differ');
    expect(hit.subtitle).toMatch(/^More Information · /);
    expect(hit.section).toBe('guidelines-differ');
  });

  it('calculators: opens the calculator itself, and the subtitle names a card that uses it', () => {
    const hits = group('osmolality', 'tools');
    expect(hits.map((h) => h.tool)).toEqual(['serum-osmolality']);
    expect(hits[0].subtitle).toMatch(/^Calculator · used in /);
    expect(group('wells', 'tools')).toEqual([]);
    expect(group('curb', 'tools')).toEqual([]);
  });

  it('groups come in the order Cards, Drugs, Sections, Tools and only when they have matches', () => {
    const all: GroupKey[] = ['cards', 'drugs', 'sections', 'tools'];
    for (const q of ['treatment', 'ceftriaxone', 'anion', 'sepsis']) {
      const got = keys(q);
      expect(got).toEqual(all.filter((k) => got.includes(k)));
    }
    expect(keys('anion')).toContain('tools');
  });

  it('every word typed must start a word', () => {
    expect(group('ceftriaxone sepsis', 'drugs')).toEqual([]);
    expect(search('qqqq', content).groups).toEqual([]);
    expect(search('cefalexin', content).groups).toEqual([]);
  });

  it('ignores accents, case and punctuation', () => {
    expect(group('Winter’s', 'tools')[0]?.tool).toBe('winters-formula');
  });
});

describe('questions typed as the owner would', () => {
  const titles = (q: string) => group(q, 'sections').map((h) => `${h.title} | ${h.subtitle}`);

  it('"PE severity" finds the PE severity table and the sPESI criteria of the VTE card, not other cards', () => {
    const hits = group('PE severity', 'sections');
    expect(hits[0].cardId).toBe('pulm-vte-diagnosis');
    expect(hits[0].title).toBe('PE severity');
    expect(hits.some((h) => h.title.startsWith('Simplified PE Severity Index'))).toBe(true);
    expect(hits.every((h) => h.cardId === 'pulm-vte-diagnosis')).toBe(true);
  });

  it('"hyponatremia labs" finds the Diagnosis section of Hyponatremia', () => {
    const hits = group('hyponatremia labs', 'sections');
    expect(hits).toHaveLength(1);
    expect([hits[0].cardId, hits[0].title, hits[0].section]).toEqual(['renal-hyponatremia', 'Diagnosis', 'diagnosis']);
  });

  it('"alcohol withdrawal CIWA" finds the Alcohol Withdrawal severity, and "CIWA" its score and the card', () => {
    expect(titles('alcohol withdrawal CIWA').every((t) => t.endsWith('Alcohol Withdrawal'))).toBe(true);
    expect(titles('alcohol withdrawal CIWA').length).toBeGreaterThan(0);
    expect(keys('CIWA')).toContain('cards');
    expect(group('CIWA', 'sections').some((h) => h.title === 'CIWA-Ar')).toBe(true);
  });

  it('one word (severity) lists headings first, then smaller names, with the card the word names ranked first', () => {
    const hits = group('severity', 'sections');
    expect(hits.slice(0, 3).every((h) => h.title === 'Severity')).toBe(true);
    expect(hits.some((h) => h.title !== 'Severity')).toBe(true);
  });

  it('a short word is a whole word with the card ("PE" is not "Pearls")', () => {
    expect(group('PE severity', 'sections').some((h) => h.title === 'Pearls')).toBe(false);
  });

  it('a smaller name opens its own section', () => {
    const hit = group('Wells', 'sections').find((h) => h.cardId === 'pulm-vte-diagnosis')!;
    expect(hit.section).toBeTruthy();
  });
});

describe('Search screen', () => {
  beforeEach(() => { localStorage.clear(); resetRouterForTests(); history.replaceState(null, '', '#/search'); });
  afterEach(() => cleanup());
  const type = (v: string) => fireEvent.change(screen.getByPlaceholderText('Search cards, drugs, calculators'), { target: { value: v } });
  const headers = () => [...document.querySelectorAll('.akg-list__header-title, .akg-list__header')].map((e) => e.textContent);

  it('shows the best three of a group, then Show N More, which lists the rest in place', () => {
    render(<App />);
    type('treatment');
    const total = group('treatment', 'sections').length;
    expect(total).toBeGreaterThan(3);
    const shown = () => document.querySelectorAll('.search-result').length;
    const before = shown();
    fireEvent.click(screen.getByRole('button', { name: `Show ${total - 3} More` }));
    expect(shown()).toBe(before + total - 3);
    expect(screen.queryByRole('button', { name: /Show \d+ More/ })).toBeNull();
  });

  it('does not label the type of a row on the right', () => {
    render(<App />);
    type('ceftriaxone');
    expect(document.querySelector('.akg-list-row__detail')).toBeNull();
  });

  it('a Sections result links to the card at that section', () => {
    render(<App />);
    type('guidelines differ');
    const a = screen.getAllByRole('link').find((l) => l.getAttribute('href')?.endsWith('/guidelines-differ'));
    expect(a).toBeTruthy();
    expect(headers().join(' ')).toContain('Sections');
  });

  it('tapping a Sections result opens the card at that section and tints it', async () => {
    render(<App />);
    type('guidelines differ');
    const a = screen.getAllByRole('link').find((l) => l.getAttribute('href')?.endsWith('/guidelines-differ'))!;
    await act(async () => { fireEvent.click(a); await new Promise((r) => setTimeout(r, 50)); });
    expect(location.hash).toBe(a.getAttribute('href')!.replace(/\/guidelines-differ$/, ''));
    expect(document.getElementById('sub-guidelines-differ')?.classList.contains('search-flash')).toBe(true);
  });

  it('a card opened any other way is not tinted', async () => {
    history.replaceState(null, '', '#/card/crit-sepsis/guidelines-differ');
    render(<App />);
    await act(async () => { await new Promise((r) => setTimeout(r, 50)); });
    expect(document.getElementById('sub-guidelines-differ')).toBeTruthy();
    expect(document.querySelector('.search-flash')).toBeNull();
  });

  it('one letter: card titles only, with the keep typing note', () => {
    render(<App />);
    type('c');
    expect(screen.getByText(/Keep typing to search drugs, section headings and calculators/)).toBeTruthy();
    expect(headers().filter(Boolean)).toEqual([]);
  });

  it('tapping a calculator result opens the calculator', async () => {
    render(<App />);
    type('osmolality');
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /osmolality/i })); });
    await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
    await waitFor(() => expect(document.querySelector(".calc-sheet")).toBeTruthy());
  });

  it('counts a search with no result once, after the words stand still or on Enter; a search with results is not counted', async () => {
    vi.useFakeTimers();
    try {
      render(<App />);
      const field = screen.getByPlaceholderText('Search cards, drugs, calculators');
      type('zzzqx');
      expect(missesThisWeek()).toBe(0);
      act(() => { vi.advanceTimersByTime(2100); });
      expect(missesThisWeek()).toBe(1);
      fireEvent.keyDown(field, { key: 'Enter' }); // same words again: not counted twice
      expect(missesThisWeek()).toBe(1);
      type('zzzqy');
      fireEvent.keyDown(field, { key: 'Enter' });
      expect(missesThisWeek()).toBe(2);
      type('ceftriaxone');
      act(() => { vi.advanceTimersByTime(5000); });
      expect(missesThisWeek()).toBe(2);
      type('z'); // one letter is never counted
      act(() => { vi.advanceTimersByTime(5000); });
      expect(missesThisWeek()).toBe(2);
    } finally { vi.useRealTimers(); }
  });

  it('no results says what to try', () => {
    render(<App />);
    type('cefalexin');
    expect(screen.getByText('No Results')).toBeTruthy();
    expect(screen.getByText(/Nothing in Wards matches “cefalexin”/)).toBeTruthy();
  });
});

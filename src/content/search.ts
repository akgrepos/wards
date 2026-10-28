import { cardTypeLabel, norm } from './index';
import type { Card, Content, Term } from './types';

// Search over card titles and aliases, section headings and the smaller names inside sections, drug names (with the cards whose doses use them) and calculators.
// The rows come from the index built with the content (scripts/content/search-index.mjs); no card text is searched.
// Every word typed must match the start of a word; a match at the start of the text ranks first.

export type GroupKey = 'cards' | 'terms' | 'drugs' | 'sections' | 'tools';
export const GROUP_LABELS: Record<GroupKey, string> = { cards: 'Cards', terms: 'Terms', drugs: 'Drugs', sections: 'Sections', tools: 'Tools' };

export type Hit = {
  id: string;
  /** What matched. */
  title: string;
  /** Where it is. */
  subtitle: string;
  /** Whether the match is in the subtitle (an alias, a brand name), so the subtitle is highlighted too. */
  markSubtitle?: boolean;
  cardId: string;
  /** A section of the card to open at (a Sections result, or the section holding a drug's dose). */
  section?: string;
  /** A calculator that opens in place of a card. */
  tool?: string;
  /** A term (Glossary) that opens its definition sheet. */
  term?: string;
};
export type Results = { oneLetter: boolean; groups: { key: GroupKey; label: string; hits: Hit[] }[] };

/** Other words for the fixed section headings, so a question like "hyponatremia labs" finds Diagnosis. Searched, never shown. */
const HEADING_WORDS: Record<string, string> = {
  diagnosis: 'labs lab tests testing workup work up imaging',
  treatment: 'management therapy',
  presentation: 'symptoms signs',
  causes: 'etiology',
};

type Scored = { hit: Hit; score: number; tie: string };
const byScore = (a: Scored, b: Scored) => b.score - a.score || a.tie.localeCompare(b.tie);

export function search(query: string, content: Content): Results {
  const q = norm(query);
  const words = q.split(' ').filter(Boolean);
  if (!words.length) return { oneLetter: false, groups: [] };
  const cards = content.cards;
  const systemTitle = (c: Card) => content.systems.find((s) => s.id === c.system)?.title ?? '';

  // One letter is too broad to search drugs, headings and calculators: only card titles that start with it.
  if (q.length === 1) {
    const hits = cards.filter((c) => norm(c.title).startsWith(q)).sort((a, b) => a.title.localeCompare(b.title))
      .map((c): Hit => ({ id: c.id, title: c.title, subtitle: cardSubtitle(c, systemTitle(c)), cardId: c.id }));
    return { oneLetter: true, groups: hits.length ? [{ key: 'cards', label: '', hits }] : [] };
  }

  /** 3: the text starts with what was typed; 2: every word starts a word in it; 0: no match. */
  const rank = (text: string) => {
    const t = norm(text);
    if (!words.every((w) => (' ' + t).includes(' ' + w))) return 0;
    return t.startsWith(q) ? 3 : 2;
  };

  /** What a section row is read together with: the card's title and aliases (and, for a smaller name, its section heading). */
  const contexts = new Map<Card, string[]>();
  const contextOf = (card: Card) => {
    let c = contexts.get(card);
    if (!c) contexts.set(card, c = [card.title, ...card.aliases].map((t) => ' ' + norm(t)));
    return c;
  };
  /**
   * A row is read as "card title + aliases + the row's own text" (so "PE severity" finds the PE severity table of the
   * card whose alias is PE). Every typed word must start a word in the row or in that context, and the row must hold
   * at least half of the words. A word of one or two letters must be a whole word in the context (so "PE" is not "Pearls").
   * `hidden` is extra wording the row answers to ("labs" for Diagnosis); it is searched but never shown.
   * Returns 3 (the row starts with what was typed), 2 (every word is in the row), 1 (found with the card), 0 (no).
   */
  const rankWithCard = (text: string, card: Card, heading = '', hidden = '') => {
    const own = rank(hidden ? `${text} ${hidden}` : text);
    if (own) return own;
    if (words.length < 2) return 0;
    const h = ' ' + norm(hidden ? `${text} ${hidden}` : text);
    const more = heading ? ' ' + norm(heading) : '';
    const ctx = contextOf(card);
    const starts = (t: string, w: string) => (w.length <= 2 ? (t + ' ').includes(' ' + w + ' ') : t.includes(' ' + w));
    const inRow = words.filter((w) => h.includes(' ' + w) && (w.length > 2 || starts(h, w)));
    if (inRow.length < Math.ceil(words.length / 2)) return 0;
    return words.every((w) => inRow.includes(w) || starts(more, w) || ctx.some((t) => starts(t, w))) ? 1 : 0;
  };

  const cardHits: Scored[] = [];
  const drugHits: Scored[] = [];
  for (const c of cards) {
    let score = rank(c.title);
    let alias: string | undefined;
    if (!score) {
      alias = c.aliases.find((a) => rank(a));
      if (alias) score = 1;
    }
    if (!score) continue;
    const isDrug = c.type === 'medication';
    const base = isDrug ? `Drug · ${systemTitle(c)}` : cardSubtitle(c, systemTitle(c));
    const hit: Hit = { id: c.id, title: c.title, subtitle: alias ? `${base} · also called “${alias}”` : base, markSubtitle: !!alias, cardId: c.id };
    (isDrug ? drugHits : cardHits).push({ hit, score, tie: c.title });
  }

  const idx = content.search;
  const inCard = (card: Card) => (words.some((w) => contextOf(card).some((t) => t.includes(' ' + w))) ? 0.25 : 0);
  const cardAt = (i: number) => cards[i];
  const doseHits: Scored[] = [];
  const sectionHits: Scored[] = [];
  const toolHits: Scored[] = [];

  for (const [name, brands, ci, key, title, drugId] of idx?.drugs ?? []) {
    const card = cardAt(ci);
    if (!card || drugId === card.id) continue; // the drug's own card is already listed
    let score = rank(name);
    let brand: string | undefined;
    if (!score) {
      brand = brands.split('|').find((b) => b && rank(b));
      if (brand) score = 1;
    }
    if (!score) continue;
    const where = `Dose in ${title ? `${title} · ` : ''}${card.title}`;
    doseHits.push({ score, tie: `${name}\0${card.title}`, hit: { id: `dose:${name}:${card.id}`, title: name, subtitle: brand ? `${brand} · ${where}` : where, markSubtitle: !!brand, cardId: card.id, section: key || undefined } });
  }

  const where = new Map<string, [title: string, parent: string]>();
  for (const [ci, key, title, parent] of idx?.sections ?? []) {
    where.set(`${ci}:${key}`, [title, parent]);
    const card = cardAt(ci);
    if (!card) continue;
    const score = rankWithCard(title, card, '', parent ? '' : HEADING_WORDS[norm(title)]);
    if (!score) continue;
    sectionHits.push({ score: score + inCard(card), tie: `${title}\0${card.title}`, hit: { id: `section:${card.id}:${key}`, title, subtitle: parent ? `${parent} · ${card.title}` : card.title, cardId: card.id, section: key } });
  }
  // Smaller names inside a section rank below section headings.
  (idx?.labels ?? []).forEach(([ci, key, text], n) => {
    const card = cardAt(ci);
    const [heading, parent] = where.get(`${ci}:${key}`) ?? ['', ''];
    if (!card || !heading) return;
    const score = rankWithCard(text, card, heading);
    if (!score) return;
    sectionHits.push({ score: score - 0.5 + inCard(card), tie: `${text}\0${card.title}`, hit: { id: `label:${card.id}:${key}:${n}`, title: text, subtitle: `${parent ? `${parent} · ` : ''}${heading} · ${card.title}`, cardId: card.id, section: key } });
  });

  const termHits: Scored[] = [];
  for (const [id, t] of Object.entries((content.data.term ?? {}) as Record<string, Term>)) {
    let score = rank(t.term);
    let alias: string | undefined;
    if (!score) {
      alias = (t.aliases ?? []).find((a) => rank(a));
      if (alias) score = 1;
    }
    if (!score) continue;
    const base = `Term · ${content.systems.find((s) => s.id === t.group)?.title ?? ''}`;
    termHits.push({ score, tie: t.term, hit: { id: `term:${id}`, title: t.term.charAt(0).toUpperCase() + t.term.slice(1), subtitle: alias ? `${base} · also called “${alias}”` : base, markSubtitle: !!alias, cardId: t.card ?? '', term: id } });
  }

  for (const [id, name, short, others, cardIdx] of idx?.tools ?? []) {
    const score = Math.max(rank(name), rank(short), ...others.split('|').filter(Boolean).map(rank));
    const used = cardIdx.map(cardAt).filter(Boolean);
    if (!score || !used.length) continue;
    const more = used.length > 1 ? ` and ${used.length - 1} more` : '';
    toolHits.push({ score, tie: name, hit: { id: `tool:${id}`, title: name, subtitle: `Calculator · used in ${used[0].title}${more}`, cardId: used[0].id, tool: id } });
  }

  const hits = (list: Scored[]) => [...list].sort(byScore).map((s) => s.hit);
  const groups: Results['groups'] = [
    { key: 'cards' as const, hits: hits(cardHits) },
    { key: 'terms' as const, hits: hits(termHits) },
    // A drug's own card comes first, then each dose in another card.
    { key: 'drugs' as const, hits: [...hits(drugHits), ...hits(doseHits)] },
    { key: 'sections' as const, hits: hits(sectionHits) },
    { key: 'tools' as const, hits: hits(toolHits) },
  ].filter((g) => g.hits.length > 0).map((g) => ({ ...g, label: GROUP_LABELS[g.key] }));
  return { oneLetter: false, groups };
}

const cardSubtitle = (c: Card, system: string) => `${cardTypeLabel(c)} · ${system}`;

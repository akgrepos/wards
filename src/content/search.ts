import { cardTypeLabel, norm } from './index';
import type { Card, Content } from './types';

// Search over card titles and aliases, section headings, drug names (with the cards whose doses use them) and calculators.
// The rows come from the index built with the content (scripts/content/search-index.mjs); no card text is searched.
// Every word typed must match the start of a word; a match at the start of the text ranks first.

export type GroupKey = 'cards' | 'drugs' | 'sections' | 'tools';
export const GROUP_LABELS: Record<GroupKey, string> = { cards: 'Cards', drugs: 'Drugs', sections: 'Sections', tools: 'Tools' };

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
};
export type Results = { oneLetter: boolean; groups: { key: GroupKey; label: string; hits: Hit[] }[] };

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

  for (const [ci, key, title, parent] of idx?.sections ?? []) {
    const card = cardAt(ci);
    const score = card && rank(title);
    if (!card || !score) continue;
    sectionHits.push({ score, tie: `${title}\0${card.title}`, hit: { id: `section:${card.id}:${key}`, title, subtitle: parent ? `${parent} · ${card.title}` : card.title, cardId: card.id, section: key } });
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
    // A drug's own card comes first, then each dose in another card.
    { key: 'drugs' as const, hits: [...hits(drugHits), ...hits(doseHits)] },
    { key: 'sections' as const, hits: hits(sectionHits) },
    { key: 'tools' as const, hits: hits(toolHits) },
  ].filter((g) => g.hits.length > 0).map((g) => ({ ...g, label: GROUP_LABELS[g.key] }));
  return { oneLetter: false, groups };
}

const cardSubtitle = (c: Card, system: string) => `${cardTypeLabel(c)} · ${system}`;

import content from 'virtual:wards-content';
import { CARD_TYPES } from '../../scripts/content/schema.mjs';
import type { Block, Card, Inline, ListItem, Pathway } from './types';

export { content };
export const cardTypeLabel = (c: Card) => (CARD_TYPES as Record<string, { label: string }>)[c.type]?.label ?? c.type;

export function getCard(id: string) {
  return content.cards.find((c) => c.id === id);
}
export function getSystem(id: string) {
  return content.systems.find((s) => s.id === id);
}

const alpha = (a: Card, b: Card) => a.title.localeCompare(b.title);
export function cardsInSystem(systemId: string) {
  return content.cards.filter((c) => c.system === systemId);
}

// A system's list: Approach, then topic subsections (alphabetical), then Reference; cards alphabetical within each.
export function systemGroups(systemId: string): { title: string; cards: Card[] }[] {
  const cards = cardsInSystem(systemId);
  const groups: { title: string; cards: Card[] }[] = [];
  const approach = cards.filter((c) => c.group === 'approach').sort(alpha);
  if (approach.length) groups.push({ title: 'Approach', cards: approach });
  const subs = [...new Set(cards.filter((c) => c.group === 'condition').map((c) => c.subsection ?? 'Other'))].sort((a, b) => a.localeCompare(b));
  for (const s of subs) groups.push({ title: s, cards: cards.filter((c) => c.group === 'condition' && (c.subsection ?? 'Other') === s).sort(alpha) });
  const ref = cards.filter((c) => c.group === 'reference').sort(alpha);
  if (ref.length) groups.push({ title: 'Reference', cards: ref });
  return groups;
}

// Sources of an inserted item (dose, threshold, pathway).
export function insertSources(kind: string, id: string): string[] {
  const item = content.data[kind]?.[id] as { sources?: string[] } | undefined;
  return item?.sources ?? [];
}

// Sources shown as an icon instead of by name (decided 2026-10-17):
// "practice" = common clinical practice (stethoscope); "reference" = checked with a clinical reference that isn't named (green check, last resort).
export const MARKER_KINDS = ['practice', 'reference'] as const;
export const isMarkerSource = (id: string) => MARKER_KINDS.includes((content.data.source?.[id] as { kind?: string } | undefined)?.kind as never);

// Sources of some blocks, in order of first use (their own markers, then inserted items'). Markers included.
export function blockSources(bs: Block[]): string[] {
  const seen: string[] = [];
  const add = (ids: string[]) => ids.forEach((s) => !seen.includes(s) && seen.push(s));
  const inl = (xs: Inline[]) => xs.forEach((x) => x.t === 'insert' && add(insertSources(x.kind, x.id)));
  const item = (it: ListItem) => { add(it.sources); inl(it.inlines); it.children.forEach(item); };
  const walk = (list: Block[]) => list.forEach((b) => {
    if (b.t === 'paragraph') { add(b.sources); inl(b.inlines); }
    if (b.t === 'list') b.items.forEach(item);
    if (b.t === 'table') { b.header.forEach(inl); b.rows.forEach((r) => { add(r.sources); r.cells.forEach(inl); }); }
    // A pathway shows as one Open row (its page lists its own sources), so its sources aren't the section's.
    if (b.t === 'insert' && b.kind !== 'pathway') add(insertSources(b.kind, b.id));
    if (b.t === 'steps') b.items.forEach((it) => { add(it.sources); inl(it.inlines); walk(it.blocks); });
    if (b.t === 'scale' || b.t === 'compare' || b.t === 'times' || b.t === 'onset' || b.t === 'note') { add(b.sources); inl(b.title); b.items.forEach((it) => { add(it.sources); inl(it.label); inl(it.inlines); }); }
  });
  walk(bs);
  return seen;
}

// All sources a card relies on, numbered in order of first use (header first). Markers left out.
export function cardSources(card: Card): string[] {
  const seen: string[] = [];
  const add = (ids: string[]) => ids.forEach((s) => !seen.includes(s) && seen.push(s));
  add(card.basedOn ?? []);
  if (card.definition) { add(card.definition.sources); add(blockSources([{ t: 'paragraph', inlines: card.definition.inlines, sources: [] }])); }
  card.sections.forEach((s) => { add(blockSources(s.blocks)); s.subsections.forEach((x) => add(blockSources(x.blocks))); });
  return seen.filter((id) => !isMarkerSource(id));
}

// Title Case for headings (Apple style), keeping short joining words lowercase.
const SMALL = new Set(['a', 'an', 'and', 'as', 'at', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'vs', 'with']);
export function titleCase(s: string) {
  return s.split(' ').map((w, i) => (i > 0 && SMALL.has(w.toLowerCase()) ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1))).join(' ');
}

// Topics with an emergency (a "## Do Now" section): their emergency pages make up the Rapids tab.
export function emergencyCards(): Card[] {
  return content.cards.filter((c) => c.emergency).sort(alpha);
}
export const hasEmergency = (id: string) => !!getCard(id)?.emergency;

// The Rapids tab: emergencies grouped by their topic's system, in the systems' order.
export function emergencyGroups(): { title: string; cards: Card[] }[] {
  const cards = emergencyCards();
  return content.systems
    .map((s) => ({ title: s.title, cards: cards.filter((c) => c.system === s.id) }))
    .filter((g) => g.cards.length);
}

// Every pathway map and the card it maps (its "card:" field), A–Z. A card shows its map as a row under its title.
export function pathwayHomes(): { id: string; title: string; card: Card }[] {
  const out: { id: string; title: string; card: Card }[] = [];
  for (const [id, p] of Object.entries((content.data.pathway ?? {}) as Record<string, Pathway>)) {
    const card = getCard(p.card);
    if (card) out.push({ id, title: p.title, card });
  }
  return out.sort((a, b) => a.title.localeCompare(b.title));
}
export const pathwayFor = (cardId: string) => pathwayHomes().find((h) => h.card.id === cardId);

// Basic search over card titles and aliases (full search across sections, drugs and tools comes later).
// Every word typed must match the start of a word in the title or an alias; title matches rank first.
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
export function searchCards(query: string): Card[] {
  const words = norm(query).split(' ').filter(Boolean);
  if (!words.length) return [];
  const matches = (text: string) => {
    const t = ' ' + norm(text);
    return words.every((w) => t.includes(' ' + w));
  };
  const scored: { card: Card; score: number }[] = [];
  for (const card of content.cards) {
    const title = norm(card.title);
    let score = 0;
    if (matches(card.title)) score = title.startsWith(words.join(' ')) ? 3 : 2;
    else if (card.aliases.some(matches)) score = 1;
    if (score) scored.push({ card, score });
  }
  return scored.sort((a, b) => b.score - a.score || alpha(a.card, b.card)).map((s) => s.card);
}

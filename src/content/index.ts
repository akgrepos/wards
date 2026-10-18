import content from 'virtual:wards-content';
import { CARD_TYPES } from '../../scripts/content/schema.mjs';
import type { Block, Card, Inline, ListItem } from './types';

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

// All sources a card relies on, numbered in order of first use (its own markers, then inserted items').
export function cardSources(card: Card): string[] {
  const seen: string[] = [];
  const add = (ids: string[]) => ids.forEach((s) => !seen.includes(s) && seen.push(s));
  const inl = (xs: Inline[]) => xs.forEach((x) => x.t === 'insert' && add(insertSources(x.kind, x.id)));
  const item = (it: ListItem) => { add(it.sources); inl(it.inlines); it.children.forEach(item); };
  const blocks = (bs: Block[]) => bs.forEach((b) => {
    if (b.t === 'paragraph') { add(b.sources); inl(b.inlines); }
    if (b.t === 'list') b.items.forEach(item);
    if (b.t === 'table') { b.header.forEach(inl); b.rows.forEach((r) => { add(r.sources); r.cells.forEach(inl); }); }
    if (b.t === 'insert') add(insertSources(b.kind, b.id));
  });
  card.sections.forEach((s) => { blocks(s.blocks); blocks(s.more); });
  return seen;
}

// Title Case for headings (Apple style), keeping short joining words lowercase.
const SMALL = new Set(['a', 'an', 'and', 'as', 'at', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'vs', 'with']);
export function titleCase(s: string) {
  return s.split(' ').map((w, i) => (i > 0 && SMALL.has(w.toLowerCase()) ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1))).join(' ');
}

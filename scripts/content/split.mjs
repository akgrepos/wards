// Splits the loaded content into what the app needs at start (the index) and one file per card.
// The index: systems, every card without its text (title, aliases, sections' names, Rapids hint …) and a short entry for each
// pathway (Library and card lists). A card file: the whole card plus every data item it uses (doses, criteria, calculators,
// pathways, coverage, sources, media …), so opening a card is one fetch. Shared data appears in every card file that uses it.

const INSERT = /\{\{\s*([a-z-]+)\s*:\s*([a-z0-9-]+)\s*\}\}/g;

// Every data item a piece of JSON points to: a string that is an item's id, or a {{kind:id}} insert inside text.
function refs(value, byId, found) {
  if (typeof value === 'string') {
    for (const k of byId.get(value) ?? []) found.add(k);
    if (value.includes('{{')) for (const m of value.matchAll(INSERT)) found.add(`${m[1]}/${m[2]}`);
  } else if (Array.isArray(value)) {
    for (const v of value) refs(v, byId, found);
  } else if (value && typeof value === 'object') {
    for (const v of Object.values(value)) refs(v, byId, found);
  }
}

const withoutFile = ({ _file, ...rest }) => rest;

export function splitContent(content) {
  const byId = new Map(); // item id → ["kind/id", …]
  const items = new Map(); // "kind/id" → item
  for (const [kind, list] of Object.entries(content.data)) {
    for (const [id, item] of Object.entries(list)) {
      const key = `${kind}/${id}`;
      items.set(key, withoutFile(item));
      byId.set(id, [...(byId.get(id) ?? []), key]);
    }
  }

  const cards = {};
  for (const card of content.cards) {
    const found = new Set();
    refs(card, byId, found);
    // A pathway belongs to the card it names, even when the card's text doesn't insert it.
    for (const [kind, list] of Object.entries(content.data)) {
      if (kind !== 'pathway') continue;
      for (const [id, p] of Object.entries(list)) if (p.card === card.id) found.add(`pathway/${id}`);
    }
    // Follow references from item to item (a regimen's doses, a dose's sources …).
    const todo = [...found];
    while (todo.length) {
      const key = todo.pop();
      const item = items.get(key);
      // A pointer to an item that doesn't exist must stop the build, never be dropped quietly.
      if (!item) throw new Error(`Card "${card.id}" uses ${key}, but no such data item exists.`);
      const more = new Set();
      refs(item, byId, more);
      for (const k of more) if (!found.has(k) && items.has(k)) { found.add(k); todo.push(k); }
    }
    const data = {};
    for (const key of found) {
      const [kind, id] = key.split('/');
      (data[kind] ??= {})[id] = items.get(key);
    }
    const { file, scaffold, unknownSections, unknownSubsections, ...rest } = card;
    cards[card.id] = { card: rest, data };
  }

  const lite = content.cards.map((c) => ({
    id: c.id, type: c.type, variant: c.variant, system: c.system, group: c.group, subsection: c.subsection,
    title: c.title, aliases: c.aliases, related: c.related, example: c.example, contentsSub: c.contentsSub,
    definition: null, basedOn: [], checked: c.checked,
    // Section names only (Continue Reading), and the Rapids hint; the text comes with the card's file.
    sections: c.sections.map((s) => ({ key: s.key, title: s.title, blocks: [], subsections: [] })),
    emergency: c.emergency ? { hint: c.emergency.hint, blocks: [] } : null,
  }));
  const pathways = {};
  for (const [id, p] of Object.entries(content.data.pathway ?? {})) pathways[id] = { title: p.title, summary: p.summary, card: p.card };

  return { index: { systems: content.systems, cards: lite, data: { pathway: pathways } }, cards, files: content.cards.map((c) => c.file) };
}

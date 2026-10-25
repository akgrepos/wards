// The search index, built with the content (it travels inside the small index the app loads at start, so search works offline).
// Short rows, no text: a card's titles and aliases are already in the index; this adds
//   sections: every section heading and More Information subsection heading, with the card it is in,
//   drugs:    every drug name (and brand names) of the doses a card uses, with the section that shows the dose,
//   tools:    the calculators that open inside the app (a score or a formula), with the cards that use them.
// Rows are arrays to keep the file small. src/content/search.ts reads them.
//
//   sections: [cardIndex, key, title, parentTitle]            parentTitle is '' for a top-level section
//   drugs:    [drugName, brandNames, cardIndex, key, title, drugId]   key/title: the section holding the dose ('' if none)
//   tools:    [calcId, name, short, otherNames, cardIndexes]
//   labels:   [cardIndex, key, text]   smaller names inside a section (key/title as in sections): the names of scale and
//             comparison blocks and their bands, criteria titles, bold bullet labels, calculator short names

const plain = (inlines) => (inlines ?? []).map((i) => (i.t === 'text' || i.t === 'strong' || i.t === 'em' ? i.v : i.t === 'insert' ? i.label ?? '' : '')).join('').trim();
const fold = (t) => t.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').trim();
const CONTAINER_TITLES = new Set(['scale', 'compare', 'times', 'onset']);
const LABEL_MAX = 48;

// The short names a block (and what it holds) offers to search, in page order.
function blockLabels(blocks, out) {
  for (const b of blocks ?? []) {
    if (b.t === 'list') listLabels(b.items, out);
    else if (b.t === 'steps') for (const it of b.items) blockLabels(it.blocks, out);
    else if (CONTAINER_TITLES.has(b.t)) {
      out.push(plain(b.title));
      if (b.t === 'scale') for (const it of b.items) out.push(plain(it.label));
    }
  }
}
function listLabels(items, out) {
  for (const it of items) {
    const first = it.inlines?.[0];
    // "**Label:** text": the bold words at the start of a bullet.
    if (first?.t === 'strong') out.push(first.v.replace(/[:\s]+$/, ''));
    listLabels(it.children ?? [], out);
  }
}

export function buildSearchIndex(content, { refs, byId, items }) {
  const reach = (value) => {
    const found = new Set();
    refs(value, byId, found);
    const todo = [...found];
    while (todo.length) {
      const item = items.get(todo.pop());
      if (!item) continue;
      const more = new Set();
      refs(item, byId, more);
      for (const k of more) if (!found.has(k) && items.has(k)) { found.add(k); todo.push(k); }
    }
    return found;
  };

  const sections = [];
  const labels = [];
  const drugs = [];
  const toolCards = new Map(); // calc id → card indexes

  content.cards.forEach((card, ci) => {
    // Where each drug's dose is shown, in page order: the first section (or More Information subsection) holding it.
    const seenDrugs = new Map(); // drug name → { brands, key, title }
    const note = (found, key, title) => {
      for (const k of found) {
        if (!k.startsWith('dose/')) continue;
        const dose = items.get(k);
        if (!dose?.drug_name || seenDrugs.has(dose.drug_name)) continue;
        seenDrugs.set(dose.drug_name, { brands: new Set(), key, title, own: dose.drug ?? '' });
      }
    };
    const brandsOf = (found) => {
      for (const k of found) {
        const dose = k.startsWith('dose/') ? items.get(k) : null;
        if (dose?.brand && seenDrugs.has(dose.drug_name)) seenDrugs.get(dose.drug_name).brands.add(dose.brand);
      }
    };
    const passes = [];
    const seenLabels = new Set(); // folded text, once per card
    const addLabels = (key, title, blocks) => {
      const found = new Set();
      refs(blocks, byId, found);
      const out = [];
      blockLabels(blocks, out);
      for (const k of found) {
        const item = items.get(k);
        if (k.startsWith('criteria/') && item?.title) out.push(item.title.replace(/,\s*\d{4}$/, ''));
        if (k.startsWith('calc/') && item?.short) out.push(item.short);
      }
      for (const text of out) {
        const f = fold(text);
        if (f.length < 2 || text.length > LABEL_MAX || /^\d+$/.test(f) || f === fold(title) || seenLabels.has(f)) continue;
        seenLabels.add(f);
        labels.push([ci, key, text]);
      }
    };
    for (const s of card.sections) seenLabels.add(fold(s.title));
    for (const s of card.sections) for (const x of s.subsections) seenLabels.add(fold(x.title));
    for (const s of card.sections) {
      sections.push([ci, s.key, s.title, '']);
      addLabels(s.key, s.title, s.blocks);
      passes.push([reach(s.blocks), s.key, s.title]);
      for (const x of s.subsections) {
        sections.push([ci, x.key, x.title, s.title]);
        addLabels(x.key, x.title, x.blocks);
        passes.push([reach(x.blocks), x.key, x.title]);
      }
    }
    if (card.emergency) passes.push([reach(card.emergency.blocks), '', '']);
    if (card.definition) passes.push([reach(card.definition), '', '']);
    for (const [found, key, title] of passes) note(found, key, title);
    for (const [found] of passes) brandsOf(found);
    for (const [name, d] of seenDrugs) drugs.push([name, [...d.brands].join('|'), ci, d.key, d.title, d.own]);

    for (const k of reach(card)) {
      if (!k.startsWith('calc/')) continue;
      const id = k.slice(5);
      if (!items.get(k)?.calculator) continue;
      toolCards.set(id, [...(toolCards.get(id) ?? []), ci]);
    }
  });

  const tools = [...toolCards].map(([id, cardIndexes]) => {
    const c = items.get(`calc/${id}`);
    return [id, c.name, c.short, (c.match ?? []).join('|'), cardIndexes];
  });

  return { sections, labels, drugs, tools };
}

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
    for (const s of card.sections) {
      sections.push([ci, s.key, s.title, '']);
      passes.push([reach(s.blocks), s.key, s.title]);
      for (const x of s.subsections) {
        sections.push([ci, x.key, x.title, s.title]);
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

  return { sections, drugs, tools };
}

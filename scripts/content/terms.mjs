// Terms (docs/DATA-TYPES.md, 12): words the app can define. Cards are never tagged by hand. At build time the first
// mention of a term (or one of its aliases) in each section becomes a tap-to-define inline:
//   { t: 'insert', kind: 'term', id, label: <the words as written> }
// Nothing is tagged inside a link, a {{dose}} or {{calc}} pill, bold or italic words, a heading, a table header, the
// definition under the title, or the Do Now steps. A backslash before a word ("\catatonia") turns tagging off for
// that spot; the backslash is removed. A card's own term (its title, aliases, or a term whose `card` is the card) is
// never tagged on that card.

const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const escapeRe = (t) => t.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');
// An abbreviation (DKA, PRES) is matched only in capitals, so "pres" never matches inside ordinary writing.
const isAbbreviation = (a) => /^[A-Z0-9][A-Za-z0-9]*$/.test(a) && /[A-Z]{2}/.test(a);

/** Every spelling a term answers to: its name, then its aliases. */
export const termNames = (t) => [t.term, ...(t.aliases ?? [])].filter((x) => typeof x === 'string' && x.trim()).map((x) => x.trim());

/** Builds the finder: text → the first match of any term, or nothing. */
export function termMatcher(terms) {
  const byName = new Map(); // lower-case name → { id, name }
  for (const [id, t] of Object.entries(terms ?? {})) for (const name of termNames(t)) if (!byName.has(name.toLowerCase())) byName.set(name.toLowerCase(), { id, name });
  const names = [...byName.keys()].sort((a, b) => b.length - a.length);
  if (!names.length) return () => [];
  const re = new RegExp(`(\\\\?)(?<![\\p{L}\\p{N}-])(${names.map(escapeRe).join('|')})(?![\\p{L}\\p{N}])`, 'giu');
  return (text) => {
    const out = [];
    for (const m of text.matchAll(re)) {
      const hit = byName.get(m[2].toLowerCase());
      if (isAbbreviation(hit.name) && m[2] !== hit.name) continue;
      out.push({ index: m.index, length: m[0].length, escaped: m[1] === '\\', text: m[2], id: hit.id });
    }
    return out;
  };
}

// The inline runs of body text in a list of blocks (headings, table headers and bold labels are left alone).
function* bodyRuns(blocks) {
  for (const b of blocks ?? []) {
    if (b.t === 'paragraph') yield b.inlines;
    else if (b.t === 'list') yield* listRuns(b.items);
    else if (b.t === 'table') for (const r of b.rows) for (const c of r.cells) yield c;
    else if (b.t === 'steps') for (const it of b.items) { yield it.inlines; yield* bodyRuns(it.blocks); }
    else if (b.t === 'scale' || b.t === 'compare' || b.t === 'note') for (const it of b.items) yield it.inlines;
  }
}
function* listRuns(items) {
  for (const it of items) { yield it.inlines; yield* listRuns(it.children ?? []); }
}

/**
 * Tags the cards in place. Returns where each term ended up: Map term id → Set of card ids.
 * A mention that is "owned" by the card (its own title or term) is skipped.
 */
export function tagTerms(cards, terms) {
  const find = termMatcher(terms);
  const uses = new Map();
  for (const card of cards) {
    const own = new Set([card.title, ...(card.aliases ?? [])].map((x) => norm(String(x))));
    const skip = new Set(Object.entries(terms ?? {}).filter(([, t]) => t.card === card.id || termNames(t).some((n) => own.has(norm(n)))).map(([id]) => id));
    const scopes = card.sections.flatMap((s) => [s.blocks, ...(s.subsections ?? []).map((x) => x.blocks)]);
    for (const blocks of scopes) {
      const seen = new Set();
      for (const inlines of bodyRuns(blocks)) {
        for (let i = 0; i < inlines.length; i++) {
          const x = inlines[i];
          if (x.t !== 'text') continue;
          const parts = [];
          let last = 0;
          for (const m of find(x.v)) {
            if (m.index < last) continue;
            if (m.escaped) { parts.push({ t: 'text', v: x.v.slice(last, m.index) + x.v.slice(m.index + 1, m.index + m.length) }); last = m.index + m.length; continue; }
            if (skip.has(m.id) || seen.has(m.id)) continue;
            seen.add(m.id);
            if (m.index > last) parts.push({ t: 'text', v: x.v.slice(last, m.index) });
            parts.push({ t: 'insert', kind: 'term', id: m.id, label: m.text });
            last = m.index + m.length;
            if (!uses.has(m.id)) uses.set(m.id, new Set());
            uses.get(m.id).add(card.id);
          }
          if (!parts.length) continue;
          if (last < x.v.length) parts.push({ t: 'text', v: x.v.slice(last) });
          // Neighbouring text pieces are joined, so the page has no stray breaks.
          const merged = [];
          for (const p of parts) { const prev = merged[merged.length - 1]; if (p.t === 'text' && prev?.t === 'text') prev.v += p.v; else merged.push(p); }
          inlines.splice(i, 1, ...merged);
          i += merged.length - 1;
        }
      }
    }
  }
  return uses;
}

/** A backslash left in card text that does not sit before a term. */
export function strayBackslashes(cards) {
  const out = [];
  for (const card of cards) {
    const scopes = card.sections.flatMap((s) => [s.blocks, ...(s.subsections ?? []).map((x) => x.blocks)]);
    for (const blocks of scopes) for (const inlines of bodyRuns(blocks)) for (const x of inlines) if (x.t === 'text' && x.v.includes('\\')) out.push(`${card.file}: a backslash ("${x.v.slice(Math.max(0, x.v.indexOf('\\') - 15), x.v.indexOf('\\') + 15)}") is not before a term; a backslash only switches term tagging off for one word`);
  }
  return out;
}

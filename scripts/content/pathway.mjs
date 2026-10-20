// Pathway maps (owner, 2026-10-19): one whole-card flowchart per condition, laid out on a grid. Boxes link to the
// card's own content instead of copying it. Shared by the content check and the app.
//
// A link is "kind:target", optionally "|label":
//   section:<card>/<section>[#<anchor>]  a section of a card; the anchor is a subheading ("#### First line"), a
//                                        numbered step's title, or a More Information subsection key
//   criteria:<id> · dose:<id>            opens its sheet
//   card:<id>                            another card (its page)
//   emergency:<id>                       a card's Rapids page (Do Now steps, Timed Mode)
import { parseInline } from './inline.mjs';

export const NODE_KINDS = ['start', 'question', 'do', 'urgent', 'note', 'result', 'link'];
export const LINK_KINDS = ['section', 'criteria', 'dose', 'card', 'emergency'];

// "Urinary indices (oliguric AKI)" → "urinary-indices-oliguric-aki"
export const slug = (text) => String(text).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const plain = (inlines) => inlines.map((x) => (x.t === 'insert' ? '' : x.v ?? x.label ?? '')).join('').trim();

// The anchors a section offers: its subheadings, its numbered steps' titles and (More Information) subsection keys,
// each with the words shown for it.
export function sectionAnchors(section) {
  const out = new Map();
  const walk = (blocks) => {
    for (const b of blocks) {
      if (b.t === 'subheading') out.set(slug(b.text), b.text);
      if (b.t === 'steps') for (const it of b.items) { const t = plain(it.inlines); out.set(slug(t), t); walk(it.blocks); }
    }
  };
  walk(section.blocks);
  for (const s of section.subsections ?? []) out.set(s.key, s.title);
  return out;
}

export function parseLink(ref) {
  const [body, label] = String(ref).split('|');
  const i = body.indexOf(':');
  const kind = body.slice(0, i);
  const rest = body.slice(i + 1);
  if (kind === 'section') {
    const [path, anchor] = rest.split('#');
    const [card, section] = path.split('/');
    return { kind, card, section, anchor: anchor || undefined, label: label || undefined, ref };
  }
  return { kind, id: rest, label: label || undefined, ref };
}

// Resolves a link against the content: its words, and what it opens. `error` says what's wrong when it can't.
export function resolveLink(ref, { cards, data }) {
  const l = parseLink(ref);
  if (!LINK_KINDS.includes(l.kind)) return { ...l, error: `unknown link kind "${l.kind}" (use ${LINK_KINDS.join(', ')})` };
  if (l.kind === 'section') {
    const card = cards.find((c) => c.id === l.card);
    if (!card) return { ...l, error: `links to unknown card "${l.card}"` };
    const sec = card.sections.find((s) => s.key === l.section);
    if (!sec) return { ...l, error: `links to unknown section "${l.section}" of ${l.card} (it has ${card.sections.map((s) => s.key).join(', ')})` };
    if (l.anchor) {
      const anchors = sectionAnchors(sec);
      if (!anchors.has(l.anchor)) return { ...l, error: `links to "${l.anchor}", which is not a subheading, step or subsection of ${l.card}/${l.section} (it has ${[...anchors.keys()].join(', ') || 'none'})` };
      return { ...l, text: l.label ?? anchors.get(l.anchor), where: sec.title, cardTitle: card.title };
    }
    return { ...l, text: l.label ?? sec.title, cardTitle: card.title };
  }
  if (l.kind === 'card' || l.kind === 'emergency') {
    const card = cards.find((c) => c.id === l.id);
    if (!card) return { ...l, error: `links to unknown card "${l.id}"` };
    if (l.kind === 'emergency' && !card.emergency) return { ...l, error: `${l.id} has no Rapids page (no "## Do Now")` };
    return { ...l, text: l.label ?? (l.kind === 'emergency' ? `${card.title}: Do Now` : card.title), cardTitle: card.title };
  }
  const item = data[l.kind]?.[l.id];
  if (!item) return { ...l, error: `links to unknown ${l.kind} "${l.id}"` };
  return { ...l, text: l.label ?? (l.kind === 'dose' ? item.drug_name : item.short ?? item.name) };
}

// Every problem with one pathway map, as messages.
export function checkPathway(id, p, content) {
  const out = [];
  const nodes = p.nodes ?? {};
  const card = content.cards.find((c) => c.id === p.card);
  if (!card) out.push(`belongs to unknown card "${p.card}" (set "card:" to the card it maps)`);
  if (!nodes[p.start]) out.push(`start node "${p.start}" does not exist`);
  const cols = p.columns ?? 0;
  if (!Number.isInteger(cols) || cols < 1) out.push('needs "columns" (how many grid columns the map uses)');
  const cells = new Map();
  const place = (where, at) => {
    if (!Array.isArray(at) || at.length !== 2 || !at.every((n) => Number.isInteger(n) && n >= 0)) { out.push(`${where} needs "at: [column, row]"`); return; }
    if (at[0] >= cols) out.push(`${where} is in column ${at[0]}, outside the ${cols} columns`);
    const k = at.join(',');
    if (cells.has(k)) out.push(`${where} and ${cells.get(k)} share the cell [${k}]`);
    cells.set(k, where);
  };
  const checkText = (where, t) => {
    if (typeof t !== 'string') return;
    for (const x of parseInline(t)) {
      if (x.t === 'insert' && !content.data[x.kind]?.[x.id]) out.push(`${where} inserts unknown ${x.kind} "${x.id}"`);
      if (x.t === 'insert' && x.kind === 'dose') out.push(`${where}: link a dose (links: [dose:${x.id}]) instead of inserting it in the text`);
      if (x.t === 'link') out.push(`${where}: use "links:" for links, not [[…]] in the text`);
    }
  };
  const checkLink = (where, ref) => { const r = resolveLink(ref, content); if (r.error) out.push(`${where} ${r.error}`); };
  const targets = new Map();
  for (const [nid, n] of Object.entries(nodes)) {
    const where = `node "${nid}"`;
    if (!NODE_KINDS.includes(n.kind)) out.push(`${where} has unknown kind "${n.kind}" (use ${NODE_KINDS.join(', ')})`);
    place(where, n.at);
    if (n.kind !== 'link' && !n.title) out.push(`${where} needs a title`);
    for (const t of [n.title, n.text]) checkText(where, t);
    for (const ref of n.links ?? []) checkLink(where, ref);
    const to = [];
    if (n.kind === 'question') {
      if (!n.answers?.length) out.push(`${where} is a question with no answers`);
      for (const [i, a] of (n.answers ?? []).entries()) {
        place(`${where} answer ${i + 1}`, a.at);
        if (!a.label) out.push(`${where} answer ${i + 1} needs a label`);
        checkText(`${where} answer "${a.label}"`, a.detail);
        if (!nodes[a.to]) out.push(`${where} answer "${a.label}" leads to missing node "${a.to}"`);
        to.push(a.to);
      }
    } else if (n.kind === 'link') {
      if (!n.to) out.push(`${where} needs "to" (what it opens)`); else checkLink(where, n.to);
      if (n.from && !nodes[n.from]) out.push(`${where} hangs from missing node "${n.from}"`);
    } else if (n.kind === 'result') {
      if (n.next) out.push(`${where} is a result; results end the route (no "next")`);
    } else {
      if (!n.next) out.push(`${where} leads nowhere (needs "next")`);
      else if (!nodes[n.next]) out.push(`${where} leads to missing node "${n.next}"`);
      if (n.next) to.push(n.next);
    }
    targets.set(nid, to);
  }
  for (const ref of p.footer ?? []) checkLink('footer', ref);
  // Every box is reachable from the start (a link box hangs from the box it belongs to).
  const seen = new Set();
  const stack = [p.start];
  while (stack.length) { const k = stack.pop(); if (!k || seen.has(k) || !nodes[k]) continue; seen.add(k); stack.push(...(targets.get(k) ?? [])); }
  for (const [nid, n] of Object.entries(nodes)) {
    if (n.kind === 'link' && n.from) continue;
    if (!seen.has(nid)) out.push(`node "${nid}" can't be reached from the start`);
  }
  return out.map((m) => `${id}: ${m}`);
}

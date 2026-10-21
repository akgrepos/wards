// Pathways (owner, 2026-10-20): focused, levelled flowcharts that supplement a card (a card may have several).
// Boxes sit on a grid; their text and doses come from the card itself; a few links open the card's own content.
// Shared by the content check and the app.
//
// A link is "kind:target", optionally "|label":
//   section:<card>/<section>[#<anchor>]  a section of a card; the anchor is a subheading ("#### First line"), a
//                                        numbered step's title, or a More Information subsection key
//   criteria:<id> · dose:<id>            opens its sheet
//   card:<id>                            another card (its page)
//   emergency:<id>                       a card's Rapids page (Do Now steps, Timed Mode)
import { parseInline } from './inline.mjs';

export const NODE_KINDS = ['start', 'question', 'do', 'urgent', 'note', 'result'];
export const PATHWAY_FIELDS = ['title', 'card', 'summary', 'columns', 'start', 'levels', 'nodes', 'sources'];
export const NODE_FIELDS = ['kind', 'at', 'span', 'title', 'text', 'links', 'answers', 'next'];
export const ANSWER_FIELDS = ['label', 'detail', 'at', 'span', 'to'];

// A line of a box's text that is only a dose insert shows the card's dose row.
export const doseLine = (line) => { const m = /^\{\{dose:([a-z0-9-]+)\}\}$/.exec(String(line).trim()); return m ? m[1] : null; };
export const textLines = (t) => (t == null ? [] : Array.isArray(t) ? t : [t]);
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

// Every problem with one pathway, as messages.
export function checkPathway(id, p, content) {
  const out = [];
  for (const f of Object.keys(p)) if (!PATHWAY_FIELDS.includes(f) && f !== '_file') out.push(`unknown field "${f}" (use ${PATHWAY_FIELDS.join(', ')})`);
  const nodes = p.nodes ?? {};
  const card = content.cards.find((c) => c.id === p.card);
  if (!card) out.push(`belongs to unknown card "${p.card}" (set "card:" to the card it supplements)`);
  // Doses come from the card: only dose items the card itself shows.
  const cardJson = card ? JSON.stringify(card) : '';
  // A dose the card shows as another dose's alternative ("Or …" under its row) counts too.
  const shown = (dose) => cardJson.includes(`"kind":"dose","id":"${dose}"`);
  const onCard = (dose) => shown(dose)
    || Object.entries(content.data.dose ?? {}).some(([id, d]) => d?.alternative?.dose === dose && shown(id));
  if (!nodes[p.start]) out.push(`start node "${p.start}" does not exist`);
  const cols = p.columns ?? 0;
  if (!Number.isInteger(cols) || cols < 1) out.push('needs "columns" (how many grid columns the pathway uses)');
  const cells = new Map();
  const place = (where, at, span = 1) => {
    if (!Array.isArray(at) || at.length !== 2 || !at.every((n) => Number.isInteger(n) && n >= 0)) { out.push(`${where} needs "at: [column, row]"`); return; }
    if (!Number.isInteger(span) || span < 1) { out.push(`${where}: "span" must be a whole number of columns`); return; }
    if (at[0] + span > cols) out.push(`${where} reaches column ${at[0] + span - 1}, outside the ${cols} columns`);
    for (let c = at[0]; c < at[0] + span; c++) {
      const k = `${c},${at[1]}`;
      if (cells.has(k)) out.push(`${where} and ${cells.get(k)} overlap at [${k}]`);
      cells.set(k, where);
    }
  };
  const checkText = (where, t) => {
    if (typeof t !== 'string') { if (t !== undefined) out.push(`${where}: text must be words`); return; }
    const dose = doseLine(t);
    if (dose) {
      if (!content.data.dose?.[dose]) out.push(`${where} shows unknown dose "${dose}"`);
      else if (card && !onCard(dose)) out.push(`${where} shows dose "${dose}", which is not on ${p.card}: use the card's own dose items`);
      return;
    }
    for (const x of parseInline(t)) {
      if (x.t === 'insert' && !content.data[x.kind]?.[x.id]) out.push(`${where} inserts unknown ${x.kind} "${x.id}"`);
      if (x.t === 'insert' && x.kind === 'dose') out.push(`${where}: put {{dose:${x.id}}} on a line of its own (it shows as the dose row)`);
      if (x.t === 'link') out.push(`${where}: use "links:" for links, not [[…]] in the text`);
    }
  };
  const checkLink = (where, ref) => { const r = resolveLink(ref, content); if (r.error) out.push(`${where} ${r.error}`); };
  const targets = new Map();
  for (const [nid, n] of Object.entries(nodes)) {
    const where = `node "${nid}"`;
    for (const f of Object.keys(n)) if (!NODE_FIELDS.includes(f)) out.push(`${where}: unknown field "${f}" (use ${NODE_FIELDS.join(', ')})`);
    if (!NODE_KINDS.includes(n.kind)) out.push(`${where} has unknown kind "${n.kind}" (use ${NODE_KINDS.join(', ')})`);
    place(where, n.at, n.span ?? 1);
    if (!n.title) out.push(`${where} needs a title`);
    checkText(where, n.title);
    for (const t of textLines(n.text)) checkText(where, t);
    if ((n.links ?? []).length > 2) out.push(`${where} has ${n.links.length} links; keep at most two (a pathway supplements the card)`);
    for (const ref of n.links ?? []) checkLink(where, ref);
    const to = [];
    if (n.kind === 'question') {
      if (!n.answers?.length) out.push(`${where} is a question with no answers`);
      if (n.next) out.push(`${where} is a question; its answers lead on (no "next")`);
      for (const [i, a] of (n.answers ?? []).entries()) {
        for (const f of Object.keys(a ?? {})) if (!ANSWER_FIELDS.includes(f)) out.push(`${where} answer ${i + 1}: unknown field "${f}" (use ${ANSWER_FIELDS.join(', ')})`);
        place(`${where} answer ${i + 1}`, a.at, a.span ?? 1);
        if (!a.label) out.push(`${where} answer ${i + 1} needs a label`);
        checkText(`${where} answer "${a.label}"`, a.detail);
        if (a.detail && doseLine(a.detail)) out.push(`${where} answer "${a.label}": an answer can't show a dose`);
        if (!nodes[a.to]) out.push(`${where} answer "${a.label}" leads to missing node "${a.to}"`);
        to.push(a.to);
      }
    } else if (n.kind === 'result') {
      if (n.next) out.push(`${where} is a result; results end the route (no "next")`);
    } else {
      if (!n.next) out.push(`${where} leads nowhere (needs "next")`);
      else if (!nodes[n.next]) out.push(`${where} leads to missing node "${n.next}"`);
      if (n.next) to.push(n.next);
    }
    targets.set(nid, to);
  }
  for (const [i, l] of (p.levels ?? []).entries()) {
    if (!l?.title || !Number.isInteger(l.row)) out.push(`level ${i + 1} needs { title, row }`);
  }
  // Every box is reachable from the start, and every route ends in a result.
  const seen = new Set();
  const stack = [p.start];
  while (stack.length) { const k = stack.pop(); if (!k || seen.has(k) || !nodes[k]) continue; seen.add(k); stack.push(...(targets.get(k) ?? [])); }
  for (const nid of Object.keys(nodes)) if (!seen.has(nid)) out.push(`node "${nid}" can't be reached from the start`);
  if (!Object.values(nodes).some((n) => n.kind === 'result')) out.push('needs a result box (where routes end)');
  return out.map((m) => `${id}: ${m}`);
}

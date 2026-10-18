// Content checks, run on every pull request (npm run content:check) and in the tests.
// Each rule comes from docs/CARD-TYPES.md and docs/DATA-TYPES.md.
import { CARD_TYPES, DATA_TYPES, DOSE_FIELDS, SHARED_SECTIONS, UNITS, DOSE_IN_TEXT } from './schema.mjs';
import { TAGS } from './inline.mjs';
import { onsetMinutes } from './onset.mjs';

const DOSE_ONLY = /^\{\{\s*dose\s*:\s*([a-z0-9-]+)\s*\}\}$/;

function inlineText(inlines) {
  return inlines.filter((x) => x.t !== 'insert' && x.t !== 'link').map((x) => x.v ?? '').join('');
}

// Every block's inline runs, with the sources attached to it (steps and containers included).
function* runs(blocks) {
  for (const b of blocks) {
    if (b.t === 'paragraph') yield { inlines: b.inlines, sources: b.sources };
    // A sub-bullet without its own source uses its parent's.
    if (b.t === 'list') for (const it of b.items) { yield { inlines: it.inlines, sources: it.sources }; for (const c of it.children) yield { inlines: c.inlines, sources: c.sources.length ? c.sources : it.sources }; }
    if (b.t === 'table') { for (const h of b.header) yield { inlines: h, sources: [], header: true }; for (const r of b.rows) for (const c of r.cells) yield { inlines: c, sources: r.sources }; }
    if (b.t === 'steps') for (const it of b.items) { yield { inlines: it.inlines, sources: it.sources, header: true }; yield* runs(it.blocks); }
    if (b.t === 'scale' || b.t === 'compare') {
      yield { inlines: b.title, sources: b.sources, header: true };
      for (const it of b.items) yield { inlines: [...it.label, ...it.inlines], sources: it.sources.length ? it.sources : b.sources };
    }
    if (b.t === 'times') yield { inlines: b.title, sources: b.sources, timesTitle: true };
    if (b.t === 'onset') {
      yield { inlines: b.title, sources: b.sources, header: true };
      // Dose items carry their own onset and sources; the others are "Name: onset | lasts ^[source]".
      for (const it of b.items) if (!DOSE_ONLY.test(it.text.trim())) yield { inlines: [...it.label, ...it.inlines], sources: it.sources.length ? it.sources : b.sources };
    }
  }
}

// Every block, steps' contents included.
function* allBlocks(blocks) {
  for (const b of blocks) { yield b; if (b.t === 'steps') for (const it of b.items) yield* allBlocks(it.blocks); }
}

const CONTAINERS = { scale: [2, 5], compare: [2, 3], times: [1, 12], onset: [2, 12] };

export function checkContent({ systems, cards, data }) {
  const errors = [];
  const err = (where, msg) => errors.push(`${where}: ${msg}`);
  const systemIds = new Set(systems.map((s) => s.id));
  for (const s of systems) if (typeof s.title !== 'string' || !s.title || typeof s.id !== 'string') errors.push(`content/systems.yaml: system "${s.id}" needs an id and a title (quote titles that contain commas)`);
  const cardIds = new Map();

  for (const c of cards) {
    const where = c.file;
    if (!c.id || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(c.id)) err(where, `card id "${c.id}" must be lowercase words joined by hyphens`);
    if (cardIds.has(c.id)) err(where, `card id "${c.id}" is also used by ${cardIds.get(c.id)}`);
    cardIds.set(c.id, c.file);
    if (!c.title) err(where, 'missing title');
    if (c.group === 'condition' && !c.subsection) err(where, 'condition cards need a subsection (e.g. "Arrhythmias")');
    if (c.group !== 'condition' && c.subsection) err(where, 'only condition cards have a subsection; approach and reference cards are listed in their own groups');
    if (!systemIds.has(c.system)) err(where, `unknown system "${c.system}"`);
    const type = CARD_TYPES[c.type];
    if (!type) { err(where, `unknown card type "${c.type}"`); continue; }
    if (c.variant && !type.variants?.[c.variant]) err(where, `unknown ${c.type} variant "${c.variant}"`);
    for (const t of c.unknownSections) err(where, `section "${t}" is not part of a ${c.type} card`);
    for (const t of c.unknownSubsections ?? []) err(where, `"${t}" is not a More Information subsection of a ${c.type} card (### headings only go inside More Information)`);
    const order = type.sections.map((s) => s.key);
    const allowed = c.variant ? new Set([...type.variants[c.variant], ...SHARED_SECTIONS]) : null;
    let lastIdx = -1;
    for (const s of c.sections) {
      const idx = order.indexOf(s.key);
      if (idx < 0) continue;
      if (idx <= lastIdx) err(where, `section "${s.title}" is out of order`);
      lastIdx = Math.max(lastIdx, idx);
      if (allowed && !allowed.has(s.key)) err(where, `section "${s.title}" is not part of the ${c.variant} variant`);
      const subOrder = (type.more ?? []).map((x) => x.key);
      let lastSub = -1;
      for (const x of s.subsections ?? []) {
        const j = subOrder.indexOf(x.key);
        if (j < 0) continue;
        if (j <= lastSub) err(where, `"${x.title}" is out of order in More Information`);
        lastSub = Math.max(lastSub, j);
        if (x.description && x.description.length > 60) err(where, `"${x.title}": the description is over 60 characters`);
      }
      if (s.key === 'more' && s.blocks.length) err(where, 'More Information holds only ### subsections; move the text into one');
    }
    for (const req of type.sections.filter((s) => s.required)) {
      if (!c.sections.some((s) => s.key === req.key)) err(where, `missing required section "${req.title}"`);
    }
    const kp = c.sections.find((s) => s.key === 'at-a-glance');
    if (kp) {
      const n = kp.blocks.filter((b) => b.t === 'list').reduce((a, b) => a + b.items.length, 0);
      if (n < 3 || n > 6) err(where, `At a Glance should have 3–6 bullets (has ${n})`);
    }
    // The page header: a one-line definition, the guidelines it is based on, and the date it was last reviewed.
    if (type.topic && !c.example) {
      if (!c.definition) err(where, 'topic pages need a one-line "definition" in the front matter');
      if (!c.reviewed) err(where, 'topic pages need a "reviewed" date (YYYY-MM-DD) in the front matter');
    }
    if (c.reviewed && !/^\d{4}-\d{2}-\d{2}$/.test(c.reviewed)) err(where, `reviewed date "${c.reviewed}" must be YYYY-MM-DD`);
    if (c.definition) {
      if (!c.definition.sources.length) err(where, 'the definition has no source');
      for (const id of c.definition.sources) if (!data.source?.[id]) err(where, `the definition cites unknown source "${id}"`);
      for (const x of c.definition.inlines) if (x.t === 'insert' && !data[x.kind]?.[x.id]) err(where, `the definition inserts unknown ${x.kind} "${x.id}"`);
      if (c.definition.inlines.some((x) => x.t === 'insert' && x.kind === 'dose')) err(where, 'the definition cannot contain a dose');
    }
    for (const id of c.basedOn ?? []) if (!data.source?.[id]) err(where, `based_on lists unknown source "${id}"`);
    const parts = c.sections.flatMap((s) => [{ title: s.title, blocks: s.blocks }, ...(s.subsections ?? []).map((x) => ({ title: x.title, blocks: x.blocks }))]);
    for (const { title, blocks } of parts) {
      for (const r of runs(blocks)) {
        const text = inlineText(r.inlines);
        if (DOSE_IN_TEXT.test(text)) err(where, `"${title}" has a dose typed as text ("${text.match(DOSE_IN_TEXT)[0]}"); insert it with {{dose:…}}`);
        for (const id of r.sources) if (!data.source?.[id]) err(where, `"${title}" cites unknown source "${id}"`);
        const factual = !r.header && text.replace(/[\s.,;:()–-]/g, '').length > 0;
        if ((factual || r.timesTitle) && r.sources.length === 0 && !r.inlines.some((x) => x.t === 'insert')) err(where, `"${title}": a line has no source ("${text.slice(0, 60)}…")`);
        for (const x of r.inlines) {
          if (x.t === 'insert' && !data[x.kind]?.[x.id]) err(where, `"${title}" inserts unknown ${x.kind} "${x.id}"`);
          if (x.t === 'insert' && x.kind === 'dose') err(where, `"${title}": put each dose on a line of its own ({{dose:${x.id}}}), so it shows as one dose row`);
          if (x.t === 'link') {
            const target = cards.find((k) => k.id === x.id);
            if (!target) err(where, `"${title}" links to unknown card "${x.id}"`);
            else if (x.section && !target.sections.some((t) => t.key === x.section || t.subsections?.some((u) => u.key === x.section))) err(where, `"${title}" links to unknown section "${x.section}" of "${x.id}"`);
          }
          if (x.t === 'tag' && !TAGS[x.v]) err(where, `"${title}": unknown tag "[!${x.v}]" (use ${Object.keys(TAGS).map((k) => `[!${k}]`).join(' or ')})`);
        }
      }
      for (const b of allBlocks(blocks)) {
        if (b.t === 'insert' && !data[b.kind]?.[b.id]) err(where, `"${title}" inserts unknown ${b.kind} "${b.id}"`);
        if (CONTAINERS[b.t]) {
          const [lo, hi] = CONTAINERS[b.t];
          if (b.items.length < lo || b.items.length > hi) err(where, `"${title}": a :::${b.t} needs ${lo}–${hi} items (has ${b.items.length})`);
          if ((b.t === 'scale' || b.t === 'compare') && b.items.some((it) => !it.inlines.length)) err(where, `"${title}": each :::${b.t} item is "Label: text"`);
          if (b.t === 'onset') for (const it of b.items) {
            const d = it.text.trim().match(DOSE_ONLY);
            if (d) {
              const dose = data.dose?.[d[1]];
              if (!dose) err(where, `"${title}": :::onset lists unknown dose "${d[1]}"`);
              else if (onsetMinutes(dose.onset) == null) err(where, `"${title}": dose "${d[1]}" needs an "onset" such as "About 15 minutes" to be compared`);
            } else if (!/^[^:]+: [^|]+(\|.*)?$/.test(it.text.trim()) || onsetMinutes(it.text.split(': ').slice(1).join(': ').split('|')[0]) == null) {
              err(where, `"${title}": each :::onset item is {{dose:id}} or "Name: onset | lasts" with an onset such as "Immediate" or "About 1 hour" ("${it.text.slice(0, 40)}")`);
            }
          }
        } else if (!['paragraph', 'list', 'table', 'steps', 'insert', 'subheading'].includes(b.t)) err(where, `"${title}": unknown block ":::${b.t}" (use scale, compare, times or onset)`);
      }
    }
    for (const [group, ids] of Object.entries(c.related ?? {})) {
      for (const id of ids ?? []) if (!cards.some((k) => k.id === id)) err(where, `related (${group}) lists unknown card "${id}"`);
    }
  }

  for (const [kind, items] of Object.entries(data)) {
    const def = DATA_TYPES[kind];
    for (const [id, item] of Object.entries(items)) {
      const where = item._file;
      if (!def) { err(where, `unknown data type "${kind}"`); continue; }
      for (const f of def.required) if (item[f] === undefined || item[f] === '') err(where, `missing "${f}"`);
      if (def.sourced) {
        if (!Array.isArray(item.sources) || item.sources.length === 0) err(where, 'has no sources');
        for (const s of item.sources ?? []) if (!data.source?.[s]) err(where, `cites unknown source "${s}"`);
      }
      if (item.unit && !UNITS.includes(item.unit)) err(where, `unit "${item.unit}" is not a recognized US unit`);
      if (kind === 'dose') {
        if (item.drug && !cards.some((k) => k.id === item.drug)) err(where, `drug card "${item.drug}" does not exist`);
        if (!item.frequency && !item.rate) err(where, 'needs a "frequency" or a "rate"');
        for (const f of Object.keys(item)) if (f !== '_file' && !DOSE_FIELDS.includes(f)) err(where, `unknown dose field "${f}" (see docs/DATA-TYPES.md)`);
        const alt = item.alternative;
        if (alt !== undefined && (typeof alt !== 'object' || !alt.dose)) err(where, 'alternative needs "dose" (a dose id) and optional "when"');
        if (alt?.dose && !data.dose?.[alt.dose]) err(where, `alternative dose "${alt.dose}" does not exist`);
        if (alt?.dose === id) err(where, 'a dose cannot be its own alternative');
        if (item.cautions !== undefined && (!Array.isArray(item.cautions) || item.cautions.some((x) => typeof x !== 'string'))) err(where, 'cautions must be a list of short sentences');
      }
      if (kind === 'criteria' && !(item.items?.length || item.rows?.length)) err(where, 'needs items or rows');
      if (kind === 'criteria' && item.rows?.some((r) => !Array.isArray(r) || r.length !== (item.columns ?? []).length)) err(where, 'every row needs one cell per column');
      if (kind === 'pathway') {
        const steps = item.steps ?? {};
        if (!steps[item.start]) err(where, `start step "${item.start}" does not exist`);
        for (const [sid, st] of Object.entries(steps)) {
          const targets = [...(st.answers ?? []).map((a) => a.to), st.yes, st.no, st.next].filter(Boolean);
          for (const t of targets) if (!steps[t]) err(where, `step "${sid}" leads to missing step "${t}"`);
          if (st.kind !== 'result' && targets.length === 0) err(where, `step "${sid}" leads nowhere`);
          if (item.stages && st.stage && !item.stages.includes(st.stage)) err(where, `step "${sid}" has unknown stage "${st.stage}"`);
        }
      }
      if (/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id) === false) err(where, `id "${id}" must be lowercase words joined by hyphens`);
    }
  }
  return errors;
}

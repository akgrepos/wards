// Reads content/ into one plain object the app can bundle: systems, cards (parsed into sections and blocks) and data items.
// Card syntax (see docs/CONTENT-FORMAT.md): YAML front matter, "## Section" headings from the card type,
// "### Subsection" inside More Information, {{type:id}} inserts, [[card-id]] links, ^[source-id, …] at the end of a line.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative, basename } from 'node:path';
import YAML from 'yaml';
import { CARD_TYPES } from './schema.mjs';
import { parseInline } from './inline.mjs';

export { parseInline };

function walk(dir, ext) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p, ext) : p.endsWith(ext) ? [p] : [];
  });
}

// Pull a trailing ^[a, b] source marker off a line.
function splitSources(line) {
  const m = line.match(/\s*\^\[([^\]]+)\]\s*$/);
  if (!m) return { text: line, sources: [] };
  return { text: line.slice(0, m.index), sources: m[1].split(',').map((s) => s.trim()).filter(Boolean) };
}

// Markdown subset → blocks: paragraph, list (one nesting level), numbered steps, table, insert (a line that is only
// an insert), subheading, and the containers :::scale, :::compare, :::times, :::onset and :::note.
const ONLY_INSERT = /^\{\{\s*([a-z-]+)\s*:\s*([a-z0-9-]+)\s*\}\}$/;
const isTableRow = (l) => /^\s*\|.*\|\s*$/.test(l);
const isBullet = (l) => /^\s*[-*]\s+/.test(l);
// "1. Title" is a numbered step; "or. Title" is an alternative to the step above it (shown as "or", not numbered).
const isStep = (l) => /^(\d+|or)\.\s+/.test(l);
const isFence = (l) => /^:::/.test(l.trim());

// "Label: text" → label and the rest (for scale bands and comparison cells).
function labelled(text) {
  const i = text.indexOf(': ');
  return i < 0 ? { label: text.trim(), text: '' } : { label: text.slice(0, i).trim(), text: text.slice(i + 2).trim() };
}

export function parseBlocks(lines) {
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trimEnd();
    if (!line.trim()) { i++; continue; }
    const only = line.trim().match(ONLY_INSERT);
    if (only) { blocks.push({ t: 'insert', kind: only[1], id: only[2] }); i++; continue; }
    const h4 = line.match(/^####\s+(.*)$/);
    if (h4) { blocks.push({ t: 'subheading', text: h4[1].trim() }); i++; continue; }
    if (isFence(line)) {
      // :::kind Title ^[sources] … ::: — the items are "- " lines. A :::times block may name what it times from:
      // :::times{after=<dose-id>|first check=Glucose unit=min} (Timed Mode's "Due Next" list).
      const head = splitSources(line.trim().slice(3));
      const m = head.text.trim().match(/^([a-z]+)(?:\{([^}]*)\})?\s*(.*)$/) ?? ['', '', '', ''];
      const attrs = m[2] != null ? parseAttrs(m[2]) : null;
      const items = [];
      i++;
      while (i < lines.length && !isFence(lines[i])) {
        const l = lines[i].trim();
        if (l) {
          const { text, sources } = splitSources(l.replace(/^[-*]\s+/, ''));
          // A note's lines are plain sentences, not "Label: text".
          const { label, text: rest } = m[1] === 'note' ? { label: '', text } : labelled(text);
          items.push({ text, label: parseInline(label), inlines: parseInline(rest), sources });
        }
        i++;
      }
      i++; // the closing :::
      blocks.push({ t: m[1], title: parseInline(m[3].trim()), sources: head.sources, items, ...(attrs ? { attrs } : {}) });
      continue;
    }
    if (isTableRow(line)) {
      const rows = [];
      while (i < lines.length && isTableRow(lines[i])) { rows.push(lines[i].trim()); i++; }
      const cells = (r) => r.replace(/^\||\|$/g, '').split(/\|(?![^\[]*\]\])/).map((c) => c.trim());
      const body = rows.filter((r) => !/^\|\s*:?-{2,}/.test(r));
      const [head, ...rest] = body;
      blocks.push({
        t: 'table',
        header: cells(head).map(parseInline),
        rows: rest.map((r) => {
          const { text, sources } = splitSources(r.replace(/\|\s*$/, '').trim() + ' ');
          const cs = cells(text.trim().endsWith('|') ? text.trim() : text.trim() + '|');
          return { cells: cs.map(parseInline), sources };
        }),
      });
      continue;
    }
    if (isStep(line)) {
      // "1. Step title", then the step's content indented under it (bullets, doses, tables).
      const items = [];
      while (i < lines.length && isStep(lines[i])) {
        const { text, sources } = splitSources(lines[i].replace(/^(\d+|or)\.\s+/, '').trimEnd());
        const alt = lines[i].startsWith('or.');
        i++;
        const body = [];
        while (i < lines.length && (!lines[i].trim() || /^\s{2,}\S/.test(lines[i]))) { body.push(lines[i].replace(/^ {1,4}/, '')); i++; }
        items.push({ inlines: parseInline(text), sources, blocks: parseBlocks(body), ...(alt ? { alt: true } : {}) });
        while (i < lines.length && !lines[i].trim()) i++;
      }
      blocks.push({ t: 'steps', items });
      continue;
    }
    if (isBullet(line)) {
      const items = [];
      while (i < lines.length && isBullet(lines[i])) {
        const indent = lines[i].match(/^\s*/)[0].length;
        const { text, sources } = splitSources(lines[i].replace(/^\s*[-*]\s+/, '').trimEnd());
        const item = { inlines: parseInline(text), sources, children: [] };
        if (indent >= 2 && items.length) items[items.length - 1].children.push(item);
        else items.push(item);
        i++;
      }
      blocks.push({ t: 'list', items });
      continue;
    }
    const para = [];
    while (i < lines.length && lines[i].trim() && !isBullet(lines[i]) && !isStep(lines[i]) && !isTableRow(lines[i]) && !isFence(lines[i]) && !/^#{2,4}\s/.test(lines[i]) && !ONLY_INSERT.test(lines[i].trim())) {
      para.push(lines[i].trim());
      i++;
    }
    const { text, sources } = splitSources(para.join(' '));
    blocks.push({ t: 'paragraph', inlines: parseInline(text), sources });
  }
  return blocks;
}

// key=value pairs separated by spaces; a value with spaces goes in quotes (check="Repeat K⁺").
function parseAttrs(text) {
  const out = {};
  for (const m of text.matchAll(/([a-z]+)=(?:"([^"]*)"|(\S+))/g)) out[m[1]] = m[2] ?? m[3];
  return out;
}

// A topic with an emergency has a "## Do Now" section: the numbered steps its emergency page shows (Rapids tab,
// Timed Mode). It lives in the topic's file (one home, shared dose data) but isn't one of the page's sections.
export const DO_NOW = 'Do Now';

const findDef = (list, title) => list?.find((s) => s.title.toLowerCase() === title.toLowerCase());

export function parseCard(file, root) {
  const src = readFileSync(file, 'utf8');
  const fm = src.match(/^---\n([\s\S]*?)\n---\n?/);
  const meta = fm ? YAML.parse(fm[1]) ?? {} : {};
  const body = fm ? src.slice(fm[0].length) : src;
  const type = CARD_TYPES[meta.type];
  const sections = [];
  const unknown = [];
  const unknownSub = [];
  let cur = null;
  let sub = null;
  let emergencyLines = null;
  for (const line of body.split('\n')) {
    const h2 = line.match(/^##\s+(.*)$/);
    const h3 = line.match(/^###\s+(.*)$/);
    if (h2) {
      const title = h2[1].trim();
      if (title.toLowerCase() === DO_NOW.toLowerCase()) {
        cur = { key: 'do-now', title: DO_NOW, lines: [], subsections: [], emergency: true };
        emergencyLines = cur.lines;
        sub = null;
        continue;
      }
      const def = findDef(type?.sections, title);
      if (!def) unknown.push(title);
      cur = { key: def?.key ?? title, title: def?.title ?? title, lines: [], subsections: [] };
      sections.push(cur);
      sub = null;
      continue;
    }
    if (h3 && cur && !cur.emergency) {
      // Inside More Information: "### Title" or "### Title: what it covers" (a short description shown while closed).
      const { label, text } = labelled(h3[1].trim());
      const def = cur.key === 'more' ? findDef(type?.more, label) : null;
      if (!def) unknownSub.push(`${cur.title} › ${label}`);
      sub = { key: def?.key ?? label, title: def?.title ?? label, description: text || null, lines: [] };
      cur.subsections.push(sub);
      continue;
    }
    if (!cur) continue;
    (sub ?? cur).lines.push(line);
  }
  const definition = meta.definition ? splitSources(String(meta.definition)) : null;
  return {
    file: relative(root, file),
    scaffold: src.includes('SCAFFOLD:'),
    id: meta.id ?? basename(file, '.md'),
    type: meta.type,
    variant: meta.variant ?? null,
    system: meta.system,
    group: meta.group ?? (meta.type === 'approach' ? 'approach' : meta.type === 'condition' ? 'condition' : 'reference'),
    subsection: meta.subsection ?? null,
    title: meta.title,
    aliases: meta.aliases ?? [],
    related: meta.related ?? {},
    example: !!meta.example,
    contentsSub: meta.contents_sub ?? [],
    definition: definition ? { inlines: parseInline(definition.text.trim()), sources: definition.sources } : null,
    basedOn: meta.based_on ?? [],
    emergency: emergencyLines ? { hint: meta.emergency_hint ?? null, blocks: parseBlocks(emergencyLines) } : null,
    emergencyHintOnly: !emergencyLines && meta.emergency_hint != null,
    checked: parseChecked(meta.checked),
    unknownSections: unknown,
    unknownSubsections: unknownSub,
    sections: sections.map((s) => ({
      key: s.key, title: s.title, blocks: parseBlocks(s.lines),
      subsections: s.subsections.map((x) => ({ key: x.key, title: x.title, description: x.description, blocks: parseBlocks(x.lines) })),
    })),
  };
}

// The front matter "checked" stamp: { date, by, scope, fingerprint, carried }. The date may arrive as a Date or a string; the checker validates the rest.
function parseChecked(c) {
  if (!c || typeof c !== 'object') return null;
  const d = c.date instanceof Date ? c.date.toISOString().slice(0, 10) : c.date == null ? null : String(c.date);
  return { date: d, by: c.by == null ? null : String(c.by), scope: c.scope == null ? null : String(c.scope), fingerprint: c.fingerprint == null ? null : String(c.fingerprint), carried: c.carried == null ? null : String(c.carried) };
}

// content/unchecked.txt: ids of draft cards that may ship without a "checked" stamp (one per line, # for comments).
function loadUnchecked(dir) {
  const f = join(dir, 'unchecked.txt');
  if (!existsSync(f)) return [];
  return readFileSync(f, 'utf8').split('\n').map((l) => l.replace(/#.*/, '').trim()).filter(Boolean);
}

// Loads everything. includeExamples adds content/examples (development only; never shipped).
export function loadContent(root, { includeExamples = false } = {}) {
  const dir = join(root, 'content');
  const systems = YAML.parse(readFileSync(join(dir, 'systems.yaml'), 'utf8'));
  const cardFiles = [...walk(join(dir, 'cards'), '.md'), ...(includeExamples ? walk(join(dir, 'examples'), '.md') : [])];
  const cards = cardFiles.map((f) => parseCard(f, root));
  const data = {};
  const dataDirs = [join(dir, 'data'), ...(includeExamples ? [join(dir, 'examples', 'data')] : [])];
  for (const dd of dataDirs) {
    if (!existsSync(dd)) continue;
    for (const kind of readdirSync(dd)) {
      if (!statSync(join(dd, kind)).isDirectory()) continue;
      data[kind] ??= {};
      for (const f of walk(join(dd, kind), '.yaml')) {
        const item = YAML.parse(readFileSync(f, 'utf8')) ?? {};
        data[kind][basename(f, '.yaml')] = { ...item, _file: relative(root, f) };
      }
    }
  }
  return { systems, cards, data, unchecked: loadUnchecked(dir) };
}

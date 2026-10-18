// Reads content/ into one plain object the app can bundle: systems, cards (parsed into sections and blocks) and data items.
// Card syntax (see docs/CONTENT-FORMAT.md): YAML front matter, "## Section" headings from the card type,
// "### More" inside a section for detail behind a disclosure, {{type:id}} inserts, [[card-id]] links, ^[source-id, …] at the end of a line.
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

// Markdown subset → blocks: paragraph, list (one nesting level), table, insert (a line that is only an insert), subheading.
export function parseBlocks(lines) {
  const blocks = [];
  let i = 0;
  const isTableRow = (l) => /^\s*\|.*\|\s*$/.test(l);
  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trimEnd();
    if (!line.trim()) { i++; continue; }
    const only = line.trim().match(/^\{\{\s*([a-z-]+)\s*:\s*([a-z0-9-]+)\s*\}\}$/);
    if (only) { blocks.push({ t: 'insert', kind: only[1], id: only[2] }); i++; continue; }
    const h4 = line.match(/^####\s+(.*)$/);
    if (h4) { blocks.push({ t: 'subheading', text: h4[1].trim() }); i++; continue; }
    if (isTableRow(line)) {
      const rows = [];
      while (i < lines.length && isTableRow(lines[i])) { rows.push(lines[i].trim()); i++; }
      const cells = (r) => r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
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
    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
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
    while (i < lines.length && lines[i].trim() && !/^\s*[-*]\s+/.test(lines[i]) && !isTableRow(lines[i]) && !/^#{2,4}\s/.test(lines[i])) {
      para.push(lines[i].trim());
      i++;
    }
    const { text, sources } = splitSources(para.join(' '));
    blocks.push({ t: 'paragraph', inlines: parseInline(text), sources });
  }
  return blocks;
}

export function parseCard(file, root) {
  const src = readFileSync(file, 'utf8');
  const fm = src.match(/^---\n([\s\S]*?)\n---\n?/);
  const meta = fm ? YAML.parse(fm[1]) ?? {} : {};
  const body = fm ? src.slice(fm[0].length) : src;
  const type = CARD_TYPES[meta.type];
  const sections = [];
  const unknown = [];
  let cur = null;
  let inMore = false;
  for (const line of body.split('\n')) {
    const h2 = line.match(/^##\s+(.*)$/);
    const h3 = line.match(/^###\s+(.*)$/);
    if (h2) {
      const title = h2[1].trim();
      const def = type?.sections.find((s) => s.title.toLowerCase() === title.toLowerCase());
      if (!def) unknown.push(title);
      cur = { key: def?.key ?? title, title: def?.title ?? title, collapsed: !!def?.collapsed, summary: null, lines: [], moreLines: [] };
      sections.push(cur);
      inMore = false;
      continue;
    }
    if (h3 && cur && /^more\b/i.test(h3[1].trim())) { inMore = true; cur.moreTitle = h3[1].trim(); continue; }
    if (h3 && cur && /^summary$/i.test(h3[1].trim())) { inMore = 'summary'; continue; }
    if (!cur) continue;
    if (inMore === 'summary') {
      if (line.trim()) { cur.summary = (cur.summary ? cur.summary + ' ' : '') + line.trim(); continue; }
      if (cur.summary) inMore = false; // a blank line ends the summary
      continue;
    }
    else (inMore ? cur.moreLines : cur.lines).push(line);
  }
  return {
    file: relative(root, file),
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
    unknownSections: unknown,
    sections: sections.map((s) => ({
      key: s.key, title: s.title, collapsed: s.collapsed, ...(() => { const x = s.summary ? splitSources(s.summary) : null; return { summary: x ? x.text : null, summarySources: x ? x.sources : [] }; })(),
      blocks: parseBlocks(s.lines), more: parseBlocks(s.moreLines), moreTitle: s.moreTitle ?? null,
    })),
  };
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
  return { systems, cards, data };
}

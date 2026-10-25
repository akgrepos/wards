// A source marker (^[id, id]) must never show as text (owner, 2026-10-23). Sources go at the end of a line, bullet,
// paragraph or table row, where the app turns them into a pill. A marker anywhere else (for example between the cells
// of a table row) is left in the displayed words. Walks every string a card or data item can show and fails on a
// leftover "^[" or a known source id.
const SKIP_KEYS = new Set(['file', '_file', 'id', 'url', 'href', 'link', 'citation', 'match', 'card', 'sources', 'source', 'label_source', 'verification', 'basedOn', 'related', 'dataset']);

function* strings(v, path = '') {
  if (typeof v === 'string') yield [path, v];
  else if (Array.isArray(v)) for (let i = 0; i < v.length; i++) yield* strings(v[i], `${path}[${i}]`);
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) if (!SKIP_KEYS.has(k)) yield* strings(x, path ? `${path}.${k}` : k);
}

export function strayInText(text, sourceIds = []) {
  if (text.includes('^[')) return '^[';
  for (const id of sourceIds) if (id.length > 8 && id.includes('-') && text.includes(id)) return id;
  return null;
}

// Raw markdown: in a table row, a marker followed by another cell is mid-row.
export function midRowSource(line) {
  return /^\s*\|.*\^\[[^\]]*\]\s*\|\s*[^|\s]/.test(line);
}

export function checkStraySources({ cards, data }) {
  const errors = [];
  const ids = Object.keys(data.source ?? {});
  const hit = (file, path, text) => {
    const bad = strayInText(text, ids);
    if (bad) errors.push(`${file}: source text shown: ${path || 'text'} contains "${bad}" in plain text. Put sources at the end of the line or table row, one marker per row (docs/CONTENT-FORMAT.md, "Sources go at the end")`);
  };
  for (const c of cards) for (const [p, s] of strings(c)) hit(c.file, p, s);
  for (const [type, items] of Object.entries(data)) {
    if (type === 'source') continue;
    for (const [id, item] of Object.entries(items ?? {})) for (const [p, s] of strings(item)) hit(item._file ?? `${type}/${id}`, p, s);
  }
  return errors;
}

// No semicolons in card text (owner, 2026-10-23). A list becomes bullets, a clause join becomes two sentences.
// Walks every string a card or data item can show. Not text, so skipped: entities (&amp;), web addresses,
// ids and file names, and a source's citation (bibliographic punctuation such as "2020;12:34").
const SKIP_KEYS = new Set(['file', '_file', 'id', 'url', 'href', 'link', 'citation', 'match', 'card']);
const ENTITY = /&#?\w+;/g;
const URL_RE = /https?:\/\/\S+/g;

function* strings(v, path = '') {
  if (typeof v === 'string') yield [path, v];
  else if (Array.isArray(v)) for (let i = 0; i < v.length; i++) yield* strings(v[i], `${path}[${i}]`);
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) if (!SKIP_KEYS.has(k)) yield* strings(x, path ? `${path}.${k}` : k);
}

export function hasSemicolon(text) {
  return text.replace(ENTITY, '').replace(URL_RE, '').includes(';');
}

export function checkSemicolons({ cards, data }) {
  const errors = [];
  const hit = (file, path, text) => {
    if (!hasSemicolon(text)) return;
    const at = text.replace(ENTITY, '').replace(URL_RE, '').indexOf(';');
    errors.push(`${file}: semicolon rule: ${path || 'text'} has a semicolon near "${text.replace(ENTITY, '').slice(Math.max(0, at - 25), at + 25).trim()}"; use bullets for a list or two sentences for a clause join (docs/CONTENT-FORMAT.md, "No semicolons")`);
  };
  for (const c of cards) for (const [p, s] of strings(c)) hit(c.file, p, s);
  for (const [type, items] of Object.entries(data)) {
    if (type === 'source') continue;
    for (const [id, item] of Object.entries(items ?? {})) for (const [p, s] of strings(item)) hit(item._file ?? `${type}/${id}`, p, s);
  }
  return errors;
}

// Shared by the build and the app (no Node imports here).
// Inline text → tokens: text, strong, em, insert, link.
export function parseInline(text) {
  const out = [];
  const re = /\{\{\s*([a-z-]+)\s*:\s*([a-z0-9-]+)\s*\}\}|\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) out.push({ t: 'text', v: text.slice(last, m.index) });
    if (m[1]) out.push({ t: 'insert', kind: m[1], id: m[2] });
    else if (m[3]) out.push({ t: 'link', id: m[3], label: m[4] ?? null });
    else if (m[5]) out.push({ t: 'strong', v: m[5] });
    else out.push({ t: 'em', v: m[6] });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ t: 'text', v: text.slice(last) });
  return out;
}


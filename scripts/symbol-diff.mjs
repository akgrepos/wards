// Word-by-word check for the table-symbol cleanup (owner, 2026-10-23): compares every card against the base branch
// and flags any change that is not an intended word → symbol swap. Usage: node scripts/symbol-diff.mjs [baseRef=main]
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const SWAPS = [ // [old words (lowercase), new symbol text]
  [/\b(raised|high|higher|elevated|increased)\b/g, '↑'],
  [/\b(low|lower|decreased|reduced)\b/g, '↓'],
  [/\bnormal\b/g, '='],
  [/\bvariable\b/g, '↕'],
  [/\b(below|less than)\b/g, '<'],
  [/\b(above|greater than|more than)\b/g, '>'],
  [/\bat least\b/g, '≥'],
  [/\bat most\b/g, '≤'],
  [/\b(\d+) or more\b/g, '≥$1'],
  [/\b(\d+) or below\b/g, '≤$1'],
];
const canon = (s) => s.toLowerCase().replace(/\s+/g, '').replace(/[<>≤≥](?=[−\-\d])/g, (m) => m);
const swapped = (s) => SWAPS.reduce((t, [re, to]) => t.replace(re, to), s.toLowerCase());
const tokens = (s) => s.match(/[\p{L}\p{N}₀-₉⁺⁻²³]+|[^\s\p{L}\p{N}]/gu) ?? [];

function hunks(a, b) { // token diff by longest common subsequence → [{old, new}]
  const n = a.length, m = b.length, t = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) t[i][j] = a[i] === b[j] ? t[i + 1][j + 1] + 1 : Math.max(t[i + 1][j], t[i][j + 1]);
  const out = []; let i = 0, j = 0, cur = null;
  const flush = () => { if (cur) out.push(cur); cur = null; };
  while (i < n || j < m) {
    if (i < n && j < m && a[i] === b[j]) { flush(); i++; j++; }
    else { cur ??= { old: [], new: [] }; if (j >= m || (i < n && t[i + 1][j] >= t[i][j + 1])) cur.old.push(a[i++]); else cur.new.push(b[j++]); }
  }
  flush();
  return out;
}

export function compareLines(oldLine, newLine) {
  const flags = [];
  // number phrases whose small words drop out with the symbol
  oldLine = oldLine.replace(/ of (\d+) or more/g, ' ≥$1').replace(/ at (\d+) or below/g, ' at ≤$1');
  for (const h of hunks(tokens(oldLine), tokens(newLine))) {
    const o = h.old.join(' '), nw = h.new.join(' ');
    if (canon(swapped(o)) === canon(nw)) continue;
    // a phrase may split across hunks (e.g. "Normal or high" → "= or ↑"), so accept when every old word maps to a symbol or a kept word
    flags.push(`"${o}" → "${nw}"`);
  }
  // a symbol may move behind its noun ("high PaCO₂" → "PaCO₂ ↑") and "X or Y" may be put in one order: same words, same symbols
  if (flags.length) {
    const count = (t) => t.reduce((m, x) => m.set(x, (m.get(x) ?? 0) + 1), new Map());
    const co = count(tokens(oldLine.toLowerCase())), cn = count(tokens(newLine.toLowerCase()));
    const only = (x, y) => [].concat(...[...x].map(([k, v]) => Array(Math.max(0, v - (y.get(k) ?? 0))).fill(k)));
    if (tokens(swapped(only(co, cn).join(' '))).sort().join() === only(cn, co).sort().join()) return [];
  }
  return flags;
}

const base = process.argv[2] ?? 'main';
if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const git = (...a) => execFileSync('git', a, { encoding: 'utf8', maxBuffer: 1 << 26 });
  const changed = git('diff', '--name-only', base, '--', 'content/cards').split('\n').filter(Boolean);
  let bad = 0, swaps = 0;
  for (const f of changed) {
    const oldL = git('show', `${base}:${f}`).split(/\r?\n/), newL = readFileSync(f, 'utf8').split(/\r?\n/);
    if (oldL.length !== newL.length) { console.log(`${f}: line count changed ${oldL.length} → ${newL.length}`); bad++; continue; }
    newL.forEach((nl, i) => {
      if (nl === oldL[i]) return;
      const isTable = /^\s*\|/.test(nl);
      const strip = (s) => s.replace(/\s*\^\[[^\]]*\]/g, '');
      const flags = compareLines(strip(oldL[i]), strip(nl));
      if (!isTable && flags.length) flags.unshift('changed outside a table');
      const ids = (l) => [...new Set((l.match(/\^\[[^\]]*\]/g) ?? []).flatMap((m) => m.slice(2, -1).split(',').map((x) => x.trim())))].sort().join();
      if (ids(oldL[i]) !== ids(nl)) flags.push('sources differ');
      swaps++;
      if (flags.length) { bad++; console.log(`${f}:${i + 1}: ${flags.join(' | ')}`); }
    });
  }
  console.log(`${changed.length} cards, ${swaps} changed lines, ${bad} flagged`);
  process.exit(bad ? 1 : 0);
}

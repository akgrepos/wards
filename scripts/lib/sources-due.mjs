// Pure helpers for scripts/sources-due.mjs, unit-tested in sources-due.test.mjs.
// A source is "due" for a look when it is old and many cards lean on it. Only kinds that get new editions count (guidelines,
// labels, reviews, regulations); single trials, studies and datasets are never superseded in that sense.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, basename } from 'node:path'
import YAML from 'yaml'

const REFRESH_KINDS = new Set(['guideline', 'prescribing-information', 'review', 'systematic-review', 'systematic review', 'regulation', 'practice'])

const walk = (dir, ext) =>
  !existsSync(dir)
    ? []
    : readdirSync(dir).flatMap((n) => {
        const p = join(dir, n)
        return statSync(p).isDirectory() ? walk(p, ext) : p.endsWith(ext) ? [p] : []
      })

/** Sources worth refreshing: [{ id, year, kind, title }] from content/data/source. */
export function refreshableSources(root) {
  const out = []
  for (const f of walk(join(root, 'content', 'data', 'source'), '.yaml')) {
    const s = YAML.parse(readFileSync(f, 'utf8')) ?? {}
    if (REFRESH_KINDS.has(s.kind) && Number.isFinite(Number(s.year))) out.push({ id: basename(f, '.yaml'), year: Number(s.year), kind: s.kind, title: s.title ?? '' })
  }
  return out
}

/** For each card id, the text it rests on: the card plus the data files it inserts ({{type:id}}), one level deep. */
export function cardTexts(root) {
  const data = new Map()
  for (const f of walk(join(root, 'content', 'data'), '.yaml')) {
    const rel = f.slice(join(root, 'content', 'data').length + 1).split(/[\\/]/)
    data.set(`${rel[0]}:${basename(f, '.yaml')}`, readFileSync(f, 'utf8'))
  }
  const cards = new Map()
  for (const f of walk(join(root, 'content', 'cards'), '.md')) {
    const text = readFileSync(f, 'utf8')
    const id = (text.match(/^id:\s*(\S+)/m) ?? [])[1]
    if (!id) continue
    let all = text
    for (const m of text.matchAll(/\{\{(\w+):([^}|]+)/g)) all += '\n' + (data.get(`${m[1]}:${m[2].trim()}`) ?? '')
    cards.set(id, all)
  }
  return cards
}

/** Sources oldest first, then by number of citing cards (most first). Each row: { id, year, kind, cards: [card ids] }. */
export function sourcesDue(root, limit = 12) {
  const texts = cardTexts(root)
  // Whole-id match, so "label-x-2020" does not count a card that only cites "label-x-2020-b".
  const cites = (text, id) => new RegExp(`(?<![\\w-])${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w-])`).test(text)
  const rows = refreshableSources(root).map((s) => ({ ...s, cards: [...texts].filter(([, t]) => cites(t, s.id)).map(([id]) => id) }))
  return rows
    .filter((r) => r.cards.length)
    .sort((a, b) => a.year - b.year || b.cards.length - a.cards.length || a.id.localeCompare(b.id))
    .slice(0, limit)
}

/** Printable lines. */
export function formatDue(rows) {
  if (!rows.length) return ['(no cited guideline, label or review found)']
  return [
    'Oldest first, then most-cited. Look at these in the April/October sweep (wards-review) or when a card is next touched:',
    ...rows.map((r) => `${r.year}  ${String(r.cards.length).padStart(2)} card${r.cards.length === 1 ? ' ' : 's'}  ${r.kind}  ${r.id}`),
  ]
}

// Pure helpers for `npm run brief` (scripts/brief.mjs), unit-tested in brief.test.mjs.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'
import YAML from 'yaml'

/** Folder with the two hand-written state files (BACKLOG.md, DECISIONS.md). Outside the repo; WARDS_NOTES_DIR overrides it. */
export const notesDir = () => process.env.WARDS_NOTES_DIR || join(homedir(), 'Documents', 'Wards-reference', 'notes')
/** Optional metrics file: one row per card, appended by the card skill. */
export const metricsFile = () => process.env.WARDS_METRICS_FILE || join(homedir(), 'Documents', 'Wards-reference', 'metrics', 'cards.md')

const ymd = (v) => {
  if (v == null) return null
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  const m = String(v).match(/\d{4}-\d{2}-\d{2}/)
  return m ? m[0] : null
}

/** The date shown as "Updated": the later of the stamp date and the date that starts the `carried` note. */
export function updatedDate(checked) {
  if (!checked) return null
  const dates = [ymd(checked.date), ymd(checked.carried)].filter(Boolean).sort()
  return dates.length ? dates[dates.length - 1] : null
}

/** Reads the front matter of one card file; null if it has none. */
export function parseCard(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return null
  const fm = YAML.parse(m[1]) ?? {}
  return { id: fm.id, type: fm.type, system: fm.system, title: fm.title, updated: updatedDate(fm.checked) }
}

const walk = (dir) =>
  !existsSync(dir)
    ? []
    : readdirSync(dir).flatMap((n) => {
        const p = join(dir, n)
        return statSync(p).isDirectory() ? walk(p) : p.endsWith('.md') ? [p] : []
      })

/** The card index: one entry per card file under content/cards, sorted by system then id. */
export function cardIndex(root) {
  const cards = walk(join(root, 'content', 'cards')).map((f) => parseCard(readFileSync(f, 'utf8'))).filter((c) => c?.id)
  const examples = walk(join(root, 'content', 'examples')).length
  cards.sort((a, b) => String(a.system).localeCompare(String(b.system)) || a.id.localeCompare(b.id))
  return { cards, examples }
}

/** Index lines grouped by system: "  system: id (type, updated date) Title". */
export function formatIndex({ cards, examples }) {
  const out = [`${cards.length} cards${examples ? ` (+${examples} example)` : ''}. id [type, updated]:`]
  const bySystem = new Map()
  for (const c of cards) bySystem.set(c.system, [...(bySystem.get(c.system) ?? []), c])
  for (const [sys, list] of bySystem) {
    out.push(`  ${sys}: ` + list.map((c) => `${c.id} [${c.type}, ${c.updated ?? 'no stamp'}]`).join(', '))
  }
  return out
}

/** Splits BACKLOG.md into { next: [numbered lines], owed: [bullets] } by "## " headings. */
export function parseBacklog(text) {
  const sections = {}
  let cur = null
  for (const line of text.split(/\r?\n/)) {
    const h = line.match(/^##\s+(.*?)\s*$/)
    if (h) { cur = h[1].toLowerCase(); sections[cur] = []; continue }
    if (cur && line.trim()) sections[cur].push(line.trim())
  }
  const items = (name) => (sections[name] ?? []).filter((l) => /^(\d+\.|[-*])\s/.test(l))
  return { next: items('next'), owed: items('owed by the owner') }
}

/** Last data row of the metrics table (rows are lines starting with "|"; the header and the dashed separator are skipped), or null. */
export function lastMetricsRow(text) {
  const rows = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.startsWith('|') && !/^\|[\s:|-]+\|?$/.test(l))
  return rows.length > 1 ? rows[rows.length - 1] : null
}

/** Reads a file outside the repo; null when it is missing. */
export const readIf = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : null)

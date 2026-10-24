// `npm run review:oe-read -- <card-id> <batch-NN> [file]`: reads the answer the owner pasted back from
// OpenEvidence's `.card_check` (from a file, or from stdin when no file is given), parses its table and
// its Conflicts / Outdated / Dose safety / Re-check lists, and writes each verdict into the private ledger
// (~/Documents/Wards-reference/review-ledger/<card-id>.yaml) as `oe: {date, verdict, says, source, note, batch}`
// on the entry that statement came from (found through oe-batches/<card-id>/<batch-NN>.map.yaml).
// The writer's quote and status are never touched. Then prints a plain summary. Nothing leaves this computer.
import { readFileSync, existsSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse, parseDocument, stringify } from 'yaml'

export const VERDICTS = ['Supported', 'Supported (practice, no guideline)', 'Partly supported', 'Contradicted', 'No evidence found']

const clean = (s) => String(s ?? '').replace(/\*\*|__|`/g, '').replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').trim()

export function normalizeVerdict(raw) {
  const v = clean(raw).toLowerCase()
  if (!v) return null
  if (/partl/.test(v)) return 'Partly supported'
  if (/contradict/.test(v)) return 'Contradicted'
  if (/no\s+evidence|not\s+found/.test(v)) return 'No evidence found'
  if (/supported/.test(v) && /(practice|no guideline)/.test(v)) return 'Supported (practice, no guideline)'
  if (/^supported\b/.test(v) || /\bsupported$/.test(v)) return 'Supported'
  return null
}

function splitRow(line) {
  let t = line.trim()
  if (t.startsWith('|')) t = t.slice(1)
  if (t.endsWith('|')) t = t.slice(0, -1)
  return t.split('|').map((c) => c.trim())
}

const isSeparator = (line) => /^[\s|:\-–—]+$/.test(line) && line.includes('-')

function columnsFrom(header) {
  const find = (re, not) => header.findIndex((h) => re.test(h) && !(not && not.test(h)))
  const cols = {
    num: header.findIndex((h) => /^#|^no\.?$|^number$/i.test(clean(h))),
    statement: find(/statement/i),
    verdict: find(/verdict/i),
    says: find(/(source|what).*says|says/i),
    source: find(/^\W*source\W*$|^source\b(?!.*says)/i),
    note: find(/discrepancy|note/i),
    quote: find(/quote/i),
    edition: find(/edition|date checked/i),
  }
  return cols
}

const DEFAULT_COLS = { num: 0, statement: 1, verdict: 2, says: 3, source: 4, note: 5, quote: 6, edition: 7 }

function parseNumbers(text) {
  const out = new Set()
  for (const m of text.matchAll(/#?\s*(\d+)\s*(?:[-–—]|to)\s*#?\s*(\d+)/g)) {
    const a = Number(m[1]), b = Number(m[2])
    if (b >= a && b - a < 200) for (let i = a; i <= b; i++) out.add(i)
  }
  const rest = text.replace(/#?\s*(\d+)\s*(?:[-–—]|to)\s*#?\s*(\d+)/g, ' ')
  for (const m of rest.matchAll(/\d+/g)) out.add(Number(m[0]))
  return [...out].sort((a, b) => a - b)
}

export function parseOeAnswer(text) {
  const lines = String(text).replace(/\r/g, '').split('\n')
  const rows = []
  const unparsed = []
  let cols = null
  const tableLineIdx = new Set()
  lines.forEach((line, i) => {
    if (!line.includes('|') || isSeparator(line)) { if (isSeparator(line) && line.includes('|')) tableLineIdx.add(i); return }
    const cells = splitRow(line)
    if (cells.length < 3) return
    tableLineIdx.add(i)
    const lower = cells.map(clean)
    if (lower.some((c) => /^verdict$/i.test(c)) || (lower.some((c) => /statement/i.test(c)) && lower.some((c) => /verdict/i.test(c)))) { cols = columnsFrom(cells); return }
    const c = { ...DEFAULT_COLS, ...(cols ? Object.fromEntries(Object.entries(cols).filter(([, v]) => v >= 0)) : {}) }
    let cs = cells
    const width = cols ? Math.max(...Object.values(c)) + 1 : 8
    if (cs.length > width) cs = [...cs.slice(0, width - 1), cs.slice(width - 1).join(' | ')]
    const numMatch = clean(cs[c.num]).match(/^\D{0,3}(\d+)\b/)
    const verdict = normalizeVerdict(cs[c.verdict])
    if (!numMatch || !verdict) { unparsed.push(clean(line)); return }
    rows.push({
      n: Number(numMatch[1]),
      statement: clean(cs[c.statement]),
      verdict,
      says: clean(cs[c.says]),
      source: clean(cs[c.source]),
      note: clean(cs[c.note]),
      quote: clean(cs[c.quote]),
      edition: clean(cs[c.edition]),
    })
  })

  const lists = { conflicts: '', outdated: '', doseSafety: '' }
  const keys = [[/^conflicts?\b/i, 'conflicts'], [/^outdated\b/i, 'outdated'], [/^dose\s*safety\b/i, 'doseSafety']]
  let current = null
  let recheckText = null
  lines.forEach((raw, i) => {
    if (tableLineIdx.has(i)) { current = null; return }
    const line = clean(raw.replace(/^[\s>*#\-•]+/, ''))
    const rc = line.match(/^re-?check in snow\s*:?\s*(.*)$/i)
    if (rc) { recheckText = rc[1]; current = null; return }
    const hit = keys.find(([re]) => re.test(line))
    if (hit) {
      current = hit[1]
      lists[current] = clean(line.replace(/^(?:conflicts?|outdated|dose\s*safety)\b[^:：]*[:：]?\s*/i, ''))
      return
    }
    if (current && line) lists[current] = clean(`${lists[current]} ${line}`)
    if (!line) return
  })
  for (const k of Object.keys(lists)) lists[k] = lists[k].replace(/^[:：\-\s]+/, '')
  const recheck = recheckText && !/^\W*none\b/i.test(recheckText) ? parseNumbers(recheckText) : []
  return { rows, unparsed, lists, recheck, recheckFound: recheckText !== null }
}

const ymd = (d = new Date()) => d.toISOString().slice(0, 10)

// Adds `oe` to the ledger entries named by the batch map, keeping the file's comments and every other field.
export function applyToLedger(ledgerText, map, parsed, date = ymd()) {
  const doc = parseDocument(ledgerText)
  const items = doc.get('entries')?.items ?? []
  const byId = new Map(items.map((it) => [String(it.get('id')), it]))
  const applied = []
  const unmapped = []
  for (const r of parsed.rows) {
    const id = map.entries?.[r.n]
    const item = id ? byId.get(String(id)) : null
    if (!item) { unmapped.push(r.n); continue }
    item.set('oe', doc.createNode({ date, verdict: r.verdict, says: r.says, source: r.source, note: r.note, ...(r.quote ? { quote: r.quote } : {}), ...(r.edition ? { edition: r.edition } : {}), batch: map.batch }))
    applied.push({ ...r, id: String(id) })
  }
  return { text: String(doc), applied, unmapped }
}

export function summarize({ card, batch, parsed, applied, unmapped, map, ledger }) {
  const out = [`review:oe-read ${card} ${batch}: ${applied.length} verdict(s) written to the ledger.`]
  const counts = {}
  for (const r of applied) counts[r.verdict] = (counts[r.verdict] ?? 0) + 1
  out.push('Counts: ' + (VERDICTS.filter((v) => counts[v]).map((v) => `${v} ${counts[v]}`).join(', ') || 'none'))
  const entries = new Map((ledger.entries ?? []).map((e) => [e.id, e]))
  const odd = applied.filter((r) => r.verdict !== 'Supported')
  if (odd.length) {
    out.push('', 'Not plain Supported:')
    for (const r of odd) {
      const e = entries.get(r.id) ?? {}
      out.push(`  #${r.n} ${r.verdict} [${r.id}]`, `    card line: ${e.where ?? '?'}`, `    claim: ${e.claim ?? r.statement}`, `    OpenEvidence note: ${r.note || r.says || '(none)'}`)
    }
  }
  const answered = new Set(parsed.rows.map((r) => r.n))
  const missing = Object.keys(map.entries ?? {}).map(Number).filter((n) => !answered.has(n))
  if (missing.length) out.push('', `No row found for statement(s): ${missing.map((n) => '#' + n).join(', ')}`)
  if (unmapped.length) out.push('', `Rows whose number is not in this batch's map (ignored): ${unmapped.map((n) => '#' + n).join(', ')}`)
  if (parsed.unparsed.length) out.push('', `${parsed.unparsed.length} table row(s) could not be parsed (check them by hand):`, ...parsed.unparsed.map((l) => '  ' + l))
  for (const [label, key] of [['Conflicts', 'conflicts'], ['Outdated', 'outdated'], ['Dose safety', 'doseSafety']]) {
    const t = parsed.lists[key]
    out.push('', `${label}: ${t && !/^none\b/i.test(t) ? t : 'None'}`)
  }
  out.push('', parsed.recheckFound ? `Re-check in Snow: ${parsed.recheck.length ? parsed.recheck.map((n) => '#' + n).join(', ') : 'none'}` : 'Re-check in Snow: line not found in the pasted answer')
  return out.join('\n')
}

function main() {
  const [card, batch, file] = process.argv.slice(2)
  if (!card || !batch) { console.log('Usage: npm run review:oe-read -- <card-id> <batch-NN> [file]   (reads stdin when no file)'); process.exit(2) }
  const base = process.env.WARDS_REFERENCE || resolve(homedir(), 'Documents/Wards-reference')
  const ledgerPath = resolve(base, 'review-ledger', `${card}.yaml`)
  const mapPath = resolve(base, 'oe-batches', card, `${batch}.map.yaml`)
  for (const p of [ledgerPath, mapPath]) if (!existsSync(p)) { console.log(`review:oe-read: ${p} not found.`); process.exit(2) }
  const answer = file ? readFileSync(file, 'utf8') : readFileSync(0, 'utf8')
  const map = parse(readFileSync(mapPath, 'utf8'))
  const parsed = parseOeAnswer(answer)
  const ledgerText = readFileSync(ledgerPath, 'utf8')
  const { text, applied, unmapped } = applyToLedger(ledgerText, map, parsed)
  if (applied.length) writeFileSync(ledgerPath, text)
  writeFileSync(resolve(base, 'oe-batches', card, `${batch}.lists.yaml`), stringify({ date: ymd(), ...parsed.lists, recheck: parsed.recheck }))
  console.log(summarize({ card, batch, parsed, applied, unmapped, map, ledger: parse(text) }))
  process.exit(applied.length ? 0 : 1)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main()

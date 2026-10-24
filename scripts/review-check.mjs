// `npm run review:check -- <card-id>`: no-network, no-AI check of a private review ledger.
// Reads ~/Documents/Wards-reference/review-ledger/<card-id>.yaml and the saved source texts in
// ~/Documents/Wards-reference/source-library/<source-id>.txt (both stay outside the repo).
// Fails when a quote is not verbatim in its saved source text, when a number or unit in a claim
// disagrees with its quote, or when a non-match entry has no note.
import { readFileSync, existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'

const STATUSES = ['match', 'mismatch', 'partial', 'no-support']

// One line of plain text per source: header lines removed, whitespace and typographic marks flattened.
export function normalize(text) {
  return text
    .replace(/\[\[page \d+\]\]/g, ' ')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[   ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function stripHeader(text) {
  const i = text.indexOf('\n# ---\n')
  return i >= 0 ? text.slice(i + 7) : text
}

const UNIT_ALIASES = {
  'mmol/l': 'meq/l', 'meq/l': 'meq/l', meq: 'meq', meql: 'meq', 'mmol/litre': 'meq/l',
  ml: 'ml', mls: 'ml', cc: 'ml',
  min: 'min', mins: 'min', minute: 'min', minutes: 'min',
  h: 'h', hr: 'h', hrs: 'h', hour: 'h', hours: 'h',
  unit: 'units', units: 'units',
  gram: 'g', grams: 'g', g: 'g', mg: 'mg', mmol: 'mmol',
  '%': '%',
}

// "40 mEq" -> { value: '40', unit: 'meq' }; unit is '' when none follows.
const WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 }

// Years (1900-2099) are labels, not doses; spelled-out numbers up to ten count as digits.
export function numbersIn(text) {
  text = text.replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten)\b(?=\s+[a-zA-Z])/gi, (w) => String(WORDS[w.toLowerCase()]))
  const out = []
  const re = /(\d+(?:\.\d+)?)\s*(%|[a-zA-Zµ]+(?:\/[a-zA-Z]+)?)?/g
  let m
  while ((m = re.exec(text.replace(/(\d),(\d{3})/g, '$1$2')))) {
    const raw = (m[2] || '').toLowerCase()
    const unit = UNIT_ALIASES[raw] ?? (raw.length <= 8 ? raw : '')
    if (/^(19|20)\d\d$/.test(m[1])) continue
    out.push({ value: String(Number(m[1])), unit })
  }
  return out
}

export function compareNumbers(claim, quote) {
  const q = numbersIn(quote)
  const problems = []
  for (const c of numbersIn(claim)) {
    // A rounded claim (3% for 3.4%) agrees with its quote.
    const same = q.filter((x) => x.value === c.value || (!c.value.includes('.') && String(Math.round(Number(x.value))) === c.value && x.value.includes('.')))
    if (!same.length) { problems.push(`number ${c.value}${c.unit ? ' ' + c.unit : ''} is in the claim but not in the quote`); continue }
    if (c.unit && same.every((x) => x.unit && x.unit !== c.unit && !isWord(c.unit) && !isWord(x.unit))) {
      problems.push(`${c.value} ${c.unit} in the claim, but the quote has ${same.map((x) => x.value + ' ' + x.unit).join(' / ')}`)
    }
  }
  return problems
}

// Plain words that follow a number by chance ("30 mL of", "10 units soluble") are not units.
const KNOWN_UNITS = new Set(Object.values(UNIT_ALIASES))
function isWord(u) { return !KNOWN_UNITS.has(u) }

export function checkLedger({ ledger, texts }) {
  const failures = []
  const counts = { total: 0, match: 0, mismatch: 0, partial: 0, 'no-support': 0 }
  const fail = (e, rule, message) => failures.push({ id: e.id, where: e.where, claim: e.claim, quote: e.quote, rule, message })
  for (const e of ledger.entries ?? []) {
    counts.total++
    if (!STATUSES.includes(e.status)) { fail(e, 'bad-status', `status must be one of ${STATUSES.join(', ')}`); continue }
    counts[e.status]++
    if (e.status !== 'match' && !String(e.note ?? '').trim()) fail(e, 'missing-note', `a ${e.status} entry needs a note`)
    const quote = normalize(String(e.quote ?? ''))
    if (!quote) {
      if (e.status === 'match') fail(e, 'empty-quote', 'a match entry needs an exact quote')
      continue
    }
    const text = texts[e.source]
    if (text === undefined) { fail(e, 'source-missing', `no saved text for source ${e.source}`); continue }
    if (!text.includes(quote)) { fail(e, 'quote-not-found', `quote is not verbatim in ${e.source}`); continue }
    if (!e.converted) {
      for (const p of compareNumbers(String(e.claim ?? ''), String(e.quote))) fail(e, 'number-mismatch', p)
    }
  }
  return { counts, failures }
}

export function loadTexts(libDir, ledger) {
  const texts = {}
  for (const id of new Set((ledger.entries ?? []).map((e) => e.source))) {
    const p = resolve(libDir, `${id}.txt`)
    if (existsSync(p)) texts[id] = normalize(stripHeader(readFileSync(p, 'utf8')))
  }
  return texts
}

export function report({ counts, failures }, card) {
  const lines = [`review:check ${card}: ${counts.total} entries (match ${counts.match}, partial ${counts.partial}, mismatch ${counts.mismatch}, no-support ${counts['no-support']}).`]
  for (const f of failures) {
    lines.push('', `FAIL [${f.rule}] ${f.id}`, `  where: ${f.where}`, `  claim: ${f.claim}`, `  quote: ${f.quote || '(none)'}`, `  ${f.message}`)
  }
  lines.push('', failures.length ? `review:check found ${failures.length} problem(s).` : 'review:check passed: every quote is verbatim and every number agrees.')
  return lines.join('\n')
}

function main() {
  const card = process.argv[2]
  if (!card) { console.log('Usage: npm run review:check -- <card-id>'); process.exit(2) }
  const base = process.env.WARDS_REFERENCE || resolve(homedir(), 'Documents/Wards-reference')
  const ledgerPath = resolve(base, 'review-ledger', `${card}.yaml`)
  const libDir = resolve(base, 'source-library')
  if (!existsSync(ledgerPath) || !existsSync(libDir)) {
    console.log(`review:check skipped: the private ledger or source library is not on this computer (${base}). Nothing to check here.`)
    process.exit(0)
  }
  const ledger = parse(readFileSync(ledgerPath, 'utf8'))
  const result = checkLedger({ ledger, texts: loadTexts(libDir, ledger) })
  console.log(report(result, card))
  process.exit(result.failures.length ? 1 : 0)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main()

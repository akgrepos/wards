// `npm run review:precheck -- <card-id>`: the cheap mechanical checks that run before an Opus clinical review of a card.
// Reads the card and the data files it inserts, prints a plain-words report, and changes nothing. It checks:
//   1. Every line with a number, tagged HIGH-ALERT (a high-alert drug, or a dose insert marked not-verified) or ROUTINE.
//   2. Numbers written in the card that disagree with a referenced data file (same drug, same unit).
//   3. Citation markers that match no source file, sources the card lists but never cites, and number lines with no marker.
//   4. An evidence checklist (claim, source, blank for the quote). Nothing is fetched; a cheaper step fills the quotes.
// Exit 1 only for a real problem: a number that disagrees with its data file, or a marker with no source file.
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import YAML from 'yaml'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// Drugs whose errors cause the most harm. A line naming one of them is HIGH-ALERT.
const HIGH_ALERT_TERMS = [
  'insulin', 'potassium', 'KCl', 'K-phos', 'K⁺', 'K+', 'heparin', 'enoxaparin', 'warfarin',
  'apixaban', 'rivaroxaban', 'dabigatran', 'edoxaban', 'DOAC', 'bicarbonate', 'hypertonic saline', '3% saline',
  'amiodarone', 'digoxin', 'vasopressor', 'norepinephrine', 'epinephrine', 'vasopressin', 'dopamine', 'phenylephrine',
  'sedative', 'opioid', 'morphine', 'fentanyl', 'hydromorphone', 'midazolam', 'lorazepam', 'propofol', 'ketamine',
  'dexmedetomidine', 'magnesium', 'thrombolytic', 'alteplase', 'tenecteplase', 'reteplase',
]

// Units longest first, so "mEq/L" is read before "mEq" and "mg" before "g".
const UNITS = ['mEq/L', 'mmol/L', 'mg/dL', 'mcg/kg/min', 'mg/kg', 'units/kg', 'units/h', 'mL/h', 'mOsm/kg', 'mm Hg', 'mEq',
  'mmol', 'mcg', 'mg', 'µg', 'units', 'mL', 'hours', 'minutes', 'days', 'hour', 'minute', 'day', 'min', 'h', '%']
  .sort((a, b) => b.length - a.length)

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const HIGH_ALERT_RE = new RegExp(`(?<![A-Za-z])(?:${HIGH_ALERT_TERMS.map(escapeRe).join('|')})(?![A-Za-z])`, 'i')
// "5 mg", "20–30 mEq", "3.5-5.0 mEq/L": the numbers and the unit that follows them.
const QUANTITY_RE = new RegExp(`(\\d+(?:\\.\\d+)?)(?:\\s?[–-]\\s?(\\d+(?:\\.\\d+)?))?\\s?(${UNITS.map(escapeRe).join('|')})(?![\\w/])`, 'g')
const INSERT_RE = /\{\{\s*([a-z-]+)\s*:\s*([a-z0-9-]+)(?:\|[^}]*?)?\s*\}\}/g
const MARKER_RE = /\^\[([^\]]+)\]/g
const LINK_RE = /\[\[[^\]]+\]\]/g
const TAG_RE = /\[![\w-]+\]/g
// Keys in a data file that describe the file rather than the dose, so they are not compared.
const SKIP_KEYS = new Set(['verification', 'sources', 'checked', '_file'])

export function quantities(text) {
  return [...text.matchAll(QUANTITY_RE)].map((m) => ({ values: [m[1], m[2]].filter(Boolean).map(Number), unit: m[3], shown: m[0].trim() }))
}

export function markersIn(text) {
  return [...text.matchAll(MARKER_RE)].flatMap((m) => m[1].split(',').map((s) => s.trim()).filter(Boolean))
}

// A card line that carries a number, with its citation markers. Returns null for headings, fences, tables' rules,
// and lines with no number left once inserts, links and markers are removed.
export function claimOf(raw) {
  const sources = markersIn(raw)
  let text = raw.replace(MARKER_RE, '').replace(INSERT_RE, '').replace(LINK_RE, '').replace(TAG_RE, '').trim()
  if (!text || /^#/.test(text) || /^:::/.test(text) || /^\|?\s*:?-{2,}/.test(text)) return null
  text = text.replace(/^[-*]\s+/, '').replace(/^(\d+|or)\.\s+/, '')
  if (!/\d/.test(text)) return null
  return { text, sources }
}

// Why a line is high-alert: it names a high-alert drug, names a drug whose dose file is not verified, or inserts one.
export function highAlertReasons(text, insertedRefs = [], unverifiedWords = []) {
  const reasons = []
  const term = text.match(HIGH_ALERT_RE)
  if (term) reasons.push(`names ${term[0]}`)
  const lower = text.toLowerCase()
  const word = unverifiedWords.find((w) => lower.includes(w))
  if (word) reasons.push(`names ${word}, whose dose file is not verified`)
  if (insertedRefs.some((r) => r.read === 'not-verified')) reasons.push('a dose insert on this line is not verified')
  return reasons
}

// The text of a data file, minus the keys that describe the file.
export function dataText(item) {
  if (item && typeof item === 'object') {
    return Object.entries(item).filter(([k]) => !SKIP_KEYS.has(k)).map(([, v]) => dataText(v)).join(' | ')
  }
  return item == null ? '' : String(item)
}

// Words that tie a card line to a drug's data file: the drug's name words, plus potassium's symbols.
export function aliasWords(item) {
  const drug = String(item?.drug ?? '')
  const words = drug.split(/[-\s]/).filter((w) => w.length >= 4).map((w) => w.toLowerCase())
  if (/potassium/i.test(drug)) words.push('k⁺', 'k+', 'kcl')
  return words
}

// A card number with the same unit as a relevant dose file's amount must match that amount. Only dose files
// (amount and unit) are compared; other data files have no single amount to check against.
export function numberMismatches(text, relevant) {
  const dose = relevant.filter((r) => r.amount != null && r.unit != null)
  const problems = []
  let compared = 0
  for (const q of quantities(text)) {
    // A percent can be a concentration or a rate of patients ("16–28% of patients"), so it is not compared.
    if (q.unit === '%') continue
    const same = dose.filter((r) => String(r.unit) === q.unit)
    if (!same.length) continue
    const dataValues = same.flatMap((r) => quantities(`${r.amount} ${r.unit}`).flatMap((d) => d.values))
    compared += q.values.length
    const missing = q.values.filter((v) => !dataValues.includes(v))
    if (missing.length) problems.push({ shown: q.shown, dataValues, files: same.map((r) => r.file) })
  }
  return { problems, compared }
}

export function findCard(root, id) {
  const dir = join(root, 'content', 'cards')
  const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    const p = join(d, e.name)
    return e.isDirectory() ? walk(p) : e.name === `${id}.md` ? [p] : []
  })
  return existsSync(dir) ? walk(dir)[0] ?? null : null
}

function referencedData(src, root) {
  const seen = new Map()
  for (const [, kind, id] of src.matchAll(INSERT_RE)) {
    const key = `${kind}/${id}`
    const file = join(root, 'content', 'data', kind, `${id}.yaml`)
    if (seen.has(key) || !existsSync(file)) continue
    const item = YAML.parse(readFileSync(file, 'utf8')) ?? {}
    seen.set(key, {
      kind, id, item, file: relative(root, file), text: dataText(item), read: item.verification?.read,
      amount: item.amount, unit: item.unit, sources: Array.isArray(item.sources) ? item.sources : [], words: aliasWords(item),
    })
  }
  return [...seen.values()]
}

export function precheck(cardFile, root = ROOT) {
  const src = readFileSync(cardFile, 'utf8')
  const lines = src.split('\n')
  const fmEnd = lines.indexOf('---', 1)
  const meta = YAML.parse(lines.slice(1, fmEnd).join('\n')) ?? {}
  const refs = referencedData(src, root)
  const sourceIds = new Set(existsSync(join(root, 'content', 'data', 'source'))
    ? readdirSync(join(root, 'content', 'data', 'source')).filter((f) => f.endsWith('.yaml')).map((f) => f.replace(/\.yaml$/, ''))
    : [])
  const problems = []
  const info = []
  const claims = []
  const cited = new Set()
  const unverifiedWords = refs.filter((r) => r.read === 'not-verified').flatMap((r) => r.words)

  lines.forEach((raw, i) => {
    for (const id of markersIn(raw)) {
      cited.add(id)
      if (!sourceIds.has(id)) problems.push(`line ${i + 1}: citation ^[${id}] matches no file in content/data/source/`)
    }
    if (i <= fmEnd) return
    const claim = claimOf(raw)
    if (!claim) return
    const insertedIds = [...raw.matchAll(INSERT_RE)].map((m) => m[2])
    const inserted = refs.filter((r) => insertedIds.includes(r.id))
    const lower = claim.text.toLowerCase()
    const relevant = refs.filter((r) => inserted.includes(r) || r.words.some((w) => lower.includes(w)))
    const { problems: mismatches, compared } = numberMismatches(claim.text, relevant)
    for (const m of mismatches) problems.push(`line ${i + 1}: the card says "${m.shown}" but ${m.files.join(', ')} say ${m.dataValues.join(', ')} for that unit`)
    claims.push({ line: i + 1, ...claim, reasons: highAlertReasons(claim.text, inserted, unverifiedWords), compared })
  })

  for (const r of refs) {
    for (const id of r.sources) if (!sourceIds.has(id)) problems.push(`${r.file}: lists source ${id}, which has no file in content/data/source/`)
    for (const id of r.sources) cited.add(id)
  }
  const listed = Array.isArray(meta.based_on) ? meta.based_on : []
  for (const id of listed) if (!cited.has(id)) info.push(`${id} is listed in the card's based_on but no marker cites it`)

  const highAlert = claims.filter((c) => c.reasons.length)
  const unmarked = claims.filter((c) => !c.sources.length)
  const numbersChecked = claims.reduce((n, c) => n + c.compared, 0)
  return { file: relative(root, cardFile), id: meta.id, claims, highAlert, unmarked, numbersChecked, refs, problems, info }
}

const tagOf = (c) => (c.reasons.length ? 'HIGH-ALERT' : 'ROUTINE   ')

export function formatReport(r) {
  const out = []
  out.push(`Pre-check for ${r.id ?? r.file}  (${r.file})`)
  out.push('Nothing was changed. These checks are mechanical; the Opus review still reads the card.')
  out.push('')
  out.push(`1. Number lines: ${r.claims.length} (HIGH-ALERT ${r.highAlert.length}, ROUTINE ${r.claims.length - r.highAlert.length})`)
  for (const c of r.claims) {
    const why = c.reasons.length ? `  [${c.reasons.join('; ')}]` : ''
    out.push(`   ${tagOf(c)} line ${c.line}: ${c.text}${why}`)
  }
  out.push('')
  out.push(`2. Numbers against the dose files the card inserts: ${r.refs.length} data file(s) inserted, ${r.numbersChecked} number(s) compared`)
  const mism = r.problems.filter((p) => /the card says/.test(p))
  out.push(mism.length ? mism.map((p) => `   PROBLEM ${p}`).join('\n') : '   No mismatches.')
  out.push('')
  out.push('3. Citation markers')
  const unresolved = r.problems.filter((p) => !/the card says/.test(p))
  out.push(unresolved.length ? unresolved.map((p) => `   PROBLEM ${p}`).join('\n') : '   Every marker resolves to a source file.')
  out.push(`   Number lines with no marker: ${r.unmarked.length}${r.unmarked.length ? ' (see the checklist)' : ''}`)
  for (const i of r.info) out.push(`   Info: ${i}`)
  out.push('')
  const checklist = [...r.highAlert, ...r.unmarked.filter((c) => !c.reasons.length)].sort((a, b) => a.line - b.line)
  out.push(`4. Evidence to fetch (nothing fetched): ${checklist.length} item(s)`)
  for (const c of checklist) {
    out.push(`   [ ] line ${c.line} · ${tagOf(c).trim()} · source: ${c.sources.length ? c.sources.join(', ') : 'none marked'}`)
    out.push(`       claim: ${c.text}`)
    out.push('       quote: ______________________________')
  }
  out.push('')
  out.push(r.problems.length
    ? `Result: ${r.problems.length} problem(s) to fix before the Opus review (exit 1).`
    : 'Result: no problems. The checklist is information for the Opus review.')
  return out.join('\n')
}

function main() {
  const id = process.argv[2]
  if (!id) { console.log('Usage: npm run review:precheck -- <card-id>'); process.exit(2) }
  const file = findCard(ROOT, id)
  if (!file) { console.log(`review:precheck: no card named ${id} under content/cards/.`); process.exit(2) }
  const result = precheck(file)
  console.log(formatReport(result))
  process.exit(result.problems.length ? 1 : 0)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main()

// `npm run review:oe-batches -- <card-id>`: cuts the private review ledger into ready-to-paste batches
// for the owner's OpenEvidence `.card_check` dotflow. Reads ~/Documents/Wards-reference/review-ledger/<card-id>.yaml
// and the current card title, and writes, outside the repo,
// ~/Documents/Wards-reference/oe-batches/<card-id>/batch-NN.txt (about 25 statements each, riskiest first) and
// batch-NN.map.yaml (statement number -> ledger entry id). Statements never carry source names or quotes, so the
// check stays independent. Entries marked `owner_checked` are skipped. The script never contacts OpenEvidence:
// the owner pastes each file by hand. A statement can be replaced by hand in
// oe-batches/<card-id>/statements.override.yaml (entry id -> full statement text); that file is kept between runs.
import { readFileSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse, stringify } from 'yaml'

export const PER_BATCH = 25

const ABBREVIATIONS = [
  [/K⁺|K\+/g, 'potassium'],
  [/\bECGs?\b/g, (m) => (m.endsWith('s') ? 'electrocardiograms' : 'electrocardiogram')],
  [/\bIV\b/g, 'intravenous'],
  [/\bPO\b/g, 'oral'],
  [/\bSZC\b/g, 'sodium zirconium cyclosilicate'],
  [/\bRAAS\b/g, 'renin-angiotensin-aldosterone system'],
  [/\bAKI\b/g, 'acute kidney injury'],
  [/\bCKD\b/g, 'chronic kidney disease'],
  [/\bICU\b/g, 'intensive care unit'],
  [/\bSTEMI\b/g, 'ST-elevation myocardial infarction'],
  [/\bQRS\b/g, 'QRS'],
  [/(\d)\s*h\b/g, '$1 hours'],
  [/(\d)\s*min\b/g, '$1 minutes'],
  [/\bhyperkalaemia\b/gi, (m) => (m[0] === 'H' ? 'Hyperkalemia' : 'hyperkalemia')],
]

const SUBJECT_WORDS = { szc: 'sodium zirconium cyclosilicate', neb: 'nebulized', regular: 'regular' }

export function expandAbbreviations(text) {
  let out = text
  for (const [re, to] of ABBREVIATIONS) out = out.replace(re, to)
  return out
}

// "data/dose/calcium-gluconate-hyperkalemia.yaml" -> "Calcium gluconate"; "albuterol-neb" -> "Nebulized albuterol".
export function subjectFromWhere(where, topic) {
  const m = String(where).match(/\bdata\/dose\/([\w-]+)\.yaml/)
  if (!m) return null
  const topicWord = topic.toLowerCase().replace(/[^a-z]/g, '')
  let words = m[1].split('-').filter((w) => w.toLowerCase() !== topicWord && w !== 'hyperkalemia')
  let phase = ''
  words = words.filter((w) => {
    if (w === 'initial' || w === 'maintenance') { phase = w; return false }
    return true
  })
  words = words.map((w, i) => (/^\d+$/.test(w) ? `${w}%` : SUBJECT_WORDS[w] ?? w))
  if (words.includes('nebulized')) words = ['nebulized', ...words.filter((w) => w !== 'nebulized')]
  if (words[0] === 'insulin' && words[1] === 'regular') words = ['regular', 'insulin']
  let s = words.join(' ')
  if (words.length === 2 && words[1] === 'regular') s = 'regular ' + words[0]
  s = s.charAt(0).toUpperCase() + s.slice(1)
  if (phase) s += ` (${phase === 'initial' ? 'initial treatment' : 'maintenance'})`
  return s
}

// Society and source names must not reach OpenEvidence. Returns the cleaned text and whether anything was removed.
export function scrubSources(text, sourceIds = []) {
  const names = new Set(['UKKA', 'KDIGO', 'AHA', 'EMCREG'])
  for (const id of sourceIds) {
    const first = String(id).split('-')[0]
    if (first && first.toLowerCase() !== 'label') names.add(first.toUpperCase())
  }
  const alt = [...names].join('|')
  const re = new RegExp(`\\(?\\b(?:(?:UK|US)\\s+guidelines?|(?:${alt}))\\b(?:\\s+\\d{4})?(?:\\s+guidelines?)?\\)?\\s*:?\\s*`, 'gi')
  const out = text.replace(re, ' ').replace(/\s+/g, ' ').replace(/\s+([.,;:])/g, '$1').trim()
  return { text: out, scrubbed: out !== text.replace(/\s+/g, ' ').trim() }
}

function sentence(s) {
  s = s.trim()
  s = /^[a-z]/.test(s) ? s.charAt(0).toUpperCase() + s.slice(1) : s
  return /[.!?]$/.test(s) ? s : s + '.'
}

export function buildStatement(entry, { topic, sourceIds, override }) {
  if (override) return { text: sentence(override), scrubbed: false, overridden: true }
  const { text: claim, scrubbed } = scrubSources(String(entry.claim ?? ''), sourceIds)
  const subject = subjectFromWhere(entry.where, topic)
  let out = claim
  if (subject && !claim.toLowerCase().includes(subject.split(' ')[0].toLowerCase())) {
    out = `${subject} for ${topic.toLowerCase()} in adults: ${/^[A-Z][a-z]/.test(claim) ? claim.charAt(0).toLowerCase() + claim.slice(1) : claim}`
  } else if (subject) out = `${claim} (adults, ${topic.toLowerCase()})`
  return { text: sentence(expandAbbreviations(out)), scrubbed, overridden: false }
}

// 0 = doses and Do Now lines, 1 = thresholds and anything with a number, 2 = the rest.
export function riskTier(entry) {
  const where = String(entry.where ?? '')
  const claim = String(entry.claim ?? '')
  if (/data\/dose\//.test(where) && /(\d|dose|amount|rate|frequency|maximum|max)/i.test(where + claim)) return 0
  if (/Do Now/i.test(where)) return 0
  if (/data\/threshold\//.test(where) || /\d/.test(claim)) return 1
  return 2
}

export function orderEntries(entries) {
  return entries.map((e, i) => ({ e, i })).sort((a, b) => riskTier(a.e) - riskTier(b.e) || a.i - b.i).map((x) => x.e)
}

export function chunk(items, per = PER_BATCH) {
  if (!items.length) return []
  const n = Math.ceil(items.length / per)
  const size = Math.ceil(items.length / n)
  return Array.from({ length: n }, (_, i) => items.slice(i * size, (i + 1) * size))
}

export function renderBatch(topic, statements) {
  return [`Topic: ${topic}`, '', ...statements.map((s, i) => `${i + 1}. ${s}`), ''].join('\n')
}

export function cardTitle(root, cardId) {
  const dir = resolve(root, 'content/cards')
  if (existsSync(dir)) {
    for (const sys of readdirSync(dir)) {
      const p = resolve(dir, sys, `${cardId}.md`)
      if (existsSync(p)) {
        const m = readFileSync(p, 'utf8').match(/^title:\s*"?([^"\n]+?)"?\s*$/m)
        if (m) return m[1]
      }
    }
  }
  return cardId
}

export function planBatches({ ledger, topic, overrides = {} }) {
  const sourceIds = [...new Set((ledger.entries ?? []).map((e) => e.source))]
  const all = ledger.entries ?? []
  const skipped = all.filter((e) => e.owner_checked)
  const todo = orderEntries(all.filter((e) => !e.owner_checked))
  const batches = chunk(todo).map((group) => group.map((entry) => ({ entry, ...buildStatement(entry, { topic, sourceIds, override: overrides[entry.id] }) })))
  return { batches, skipped }
}

function main() {
  const card = process.argv[2]
  if (!card) { console.log('Usage: npm run review:oe-batches -- <card-id>'); process.exit(2) }
  const root = process.cwd()
  const base = process.env.WARDS_REFERENCE || resolve(homedir(), 'Documents/Wards-reference')
  const ledgerPath = resolve(base, 'review-ledger', `${card}.yaml`)
  if (!existsSync(ledgerPath)) { console.log(`review:oe-batches skipped: no private ledger for ${card} in ${base}.`); process.exit(0) }
  const ledger = parse(readFileSync(ledgerPath, 'utf8'))
  const outDir = resolve(base, 'oe-batches', card)
  mkdirSync(outDir, { recursive: true })
  const overridePath = resolve(outDir, 'statements.override.yaml')
  const overrides = existsSync(overridePath) ? parse(readFileSync(overridePath, 'utf8')) ?? {} : {}
  const topic = cardTitle(root, card)
  const { batches, skipped } = planBatches({ ledger, topic, overrides })
  for (const f of readdirSync(outDir)) if (/^batch-\d+\.(txt|map\.yaml)$/.test(f)) rmSync(resolve(outDir, f))
  const flagged = []
  batches.forEach((group, i) => {
    const nn = String(i + 1).padStart(2, '0')
    writeFileSync(resolve(outDir, `batch-${nn}.txt`), renderBatch(topic, group.map((g) => g.text)))
    const map = { card, batch: `batch-${nn}`, entries: Object.fromEntries(group.map((g, k) => [k + 1, g.entry.id])) }
    writeFileSync(resolve(outDir, `batch-${nn}.map.yaml`), stringify(map))
    group.forEach((g, k) => { if (g.scrubbed) flagged.push(`batch-${nn} #${k + 1} (${g.entry.id}): a source name was removed; read it, or set an override`) })
  })
  const total = batches.reduce((n, g) => n + g.length, 0)
  console.log(`review:oe-batches ${card}: ${total} statements in ${batches.length} batch(es); ${skipped.length} owner-checked entries skipped.`)
  for (let i = 0; i < batches.length; i++) console.log(`  ${resolve(outDir, `batch-${String(i + 1).padStart(2, '0')}.txt`)}`)
  if (flagged.length) console.log('\nCheck these:\n' + flagged.map((f) => '  ' + f).join('\n'))
  console.log('\nIn OpenEvidence use the .card_check mode (Sackett by default). Paste each batch by hand; never automate.')
  console.log(`Hand-written replacements go in ${overridePath} (entry id: full statement), then run this again.`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main()

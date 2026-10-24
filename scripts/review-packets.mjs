// `npm run review:packets -- <card-id> [--blind-seed N]`: cuts review packets from the private ledger.
// Reads ~/Documents/Wards-reference/review-ledger/<card-id>.yaml and source-library/<source-id>.txt (as
// review:check does) plus the current card and data files, and writes, outside the repo,
// ~/Documents/Wards-reference/review-packets/<card-id>/packets-NNN.md (about 25 packets each).
// A packet = the card line or data, the writer's quote, an automatic window of source text around the
// quote, every other place the same number-with-unit appears in that source, and the review:check result.
// A random sample (about 10 percent, at least 5) is BLIND: the quote is hidden until the end of the file.
import { readFileSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'
import { normalize, numbersIn, checkLedger, loadTexts } from './review-check.mjs'

export const PER_FILE = 25
export const WINDOW_WORDS = 250
const SNIPPET_WORDS = 12
const MAX_PER_NUMBER = 6
const MAX_OCCURRENCES = 16

const wordCount = (s) => (s.trim() ? s.trim().split(/\s+/).length : 0)

export function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function pickBlind(count, seed) {
  const n = Math.min(count, Math.max(5, Math.round(count * 0.1)))
  const rand = mulberry32(seed)
  const idx = [...Array(count).keys()]
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[idx[i], idx[j]] = [idx[j], idx[i]]
  }
  return new Set(idx.slice(0, n))
}

// ---- source text: words and positions -------------------------------------------------------------

export function windowAround(text, quote, words = WINDOW_WORDS) {
  const at = text.indexOf(quote)
  if (at < 0) return null
  const before = text.slice(0, at).split(' ').filter(Boolean)
  const q = quote.split(' ').filter(Boolean)
  const all = text.split(' ').filter(Boolean)
  const start = Math.max(0, before.length - words)
  const end = Math.min(all.length, before.length + q.length + words)
  return { text: all.slice(start, end).join(' '), start, end, quoteStart: before.length, quoteEnd: before.length + q.length }
}

const UNIT_FORMS = {
  'meq/l': ['mEq/L', 'mmol/L', 'mmol/litre', 'meq/l'], meq: ['mEq'], ml: ['mL', 'ml', 'mls', 'cc'],
  min: ['min', 'mins', 'minute', 'minutes'], h: ['h', 'hr', 'hrs', 'hour', 'hours'],
  units: ['unit', 'units'], g: ['g', 'gram', 'grams'], mg: ['mg'], mmol: ['mmol'], '%': ['%'],
}

// Number-with-unit anchors from a claim: known units, or decimals. Plain small integers are too common.
export function anchorsOf(claim) {
  const seen = new Set()
  const out = []
  const flat = claim.replace(/(\d)\s*[–-]\s*(?=\d)/g, '$1 ')
  for (const n of numbersIn(flat)) {
    const forms = UNIT_FORMS[n.unit]
    if (!forms && !n.value.includes('.')) continue
    const key = `${n.value}|${n.unit}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push({ ...n, forms })
  }
  return out
}

function anchorRegex(a) {
  const num = a.value.replace('.', '\\.')
  const unit = a.forms ? `\\s*(?:${a.forms.map((f) => f.replace(/[/%]/g, (c) => '\\' + c)).join('|')})(?![A-Za-z])` : ''
  return new RegExp(`(?<![\\d.])${num}(?:\\.0+)?(?!\\d)${unit}`, 'gi')
}

function wordIndexAt(text, charPos) {
  let n = 0
  for (let i = 0; i < charPos; i++) if (text.charCodeAt(i) === 32) n++
  return n
}

function snippetAt(words, i, len = 1) {
  const s = Math.max(0, i - SNIPPET_WORDS)
  return '… ' + words.slice(s, Math.min(words.length, i + len + SNIPPET_WORDS)).join(' ') + ' …'
}

// Every other place a claim's number-with-unit appears in the same source, outside the shown window.
export function otherOccurrences(text, anchors, shown) {
  const words = text.split(' ')
  const seen = new Set()
  const out = []
  for (const a of anchors) {
    let taken = 0
    for (const m of text.matchAll(anchorRegex(a))) {
      const wi = wordIndexAt(text, m.index)
      if (shown && wi >= shown.start && wi < shown.end) continue
      const snip = snippetAt(words, wi, 2)
      if (seen.has(snip)) continue
      seen.add(snip)
      if (taken++ < MAX_PER_NUMBER && out.length < MAX_OCCURRENCES) out.push({ number: `${a.value}${a.unit ? ' ' + (a.forms?.[0] ?? a.unit) : ''}`, snippet: snip })
    }
  }
  return out
}

// When the quote is missing: passages where the most claim numbers sit close together.
export function candidatePassages(text, claim, quote) {
  const words = text.split(' ')
  const anchors = anchorsOf(claim)
  const out = []
  const prefix = quote ? quote.split(' ').slice(0, 5).join(' ') : ''
  if (prefix.length > 12) {
    const at = text.indexOf(prefix)
    if (at >= 0) out.push({ why: 'start of the writer’s quote', start: Math.max(0, wordIndexAt(text, at) - 60), end: wordIndexAt(text, at) + 140 })
  }
  const hits = []
  for (const [k, a] of anchors.entries()) for (const m of text.matchAll(anchorRegex(a))) hits.push({ k, wi: wordIndexAt(text, m.index) })
  hits.sort((x, y) => x.wi - y.wi)
  const scored = hits.map((h) => ({ wi: h.wi, score: new Set(hits.filter((o) => Math.abs(o.wi - h.wi) <= 40).map((o) => o.k)).size }))
  scored.sort((x, y) => y.score - x.score || x.wi - y.wi)
  for (const s of scored) {
    if (out.length >= 3) break
    if (out.some((o) => s.wi >= o.start && s.wi < o.end)) continue
    out.push({ why: `${s.score} of ${anchors.length} claim numbers within 40 words`, start: Math.max(0, s.wi - 100), end: s.wi + 100 })
  }
  return out.map((o) => ({ why: o.why, start: o.start, end: Math.min(words.length, o.end), text: words.slice(o.start, Math.min(words.length, o.end)).join(' ') }))
}

// ---- card and data text -----------------------------------------------------------------------------

export function findCardPath(root, cardId) {
  const dir = resolve(root, 'content/cards')
  if (!existsSync(dir)) return null
  for (const sys of readdirSync(dir)) {
    const p = resolve(dir, sys, `${cardId}.md`)
    if (existsSync(p)) return p
  }
  return null
}

const tokens = (s) => new Set(normalize(s).toLowerCase().match(/[a-z0-9⁺.]{3,}/g) ?? [])

// The card lines a ledger "where" points at: lines containing its quoted text, else the best word overlap.
export function cardLines(cardText, where, claim) {
  const lines = cardText.split('\n')
  let section = ''
  const withSection = lines.map((l) => {
    if (/^#{1,3}\s/.test(l)) section = l.replace(/^#+\s*/, '')
    return { line: l, section }
  })
  const quoted = [...where.matchAll(/\\?"([^"]+?)\\?"/g)].map((m) => normalize(m[1]).toLowerCase()).filter((q) => q.length > 6)
  const body = withSection.filter((x) => x.line.trim() && !/^#{1,3}\s/.test(x.line))
  let hits = body.filter((x) => quoted.some((q) => normalize(x.line).toLowerCase().includes(q)))
  if (!hits.length) {
    const want = tokens(`${where} ${claim}`)
    hits = body
      .map((x) => ({ x, s: [...tokens(x.line)].filter((t) => want.has(t)).length }))
      .filter((h) => h.s >= 2)
      .sort((a, b) => b.s - a.s)
      .slice(0, 3)
      .map((h) => h.x)
  }
  return hits.slice(0, 4).map((h) => `${h.line.trim()}   [section: ${h.section || 'front matter'}]`)
}

export function cardExtract({ root, cardId, where, claim }) {
  const parts = []
  const dm = where.match(/\bdata\/([\w-]+\/[\w-]+\.yaml)/)
  if (dm) {
    const p = resolve(root, 'content/data', dm[1])
    parts.push(existsSync(p) ? `Data file ${dm[1]} (field: ${where.replace(dm[0], '').trim() || 'whole file'}):\n${readFileSync(p, 'utf8').trim().split('\n').slice(0, 45).join('\n')}` : `Data file ${dm[1]} not found in the repo.`)
  }
  if (/\bcard\b/.test(where) || !dm) {
    const cp = findCardPath(root, cardId)
    if (!cp) parts.push(`Card file for ${cardId} not found.`)
    else {
      const lines = cardLines(readFileSync(cp, 'utf8'), where, claim)
      parts.push(lines.length ? `Card lines (${where}):\n${lines.map((l) => '  ' + l).join('\n')}` : `No card line could be matched automatically for: ${where}`)
    }
  }
  return parts.join('\n\n')
}

// ---- blind packets: candidates that do not point at the writer's quote -------------------------------

export const BLIND_CONTEXT_WORDS = 150
export const BLIND_MAX_CANDIDATES = 12
const STOP = new Set('with that this from have been were when than then into over under after before only also more most such each other their there which while about between should would could does not and the for are may can use used'.split(' '))

// Every passage holding a claim number-with-unit (merged when they overlap, strongest first, at most 12);
// for a claim without such numbers, the 3 passages sharing the most keywords with it. Order is shuffled
// with the seed, and nothing shown says where the writer's quote is.
export function blindCandidates(text, claim, seed) {
  const words = text.split(' ')
  const half = BLIND_CONTEXT_WORDS / 2
  const anchors = anchorsOf(claim)
  let spans = []
  if (anchors.length) {
    const hits = []
    for (const [k, a] of anchors.entries()) for (const m of text.matchAll(anchorRegex(a))) hits.push({ k, wi: wordIndexAt(text, m.index) })
    hits.sort((x, y) => x.wi - y.wi)
    for (const h of hits) {
      const s = Math.max(0, h.wi - half)
      const e = Math.min(words.length, h.wi + half)
      const last = spans.at(-1)
      if (last && s <= last.end) { last.end = Math.max(last.end, e); last.keys.add(h.k) } else spans.push({ start: s, end: e, keys: new Set([h.k]) })
    }
    spans = spans.sort((a, b) => b.keys.size - a.keys.size || a.start - b.start).slice(0, BLIND_MAX_CANDIDATES)
  } else {
    const want = new Set((claim.toLowerCase().match(/[a-z]{4,}/g) ?? []).filter((w) => !STOP.has(w)))
    const scored = []
    for (let s = 0; s < words.length; s += 25) {
      const seen = new Set()
      for (const w of words.slice(s, s + BLIND_CONTEXT_WORDS)) { const t = w.toLowerCase().replace(/[^a-z]/g, ''); if (want.has(t)) seen.add(t) }
      if (seen.size) scored.push({ start: s, end: Math.min(words.length, s + BLIND_CONTEXT_WORDS), score: seen.size })
    }
    scored.sort((a, b) => b.score - a.score || a.start - b.start)
    for (const c of scored) if (spans.length < 3 && !spans.some((o) => c.start < o.end && c.end > o.start)) spans.push(c)
  }
  const out = spans.map((s) => words.slice(s.start, s.end).join(' '))
  const rand = mulberry32(seed)
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

// ---- packets ---------------------------------------------------------------------------------------

export function buildPacket({ entry, text, cardText, check }) {
  const quote = normalize(String(entry.quote ?? ''))
  const p = { id: entry.id, flags: [], window: null, candidates: [], others: [], cardText, checkText: check, quote: String(entry.quote ?? '').trim(), location: entry.location ?? '', source: entry.source, claim: String(entry.claim ?? '') }
  if (text === undefined) { p.flags.push('source-missing'); return p }
  if (!quote) p.flags.push('no-quote')
  else {
    const w = windowAround(text, quote)
    if (w) { p.window = w; p.foundVerbatim = true }
    else p.flags.push('quote-not-found')
  }
  if (!p.window) p.candidates = candidatePassages(text, p.claim, quote)
  p.others = otherOccurrences(text, anchorsOf(p.claim), p.window)
  return p
}

function renderBlind(p, n) {
  const out = [`## Packet ${n}: ${p.id} (BLIND)${p.flags.includes('source-missing') ? ' [source-missing]' : ''}`, '']
  out.push('**Card claim (as written now)**', '', '```', p.cardText, '```', '', `Claim in short: ${p.claim}`, '', `Source: ${p.source}`, '')
  if (p.flags.includes('source-missing')) out.push('No saved source text is available for this entry.', '')
  else {
    out.push('The writer’s quote and its location are hidden. The passages below come from the source in shuffled order, chosen by the claim’s numbers or key words; the supporting sentence may be in none of them. Name which passage (if any) supports the claim before reading the last section of this file.', '')
    const c = p.blindCandidates ?? []
    if (!c.length) out.push('No passage in the source matched the claim’s numbers or key words.', '')
    c.forEach((t, i) => out.push(`Passage ${String.fromCharCode(65 + i % 26)}${i >= 26 ? Math.floor(i / 26) : ''}:`, '', `> ${t}`, ''))
  }
  return out.join('\n')
}

export function renderPacket(p, n, blind) {
  if (blind) return renderBlind(p, n)
  const out = [`## Packet ${n}: ${p.id}${p.flags.length ? ` [${p.flags.join(', ')}]` : ''}`, '']
  out.push('**Card claim (as written now)**', '', '```', p.cardText, '```', '', `Claim in short: ${p.claim}`, '', `Source: ${p.source}`, '')
  out.push(`**Writer’s quote** (location: ${p.location || 'not given'}):`, '', p.quote ? `> ${p.quote}` : '> (none given)', '')
  if (p.window) out.push(`**Source text around the quote** (about ${WINDOW_WORDS} words each side):`, '', `> ${p.window.text}`, '')
  else if (p.candidates.length) {
    out.push(p.flags.includes('source-missing') ? '' : '**Best candidate passages** (the quote could not be placed, so these were found by the claim’s numbers):', '')
    p.candidates.forEach((c, i) => out.push(`Candidate ${i + 1} (${c.why}):`, '', `> ${c.text}`, ''))
  } else if (p.flags.includes('source-missing')) out.push('No saved source text is available for this entry.', '')
  else out.push('No candidate passage found in the source for this claim’s numbers.', '')
  if (p.others.length) {
    out.push('**Same numbers elsewhere in this source** (look for anything that disagrees):', '')
    for (const o of p.others) out.push(`- ${o.number}: ${o.snippet}`)
    out.push('')
  }
  if (!blind) out.push(`**review:check result:** ${p.checkText}`, '')
  return out.join('\n')
}

export function checkText(entry, texts) {
  const { failures } = checkLedger({ ledger: { entries: [entry] }, texts })
  const status = entry.status
  if (!failures.length) return `${status}, quote and numbers agree`
  return `${status}; ${failures.map((f) => `${f.rule === 'number-mismatch' ? 'number mismatch' : f.rule}: ${f.message}`).join(' | ')}`
}

export function buildAll({ ledger, texts, root, card, seed }) {
  const entries = ledger.entries ?? []
  const blindSet = pickBlind(entries.length, seed)
  const packets = entries.map((entry) => {
    const text = texts[entry.source]
    const cardText = cardExtract({ root, cardId: card, where: String(entry.where ?? ''), claim: String(entry.claim ?? '') })
    return buildPacket({ entry, text, cardText, check: checkText(entry, texts) })
  })
  packets.forEach((p, i) => {
    if (blindSet.has(i) && texts[p.source] !== undefined) p.blindCandidates = blindCandidates(texts[p.source], p.claim, seed + i)
  })
  const rendered = packets.map((p, i) => ({ p, blind: blindSet.has(i), body: renderPacket(p, i + 1, blindSet.has(i)), n: i + 1 }))
  rendered.forEach((r) => { r.words = wordCount(r.body) })

  const withQuote = packets.filter((p, i) => normalize(entries[i].quote ?? '') && texts[entries[i].source] !== undefined)
  const found = withQuote.filter((p) => p.foundVerbatim).length
  const sources = new Set([...entries.map((e) => e.source), ...(ledger.unreadable_sources ?? [])])
  const sourcesMissing = [...sources].filter((s) => texts[s] === undefined)
  const words = rendered.map((r) => r.words)
  const stats = {
    packets: rendered.length,
    blind: blindSet.size,
    seed,
    foundShare: withQuote.length ? found / withQuote.length : 0,
    withQuote: withQuote.length,
    found,
    meanWords: words.length ? Math.round(words.reduce((a, b) => a + b, 0) / words.length) : 0,
    maxWords: Math.max(0, ...words),
    totalWords: words.reduce((a, b) => a + b, 0),
    blindMeanWords: blindSet.size ? Math.round(rendered.filter((r) => r.blind).reduce((a, r) => a + r.words, 0) / blindSet.size) : 0,
    blindMaxWords: Math.max(0, ...rendered.filter((r) => r.blind).map((r) => r.words)),
    entriesSourceMissing: entries.filter((e) => texts[e.source] === undefined).length,
    sourcesCited: sources.size,
    sourcesMissing: sourcesMissing.length,
  }
  const files = []
  for (let i = 0; i < rendered.length; i += PER_FILE) {
    const batch = rendered.slice(i, i + PER_FILE)
    const bw = batch.map((b) => b.words)
    const num = String(files.length + 1).padStart(3, '0')
    const head = [
      `# Review packets: ${card}, batch ${num}`,
      '',
      `Packets ${batch[0].n} to ${batch.at(-1).n} of ${stats.packets}. Blind sample: ${stats.blind} of ${stats.packets} packets (seed ${seed}); blind packets in this file: ${batch.filter((b) => b.blind).length}.`,
      `This batch: ${batch.length} packets, ${bw.reduce((a, b) => a + b, 0)} words (mean ${Math.round(bw.reduce((a, b) => a + b, 0) / batch.length)}, max ${Math.max(...bw)} per packet).`,
      `Whole card: mean ${stats.meanWords} and max ${stats.maxWords} words per packet; ${Math.round(stats.foundShare * 100)}% of quotes found verbatim without help (${found} of ${withQuote.length}); ${stats.entriesSourceMissing} ledger entries with no saved source text.`,
      '',
      'PRIVATE: contains copyrighted source text. Never commit.',
      '',
      '---',
      '',
    ].join('\n')
    const blindQuotes = batch.filter((b) => b.blind)
    const tail = blindQuotes.length
      ? ['', '---', '', '# Writer’s quotes for the blind packets (read ONLY after answering every blind packet)', '', ...blindQuotes.flatMap((b) => [`## Packet ${b.n}: ${b.p.id}`, '', `Location: ${b.p.location || 'not given'}`, '', b.p.quote ? `> ${b.p.quote}` : '> (none given)', '', `review:check result: ${b.p.checkText}`, ''])].join('\n')
      : ''
    files.push({ name: `packets-${num}.md`, content: head + batch.map((b) => b.body).join('\n---\n\n') + tail + '\n' })
  }
  return { files, stats }
}

export function summary(card, outDir, { files, stats }) {
  const pct = (x) => `${Math.round(x * 100)}%`
  return [
    `review:packets ${card}: ${stats.packets} packets in ${files.length} file(s) in ${outDir}`,
    `  blind sample: ${stats.blind} packets, seed ${stats.seed}; words per blind packet: mean ${stats.blindMeanWords}, max ${stats.blindMaxWords}`,
    `  quotes found verbatim without help: ${pct(stats.foundShare)} (${stats.found} of ${stats.withQuote} entries that have a quote and a saved source)`,
    `  words per packet: mean ${stats.meanWords}, max ${stats.maxWords}; total ${stats.totalWords}`,
    `  ledger entries whose source text is missing: ${pct(stats.packets ? stats.entriesSourceMissing / stats.packets : 0)} (${stats.entriesSourceMissing} of ${stats.packets})`,
    `  sources without saved text (paywall rate): ${pct(stats.sourcesCited ? stats.sourcesMissing / stats.sourcesCited : 0)} (${stats.sourcesMissing} of ${stats.sourcesCited} cited)`,
  ].join('\n')
}

function main() {
  const args = process.argv.slice(2)
  const card = args.find((a) => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--blind-seed')
  if (!card) { console.log('Usage: npm run review:packets -- <card-id> [--blind-seed N]'); process.exit(2) }
  const si = args.indexOf('--blind-seed')
  const seed = si >= 0 ? Number(args[si + 1]) : Math.floor(Math.random() * 1e6)
  if (!Number.isInteger(seed)) { console.log('--blind-seed needs a whole number'); process.exit(2) }
  const base = process.env.WARDS_REFERENCE || resolve(homedir(), 'Documents/Wards-reference')
  const ledgerPath = resolve(base, 'review-ledger', `${card}.yaml`)
  const libDir = resolve(base, 'source-library')
  if (!existsSync(ledgerPath) || !existsSync(libDir)) {
    console.log(`review:packets skipped: the private ledger or source library is not on this computer (${base}).`)
    process.exit(0)
  }
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const ledger = parse(readFileSync(ledgerPath, 'utf8'))
  const result = buildAll({ ledger, texts: loadTexts(libDir, ledger), root, card, seed })
  const outDir = resolve(base, 'review-packets', card)
  mkdirSync(outDir, { recursive: true })
  for (const f of readdirSync(outDir)) if (/^packets-\d+\.md$/.test(f)) rmSync(resolve(outDir, f))
  for (const f of result.files) writeFileSync(resolve(outDir, f.name), f.content)
  console.log(summary(card, outDir, result))
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main()

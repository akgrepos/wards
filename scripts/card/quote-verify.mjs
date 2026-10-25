// quote-verify.mjs: checks that every quote a Haiku helper returned really appears in the source text file,
// and lists the numbers found in each quote so they can be compared with the card.
// Usage: node scripts/card/quote-verify.mjs <packet-dir>
// Each out-<job>.jsonl line: {"id","quote","where"}. The source text is <packet-dir>/<job>.txt, or the files
// listed for that job in <packet-dir>/sources.json ({"<job>": ["a.txt", "b.txt"]}; an empty list means "no local text").
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { norm, readJsonl } from './lib.mjs'

const dir = process.argv[2]
if (!dir) { console.error('Usage: node scripts/card/quote-verify.mjs <packet-dir>'); process.exit(1) }
const extra = existsSync(join(dir, 'sources.json')) ? JSON.parse(readFileSync(join(dir, 'sources.json'), 'utf8')) : {}
const totals = { items: 0, quoted: 0, notFound: 0, verbatim: 0, notVerbatim: 0, unchecked: 0 }
for (const f of readdirSync(dir).filter(f => f.startsWith('out-') && f.endsWith('.jsonl')).sort()) {
  const job = f.slice(4, -6)
  const texts = (extra[job] || [job + '.txt']).filter(n => existsSync(join(dir, n))).map(n => norm(readFileSync(join(dir, n), 'utf8')))
  const rows = readJsonl(join(dir, f))
  console.log(`\n== ${job}: ${rows.length} lines`)
  for (const r of rows) {
    totals.items++
    if (!r.quote) { totals.notFound++; console.log(`  ${r.id}${r.part || ''}\tNOT FOUND`); continue }
    totals.quoted++
    let status
    if (!texts.length) { status = 'UNCHECKED (no local text)'; totals.unchecked++ }
    else if (texts.some(t => t.includes(norm(r.quote)))) { status = 'verbatim'; totals.verbatim++ }
    else { status = 'NOT VERBATIM'; totals.notVerbatim++ }
    const nums = (r.quote.match(/\d+(?:\.\d+)?/g) || []).join(', ')
    console.log(`  ${r.id}${r.part || ''}\t${status}\tnumbers: ${nums || '-'}\t${r.quote.slice(0, 110).replace(/\s+/g, ' ')}`)
  }
}
console.log('\nTOTAL', JSON.stringify(totals))

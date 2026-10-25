// claim-triples.mjs: for each claim row, prints the card line, then each cited quote with its location
// (claim / quote / location triples) for the Opus check.
// Usage: node scripts/card/claim-triples.mjs <card.md> <claims.txt> <packet-dir>
import { readFileSync } from 'node:fs'
import { loadJobs, loadQuotes, claimRows } from './lib.mjs'

const [card, claimsFile, dir] = process.argv.slice(2)
if (!dir) { console.error('Usage: node scripts/card/claim-triples.mjs <card.md> <claims.txt> <packet-dir>'); process.exit(1) }
const jobs = loadJobs(dir)
const quotes = loadQuotes(dir, jobs)
const lines = readFileSync(card, 'utf8').split('\n')
let n = 0
for (const { tier, text, ids } of claimRows(claimsFile)) {
  n++
  const line = lines.findIndex(l => l.includes(text.replace(/^table: /, '| ')))
  console.log(`\n[${n}] TIER ${tier}  card line ${line >= 0 ? line + 1 : '?'}: ${line >= 0 ? lines[line].replace(/\^\[[^\]]*\]/, '').trim().slice(0, 260) : text}`)
  const seen = new Set()
  for (const id of ids) for (const r of quotes[id] || []) {
    const key = id + r.quote
    if (seen.has(key)) continue
    seen.add(key)
    console.log(`   - ${id} (${jobs[id.split(':')[0]]}, ${r.where}): "${r.quote.replace(/\s+/g, ' ').slice(0, 330)}"`)
  }
}

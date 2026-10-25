// claim-numbers.mjs: checks that every number in a card line appears in the quotes cited for that line.
// Usage: node scripts/card/claim-numbers.mjs <card.md> <claims.txt> <packet-dir>
// claims.txt rows: "tier | text the line contains | CODE:id,CODE:id" (codes come from <packet-dir>/jobs.json).
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { loadQuotes, claimRows, numbersIn } from './lib.mjs'

export function checkNumbers(cardLines, rows, quotes) {
  const out = { ok: 0, bad: 0, unmatched: 0, noQuote: 0, messages: [] }
  for (const { tier, text, ids } of rows) {
    if (text.startsWith('table:')) continue
    const matches = cardLines.filter(l => l.includes(text))
    if (!matches.length) { out.unmatched++; out.messages.push(`NO LINE  ${text}`); continue }
    const rowsFound = ids.flatMap(id => quotes[id] || (out.messages.push(`NO QUOTE ${id} for "${text}"`), out.noQuote++, []))
    const poolNums = new Set(rowsFound.map(r => r.quote).join(' ').match(/\d+(?:\.\d+)?/g) || [])
    for (const line of matches) {
      const missing = [...new Set(numbersIn(line))].filter(n => !poolNums.has(n))
      if (missing.length) { out.bad++; out.messages.push(`NUMBERS NOT IN QUOTES [${tier}] ${missing.join(', ')}  <- ${text}`) } else out.ok++
    }
  }
  return out
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [card, claimsFile, dir] = process.argv.slice(2)
  if (!dir) { console.error('Usage: node scripts/card/claim-numbers.mjs <card.md> <claims.txt> <packet-dir>'); process.exit(1) }
  const r = checkNumbers(readFileSync(card, 'utf8').split('\n'), claimRows(claimsFile), loadQuotes(dir))
  r.messages.forEach(m => console.log(m))
  console.log(`\nlines checked ok ${r.ok}, with numbers not in the cited quotes ${r.bad}, claim rows with no card line ${r.unmatched}, missing quote ids ${r.noQuote}`)
}

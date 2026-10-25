// quote-stats.mjs: counts distinct claim ids per Haiku job: asked, with at least one quote, and with no quote at all.
// Usage: node scripts/card/quote-stats.mjs <packet-dir>
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
const dir = process.argv[2]
let A = 0, Q = 0, N = 0
for (const f of readdirSync(dir).filter(f => f.startsWith('out-') && f.endsWith('.jsonl')).sort()) {
  const rows = readFileSync(join(dir, f), 'utf8').split('\n').filter(l => l.trim().startsWith('{')).map(l => { try { return JSON.parse(l) } catch { return null } }).filter(Boolean)
  const base = r => String(r.id).replace(/[a-z]$/, '').replace(/-.*$/, '')
  const ids = new Set(rows.map(base))
  const quoted = new Set(rows.filter(r => r.quote).map(base))
  const none = [...ids].filter(i => !quoted.has(i))
  console.log(`${f.slice(4, -6).padEnd(16)} asked ${String(ids.size).padStart(3)}  quoted ${String(quoted.size).padStart(3)}  no quote ${none.length} ${none.length ? '(' + none.join(', ') + ')' : ''}`)
  A += ids.size; Q += quoted.size; N += none.length
}
console.log(`TOTAL asked ${A}  quoted ${Q}  no quote ${N}`)

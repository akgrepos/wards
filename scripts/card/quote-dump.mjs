// quote-dump.mjs: prints verified quotes compactly as "job:id[part] | quote" (only quotes that are exact substrings of the source text).
// Usage: node scripts/card/quote-dump.mjs <packet-dir> [job ...]
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
const [dir, ...only] = process.argv.slice(2)
const norm = s => s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim().toLowerCase()
for (const f of readdirSync(dir).filter(f => f.startsWith('out-') && f.endsWith('.jsonl')).sort()) {
  const job = f.slice(4, -6)
  if (only.length && !only.includes(job)) continue
  const t = existsSync(join(dir, job + '.txt')) ? norm(readFileSync(join(dir, job + '.txt'), 'utf8')) : null
  console.log(`\n### ${job}`)
  for (const l of readFileSync(join(dir, f), 'utf8').split('\n').filter(l => l.trim().startsWith('{'))) {
    let r; try { r = JSON.parse(l) } catch { continue }
    if (!r.quote) { console.log(`${job.slice(0, 6)}:${r.id}${r.part || ''} NOT FOUND`); continue }
    const ok = t && t.includes(norm(r.quote))
    console.log(`${r.id}${r.part || ''}${ok ? '' : ' [NOT VERBATIM, DO NOT USE]'} | ${r.quote.replace(/\s+/g, ' ')}`)
  }
}

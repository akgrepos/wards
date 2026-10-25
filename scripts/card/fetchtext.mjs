// fetchtext.mjs: saves each source in a url list as plain text so a helper can grep it and quote-verify can check quotes.
// Usage: node scripts/card/fetchtext.mjs urls.txt outdir [label ...]   (urls.txt lines: "label<TAB>url"; with labels, only those)
// HTML and DailyMed XML only (PDFs and zips are skipped).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
const [file, outdir, ...only] = process.argv.slice(2)
mkdirSync(outdir, { recursive: true })
const lines = readFileSync(file, 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'))
const ent = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ', '&apos;': "'" }
await Promise.all(lines.map(async line => {
  const [label, url] = line.split('\t')
  if (only.length && !only.includes(label)) return
  try {
    const res = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 (compatible; fetchtext/1.0)' }, signal: AbortSignal.timeout(40000) })
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.subarray(0, 4).toString('latin1').startsWith('%PDF') || buf.subarray(0, 2).toString('latin1') === 'PK') { console.log(label, 'SKIP binary'); return }
    let t = buf.toString('utf8')
    t = t.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<\/(p|div|li|tr|h\d|paragraph|content|title|section|text|caption|item|th|td)>/gi, '\n').replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, ' ').replace(/&#?\w+;/g, m => ent[m] ?? ' ')
      .replace(/[ \t\f\v]+/g, ' ').replace(/ ?\n ?/g, '\n').replace(/\n{2,}/g, '\n')
    writeFileSync(join(outdir, label + '.txt'), `SOURCE: ${label}\nURL: ${url}\n\n` + t)
    console.log(label, res.status, t.length)
  } catch (e) { console.log(label, 'ERR', e.message) }
}))

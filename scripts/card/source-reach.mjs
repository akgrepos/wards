// source-reach.mjs: reports, for each source URL, the HTTP status and whether readable text came back.
// Usage: node scripts/card/source-reach.mjs urls.txt   (one "label<TAB>url" or just "url" per line)
// Readable = status 200 and at least 3000 characters of text after tags are removed
// (PDFs: counted readable only if the response starts with %PDF and is over 20 KB).
import { readFileSync } from 'node:fs'

const file = process.argv[2]
if (!file) { console.error('Usage: node scripts/card/source-reach.mjs urls.txt'); process.exit(1) }
const lines = readFileSync(file, 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'))
const UA = 'Mozilla/5.0 (compatible; reach-check/1.0)'

async function check(line) {
  const [a, b] = line.split('\t')
  const label = b ? a : ''
  const url = b || a
  try {
    const res = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': UA, Accept: 'text/html,application/pdf,*/*' }, signal: AbortSignal.timeout(30000) })
    const buf = Buffer.from(await res.arrayBuffer())
    const head = buf.subarray(0, 5).toString('latin1')
    let chars = 0
    let kind = 'html'
    if (head.startsWith('PK')) { kind = 'zip/docx'; chars = 0 }  // Word/zip file: not plain text, needs conversion (textutil)
    else if (head.startsWith('%PDF')) { kind = 'pdf'; chars = buf.length > 20000 ? buf.length : 0 }  // PDF reachable, but this machine has no PDF-to-text tool
    else {
      const text = buf.toString('utf8').replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
      chars = text.length
      if (/just a moment|enable javascript and cookies|access denied|captcha/i.test(text.slice(0, 600))) chars = 0
    }
    const readable = res.status === 200 && chars >= (kind === 'pdf' ? 1 : 3000)
    return { label, url, status: res.status, kind, chars, readable }
  } catch (e) {
    return { label, url, status: 'ERR ' + (e.cause?.code || e.message), kind: '-', chars: 0, readable: false }
  }
}

const results = await Promise.all(lines.map(check))
for (const r of results) console.log([r.readable ? 'READABLE ' : 'OPUS-ONLY', String(r.status).padEnd(8), r.kind.padEnd(4), String(r.chars).padStart(8), r.label, r.url].join('  '))
console.log(`\nReadable: ${results.filter(r => r.readable).length}  Opus-only: ${results.filter(r => !r.readable).length}`)

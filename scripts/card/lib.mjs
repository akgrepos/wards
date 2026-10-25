// Shared helpers for the card tools. A "packet" is a folder (outside the repo) holding, per source:
//   <job>.txt          the source's plain text
//   out-<job>.jsonl    the quotes a Haiku helper returned, one JSON object per line: {"id","quote","where"}
//   jobs.json          optional {"LI": "<job>", ...}: the short codes that claim rows use ("LI:3a")
// Claim rows (claims.txt) look like:  A | text the card line contains | LI:3a,GI:7
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

export const norm = s => s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim().toLowerCase()

export function readJsonl(file) {
  return readFileSync(file, 'utf8').split('\n').filter(l => l.trim().startsWith('{')).flatMap(l => { try { return [JSON.parse(l)] } catch { return [] } })
}

export function loadJobs(dir) {
  const f = join(dir, 'jobs.json')
  return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : {}
}

// quotes keyed "CODE:id" and "CODE:idpart", each a list of rows
export function loadQuotes(dir, jobs = loadJobs(dir)) {
  const quotes = {}
  for (const [code, job] of Object.entries(jobs)) {
    const f = join(dir, `out-${job}.jsonl`)
    if (!existsSync(f)) continue
    for (const r of readJsonl(f)) {
      if (!r.quote) continue
      ;(quotes[`${code}:${r.id}${r.part || ''}`] ||= []).push(r)
      ;(quotes[`${code}:${r.id}`] ||= []).push(r)
    }
  }
  return quotes
}

export function claimRows(file) {
  return readFileSync(file, 'utf8').split('\n').filter(l => /^[ABC] \|/.test(l)).map(row => {
    const [tier, text, ids] = row.split('|').map(s => s.trim())
    return { tier, text, ids: (ids || '').split(',').map(s => s.trim()).filter(Boolean) }
  })
}

const IGNORED = /HLA-B\*1502|HLA-A\*3101|CYP\w+|CRRT|BMI|ANC|REMS|SILENT/g
export const numbersIn = s => (s.replace(/\^\[[^\]]*\]/g, '').replace(/\{\{[^}]*\}\}/g, ' ').replace(IGNORED, ' ').match(/\d+(?:\.\d+)?/g) || [])

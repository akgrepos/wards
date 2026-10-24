// `npm run docs:check`: cheap checks that the notes (CLAUDE.md, README.md, docs/*.md) have not drifted.
// No network, no AI. Exit 0 = pass (warnings may print), 1 = a problem. Known exceptions: scripts/docs-check.config.mjs.
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ALLOW, DECISIONS_LENGTH_FROM, DECISIONS_MAX_CHARS, CONTENT_FORBIDDEN } from './docs-check.config.mjs'

const FILE_EXT = /\.(md|mjs|ts|tsx|yaml|yml|json|css|html|png|svg)$/
const NEGATION = /\b(no|never|not|delete|deleted|removed|without)\b/i

// Each finding is { rule, file, line, level: 'error' | 'warning', message }.
const find = (rule, file, line, message, level = 'error') => ({ rule, file, line, level, message })

// Every backticked file path or `npm run` name in a notes file must exist.
export function checkReferences({ file, text, files, scripts, exists }) {
  const out = []
  const dir = dirname(file)
  const names = new Set(files.map((f) => basename(f)))
  const tops = new Set(files.map((f) => f.split('/')[0]))
  text.split('\n').forEach((lineText, i) => {
    for (const [, tok] of lineText.matchAll(/`([^`]+)`/g)) {
      const run = tok.match(/^npm run ([\w:-]+)/)
      if (run) {
        if (!scripts.includes(run[1])) out.push(find('broken-reference', file, i + 1, `\`npm run ${run[1]}\` is not a script in package.json.`))
        continue
      }
      if (/\s/.test(tok) || /[*<>{}$()|=,:;]/.test(tok) || /^(~|https?:|#|\.\.\.)/.test(tok)) continue
      // Only file names, and folders that start at a real top-level folder (branch names and units like mg/kg/h are skipped).
      if (!FILE_EXT.test(tok) && !(tok.endsWith('/') && tops.has(tok.split('/')[0]))) continue
      if (!/^[\w.-]+(\/[\w.-]+)*\/?$/.test(tok)) continue
      const path = tok.replace(/\/$/, '')
      if (tok.endsWith('/') && NEGATION.test(lineText)) continue // "no `docs/screenshots/` folders"
      if (exists(path) || exists(join(dir, path)) || exists(join('src', path)) || exists(join('docs', path))) continue
      if (!path.includes('/') && names.has(path)) continue
      out.push(find('broken-reference', file, i + 1, `\`${tok}\` does not exist in the repo.`))
    }
  })
  return out
}

// New DECISIONS rows (dated on or after the cutoff) should stay short.
export function checkDecisionsLength({ file, text, from = DECISIONS_LENGTH_FROM, max = DECISIONS_MAX_CHARS }) {
  const out = []
  text.split('\n').forEach((lineText, i) => {
    const m = lineText.match(/^\|\s*(\d{4}-\d{2}-\d{2})\s*\|/)
    if (m && m[1] >= from && lineText.length > max) {
      out.push(find('decisions-length', file, i + 1, `Row dated ${m[1]} is ${lineText.length} characters (about ${max} is the limit). Move the detail to the PR description.`, 'warning'))
    }
  })
  return out
}

// docs/screenshots/ must not be mentioned as a place to put files (only as "no ..." or "delete ...").
export function checkLeftovers({ file, text }) {
  const out = []
  text.split('\n').forEach((lineText, i) => {
    if (lineText.includes('docs/screenshots') && !NEGATION.test(lineText)) {
      out.push(find('leftover', file, i + 1, 'Mentions `docs/screenshots/` as a place for files. Screenshots go in the PR description, not the repo.'))
    }
  })
  return out
}

// No email addresses or real home paths in notes or card content.
export function checkPrivacy({ file, text }) {
  const out = []
  text.split('\n').forEach((lineText, i) => {
    if (/@gmail\.com/i.test(lineText)) out.push(find('privacy', file, i + 1, 'Contains an @gmail.com address. Say "the owner" instead.'))
    for (const [, name] of lineText.matchAll(/\/Users\/([A-Za-z0-9._-]+)/g)) {
      if (!['x', 'me', 'name', 'user', 'you', 'username'].includes(name)) out.push(find('privacy', file, i + 1, `Contains a home path with a real user name ("/Users/${name}"). Use "~/" instead.`))
    }
  })
  return out
}

// Source names must not appear in card content (the hidden-source records are exempt, caller skips them).
export function checkForbiddenWords({ file, text, words = CONTENT_FORBIDDEN }) {
  const out = []
  text.split('\n').forEach((lineText, i) => {
    for (const w of words) {
      if (lineText.toLowerCase().includes(w.toLowerCase())) out.push(find('forbidden-word', file, i + 1, `Card content mentions "${w}". Reference sources are never named in the app.`))
    }
  })
  return out
}

// Split findings into reported ones and allowed ones; unused allowlist entries are returned too.
export function applyAllowlist(findings, allow) {
  const used = new Set()
  const kept = findings.filter((f) => {
    const idx = allow.findIndex((a) => a.rule === f.rule && a.file === f.file && f.message.includes(a.text))
    if (idx >= 0) { used.add(idx); return false }
    return true
  })
  return { kept, unused: allow.filter((_, i) => !used.has(i)) }
}

export function runChecks(root, allow = ALLOW) {
  const files = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean)
  const read = (f) => readFileSync(join(root, f), 'utf8')
  const exists = (p) => existsSync(join(root, p))
  const scripts = Object.keys(JSON.parse(read('package.json')).scripts)
  const notes = files.filter((f) => f === 'CLAUDE.md' || f === 'README.md' || /^docs\/[^/]+\.md$/.test(f))
  const content = files.filter((f) => f.startsWith('content/') && !f.startsWith('content/data/source/') && /\.(ya?ml|md)$/.test(f))
  let findings = []
  for (const file of notes) {
    const text = read(file)
    findings.push(...checkReferences({ file, text, files, scripts, exists }), ...checkLeftovers({ file, text }), ...checkPrivacy({ file, text }))
    if (file === 'docs/DECISIONS.md') findings.push(...checkDecisionsLength({ file, text }))
  }
  for (const file of [...content, 'CHANGELOG.md']) {
    const text = read(file)
    findings.push(...checkPrivacy({ file, text }))
    if (file !== 'CHANGELOG.md') findings.push(...checkForbiddenWords({ file, text }))
  }
  return applyAllowlist(findings, allow)
}

function main() {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const { kept, unused } = runChecks(root)
  const errors = kept.filter((f) => f.level === 'error')
  for (const f of kept) console.log(`${f.level === 'error' ? 'PROBLEM' : 'warning'} [${f.rule}] ${f.file}:${f.line}: ${f.message}`)
  for (const a of unused) console.log(`warning [allowlist] scripts/docs-check.config.mjs: the exception for "${a.text}" in ${a.file} matches nothing now; remove it.`)
  console.log(errors.length ? `\ndocs:check found ${errors.length} problem(s).` : `docs:check passed${kept.length ? ` (${kept.length} warning(s))` : ''}.`)
  process.exit(errors.length ? 1 : 0)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main()

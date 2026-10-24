// Fails if a tracked text file contains something that must never be in the public repo:
// real email addresses, home-folder paths, computer-name hostnames, or the names of outside reference sources.
// Run with `npm run privacy:check`. Node only, no dependencies.
//
// Optional local extra: if ~/Documents/Wards-reference/privacy-terms.txt exists (one term per line),
// those terms are scanned for too. That file is never in the repo, so CI simply skips it.
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const BANNED_WORDS = ['AMBOSS', 'OpenEvidence', 'White Book']

// Files that may name the banned words, by exact path. Keep this as short as possible.
export const WORD_ALLOWLIST = new Set(['CLAUDE.md'])

// Never scanned: generated lockfile, and this check itself (it has to contain the patterns).
const SKIP_FILES = new Set(['package-lock.json', 'scripts/privacy-check.mjs', 'scripts/privacy-check.test.mjs'])

// Example names that are obviously placeholders, not a real person.
const PLACEHOLDER_NAMES = new Set(['x', 'me', 'name', 'user', 'you', 'username'])

const EMAIL = /[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,})/g
const HOME_UNIX = /\/Users\/([A-Za-z0-9._-]+)/g
const HOME_WIN = /[A-Za-z]:[\\/]+Users[\\/]+([A-Za-z0-9._-]+)/g
const LOCAL_HOST = /\b([A-Za-z0-9-]+)\.local(?![\w.-])/g

export function scanText({ file, text, extraTerms = [] }) {
  const out = []
  const add = (line, message) => out.push(`${file}:${line}: ${message}`)
  const words = [...(WORD_ALLOWLIST.has(file) ? [] : BANNED_WORDS)]
  text.split('\n').forEach((lineText, i) => {
    const line = i + 1
    for (const m of lineText.matchAll(EMAIL)) {
      if (!['users.noreply.github.com', 'github.com'].includes(m[1].toLowerCase()) || (m[1].toLowerCase() === 'github.com' && m[0] !== 'noreply@github.com')) add(line, 'email address (only @users.noreply.github.com is allowed). Say "the owner" instead.')
    }
    for (const m of [...lineText.matchAll(HOME_UNIX), ...lineText.matchAll(HOME_WIN)]) {
      if (!PLACEHOLDER_NAMES.has(m[1].toLowerCase())) add(line, 'home-folder path. Use "~/" instead.')
    }
    if (/[A-Za-z]:[\\/]+Users[\\/]*$/.test(lineText.trim())) add(line, 'home-folder path (C:\\Users\\). Use "~/" instead.')
    for (const m of lineText.matchAll(LOCAL_HOST)) add(line, `computer-name style host "${m[0]}"`)
    const lower = lineText.toLowerCase()
    for (const w of words) if (lower.includes(w.toLowerCase())) add(line, `names "${w}", which must never appear in the repo`)
    for (const t of extraTerms) if (lower.includes(t.toLowerCase())) add(line, 'contains a term from the private terms file')
  })
  return out
}

export function readExtraTerms(path = join(homedir(), 'Documents', 'Wards-reference', 'privacy-terms.txt')) {
  if (!existsSync(path)) return []
  return readFileSync(path, 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))
}

function main() {
  const root = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim()
  const files = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).split('\0').filter(Boolean)
  const extraTerms = readExtraTerms()
  const findings = []
  for (const file of files) {
    if (SKIP_FILES.has(file) || !existsSync(join(root, file))) continue
    const buf = readFileSync(join(root, file))
    if (buf.includes(0)) continue // binary
    findings.push(...scanText({ file, text: buf.toString('utf8'), extraTerms }))
  }
  if (findings.length) {
    console.error(findings.join('\n'))
    console.error(`\nprivacy:check failed: ${findings.length} problem(s). Fix the wording (say "the owner", use "~/").`)
    process.exit(1)
  }
  console.log(`privacy:check ok (${files.length} tracked files${extraTerms.length ? `, ${extraTerms.length} private terms` : ''})`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main()

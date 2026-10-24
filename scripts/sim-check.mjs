// npm run sim-check [-- --expect "text"] [--route "#/card/<id>"] [--shots [name]]
// One-call check of the booted iOS Simulator (macOS only). It reads the screen with a screenshot and Apple's text
// recognition (scripts/lib/ocr.swift); `xcrun simctl` cannot tap, so taps stay manual and this reports what to do.
//  1. Version: finds the version number on screen (Home > Settings > Version) and compares it with src/version.ts on
//     origin/main. If the "Update Ready" banner is showing, it says so (tap Reload with the control tool, run again).
//  2. --expect "text": confirms that text is on screen (e.g. a card's title after you open it).
//     --route "#/card/<id>": first opens that route with `simctl openurl`. That opens Safari, NOT the pinned
//     Home Screen app, so the result is labelled that way; to test the pinned app, tap to the card and use --expect.
//  3. --shots [name]: scaled-down (0.4) light and dark screenshots into a scratch folder outside the repo
//     (<tmp>/wards-sim-shots), then restores the appearance. Never committed.
// Exit 0 = ok, 1 = mismatch (wrong version, update waiting, expected text missing), 2 = a manual step is needed
// (no Simulator booted, version not on screen).
import { mkdirSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { git, run, versionFromSource, SITE } from './lib/workflow.mjs'

const args = process.argv.slice(2)
const opt = (name) => {
  const i = args.indexOf(name)
  return i >= 0 ? args[i + 1] : null
}
const route = opt('--route')
const expect = opt('--expect')
const si = args.indexOf('--shots')
const shots = si >= 0 ? (args[si + 1] && !args[si + 1].startsWith('--') ? args[si + 1] : 'screen') : null

const here = dirname(fileURLToPath(import.meta.url))
const scratch = mkdtempSync(join(tmpdir(), 'wards-sim-'))
const lines = []
let code = 0
const say = (s) => lines.push(s)
const bump = (c) => { code = Math.max(code, c) } // 1 (mismatch) outranks nothing; 2 (manual) outranks 1

const sim = (a) => run('xcrun', ['simctl', ...a])
if (!/\(Booted\)/.test(sim(['list', 'devices', 'booted']) ?? '')) {
  console.log('MANUAL: no Simulator is booted. Boot the iPhone Simulator, open the pinned Wards app, run again.')
  process.exit(2)
}

function screenText(label) {
  const png = join(scratch, `${label}.png`)
  if (sim(['io', 'booted', 'screenshot', '--type=png', png]) === null) return ''
  return run('swift', [join(here, 'lib', 'ocr.swift'), png]) ?? ''
}

if (route) {
  sim(['openurl', 'booted', SITE + route.replace(/^\/?/, '')])
  await new Promise((r) => setTimeout(r, 4000))
  say(`opened ${route} with openurl (Safari, not the pinned app)`)
}

const text = screenText('check')
const plain = text.split('\n').map((l) => l.replace(/^\S+ \S+ /, '')).join('\n')

// 1. Version
git(['fetch', 'origin', 'main', '--quiet'])
const want = versionFromSource(git(['show', 'origin/main:src/version.ts']) ?? '')
if (/Update Ready/i.test(plain)) {
  const l = text.split('\n').find((x) => /Reload/.test(x))
  say(`UPDATE WAITING: the "Update Ready" banner is showing${l ? ` (Reload at ${l.split(' ').slice(0, 2).join(', ')} of the screen, x then y)` : ''}. Tap Reload (do not reinstall), wait, run again.`)
  bump(1)
} else {
  const shown = (plain.match(/\b\d{4}\.\d{2}\.\d{2}(?:\.\d+)?\b/) ?? [null])[0]
  if (!shown) {
    say(`MANUAL: no version on screen. Open Home > Settings (shows the version), run again. Expected ${want}.`)
    bump(2)
  } else if (shown === want) say(`version OK: app shows ${shown}, origin/main is ${want}`)
  else {
    say(`VERSION MISMATCH: app shows ${shown}, origin/main is ${want}. Wait for the deploy (npm run wait-live), reopen, tap Reload if offered.`)
    bump(1)
  }
}

// 2. Expected text
if (expect) {
  if (plain.toLowerCase().includes(expect.toLowerCase())) say(`text found: "${expect}"`)
  else {
    say(`TEXT MISSING: "${expect}" is not on screen`)
    bump(1)
  }
}

// 3. Screenshots
if (shots) {
  const out = join(tmpdir(), 'wards-sim-shots')
  mkdirSync(out, { recursive: true })
  const before = (sim(['ui', 'booted', 'appearance']) ?? 'light').trim()
  for (const mode of ['light', 'dark']) {
    sim(['ui', 'booted', 'appearance', mode])
    await new Promise((r) => setTimeout(r, 2000))
    const f = join(out, `${mode}-${shots}.png`)
    sim(['io', 'booted', 'screenshot', '--type=png', f])
    const w = Number((run('sips', ['-g', 'pixelWidth', f]) ?? '').match(/pixelWidth: (\d+)/)?.[1])
    if (w) run('sips', ['--resampleWidth', String(Math.round(w * 0.4)), f])
    say(`saved ${f}`)
  }
  sim(['ui', 'booted', 'appearance', before === 'dark' ? 'dark' : 'light'])
}

console.log(lines.join('\n'))
console.log(code === 0 ? 'RESULT: ok' : code === 1 ? 'RESULT: mismatch' : 'RESULT: manual step needed')
process.exit(code)

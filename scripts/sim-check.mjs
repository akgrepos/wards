// npm run sim-check [-- --expect "text"] [--route "#/card/<id>"] [--shots [name]]
// One-call check of the booted iOS Simulator (macOS only). It reads the screen with a screenshot and Apple's text
// recognition (scripts/lib/ocr.swift); `xcrun simctl` cannot tap, so taps stay manual and this reports what to do.
//  1. Version: finds the version number on screen and compares it with src/version.ts on origin/main. If none is on
//     screen it opens the Settings route itself (simctl openurl), reads the version there, and (with --route) goes back
//     to that route afterwards, so one call checks both. If the "Update Ready" banner is showing, it says so.
//  2. --expect "text": confirms that text is on screen (e.g. a card's title after you open it); checked on the screen
//     you left open, or on the --route screen.
//     --route "#/card/<id>": first opens that route with `simctl openurl`. That opens Safari in the Simulator, NOT an installed app
//     app, so the result is labelled that way; to test further, tap to the card in Safari and use --expect.
//  3. --shots [name]: scaled-down (0.4) light and dark screenshots into a scratch folder outside the repo
//     (<tmp>/wards-sim-shots), then restores the appearance. Never committed.
// Exit 0 = ok, 1 = mismatch (wrong version, update waiting, expected text missing), 2 = a manual step is needed
// (no Simulator booted, or Settings shows no version).
import { mkdirSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { git, run, versionFromSource, versionStep, SITE } from './lib/workflow.mjs'

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
  console.log('MANUAL: no Simulator is booted. Boot the iPhone Simulator, open Wards in Safari, run again.')
  process.exit(2)
}

function screenText(label) {
  const png = join(scratch, `${label}.png`)
  if (sim(['io', 'booted', 'screenshot', '--type=png', png]) === null) return ''
  return run('swift', [join(here, 'lib', 'ocr.swift'), png]) ?? ''
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
async function open(r) {
  sim(['openurl', 'booted', SITE + r.replace(/^\/?/, '')])
  await wait(4000)
}

if (route) {
  await open(route)
  say(`opened ${route} with openurl (Safari in the Simulator)`)
}

let text = screenText('check')
let plain = text.split('\n').map((l) => l.replace(/^\S+ \S+ /, '')).join('\n')

// 2a. Expected text, checked on the screen as first found (before any visit to Settings)
const checkExpect = () => {
  if (plain.toLowerCase().includes(expect.toLowerCase())) say(`text found: "${expect}"`)
  else {
    say(`TEXT MISSING: "${expect}" is not on screen`)
    bump(1)
  }
}
if (expect && !route) checkExpect()

// 1. Version (opens Settings itself when the screen shows none)
git(['fetch', 'origin', 'main', '--quiet'])
const want = versionFromSource(git(['show', 'origin/main:src/version.ts']) ?? '')
let v = versionStep(plain, want)
let visitedSettings = false
if (v.step === 'open-settings') {
  await open('#/settings')
  await wait(2000)
  visitedSettings = true
  text = screenText('settings')
  plain = text.split('\n').map((l) => l.replace(/^\S+ \S+ /, '')).join('\n')
  v = versionStep(plain, want)
  if (v.step === 'open-settings') say(`MANUAL: no version on the Settings screen either. Open Settings by hand, check it, run again. Expected ${want}.`)
  else say('opened Settings to read the version')
}
if (v.step === 'update') {
  const l = text.split('\n').find((x) => /Reload/.test(x))
  say(`UPDATE WAITING: the "Update Ready" banner is showing${l ? ` (Reload at ${l.split(' ').slice(0, 2).join(', ')} of the screen, x then y)` : ''}. Tap Reload (do not reinstall), wait, run again.`)
  bump(1)
} else if (v.step === 'open-settings') bump(2)
else if (v.step === 'ok') say(`version OK: app shows ${v.shown}, origin/main is ${want}`)
else {
  say(`VERSION MISMATCH: app shows ${v.shown}, origin/main is ${want}. Wait for the deploy (npm run wait-live), reopen, tap Reload if offered.`)
  bump(1)
}

// 2b. With --route, go back to that route and check the expected text there
if (expect && route) {
  if (visitedSettings) {
    await open(route)
    text = screenText('check2')
    plain = text.split('\n').map((l) => l.replace(/^\S+ \S+ /, '')).join('\n')
  }
  checkExpect()
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

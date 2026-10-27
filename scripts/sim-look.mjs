// npm run sim-look -- <route> [<route> ...] [--dark] [--no-build] [--hold <seconds>]
// Look at a changed page in Mobile Safari inside the iOS Simulator: the last step before pushing a design change.
// It builds the release (skip with --no-build), serves it on a fresh port, reuses the booted iPhone simulator (boots one if none),
// opens each route in Safari and saves one screenshot per route (and per dark/light with --dark).
// A route is the part after the address, e.g. '#/card/neuro-delirium/treatment'. Pictures go OUTSIDE the repo; the paths are
// printed so the model can open them. --hold keeps the server up that many seconds after the last picture, so the model can swipe down and screenshot with the simulator tool (the script then ends by itself). The server is always shut down when the script ends. Exit 0 = pictures saved.
import { spawn, execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const flags = args.filter((a) => a.startsWith('--'))
const hold = flags.includes('--hold') ? Number(args[args.indexOf('--hold') + 1]) : 0
const routes = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--hold')
if (!routes.length) {
  console.error("Name at least one route, e.g. npm run sim-look -- '#/card/neuro-delirium/treatment'")
  process.exit(1)
}
const PORT = 4300 + Math.floor(Math.random() * 500) // a new address each run, so Safari never shows an old saved copy
const BASE = `http://localhost:${PORT}/wards/`
const out = join(tmpdir(), 'wards-sim-look')
mkdirSync(out, { recursive: true })

const sim = (...a) => execFileSync('xcrun', ['simctl', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

function device() {
  const booted = JSON.parse(sim('list', 'devices', 'booted', '-j')).devices
  const up = Object.values(booted).flat().find((d) => d.state === 'Booted' && /iPhone/.test(d.name))
  if (up) return up.udid
  const all = JSON.parse(sim('list', 'devices', 'available', '-j')).devices
  const phone = Object.entries(all).filter(([k]) => /iOS/.test(k)).flatMap(([, v]) => v).filter((d) => /iPhone/.test(d.name)).pop()
  if (!phone) throw new Error('No iPhone simulator is installed (Xcode > Settings > Components).')
  sim('boot', phone.udid)
  sim('bootstatus', phone.udid, '-b')
  return phone.udid
}

async function serve() {
  const p = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { cwd: root, stdio: 'ignore' })
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(BASE)).ok) return p
    } catch {}
    await wait(500)
  }
  p.kill()
  throw new Error(`The preview server did not start on port ${PORT}.`)
}

let server
let udid
let appearance
try {
  if (!flags.includes('--no-build')) {
    console.log('Building the release…')
    execFileSync('npx', ['vite', 'build'], { cwd: root, stdio: 'ignore', env: { ...process.env, VITE_PREVIEW: '' } })
  }
  server = await serve()
  udid = device()
  try { appearance = sim('ui', udid, 'appearance') } catch {}
  const modes = flags.includes('--dark') ? ['light', 'dark'] : ['light']
  for (const mode of modes) {
    sim('ui', udid, 'appearance', mode)
    for (const r of routes) {
      try { sim('terminate', udid, 'com.apple.mobilesafari') } catch {}
      sim('openurl', udid, BASE + r)
      await wait(5000)
      const name = r.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'home'
      const file = join(out, `${name}-${mode}.png`)
      sim('io', udid, 'screenshot', file)
      console.log(file)
    }
  }
  if (hold) { console.log(`Server stays up ${hold}s on ${BASE}`); await wait(hold * 1000) }
} finally {
  if (udid && appearance) try { sim('ui', udid, 'appearance', appearance) } catch {}
  if (udid) try { sim('terminate', udid, 'com.apple.mobilesafari') } catch {}
  server?.kill()
}

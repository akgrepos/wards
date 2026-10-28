// npm run page-shots -- <route> [<route> ...] [--dark] [--no-build]
// Pictures of a WHOLE page, top to bottom: the first and last look of a design change.
// Builds the release (skip with --no-build), serves it on its own port, opens real WebKit (the Safari engine) at iPhone
// width (393 points, 2x) and saves each page in slices about 1300 points tall, light (and dark with --dark).
// A route is the part after the address, e.g. '#/card/neuro-delirium/treatment' (a card needs its section).
// Pictures go OUTSIDE the repo; the paths are printed so the model can open each one. The server always stops at the end.
import { spawn, execFileSync } from 'node:child_process'
import { mkdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { webkit } from 'playwright'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const routes = args.filter((a) => !a.startsWith('--'))
if (!routes.length) {
  console.error("Name at least one route, e.g. npm run page-shots -- '#/card/neuro-delirium/treatment' --dark")
  process.exit(1)
}
const PORT = 4800 + Math.floor(Math.random() * 100)
const BASE = `http://localhost:${PORT}/wards/`
const SLICE = 1300
const out = join(tmpdir(), 'wards-page-shots')
rmSync(out, { recursive: true, force: true }) // only this run's pictures
mkdirSync(out, { recursive: true })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

if (!args.includes('--no-build')) {
  console.log('Building the release…')
  execFileSync('npx', ['vite', 'build'], { cwd: root, stdio: 'ignore', env: { ...process.env, VITE_PREVIEW: '' } })
}
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { cwd: root, stdio: 'ignore' })
let browser
try {
  let up = false
  for (let i = 0; i < 60 && !up; i++) {
    try { up = (await fetch(BASE)).ok } catch { await wait(500) }
  }
  if (!up) throw new Error(`The preview server did not start on port ${PORT}.`)
  browser = await webkit.launch()
  for (const scheme of args.includes('--dark') ? ['light', 'dark'] : ['light']) {
    const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, colorScheme: scheme, serviceWorkers: 'block' })
    const page = await ctx.newPage()
    for (const r of routes) {
      await page.goto(BASE + r, { waitUntil: 'networkidle' })
      await page.waitForTimeout(1000)
      const h = await page.evaluate(() => document.documentElement.scrollHeight)
      const name = r.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'home'
      let n = 0
      for (let y = 0; y < h; y += SLICE) {
        const file = join(out, `${name}-${scheme}-${String(++n).padStart(2, '0')}.png`)
        await page.screenshot({ path: file, fullPage: true, clip: { x: 0, y, width: 393, height: Math.min(SLICE, h - y) } })
        console.log(file)
      }
    }
    await ctx.close()
  }
} finally {
  if (browser) await browser.close()
  server.kill()
}

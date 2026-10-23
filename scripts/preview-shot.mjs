import { createRequire } from 'node:module'
// Phone-size WebKit preview (Playwright). Not the pinned-app test; never replaces the Simulator on the Mac.
// Usage: npm run preview:shot -- <outdir> <route...> [--headless]     e.g. npm run preview:shot -- shots / /cards/some-card
// Needs a build first (npm run build). Saves light-<name>.png and dark-<name>.png per route.
// By default the iPhone-size browser window is VISIBLE and moves slowly so the owner can watch; it stays open until the run
// ends. Pass --headless for background runs and CI (no window, no pauses).
import { webkit, devices } from 'playwright'
import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const argv = process.argv.slice(2)
const headless = argv.includes('--headless') || !!process.env.CI
const [out, ...routes] = argv.filter((a) => a !== '--headless')
if (!out || routes.length === 0) {
  console.error('Usage: npm run preview:shot -- <outdir> <route...> [--headless]')
  process.exit(1)
}
mkdirSync(out, { recursive: true })

const port = 4173
const server = spawn(process.execPath, [createRequire(import.meta.url).resolve('vite/package.json').replace('package.json', 'bin/vite.js'), 'preview', '--port', String(port), '--strictPort'], { stdio: 'ignore' })
const base = `http://localhost:${port}/wards`
for (let i = 0; i < 50; i++) {
  try { if ((await fetch(base + '/')).ok) break } catch {}
  await new Promise((r) => setTimeout(r, 200))
}

const browser = await webkit.launch({ headless, slowMo: headless ? 0 : 400 })
const pause = (ms) => (headless ? Promise.resolve() : new Promise((r) => setTimeout(r, ms)))
try {
  for (const colorScheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ ...devices['iPhone 15'], colorScheme })
    for (const route of routes) {
      const page = await ctx.newPage()
      await page.goto(base + (route.startsWith('/') ? route : '/' + route), { waitUntil: 'networkidle' })
      const name = route.replace(/^\/+|\/+$/g, '').replace(/[^\w-]+/g, '-') || 'home'
      const file = join(out, `${colorScheme}-${name}.png`)
      await pause(1500)
      await page.screenshot({ path: file })
      console.log('saved', file)
      await page.close()
    }
    await ctx.close()
  }
} finally {
  await browser.close()
  server.kill()
}

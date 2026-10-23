// Phone-size WebKit preview (Playwright). Not the pinned-app test; never replaces the Simulator on the Mac.
// Usage: npm run preview:shot -- <outdir> <route...>     e.g. npm run preview:shot -- shots / /cards/some-card
// Needs a build first (npm run build). Saves light-<name>.png and dark-<name>.png per route.
import { webkit, devices } from 'playwright'
import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const [out, ...routes] = process.argv.slice(2)
if (!out || routes.length === 0) {
  console.error('Usage: npm run preview:shot -- <outdir> <route...>')
  process.exit(1)
}
mkdirSync(out, { recursive: true })

const port = 4173
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', String(port), '--strictPort'], { stdio: 'ignore' })
const base = `http://localhost:${port}/wards`
for (let i = 0; i < 50; i++) {
  try { if ((await fetch(base + '/')).ok) break } catch {}
  await new Promise((r) => setTimeout(r, 200))
}

const browser = await webkit.launch()
try {
  for (const colorScheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ ...devices['iPhone 15'], colorScheme })
    for (const route of routes) {
      const page = await ctx.newPage()
      await page.goto(base + (route.startsWith('/') ? route : '/' + route), { waitUntil: 'networkidle' })
      const name = route.replace(/^\/+|\/+$/g, '').replace(/[^\w-]+/g, '-') || 'home'
      const file = join(out, `${colorScheme}-${name}.png`)
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

// npm run look [-- --no-build] [--no-sheet] [--only name,name]
// Builds the release, serves it, opens real WebKit at iPhone size and visits the pages listed in
// scripts/look.config.mjs in light and dark. It then (1) runs style checks that fail the run, and (2) saves a contact
// sheet (one picture of every page) OUTSIDE the repo and prints where.
// Checks: no browser-default links, tap targets of at least 44 points, text colors and fonts only from the design tokens,
// no leftover prototype code in the built files. --no-sheet runs only the checks (used in CI, where
// Linux has no Apple fonts, so pictures would look different).
// Exit 0 = pass, 1 = a check failed (the message names the page and the element).
import { spawn, execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { webkit } from 'playwright'
import { ROUTES, DEVICE, MIN_TAP, ALLOW, FORBIDDEN_IN_BUILD } from './look.config.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const flag = (n) => args.includes(n)
const only = args.includes('--only') ? args[args.indexOf('--only') + 1].split(',') : null
const PORT = 4199
const BASE = `http://localhost:${PORT}/wards/`

// ---- design tokens: every color and font the design system defines ----
const tokens = readFileSync(join(root, 'src/design/tokens.css'), 'utf8')
function parseColor(s) {
  s = s.trim().toLowerCase()
  let m = s.match(/^#([0-9a-f]{3,8})$/)
  if (m) {
    let h = m[1]
    if (h.length <= 4) h = [...h].map((c) => c + c).join('')
    const n = (i) => parseInt(h.slice(i, i + 2), 16)
    return [n(0), n(2), n(4), h.length === 8 ? +(n(6) / 255).toFixed(3) : 1]
  }
  m = s.match(/^rgba?\(([^)]+)\)$/)
  if (m) {
    const p = m[1].split(/[ ,/]+/).filter(Boolean).map((x) => (x.endsWith('%') ? parseFloat(x) / 100 : parseFloat(x)))
    return [p[0], p[1], p[2], p[3] ?? 1]
  }
  return null
}
const tokenColors = []
for (const m of tokens.matchAll(/--[\w-]+:\s*([^;]+);/g)) {
  const c = parseColor(m[1])
  if (c) tokenColors.push(c)
}
for (const c of ['#000000', '#ffffff', 'rgba(0,0,0,0)']) tokenColors.push(parseColor(c))
const allowColors = ALLOW.colors.map(parseColor).filter(Boolean)
const tokenFonts = [...tokens.matchAll(/--font-[\w-]+:\s*([^;]+);/g)].map((m) => m[1].trim())
const sameColor = (a, b) => Math.abs(a[0] - b[0]) <= 2 && Math.abs(a[1] - b[1]) <= 2 && Math.abs(a[2] - b[2]) <= 2 && Math.abs(a[3] - b[3]) <= 0.03
const colorOk = (c) => [...tokenColors, ...allowColors].some((t) => sameColor(c, t))
const norm = (x) => x.replace(/[\s"']+/g, '')
const fontOk = (f) => ALLOW.fonts.includes(f) || tokenFonts.some((t) => norm(t) === norm(f))

// ---- build and serve ----
function build() {
  console.log('Building the release…')
  execFileSync('npx', ['vite', 'build'], { cwd: root, stdio: 'ignore', env: { ...process.env, VITE_PREVIEW: '' } })
}
function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? walk(p) : [p]
  })
}
const problems = []
const known = new Set()
const fail = (page, msg) => problems.push(`${page}: ${msg}`)

function checkBuildOutput() {
  for (const f of walk(join(root, 'dist'))) {
    if (!/\.(js|css|html|json|webmanifest)$/.test(f)) continue
    const text = readFileSync(f, 'utf8')
    for (const bad of FORBIDDEN_IN_BUILD) if (text.includes(bad)) fail('built files', `"${bad}" found in ${f.slice(root.length + 1)} (a prototype or preview leftover)`)
  }
}

async function startServer() {
  const p = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { cwd: root, stdio: 'ignore' })
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(BASE)).ok) return p
    } catch {}
    await new Promise((r) => setTimeout(r, 500))
  }
  p.kill()
  throw new Error(`The preview server did not start on port ${PORT} (is something else using it?)`)
}

// ---- the checks, run inside the page ----
function inPage({ MIN_TAP, allowSmall, knownSmall }) {
  const out = []
  const describe = (el) => {
    const t = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40)
    const cls = typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''
    return `<${el.tagName.toLowerCase()}${cls}> "${t}"`
  }
  const visible = (el) => {
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) return false
    const s = getComputedStyle(el)
    return s.visibility !== 'hidden' && s.display !== 'none' && s.opacity !== '0'
  }
  const hasOwnText = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
  // Links
  for (const a of document.querySelectorAll('a')) {
    if (!visible(a)) continue
    const s = getComputedStyle(a)
    const inText = a.parentElement && hasOwnText(a.parentElement)
    if (s.color === 'rgb(0, 0, 238)' || s.color === 'rgb(85, 26, 139)') out.push(['link', `${describe(a)} shows the browser's default link color`])
    if (!inText && s.textDecorationLine.includes('underline') && s.textDecorationStyle === 'solid') out.push(['link', `${describe(a)} has a solid underline outside running text`])
    else if (inText && s.textDecorationLine.includes('underline') && s.textDecorationStyle === 'solid' && s.color === 'rgb(0, 0, 238)') out.push(['link', `${describe(a)} is a default underlined link in text`])
  }
  // Tap targets: skip inline links inside a sentence (the line is the target) and anything inside another tappable
  const tappable = 'a[href], button, [role=button], [role=tab], [role=link], input:not([type=hidden]), select, textarea, summary, [tabindex]:not([tabindex="-1"])'
  for (const el of document.querySelectorAll(tappable)) {
    if (!visible(el)) continue
    if (allowSmall.some((sel) => el.matches(sel))) continue
    if (el.parentElement?.closest(tappable)) continue
    const s = getComputedStyle(el)
    const inText = el.parentElement && hasOwnText(el.parentElement) && s.display.startsWith('inline')
    if (inText) continue
    const r = el.getBoundingClientRect()
    if (r.width < MIN_TAP - 0.5 || r.height < MIN_TAP - 0.5) out.push([knownSmall.some((sel) => el.matches(sel)) ? 'known' : 'tap', `${describe(el)} is ${Math.round(r.width)}x${Math.round(r.height)} points (needs ${MIN_TAP}x${MIN_TAP})`])
  }
  // Text colors and fonts
  const seen = new Set()
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const n = walker.currentNode
    if (!n.textContent.trim()) continue
    const el = n.parentElement
    if (!el || seen.has(el) || !visible(el) || el.closest('svg')) continue
    seen.add(el)
    const s = getComputedStyle(el)
    out.push(['style', { color: s.color, font: s.fontFamily, desc: describe(el) }])
  }
  return out
}

// ---- main ----
const routes = ROUTES.filter((r) => !only || only.includes(r.name))
if (!flag('--no-build')) build()
checkBuildOutput()
const server = await startServer()
const shots = []
const seenStyle = new Set()
try {
  const browser = await webkit.launch()
  for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({
      viewport: { width: DEVICE.width, height: DEVICE.height },
      deviceScaleFactor: DEVICE.scale,
      isMobile: true,
      hasTouch: true,
      colorScheme: scheme,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
      serviceWorkers: 'block',
    })
    const page = await ctx.newPage()
    page.on('pageerror', (e) => fail('app', `script error: ${e.message}`))
    for (const r of routes) {
      const label = `${r.name} (${scheme})`
      await page.goto(BASE + r.hash, { waitUntil: 'networkidle' })
      if (r.storage) { // saved lists to show: set them, then reload
        // (also forget a search typed on an earlier route, which the page keeps in its history entry)
        await page.evaluate((o) => { history.replaceState(null, ''); for (const [k, v] of Object.entries(o)) localStorage.setItem(k, JSON.stringify(v)) }, r.storage)
        await page.reload({ waitUntil: 'networkidle' })
      }
      try {
        for (const step of r.steps ?? []) await page.getByRole('button', { name: step.click }).first().click({ timeout: 5000 })
      } catch (e) {
        fail(label, `could not do step ${JSON.stringify(r.steps)}: ${e.message.split('\n')[0]}`)
      }
      await page.waitForTimeout(400)
      const body = (await page.innerText('body')).trim()
      if (body.length < 20 || /not found/i.test(body.slice(0, 200))) fail(label, 'the page looks empty or says not found (check the route in scripts/look.config.mjs)')
      const found = await page.evaluate(inPage, { MIN_TAP, allowSmall: ALLOW.smallTap, knownSmall: ALLOW.knownSmallTap })
      for (const [kind, v] of found) {
        if (kind === 'link') fail(label, v)
        else if (kind === 'tap') fail(label, v)
        else if (kind === 'known') known.add(v)
        else {
          const c = parseColor(v.color)
          const key = `${scheme}|${v.color}|${v.font}`
          if (seenStyle.has(key + '|' + r.name)) continue
          seenStyle.add(key + '|' + r.name)
          if (c && !colorOk(c)) fail(label, `text color ${v.color} on ${v.desc} is not a design token`)
          if (!fontOk(v.font)) fail(label, `font ${v.font} on ${v.desc} is not a design token font`)
        }
      }
      await page.evaluate(() => localStorage.clear()) // Timed Mode and Recent must not leak into the next page
      if (!flag('--no-sheet')) shots.push({ name: r.name, scheme, png: await page.screenshot({ scale: 'css' }) })
    }
    await ctx.close()
  }

  if (!flag('--no-sheet')) {
    const branch = execFileSync('git', ['branch', '--show-current'], { cwd: root, encoding: 'utf8' }).trim().replace(/[^\w.-]+/g, '-') || 'detached'
    const dir = join(homedir(), 'Documents', 'Wards-reference', 'look')
    mkdirSync(dir, { recursive: true })
    const out = join(dir, `${new Date().toISOString().slice(0, 10)}-${branch}.png`)
    const cell = (s) => `<figure><img src="data:image/png;base64,${s.png.toString('base64')}"><figcaption>${s.name}</figcaption></figure>`
    const row = (scheme) => `<h2>${scheme}</h2><div class="row">${shots.filter((s) => s.scheme === scheme).map(cell).join('')}</div>`
    const cols = 6
    const w = cols * (DEVICE.width * 0.5 + 12) + 16
    const html = `<style>body{margin:8px;font:14px -apple-system,sans-serif;background:#ddd;width:${w}px}h2{margin:8px 0}.row{display:flex;flex-wrap:wrap;gap:12px}figure{margin:0}img{width:${DEVICE.width * 0.5}px;display:block;border:1px solid #888}figcaption{font-size:12px;text-align:center}</style>${row('light')}${row('dark')}`
    const sheet = await ctx0(browser, w)
    await sheet.setContent(html)
    await sheet.screenshot({ path: out, fullPage: true })
    console.log(`Contact sheet: ${out}`)
  }
  await browser.close()
} finally {
  server.kill()
}
async function ctx0(browser, w) {
  const c = await browser.newContext({ viewport: { width: w + 16, height: 800 }, deviceScaleFactor: 1.5 })
  return c.newPage()
}

if (problems.length) {
  if (known.size) console.log(`\n(${known.size} known small tap targets not counted; they are listed when the check passes.)`)
  const uniq = [...new Set(problems)]
  console.error(`\nLook check FAILED (${uniq.length} problem${uniq.length === 1 ? '' : 's'}):`)
  for (const p of uniq) console.error(`  - ${p}`)
  console.error('\nFix the page, or if it is intended, add it to ALLOW in scripts/look.config.mjs with a reason.')
  process.exit(1)
}
if (known.size) {
  console.log(`\nKnown small tap targets (listed in ALLOW.knownSmallTap, not failing; ${known.size}):`)
  for (const k of known) console.log(`  - ${k}`)
}
console.log('Look check passed.')

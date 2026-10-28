/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'node:path';
import { loadContent } from './scripts/content/load.mjs';
import { checkContent } from './scripts/content/check.mjs';
import { splitContent } from './scripts/content/split.mjs';
import { computeVersion } from './scripts/lib/version.mjs';

// Turns content/ into a small index, the module "virtual:wards-content", plus one file per card (cards/<id>.json) that the app
// fetches when a card opens and the service worker saves for offline use. Tests use "virtual:wards-content-full" (everything).
// Example cards (content/examples) are only included while developing, never in the published app.
function wardsContent(includeExamples: boolean, refuseBadContent: boolean) {
  const id = 'virtual:wards-content';
  const fullId = 'virtual:wards-content-full';
  let all: ReturnType<typeof loadContent> | null = null;
  let split: ReturnType<typeof splitContent> | null = null;
  const build = () => {
    all = loadContent(process.cwd(), { includeExamples, tag: true });
    split = splitContent(all);
  };
  type Res = { setHeader(k: string, v: string): void; end(b: string): void; statusCode: number };
  return {
    name: 'wards-content',
    buildStart() {
      build();
      // The build refuses bad references (and every other content rule), so a broken card can never be published.
      if (!refuseBadContent) return;
      const errors = checkContent(loadContent(process.cwd(), { includeExamples: true, tag: false }) as never);
      if (errors.length) throw new Error(`Content problems (${errors.length}):\n- ` + errors.join('\n- '));
    },
    resolveId: (s: string) => (s === id || s === fullId ? '\0' + s : null),
    load(s: string) {
      if (s !== '\0' + id && s !== '\0' + fullId) return null;
      if (!all || !split) build();
      for (const f of split!.files) (this as unknown as { addWatchFile(f: string): void }).addWatchFile(resolve(process.cwd(), f));
      return `export default ${JSON.stringify(s === '\0' + id ? split!.index : all)};`;
    },
    generateBundle() {
      if (!split) build();
      for (const [cid, payload] of Object.entries(split!.cards)) {
        (this as unknown as { emitFile(f: { type: 'asset'; fileName: string; source: string }): void }).emitFile({ type: 'asset', fileName: `cards/${cid}.json`, source: JSON.stringify(payload) });
      }
    },
    // While developing, the card files are served from memory (a build writes them to dist/cards/).
    configureServer(server: { middlewares: { use(fn: (req: { url?: string }, res: Res, next: () => void) => void): void } }) {
      server.middlewares.use((req, res, next) => {
        const m = (req.url ?? '').split('?')[0].match(/\/cards\/([a-z0-9-]+)\.json$/);
        if (!m) return next();
        if (!split) build();
        const payload = split!.cards[m[1]];
        if (!payload) { res.statusCode = 404; return res.end('not found'); }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(payload));
      });
    },
    handleHotUpdate(ctx: { file: string; server: { moduleGraph: { getModuleById(i: string): unknown; invalidateModule(m: unknown): void }; ws: { send(p: { type: string }): void } } }) {
      if (ctx.file.includes('/content/')) {
        all = null;
        split = null;
        for (const mid of [id, fullId]) {
          const m = ctx.server.moduleGraph.getModuleById('\0' + mid);
          if (m) ctx.server.moduleGraph.invalidateModule(m);
        }
        ctx.server.ws.send({ type: 'full-reload' });
      }
    },
  };
}

// The live app is served from https://akgrepos.github.io/wards/
export default defineConfig(({ command }) => ({
  base: '/wards/',
  // Stamped from git (date + commit count that day), so nobody edits a version by hand.
  define: { __APP_VERSION__: JSON.stringify(computeVersion()) },
  plugins: [
    wardsContent(command === 'serve', command === 'build' && !process.env.VITEST),
    react(),
    VitePWA({
      // Wait for a tap on "Reload" before switching to a new version.
      registerType: 'prompt',
      // Icons are made from public/favicon.svg by `npm run icons` (settings in pwa-assets.config.ts).
      includeAssets: ['favicon.svg', 'theme.js', 'apple-touch-icon-180x180.png'],
      manifest: {
        name: 'Wards',
        short_name: 'Wards',
        description: 'A personal internal medicine reference.',
        display: 'standalone',
        start_url: '/wards/',
        scope: '/wards/',
        background_color: '#f2f2f7',
        // Matches the page background (grouped background, light), so the bar behind the clock blends in.
        theme_color: '#f2f2f7',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Save everything the app needs so it works with no signal.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,json,webmanifest}'],
        // iOS keeps its own copy of the launch screens; no need to store them twice.
        globIgnores: ['startup/**'],
        // The default (2 MB) would silently leave the content out once there are about 60 cards.
        // `npm run build` checks that every built file is saved for offline use (scripts/check-precache.mjs).
        maximumFileSizeToCacheInBytes: 25 * 1024 * 1024,
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    // Slow CI machines can take longer than the 5-second default.
    testTimeout: 30000,
    // Other sessions' worktrees live under .claude/; test only this checkout.
    exclude: ['**/node_modules/**', '.claude/**'],
    // Tests read the whole content at once (see src/test-setup.ts).
    setupFiles: ['src/test-setup.ts'],
  },
}));

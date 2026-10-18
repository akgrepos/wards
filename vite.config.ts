/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'node:path';
import { loadContent } from './scripts/content/load.mjs';

// Bundles content/ into the app as the module "virtual:wards-content".
// Example cards (content/examples) are only included while developing, never in the published app.
function wardsContent(includeExamples: boolean) {
  const id = 'virtual:wards-content';
  return {
    name: 'wards-content',
    resolveId: (s: string) => (s === id ? '\0' + id : null),
    load(s: string) {
      if (s !== '\0' + id) return null;
      const content = loadContent(process.cwd(), { includeExamples });
      for (const c of content.cards) (this as unknown as { addWatchFile(f: string): void }).addWatchFile(resolve(process.cwd(), c.file));
      return `export default ${JSON.stringify(content)};`;
    },
    handleHotUpdate(ctx: { file: string; server: { moduleGraph: { getModuleById(i: string): unknown; invalidateModule(m: unknown): void }; ws: { send(p: { type: string }): void } } }) {
      if (ctx.file.includes('/content/')) {
        const m = ctx.server.moduleGraph.getModuleById('\0' + id);
        if (m) ctx.server.moduleGraph.invalidateModule(m);
        ctx.server.ws.send({ type: 'full-reload' });
      }
    },
  };
}

// The live app is served from https://akgrepos.github.io/wards/
export default defineConfig(({ command }) => ({
  base: '/wards/',
  plugins: [
    wardsContent(command === 'serve'),
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
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Save everything the app needs so it works with no signal.
        globPatterns: ['**/*.{js,css,html,svg,png,json}'],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
  },
}));

/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// The live app is served from https://akgrepos.github.io/wards/
export default defineConfig({
  base: '/wards/',
  plugins: [
    react(),
    VitePWA({
      // Wait for a tap on "Reload" before switching to a new version.
      registerType: 'prompt',
      // Icons are made from public/favicon.svg by `npm run icons` (settings in pwa-assets.config.ts).
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon-180x180.png'],
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
        globPatterns: ['**/*.{js,css,html,svg,png,txt,json,md}'],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
  },
});

import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config';

// The Home Screen icon fills its whole square (iOS rounds the corners itself).
export default defineConfig({
  preset: {
    ...minimal2023Preset,
    apple: { ...minimal2023Preset.apple, padding: 0 },
    maskable: { ...minimal2023Preset.maskable, padding: 0 },
  },
  images: ['public/favicon.svg'],
});

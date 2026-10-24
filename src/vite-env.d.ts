/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />

interface Window {
  React: typeof import('react');
}

declare module '*/vendor/akg/bundle.js';

// The index (small: no card text). Each card's text comes from cards/<id>.json (see src/content/index.ts).
declare module 'virtual:wards-content-full' {
  const content: import('./content/types').Content;
  export default content;
}

declare module 'virtual:wards-content' {
  const content: import('./content/types').Content;
  export default content;
}

declare const __APP_VERSION__: string;

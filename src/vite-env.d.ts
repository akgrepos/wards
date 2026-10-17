/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />

interface Window {
  React: typeof import('react');
}

declare module '*/vendor/akg/bundle.js';

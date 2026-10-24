import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../vendor/akg/bundle.css';
import './design/tokens.css';
import './design/base.css';
import { App } from './App';
import { reopenLastPage } from './router';

reopenLastPage();

// PROTOTYPE: the preview ribbon (a VITE_PREVIEW build only; never in the live app).
if (import.meta.env.VITE_PREVIEW) {
  const ribbon = document.createElement('div');
  ribbon.textContent = 'PREVIEW · Medication card look: Quiet colors, condition-list doses';
  ribbon.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99999;background:#ff8d28;color:#000;font:600 11px/16px -apple-system,sans-serif;text-align:center;padding-top:env(safe-area-inset-top);pointer-events:none';
  document.body.appendChild(ribbon);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

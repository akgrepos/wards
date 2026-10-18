import { useEffect, useState } from 'react';

// Hash-based addresses (#/card/<id>) so every card has its own link that works offline and on direct visits.
export type Route =
  | { name: 'home' }
  | { name: 'system'; id: string }
  | { name: 'card'; id: string; section?: string };

export function parseRoute(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  if (parts[0] === 'system' && parts[1]) return { name: 'system', id: parts[1] };
  if (parts[0] === 'card' && parts[1]) return { name: 'card', id: parts[1], section: parts[2] };
  return { name: 'home' };
}

export const href = {
  home: () => '#/',
  system: (id: string) => `#/system/${encodeURIComponent(id)}`,
  card: (id: string) => `#/card/${encodeURIComponent(id)}`,
};

// How many in-app steps deep we are, so Back returns to the previous page when there is one.
let depth = 0;
// Scroll position of each page in the back stack, so Back returns to the same place (Apple HIG: keep people's place).
const scrollAt: number[] = [];

// The last page and scroll position, so the app reopens where it was if iOS closes it in the background.
// Kept only on this device; reading or writing can fail (private browsing), and the app works without it.
const LAST = 'wards:last';
function saveLast() {
  try { localStorage.setItem(LAST, JSON.stringify({ hash: location.hash, y: Math.round(scrollY) })); } catch { /* not available */ }
}
function readLast(): { hash: string; y: number } | null {
  try { return JSON.parse(localStorage.getItem(LAST) ?? 'null'); } catch { return null; }
}

// On a fresh launch (the Home Screen icon opens the app with no page in the address), go back to the last page.
let restoreY: number | null = null;
export function reopenLastPage() {
  if (location.hash && location.hash !== '#') return;
  const last = readLast();
  if (!last?.hash || parseRoute(last.hash).name === 'home') return;
  history.replaceState(null, '', last.hash);
  restoreY = last.y;
}

const afterRender = (fn: () => void) => setTimeout(fn, 50);

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseRoute(location.hash));
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    if (restoreY != null) { const y = restoreY; restoreY = null; afterRender(() => scrollTo(0, y)); }
    let saving = 0;
    const onScroll = () => {
      scrollAt[depth] = scrollY;
      if (!saving) saving = window.setTimeout(() => { saving = 0; saveLast(); }, 300);
    };
    const onHash = () => {
      const known = (history.state as { wardsDepth?: number } | null)?.wardsDepth;
      depth = known ?? depth + 1;
      history.replaceState({ wardsDepth: depth }, '');
      setRoute(parseRoute(location.hash));
      // Back or Forward to a page we've seen: return to where it was. A new page starts at the top.
      const y = known != null ? scrollAt[depth] ?? 0 : 0;
      if (known == null) scrollAt[depth] = 0;
      scrollTo(0, 0);
      if (y) afterRender(() => scrollTo(0, y));
      saveLast();
    };
    addEventListener('hashchange', onHash);
    addEventListener('scroll', onScroll, { passive: true });
    return () => { removeEventListener('hashchange', onHash); removeEventListener('scroll', onScroll); };
  }, []);
  return route;
}

export function goBack(fallback: string) {
  if (depth > 0) history.back();
  else location.replace(fallback);
}

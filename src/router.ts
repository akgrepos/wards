import { useEffect, useState } from 'react';
import { getCard, getSystem, hasEmergency } from './content';

// Hash-based addresses (#/card/<id>) so every page has its own link that works offline and on direct visits.
// 'home' is the Topics tab (Home and Topics are one screen).
export type Tab = 'home' | 'emergencies' | 'library' | 'search';
export type Route =
  | { name: 'home' }
  | { name: 'emergencies' }
  | { name: 'topics' }
  | { name: 'library' }
  | { name: 'library-list'; id: string }
  | { name: 'search' }
  | { name: 'settings' }
  | { name: 'system'; id: string }
  // section: a section key; anchor: a subheading or step inside it (pathway links land on it).
  | { name: 'card'; id: string; section?: string; anchor?: string }
  | { name: 'pathway'; id: string }
  // An emergency page (Rapids), and Timed Mode, which runs one emergency at a time.
  | { name: 'emergency'; id: string }
  | { name: 'timed' }
  | { name: 'not-found' };

// Sections renamed since: old links still open the right section ("When to Call" became "Escalation", 2026-10-19).
const RENAMED_SECTIONS: Record<string, string> = { 'when-to-call': 'escalation' };
// Pathways renamed since (2026-10-19: whole-card maps; 2026-10-20: focused pathways).
const RENAMED_PATHWAYS: Record<string, string> = {
  'hyperkalemia-management': 'hyperkalemia-treatment', hyperkalemia: 'hyperkalemia-treatment', 'aki-evaluation': 'aki-cause-workup',
};

const ROOTS = ['emergencies', 'topics', 'library', 'search', 'settings', 'timed'] as const;

export function parseRoute(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map((p) => { try { return decodeURIComponent(p); } catch { return p; } });
  const [a, b, c, d] = parts;
  if (!a || a === 'home') return parts.length <= 1 ? { name: 'home' } : { name: 'not-found' };
  if (a === 'system' && b && !c) return { name: 'system', id: b };
  if (a === 'card' && b && parts.length <= 4) return { name: 'card', id: b, section: c && (RENAMED_SECTIONS[c] ?? c), anchor: c ? d : undefined };
  if (a === 'pathway' && b && !c) return { name: 'pathway', id: RENAMED_PATHWAYS[b] ?? b };
  if (a === 'emergency' && b && !c) return { name: 'emergency', id: b };
  if (a === 'library' && b && !c) return { name: 'library-list', id: b };
  if ((ROOTS as readonly string[]).includes(a) && !b) return { name: a as (typeof ROOTS)[number] };
  return { name: 'not-found' };
}

export const href = {
  home: () => '#/',
  emergencies: () => '#/emergencies',
  topics: () => '#/',
  library: () => '#/library',
  libraryList: (id: string) => `#/library/${encodeURIComponent(id)}`,
  search: () => '#/search',
  settings: () => '#/settings',
  system: (id: string) => `#/system/${encodeURIComponent(id)}`,
  pathway: (id: string) => `#/pathway/${encodeURIComponent(id)}`,
  emergency: (id: string) => `#/emergency/${encodeURIComponent(id)}`,
  timed: () => '#/timed',
  card: (id: string, section?: string, anchor?: string) => `#/card/${encodeURIComponent(id)}${section ? `/${encodeURIComponent(section)}${anchor ? `/${encodeURIComponent(anchor)}` : ''}` : ''}`,
};

export const TAB_ROOT: Record<Exclude<Tab, 'search'>, string> = {
  home: href.home(), emergencies: href.emergencies(), library: href.library(),
};

// The tab a page belongs to when we don't know how it was reached (a direct link or a reopen).
export function tabFor(route: Route): Tab {
  switch (route.name) {
    case 'emergencies': case 'emergency': case 'timed': return 'emergencies';
    case 'library': case 'library-list': return 'library';
    case 'search': return 'search';
    case 'system': return route.id === 'library' ? 'library' : 'home';
    case 'card': return getCard(route.id)?.system === 'library' ? 'library' : 'home';
    case 'pathway': return 'library';
    default: return 'home';
  }
}
const isTabRoot = (r: Route) => r.name === 'home' || r.name === 'emergencies' || r.name === 'topics' || r.name === 'library';

// What each history entry remembers: how many in-app steps deep it is (so Back knows there is a page behind it),
// which tab it belongs to, the title of the page it was opened from (the Back button's name), and a search query.
type State = { wardsDepth: number; tab: Tab; back?: string; q?: string };
const stateNow = () => history.state as Partial<State> | null;

let depth = 0;
let tab: Tab = 'home';
let lastKey = '';
// Scroll position of each page in the back stack, so Back returns to the same place (Apple HIG: keep people's place).
const scrollAt: number[] = [];
// The title of the page on screen, set by Screen; becomes the Back name of the next page opened.
let pageTitle = 'Topics';
export const setPageTitle = (t: string) => { pageTitle = t; };

/** The current tab (for the tab bar). */
export const currentTab = () => tab;
/** The name of the page Back returns to, or the fallback's name when there's none behind it. */
export const backLabel = (fallbackLabel: string) => (depth > 0 && stateNow()?.back) || fallbackLabel;

function adopt(): Route {
  const route = parseRoute(location.hash);
  const s = stateNow();
  if (s?.wardsDepth != null && s.tab) {
    depth = s.wardsDepth;
    tab = s.tab;
  } else {
    // A page we haven't seen yet: a new step, opened from the page that was on screen.
    const fresh = lastKey === '';
    depth = fresh ? 0 : depth + 1;
    tab = isTabRoot(route) || route.name === 'search' || fresh ? tabFor(route) : tab;
    history.replaceState({ wardsDepth: depth, tab, back: fresh ? undefined : pageTitle } satisfies State, '');
  }
  lastKey = `${location.hash}|${depth}`;
  return route;
}

// The last page and when it was open, so the app reopens there if iOS closes it in the background.
// Kept only on this device; reading or writing can fail (private browsing), and the app works without it.
const LAST = 'wards:last';
export const REOPEN_WITHIN_MS = 30 * 60 * 1000;
function saveLast() {
  try { localStorage.setItem(LAST, JSON.stringify({ hash: location.hash, y: Math.round(scrollY), t: Date.now() })); } catch { /* not available */ }
}
function readLast(): { hash: string; y: number; t?: number } | null {
  try { return JSON.parse(localStorage.getItem(LAST) ?? 'null'); } catch { return null; }
}

// On a fresh launch (the Home Screen icon opens the app with no page in the address), go back to the last page,
// but only if it was open in the last 30 minutes and still exists. Otherwise start on Home.
let restoreY: number | null = null;
// How the page on screen was reached: by Back or Forward (or a reopen), which restores its own scroll position,
// or as a new page, which starts at the top unless the page restores itself (topic pages, storage.getCardScroll).
let returning = false;
export const isReturning = () => returning || restoreY != null;
export function reopenLastPage(now = Date.now()) {
  if (location.hash && location.hash !== '#') return;
  // Timed Mode still running: back to it, however long the app was closed (the timer kept counting).
  if (timedRunning()) {
    history.replaceState({ wardsDepth: 0, tab: 'emergencies' } satisfies State, '', href.timed());
    return;
  }
  const last = readLast();
  if (!last?.hash || typeof last.t !== 'number' || now - last.t > REOPEN_WITHIN_MS || now < last.t) return;
  const route = parseRoute(last.hash);
  if (route.name === 'home' || route.name === 'search' || route.name === 'not-found') return;
  if (route.name === 'card' && !getCard(route.id)) return;
  if (route.name === 'system' && !getSystem(route.id)) return;
  if (route.name === 'emergency' && !hasEmergency(route.id)) return;
  if (route.name === 'timed') return;
  history.replaceState({ wardsDepth: 0, tab: tabFor(route) } satisfies State, '', last.hash);
  restoreY = last.y;
}

function timedRunning() {
  try {
    const s = JSON.parse(localStorage.getItem('wards:timed') ?? 'null');
    return !!s && typeof s.card === 'string' && s.end == null && hasEmergency(s.card);
  } catch { return false; }
}

// Return to a scroll position once the page is long enough (long cards take a moment to lay out).
export function restoreScroll(y: number) {
  let tries = 0;
  const attempt = () => {
    scrollTo(0, y);
    if (Math.abs(scrollY - y) > 2 && tries++ < 20) setTimeout(attempt, 50);
  };
  setTimeout(attempt, 0);
}

let notify: ((r: Route) => void) | null = null;
function sync(isNew?: boolean) {
  const key = `${location.hash}|${stateNow()?.wardsDepth ?? 'new'}`;
  if (!isNew && key === lastKey) return;
  const seen = stateNow()?.wardsDepth != null;
  returning = seen && !isNew;
  const route = adopt();
  notify?.(route);
  // Back or Forward to a page we've seen: return to where it was. A new page starts at the top.
  const y = seen && !isNew ? scrollAt[depth] ?? 0 : 0;
  if (!seen || isNew) scrollAt[depth] = 0;
  scrollTo(0, 0);
  if (y) restoreScroll(y);
  saveLast();
}

export function useRoute(): Route {
  const [route, setRoute] = useState(adopt);
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    if (restoreY != null) { const y = restoreY; restoreY = null; restoreScroll(y); }
    notify = setRoute;
    let saving = 0;
    const onScroll = () => {
      scrollAt[depth] = scrollY;
      if (!saving) saving = window.setTimeout(() => { saving = 0; saveLast(); }, 300);
    };
    const onEvent = () => sync();
    const onHide = () => { if (document.visibilityState === 'hidden') saveLast(); };
    addEventListener('hashchange', onEvent);
    addEventListener('popstate', onEvent);
    addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onHide);
    saveLast();
    return () => {
      notify = null;
      removeEventListener('hashchange', onEvent);
      removeEventListener('popstate', onEvent);
      removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onHide);
    };
  }, []);
  return route;
}

// Show a page in place of the current one, as the first step of a tab (nothing behind it to go Back to).
function replaceWith(to: string, nextTab: Tab) {
  history.replaceState({ wardsDepth: 0, tab: nextTab } satisfies State, '', to);
  scrollAt[0] = 0;
  sync(true);
}

/** Back: to the page behind this one, or, when there is none (after a reopen or a direct link), up to the parent page. Never leaves the app. */
export function goBack(fallback: string) {
  if (depth > 0) history.back();
  else {
    const r = parseRoute(fallback);
    replaceWith(fallback, isTabRoot(r) ? tabFor(r) : tab === 'search' ? tabFor(r) : tab);
  }
}

/** A tab was tapped: show its first page. Tapping the tab you're on scrolls back to the top (Apple HIG). */
export function switchTab(next: Exclude<Tab, 'search'>) {
  if (next === tab && location.hash === TAB_ROOT[next]) { scrollTo({ top: 0, behavior: 'smooth' }); return; }
  replaceWith(TAB_ROOT[next], next);
}

/** Open a page as a new step (Back returns here). */
export const open = (to: string) => { location.hash = to; };

/** Remember a search query in this history entry, so Back to Search shows the same results. */
export function rememberQuery(q: string) {
  history.replaceState({ ...(stateNow() as State), q }, '');
}
export const rememberedQuery = () => stateNow()?.q ?? '';

/** A search result opened a card at a section: that section is tinted briefly once it is on screen (CardScreen takes the request). */
let flash: { id: string; section: string } | null = null;
export const requestFlash = (id: string, section: string) => { flash = { id, section }; };
export function takeFlash(id: string, section: string) {
  const mine = flash?.id === id && flash.section === section;
  flash = null;
  return mine;
}

/** Drop the section part of the address once it has been shown, so Back to this page keeps its scroll position instead. */
export function forgetSection(id: string) {
  history.replaceState(history.state, '', href.card(id));
  lastKey = `${location.hash}|${depth}`;
}

/** For tests: forget everything, as if the app had just launched. */
export function resetRouterForTests() {
  depth = 0; tab = 'home'; lastKey = ''; pageTitle = 'Topics'; restoreY = null; scrollAt.length = 0; returning = false;
}

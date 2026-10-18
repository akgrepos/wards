import { useSyncExternalStore } from 'react';

// Favorites, Recent and Continue Reading, kept only on this phone (localStorage). Reading or writing can fail
// (private browsing, storage full); the app then works without them.
export type Recent = { id: string; t: number };
export type Reading = { id: string; section?: string; t: number };

const KEYS = { favorites: 'wards:favorites', recent: 'wards:recent', reading: 'wards:reading' } as const;
export const RECENT_MAX = 5;

function read<T>(key: string, fallback: T, valid: (v: unknown) => boolean): T {
  try {
    const v = JSON.parse(localStorage.getItem(key) ?? 'null');
    return valid(v) ? (v as T) : fallback;
  } catch { return fallback; }
}
function write(key: string, value: unknown) {
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch { /* not available */ }
  cache.delete(key);
  listeners.forEach((l) => l());
}

const isStrings = (v: unknown) => Array.isArray(v) && v.every((x) => typeof x === 'string');
const isRecents = (v: unknown) => Array.isArray(v) && v.every((x) => x && typeof x.id === 'string' && typeof x.t === 'number');
const isReading = (v: unknown) => !!v && typeof (v as Reading).id === 'string' && typeof (v as Reading).t === 'number';

// React reads these through useStored, which needs the same object back until something changes.
const cache = new Map<string, unknown>();
const cached = <T>(key: string, get: () => T): T => {
  if (!cache.has(key)) cache.set(key, get());
  return cache.get(key) as T;
};
const listeners = new Set<() => void>();
const subscribe = (l: () => void) => {
  listeners.add(l);
  // Another tab of the app changed them.
  const onStorage = () => { cache.clear(); l(); };
  addEventListener('storage', onStorage);
  return () => { listeners.delete(l); removeEventListener('storage', onStorage); };
};

export const getFavorites = () => cached<string[]>(KEYS.favorites, () => read(KEYS.favorites, [], isStrings));
export const isFavorite = (id: string) => getFavorites().includes(id);
export function toggleFavorite(id: string) {
  const favs = getFavorites();
  write(KEYS.favorites, favs.includes(id) ? favs.filter((x) => x !== id) : [...favs, id]);
}
export const clearFavorites = () => write(KEYS.favorites, null);

// The last five pages opened, newest first, each listed once.
export const getRecent = () => cached<Recent[]>(KEYS.recent, () => read(KEYS.recent, [], isRecents));
export function addRecent(id: string, now = Date.now()) {
  write(KEYS.recent, [{ id, t: now }, ...getRecent().filter((r) => r.id !== id)].slice(0, RECENT_MAX));
}
export const clearRecent = () => write(KEYS.recent, null);

// The topic being read and the section on screen, for Continue Reading on Home.
export const getReading = () => cached<Reading | null>(KEYS.reading, () => read(KEYS.reading, null, isReading));
export function setReading(id: string, section: string | undefined, now = Date.now()) {
  const r = getReading();
  if (r?.id === id && r.section === section) return;
  write(KEYS.reading, { id, section, t: now });
}
export const clearReading = () => write(KEYS.reading, null);

/** Re-renders when the stored lists change. */
export function useStored<T>(get: () => T): T {
  return useSyncExternalStore(subscribe, get, get);
}

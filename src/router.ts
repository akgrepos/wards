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

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseRoute(location.hash));
  useEffect(() => {
    const on = () => {
      depth = (history.state as { wardsDepth?: number } | null)?.wardsDepth ?? depth + 1;
      history.replaceState({ wardsDepth: depth }, '');
      setRoute(parseRoute(location.hash));
      window.scrollTo(0, 0);
    };
    addEventListener('hashchange', on);
    return () => removeEventListener('hashchange', on);
  }, []);
  return route;
}

export function goBack(fallback: string) {
  if (depth > 0) history.back();
  else location.replace(fallback);
}

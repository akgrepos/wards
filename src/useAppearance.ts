import { useEffect } from 'react';

// Keeps data-theme on <html> in step with the iPhone's light/dark setting.
// index.html sets the first value before the page draws; this follows later changes.
export function useAppearance() {
  useEffect(() => {
    const dark = matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      document.documentElement.dataset.theme = dark.matches ? 'ios-dark' : 'ios-light';
      // Tell iOS the new color of the strip behind the clock (the two media-based tags in index.html only apply at launch).
      document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.remove());
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = getComputedStyle(document.documentElement).getPropertyValue('--background-grouped').trim() || (dark.matches ? '#000000' : '#f2f2f7');
      document.head.appendChild(meta);
    };
    apply();
    dark.addEventListener('change', apply);
    return () => dark.removeEventListener('change', apply);
  }, []);
}

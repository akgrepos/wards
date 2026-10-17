import { useEffect } from 'react';

// Keeps data-theme on <html> in step with the iPhone's light/dark setting.
// index.html sets the first value before the page draws; this follows later changes.
export function useAppearance() {
  useEffect(() => {
    const dark = matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      document.documentElement.dataset.theme = dark.matches ? 'ios-dark' : 'ios-light';
    };
    apply();
    dark.addEventListener('change', apply);
    return () => dark.removeEventListener('change', apply);
  }, []);
}

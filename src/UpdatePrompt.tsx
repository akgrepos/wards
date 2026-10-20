import { useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { AKG } from './design/akg';

// Set just before reloading for an update, so the reloaded page can tell whether the update took.
// Kept for this visit only (sessionStorage); reading or writing can fail, and the banner works without it.
const TRIED = 'wards:update-tried';
const FAILED_WITHIN_MS = 60 * 1000;
function takeTried(): number | null {
  try {
    const t = Number(sessionStorage.getItem(TRIED));
    sessionStorage.removeItem(TRIED);
    return t > 0 ? t : null;
  } catch { return null; }
}
const markTried = () => { try { sessionStorage.setItem(TRIED, String(Date.now())); } catch { /* not available */ } };
const tried = takeTried();

/** True when an update was tried moments ago and the same update is still waiting: it didn't install. */
export const updateFailed = (needRefresh: boolean, triedAt: number | null, now = Date.now()) =>
  needRefresh && triedAt != null && now - triedAt < FAILED_WITHIN_MS;

// Shown when a new version has downloaded in the background. Nothing changes until "Reload" is tapped;
// "Later" hides it until the app is next opened. It floats above the tab bar, so it never covers navigation.
export function UpdatePrompt() {
  const [later, setLater] = useState(false);
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    // Look for a new version when the app opens (the browser itself only checks on opening once a day) and each time
    // it comes back to the front, since a Home Screen app can stay open for days. Offline, a check just fails quietly.
    onRegisteredSW(_url, registration) {
      if (!registration) return;
      const check = () => { if (navigator.onLine) registration.update().catch(() => {}); };
      check();
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') check();
      });
    },
  });

  // Normally the page reloads as soon as the new version takes over. As a safety net (some Home Screen apps miss
  // that signal), ask the waiting version to take over directly and reload after a few seconds.
  const reload = () => {
    markTried();
    void updateServiceWorker(true);
    setTimeout(async () => {
      const reg = await navigator.serviceWorker?.getRegistration();
      reg?.waiting?.postMessage({ type: 'SKIP_WAITING' });
      setTimeout(() => location.reload(), 500);
    }, 3000);
  };

  if (!needRefresh || later) return null;
  const failed = updateFailed(needRefresh, tried);

  return (
    <AKG.Banner
      placement="bottom"
      className="update-banner"
      title={failed ? 'Couldn’t Update' : 'Update Ready'}
      actions={[{ label: failed ? 'Try Again' : 'Reload', onClick: reload }]}
      onClose={() => setLater(true)}
    >
      {failed ? 'The new version didn’t finish installing. Try again, or reopen Wards later.' : 'A new version of Wards has downloaded.'}
    </AKG.Banner>
  );
}

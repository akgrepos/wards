import { useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { AKG } from './design/akg';

// Shown when a new version has downloaded in the background. Nothing changes until "Reload" is tapped;
// "Later" hides it until the app is next opened.
export function UpdatePrompt() {
  const [later, setLater] = useState(false);
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    // A Home Screen app can stay open for days, so also look for a new version each time it comes back to the front.
    onRegisteredSW(_url, registration) {
      if (!registration) return;
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && navigator.onLine) registration.update();
      });
    },
  });

  if (!needRefresh || later) return null;

  return (
    <AKG.Banner
      placement="bottom"
      title="Update Ready"
      actions={[{ label: 'Reload', onClick: () => updateServiceWorker(true) }]}
      onClose={() => setLater(true)}
    >
      A new version of Wards has downloaded.
    </AKG.Banner>
  );
}

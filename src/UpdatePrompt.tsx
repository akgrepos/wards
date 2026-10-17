import { useRegisterSW } from 'virtual:pwa-register/react';
import { AKG } from './design/akg';

// Shown when a new version has downloaded in the background. Nothing changes until "Reload" is tapped.
export function UpdatePrompt() {
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

  if (!needRefresh) return null;

  return (
    <div className="update-prompt">
      <AKG.Notification
        icon={<img src={`${import.meta.env.BASE_URL}pwa-64x64.png`} alt="" />}
        title="Update Ready"
        body="A new version of Wards has downloaded."
        actions={[{ label: 'Reload', onClick: () => updateServiceWorker(true) }]}
      />
    </div>
  );
}

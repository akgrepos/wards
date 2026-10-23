import type { ReactNode } from 'react';
import { AKG } from '../design/akg';
import { getCard, useCardLoad } from '../content';
import { href } from '../router';
import { Empty, Screen } from '../screens/common';

// Shows its children once the card's file (its text and data) is ready. Almost always at once: the files are saved on
// the phone. While it is on its way the page shows its title only; if it can't be fetched, a plain message with Try Again.
export function CardGate({ id, back, children }: { id: string | undefined; back?: { label: string; fallback: string }; children: ReactNode }) {
  const { status, retry } = useCardLoad(id && getCard(id) ? id : undefined);
  if (status === 'ready') return <>{children}</>;
  const title = (id && getCard(id)?.title) || '';
  return (
    <Screen title={title} back={back ?? { label: 'Reference', fallback: href.home() }}>
      {status === 'error' && (
        <Empty
          title="Can’t Open This Page"
          description="This page isn’t saved on this iPhone yet. Connect to the internet and try again."
          actions={<AKG.Button variant="prominent" onClick={retry}>Try Again</AKG.Button>}
        />
      )}
    </Screen>
  );
}

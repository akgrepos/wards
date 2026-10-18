import type { ReactNode } from 'react';
import { AKG } from '../design/akg';
import { goBack } from '../router';

const chevronLeft = (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.5 4 6.5 10l6 6" /></svg>
);

// A screen with the top bar. Top-level screens use a large title; pushed screens get a back button (Apple HIG navigation).
export function Screen({ title, large, back, children }: { title: string; large?: boolean; back?: { label: string; fallback: string }; children: ReactNode }) {
  return (
    <div className="screen-page">
      <div className="top-bar">
        <AKG.Toolbar
          title={title}
          largeTitle={large}
          leading={back ? <AKG.ToolbarButton icon={chevronLeft} aria-label={`Back to ${back.label}`} onClick={() => goBack(back.fallback)} /> : undefined}
        />
      </div>
      <main className="screen-body">{children}</main>
    </div>
  );
}

import { useRef, type ReactNode, type RefObject } from 'react';
import { AKG } from '../design/akg';
import { goBack } from '../router';

const chevronLeft = (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.5 4 6.5 10l6 6" /></svg>
);

// A screen with the top bar. The title shows once (Apple HIG): large at the top of the page, then small in the bar
// once it has scrolled away. Pushed screens get a back button. Pass `head` and `titleRef` for a custom page header.
export function Screen({ title, back, head, titleRef, children }: {
  title: string;
  back?: { label: string; fallback: string };
  head?: ReactNode;
  titleRef?: RefObject<HTMLHeadingElement | null>;
  children: ReactNode;
}) {
  const ownRef = useRef<HTMLHeadingElement>(null);
  const ref = titleRef ?? ownRef;
  const scrolled = AKG.useScrolledPast(ref);
  return (
    <div className="screen-page">
      <div className="top-bar">
        <AKG.Toolbar
          title={title}
          showTitle={scrolled}
          leading={back ? <AKG.ToolbarButton icon={chevronLeft} aria-label={`Back to ${back.label}`} onClick={() => goBack(back.fallback)} /> : undefined}
        />
      </div>
      <main className="screen-body">
        {head ?? <h1 ref={ownRef} className="ios-large-title-emphasized page-title">{title}</h1>}
        {children}
      </main>
    </div>
  );
}

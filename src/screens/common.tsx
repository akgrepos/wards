import { useEffect, useRef, type ReactNode, type RefObject } from 'react';
import { AKG } from '../design/akg';
import { backLabel, goBack, setPageTitle } from '../router';
import { icons } from '../ui/icons';

// A screen with the top bar. The title shows once (Apple HIG): large at the top of the page, then small in the bar
// once it has scrolled away. Pushed screens get a back button; `back.fallback` is the parent page, used when there
// is no page behind this one (after a reopen or a direct link). Pass `head` and `titleRef` for a custom page header.
export function Screen({ title, back, trailing, head, titleRef, children }: {
  title: string;
  back?: { label: string; fallback: string };
  trailing?: ReactNode;
  head?: ReactNode;
  titleRef?: RefObject<HTMLHeadingElement | null>;
  children: ReactNode;
}) {
  const ownRef = useRef<HTMLHeadingElement>(null);
  const ref = titleRef ?? ownRef;
  const scrolled = AKG.useScrolledPast(ref);
  useEffect(() => { setPageTitle(title); }, [title]);
  return (
    <div className="screen-page">
      <div className="top-bar">
        <AKG.Toolbar
          title={title}
          showTitle={scrolled}
          leading={back ? <AKG.ToolbarButton icon={icons.back} aria-label={`Back to ${backLabel(back.label)}`} onClick={() => goBack(back.fallback)} /> : undefined}
          trailing={trailing}
        />
      </div>
      <main className="screen-body">
        {head ?? <h1 ref={ownRef} className="ios-large-title-emphasized page-title">{title}</h1>}
        {children}
      </main>
    </div>
  );
}

// An empty list: the design system's EmptyState, centered in the space below the title.
export function Empty({ title, description, actions }: { title: string; description: string; actions?: ReactNode }) {
  return <div className="empty"><AKG.EmptyState title={title} description={description} actions={actions} /></div>;
}

// "10 min ago" for Recent.
export function ago(t: number, now = Date.now()) {
  const min = Math.round((now - t) / 60000);
  if (min < 1) return 'Just now';
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? 'Yesterday' : `${d} days ago`;
}

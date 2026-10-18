import type { ReactNode } from 'react';
import { iconPaths } from './icon-paths';

// Wards' symbols. Each is our own drawing of the SF Symbol it is named after (SF Symbols are a reference only:
// Apple's artwork can't be copied into a public site, DECISIONS 2026-10-18). The drawings live in
// scripts/icons/draw_icons.py, which writes their outlines to icon-paths.ts: 1.4pt rounded lines on a 20pt grid,
// solid only where the symbol is filled. Like iOS, tab bar and tile symbols use the filled variant (the script
// names the variant drawn). Where SF Symbols has no symbol (stomach, liver, kidney, ribbon, thyroid), a custom
// filled symbol in the same style.
const glyph = (d: string) => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d={d} /></svg>
);

export const icons = Object.fromEntries(Object.entries(iconPaths).map(([name, d]) => [name, glyph(d)])) as Record<keyof typeof iconPaths, ReactNode>;

// Each system's symbol and tile color (Settings-style tinted squares). Red is kept for emergencies.
export const systemIcon: Record<string, { icon: ReactNode; tint: string }> = {
  cardio: { icon: icons.heart, tint: 'var(--system-pink)' },
  pulm: { icon: icons.lungs, tint: 'var(--system-cyan)' },
  crit: { icon: icons.waveformPathEcg, tint: 'var(--system-orange)' },
  gi: { icon: icons.stomach, tint: 'var(--system-mint)' },
  liver: { icon: icons.liver, tint: 'var(--system-brown)' },
  renal: { icon: icons.kidney, tint: 'var(--system-teal)' },
  id: { icon: icons.microbe, tint: 'var(--system-green)' },
  heme: { icon: icons.dropFill, tint: 'var(--system-purple)' },
  onc: { icon: icons.ribbon, tint: 'var(--system-indigo)' },
  endo: { icon: icons.thyroid, tint: 'var(--system-blue)' },
  rheum: { icon: icons.figureWalk, tint: 'var(--system-gray)' },
  neuro: { icon: icons.brainHeadProfile, tint: 'var(--system-purple)' },
  psych: { icon: icons.bubbleLeftAndBubbleRight, tint: 'var(--system-indigo)' },
  derm: { icon: icons.eye, tint: 'var(--system-orange)' },
  wh: { icon: icons.figureAndChildHoldinghands, tint: 'var(--system-pink)' },
  hosp: { icon: icons.bedDouble, tint: 'var(--system-blue)' },
  library: { icon: icons.crossCase, tint: 'var(--system-indigo)' },
};
export const iconFor = (systemId: string) => systemIcon[systemId] ?? { icon: icons.heartTextClipboard, tint: 'var(--system-gray)' };

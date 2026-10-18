import type { ReactNode } from 'react';

// Wards' symbols. Each is our own simple drawing of the SF Symbol it is named after (SF Symbols are a reference
// only: Apple's artwork can't be copied into a public site, DECISIONS 2026-10-18). Drawn like the design system's
// icons: 2pt rounded lines on a 20pt grid. Where SF Symbols has no symbol (stomach, liver, kidney, ribbon, thyroid),
// a custom symbol in the same style.
const sym = (d: ReactNode) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);
const solid = { fill: 'currentColor', stroke: 'none' } as const;
const starPath = 'M10 2.8l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L2.8 8.1l5-.7z';

export const icons = {
  // Tabs and bars
  house: sym(<path d="M2.5 9.5 10 3l7.5 6.5M4.5 8v9h11V8M8.5 17v-4.5h3V17" />),
  staroflifeFill: sym(<path d="M10 3v14M3.9 6.5l12.2 7M3.9 13.5l12.2-7" strokeWidth="3.6" />),
  heartTextClipboard: sym(<>
    <rect x="4" y="3.5" width="12" height="14.5" rx="2" />
    <path d="M8 3.5V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v.5" />
    <path {...solid} d="M10 14s-3.4-2.1-3.4-4.4a1.7 1.7 0 0 1 3.4-.8 1.7 1.7 0 0 1 3.4.8c0 2.3-3.4 4.4-3.4 4.4z" />
  </>),
  crossCase: sym(<>
    <rect x="2" y="6" width="16" height="11" rx="2" />
    <path d="M7 6V4.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V6M10 9v5M7.5 11.5h5" />
  </>),
  gearshape: sym(<><path d="M16.1 8.8 L18.1 8.9 L18.1 11.1 L16.1 11.2 L15.2 13.4 L16.6 14.9 L14.9 16.6 L13.4 15.2 L11.2 16.1 L11.1 18.1 L8.9 18.1 L8.8 16.1 L6.6 15.2 L5.1 16.6 L3.4 14.9 L4.8 13.4 L3.9 11.2 L1.9 11.1 L1.9 8.9 L3.9 8.8 L4.8 6.6 L3.4 5.1 L5.1 3.4 L6.6 4.8 L8.8 3.9 L8.9 1.9 L11.1 1.9 L11.2 3.9 L13.4 4.8 L14.9 3.4 L16.6 5.1 L15.2 6.6Z" /><circle cx="10" cy="10" r="2.6" /></>),
  star: sym(<path d={starPath} />),
  starFill: sym(<path d={starPath} fill="currentColor" />),
  xmark: sym(<path d="M5 5l10 10M15 5L5 15" />),
  chevronBackward: sym(<path d="M12.5 4 6.5 10l6 6" />),
  arrowUpRight: sym(<path d="M6 14 14 6M7.5 6H14v6.5" />),
  // Library
  plusForwardslashMinus: sym(<path d="M3 6h5M5.5 3.5v5M14 3 6 17M12 14.5h5" />),
  checklist: sym(<>
    <circle cx="4.5" cy="5.5" r="2.3" />
    <circle cx="4.5" cy="14" r="2.3" />
    <path d="M9.5 5.5H18M9.5 14H18" />
  </>),
  arrowLeftArrowRight: sym(<path d="M17 6.5H3M6.5 3 3 6.5 6.5 10M3 13.5h14M13.5 10l3.5 3.5-3.5 3.5" />),
  pills: sym(<>
    <path d="M2.9 9.6l5.2-5.2a2.7 2.7 0 0 1 3.8 3.8l-5.2 5.2a2.7 2.7 0 0 1-3.8-3.8zM5.5 7l3.8 3.8" />
    <circle cx="14.5" cy="14.5" r="3.5" />
    <path d="M12 14.5h5" />
  </>),
  flowchart: sym(<>
    <rect x="3.5" y="2.5" width="13" height="4.5" rx="1.5" />
    <rect x="3.5" y="9" width="13" height="4.5" rx="1.5" />
    <path d="M10 13.5v4M8 15.5l2 2 2-2" />
  </>),
  testtube2: sym(<path d="M4.5 3v11.5a1.5 1.5 0 0 0 3 0V3M3.5 3h5M12.5 3v11.5a1.5 1.5 0 0 0 3 0V3M11.5 3h5M4.5 10h3M12.5 8h3" />),
  // Systems
  heart: sym(<path d="M10 17s-7-4.3-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 17 8c0 4.7-7 9-7 9z" />),
  lungs: sym(<path d="M10 2.5V9M10 9 7 11.5M10 9l3 2.5M8 6.5C6 5 3.6 7 3.1 11c-.3 2.5-.3 4.5.5 5.3.8.8 3 .2 4-.5.5-.4.4-1.5.4-3V6.5zM12 6.5c2-1.5 4.4.5 4.9 4.5.3 2.5.3 4.5-.5 5.3-.8.8-3 .2-4-.5-.5-.4-.4-1.5-.4-3V6.5z" />),
  waveformPathEcg: sym(<path d="M1.5 10.5h3.5l1.5 2L9.5 4l2.5 12.5L14 10h4.5" />),
  stomach: sym(<path d="M8 2v4c0 2-4 2-4 6a5 5 0 0 0 9 3c1-1.5 3-1 3-4 0-2.5-3-3-5-1-1 1-2 0-2-1V2" />),
  liver: sym(<path d="M3 8c0-3 4-4 8-4s6 1 6 3-3 3-5 5-4 4-6 4-3-4-3-8z" />),
  kidney: sym(<path d="M11.5 3C7.5 2 3.5 4.8 3.5 10s3.6 7.8 7.2 7c2.1-.5 2.6-2.4 1.6-4-.7-1.2-.7-2.8.2-4 1.6-2.2 1.6-5.4-1-6z" />),
  microbe: sym(<>
    <circle cx="10" cy="10" r="4.2" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
      <circle key={a} {...solid} r="1.1" cx={10 + 7.2 * Math.cos((a * Math.PI) / 180)} cy={10 + 7.2 * Math.sin((a * Math.PI) / 180)} />
    ))}
  </>),
  dropFill: sym(<path d="M10 2.5s-5.5 6-5.5 10a5.5 5.5 0 0 0 11 0c0-4-5.5-10-5.5-10z" fill="currentColor" />),
  ribbon: sym(<path d="M10 11c-2-2-3-4-3-6a3 3 0 0 1 6 0c0 2-1 4-3 6zm0 0l-4 6M10 11l4 6" />),
  thyroid: sym(<path d="M10 6c-1-3-6-3-6 1 0 3 2 5 4 6l2-2 2 2c2-1 4-3 4-6 0-4-5-4-6-1zM10 11v6" />),
  figureWalk: sym(<>
    <circle {...solid} cx="11" cy="3.3" r="1.8" />
    <path d="M10.5 7 9 12l-3 4.5M9 12l3 2 .5 3.5M10.5 7l-3 2.5V12M10.5 7l2.5 2.5h2.5" />
  </>),
  brainHeadProfile: sym(<>
    <path d="M12 18v-2.5h2a1.5 1.5 0 0 0 1.5-1.5v-2l1.5-.5-1.5-3A6.5 6.5 0 1 0 6 13.5V18" />
    <path d="M8.3 7.4a2 2 0 0 1 3.6-1.2 1.9 1.9 0 0 1 1.4 3 2 2 0 0 1-2.6 1.9 2 2 0 0 1-2.4-.8 1.7 1.7 0 0 1 0-2.9z" />
  </>),
  bubbleLeftAndBubbleRight: sym(<path d="M3 3.5h8a1.5 1.5 0 0 1 1.5 1.5v4.5A1.5 1.5 0 0 1 11 11H7l-3 2.5V11H3a1.5 1.5 0 0 1-1.5-1.5V5A1.5 1.5 0 0 1 3 3.5zM14.5 7H17a1.5 1.5 0 0 1 1.5 1.5V13a1.5 1.5 0 0 1-1.5 1.5h-.5V17l-3-2.5H10A1.5 1.5 0 0 1 8.5 13v-.5" />),
  eye: sym(<><path d="M2 10s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5z" /><circle cx="10" cy="10" r="2.2" /></>),
  figureAndChildHoldinghands: sym(<>
    <circle {...solid} cx="7" cy="3.3" r="1.8" />
    <circle {...solid} cx="14.5" cy="8.6" r="1.4" />
    <path d="M7 6.5v5.5M7 12l-1.5 5.5M7 12l1.5 5.5M7 7.5 4.5 11M7 7.5l5 4.5M14.5 11v3M14.5 14l-1 3.5M14.5 14l1 3.5M14.5 11.5 12 12" />
  </>),
  bedDouble: sym(<path d="M2 16.5v-6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6M2 13.5h16M3.5 8.5V5A1.5 1.5 0 0 1 5 3.5h10A1.5 1.5 0 0 1 16.5 5v3.5M5.5 8.5V7.3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.2M10.5 8.5V7.3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.2" />),
};

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

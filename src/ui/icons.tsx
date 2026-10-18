import type { ReactNode } from 'react';

// Simple line symbols, stand-ins for SF Symbols (the design system doesn't bundle them). Drawn on a 20pt grid.
const sym = (d: ReactNode, fill = false) => (
  <svg viewBox="0 0 20 20" fill={fill ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);

export const icons = {
  home: sym(<path d="M3 9l7-6 7 6v8a1 1 0 0 1-1 1h-4v-5H8v5H4a1 1 0 0 1-1-1z" />),
  bolt: sym(<path d="M11 2L4 11h5l-1 7 7-9h-5z" />),
  book: sym(<path d="M3 4h5a2 2 0 0 1 2 2v11a2 2 0 0 0-2-2H3zM17 4h-5a2 2 0 0 0-2 2v11a2 2 0 0 1 2-2h5z" />),
  books: sym(<path d="M4 3h3v14H4zM9 3h3v14H9zM13.5 4.2l2.9-.8 3 13.5-2.9.8z" />),
  gear: sym(<><path d="M16.1 8.8 L18.1 8.9 L18.1 11.1 L16.1 11.2 L15.2 13.4 L16.5 15.0 L15.0 16.5 L13.4 15.2 L11.2 16.1 L11.1 18.1 L8.9 18.1 L8.8 16.1 L6.6 15.2 L5.0 16.5 L3.5 15.0 L4.8 13.4 L3.9 11.2 L1.9 11.1 L1.9 8.9 L3.9 8.8 L4.8 6.6 L3.5 5.0 L5.0 3.5 L6.6 4.8 L8.8 3.9 L8.9 1.9 L11.1 1.9 L11.2 3.9 L13.4 4.8 L15.0 3.5 L16.5 5.0 L15.2 6.6Z" /><circle cx="10" cy="10" r="2.6" /></>),
  star: sym(<path d="M10 2.8l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L2.8 8.1l5-.7z" />),
  starFill: sym(<path d="M10 2.8l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L2.8 8.1l5-.7z" />, true),
  close: sym(<path d="M5 5l10 10M15 5L5 15" />),
  external: sym(<path d="M8 4h8v8M16 4l-9 9" />),
  back: sym(<path d="M12.5 4 6.5 10l6 6" />),
  calculator: sym(<><rect x="4" y="2" width="12" height="16" rx="2" /><path d="M7 6h6M7 10h1M12 10h1M7 14h1M12 14h1" /></>),
  criteria: sym(<path d="M5 4h10M5 8h10M5 12h6M5 16h4" />),
  interactions: sym(<><circle cx="7" cy="10" r="4.5" /><circle cx="13" cy="10" r="4.5" /></>),
  pill: sym(<><rect x="2" y="7" width="16" height="6" rx="3" /><path d="M10 7v6" /></>),
  pathway: sym(<><rect x="7" y="2" width="6" height="4" rx="1" /><rect x="2" y="14" width="6" height="4" rx="1" /><rect x="12" y="14" width="6" height="4" rx="1" /><path d="M10 6v4M5 14v-4h10v4" /></>),
  flask: sym(<path d="M8 2v6l-4 8a1.5 1.5 0 0 0 1.3 2h9.4a1.5 1.5 0 0 0 1.3-2l-4-8V2M7 2h6" />),
  // Systems
  heart: sym(<path d="M10 17s-7-4.3-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 17 8c0 4.7-7 9-7 9z" />),
  lungs: sym(<path d="M9 3v7M11 3v7M9 10c-2-3-6-2-6 3v3a2 2 0 0 0 3 1l3-2zM11 10c2-3 6-2 6 3v3a2 2 0 0 1-3 1l-3-2z" />),
  pulse: sym(<path d="M2 10h4l2-5 4 10 2-5h4" />),
  stomach: sym(<path d="M8 2v4c0 2-4 2-4 6a5 5 0 0 0 9 3c1-1.5 3-1 3-4 0-2.5-3-3-5-1-1 1-2 0-2-1V2" />),
  liver: sym(<path d="M3 8c0-3 4-4 8-4s6 1 6 3-3 3-5 5-4 4-6 4-3-4-3-8z" />),
  drop: sym(<path d="M10 3s-5 6-5 9.5a5 5 0 0 0 10 0C15 9 10 3 10 3z" />),
  bug: sym(<><ellipse cx="10" cy="11" rx="4" ry="5" /><path d="M10 6V3M6 9H3M14 9h3M6 14H3M14 14h3" /></>),
  cells: sym(<><circle cx="7" cy="8" r="4" /><circle cx="13" cy="13" r="4" /></>),
  ribbon: sym(<path d="M10 11c-2-2-3-4-3-6a3 3 0 0 1 6 0c0 2-1 4-3 6zm0 0l-4 6M10 11l4 6" />),
  gland: sym(<path d="M10 6c-1-3-6-3-6 1 0 3 2 5 4 6l2-2 2 2c2-1 4-3 4-6 0-4-5-4-6-1zM10 11v6" />),
  bone: sym(<path d="M6.5 5.5L14.5 13.5M5 3a2 2 0 0 0-1 3.5A2 2 0 0 0 6.5 8L8 6.5A2 2 0 0 0 6.5 4 2 2 0 0 0 5 3zM15 17a2 2 0 0 0 1-3.5 2 2 0 0 0-2.5-1.5L12 13.5a2 2 0 0 0 1.5 2.5A2 2 0 0 0 15 17z" />),
  brain: sym(<path d="M7 4a3 3 0 0 0-3 3 3 3 0 0 0 0 6 3 3 0 0 0 3 3V4zM13 4a3 3 0 0 1 3 3 3 3 0 0 1 0 6 3 3 0 0 1-3 3V4z" />),
  mind: sym(<><circle cx="10" cy="9" r="6" /><path d="M7.5 9.5c1 1.5 4 1.5 5 0" /><path d="M10 15v3" /></>),
  eye: sym(<><path d="M2 10s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5z" /><circle cx="10" cy="10" r="2.2" /></>),
  person: sym(<><circle cx="10" cy="6" r="3" /><path d="M4 18c0-4 3-6 6-6s6 2 6 6" /></>),
  bed: sym(<path d="M2 6v10M2 13h16v3M18 13v-2a3 3 0 0 0-3-3H9v5M5.5 11a1.5 1.5 0 1 0 0-.01" />),
};

// Each system's symbol and tile color (Settings-style tinted squares). Red is kept for emergencies.
export const systemIcon: Record<string, { icon: ReactNode; tint: string }> = {
  cardio: { icon: icons.heart, tint: 'var(--system-pink)' },
  pulm: { icon: icons.lungs, tint: 'var(--system-cyan)' },
  crit: { icon: icons.pulse, tint: 'var(--system-orange)' },
  gi: { icon: icons.stomach, tint: 'var(--system-mint)' },
  liver: { icon: icons.liver, tint: 'var(--system-brown)' },
  renal: { icon: icons.drop, tint: 'var(--system-teal)' },
  id: { icon: icons.bug, tint: 'var(--system-green)' },
  heme: { icon: icons.cells, tint: 'var(--system-purple)' },
  onc: { icon: icons.ribbon, tint: 'var(--system-indigo)' },
  endo: { icon: icons.gland, tint: 'var(--system-blue)' },
  rheum: { icon: icons.bone, tint: 'var(--system-gray)' },
  neuro: { icon: icons.brain, tint: 'var(--system-purple)' },
  psych: { icon: icons.mind, tint: 'var(--system-indigo)' },
  derm: { icon: icons.eye, tint: 'var(--system-orange)' },
  wh: { icon: icons.person, tint: 'var(--system-pink)' },
  hosp: { icon: icons.bed, tint: 'var(--system-blue)' },
  library: { icon: icons.books, tint: 'var(--system-indigo)' },
};
export const iconFor = (systemId: string) => systemIcon[systemId] ?? { icon: icons.book, tint: 'var(--system-gray)' };

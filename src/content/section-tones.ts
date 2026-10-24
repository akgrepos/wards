// The one place that says which tone each section name gets: a section keeps the same color on every card type that
// has it (owner, 2026-10-24). A color answers one question: danger (what can harm or kill), caution (where it goes
// wrong), watch (what to keep checking), technique (how to carry it out), note (pearls and caveats); everything else
// is neutral. Keys are the section keys in scripts/content/schema.mjs (for example `adjustment` is Dose Adjustment).
export type SectionTone = 'danger' | 'caution' | 'watch' | 'technique' | 'note' | 'neutral';

const TONES: Record<SectionTone, string[]> = {
  danger: ['contraindications', 'adverse-effects', 'complications', 'overdose', 'first-steps'],
  caution: [
    'adjustment', 'interactions', 'escalation', 'special-populations', 'limitations', 'troubleshooting', 'caveats', 'false-results',
    'pregnancy', 'abnormal', 'resistance', 'precautions', 'legal', 'class-cautions',
  ],
  watch: ['monitor', 'monitoring'],
  technique: ['administration', 'preparation', 'technique', 'practical'],
  note: ['pearls'],
  neutral: [],
};

const byKey = new Map<string, SectionTone>(
  (Object.entries(TONES) as [SectionTone, string[]][]).flatMap(([tone, keys]) => keys.map((k): [string, SectionTone] => [k, tone])),
);

export function sectionTone(key: string): SectionTone {
  return byKey.get(key) ?? 'neutral';
}

// Card types that show section tones so far. Other types follow one at a time, each checked on the phone first.
export const TONED_CARD_TYPES = ['medication'];

// Each section's own symbol (the DS's `symbol`), so no two sections on a card share one and none repeats an app symbol
// (the quote marks belong to Show Sources). Sections not listed use their tone's symbol.
const SYMBOLS: Record<string, string> = {
  'at-a-glance': 'list.bullet',
  indications: 'pills',
  adjustment: 'slider.horizontal.3',
  administration: 'syringe',
  contraindications: 'nosign',
  'adverse-effects': 'exclamationmark.triangle',
  interactions: 'arrow.left.arrow.right',
  monitor: 'eye',
  more: 'info.circle',
  pregnancy: 'figure.and.child.holdinghands',
  overdose: 'arrow.uturn.backward',
  evidence: 'book',
  pearls: 'lightbulb',
};
export const sectionSymbol = (key: string): string | undefined => SYMBOLS[key];

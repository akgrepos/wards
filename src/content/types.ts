// Shapes of the bundled content (produced by scripts/content/load.mjs).
export type Inline =
  | { t: 'text' | 'strong' | 'em'; v: string }
  | { t: 'insert'; kind: string; id: string }
  | { t: 'link'; id: string; section?: string | null; label: string | null }
  // A small label after a cause: [!cannot-miss], [!most-common].
  | { t: 'tag'; v: string };
export type ListItem = { inlines: Inline[]; sources: string[]; children: ListItem[] };
export type Block =
  | { t: 'paragraph'; inlines: Inline[]; sources: string[] }
  | { t: 'list'; items: ListItem[] }
  | { t: 'table'; header: Inline[][]; rows: { cells: Inline[][]; sources: string[] }[] }
  | { t: 'insert'; kind: string; id: string }
  | { t: 'subheading'; text: string }
  // Numbered steps (StepList): a title, then the step's own blocks.
  | { t: 'steps'; items: { inlines: Inline[]; sources: string[]; blocks: Block[] }[] }
  // :::scale (ScaleBar), :::compare (ComparisonGrid), :::times (TimePoints): "Label: text" items.
  // :::onset (a row that opens onset and duration side by side): {{dose:id}} items, or "Label: onset | lasts".
  | { t: 'scale' | 'compare' | 'times' | 'onset'; title: Inline[]; sources: string[]; items: ContainerItem[] };
export type ContainerItem = { text: string; label: Inline[]; inlines: Inline[]; sources: string[] };
export type Subsection = { key: string; title: string; description: string | null; blocks: Block[] };
export type Section = { key: string; title: string; blocks: Block[]; subsections: Subsection[] };
export type Card = {
  id: string; type: string; variant: string | null; system: string; group: string; subsection: string | null;
  title: string; aliases: string[]; related: Record<string, string[]>; example: boolean; sections: Section[];
  definition: { inlines: Inline[]; sources: string[] } | null; basedOn: string[]; reviewed: string | null;
};
export type System = { id: string; title: string; library?: boolean };
export type Source = { kind: string; short: string; title: string; year: number; society?: string; citation?: string; url?: string };
export type Dose = {
  drug?: string; drug_name: string; brand?: string; indication: string; population?: string; route: string;
  amount: string | number; unit: string; frequency?: string; rate?: string; give_when?: string; repeat?: string;
  onset?: string; lasts?: string; duration?: string; max?: string; boxed_warning?: string;
  alternative?: { dose: string; when?: string }; adjustments?: { when: string; change: string }[];
  cautions?: string[]; notes?: string; sources: string[];
};
export type Threshold = { name: string; value: string | number; unit: string; meaning?: string; sources: string[] };
export type Criteria = { name: string; short: string; logic?: string; items?: string[]; columns?: string[]; rows?: string[][]; notes?: string[]; sources: string[] };
export type PathwayStep = {
  kind: 'question' | 'checklist' | 'caution' | 'action' | 'result'; kindLabel?: string; stage?: string; title: string; detail?: string;
  answers?: { label: string; detail?: string; to: string }[]; items?: string[]; yes?: string; no?: string; logic?: string;
  next?: string; list?: string[]; note?: string; links?: string[];
};
export type Pathway = { title?: string; stages?: string[]; start: string; steps: Record<string, PathwayStep>; sources: string[] };
export type Content = {
  systems: System[];
  cards: Card[];
  data: { source?: Record<string, Source>; dose?: Record<string, Dose>; threshold?: Record<string, Threshold>; criteria?: Record<string, Criteria>; pathway?: Record<string, Pathway>; [k: string]: Record<string, unknown> | undefined };
};

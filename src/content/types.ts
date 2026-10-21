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
  // :::note (a brown Note box): 1–3 plain sentences.
  // :::times{after=… check=… unit=…}: the recheck times Timed Mode lists under Due Next.
  | { t: 'scale' | 'compare' | 'times' | 'onset' | 'note'; title: Inline[]; sources: string[]; items: ContainerItem[]; attrs?: Record<string, string> };
export type ContainerItem = { text: string; label: Inline[]; inlines: Inline[]; sources: string[] };
export type Subsection = { key: string; title: string; description: string | null; blocks: Block[] };
export type Section = { key: string; title: string; blocks: Block[]; subsections: Subsection[] };
export type Card = {
  id: string; type: string; variant: string | null; system: string; group: string; subsection: string | null;
  title: string; aliases: string[]; related: Record<string, string[]>; example: boolean; sections: Section[];
  definition: { inlines: Inline[]; sources: string[] } | null; basedOn: string[]; reviewed: string | null;
  // The "## Do Now" section, when the topic has an emergency (its page in the Rapids tab, and Timed Mode).
  emergency: { hint: string | null; blocks: Block[] } | null;
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
export type Threshold = { name: string; value: string | number; unit: string; note?: string; sources: string[] };
// A treatment combination for one indication (docs/DATA-TYPES.md, 3), built from dose items: options joined by "or";
// inside an option, parts given together ("plus"); a part that is a list means any one of those doses.
export type RegimenOption = { label?: string; when?: string; doses: (string | string[])[] };
export type Regimen = { name: string; indication?: string; setting?: string; options: RegimenOption[]; duration?: string; notes?: string[]; sources: string[] };
export type Criteria = { name: string; short: string; logic?: string; items?: string[]; columns?: string[]; rows?: string[][]; notes?: string[]; sources: string[] };
// A focused pathway (docs/DATA-TYPES.md, 9): a levelled flowchart on a grid; only questions branch; a line of text
// that is only {{dose:…}} shows the card's dose row.
export type PathwayAnswer = { label: string; detail?: string; at: [number, number]; span?: number; to: string };
export type PathwayNode = {
  kind: 'start' | 'question' | 'do' | 'urgent' | 'note' | 'result'; at: [number, number]; span?: number;
  title: string; text?: string | string[]; links?: string[]; answers?: PathwayAnswer[]; next?: string;
};
export type PathwayLevel = { title: string; row: number };
export type Pathway = { title: string; card: string; summary?: string; columns: number; start: string; levels?: PathwayLevel[]; nodes: Record<string, PathwayNode>; sources: string[] };
export type Content = {
  systems: System[];
  cards: Card[];
  data: { source?: Record<string, Source>; dose?: Record<string, Dose>; threshold?: Record<string, Threshold>; criteria?: Record<string, Criteria>; regimen?: Record<string, Regimen>; pathway?: Record<string, Pathway>; [k: string]: Record<string, unknown> | undefined };
};

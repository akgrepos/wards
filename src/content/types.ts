// Shapes of the bundled content (produced by scripts/content/load.mjs).
export type Inline =
  | { t: 'text' | 'strong' | 'em'; v: string }
  | { t: 'insert'; kind: string; id: string; label?: string }
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
  | { t: 'steps'; items: { inlines: Inline[]; sources: string[]; blocks: Block[]; alt?: boolean }[] }
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
  title: string; aliases: string[]; related: Record<string, string[]>; example: boolean; contentsSub: string[]; sections: Section[];
  definition: { inlines: Inline[]; sources: string[] } | null; basedOn: string[];
  // Who verified the card's doses, numbers and care-changing claims, when, and on what scope (shown as "Checked <date>"). Null until checked.
  // `fingerprint` is the hash of the card's clinical content when it was checked; `carried` is the reason when a later change was judged not to need a re-check.
  checked: { date: string; by: 'opus' | 'owner'; scope: string; fingerprint?: string | null; carried?: string | null } | null;
  // The "## Do Now" section, when the topic has an emergency (its page in the Rapids tab, and Timed Mode).
  emergency: { hint: string | null; blocks: Block[] } | null;
};
export type System = { id: string; title: string; library?: boolean; subsections?: string[] };
export type Source = { kind: string; short: string; title: string; year: number; society?: string; citation?: string; url?: string };
export type Dose = {
  drug?: string; drug_name: string; brand?: string; indication: string; indication_detail?: string; population?: string; route: string;
  amount: string | number; unit: string; frequency?: string; rate?: string; give_when?: string; repeat?: string;
  onset?: string; lasts?: string; duration?: string; max?: string; boxed_warning?: string;
  alternative?: { dose: string; when?: string }; adjustments?: { when: string; change: string }[];
  cautions?: string[]; notes?: string; sources: string[];
};
// A calculator or score on MDCalc (docs/DATA-TYPES.md, 12b), linked from every sentence that names it.
export type CalcBand = { label: string; range: string; from?: number; to?: number; risk?: string; action?: string; high?: boolean };
export type CalcBandSet = { title?: string; bands: CalcBand[] };
export type CalcInput = { id: string; label: string; unit: string; min: number; max: number; optional?: boolean };
export type CalcResultDef = { fn: string; label: string; unit: string; decimals: number; needs: string[] };
// The in-app calculator of a score (a checklist with points and bands) or a formula (docs/DATA-TYPES.md, 7).
export type Calculator = {
  kind: 'checklist' | 'formula'; heading: string; notes?: string[];
  with?: string; items?: { label: string; points: number }[]; bandSets?: CalcBandSet[];
  expression?: string; inputs?: CalcInput[]; results?: CalcResultDef[]; reference?: string;
};
export type Calc = { name: string; short: string; url: string; match: string[]; sources?: string[]; calculator?: Calculator };
export type Threshold = { name: string; value: string | number; unit: string; note?: string; sources: string[] };
// A treatment combination for one indication (docs/DATA-TYPES.md, 3), built from dose items: options joined by "or";
// inside an option, parts given together ("plus"); a part that is a list means any one of those doses.
export type RegimenOption = { label?: string; when?: string; doses: (string | string[])[] };
export type Regimen = { name: string; indication?: string; setting?: string; options: RegimenOption[]; duration?: string; notes?: string[]; sources: string[] };
export type Criteria = { name: string; title: string; short: string; logic?: string; items?: string[]; columns?: string[]; rows?: string[][]; layout?: 'columns' | 'stacked'; tones?: ('yellow' | 'orange' | 'red')[]; notes?: string[]; sources: string[] };
// A focused pathway (docs/DATA-TYPES.md, 9): a levelled flowchart on a grid; only questions branch; a line of text
// that is only {{dose:…}} shows the card's dose row.
export type PathwayAnswer = { label: string; detail?: string; at: [number, number]; span?: number; to: string };
export type PathwayNode = {
  kind: 'start' | 'question' | 'do' | 'urgent' | 'note' | 'result'; at: [number, number]; span?: number;
  title: string; text?: string | string[]; links?: string[]; answers?: PathwayAnswer[]; next?: string;
};
export type PathwayLevel = { title: string; row: number };
export type Pathway = { title: string; card: string; summary?: string; columns: number; start: string; levels?: PathwayLevel[]; nodes: Record<string, PathwayNode>; sources: string[] };
// An ECG figure (docs/DATA-TYPES.md, 11. Media). Times in seconds of the recording (or panel); voltages in mV.
export type EcgMark = {
  kind: 'interval' | 'band' | 'baseline' | 'height' | 'text';
  from?: number; to?: number; at?: number; low?: number; high?: number; mv?: number; from_mv?: number; to_mv?: number;
  label?: string; place?: 'above' | 'below' | 'below2'; align?: 'start' | 'middle' | 'end';
};
type MediaBase = { title: string; alt: string; caption: string; illustrates: string; sources: string[] };
// A recording from an open dataset: the leads kept (samples in 0.01 mV, as one string each) and the part the card shows.
export type EcgRecording = MediaBase & {
  kind: 'ecg';
  recording: { dataset: string; record: string; rate: number; leads: Record<string, string> };
  show: { lead: string; from: number; to: number; smooth?: number };
  marks?: EcgMark[];
};
// Drawn ECGs: each panel is one or more beats made of smooth bumps, or a sine wave.
export type EcgDrawing = MediaBase & {
  kind: 'ecg-drawing';
  panels: { title: string; cue?: string; seconds: number; beats?: number[]; waves?: [number, number, number][]; sine?: { mv: number; period: number; phase?: number }; marks?: EcgMark[] }[];
};
export type Media = EcgRecording | EcgDrawing;
// A coverage grid (docs/DATA-TYPES.md, 10): items by organism groups; each cell is R (reliable), V (variable) or N (none).
export type CoverageLevel = 'R' | 'V' | 'N';
export type CoverageColumn = { id: string; name: string; short: string };
export type CoverageRow = { drug: string; class: string; cells: Record<string, CoverageLevel>; note: string; cp_cells?: string[]; sources: string[] };
export type CoverageGrid = { title: string; levels: Record<CoverageLevel, { word: string; meaning: string }>; columns: CoverageColumn[]; rows: CoverageRow[]; sources: string[] };
// Rows for search, built with the content (scripts/content/search-index.mjs); card indexes point into Content.cards.
export type SearchIndex = {
  sections: [cardIndex: number, key: string, title: string, parentTitle: string][];
  drugs: [name: string, brands: string, cardIndex: number, key: string, title: string, drugId: string][];
  tools: [id: string, name: string, short: string, others: string, cardIndexes: number[]][];
};
export type Content = {
  systems: System[];
  cards: Card[];
  search?: SearchIndex;
  data: { source?: Record<string, Source>; dose?: Record<string, Dose>; threshold?: Record<string, Threshold>; calc?: Record<string, Calc>; criteria?: Record<string, Criteria>; regimen?: Record<string, Regimen>; pathway?: Record<string, Pathway>; media?: Record<string, Media>; coverage?: Record<string, CoverageGrid>; [k: string]: Record<string, unknown> | undefined };
};

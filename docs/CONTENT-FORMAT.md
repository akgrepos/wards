# Content format

How cards and shared data are written. The rules behind it are in `CARD-TYPES.md` and `DATA-TYPES.md`; `npm run content:check` enforces them on every pull request.

## Where things live
- `content/systems.yaml`: the 16 systems and the Library, in display order (quote titles that contain commas).
- `content/cards/<system>/<card-id>.md`: one file per card.
- `content/data/<type>/<item-id>.yaml`: one file per shared data item. Types so far: `source`, `dose`, `threshold`, `criteria`, `pathway`. A `criteria` item (a formal definition or staging system) has `name`, `short` (the words shown when it's inserted in a sentence), optional `logic` ("Any of:"), `items`, `columns` and `rows` (a table), `notes`, and `sources`. On a line of its own it shows in full; inside a sentence it shows its `short` name and opens in a sheet. Dose fields: `DATA-TYPES.md`.
- `content/examples/`: development-only samples (placeholder content). They appear while developing and are never in the published app.

## A card file
```markdown
---
id: renal-hyperkalemia          # permanent, from the topic list
type: condition                 # condition · approach · reference · procedure · medication · score · exam · test
variant: protocol               # only for types with variants (reference, medication)
system: renal
title: Hyperkalemia
aliases: [high potassium]       # search only
subsection: Electrolyte Disorders # condition cards only: the topic group within the system
definition: "Commonly K⁺ ≥5.5 mEq/L. ^[kdigo-acute-hyperkalemia-2020]"  # one line under the title, with its source
based_on: [ukka-hyperkalaemia-2026]   # optional: the guidelines the page rests on (not shown in the app)
reviewed: 2026-10-17            # last full review (shown as "Reviewed Oct 2026")
related:
  differential: [renal-pseudohyperkalemia]
  conditions: [renal-aki]
  tools: []
  medications: []
---
## At a Glance
- One idea per bullet, 3–6 bullets. ^[source-id]

## Severity
:::scale K⁺
- Mild: {{threshold:k-mild}} ^[source-id]
- Severe: {{threshold:k-severe}} ^[source-id]
:::

## Treatment
{{pathway:hyperkalemia-management}}

1. Cardiac membrane stabilization
   - ECG changes: IV calcium gluconate. ^[source-id]

   {{dose:calcium-gluconate-hyperkalemia}}

2. Intracellular shift
   - A sourced line. ^[source-id]

## Monitor
:::times K⁺ at least at these times ^[source-id]
- 1 h
- 24 h
:::

## More Information
### Where Guidelines Differ: Insulin dose
:::compare Insulin dose
- KDIGO 2020: What it says. ^[source-id]
- UK guideline 2026: What it says. ^[source-id]
:::

### Epidemiology and Pathophysiology: Who gets it
- A sourced line. ^[source-id]

## Pearls
- A sourced pearl. ^[source-id]
```

- Condition and approach cards need `definition` and `reviewed`. `based_on` is optional and not shown (the "Based on" line was removed 2026-10-18); All Sources includes it and the definition's sources.
- Related and Sources are added by the app; don't write them as sections.

## Rules the check enforces
- Section headings (`##`) are exactly the card type's sections (`CARD-TYPES.md` Part 2), in their fixed order; At a Glance is required and has 3–6 bullets.
- `###` headings appear only inside More Information and are its subsections, in their fixed order. `### Title: description` adds a short description (60 characters at most) shown while the row is closed. More Information holds nothing outside its subsections.
- Every line of content ends with `^[source-id, …]`, unless it is only an insert (inserts carry their own sources). This includes Pearls, the definition, and each `:::scale` / `:::compare` item and `:::times` title. A sub-bullet without its own source uses its parent line's.
- **Doses go on a line of their own** (`{{dose:id}}`), never inside a sentence, so each shows as one dose row. Doses never appear as typed text (for example "40 mg"). Concentrations such as `mmol/L` are fine.
- Inserts (`{{type:id}}`), links (`[[card-id]]`, `[[card-id|label]]` or `[[card-id/section|label]]`), the linked section, related cards and `based_on` sources must exist. Tags are `[!cannot-miss]` or `[!most-common]`.
- `:::scale` has 2–5 bands, `:::compare` 2–3 columns (both "Label: text"), `:::times` 1–12 times, `:::onset` 2–12 items: each `{{dose:id}}` (the dose needs an `onset` like "About 15 minutes") or `Name: onset | lasts ^[source]` for something that isn't a dose (e.g. `Hemodialysis: Immediate | Variable`).
- Data items have their required fields, sources that exist, and US units; dose items use only the fields in `DATA-TYPES.md`.

## Formatting inside sections
- Bullets (`- `, one nesting level: indent sub-bullets two spaces under a lead-in line ending in a colon), paragraphs, tables (`| … |`; a row's sources go at the end of the row; the first column stays in place when the table scrolls), `####` subheadings.
- Numbered steps: `1. Step title`, then the step's own content indented by three spaces (bullets, dose lines, tables). Blank lines inside a step are fine; content after the steps starts unindented.
- `:::scale Title` (severity bands, least to most severe), `:::compare Title` (statements that differ, side by side), `:::times Title` (recheck times on a timeline), `:::onset Title` (a row that opens onset and duration side by side, fastest first), each closed by `:::`.
- Links go inside the sentence: `[[renal-hyperkalemia|hyperkalemia]]`, not "hyperkalemia ([[renal-hyperkalemia]])". `[[card-id/section|label]]` opens a page at a section; on the same page it just scrolls there.
- Causes in a condition card: one list, `- **Category:** causes ^[source]`; mark one with `[!cannot-miss]` after the colon.
- `**bold**`, `*italic*`.
- A line that is only `{{pathway:id}}` shows the interactive flowchart there; a line that is only `{{criteria:id}}` shows the criteria in full.

## In the app
- Each card has its own link: `#/card/<card-id>`; `#/card/<card-id>/<section>` opens the page at that section or More Information subsection (opening it if closed). Works offline and when opened directly.
- Sections open and close from their headings; the phone remembers which are closed and where each page was scrolled.
- One source line ends each section; tapping it lists that section's sources with View Citation links.
- Inserts read like normal text; tapping one opens its details. Dose rows open the dose sheet.

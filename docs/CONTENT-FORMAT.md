# Content format

How cards and shared data are written. The rules behind it are in `CARD-TYPES.md` and `DATA-TYPES.md`; `npm run content:check` enforces them on every pull request.

## Where things live
- `content/systems.yaml`: the 16 systems and the Library, in display order (quote titles that contain commas).
- `content/cards/<system>/<card-id>.md`: one file per card.
- `content/data/<type>/<item-id>.yaml`: one file per shared data item. Types so far: `source`, `dose`, `threshold`, `pathway`.
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
subsection: Potassium Disorders # condition cards only: the topic group within the system
related:
  differential: [renal-pseudohyperkalemia]
  conditions: [renal-aki]
  tools: []
  medications: []
---
## Key points
- One idea per bullet, 3–6 bullets. ^[kdigo-2024]

## Epidemiology and risk factors
### Summary
One line shown while the section is collapsed.

- A sourced line. ^[source-id]

## Diagnostic evaluation
- A line with an inserted threshold: {{threshold:k-emergency}}. ^[source-id]

{{pathway:hyperkalemia-workup}}

### More detail on testing
- Detail behind a "Show Detail on Testing" button. ^[source-id]
```

## Rules the check enforces
- Section headings (`##`) are exactly the card type's sections, in their fixed order; Key points is required.
- Every line of content ends with `^[source-id, …]`, unless it is only an insert (inserts carry their own sources). This includes Pearls and pitfalls and section summaries.
- Doses never appear as typed text (for example "40 mg"): insert them with `{{dose:id}}`. Concentrations such as `mmol/L` are fine.
- Inserts (`{{type:id}}`), links (`[[card-id]]` or `[[card-id|label]]`) and related cards must exist.
- Data items have their required fields, sources that exist, and US units.

## Formatting inside sections
- Bullets (`- `, one nesting level), paragraphs, tables (`| … |`; a row's sources go at the end of the row), `####` subheadings.
- `**bold**`, `*italic*`.
- A line that is only `{{pathway:id}}` shows the interactive flowchart there.

## In the app
- Each card has its own link: `#/card/<card-id>` (works offline and when opened directly).
- Inserts read like normal text; tapping one opens its details. Source pills open the full citation in a sheet.

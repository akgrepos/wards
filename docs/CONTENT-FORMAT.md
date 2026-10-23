# Content format

How cards and shared data are written. The rules behind it are in `CARD-TYPES.md` and `DATA-TYPES.md`; `npm run content:check` enforces them on every pull request.

## Where things live
- `content/systems.yaml`: the 16 systems and the Library, in display order (quote titles that contain commas).
- `content/cards/<system>/<card-id>.md`: one file per card.
- `content/data/<type>/<item-id>.yaml`: one file per shared data item. Types so far: `source`, `dose`, `threshold`, `criteria`, `regimen`, `pathway`. A `criteria` item (a formal definition or staging system) has `name`, `title` (required: what the box defines plus the year of one of its cited sources, written "SIADH diagnostic criteria, 2013"; the content check enforces both), `short` (the words shown when it's inserted in a sentence), optional `logic` ("Any of:"), `items`, `columns` and `rows` (a table), `layout` (`columns` by default, or `stacked`) with `tones` (a staging or severity table: `stacked` plus one of `yellow`, `orange`, `red` per row, in order; the data sets the color, never the column name), `notes`, and `sources`. On a line of its own it shows in full (items in an indigo Criteria box; a `layout: stacked` table as tinted severity bands; notes in a brown Note box); inside a sentence it shows its `short` name and opens in a sheet. Dose fields: `DATA-TYPES.md`.
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

## Contents sub-level (optional)
A card can list the `####` subheadings of a section in its Contents menu, one level down, always shown (no expand or collapse): add `contents_sub: [dosing]` to the front matter (the section keys; the content check rejects an unknown section or one with no subheadings). Each row jumps to its heading and opens the section if it was closed. Electrolyte Repletion uses it for Dosing and Protocol (Potassium, Magnesium, Phosphate, Calcium). Other cards are unchanged.

## An emergency (Do Now)
A condition or approach topic that is also an emergency has a `## Do Now` section, written **before** At a Glance, and a one-line `emergency_hint` in the front matter (50 characters at most, shown under its name in Rapids). It lives in the topic's file (one home) and uses the topic's own dose items; it is not one of the page's sections. It becomes the emergency's page in the Rapids tab, the pop-up behind the topic page's red Rapids button, and the steps of Timed Mode.

```markdown
emergency_hint: Calcium, insulin-dextrose, remove K⁺   # in the front matter
---
## Do Now
1. Stabilize the myocardium
   - If: ECG changes ^[source-id]
   - Check: STAT 12-lead ECG at {{threshold:k-ecg-monitoring}}. ^[source-id]

   {{dose:calcium-gluconate-hyperkalemia}}

   - Repeat if ECG changes persist or recur. ^[source-id]
2. Shift K⁺ into cells
   {{dose:insulin-regular-hyperkalemia}}

   - Warning: Hypoglycemia ^[source-id]

:::note
- A caveat about the whole emergency. ^[source-id]
:::

## At a Glance
```

- 2–8 numbered steps, each with a short name ("Shift K⁺ into cells"). Inside a step, every line is one of:
  - `- If: …` the condition line ("If ECG changes"); at most one, first.
  - `- Check: …` what to check before giving (shown in an orange Check box).
  - `{{dose:id}}` a dose, one drug per row, in the order they're given. A dose's `alternative` (e.g. calcium chloride in arrest) shows under it automatically.
  - `- Warning: …` one to three words, shown as a warning tag on the dose row above it.
  - `- …` a short note.
- After the steps, only `:::note` boxes. Every line needs its source, as everywhere else; no doses typed as text.
- **Due Next in Timed Mode** comes from the topic's own recheck times: give a `:::times` block `{after=… check=…}`: `after=first` (from the first dose given) or `after=<dose-id>` (from that dose, which must be in Do Now), `check=` what is rechecked, and `unit=min` or `unit=h` when the times are bare numbers. For example `:::times{after=insulin-regular-hyperkalemia check=Glucose unit=min} Glucose after insulin-dextrose, minutes ^[source-id]`.

## Rules the check enforces
- Section headings (`##`) are exactly the card type's sections (`CARD-TYPES.md` Part 2), in their fixed order; At a Glance is required and has 3–6 bullets.
- `###` headings appear only inside More Information and are its subsections, in their fixed order. `### Title: description` adds a short description (60 characters at most) shown while the row is closed. More Information holds nothing outside its subsections.
- Every line of content ends with `^[source-id, …]`, unless it is only an insert (inserts carry their own sources). This includes Pearls, the definition, and each `:::scale` / `:::compare` item and `:::times` title. A sub-bullet without its own source uses its parent line's.
- **Doses go on a line of their own** (`{{dose:id}}`), never inside a sentence, so each shows as one dose row. Doses never appear as typed text (for example "40 mg"). Concentrations such as `mmol/L` are fine.
- Inserts (`{{type:id}}`), links (`[[card-id]]`, `[[card-id|label]]` or `[[card-id/section|label]]`), the linked section, related cards and `based_on` sources must exist. Tags are `[!cannot-miss]` or `[!most-common]`.
- `:::scale` has 2–5 bands, `:::compare` 2–3 columns (both "Label: text"), `:::note` 1–3 lines, `:::times` 1–12 times, `:::onset` 2–12 items: each `{{dose:id}}` (the dose needs an `onset` like "About 15 minutes") or `Name: onset | lasts ^[source]` for something that isn't a dose (e.g. `Hemodialysis: Immediate | Variable`).
- Data items have their required fields, sources that exist, and US units; dose and regimen items use only the fields in `DATA-TYPES.md`; every dose and in-app calculator has a `verification` note (`DATA-TYPES.md`, "Verification note"); a regimen's options list doses that exist and its words carry no typed doses.
- An emergency (`## Do Now`) follows the format above: topics only, a short `emergency_hint`, 2–8 steps that each do something, `If:` first and once, warnings of one to three words, only `:::note` after the steps; `:::times{…}` settings name a dose in Do Now (or `first`), what is checked, and readable times.

## Consistency rules (checked by `npm run content:check`)
These keep 150+ cards one app. **Errors** fail the check; **warnings** print but never fail it.
- **Aliases (error).** An alias belongs to one card (case ignored); keep it on the best card or make it more specific ("PERC rule" not "PERC"). A card with over 30 aliases gets a warning (alias bloat).
- **Subsections (error).** A condition card's `subsection` must be one of its system's names in `content/systems.yaml` (`subsections:` list). To use a new name, add it there first (one name per idea, no near-duplicates). Example cards are exempt.
- **Causes tags (error).** `[!cannot-miss]` and `[!most-common]` go only on causes inside the Causes section, and a cause category is never named "Cannot miss" or "Most common" (name it by what the causes are, for example "Life-threatening causes").
- **Table width (error).** A table has at most four columns. A wider one needs an owner-approved exception listed in `WIDE_TABLE_EXCEPTIONS` in `scripts/content/schema.mjs` (card id and section title). Today: IV Fluids "Choosing an Option" (six columns). The criteria `layout: stacked` is for criteria data only, not card tables.
- **Planned links (warning).** `[[card-id]]` to a card that doesn't exist yet is allowed; the check lists it as a warning and the app shows it as plain words (no tap target) until the card is written. `related:` entries, `based_on` and section names must still exist.
- **Related cards (warning).** If A lists B under `related`, B should list A back.
- **Unused sources (warning).** A source file no card or data item cites; delete it if it is orphaned.
- **Review date (warning).** `reviewed:` older than 12 months.
- **Do Now doses (warning).** A dose in `## Do Now` that does not also appear in the card's Treatment section (as a `{{dose:…}}`, or inside a `{{regimen:…}}` there).
- **No semicolons (error).** No semicolon in card or data text (an entity such as `&amp;`, a web address, a comment and a source's `citation` are not text). A list becomes a lead-in line ending in a colon with sub-bullets (each keeps the line's source), a clause join becomes two sentences. A table cell has no line break, so a list in a cell is written as short sentences. Example: `- Severe: add albuterol; never alone. ^[src]` becomes `- Severe: add albuterol. Never alone. ^[src]`.
- **Sources go at the end (error).** One `^[id, id]` marker, at the end of a line, bullet, paragraph or table row (inside the last cell, before the final `|`). Never between table cells or mid-sentence: the app shows it as plain text. A row that two sources support lists both in its one marker. The check rejects any `^[` or source id left in displayed text.
- **Symbols in tables (owner, 2026-10-23).** To save space, table cells use one symbol per meaning, app-wide: `↑` high, raised, elevated, increased. `↓` low, decreased, below the reference range. `=` normal or unchanged. `↕` variable, can go either way (not `↔`, which reads as "no change" and clashes with `=`). `<` `>` `≤` `≥` for less than, greater than, at most, at least (`<100 ng/mL`, `BMI ≥40`, not "below 100" or "40 or more"). Combine with "or": `= or ↑`, `↓ or =`. Only where the word means a direction against a reference range or a number: never for "low-risk", "low-dose", "high bleeding risk", "high-gap" or other names, and not in prose or bullets (tables only). They are real text characters, so VoiceOver reads them ("up arrow", "equals", "less than"). Never `≈` for normal. A table that uses them needs no key.
- There is deliberately no length or density limit: cards keep the terse clinical register.

## Formatting inside sections
- Bullets (`- `, one nesting level: indent sub-bullets two spaces under a lead-in line ending in a colon), paragraphs, tables (`| … |`; a row's sources go at the end of the row; the first column stays in place when the table scrolls), `####` subheadings.
- Alternatives: a step written `or. Step title` (instead of a number) is a different choice for the step above it, not the next step. It shows an outlined "or" and doesn't use up a number (3, or, 4). Use it when two steps are alternatives by situation (for example DKA versus HHS insulin), never for a sequence.
- Numbered steps: `1. Step title`, then the step's own content indented by three spaces (bullets, dose lines, tables). Blank lines inside a step are fine; content after the steps starts unindented.
- `:::note` … `:::` (1–3 lines, each `- sentence ^[source]`): a brown box labelled Note, for notes and caveats about the content just above it.
- `:::scale Title` (severity bands, least to most severe; always stacked, level name over its detail), `:::compare Title` (statements that differ, side by side), `:::times Title` (recheck times on a timeline), `:::onset Title` (a row that opens onset and duration side by side, fastest first), each closed by `:::`.
- Links go inside the sentence: `[[renal-hyperkalemia|hyperkalemia]]`, not "hyperkalemia ([[renal-hyperkalemia]])". `[[card-id/section|label]]` opens a page at a section; on the same page it just scrolls there.
- Causes in a condition card: one list, `- **Category:** causes ^[source]`; mark one with `[!cannot-miss]` after the colon.
- `**bold**`, `*italic*`.
- A line that is only `{{regimen:id}}` shows the regimen box (options, dose rows, duration); regimens are never inserted inside a sentence. Fields: `DATA-TYPES.md`, Regimen.
- A line that is only `{{media:id}}` shows an ECG figure (caption, measurements, credit; tap for full screen), placed right under the line it illustrates. Its fields: `DATA-TYPES.md`, 11. Media.
- **Scores and calculators link to MDCalc.** Every score, rule or calculator named in a card, Do Now step, regimen, criteria set or pathway box is written `{{calc:id}}` inside the sentence (never on a line of its own). It shows the calculator's `short` name; to keep other words, such as a capital letter, write `{{calc:anion-gap|Anion gap}}`. Each calculator is one file, `content/data/calc/<id>.yaml` (fields: `DATA-TYPES.md`, 12b), so an address is typed once. **When MDCalc has a page for a score or calculator, the card must link it:** the content check fails on any `match` word (for example `CURB-65`, `anion gap`) that appears without its `{{calc:…}}`. To link something new, add its file (open the MDCalc page first and copy its address; never guess one). Not linked: MAP and BMI, and words inside dose sheets.
- A line that is only `{{criteria:id}}` shows the criteria in full. Cards never insert a pathway: each of a card's pathways shows as a row under its title, found through the pathway's `card` field (the content check rejects `{{pathway:…}}`).

## Scores, criteria and formulas

Owner rules, 2026-10-21 (DECISIONS "Scores, criteria and formulas").
- **Definitions, criteria and staging** (they name a diagnosis or stage: KDIGO AKI stages, Sepsis-3, DKA severity, SIADH) are always in the app, on the card, in a box with a title saying what it defines and the source year.
- **Scores** (add points, map to a risk: CHA₂DS₂-VASc, CURB-65, Wells, PERC, HEART) get an MDCalc link wherever named. **Formulas** (serum osmolality, anion gap, corrected sodium, A–a gradient) are treated the same way.
- A score or formula also gets an **in-app version** only if it passes all four: short (seven items or fewer, or one formula); stable (unlikely to change, one citable primary source); used often at the bedside; offline matters (MDCalc needs signal). The in-app version is a simple interactive calculator (tap criteria for a running total and risk band, or enter numbers for a result), opened from the titled criteria box and kept only while open. Interactive calculators are limited to scores and formulas, and none is built without the owner's OK.
- Each item is stored once with its MDCalc URL and inserted wherever named. Starter list (approved): serum osmolality, anion gap, corrected sodium, CURB-65, Wells DVT and PE.

## Pathways
One file per pathway in `content/data/pathway/<id>.yaml` (example: `content/examples/data/pathway/example-workup.yaml`). A pathway is a short decision tree for one sequential task on its card: diagnostic (a workup), treatment, or mixed; a card may have several. Boxes may end in a diagnosis, a next test or a treatment. Its words come from the card.
- Top: `title` (the task, e.g. "Workup", "Treatment"; shown as "Card: Title"), `card`, `summary` (one line for its rows), `columns` (grid width), `start`, `sources`. (`levels` is still accepted from older files but no longer shown, 2026-10-21.)
- `nodes`, each with `kind`, `at: [column, row]` and optional `span` (columns wide; no two boxes share a cell):
  - `start`, `do`, `urgent` (red, Treat Now), `note`: `title`, optional `text` (one line or a list of lines), up to two `links`, and `next`.
  - `question`: the only kind that branches; shown as a short heading (its `text` and `links` sit under it). `answers`, each `{ label, at, to }` with optional `detail` (a second line in the button) and `span`. Put a question's answers side by side in the row **below** it; each leads to another question or to a box (a decision points to more decisions or to a specific action).
  - `result`: ends a route (no `next`).
- Doses: a text line that is only `{{dose:id}}` shows that dose row; it must be a dose the card itself shows. Thresholds may be inserted in text. No `[[…]]` links in text (use `links:`).
- Links: `section:<card>/<section>[#anchor]` (anchor = a subheading, a numbered step's title, or a More Information subsection key, as a slug), `criteria:<id>`, `dose:<id>`, `card:<id>`, `emergency:<id>`, optional `|label`. Their words come from the content.
- Lines run down: a line leaves a box at its bottom middle, turns once in the gap just above the box it points to and enters at its top middle, so lines into one box join at one point. Place boxes so a line never has to pass through another box: keep the column under each box clear down to where its line turns (e.g. a box that skips the next row sits where that row is empty).
- The content check: known fields only, every link resolves, boxes inside the grid and not overlapping, every box reachable from the start, routes end in a result, doses only from the card, at most two links per box.

## In the app
- A value is dotted and tappable only when its pop-up shows something the line can't: a cutoff's `note` (a caveat, population or condition the line doesn't state), a criteria set's full criteria, a dose's details. Repeating the value, its label, its unit, what it means or its source doesn't count. Plain text: cutoffs without a `note`, and every value in a table cell or a `:::scale`. The content check enforces this (see DATA-TYPES.md, Threshold).
- Each card has its own link: `#/card/<card-id>`; `#/card/<card-id>/<section>` opens the page at that section or More Information subsection (opening it if closed). Works offline and when opened directly.
- Sections open and close from their headings; the phone remembers which are closed and where each page was scrolled.
- The quote-mark button at the top shows one source pill at the end of every line (off when a page opens). A pill names the line's first source and "+N"; tapping it quotes the line and lists its sources. Tables get the pill at the end of each row; a sub-bullet without its own sources gets none.
- Tables are gray with a "Table" label; staging rows use the severity ramp (yellow, orange, red).
- Inserts read like normal text; tapping one opens its details. Dose rows open the dose sheet.

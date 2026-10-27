# Card-writing cheat sheet

Everything for writing or fixing a card, in one file. Part 1 is the short version. Part 2 is the full reference for file syntax. For sections per card type see [CARD-TYPES.md](CARD-TYPES.md), for data fields [DATA-TYPES.md](DATA-TYPES.md). `npm run content:check` enforces most of it, and the live card `#/example` shows each block once.

# Part 1: The short version

## Files
- Card: `content/cards/<system>/<card-id>.md` (front matter: `id`, `type`, `variant`, `system`, `title`, `aliases`, `subsection` (topic), `definition` with source, `checked`, `related`).
- Shared data: `content/data/<type>/<id>.yaml` (source, dose, threshold, criteria, regimen, pathway, calc, media). Each fact has one home; cards insert it, never retype it.
- Every dose, and every calc with a `calculator` block, ends with a `verification:` note (`read`: fda-label, full-text, abstract, common-practice or not-verified; `source`; `date`). Say how it was really read; DATA-TYPES "Verification note".

## Types and sections (`##`, exact names, fixed order)
- **Topic** (a condition, or a symptom or abnormal result): At a Glance (3-6 bullets) · Definition and Staging · First Steps (symptom or result topics) · Severity · Causes · Presentation · Diagnosis · Treatment · Monitor · Escalation · More Information · Pearls · Related · Sources. Use only the sections the card needs; the order never changes. Give it a `subsection` to list it under that group; without one it is listed under Approach.
- **Reference** (variants: interpretation, protocol, chart), **medication** (single drug or class; class cards have no doses): see CARD-TYPES Part 2. A new kind of card (procedure, score, exam, test) stops and asks the owner.
- `###` headings only inside More Information (fixed subsections; `### Title: short description`, at most 60 characters).
- Emergencies: a `## Do Now` page (2-8 steps, `If:` first and once); see Part 2, "An emergency (Do Now)".

## Writing style (content:check: errors, for every card)
- A bullet is one idea: at most two sentences and about 160 characters. Longer: split it, or a lead-in with sub-bullets.
- Tables: at most 3 columns, every cell under about 25 characters. A wider comparison is a `:::compare` block.
- Titles are at most 32 characters. A `related` link goes both ways. An alias that is a number is written in quotes.
- Parallel items each get their own bullet in the same shape (for example every cause is `- **Category:** causes`; every criterion has the same pattern).
- No several cases joined in one bullet ("X in A; Y in B; Z in C"): one bullet per case.
- One idea per bullet.
- The same wording for the same kind of item across cards (the same phrase for a monitoring line, a contraindication, a when-to-escalate line).
- Titles name the condition only ("Acute Coronary Syndrome"); the other names are search aliases.
- A severity ladder or risk-level table is always a `:::scale` block (least to most severe, one band per level). Never nested bullets or a gray table. Tones (`layout: stacked`) exist only in shared criteria files.
- Card text never names a guideline, society or study (for example "per ACEP" or "NICE says"). The `^[id]` source markers carry the attribution. Criteria and score names stay (Hunter criteria, Sepsis-3, CURB-65).

## Say the action (owner-approved 2026-10-26)
Cards are resident-level and executable: a reader can place the order from the line. Where each fact lives: CARD-TYPES Part 2, "One home for each kind of fact".
1. Name the actual order, drug, route or action, never a category. Labs by name (CBC, BMP, hepatic function panel, POCT glucose, TSH, B12, folate, ammonia). Drug levels by drug. Imaging by modality and contrast. LP with the CSF studies listed. Drugs by name, never "medication".
2. One independent action per line. A list is a lead-in ending in a colon with one item per sub-bullet.
3. Initial orders first, then conditional orders, each with its trigger.
4. Section grammar. Causes: nouns. Diagnosis: the order, then what a result changes. Treatment: intervention, who, drug, route, timing, pre-start checks, next step if it fails. Monitor: What, When, Action. Escalation: trigger, named service, what to have ready.
5. Intervals (q6h, daily) appear only when sourced. No "frequently". If it truly varies, give the trigger.
6. No filler: no sentences about who does the work, no linking commentary, no "evidence suggests".
7. Treatment lines start with the action or the "if" condition.
8. Header definition: what it is and what separates it from lookalikes. No causes, no treatment.
9. Links: link the first mention in a section of anything with a live card (with the section when useful), not every repeat. A card not yet written stays plain text.
10. Sentence case for step titles, scale band names, table headings and "Label: text" lines. Table headings are short nouns with no end punctuation. A table says what it compares and for which patients (caption).
11. **Drug choices (owner-approved 2026-10-27).** When a drug has alternatives, Treatment lists the first-line drug, then the alternative for a named situation (for example a contraindication), then the step-up with its interval. Each drug has its own dose insert.
12. **Numeric targets.** Every "correct X", "keep X" or "monitor X" names the target value and the interval (for example potassium above 4, QTc under 500 ms, daily). No bare "correct potassium".
13. **Escalation.** It names only services not already named in Treatment, and says what to have ready for the call. Otherwise the section is left out.
14. **Pearls.** At most 3, each new information, never a repeat of a bullet above. A pearl that restates At a Glance or Treatment is cut.
15. **Link out.** A workup that another card owns or will own becomes a short pointer plus the first order. Diagnosis stays under about 25 bullets.
16. **Filler verbs.** Do not write "review", "address", "ensure", "consider", "supportive care" or "support" in place of an order. Say the order.
17. **Cause completeness.** Causes are ordered life-threatening first. The omissions pass checks the card against a cannot-miss list for the topic (for delirium: withdrawal, Wernicke, hypoxia, hypoglycemia, hypoperfusion, hyper- and hypothermia, hypertensive encephalopathy, intracranial bleed, infection including meningitis, metabolic, poisoning, seizure).
18. **Commentary.** Drop sentences that explain or reassure ("in that it predicts", "it is important", "note that", "can contribute"). A finding or an order, nothing else.
19. **Label caveats.** Text about the label ("not approved IV", "the label does not") lives in the dose insert, not in Treatment.
- **Practical details** (an interval, route, drug order, who to call) that no guideline or label gives: the `wards-card` skill, step 3, rule C, says where they may come from (library books and two web sources count as confirmed, judgment goes to the Opus check) and how they are marked.

## Abbreviations
- **Use freely:** BP, HR, RR, SpO₂, ECG, CBC, BMP, CMP, CT, MRI, EEG, LP, IV, IM, PO, SL, PRN, POCT, ICU, ED, NPO, QTc, UA, CXR, ABG, VBG, INR, aPTT, TSH, BUN, QRS, PR, AKI, CKD, UTI, COPD, GI, CNS, DKA, and drug-class initials only where a resident would never pause (NSAID, SSRI). LFTs only when the panel is listed.
- **Spell out at first use:** anything else (for example hepatic function panel, not HFP). Drug names are never abbreviated.
- **Never use (build error), the ISMP list:** U or u for units, IU, QD, QOD, a trailing zero (5.0 mg), a missing leading zero (.5 mg), µg (write mcg), MS, MSO4, MgSO4, D/C, HS.
- **Ambiguous (owner-approved defaults):**

| Abbreviation | Problem | Default |
|---|---|---|
| SBP | Systolic BP or spontaneous bacterial peritonitis | Write "systolic BP" and "spontaneous bacterial peritonitis" |
| tele | Informal | Write "telemetry" |
| MI, CHF | MI also means mitral insufficiency, CHF is dated | MI allowed, write "heart failure" |
| PE | Pulmonary embolism or physical exam | Write "pulmonary embolism" |
| LFTs | Which panel? | Name the panel |
| EKG | Duplicates ECG | ECG only |
| DC, D/C | Discharge or discontinue | Never |
| TID, BID, q6h | Dosing frequency | Doses only, with the interval sourced |
| mg/kg/dose | Clear | Allowed |

## Voice
Imperative for actions, present tense for findings. No passive reported speech ("Hospital experts rated..."). No process talk. Guideline names only in Where Guidelines Differ and Evidence (already allowed).

## Lines and sources
- Every content line ends `^[source-id, …]` (ids from `content/data/source/`), except lines that are only an insert. Sub-bullets without their own source use the parent's.
- Markers instead of names: `^[common-practice]` (stethoscope); the unnamed-reference check (green check) is a last resort. Never name outside reference tools or books (see CLAUDE.md).
- Write as if the reader sees only the final card: no process talk ("the guidance names…", "not read", review notes). Pregnancy and lactation come from LactMed.
- Tags: `[!cannot-miss]`, `[!most-common]` (after a cause's colon).
- Causes: `- **Category:** causes ^[source]`.

- Single-use thresholds, criteria and regimens are written inside the card and shared only on a second use. Exception: criteria that back an in-app calculator stay shared files.

## Inserts and links
- `{{dose:id}}` alone on a line (never a typed dose such as "40 mg"). Or `{{dose:id|pill}}` inside a sentence (2026-10-27): a tappable pill with the drug, amount, route and frequency that opens the dose sheet; write the sentence around it, one pill per drug per line, and give the dose a `route_short` and `frequency_short` if its full wording is long. `{{regimen:id}}`, `{{criteria:id}}`, `{{media:id}}` alone on a line. Thresholds and `{{calc:id}}` go inside sentences.
- Every named score or calculator is `{{calc:id}}` (MDCalc link; add `content/data/calc/<id>.yaml` first, copy the real address).
- Cards never insert pathways; a pathway file points to its card with `card:` and shows as a row under the title.
- Links inside the sentence: `[[card-id|label]]`, `[[card-id/section|label]]`.

## Formatting
- Bullets (one nesting level), numbered steps `1. Step title` with indented content, `or. Step title` for an alternative, tables with sources at row end.
- Blocks closed by `:::`: `:::note` (1-3 lines), `:::scale` (2-5 bands), `:::compare` (2-3), `:::times` (1-12), `:::onset` (2-12).
- US units; precise terms (hypoxemia, not "low oxygen"); terse clinical register; summarize, never copy.

## Consistency rules (content:check)
- Aliases: each alias on one card only; over 30 per card warns.
- `subsection` must be in the system's list in `content/systems.yaml` (add the name there first).
- `[!cannot-miss]` / `[!most-common]` only on causes in Causes; never name a category "Cannot miss" or "Most common".
- `[!also-above]` (never shown) goes only on a More Information line that holds a warning (contraindicated, avoid, do not, never, boxed warning) which Treatment or Monitor already carries. An unmarked warning line in More Information is a build error; put the warning in Treatment or Monitor first.
- **Table symbols:** `↑` high/raised, `↓` low, `=` normal, `↕` variable, `< > ≤ ≥` for thresholds (`<100`, not "below 100"). Tables only, never for names like "low-risk" or "high-gap". Details: Part 2.
- **Checked.** A card is Checked when every dose, number and care-changing claim is traced to a verified guideline or label quote or a checked book passage, and an independent Opus helper checked the lines resting on judgment plus the omissions pass (or the owner verified it). The Opus step runs `npm run checked:stamp -- <card-id> [--scope "…"] [--read <dose-id>=<read>@<source-id>] [--open <dose-id>,…]`: it refuses while any of the card's doses still says `not-verified` unless a `--read` gives its real state or `--open` names it as left open on purpose. It writes the stamp (date, `by: opus`, scope and the fingerprint of the card's doses, numbers and drug facts) and updates each dose's `verification` to what Opus read. The header then reads "Checked <date>". Never stamp a card nobody checked, and never type the stamp by hand.
- If a later edit changes the fingerprint, `content:check` fails. Re-check and stamp again, or, when nothing clinical changed, `npm run checked:carry -- <card-id> "<reason>"`. A new card, or a change to a dose, number, threshold or a citation on a clinical line, is tier 2 in `npm run pr:tier` and needs one of the two.
- A draft that is not yet checked has its id in `content/unchecked.txt` (`npm run card:new` adds it). The Opus step removes the line and adds the stamp; `content:check` fails a card with neither.
- Tables: at most 3 columns (see Writing style). `[[card]]` to an unwritten card is allowed (warning, shows as plain text). Related cards go both ways.
- **No semicolons** anywhere in card or data text (error). Clause join: two sentences (`Calcium buys time. It lowers no K⁺.`). List: lead-in with a colon plus sub-bullets, each with the source. Table cell: short sentences.
- **Sources go at the end (error).** One `^[id, id]` marker at the end of a line, bullet, paragraph or table row (inside the last cell, before the final `|`). Never between table cells or mid-sentence. A row that two sources support lists both in one marker.
- Warnings: unused source, `checked` over 12 months, a Do Now dose missing from Treatment.

# Part 2: Full reference

## Where things live
- `content/systems.yaml`: the 16 systems and the Library, in display order (quote titles that contain commas).
- `content/cards/<system>/<card-id>.md`: one file per card.
- `content/data/<type>/<item-id>.yaml`: one file per shared data item. Types so far: `source`, `dose`, `threshold`, `criteria`, `regimen`, `pathway`. A `criteria` item (a formal definition or staging system) has `name`, `title` (required: what the box defines plus the year of one of its cited sources, written "SIADH diagnostic criteria, 2013"; the content check enforces both), `short` (the words shown when it's inserted in a sentence), optional `logic` ("Any of:"), `items`, `columns` and `rows` (a table), `layout` (`columns` by default, or `stacked`) with `tones` (a staging or severity table: `stacked` plus one of `yellow`, `orange`, `red` per row, in order; the data sets the color, never the column name), `notes`, and `sources`. On a line of its own it shows in full (items in an indigo Criteria box; a `layout: stacked` table as tinted severity bands; notes in a brown Note box); inside a sentence it shows its `short` name and opens in a sheet. Dose fields: `DATA-TYPES.md`.
- `content/examples/`: development-only samples (placeholder content). They appear while developing (`npm run dev`, then open `#/card/example-condition`) and are never in the published app.
- **Copy a live card of the same type for the layout.** Examples of each block:
  - `:::note` · gi-upper-gi-bleeding · `:::scale` · pulm-dyspnea · `:::compare` · heme-anemia · `:::times` · renal-hypokalemia · `:::onset` · renal-hyperkalemia
  - `## Do Now` · gi-upper-gi-bleeding · `or.` alternative steps · cardio-adhf · `contents_sub` · renal-electrolyte-repletion
  - `{{regimen:}}` · id-cellulitis · `{{criteria:}}` · heme-anemia · `{{media:}}` · cardio-ecg-interpretation

## A card file
```markdown
---
id: renal-hyperkalemia          # permanent, from the topic list
type: topic                     # topic · reference · medication (a new type stops and asks the owner)
variant: protocol               # only for types with variants (reference, medication)
system: renal
title: Hyperkalemia
aliases: [high potassium]       # search only
subsection: Electrolyte Disorders # topic cards: the group within the system; a topic without one is listed under Approach
definition: "Commonly K⁺ ≥5.5 mEq/L. ^[kdigo-acute-hyperkalemia-2020]"  # one line under the title, with its source
based_on: [ukka-hyperkalaemia-2026]   # optional: the guidelines the page rests on (not shown in the app)
checked: { date: 2026-10-24, by: opus, scope: "doses and numbers", fingerprint: "0123456789abcdef" }   # written by npm run checked:stamp (shown as "Checked Oct 24, 2026"); never typed by hand
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

- Topic cards need `definition`. Every card needs `checked` (`date` YYYY-MM-DD, `by` `opus` or `owner`, short `scope`, `fingerprint`), unless its id is listed in `content/unchecked.txt` (drafts). Only the date is shown; the rest stays in the data. The old `reviewed` field is gone. `based_on` is optional and not shown (the "Based on" line was removed 2026-10-18); All Sources includes it and the definition's sources.
- Related and Sources are added by the app; don't write them as sections.

## Contents sub-level (optional)
A card can list the `####` subheadings of a section in its Contents menu, one level down, always shown (no expand or collapse): add `contents_sub: [dosing]` to the front matter (the section keys; the content check rejects an unknown section or one with no subheadings). Each row jumps to its heading and opens the section if it was closed. Electrolyte Repletion uses it for Dosing and Protocol (Potassium, Magnesium, Phosphate, Calcium). Other cards are unchanged.

## An emergency (Do Now)
A topic that is also an emergency has a `## Do Now` section, written **before** At a Glance, and a one-line `emergency_hint` in the front matter (50 characters at most, shown under its name in Rapids). It lives in the topic's file (one home) and uses the topic's own dose items; it is not one of the page's sections. It becomes the emergency's page in the Rapids tab, the pop-up behind the topic page's red Rapids button, and the steps of Timed Mode.

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
- **On a medication card, a dose line has no lead-in** (no "Pneumonia, cellulitis:" bullet above it): the dose row's title is the dose's short `indication`. The row shows the condition, so keep each `indication` to about 70 characters (checked) and put long wording in `indication_detail` (`DATA-TYPES.md`, Dose).
- **Doses go on a line of their own** (`{{dose:id}}`), never inside a sentence, so each shows as one dose row. Doses never appear as typed text (for example "40 mg"). Concentrations such as `mmol/L` are fine.
- Inserts (`{{type:id}}`), links (`[[card-id]]`, `[[card-id|label]]` or `[[card-id/section|label]]`), the linked section, related cards and `based_on` sources must exist. Tags are `[!cannot-miss]` or `[!most-common]`.
- `:::scale` has 2–5 bands, `:::compare` 2–3 columns (both "Label: text"), `:::note` 1–3 lines, `:::times` 1–12 times, `:::onset` 2–12 items: each `{{dose:id}}` (the dose needs an `onset` like "About 15 minutes") or `Name: onset | lasts ^[source]` for something that isn't a dose (e.g. `Hemodialysis: Immediate | Variable`).
- Data items have their required fields, sources that exist, and US units; dose and regimen items use only the fields in `DATA-TYPES.md`; every dose and in-app calculator has a `verification` note (`DATA-TYPES.md`, "Verification note"); a regimen's options list doses that exist and its words carry no typed doses.
- An emergency (`## Do Now`) follows the format above: topics only, a short `emergency_hint`, 2–8 steps that each do something, `If:` first and once, warnings of one to three words, only `:::note` after the steps; `:::times{…}` settings name a dose in Do Now (or `first`), what is checked, and readable times.

## Formatting inside sections
- Bullets (`- `, one nesting level: indent sub-bullets two spaces under a lead-in line ending in a colon), paragraphs, tables (`| … |`; a row's sources go at the end of the row; the first column stays in place when the table scrolls), `####` subheadings.
- Alternatives: a step written `or. Step title` (instead of a number) is a different choice for the step above it, not the next step. It shows an outlined "or" and doesn't use up a number (3, or, 4). Use it when two steps are alternatives by situation (for example DKA versus HHS insulin), never for a sequence.
- Numbered steps: `1. Step title`, then the step's own content indented by three spaces (bullets, dose lines, tables). Blank lines inside a step are fine; content after the steps starts unindented.
- `:::note` … `:::` (1–3 lines, each `- sentence ^[source]`): a brown box labelled Note, for notes and caveats about the content just above it.
- `:::scale Title` (severity bands, least to most severe; always stacked, level name over its detail), `:::compare Title` (statements that differ, side by side), `:::times Title` (recheck times on a timeline), `:::onset Title` (a row that opens onset and duration side by side, fastest first), each closed by `:::`.
- Links go inside the sentence: `[[renal-hyperkalemia|hyperkalemia]]`, not "hyperkalemia ([[renal-hyperkalemia]])". `[[card-id/section|label]]` opens a page at a section; on the same page it just scrolls there.
- Causes in a topic card: one list, `- **Category:** causes ^[source]`; mark one with `[!cannot-miss]` after the colon.
- `**bold**`, `*italic*`.
- A line that is only `{{regimen:id}}` shows the regimen box (options, dose rows, duration); regimens are never inserted inside a sentence. Fields: `DATA-TYPES.md`, Regimen.
- A line that is only `{{media:id}}` shows an ECG figure (caption, measurements, credit; tap for full screen), placed right under the line it illustrates. Its fields: `DATA-TYPES.md`, 11. Media.
- **Scores and calculators link to MDCalc.** Every score, rule or calculator named in a card, Do Now step, regimen, criteria set or pathway box is written `{{calc:id}}` inside the sentence (never on a line of its own). It shows the calculator's `short` name; to keep other words, such as a capital letter, write `{{calc:anion-gap|Anion gap}}`. Each calculator is one file, `content/data/calc/<id>.yaml` (fields: `DATA-TYPES.md`, 12b), so an address is typed once. **When MDCalc has a page for a score or calculator, the card must link it:** the content check fails on any `match` word (for example `CURB-65`, `anion gap`) that appears without its `{{calc:…}}`. To link something new, add its file (open the MDCalc page first and copy its address; never guess one). Not linked: MAP and BMI, and words inside dose sheets.
- A line that is only `{{criteria:id}}` shows the criteria in full. Cards never insert a pathway: each of a card's pathways shows as a row under its title, found through the pathway's `card` field (the content check rejects `{{pathway:…}}`).

## Scores, criteria and formulas

Owner rules, 2026-10-21 (DECISIONS "Scores, criteria and formulas").
- **Definitions, criteria and staging** (they name a diagnosis or stage: KDIGO AKI stages, Sepsis-3, DKA severity, SIADH) are always in the app, on the card, in a box with a title saying what it defines and the source year.
- **Scores** (add points, map to a risk: CHA₂DS₂-VASc, CURB-65, Wells, PERC, HEART) get an MDCalc link wherever named. **Formulas** (serum osmolality, anion gap, corrected sodium, A–a gradient) are treated the same way.
- A formula also gets an **in-app version** only if it passes all four: one simple formula; stable (unlikely to change, one citable primary source); used often at the bedside; offline matters (MDCalc needs signal). Scores whose result is a risk percentage or probability (Wells, CURB-65) link to MDCalc only. The in-app version is a simple interactive calculator (enter numbers for a result), opened from the titled criteria box and kept only while open. Interactive calculators are limited to formulas, and none is built without the owner's OK.
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
- Show Sources (an item in the Contents menu, quote-mark icon) shows one source pill at the end of every line (off when a page opens). A pill names the line's first source and "+N"; tapping it quotes the line and lists its sources. Tables get the pill at the end of each row; a sub-bullet without its own sources gets none.
- Tables are gray with a "Table" label; staging rows use the severity ramp (yellow, orange, red).
- Inserts read like normal text; tapping one opens its details. Dose rows open the dose sheet.

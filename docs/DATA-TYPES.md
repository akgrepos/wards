# Data types

Settled 2026-10-17. **Data types** are the shared pieces of information that each have **one home** and get **inserted** into cards, never retyped. If a dose changes, it changes in one place and every card that uses it updates.

## How structured content is (decided: structured cards + data)
- Every section of every card has a defined shape (e.g. a differential table always has diagnosis · distinguishing features · source), checked automatically.
- Facts, numbers and anything reused are data items; explanations stay readable prose, allowed only in explanation fields.

## The rule, in practice
- Card text says *what to do*. Exact facts that appear in more than one place (doses, thresholds, criteria, scores, reference values, coverage, citations, images) are data items.
- A card inserts a data item by its ID; the app shows it in place.
- An automatic check fails a pull request if:
  - an insert points to something that doesn't exist
  - a data item has no source
  - a unit isn't a recognized US unit
  - a card's own text contains something that looks like a dose (e.g. "5 mg") outside an insert. **This is the main safeguard against retyped doses.**

---

## The 16 data types

**Built:** source, dose, drug record, regimen, threshold, criteria set, pathway, coverage, media, calculator link. **Reserved: build when the first card needs it:** reference value, score (calculators use `calc`), grading scale, term, clinical finding, test accuracy, interaction, recommendation.

**Where a new item lives.** A threshold, criteria set or regimen used by one card is written inside that card and shared only when a second card uses it. Exception: criteria that back an in-app calculator stay shared files. Existing shared items do not move.

### 1. Source
Every citation lives here once; cards cite by number, which points to the source.
- Fields: kind (guideline · study · systematic review · prescribing information · dataset) · issuing society · title · year/edition · journal, DOI, PMID or URL · date checked
- Shown as: one source line at the end of each section it supports (short form; tap for the full citations with View Citation links), and the numbered Sources list at the end of each card

### 2. Dose
One drug, one indication, one population. The only place a dose is written.
- Fields (YAML name in brackets; fill a field only from the item's cited sources, and leave it out rather than guess):
  - drug name [`drug_name`] · brand [`brand`] · drug record [`drug`, required; see 2b] · indication [`indication`] · longer indication [`indication_detail`] · population [`population`]
  - `indication` is the **title of the dose row** on a medication card (the condition, about 70 characters at most; `npm run content:check` fails a longer one on a dose a medication card inserts). Long wording (organisms, combinations, qualifiers) goes in the optional `indication_detail`, shown on the dose sheet under "Indication". Keep the clinical meaning in one or the other; never drop a qualifier to fit.
  - route [`route`] · amount and unit [`amount`, `unit`] (or per kg) · frequency [`frequency`] and/or rate [`rate`, e.g. "over 10 minutes"]: one of the two is required
  - give when [`give_when`]: the trigger, short ("ECG changes")
  - repeat [`repeat`]: when to give it again
  - onset and how long it lasts [`onset`, `lasts`]; write onset as "About 15 minutes", "1–3 minutes" or "Immediate" so a Compare Onset and Duration row (`:::onset`) can sort it
  - duration of treatment [`duration`] · maximum [`max`]
  - boxed warning [`boxed_warning`]: the warning, or "None" only when the cited prescribing information is the source
  - alternative [`alternative`]: another dose item and when to use it (`dose: <id>`, `when: …`)
  - adjustments [`adjustments`]: kidney-function bands, liver, dialysis (`when`, `change`)
  - cautions [`cautions`]: a list of short sentences
  - notes [`notes`] · sources [`sources`]
- Home: the medication card. Inserted into topic, protocol and pathway steps, always as its own **dose row** (one drug per row).
- Shown as: the dose row (on a topic or protocol card: drug name over "amount unit route rate frequency"; on a **medication card**: the `indication` as the bold title, "amount unit route frequency" in semibold under it, then one gray line of population, rate, maximum and a short duration; a duration over 60 characters appears only on the sheet); tapping opens the **dose sheet**: "Dose" bar title, the drug as heading, the fields above, the alternative (tap to open it), cautions, Check Interactions (Medscape's free checker, opens in Safari) and a source line.

### 2b. Drug record (added 2026-10-24)
The one home for facts that hold for a drug whatever it is given for. Indication-specific facts (a dose, its kidney adjustment for one use, a caution that applies to one indication) stay on the dose. Lives in `content/data/drug/<id>.yaml`; a dose points to it with the optional `drug: <id>` (the id is usually the drug's medication card id, which also gives the "Open <card>" row). `npm run content:uses -- drug:<id>` lists its doses and the cards that show them.
- Fields: `name` · `class` · brands [`brands`] · other names for search [`aliases`] · `boxed_warning` ("None" only when the label has none, otherwise `{ text, sources }`) · `cautions` (a list of short `{ text, sources }`, each with its source) · `kidney_liver` (one short general statement; the actual adjustments stay on the doses) · `label_source` (the prescribing-information source; left out only when none exists, as for oral urea) · `sources` (must include the label).
- No dose amounts typed as text; `content:check` rejects them like anywhere else.
- Shown as: on the dose sheet of every dose that has `drug:`, one "<Drug> warnings" section above the dose's own Cautions: the boxed warning, the cautions, and the kidney and liver statement. The sheet's source pills include these sources.
- Checks: `drug:` on a dose must name a drug record (error); a drug record no dose points to is a warning. `drug_name` on doses still feeds Search; the drug record is where Search will later find a drug.
- `drug:` is **required** on every dose (2026-10-24, stage 4b): `content:check` errors on a dose without it or pointing to a missing record. A boxed warning, a drug-wide caution or a general kidney/liver statement is written once in the drug record, not repeated on each dose; a dose keeps `boxed_warning` or `cautions` only for what is specific to its indication. The row's "Boxed warning" tag also shows when the drug record has one.

### Verification note (doses and calculators, added 2026-10-23)
Every dose item and every in-app calculator (a `calc` file with a `calculator` block) carries a `verification` note, so the later independent review has a searchable worklist. `npm run content:check` rejects one without it.
- Fields: `read` (required) · `source` (the id of one of the item's own sources) · `date` (`YYYY-MM-DD`, when the note was written).
- `read` is one of: `fda-label` (the prescribing information was read; `source` must be a prescribing-information label; the label is the authority for doses) · `full-text` or `abstract` (a guideline or study; guidelines are the authority for thresholds) · `common-practice` (a deliberate exception, the same as the stethoscope marker: the item must cite the `common-practice` source) · `not-verified` (cited, but not yet independently read; `source` names the source the amount and frequency come from, to be checked against).
- Never name outside reference tools or the reference handbook. Do not write `fda-label`, `full-text` or `abstract` unless the source was actually read that way; when unsure, use `not-verified`.
- Example: `verification: { source: label-acetazolamide-inj-2025, read: fda-label, date: 2026-10-30 }` (written as a block in the files).
- Worklist: `grep -l "read: not-verified" content/data/dose/*.yaml`. The count is in the private review queue notes. New doses are written with their real `read` value; the review pass turns `not-verified` into one of the others.

### 3. Regimen
A treatment combination for one indication and setting, built from dose items (never retyping them). Built 2026-10-19 for Wave 1 batch 2 (owner's choice over plain dose rows).
- Fields (YAML name in brackets): name [`name`] (the setting, short: "Inpatient, not severe") · indication [`indication`] · setting [`setting`] (who it is for, one line) · options [`options`] · duration [`duration`] · notes [`notes`] (a list of short sentences) · sources [`sources`]
- Each option: label [`label`] (optional, e.g. "β-lactam plus macrolide") · when [`when`] (optional condition, e.g. allergy) · doses [`doses`]: the parts given together; a part is a dose id, or a list of dose ids meaning any one of them. Example: `doses: [[ceftriaxone-iv, ampicillin-sulbactam-cap], azithromycin-iv-cap]` = one of the β-lactams plus azithromycin.
- Its words never carry a dose (the content check rejects typed doses); every drug shows as its own dose row.
- Home: `content/data/regimen/<id>.yaml`. Inserted on a line of its own (`{{regimen:id}}`) in topic cards, and later in the "Empiric therapy by infection" chart.
- Shown as: a gray box labelled "Regimen": the name and setting, then the options joined by "Or"; inside an option, parts joined by "Plus" and "One of:" above a choice of drugs; then the duration and notes. All Sources includes the regimen's sources and its doses' sources.
- Dose items used by regimens are shared: the same dose (e.g. ceftriaxone 1–2 g IV every 24 hours) is one item reused by every card and regimen that gives it.

### 4. Reference value
A lab test's typical US range and critical values.
- Fields: test · unit (US) · typical range · critical low/high · ranges by sex, age or pregnancy where they differ · sources
- Home: the diagnostic test card. Inserted into topic cards and the lab reference chart.

### 5. Threshold
A single named cutoff that drives decisions.
- Fields: name · value and unit · note (optional) · sources
- Tappable only when the pop-up shows something the line can't (owner's rule, 2026-10-19). The value is on the line and its sources are in the line's pill, so only the `note` can add anything: give one only for a caveat, a different population or a condition the line doesn't state, and write only that part. Without a note the value is plain text. Values in table cells and scale bands are always plain. `npm run content:check` rejects a note that repeats the value, one whose words are mostly (more than a third) already on the line or in the cutoff's name, and one on a cutoff used only in tables or scales.
- Example: "Hyperkalemia emergency: K⁺ ≥6.5 mmol/L or ECG changes"
- Kept separate so the same cutoff is never written two ways

### 6. Criteria set
Definitions, criteria and staging are always in the app, in a titled box; scores and formulas follow CONTENT-FORMAT, "Scores, criteria and formulas".
A formal definition or diagnostic criteria with their logic.
- Fields: name · **title** (required; what it defines + source year, e.g. "SIADH diagnostic criteria, 2013"; the year must be a cited source's) · items (major/minor or lettered) · logic (e.g. "2 major, or 1 major + 3 minor") · stages or grades · sources
- Examples: KDIGO AKI stages, Sepsis-3, modified Duke criteria, SIRS
- Display (2026-10-19): the items in an indigo "Criteria" box; a table with `layout: stacked` and `tones` (one of yellow, orange, red per row, in order; severity only, nothing else) as full-width tinted bands, the first cell as the band name and the other columns as labeled fields (same on the card and in the sheet); any other table (`layout: columns`, the default) as a gray table; the notes in a brown "Note" box.
- Home: the topic card it defines. Inserted elsewhere (and can power a checklist).

### 7. Score
Which scores and formulas get an in-app version, and which only an MDCalc link: see CONTENT-FORMAT, "Scores, criteria and formulas".
Everything a calculator needs.
- Fields: inputs (each with options and points, or a formula) · calculation · result bands → risk → recommended action · validated population · limitations · sources
- Built (2026-10-21): stored inside the score's calculator file (`content/data/calc/<id>.yaml`, 12b) as `sources` (required) plus a `calculator` block; the MDCalc link stays the last row. Tapping the score's name, or the "Calculate" button in its criteria box (same id), opens a bottom sheet; nothing is saved.
  - `kind: checklist`: `items` (label, points; half points allowed, negative allowed), `bandSets` (one or more; each band has `label`, `range` text, inclusive `from`/`to` numbers, optional `risk`, `action`, `high: true` for red), optional `with` (another checklist sharing the sheet through a segmented control; must be reciprocal).
  - `kind: formula`: `expression` (words), `inputs` (id, label, US unit, min, max, optional), `results` (`fn` from the formulas in `src/calculators.ts`, label, unit, decimals, `needs`), `reference` (normal range or caution).
  - Both: `heading`, `notes`. The content check requires sources that exist, bands covering every possible total exactly once, and results that use known formulas and inputs.
- Home: the score card. Inserted interactively into topic cards.

### 8. Grading scale
Ordinal scales used in exams and documentation.
- Fields: name · levels (grade → description → documentation wording) · sources
- Examples: murmur grade I–VI, edema 0–4+, strength 0–5, reflexes 0–4+, RASS
- Home: the physical exam card. Inserted into topic cards.

### 9. Pathway (focused flowchart)
A short decision tree for one sequential task on a card (2026-10-20; decision-tree look 2026-10-21): diagnostic (a workup), treatment, or mixed. Boxes may end in a diagnosis, a next test or a treatment. It supplements the card; a card may have several.
- Fields: title · card · summary (one line for its rows) · columns · start · levels (numbered rows, `{ title, row }`) · nodes (kinds: start, question, do, urgent, note, result), each placed on a grid (`at: [column, row]`, `span` columns wide) · questions' answers (label, optional detail, its own grid place, next box) · text lines from the card (a line that is only `{{dose:id}}` shows the card's own dose row) · at most two links per box · sources
- Display: its own full-screen page; a question is a short heading and its answers are decision buttons side by side under it, each leading to another question or to a step box; tap any answer at any time to choose it (filled with a checkmark; the other answers turn gray and everything only they lead to fades; tap again to undo; Clear forgets all); lines leave a box straight down, turn once just above the box they point to and join there; pinch or − + to zoom; Current Step frames the next unanswered question. Format: CONTENT-FORMAT.md, "Pathways".
- Home: its own page, opened from a "Pathway" row under its card's title and from the Library's Pathways; never inserted into a card

### 10. Coverage
How well each drug covers each organism group; one grid per card, inserted on a line of its own with `{{coverage:id}}` (built: Empiric Antimicrobials, `content/data/coverage/`).
- Fields: `title` · `levels` (`R`, `V`, `N`, each with a `word` and a `meaning` shown in the legend; "variable" means it depends on the isolate's susceptibility, local resistance or dose, or only some members of the class) · `columns` (1–7 organism groups: `id`, `name`, `short` of 6 characters or fewer) · `rows` (`drug`, `class`, `cells` with one R, V or N per column, `note`, `cp_cells` for cells resting on common practice or a label's in-vitro list, `sources`) · `sources` (every row's, listed once)
- Shown as: pick up to 3 organism groups → the drugs that cover all of them (reliable only, or reliable or variable), grouped by class, with the closest options when none does; "All drugs" (a strip of shapes per drug); "Compare" up to 3 drugs. A drug opens a sheet with every group in words, the note and sources. Shapes are gray, with a word beside or under each, never color alone (design system `CoverageMark` and `CoverageStrip`).
- `npm run content:check` enforces it (`scripts/content/coverage.mjs`)

### 11. Media
Images, ECGs and diagrams.
- **ECG** (`kind: ecg`, built): `title` · `alt` · `caption` · `illustrates` (the card's criteria it shows) · `sources` (the criteria's) · `recording` (`dataset`: a source of kind `dataset` with `license` and `license_url`; `record` ID; `rate` 250; `leads`: the leads kept, 9.8–10 s each, samples in 0.01 mV) · `show` (`lead`, `from`, `to` in seconds, 4 s at most; `smooth`) · `marks` (`interval`, `band`, `baseline`, `height`, `text`; times in seconds, voltages in mV; labels are the measurements). Drawn at 25 mm/s and 10 mm/mV on a 1 mm / 5 mm grid; full screen shows every stored lead, raw, with the same labels on the lead the card shows. Marks are measured on the raw recording by `scripts/media/extract_ecg.py`.
- **ECG drawing** (`kind: ecg-drawing`, built): `panels`, each a `title`, `cue`, `seconds`, and either `beats` (R-wave times) with `waves` ([height mV, center s from R, width s]) or a `sine`; plus `marks`. For patterns with no reusable recording; credited "Drawing based on" its source.
- **Image:** file · license and attribution · finding annotations · source (not built yet)
- **Diagram:** drawn in the app's style · what it's based on (source) (not built yet)
- Home: the ECG or imaging library (later); inserted into cards with a line that is only `{{media:id}}`

### 12. Term
A word the app knows.
- Fields: preferred term · aliases and abbreviations (for search) · short definition
- Powers: search, the abbreviations reference, and tap-to-define

---

### 12b. Calculator link
A score, rule or calculator that has a page on MDCalc (added 2026-10-21). One file per calculator, `content/data/calc/<id>.yaml`, so each address lives in one place.
- Fields: `name` (the calculator's full name) · `short` (the words shown in a sentence) · `url` (an `https://www.mdcalc.com/calc/<number>/<name>` page, opened and checked before it is added) · `match` (the words that name it in the content, e.g. `["CURB-65"]`, `["anion gap"]`; matched without regard to capitals, as whole words)
- No sources (it points to a tool, not a claim).
- Inserted inside a sentence with `{{calc:id}}` or `{{calc:id|other words}}`. Shown as a blue link with a small arrow mark that opens MDCalc in Safari; it needs internet, and the card says so under Sources.
- The content check rejects: a link to a calculator that doesn't exist, one on a line of its own, an address that isn't an MDCalc calculator page, a duplicate address or match word, and any `match` word written without its link in a card, Do Now step, regimen, criteria set or pathway box.

### 13. Clinical finding
A sign, symptom or exam finding.
- Fields: name · how elicited (link to exam card) · documentation wording · accuracy for specific diagnoses (sensitivity, specificity, LR+, LR−) · sources
- Home: the physical exam card. Inserted into topic cards.

### 14. Test accuracy
How well a test performs for one condition in one setting.
- Fields: test · condition · setting/population · sensitivity · specificity · LR+ · LR− · sources
- Home: the diagnostic test card. Inserted into topic cards.

### 15. Interaction (clinically major only)
- Fields: drug or class A · drug or class B · effect · severity · management · sources
- Shown on both drug cards from the one entry

### 16. Recommendation
A specific guideline statement.
- Fields: statement · population/conditions · sources
- Rule: any statement used in a flowchart step must be a Recommendation item, inserted into both the flowchart and the card text. Elsewhere, recommendations stay structured text.

## How it's stored (planned)
- `content/cards/<system>/<card-id>.md`: one file per card, written in the card type's fixed sections, with inserts like ⟨dose: apixaban-af⟩
- `content/data/<type>/<item-id>.yaml`: one file per data item
- A schema for each type, checked automatically on every pull request
- The app is built from these files, so it all works offline as one package

---

## Decisions (2026-10-17)
1. Inserted items look like normal content; **tap opens their home** (e.g. the drug card).
2. Doses show as **one line; tap for more** (adjustments, maximum, notes). Updated 2026-10-18: one dose row per drug, opening the dose sheet with the fields above.
3. Kidney dose adjustments use **whatever measure the source uses** (usually CrCl, sometimes eGFR), labeled each time.
4. Weight-based doses: **optional calculator**. Enter a weight to see the dose with maximums applied; nothing is saved.
5. Coverage chart: **antimicrobials × pathogens with ●/◐/○** and tap-for-notes.
6. Content structure: **structured cards + data** (not everything as data).
7. Added data types 13–16: clinical finding, test accuracy, interaction (major only), recommendation (required for flowchart statements).

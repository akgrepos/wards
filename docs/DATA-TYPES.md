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

### 1. Source
Every citation lives here once; cards cite by number, which points to the source.
- Fields: kind (guideline · study · systematic review · prescribing information · dataset · AMBOSS when the rules allow) · issuing society · title · year/edition · journal, DOI, PMID or URL · date checked
- Shown as: one source line at the end of each section it supports (short form; tap for the full citations with View Citation links), and the numbered Sources list at the end of each card

### 2. Dose
One drug, one indication, one population. The only place a dose is written.
- Fields (YAML name in brackets; fill a field only from the item's cited sources, and leave it out rather than guess):
  - drug name [`drug_name`] · brand [`brand`] · drug card [`drug`] · indication [`indication`] · population [`population`]
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
- Home: the medication card. Inserted into condition, approach, protocol and pathway steps, always as its own **dose row** (one drug per row).
- Shown as: the dose row (drug name over "amount unit route rate frequency"); tapping opens the **dose sheet**: "Dose" bar title, the drug as heading, the fields above, the alternative (tap to open it), cautions, Check Interactions (Medscape's free checker, opens in Safari) and a source line.

### 3. Regimen
A treatment combination for one indication and setting, built from dose items (never retyping them). Built 2026-10-19 for Wave 1 batch 2 (owner's choice over plain dose rows).
- Fields (YAML name in brackets): name [`name`] (the setting, short: "Inpatient, not severe") · indication [`indication`] · setting [`setting`] (who it is for, one line) · options [`options`] · duration [`duration`] · notes [`notes`] (a list of short sentences) · sources [`sources`]
- Each option: label [`label`] (optional, e.g. "β-lactam plus macrolide") · when [`when`] (optional condition, e.g. allergy) · doses [`doses`]: the parts given together; a part is a dose id, or a list of dose ids meaning any one of them. Example: `doses: [[ceftriaxone-iv, ampicillin-sulbactam-cap], azithromycin-iv-cap]` = one of the β-lactams plus azithromycin.
- Its words never carry a dose (the content check rejects typed doses); every drug shows as its own dose row.
- Home: `content/data/regimen/<id>.yaml`. Inserted on a line of its own (`{{regimen:id}}`) in condition cards, and later in the "Empiric therapy by infection" chart.
- Shown as: a gray box labelled "Regimen": the name and setting, then the options joined by "Or"; inside an option, parts joined by "Plus" and "One of:" above a choice of drugs; then the duration and notes. All Sources includes the regimen's sources and its doses' sources.
- Dose items used by regimens are shared: the same dose (e.g. ceftriaxone 1–2 g IV every 24 hours) is one item reused by every card and regimen that gives it.

### 4. Reference value
A lab test's typical US range and critical values.
- Fields: test · unit (US) · typical range · critical low/high · ranges by sex, age or pregnancy where they differ · sources
- Home: the diagnostic test card. Inserted into condition/approach cards and the lab reference chart.

### 5. Threshold
A single named cutoff that drives decisions.
- Fields: name · value and unit · note (optional) · sources
- Tappable only when the pop-up shows something the line can't (owner's rule, 2026-10-19). The value is on the line and its sources are in the line's pill, so only the `note` can add anything: give one only for a caveat, a different population or a condition the line doesn't state, and write only that part. Without a note the value is plain text. Values in table cells and scale bands are always plain. `npm run content:check` rejects a note that repeats the value, one whose words are mostly (more than a third) already on the line or in the cutoff's name, and one on a cutoff used only in tables or scales.
- Example: "Hyperkalemia emergency: K⁺ ≥6.5 mmol/L or ECG changes"
- Kept separate so the same cutoff is never written two ways

### 6. Criteria set
A formal definition or diagnostic criteria with their logic.
- Fields: name · items (major/minor or lettered) · logic (e.g. "2 major, or 1 major + 3 minor") · stages or grades · sources
- Examples: KDIGO AKI stages, Sepsis-3, modified Duke criteria, SIRS
- Display (2026-10-19): the items in an indigo "Criteria" box; a table whose first column is "Stage" (up to five stages) as stage rows with tinted chips; any other table as a gray table; the notes in a brown "Note" box.
- Home: the condition card it defines. Inserted elsewhere (and can power a checklist).

### 7. Score
Everything a calculator needs.
- Fields: inputs (each with options and points, or a formula) · calculation · result bands → risk → recommended action · validated population · limitations · sources
- Home: the score card. Inserted interactively into condition and approach cards.

### 8. Grading scale
Ordinal scales used in exams and documentation.
- Fields: name · levels (grade → description → documentation wording) · sources
- Examples: murmur grade I–VI, edema 0–4+, strength 0–5, reflexes 0–4+, RASS
- Home: the physical exam card. Inserted into condition cards.

### 9. Pathway (whole-card map)
A zoomable flowchart of one whole card (2026-10-19): another way to look at the card, not a copy of it.
- Fields: title · card · columns · start · nodes (kinds: start, question, do, urgent, note, result, link), each placed on a grid (`at: [column, row]`) · questions' answers (label, optional detail, next box, rejoin) · links per box to card sections and their subheadings or steps, criteria, dose sheets, other cards and Rapids pages · optional footer links · sources
- Display: its own full-screen page; every box is always drawn, answered rows fill in and boxes off the route dim; pinch or − Fit + to zoom. Format: CONTENT-FORMAT.md, "Pathway maps".
- Home: its own page, opened from a "Pathway" row under its card's title and from the Library's Pathways; never inserted into a card

### 10. Coverage
How well one antimicrobial covers one organism.
- Fields: antimicrobial · organism · level (● reliable · ◐ variable, check susceptibilities · ○ not reliable) · notes (e.g. "not for CNS") · sources
- Chart layout (decided): antimicrobials as rows, pathogens as columns, circle symbols; a small dot marks a note, shown on tap; shapes carry the meaning (works without color)
- Powers: the coverage chart, organism cards and drug class cards, all from the same entries

### 11. Media
Images, ECGs and diagrams.
- **ECG:** dataset and record ID · leads · calibration (25 mm/s, 10 mm/mV) · annotations (e.g. measured intervals, highlighted voltages) · license and credit · the criteria it illustrates
- **Image:** file · license and attribution · finding annotations · source
- **Diagram:** drawn in the app's style · what it's based on (source)
- Home: the ECG or imaging library; inserted into cards

### 12. Term
A word the app knows.
- Fields: preferred term · aliases and abbreviations (for search) · short definition
- Powers: search, the abbreviations reference, and tap-to-define

---

### 13. Clinical finding
A sign, symptom or exam finding.
- Fields: name · how elicited (link to exam card) · documentation wording · accuracy for specific diagnoses (sensitivity, specificity, LR+, LR−) · sources
- Home: the physical exam card. Inserted into condition and approach cards.

### 14. Test accuracy
How well a test performs for one condition in one setting.
- Fields: test · condition · setting/population · sensitivity · specificity · LR+ · LR− · sources
- Home: the diagnostic test card. Inserted into condition and approach cards.

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

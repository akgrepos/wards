# Card types

Settled 2026-10-17; page layout updated 2026-10-18 for the approved redesign (topic pages), and 2026-10-19 for the AKI card redesign (sources per line, one color per job, pathways as their own pages). Defines **3 card types in use (Topic, Reference, Medication)**, each with a fixed set of sections in a fixed order; a new kind of card stops and asks the owner. Condition and Approach were merged into one Topic type on 2026-10-24. Shared data (doses, lab values, scores, criteria and similar) appears as **⟨inserted⟩** blocks: content that lives elsewhere and is shown in place, never retyped. How to write the files: the cheat sheet (Part 2).

---

## Part 1 — The topic page every card shares

**Header**
- Type and system tags · title (precise medical term)
- One-line definition, with its source
- "Checked" date (from the front matter `checked.date`; nothing is shown for a draft). No "Based on" line (removed 2026-10-18, owner): the per-line source tags and All Sources name the guidelines
- Search aliases (hidden; used by search)
- Top right: the **Contents** button (list-bullet icon), a menu of the page's sections with the one being read checked, then **Show Sources** / **Hide Sources** (quote-mark icon; off each time a page opens; while on, every line ends in one source pill) and Collapse All / Expand All. Topics with an emergency also get a red **Do Now** button (the Rapids tab's symbol, `staroflife.fill`) beside it, in the same group, that opens the Do Now pop-up: the steps and doses, Start Timed Mode and Open Full Emergency; it is hidden when there is none. No row of section buttons.

**At a Glance** (always first)
- 3–6 bullets: the bottom line you need in 15 seconds at the bedside

**Body**
- The card type's sections, **always in the same order** (Part 2)
- Every section has a 44pt heading that closes and opens it; all start open. Which sections are closed, and where the page was scrolled, are remembered per page on the phone.
- A section that doesn't apply is left out rather than shown empty, so the order of the remaining ones never changes
- No source line ends a section (removed 2026-10-19, owner): sources are shown per line on demand, and All Sources lists them all.
- **Sources per line, on demand** (2026-10-19): with Show Sources on (Contents menu), each line (bullet, paragraph, table row, step, note) ends in one pill: its first source and "+N" for the rest, or the stethoscope or check marker when no source is named. Tapping a pill opens a sheet that quotes the line, then lists its sources.

**More Information** (after the main sections)
- The deeper material, as rows that open in place (closed at first), each with a short description: for topics, Where Guidelines Differ, Special Populations, Complications, After the Acute Phase, Evidence, Why the Treatment Order, Epidemiology and Pathophysiology
- Sections that were "collapsed by default" in the old layout live here

**Footer, the same on every card**
- **Pearls:** common errors and high-yield nuances
- **Related:** links grouped as "Differential", "Conditions", "Tools" and "Medications" (from the front matter)
- **Sources:** "All Sources" opens the numbered list in order of first use, each with its full citation

**Formatting rules**
- Bullets and tables over paragraphs; one idea per bullet
- Numbers always carry units and thresholds (e.g. "K⁺ ≥6.5 mmol/L")
- First-line choices are listed first and labeled; alternatives follow
- Drug doses only ever appear as ⟨inserted⟩ dose rows, **one drug per row, on a line of their own**: never two drugs and two amounts on one line. Tapping a row opens the dose sheet.
- **One color, one job** (2026-10-19), always with a word label: blue = tappable; red = danger (emergencies and the most severe grade); the severity ramp (yellow, orange, red; green only for a normal grade) only inside grades, stages and scales; indigo box labelled "Criteria" = formal criteria; brown box labelled "Note" = notes and caveats (`:::note`); gray = tables (labelled "Table", gray header) and anything neutral. Other colors stay out of card content.
- Staging systems as stage rows (GradeList: a tinted "STAGE n" chip beside each stage's criteria).
- **Pathways are focused flowcharts** (2026-10-20, replaces 2026-10-19 whole-card maps): a card may have none, one or several pathways, each covering one sequential task: diagnostic, treatment or mixed. Each shows as its own "Pathway" row under the card's title (above the first section) and in Library › Pathways. Pathway boxes use the card's own words and dose rows; they supplement the card, not replace it.
- Severity grades as a scale (ScaleBar), steps in order as numbered steps (StepList), statements that differ by source as a side-by-side comparison (ComparisonGrid), recheck times as a timeline of plain labels (TimePoints). Tables keep their first column in place.
- Items with sub-items use one level of nested bullets (HIG). Links to other pages are woven into the sentence ("[[renal-hyperkalemia|hyperkalemia]]"), never added after it in brackets.
- Onset and duration of several treatments: a "Compare Onset and Duration" row (`:::onset`) that opens them side by side, fastest first, built from the dose items; not a table on the page.
- Guideline recommendation grades (e.g. "Class I, Level A") are not shown (decided)

**Emergency page (Rapids)** (2026-10-19, Phase 4)
- For a topic with a `## Do Now` section (`CARD-WRITING-CHEATSHEET.md`, "An emergency (Do Now)"). Listed in the Rapids tab by system, with its one-line hint.
- Red "Rapids" tag, title, **Start Timed Mode** (accent color, not red), then **Do Now**: red numbered steps, each with its "If …" condition line, a Check box for what to check first, one drug per dose row (each opens its dose sheet; an alternative shows under it), warnings as tags, short notes; Note boxes after the steps; one source line for the section (Sources UKKA '26 · KDIGO '20 …).
- Top right: the Topics tab's symbol opens the topic pop-up (At a Glance, then Open Full Topic). One pop-up at a time.
- **Timed Mode** (full screen, no tab bar): the elapsed time in a red timer capsule at the top; Minimize (chevron down) keeps it running in a bar above the tab bar on every screen, which returns to the same step; progress, the current step's condition, Check box and large doses ("Give", "Then Give"), Skip and Mark Given (accent), "Mark … Given Instead" for an alternative; Due Next (from the topic's recheck times) and a log with clock time and time since start, with Undo. End Timed Mode (red text) asks first, then shows a summary: what was given and when, what's due next, Copy Summary and Done. Kept only on the phone, cleared on Done; the timer survives the app closing.

---

## Part 2 — The card types

**In use:** Topic, Reference, Medication. A new type, variant or section kind stops and asks the owner. A score or test is a Reference card until the owner approves a new type.

Each type lists its sections in order (after At a Glance), then its More Information subsections. Pearls, Related and Sources end every card. The substructure under each section is guidance for what goes there.

### 1. Topic card [T]
A disease or syndrome (a **condition**), or a symptom, sign or abnormal result (an **approach**). One type, one shared section table, one fixed order. A card lists only the sections it uses; the rest are left out, so the order of the remaining ones never changes. A topic with a `subsection` is listed under that group in its system; one without is listed under Approach.

1. **At a Glance** (always)
2. **Definition and Staging**: what counts as abnormal, with thresholds and staging (e.g. the AKI criteria ⟨inserted⟩). Used by symptom and abnormal-result topics.
3. **First Steps**: red flags, signs of instability, what to do first. Used by symptom and abnormal-result topics.
4. **Severity**: grades as a scale; diagnostic criteria ⟨inserted⟩ when formal criteria exist; what makes it an emergency (monitoring, level of care, scores ⟨inserted, interactive⟩)
5. **Causes**: a framework or one grouped list (bold category name, then its causes), with "cannot miss" marked by a tag, each cause linking to its card; pseudo-conditions and mimics (the differential: diagnosis · distinguishing features · link)
6. **Presentation**: symptoms, atypical presentations; for symptoms, the focused history and examination that discriminate between causes
7. **Diagnosis**: initial tests and why; interpretation and thresholds (result → likely causes tables, with their limits in a Note box); further testing; low-value tests to avoid
8. **Treatment**: numbered steps (immediate, then definitive, by severity or subtype); dose rows ⟨inserted⟩. For a symptom: common initial orders (orders only, not tests; one line links to the first-line tests in Diagnosis), then initial management while the cause is being found.
9. **Monitor**: what is checked, how, when, and the action: rechecks (timelines of recheck times), targets, expected response, stop rules. Each line reads What, When, Action.
10. **Escalation**: the trigger, the named service or level of care, and what to have ready for the call (general criteria, never institution-specific)
11. **More Information**: Where Guidelines Differ · Special Populations (kidney or liver disease, pregnancy, older adults, immunocompromised, drug-specific) · Complications · After the Acute Phase (discharge, follow-up, long-term management, prevention) · Evidence (key studies, one line each) · Why the Treatment Order · Epidemiology and Pathophysiology
12. Pearls · Related · Sources

**One home for each kind of fact (2026-10-26).** Each Topic section owns one kind of fact:

| Section | Owns | Does not hold |
|---|---|---|
| Definition and Staging | What it is, diagnostic criteria, disease stages | Triage scales, workup |
| First Steps | Immediate assessment and stabilization when the cause is unknown | Full workup, condition-specific therapy |
| Severity | Grades, risk bands, triage scales, level of care | Interventions |
| Causes | Etiologies as nouns, mimics | Review or consider wording, workup |
| Presentation | History and exam findings | How to investigate them |
| Diagnosis | Named initial orders, then conditional orders with their trigger, what a result changes | Treatment |
| Treatment | Interventions for suspected or confirmed disease: who, drug, route, timing, pre-start checks, what next if it fails | Evidence, label detail, rechecks, stop rules |
| Monitor | What is checked, how, when, and the action: rechecks, targets, stop rules | First actions |
| Escalation | Trigger, named service or level of care, what to have ready | Anything already in Severity or Treatment |
| More Information | Evidence, label detail, guideline differences, rationale | Any warning needed to act safely |

- A fact has one home. A second mention is a short pointer or link, never a copy.
- Anything needed before a drug is started (a contraindication, a baseline test) stays with the dose in Treatment. Rechecks, targets and stop rules go in Monitor.
- A warning that prevents an unsafe action stays visible in Treatment or Monitor, not only in More Information. Evidence numbers (odds ratios, grades) and drug-label text go in More Information.
- Reference and Medication cards follow the same one-home rule; their section purposes differ by variant (Part 2).
- **Header definition:** one sentence, no length cap, that says what it is and what separates it from lookalikes, keeping any defining qualifier. No causes, no treatment.

### 2. Reference card [R]
Interpretation guides, protocols and principles, in fixed variants so they still feel familiar. More Information: Evidence.

- **Interpretation variant** (ECG, acid–base, PFTs, urinalysis, chest x-ray, fluid analysis): Normal Values ⟨inserted⟩ · Stepwise Method (numbered) · Patterns and What They Mean (table) · Worked Examples (ECGs and images ⟨inserted⟩)
- **Protocol variant** (IV fluids, electrolyte repletion, insulin, VTE prophylaxis, transfusion, anticoagulation management): Indications · Choosing an Option (comparison) · Dosing and Protocol ⟨inserted⟩ · Monitoring and Adjustment · Special Populations
- **Chart variant** (antimicrobial coverage, empiric therapy by infection, glucocorticoid equivalents, opioid conversions): How to Read the Chart · Chart (a matrix generated from shared data, never typed by hand) · Caveats

### 3. Medication card [M]
The **only home** for doses. Each indication's dose is a dose item that other cards insert as a dose row.

- **Single drug:** At a Glance · **Dosing** (one dose row per indication) · **Dose Adjustment** (kidney function by CrCl or eGFR band, liver function, dialysis, weight) · **Administration** (IV rates, dilution, timing, oral notes) · **Contraindications and Boxed Warnings** · **Adverse Effects** (common · serious) · **Interactions** (major only, plus Check Interactions) · **Monitor** (what · when · target) · More Information: Pregnancy and Lactation · Overdose and Reversal · Evidence. Header extras: generic name (common brand names) · class. Sources: guideline and official prescribing information.
- **Drug class variant** (e.g. beta-lactams, DOACs, loop diuretics, SGLT2 inhibitors): At a Glance · Mechanism and Shared Effects · Members Compared (table, links to each drug card) · Class-Wide Cautions · Choosing Within the Class. **No doses on class cards.**


---

## Part 3 — Worked example: Hyperkalemia (topic card)
*(Headings only, to show the shape.)*

- Header: Topic · Nephrology and Urology · definition · checked date
- **At a Glance** · **Severity** (scale mild / moderate / severe; monitoring) · **Causes** (one grouped list: pseudohyperkalemia, shift out of cells, impaired excretion (cannot miss), intake) · **Presentation** (symptoms; ECG progression) · **Diagnosis**
- **Treatment:** numbered steps: membrane stabilization · intracellular shift · elimination, each with its dose rows; Compare Onset and Duration row; hyperkalemic cardiac arrest
- **Monitor:** K⁺ recheck times; glucose times after insulin (timelines) · **Escalation**
- **More Information:** Where Guidelines Differ (insulin dose, patiromer) · Special Populations (digoxin toxicity, hemodialysis) · Complications · After the Acute Phase · Epidemiology and Pathophysiology
- Pearls · Related (Acute Kidney Injury) · Sources

---

## Decisions (2026-10-17)
1. Recommendation grades: **not shown**; source number only.
3. Key points (now At a Glance): **3–6 bullets**.
4. Epidemiology and pathophysiology: **collapsed by default** (now under More Information).
5. Additions: **"Common initial orders" in approach cards**; no discharge checklist for now.
6. Added: **Diagnostic test card** (type 8), **Drug class variant** (Medication), **Organism** and **Chart variants** (Reference). Coverage charts and empiric-therapy charts are generated from shared data, so nothing is retyped.


## Decisions (2026-10-18)
1. Topic page layout from the approved redesign: header with definition, based-on line and checked date; Contents menu instead of the section bar; collapsible, remembered sections; one source line per section (removed 2026-10-19 for per-line tags); More Information for deeper material.
2. Approach cards use the condition page's section names where they fit (owner's choice). Merged with Condition into one Topic type on 2026-10-24 (no change for the reader).
3. The other card types follow the same pattern with their own sections (owner approved the proposal); adjust when each type's first card is written.

## Decisions (2026-10-18, owner's review of the first two cards)
1. No "Based on" line in the header; `based_on` stays optional in the front matter (not shown).
2. Nested bullets (one level) for items with sub-items; links woven into the sentence.
3. Approach cards: first-line tests live in Diagnosis with what each result means; Common initial orders holds only non-test orders plus a link to those tests.
4. Condition cards: Causes as one grouped list; "cannot miss" as a tag (only on causes, never as a category name; CARD-WRITING-CHEATSHEET "Consistency rules").
5. Onset and duration comparisons open from a row (`:::onset`), not a table on the page.

- **Consistency (2026-10-23):** `subsection` comes from the system's list in `content/systems.yaml`; tables are at most four columns; every card follows CARD-WRITING-CHEATSHEET "Consistency rules".

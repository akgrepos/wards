# Card types

Settled 2026-10-17; page layout updated 2026-10-18 for the approved redesign (topic pages), and 2026-10-19 for the AKI card redesign (sources per line, one color per job, pathways as their own pages). Defines **8 card types**, each with a fixed set of sections in a fixed order. Shared data (doses, lab values, scores, criteria and similar) appears as **⟨inserted⟩** blocks: content that lives elsewhere and is shown in place, never retyped. How to write the files: `CONTENT-FORMAT.md`.

---

## Part 1 — The topic page every card shares

**Header**
- Type and system tags · title (precise medical term)
- One-line definition, with its source
- "Reviewed" month and year. No "Based on" line (removed 2026-10-18, owner): the per-line source tags and All Sources name the guidelines
- Search aliases (hidden; used by search)
- Top right: the **quote-mark** button (Show Sources: off when a page opens; while on it is highlighted and every line ends in one source pill), the **Contents** button (a menu of the page's sections, the one being read checked, plus Collapse All / Expand All), in one group. Topics with an emergency also get a red **Rapids** button (the Rapids tab's symbol, `staroflife.fill`) that opens the Do Now pop-up: the steps and doses, Start Timed Mode and Open Full Emergency; it is hidden when there is none. No row of section buttons.

**At a Glance** (always first)
- 3–6 bullets: the bottom line you need in 15 seconds at the bedside

**Body**
- The card type's sections, **always in the same order** (Part 2)
- Every section has a 44pt heading that closes and opens it; all start open. Which sections are closed, and where the page was scrolled, are remembered per page on the phone.
- A section that doesn't apply is left out rather than shown empty, so the order of the remaining ones never changes
- No source line ends a section (removed 2026-10-19, owner): sources are shown per line on demand, and All Sources lists them all.
- **Sources per line, on demand** (2026-10-19): with the quote-mark button on, each line (bullet, paragraph, table row, step, note) ends in one pill: its first source and "+N" for the rest, or the stethoscope or check marker when no source is named. Tapping a pill opens a sheet that quotes the line, then lists its sources.

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
- For a topic with a `## Do Now` section (`CONTENT-FORMAT.md`). Listed in the Rapids tab by system, with its one-line hint.
- Red "Rapids" tag, title, **Start Timed Mode** (accent color, not red), then **Do Now**: red numbered steps, each with its "If …" condition line, a Check box for what to check first, one drug per dose row (each opens its dose sheet; an alternative shows under it), warnings as tags, short notes; Note boxes after the steps; one source line for the section (Sources UKKA '26 · KDIGO '20 …).
- Top right: the Topics tab's symbol opens the topic pop-up (At a Glance, then Open Full Topic). One pop-up at a time.
- **Timed Mode** (full screen, no tab bar): the elapsed time in a red timer capsule at the top; Minimize (chevron down) keeps it running in a bar above the tab bar on every screen, which returns to the same step; progress, the current step's condition, Check box and large doses ("Give", "Then Give"), Skip and Mark Given (accent), "Mark … Given Instead" for an alternative; Due Next (from the topic's recheck times) and a log with clock time and time since start, with Undo. End Timed Mode (red text) asks first, then shows a summary: what was given and when, what's due next, Copy Summary and Done. Kept only on the phone, cleared on Done; the timer survives the app closing.

---

## Part 2 — The 8 card types

Each type lists its sections in order (after At a Glance), then its More Information subsections. Pearls, Related and Sources end every card. The substructure under each section is guidance for what goes there.

### 1. Condition card [C]
A disease or syndrome. The main card type.

1. **At a Glance**
2. **Severity**: grades as a scale; diagnostic criteria ⟨inserted⟩ when formal criteria exist; what makes it an emergency (monitoring, level of care, scores ⟨inserted, interactive⟩)
3. **Causes**: categories as one grouped list (bold category name, then its causes), with "cannot miss" marked by a tag; pseudo-conditions and mimics (the differential: diagnosis · distinguishing features · link)
4. **Presentation**: symptoms, atypical presentations, examination findings (grading scales ⟨inserted⟩ from the exam cards)
5. **Diagnosis**: initial tests and why; interpretation and thresholds; further testing; low-value tests to avoid
6. **Treatment**: numbered steps (immediate, then definitive, by severity or subtype); dose rows ⟨inserted⟩
7. **Monitor**: what to trend and when (timelines of recheck times), targets, expected response, triggers to escalate
8. **Escalation**: which specialty and when (general criteria, never institution-specific)
9. **More Information**: Where Guidelines Differ · Special Populations (kidney or liver disease, pregnancy, older adults, immunocompromised, drug-specific) · Complications · After the Acute Phase (discharge, follow-up, long-term management, prevention) · Evidence (key studies, one line each) · Why the Treatment Order · Epidemiology and Pathophysiology
10. Pearls · Related · Sources

### 2. Approach card [A]
A symptom, sign or abnormal result. Uses the condition page's names where they fit (owner's choice, 2026-10-18).

1. **At a Glance**
2. **Definition and Staging**: what counts as abnormal, with thresholds and staging (e.g. the AKI criteria ⟨inserted⟩)
3. **First Steps**: red flags, signs of instability, what to do first
4. **Causes**: a framework (by mechanism, organ, location or acuity), with "cannot miss" and "most common", each linking to its condition card
5. **Presentation**: focused history and focused examination that discriminate between causes
6. **Diagnosis**: first-line tests, then second-line by scenario; interpretation tables (result → likely causes), notes on their limits ⟨Note box⟩
7. **Treatment**: common initial orders (checklist of orders only, not tests; one line links to the first-line tests in Diagnosis), then initial management while the cause is being found
8. **Monitor**
9. **Escalation**
10. **More Information**: Where Guidelines Differ · Special Populations · Complications · After the Acute Phase · Evidence · Epidemiology and Pathophysiology
11. Pearls · Related · Sources

### 3. Reference card [R]
Interpretation guides, protocols and principles, in fixed variants so they still feel familiar. More Information: Microbiology (organism variant) · Evidence.

- **Interpretation variant** (ECG, acid–base, PFTs, urinalysis, chest x-ray, fluid analysis): Normal Values ⟨inserted⟩ · Stepwise Method (numbered) · Patterns and What They Mean (table) · Worked Examples (ECGs and images ⟨inserted⟩)
- **Protocol variant** (IV fluids, electrolyte repletion, insulin, VTE prophylaxis, transfusion, anticoagulation management): Indications · Choosing an Option (comparison) · Dosing and Protocol ⟨inserted⟩ · Monitoring and Adjustment · Special Populations
- **Organism variant** (MRSA, Pseudomonas, ESBL organisms, Candida, and others): Where It Comes From and Risk Factors · Infections It Causes (links) · Resistance Patterns · Treatment Options (⟨inserted⟩ coverage; doses ⟨inserted⟩) · Infection-Control Precautions; Microbiology under More Information
- **Chart variant** (antimicrobial coverage, empiric therapy by infection, glucocorticoid equivalents, opioid conversions): How to Read the Chart · Chart (a matrix generated from shared data, never typed by hand) · Caveats
- **Communication variant** (goals of care, code status, capacity): When It Applies · Framework (steps) · Suggested Phrasing · Legal and Ethical Points (general, not state-specific)

### 4. Procedure card [P]
1. **At a Glance** · 2. **Indications** · 3. **Contraindications** (absolute · relative) · 4. **Preparation** (consent points, equipment checklist, positioning, landmarks and ultrasound views) · 5. **Technique** (numbered steps, one action per step, with images) · 6. **After the Procedure** (care; samples and how to interpret them) · 7. **Complications** (frequency · recognition · management) · 8. **Troubleshooting** · 9. **Procedure Note Checklist** (indication, consent, time-out, site and laterality, technique and ultrasound use, samples sent, estimated blood loss, complications, plan) · More Information: Evidence · Pearls · Related · Sources

### 5. Medication card [M]
The **only home** for doses. Each indication's dose is a dose item that other cards insert as a dose row.

- **Single drug:** At a Glance · **Dosing** (one dose row per indication) · **Dose Adjustment** (kidney function by CrCl or eGFR band, liver function, dialysis, weight) · **Administration** (IV rates, dilution, timing, oral notes) · **Contraindications and Boxed Warnings** · **Adverse Effects** (common · serious) · **Interactions** (major only, plus Check Interactions) · **Monitor** (what · when · target) · More Information: Pregnancy and Lactation · Overdose and Reversal · Evidence. Header extras: generic name (common brand names) · class. Sources: guideline and official prescribing information.
- **Drug class variant** (e.g. beta-lactams, DOACs, loop diuretics, SGLT2 inhibitors): At a Glance · Mechanism and Shared Effects · Members Compared (table, links to each drug card) · Class-Wide Cautions · Choosing Within the Class. **No doses on class cards.**

### 6. Score / calculator card [S]
At a Glance (what it estimates and for whom) · **When to Use** (the population it was validated in) · **Calculator** (interactive; MDCalc link) · **Interpretation** (score → risk → action) · More Information: Limitations · Evidence (derivation and validation studies, and the guideline that recommends it)

### 7. Physical exam card [E]
Supports documentation wording. At a Glance · **Technique** · **Normal Findings** (documentation-ready wording) · **Abnormal Findings** (finding · wording · what it suggests, likelihood ratios where studied · link) · **Grading Scales** ⟨inserted⟩ · **Special Maneuvers** (how · positive finding · accuracy) · More Information: Evidence

### 8. Diagnostic test card [T]
How to use a test; lives in Library › Labs. At a Glance · **When to Order** (and when not to) · **Interpretation** (cutoffs and reference values ⟨inserted⟩; adjusted thresholds) · **Test Accuracy** (sensitivity, specificity, likelihood ratios, by setting) · **False Positives and False Negatives** · **Practical Notes** (sample, timing, turnaround, repeat testing) · More Information: What It Measures · Evidence

The layouts for types 3–8 were proposed with the redesign and approved by the owner (2026-10-18); adjust them when the first card of each type is written.

---

## Part 3 — Worked example: Hyperkalemia (condition card)
*(Headings only, to show the shape.)*

- Header: Condition · Kidney, Electrolytes and Urology · definition · reviewed
- **At a Glance** · **Severity** (scale mild / moderate / severe; monitoring) · **Causes** (one grouped list: pseudohyperkalemia, shift out of cells, impaired excretion (cannot miss), intake) · **Presentation** (symptoms; ECG progression) · **Diagnosis**
- **Treatment:** numbered steps: membrane stabilization · intracellular shift · elimination, each with its dose rows; Compare Onset and Duration row; hyperkalemic cardiac arrest
- **Monitor:** K⁺ recheck times; glucose times after insulin (timelines) · **Escalation**
- **More Information:** Where Guidelines Differ (insulin dose, patiromer) · Special Populations (digoxin toxicity) · Complications · After the Acute Phase · Epidemiology and Pathophysiology
- Pearls · Related (Acute Kidney Injury) · Sources

---

## Decisions (2026-10-17)
1. Recommendation grades: **not shown**; source number only.
2. Procedure cards: **include a short procedure-note checklist**.
3. Key points (now At a Glance): **3–6 bullets**.
4. Epidemiology and pathophysiology: **collapsed by default** (now under More Information).
5. Additions: **"Common initial orders" in approach cards**; no discharge checklist for now.
6. Added: **Diagnostic test card** (type 8), **Drug class variant** (Medication), **Organism** and **Chart variants** (Reference). Coverage charts and empiric-therapy charts are generated from shared data, so nothing is retyped.


## Decisions (2026-10-18)
1. Topic page layout from the approved redesign: header with definition, based-on line and reviewed date; Contents menu instead of the section bar; collapsible, remembered sections; one source line per section (removed 2026-10-19 for per-line tags); More Information for deeper material.
2. Approach cards use the condition page's section names where they fit (owner's choice).
3. The other card types follow the same pattern with their own sections (owner approved the proposal); adjust when each type's first card is written.

## Decisions (2026-10-18, owner's review of the first two cards)
1. No "Based on" line in the header; `based_on` stays optional in the front matter (not shown).
2. Nested bullets (one level) for items with sub-items; links woven into the sentence.
3. Approach cards: first-line tests live in Diagnosis with what each result means; Common initial orders holds only non-test orders plus a link to those tests.
4. Condition cards: Causes as one grouped list; "cannot miss" as a tag (only on causes, never as a category name; CONTENT-FORMAT "Consistency rules").
5. Onset and duration comparisons open from a row (`:::onset`), not a table on the page.

- **Consistency (2026-10-23):** `subsection` comes from the system's list in `content/systems.yaml`; tables are at most four columns; every card follows CONTENT-FORMAT "Consistency rules".

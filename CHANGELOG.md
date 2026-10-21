# Changelog

What changed in each version of Wards, newest first. The version is shown in Settings (gear on Home).

## 2026.10.21.16

**Calculators.** Six scores and formulas now work inside the app, offline: CURB-65, Wells for PE, Wells for DVT (one sheet, switch at the top), serum osmolality, anion gap and corrected sodium. Tap the score's name in a card, or the Calculate button in its box. Tick the items for a running total and risk level, or type the lab values for the result as you type. Nothing is saved; Reset clears it. The MDCalc link is the last row of each calculator, with its sources.

## 2026.10.21.15

**Clearer lists.** Lines that packed three or more items together with semicolons are now short bullet lists (for example the HHS and DKA presentation lines, Hyponatremia treatment, Complicated UTI regimens). Each bullet keeps its sources. Sentences with two linked clauses, table cells and numbers are unchanged; no wording, dose or number changed.

## 2026.10.21.14

**Fix: Rapids pages.** The "or" marker on alternative steps is now a clean, centered "OR" ring in light and dark, and keeps its highlight ring when it is the current step in Timed Mode. The source pills at the bottom of the Do Now card now sit inside the card with room around them, so a second row is no longer cut off.

## 2026.10.21.13

**Fix: jumping to a heading inside a section.** Tapping Potassium, Magnesium, Phosphate or Calcium in Contents (and any link to a heading inside a section) now stops with the heading in view instead of tucked under the top bar.

- **Severity bands** (DKA, KDIGO, COPD) show their title as a plain heading instead of an empty colored box.

## 2026.10.21.12

**Design pass, step 4: titled criteria boxes and a Contents menu that lists the electrolytes.**
- **Every criteria box now has a title** saying what it defines and the source year, for example "SIADH diagnostic criteria, 2013". Scores such as Wells and CHA₂DS₂-VASc are labeled "Score" and end with their MDCalc link.
- **Electrolyte Repletion's Contents menu** now lists Potassium, Magnesium, Phosphate and Calcium under Dosing and Protocol; tapping one jumps straight to it (and opens the section if it was closed).

## 2026.10.21.11

**Design pass, step 3: tidier dose popups and one style for sources.**
- **Dose popups** are now left aligned: the population and route on top, the dose large with its frequency underneath, then separate sections (Give when, Adjust, Alternative, Cautions, Note) divided by thin lines. Each "Adjust" row shows the situation in bold over its change.
- **Sources** now appear the same way everywhere: small blue tags (or the stethoscope / check marker) instead of a long "Sources" text line, in dose popups, Rapids Do Now and pathways.
- No clinical wording or doses changed.

## 2026.10.21.10

**Design pass, step 2: color-coded severity and staging that stacks.**
- **DKA severity** is now yellow, orange and red like its table, on the card and in the popup alike. Each level is a full-width colored band with its name on top and the details listed underneath, so long text fits.
- The same stacked bands are used for **KDIGO AKI stages** and both **COPD exacerbation severity** tables.
- Why it was missing: color used to switch on only when a table's first column happened to be named "Stage". Each table now says in its own data whether it is stacked and which colors it uses.
- **Design system** (shared) gained a "bands" look for staging lists. No clinical wording changed.

## 2026.10.21.9

**Steps that are choices no longer look like a sequence.**
- Where two steps are alternatives, the second now shows an outlined **"or"** instead of the next number, and the numbering carries on after it (3, or, 4). Marked: DKA/HHS insulin (Rapids), Atrial Fibrillation (Rapids: cardioversion, rate control, decompensated rate control; Treatment: unstable vs rate control), Hypoxemic Respiratory Failure (high-flow vs NIV), Hypokalemia and Hyponatremia (by severity), Cellulitis (severe, abscess, necrotizing). Wording and doses are unchanged. Tell me if any other list should change.

## 2026.10.21.8

**Design pass, step 1: tighter numbered steps and clearer Rapids text.**
- **Numbered steps** (Treatment in blue, Rapids in red) are more compact, so more of each step fits on screen; the Timed Mode checkmarks and ring work as before.
- **Rapids text:** everything you act on or decide on is now full strength, step names are larger, and "If:" is bold. Gray is kept for source markers and pure explanations. Warnings use the red warning tag.
- **Search:** the page behind the search screen no longer moves when you drag with the box empty, so the bar should stay put.
- **ECG full screen** says "Raw recording" so it is clear the trace is unsmoothed (the card figure is smoothed).
- **Design system** (shared) gained: compact steps, stronger step text, a title line on boxes, one-level Contents sub-items, and a check row. The last three are not used in the app yet.

## 2026.10.21.7

**Fixes and a simpler Library, from your phone testing.**
- **Tab order:** Home, Topics, Rapids, Library.
- **Status bar:** the strip behind the clock now matches the page color on topic cards, and follows light/dark when you switch while the app is open.
- **Show Sources** is now a row in the Contents menu (next to Collapse All), freeing room in the top bar.
- **Smoother scrolling:** the floating search and tab bar should no longer shake while you scroll (please tell me if you still see it).
- **ECG full screen** keeps its measurement labels, and they zoom with the figure.
- **Library:** removed Scores and Calculators (scores are MDCalc links on the cards) and Criteria and Staging (criteria and staging stay on their cards). Medications and Labs are hidden until they have cards. Old links to those pages open the Library.
- **Also new in 2026.10.21.6, not mentioned then:** the Topics tab has a **Pulmonary** system (the three new cards), and Home's default Rapids shortcuts now show **COPD Exacerbation** instead of Hyponatremia.

## 2026.10.21.6

**Three new cards.**
- **COPD Exacerbation** (a Rapids page with Timed Mode): controlled oxygen, bronchodilators, steroids and antibiotics, with doses you can tap.
- **Hypoxemic Respiratory Failure** (a Rapids page with Timed Mode): oxygen targets and escalation, step by step.
- **Venous Thromboembolism: Diagnosis**, with a new **PE Workup** pathway: tap your answers (instability, clinical probability, D-dimer, imaging) to reach what to do next.
- Scores on these cards (Wells, revised Geneva, PERC, YEARS, ROX index, A–a gradient and others) open their MDCalc calculator.
- These cards have had the internal accuracy check but not yet the independent review.

## 2026.10.21.5

Small polish on the MDCalc links: VoiceOver now reads the score name once ("PSI. Opens MDCalc in Safari, needs internet.") and the note at the bottom of a card is one plain sentence.

## 2026.10.21.4

**Score and calculator names now open the calculator on MDCalc.**
- Every score and calculator named on a card is now a blue link with a small arrow, for example CURB-65, PSI, CHA₂DS₂-VASc, HAS-BLED, GRACE, TIMI, SOFA, qSOFA, NEWS, SIRS, LRINEC, anion gap, FENa, FEUrea, eGFR, CrCl and corrected calcium. Tap one and the MDCalc calculator opens in Safari; tap Done to come back to Wards where you left off.
- It needs internet (offline, the calculator simply doesn't load; the card itself still works). A card that has such links says so at the bottom, under Sources.
- Links are on all 15 cards, the Sepsis criteria, the DKA pathway and the cellulitis regimen boxes. The words on the cards are unchanged.
- Behind the scenes: each MDCalc address is stored once (50 calculators, all checked), and the automatic checks now fail if a future card names a score without its link.

## 2026.10.21.3

Pathways are simpler decision trees (Hyperkalemia: Treatment, AKI: Cause Workup and DKA: Treatment):
- Each **question** is a short gray heading, and its **answers are buttons** side by side under it. Each answer leads to another question or to a box with what to do and the doses.
- **Tap any answer at any time** to choose it: it turns solid blue with a checkmark, the other answers on that level turn gray (still tappable), and everything only they lead to fades, with dashed lines. Tap it again to undo; **Clear** (top right, was Start Over) forgets every choice. Choosing an answer on a branch you'd ruled out switches you onto it.
- **Cleaner lines**: every line leaves a box straight down, turns once just above the box it points to, and lines into the same box join at one point with one arrowhead. No line runs through a box.
- No more numbered levels, dashed level lines, "Start", "Now" or "End of Pathway" tags; urgent boxes keep their red tint and Treat Now tag.
- **Current Step** jumps to the next question you haven't answered.
- AKI: Cause Workup is laid out again so every answer sits under its question; the wording and doses of all pathways are unchanged.

## 2026.10.21.2

Three new topics (Wave 1, fourth batch):
- **Sepsis and Septic Shock** (Critical Care), with a **Rapids page**: cultures and lactate, antibiotics within 1 hour (dose rows for piperacillin-tazobactam, cefepime and vancomycin), the crystalloid bolus, norepinephrine to MAP 65 (60–65 at 65 and older), vasopressin, hydrocortisone, source control. The card follows the **Surviving Sepsis Campaign 2026** guidelines: screening with NEWS or SIRS rather than qSOFA, antibiotic timing by how likely sepsis is, an empiric regimen box (resistant-organism and anaerobic coverage only with risk), extended β-lactam infusions, fluids guided by lactate and capillary refill, the vasopressor order, steroids, and supportive care. The 2026 IDSA-led hospital position paper is shown beside it where the two differ.
- **Diabetic Ketoacidosis and Hyperosmolar Hyperglycemic State** (Endocrinology): HHS is covered in full on this card. A **Rapids page** (fluids, potassium before insulin, insulin infusion, dextrose, precipitant) and a new pathway, **DKA: Treatment** (Pathway row under the title, and Library › Pathways): fluids, potassium by level, insulin by type of crisis (IV, SC for mild DKA, lower-rate for HHS), dextrose, bicarbonate, monitoring and resolution. Criteria and severity tables, the SC insulin option for mild DKA, HHS correction limits, transition to SC insulin, and US vs UK differences.
- **Hyperglycemia in the Hospitalized Patient** (Endocrinology): targets on the ward and in the ICU, when to start insulin, **starting doses** (basal-bolus, basal plus correction), steroids, tube feeds, hypoglycemia levels and treatment (oral glucose, dextrose, glucagon), CGM and pumps, discharge. Titration will come with the inpatient insulin card.
- Dose rows that give a percentage now read "5–10%" rather than "5–10 %".

## 2026.10.21

ECG figures on four cards, drawn to true ECG scale (25 mm/s, 10 mm/mV) on a 1 mm and 5 mm grid:
- **Atrial Fibrillation** (Diagnosis): a real lead II rhythm strip with each R-R interval measured (602, 748, 872 ms) and the stretch where P waves would be shaded.
- **Acute Coronary Syndrome: NSTEMI and Unstable Angina** (Diagnosis › ECG, under the criteria line): a real lead V5 tracing with the PR baseline dashed, ST depression at the J point (−0.9 mm) and the inverted T wave (−4.0 mm).
- **Hypokalemia** (Presentation): a real lead V5 tracing with a flat T wave (0.7 mm) and a taller U wave (1.4 mm).
- **Hyperkalemia** (Presentation): four drawings of the progression (peaked T waves; flat P and long PR; wide QRS; sine wave) with the T height, PR and QRS marked. No reusable real recording exists, so these are drawn.
- Tap a real tracing (the corner button) to see every stored lead for the whole recording, unsmoothed, on the grid: scroll sideways and zoom with − / + or a pinch.
- The real tracings come from two open research databases (PTB-XL and a Chinese 12-lead database on PhysioNet), credited under each figure with the record number and license. Labels grow with Text Size; colors follow light and dark.

## 2026.10.20.4

Guideline check of all twelve topics, with updates where a newer guideline is out:
- **Acute Coronary Syndrome: NSTEMI and Unstable Angina** now follows the **Fifth Universal Definition of Myocardial Infarction (2026)**. MI is classified by setting as **primary** (spontaneous, from an acute coronary problem; previously type 1), **secondary** (supply–demand mismatch from another illness; previously type 2) or **procedure-related** (within 30 days of a cardiac procedure), each with what confirms it. Updated: the MI criteria box, troponin lines (sex-specific 99th percentile, chronic injury, kidney disease, assay interference), ECG lines (occlusion patterns without ST elevation, pathological Q waves) and MINOCA (now myocardial injury with non-obstructive coronary arteries). A new side-by-side note shows that the 2025 US ACS guideline still uses the old type numbers.
- **NSTE-ACS, cholesterol:** LDL goals from the 2026 US lipid guideline (<55 mg/dL at very high risk, which covers most patients with atherosclerotic disease; otherwise <70), and a PCSK9 antibody no longer has to wait for ezetimibe.
- **IV Fluids:** now on the Surviving Sepsis 2026 guidelines: crystalloid alone suggested over adding albumin, saline with traumatic brain injury, either a liberal or restrictive approach after the first boluses, and fluid removal once shock settles. The sepsis fluid sheets are updated to match.
- **Pyelonephritis and Complicated UTI:** what to use once the culture shows an ESBL, AmpC, carbapenem-resistant or difficult-to-treat *Pseudomonas* organism, from IDSA's 2026 resistant gram-negative guidance.
- **Hypokalemia:** screen for primary aldosteronism in resistant hypertension even when potassium is normal (2025 US blood pressure guideline).
- **Hyponatremia:** cirrhosis lines follow the 2025 AGA update (fluid restriction amount, albumin or a vasoconstrictor when severe, options when refractory, workup).
- **Hyperkalemia:** its UK guideline link now opens the July 2026 version.

## 2026.10.20.3

Pathways rebuilt as short flowcharts:
- **Hyperkalemia: Treatment** and **Acute Kidney Injury: Cause Workup** replace the old whole-card maps. Each covers one task, laid out like a printed algorithm: numbered levels (Stabilize, Shift, Remove, Monitor; Confirm, Postrenal, Prerenal, Intrinsic), with equal choices side by side (Mild, Moderate, Severe) and each leading to its own box.
- Treatment boxes now show the card's own dose rows; tap one for the dose sheet. Links back to the card only where they help.
- The answer you pick fills blue with a checkmark; routes you've ruled out fade; steps still ahead stay readable. A black "Now" tag marks where you are (the old blue outline that showed only at the corners is gone).
- Zoom rebuilt: pinch no longer jumps, and − and + sit together at the bottom right. **Current Step** appears when you zoom out or scroll away and brings you back to your next question with all its answers.
- A card can now have more than one pathway; each gets its own row under the card's title and in Library › Pathways.
- Answer buttons have more room inside, and blue text on light-blue buttons is darker (lighter in dark mode) so it's easier to read everywhere in the app.

## 2026.10.20.2

Three new topics in Cardiology (Wave 1, third batch):
- **Atrial Fibrillation** (condition): stages, the triggers to look for, IV rate control chosen by ejection fraction and blood pressure, the CHA₂DS₂-VASc table and who needs anticoagulation, dose rows for apixaban, rivaroxaban, dabigatran and edoxaban (kidney dose changes on each sheet), anticoagulation around cardioversion, and when to consider rhythm control. The US and European stroke scores, and their cardioversion timing, are shown side by side.
  - New **Rapids page: AF with rapid ventricular response.** Do Now: cardiovert if unstable; IV rate control (metoprolol or diltiazem, or amiodarone or digoxin when decompensated or hypotensive); no AV nodal blockers with pre-excitation. Opens from the red button on the topic and from the Rapids tab, with Timed Mode.
- **Acute Coronary Syndrome: NSTEMI and Unstable Angina** (condition): the universal definition of MI, high-sensitivity troponin, when to go to the catheterization laboratory by risk (immediate, within 24 hours, before discharge, or selective), aspirin, the anticoagulant choices, P2Y12 inhibitors (which one, and when before angiography), statin, β-blocker and other in-hospital therapy, and the length of dual antiplatelet therapy. US and European differences on P2Y12 pretreatment and choice are side by side.
- **Acute Decompensated Heart Failure** (condition): warm/cold and wet/dry profiles, triggers, natriuretic peptide cutoffs, IV loop diuretic dosing with urine sodium and urine output checks, what to add for diuretic resistance, nitroglycerin, when to go to the ICU, and which heart failure medicines to continue, hold or start before discharge (doses come with the later heart failure cards).

## 2026.10.20

Favorites removed:
- The star at the top right of each page is gone. That spot is left empty, so the bar holds only Show Sources and Contents (plus the red Do Now button on topics with an emergency).
- Home no longer has a Favorites section; it shows Continue Reading, Rapids shortcuts and Recent.
- Settings no longer has "Clear Favorites". Any favorites saved by an earlier version are erased from this iPhone the first time the new version opens.

## 2026.10.19.14

Three new topics in Infectious Disease (Wave 1, second batch):
- **Community-Acquired Pneumonia** (condition): the IDSA/ATS severe-CAP criteria, who needs cultures and urinary antigens, inpatient and outpatient antibiotic regimens, when to add MRSA or *Pseudomonas* coverage and when to stop it, short courses once clinically stable, oseltamivir, and hydrocortisone for severe CAP. Where the 2025 ATS guideline and IDSA disagree (antibiotics when a virus is found; steroids) both are shown side by side.
- **Cellulitis and Erysipelas** (condition): severity, mimics, which patients need MRSA coverage, oral and IV regimens, 5-day courses, recurrence prevention, and short pointers for abscess and necrotizing infection (red flags, urgent surgery, empiric regimen).
- **Pyelonephritis and Complicated Urinary Tract Infection** (condition), from the 2025 IDSA guideline: what makes a UTI complicated, the four steps for choosing the first antibiotic, imaging, source control, switching to oral, and 5–7 or 7-day courses.

New: **regimen boxes.** A gray "Regimen" box lists a treatment's options joined by "Or", with "Plus" between drugs given together and "One of:" above a choice of drugs. Every drug is still its own dose row; tap it for the dose sheet (kidney dose changes, cautions). Antibiotic doses are shared, so later cards reuse the same rows.

Fixed: numbered steps (in Treatment and elsewhere) showed blank circles; the numbers are back.

## 2026.10.19.13

Dose details tightened on existing topics (no new topics):
- **Acute Kidney Injury** and **IV Fluids:** the albumin dose for AKI in cirrhosis (1 g/kg a day, up to 100 g a day, for 2 days) now cites the newest liver-society guidance and says it follows stopping diuretics and treating the trigger.
- **Electrolyte Repletion** and **Hypokalemia:** with severe kidney impairment, potassium now reads as the labels put it (start low, recheck every 2–4 hours on IV; the IV potassium chloride labels list kidney failure as a contraindication). The unverified "cut the rate by 50–80%" figure is removed.
- **Potassium for prevention on diuretics:** the dose sheet now says to adjust to the potassium level.

## 2026.10.19.12

Pathways are now **one large map of the whole card**, for Acute Kidney Injury and Hyperkalemia.
- Open it from the new **Pathway** row under the card's title, or from Library › Pathways.
- Every box is always drawn. Tap an answer and the route fills in; boxes off your route dim. Pinch to zoom, or use − Fit +.
- Boxes link to the card itself instead of copying it: a section or one of its steps, criteria, dose sheets, other cards and the Rapids page. Back returns to the map with your answers kept; Start Over clears them.
- Detours rejoin the main path (dashed line), e.g. AKI: relieve the obstruction, then "Relieved, and AKI resolving?" No → back to volume status.
- The wording now matches the cards (checked by an independent reviewer); the old copied text is gone.
- The test layouts (I, K, A, L, M) and the letter switch are removed.
- Smoother zooming on large maps: pinching moves only the map layer, and the map isn't redrawn until you let go.

## 2026.10.19.11

Three new topics in Kidney, Electrolytes and Urology (Wave 1, first batch):
- **Hyponatremia** (condition), with a Rapids page for severe symptoms: hypertonic saline boluses, rechecks, correction limits and how to prevent or reverse overcorrection. The topic covers causes by tonicity and volume, the SIADH criteria, urine tests, treatment by symptoms and cause (fluid restriction, urea, tolvaptan), and the US and European guidelines side by side.
- **Hypokalemia** (condition): severity, causes, the urine potassium and acid–base workup, and treatment using the same potassium and magnesium doses as Electrolyte Repletion.
- **IV Fluids: Selection and Dosing** (reference): what each fluid contains, balanced fluids vs saline, resuscitation and maintenance doses, replacement, albumin in cirrhosis, and the main trials.

## 2026.10.19.10

Topic pages: the "When to Call" section is now called **Escalation** (consults, ICU, transfer). Its content is unchanged, and old links to the section still open it.

## 2026.10.19.9

Pathway pages: new test layout **M · Flowchart**. The switch now reads I · K · A · L · M.
- Open Flowchart shows the whole pathway as one traditional flowchart, full screen, with every step and every answer always drawn.
- Pinch to zoom (or use − Fit +) and drag to move around.
- Tap an answer in a row: it fills in blue and the route continues from it; the other answers in that row stay gray, and steps off your route are dimmed. Answers further down light up (tinted blue) once their question is on your route.
- Only standard pieces: buttons for answers, cards for steps, Caution and End of Pathway tags, straight right-angled lines.

## 2026.10.19.8

Pathway pages: J (Drill-down) is replaced by **A · One step at a time**. The switch now reads I · K · A · L.
- A shows only the current step, large, with a stage bar on top. Your last answer sits above the step with Change; Your Path lists every earlier answer (tap one to go back to it).
- Actions show their doses with Continue and Previous Step; the last step is the result with End of pathway, links back to the card and Start Over.

## 2026.10.19.7

Pathway pages: a new set of test layouts, matching the letters on the design canvas. The switch at the top shows just the letter:
- **I · Stages** (kept, opens first): one list of the stages; finished stages fold to one line with Change.
- **K · Choice lists** (new): one page in the style of Settings. Each question is a list; tap your answer and it gets a checkmark (tap another to change it). Doses appear in their own sections; Caution is red.
- **J · Drill-down** (new): each step is its own page. Tap an answer to open the next step; the back button at the top left goes back a step. Actions show their doses with a Next row; the last page has Done, which returns to the card.
- **L · Full screen** (new): Start Pathway opens the pathway over the whole screen, one step at a time, with the answers low on the screen within thumb reach, Previous Step, and Close at the top left. Done at the end returns to the card.
- Tree (B) and Map (E) are gone.

## 2026.10.19.6

Pathway pages: a new set of test layouts, as you asked (switch at the top; Stages opens first):
- **Stages** (kept, your top choice so far): one list of the stages; finished stages fold to one line with Change.
- **Tree** (new, mock-up B): the whole pathway as one scrolling decision tree. A line down the left joins the steps, grouped by stage. Your answer stays in place; the other answers become "Other answer" links that switch the route. Stages not reached are dotted, and the line ends in a square End marker.
- **Map** (new, mock-up E): a small chart of your route fills the page (your route outlined in black, other answers as gray boxes you can tap to switch, End as a rounded box), with the current step in a panel at the bottom. The panel shows everything since your last answer, so doses are always readable; tap its grabber to make it taller.
- Flowchart and Steps are gone for now.

## 2026.10.19.5

Pathway pages now work, as a test with three layouts to try (switch at the top of the page; the app remembers your pick):
- **Flowchart:** boxes and arrows. Tap an answer box to choose it; your route is drawn in black, and the answers you didn't choose stay as boxes saying where they would lead (tap one to switch). The route ends in a rounded End box.
- **Stages:** one list of the stages. Finished stages fold to one line with your answer (tap Change to reopen), the current stage is open, later stages wait in gray, and the list ends with End of pathway.
- **Steps:** one step at a time, with every stage on a rail beside it (above it at large Text Sizes). Actions need Continue; Back undoes the last step.
- All three: Caution steps are red, doses open the dose sheet, Start Over at the top right, and at the end links back to the card. Answers carry over when you switch layouts and clear when you leave the page.
- The Hyperkalemia Rapids page now has the same Pathway row as the topic page.

## 2026.10.19.4

New card: Electrolyte Repletion (Kidney, Electrolytes and Urology › Reference), the third pilot card.
- Potassium, magnesium, phosphate and calcium in adults: when to replete, when IV beats oral, and when not to replete (for example, low total calcium with low albumin).
- One dose row per drug and route, each opening its dose details: oral and IV potassium chloride (standard rate and the faster monitored rate), magnesium sulfate and oxide, potassium phosphate by phosphorus level, sodium phosphate, oral phosphate tablets, IV calcium gluconate (bolus and infusion), calcium chloride and oral calcium carbonate. Rate limits, maximums, kidney adjustments and cautions come from the FDA labels.
- Monitoring (when to recheck each level), and special situations: kidney impairment, heart disease and digoxin, diabetic ketoacidosis and refeeding risk.
- Evidence: the 2024 TIGHT-K trial and a 2026 magnesium study, both finding no benefit from aiming higher.

## 2026.10.19.3

Rapids and Timed Mode, as approved on the mock-ups:
- The Rapids tab lists emergencies by system, each with a one-line hint. Hyperkalemia is the first one.
- Home's Rapids shortcuts open the emergency directly. Tap Edit to choose which ones (up to four).
- An emergency page has Start Timed Mode at the top, then the Do Now steps in red: when each step applies ("If ECG changes"), what to check first, one drug per dose row (tap for the dose details; calcium chloride shows under calcium gluconate for cardiac arrest), and warnings such as Hypoglycemia. The button at the top right shows the topic's At a Glance, with Open Full Topic.
- The Hyperkalemia topic page has a red button at the top right that shows the Do Now steps, with Start Timed Mode and Open Full Emergency.
- Timed Mode fills the screen and shows the time since you started. It shows one step at a time with large doses; tap Mark Given or Skip for each dose. The log shows the clock time and the time since start for each dose; Undo takes back a mistaken tap. Due Next shows the next glucose and potassium checks.
- The down arrow at the top left minimizes Timed Mode: the timer stays in a bar above the tabs on every screen; tap it to go back to the same step. It keeps running if you close the app.
- End Timed Mode asks first, then shows a summary of what was given and when and what's due next, with Copy Summary. It stays on this iPhone only and is cleared when you tap Done.
- No clinical content changed: the Do Now steps use the Hyperkalemia card's existing lines, doses and sources.

## 2026.10.19.2

Fewer dotted values: a value is underlined and tappable only when its pop-up tells you something the line doesn't already say.
- Acute Kidney Injury: the urinary indices table (FENa, FEUrea, urine sodium, urine osmolality) is plain text; those pop-ups only repeated the table.
- Hyperkalemia: no dotted values left. The potassium cutoffs (≥6.0 for an ECG, ≥6.5 severe, >6.5 for calcium without an ECG) and the glucose cutoffs (<126 and >200) were plain repeats of their line.
- Still tappable: the KDIGO criteria name (opens the full criteria), every dose row (opens the dose details), and the two contrast eGFR cutoffs in AKI Treatment, whose pop-ups now say only what the line doesn't (not when saline is contraindicated, e.g. heart failure; only in individual high-risk circumstances).

## 2026.10.19

The Acute Kidney Injury card, redesigned as you approved on the mock-up:
- A new quote-mark button at the top of every card shows where each line comes from. Tap it and every line ends in a small blue tag with its first source ("KDIGO '12 +1"); tap a tag to see that line and all of its sources. Tap the button again to hide them. It starts off each time you open a card.
- The long "Sources …" list at the end of each section is gone; the tags on each line and All Sources at the bottom replace it.
- One color, one job: blue means you can tap it; red means danger; yellow, orange and red only grade severity; an indigo box holds criteria; a beige box holds notes; tables are gray. Each box has its label ("Criteria", "Note", "Table").
- KDIGO staging shows as three stage rows with colored "Stage 1–3" chips, each with its SCr and urine output criteria.
- Diagnosis: the urinary indices table now compares prerenal with ATN (FENa, FEUrea, urine sodium, urine osmolality, sediment), with a note that values in between are indeterminate and that postrenal AKI is found by bladder scan and urinary tract ultrasound.
- Pathways are becoming their own pages. For now a card shows one "Pathway · Open" row, which opens an empty page until the new pathway pages are designed. This applies to Hyperkalemia's treatment pathway too.
- Hyperkalemia gets the same source button, and its mild, moderate and severe scale now uses the yellow, orange and red severity colors.
- The Settings gear on Home is redrawn closer to Apple's gear symbol: short rounded teeth and a larger center ring.
- At the largest Text Sizes, long section titles and words wrap instead of pushing the page sideways, and each stage's chip sits above its criteria.
- Library › Pathways now says each pathway has its own page.

## 2026.10.18.7

Changes from your review of the Acute Kidney Injury and Hyperkalemia pages:
- The "Based on …" line under the title is gone; each section's source line and All Sources still name the guidelines.
- Links to other pages are part of the sentence (e.g. "Hyperkalemia" in First Steps) instead of a separate name in brackets.
- Lists with sub-items use one level of indented bullets: the RRT referral item in First Steps and Cannot miss in Causes.
- AKI: Diagnosis keeps the first-line tests with what each result means; Common initial orders now lists only orders (stop nephrotoxins, strict intake and output, daily weights, renal dosing, bladder scan) plus a link to the tests.
- Hyperkalemia causes are one grouped list: Pseudohyperkalemia, Shift out of cells, Impaired excretion (marked Cannot miss) and Intake.
- Hyperkalemia: the Onset and duration table is replaced by a "Compare Onset and Duration" row in Treatment that lists every treatment, fastest first. Each dose pop-up still shows its own onset and duration.
- Flowcharts: answer choices sit on a gray panel so they look tappable before you tap. The map shows only the path you chose; the other answers are dashed boxes you can tap to switch paths. Start Over now resets the map too, and map boxes have more room for their text.
- Sliding a table sideways (like KDIGO staging) no longer shows a scroll bar under the first column.
- The fade under the top buttons and above the tab bar is longer and softer.
- Pop-ups: dragging from tall down to half height is now one smooth motion.
- Recheck times (1 h, 2 h, …) are plain labels on a small timeline instead of buttons that did nothing.
- Opening a page from Continue Reading or Recent goes straight to where you were, with no brief flash of the page's top.
- A value is dotted (tappable) only when its pop-up adds something. The mild, moderate and severe values on the Hyperkalemia scale are now plain text.
- Tables keep a clear gap between columns at every Text Size; a long word in the first column wraps (with a hyphen) instead of crowding the next column.

## 2026.10.18.6

- At the largest Text Sizes, the "Update Ready" message now puts its Later and Reload buttons below the text instead of squeezing the text into one word per line under the buttons.
- The Contents and star buttons at the top keep their icons inside the round button at every Text Size, as iPhone apps do.
- The small arrows, magnifying glass and close "x" built into lists, search and sheets now use the same thinner lines as the other icons.

## 2026.10.18.5

- At the largest Text Sizes, a long page title at the top (like Acute Kidney Injury) now ends in "…" before the Contents and star buttons instead of running underneath them. Titles stay centered whenever there's room.

## 2026.10.18.4

- All icons redrawn to look much closer to Apple's own: thinner lines, the same shapes and proportions, and solid versions in the tab bar and the colored tiles, as iPhone apps use.
- Details added where Apple's icons have them, for example the chimney and door on Home, the airways in the lungs, the markings on the test tubes and the folds of the brain.
- The organ icons Apple doesn't make (stomach, liver, kidney, thyroid, ribbon) were reshaped to match.

## 2026.10.18.3

- New topic pages. Each opens with its type and system, a one-line definition, the guidelines it's based on and when it was last reviewed.
- Sections in the same order on every topic: At a Glance, Severity, Causes, Presentation, Diagnosis, Treatment, Monitor, When to Call, More Information, Pearls, Related and Sources. Acute Kidney Injury uses the same names where they fit (Definition and Staging, First Steps).
- Tap a section's heading to close or open it. The app remembers which sections you closed and where you were on each page.
- The Contents button at the top right lists the sections (the one you're reading is checked) and can collapse or expand them all. It replaces the row of section buttons.
- More Information holds the deeper material, each part closed until you tap it: where guidelines differ (side by side), special populations, complications, after the acute phase, evidence, epidemiology and pathophysiology.
- One source line at the end of each section instead of a gray tag on every line. Tap it for that section's sources, each with a View Citation link. The stethoscope still marks common clinical practice.
- Every dose is its own row, one drug per row. Tap it for the dose sheet: dose, rate, when to give, when to repeat, onset and how long it lasts, boxed warning, an alternative, cautions, Check Interactions (Medscape, opens in Safari) and sources. Fields are filled only where the existing sources say so.
- Severity shows as a colored scale, recheck times as small time chips, treatment as numbered steps, and guideline disagreements side by side.
- Tables keep their first column in place while you swipe sideways.
- Clearing Recent and Continue Reading in Settings also forgets where you were on each page.

## 2026.10.18.2

- New icons chosen to fit each place, modeled on Apple's SF Symbols: a star of life for Rapids, a clipboard with a heart for Topics, a medical kit for Library, and a house for Home.
- Systems got clearer icons too (for example kidney, ECG trace, microbe, brain, lungs), and Library's lists now show a calculator sign, checklist, flowchart, pills and test tubes.

## 2026.10.18

- New layout: four tabs in a floating bar at the bottom (Home, Rapids, Topics, Library) plus a round search button.
- Home (now titled "Reference"): Continue Reading takes you back to the topic and section you were reading; Favorites and Recent (last five pages). These are kept only on this iPhone.
- A star at the top right of each page adds it to Favorites.
- Topics lists the systems with colored icons; systems without topics yet show "Coming Soon".
- Library groups Tools (scores and calculators, criteria and staging, the Medscape Drug Interaction Checker, which opens in Safari) and Reference (medications, pathways, labs and tests). Criteria and pathways already list what's in the app; the rest fill in as content is added.
- Rapids (emergencies) has its own tab; rapid pages with Do Now steps arrive in a later update.
- Search finds pages by name or alias (for example "hyperK"). The field sits at the bottom; Close returns to where you were.
- Back always has somewhere to go, and is named for the page it returns to. The app reopens on the last page only if it was open in the last 30 minutes.
- "Page Not Found" has a Go to Home button.
- The "Update Ready" banner sits above the tab bar, and says so if an update didn't finish installing.
- Settings (gear on Home) shows the version and can clear what's kept on this iPhone.

## 2026.10.17.7

- New card: Acute Kidney Injury (Renal → Approach). KDIGO definition and staging, a step-by-step evaluation flowchart, urine index cutoffs, and initial management by stage and situation.
- Hyperkalemia reworded in a more clinical, concise style.
- A stethoscope beside a line marks common clinical practice that doesn't come from a specific source.

## 2026.10.17.6

- Doses, cutoffs and sources now open their sheet right where you are reading. Before, the sheet could open off-screen after scrolling.
- Sheets slide up, can be dragged taller or swiped down to close, and close when you follow a link.
- Each page shows its title once: large at the top, then small in the bar after you scroll.
- Back returns you to where you were in the list or card, and the app reopens on the card you were reading if iOS closed it.
- The section bar keeps the current section in view, and jumping to a collapsed section opens it.
- Doses and cutoffs are easier to tap and show a pressed look; links are a clearer blue.
- Tables keep their first column in place while you scroll sideways.
- The "Update Ready" banner moved to the bottom, so it never covers Back, and has a "Later" button.
- No more white flash when the app opens in dark mode. Text stays at a comfortable width on iPad and in landscape.

## 2026.10.17.5

- First card: Hyperkalemia, under Renal → Electrolyte Disorders. It has a step-by-step treatment flowchart, tappable doses and cutoffs, and a source on every line.
- Systems now group their condition cards into topics (such as Electrolyte Disorders), listed alphabetically between Approach and Reference.

## 2026.10.17.4

- New home screen: the 16 systems and the Library, ready for cards. Each system lists its cards under Approach, Conditions and Reference.
- Card pages are ready: sections in a fixed order, a bar to jump between sections, tappable doses and cutoffs, a grey source on every line, and step-by-step flowcharts. No cards have been added yet.

## 2026.10.17.3

- The "Update Ready" banner now follows your iPhone's Text Size, like the rest of the app.

## 2026.10.17.2

- New app icon: a reference card with a blue medical plus. To see it on your Home Screen, delete Wards and add it again from Safari.

## 2026.10.17

- First version of the app: a home screen with no entries yet.
- Works offline once opened, and can be added to the Home Screen.
- Follows your iPhone's light/dark appearance and Text Size.
- Shows "Update Ready" with a Reload button when a new version has downloaded.

# Card types

Settled 2026-10-17. Defines **8 card types**, each with a fixed structure and substructure. Shared data (doses, lab values, scores, criteria and similar) appears as **⟨inserted⟩** blocks: content that lives elsewhere and is shown in place, never retyped.

---

## Part 1 — What every card shares

**Header**
- Title (precise medical term) · card-type label · system
- Search aliases (hidden; used by search)

**Key points** (always visible, never collapsed)
- 3–6 bullets (decided): the bottom line you need in 15 seconds at the bedside

**Section bar**
- Jump links to the card's sections (e.g. Dx · Tx · Monitor), in the same position on every card

**Body**
- The card type's sections, **always in the same order**
- A section that doesn't apply is left out rather than shown empty, so the order of the remaining ones never changes
- Each section opens to its essentials; deeper detail sits in "More" expanders (closed by default)

**Footer, the same on every card**
- **Pearls and pitfalls:** common errors and high-yield nuances
- **Related cards:** links grouped as "Differential", "Conditions", "Tools" and "Medications"
- **Sources:** numbered list in short form ("Society Year: title"), full citation on tap. Each sourced line ends with a grey **source pill** (short source and year, "+1" for more than one); tapping it opens a sheet with the full citation and an Open source link.

**Formatting rules**
- Bullets and tables over paragraphs; one idea per bullet
- Numbers always carry units and thresholds (e.g. "K⁺ ≥6.5 mmol/L")
- First-line choices are listed first and labeled; alternatives follow
- Drug doses only ever appear as ⟨inserted⟩ blocks from the medication's own card
- Guideline recommendation grades (e.g. "Class I, Level A") are not shown; each recommendation carries only its source number (decided)

---

## Part 2 — The 8 card types

### 1. Condition card [C]
A disease or syndrome. The main card type.

1. **Key points**
2. **Definition and classification**
   - Definition; diagnostic criteria ⟨inserted⟩ when formal criteria exist
   - Subtypes, stages and severity grades
3. **Epidemiology and risk factors**: collapsed by default, one-line summary visible (decided)
4. **Pathophysiology**: collapsed by default, one-line summary visible (decided)
5. **Clinical presentation**
   - History: typical symptoms; atypical presentations
   - Examination: findings, with grading scales ⟨inserted⟩ from the exam cards
6. **Differential diagnosis**
   - Table: alternative diagnosis · distinguishing features · link
7. **Diagnostic evaluation**
   - Initial tests (labs, ECG, imaging) and why
   - Interpretation: what results mean and the thresholds
   - Further testing when the diagnosis is unclear
   - Low-value tests to avoid
8. **Risk stratification**
   - Scores ⟨inserted, interactive⟩; criteria for ICU or higher level of care
9. **Management**
   - Pathway ⟨embedded flowchart⟩ when one exists
   - Immediate (first hours)
   - Definitive treatment, by severity or subtype
   - Special populations: kidney disease, liver disease, pregnancy, older adults, immunocompromised
   - Doses ⟨inserted⟩ from medication cards
10. **Monitoring**
    - What to trend, targets, expected response, triggers to escalate
11. **Complications**
12. **Specialist involvement:** when to involve which specialty (general criteria, never institution-specific)
13. **Transitions of care**
    - Discharge criteria, follow-up, long-term and outpatient management, prevention
14. Footer (pearls · related · sources)

### 2. Approach card [A]
A symptom, sign or abnormal result. Built for working up a problem and building a differential.

1. **Key points**
2. **Definition:** what counts as abnormal, with thresholds (e.g. the AKI definition)
3. **Immediate assessment**
   - Red flags; signs of instability; what to do first
4. **Differential diagnosis**
   - A framework (by mechanism, organ, location or acuity), split into "cannot miss" and "most common", each linking to its condition card
5. **Focused history**: questions that discriminate between causes
6. **Focused examination**: findings that discriminate between causes
7. **Diagnostic evaluation**
   - Tiered: first-line tests, then second-line by scenario
   - Interpretation tables (result → likely causes)
8. **Pathway** ⟨embedded flowchart⟩
9. **Common initial orders** (decided): checklist of the usual first labs, imaging, monitoring and nursing orders
10. **Initial management** while the cause is being found
11. **Specialist involvement**
12. Footer

### 3. Reference card [R]
Interpretation guides, protocols and principles. The structure has three fixed variants so these cards still feel familiar:

- **Interpretation variant** (ECG, acid–base, PFTs, urinalysis, chest x-ray, fluid analysis)
  1. Key points · 2. Normal values ⟨inserted⟩ · 3. Stepwise method (numbered) · 4. Patterns and what they mean (table) · 5. Worked examples (ECGs and images ⟨inserted⟩ from the libraries) · 6. Footer
- **Protocol variant** (IV fluids, electrolyte repletion, insulin, VTE prophylaxis, transfusion, anticoagulation management)
  1. Key points · 2. Indications · 3. Choosing an option (comparison table) · 4. Dosing and protocol ⟨inserted⟩ · 5. Monitoring and adjustment · 6. Special populations · 7. Footer
- **Organism variant** (MRSA, Pseudomonas, ESBL organisms, Candida, and others)
  1. Key points · 2. Microbiology (in "More") · 3. Where it comes from and risk factors · 4. Infections it causes (links) · 5. Resistance patterns · 6. Treatment options (⟨inserted⟩ coverage from the chart data; doses ⟨inserted⟩) · 7. Infection-control precautions · 8. Footer
- **Chart variant** (antimicrobial coverage chart, empiric therapy by infection, glucocorticoid equivalents, opioid conversions)
  1. Key points · 2. How to read the chart · 3. The chart: a matrix generated from shared data, never typed by hand (e.g. coverage = antibiotic × organism; empiric therapy = each infection card's regimen block, inserted) · 4. Caveats (local resistance varies; check susceptibilities) · 5. Footer
- **Communication variant** (goals of care, code status, capacity)
  1. Key points · 2. When it applies · 3. Framework (steps) · 4. Suggested phrasing · 5. Legal and ethical points (general, not state-specific) · 6. Footer

### 4. Procedure card [P]
1. **Key points**
2. **Indications**
3. **Contraindications** (absolute · relative)
4. **Preparation**
   - Consent points (risks to discuss); equipment checklist; positioning; landmarks and ultrasound views (images ⟨inserted⟩)
5. **Technique**: numbered steps, one action per step, with images
6. **After the procedure**
   - Post-procedure care; samples to send and how to interpret them (links to the Labs library)
7. **Complications** (frequency · recognition · management)
8. **Troubleshooting**
9. **Procedure note checklist** (decided): indication, consent, time-out, site and laterality, technique and ultrasound use, samples sent, estimated blood loss, complications, post-procedure plan
10. Footer

### 5. Medication card [M]
The **only home** for doses. Each indication's dose is a block that other cards insert.

**Drug class variant** (e.g. beta-lactams, DOACs, loop diuretics, SGLT2 inhibitors): 1. Key points · 2. Mechanism and shared effects · 3. Members compared (table: spectrum or indications, kidney/liver handling, key differences; links to each drug card) · 4. Class-wide contraindications, adverse effects and interactions · 5. Choosing within the class · 6. Footer. **No doses on class cards**; they link to the drug cards.

**Single-drug card:**

1. **Header extras:** generic name (common brand names) · class
2. **Key points**
3. **Indications and dosing:** one block per indication (dose · route · frequency · duration · maximum) ⟨these are what other cards insert⟩
4. **Dose adjustment:** kidney function (by CrCl or eGFR band), liver function, dialysis, weight
5. **Administration**: IV rates, dilution, timing, oral notes
6. **Contraindications and boxed warnings**
7. **Adverse effects** (common · serious)
8. **Interactions** (major only)
9. **Monitoring** (what · when · target)
10. **Pregnancy and lactation**
11. **Overdose and reversal**
12. Footer (sources: guideline and official prescribing information)

### 6. Score / calculator card [S]
1. **Key points:** what it estimates and for whom
2. **When to use / when not to** (the population it was validated in)
3. **Calculator** (interactive; tap the inputs, get the result); MDCalc link
4. **Interpretation**: score → risk → recommended action (table)
5. **Limitations**
6. Footer (sources: original derivation and validation studies, plus the guideline that recommends it)

### 8. Diagnostic test card [T]
How to use a test (labs and other diagnostic tests); lives in Library › Labs. Approach cards about abnormal results link here rather than repeat it.

1. **Key points**
2. **What it measures** (in "More": the biology)
3. **When to order / when not to**
4. **Interpretation**: cutoffs and reference values ⟨inserted⟩; age-, sex- or kidney-adjusted thresholds where they exist
5. **Test accuracy**: sensitivity, specificity, likelihood ratios, by setting
6. **Causes of false positives and false negatives**; interfering factors
7. **Practical notes**: sample type, timing, turnaround, repeat testing
8. Footer

### 7. Physical exam card [E]
Supports documentation wording, as requested.

1. **Key points**
2. **Technique**: how to perform the exam, in order
3. **Normal findings**: documentation-ready wording
4. **Abnormal findings**: table of finding · documentation wording · what it suggests (likelihood ratios where studied) · link
5. **Grading scales** ⟨inserted⟩ (e.g. murmur grade I–VI, edema 0–4+, strength 0–5, reflexes 0–4+)
6. **Special maneuvers**: how · positive finding · accuracy
7. Footer

---

## Part 3 — Worked skeleton: Hyperkalemia (condition card)
*(Headings only, to show the shape.)*

- **Key points** · Definition and classification (thresholds; severity grades) · Epidemiology and risk factors · Pathophysiology (shifts vs excretion vs pseudohyperkalemia)
- **Clinical presentation:** symptoms; ECG findings ⟨inserted ECG examples⟩
- **Differential diagnosis:** pseudohyperkalemia vs true; causes table
- **Diagnostic evaluation:** repeat sample; ECG; kidney function; medications; when to check transtubular measures (in "More")
- **Risk stratification:** what makes it an emergency
- **Management:** ⟨embedded pathway⟩ → membrane stabilization · shift · removal · treat the cause; doses ⟨inserted from calcium gluconate, insulin, albuterol, sodium zirconium cyclosilicate, patiromer, furosemide cards⟩; special populations (dialysis, digoxin)
- **Monitoring:** repeat K⁺ timing; glucose after insulin
- **Complications** · **Specialist involvement** (urgent dialysis criteria → link) · **Transitions of care** (medication review, diet)
- Footer: pearls · related (Hypokalemia, AKI, CKD, Acid–base, Urgent dialysis) · sources

---

## Decisions (2026-10-17)
1. Recommendation grades: **not shown**; source number only.
2. Procedure cards: **include a short procedure-note checklist**.
3. Key points: **3–6 bullets**.
4. Epidemiology and pathophysiology: **collapsed by default**, with a one-line summary.
5. Additions: **"Common initial orders" in approach cards**; no discharge checklist for now.
6. Added: **Diagnostic test card** (type 8), **Drug class variant** (Medication), **Organism** and **Chart variants** (Reference). Coverage charts and empiric-therapy charts are generated from shared data, so nothing is retyped.


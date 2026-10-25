---
id: crit-sepsis
type: condition
system: crit
subsection: Shock and Sepsis
title: Sepsis and Septic Shock
aliases: [sepsis, septic shock, severe sepsis, SIRS, qSOFA, SOFA, NEWS, Sepsis-3, distributive shock, vasopressors, pressors, norepinephrine, levophed, vasopressin, stress-dose steroids, hydrocortisone, lactate, hour-1 bundle, SEP-1, code sepsis, refractory septic shock]
definition: "Life-threatening organ dysfunction caused by a dysregulated host response to infection. Septic shock adds a vasopressor requirement for MAP ≥65 mm Hg and lactate >2 mmol/L despite adequate fluids. ^[sepsis-3-2016]"
based_on: [ssc-sepsis-2026, sepsis-3-2016]
checked: { date: 2026-10-21, by: owner, scope: "owner review", fingerprint: "3fe924ebd76ce1ec", carried: "2026-10-24: ceftriaxone dose rows: short title, per-dose calcium line moved to the drug record, no clinical change" }
related:
  differential: []
  conditions: [renal-aki, id-cap, id-complicated-uti, id-cellulitis, endo-inpatient-hyperglycemia]
  tools: []
  medications: [ceftriaxone]
emergency_hint: "Cultures, antibiotics, fluids, norepinephrine"
---
## Do Now
1. Cultures and lactate
   - If: suspected sepsis with hypotension or hypoperfusion ^[ssc-sepsis-2026]
   - Check: two sets of blood cultures before antibiotics, only if they cause no delay. ^[ssc-sepsis-2026]
   - Measure lactate. Start treatment at once, as a medical emergency. ^[ssc-sepsis-2026]
2. Antibiotics within 1 hour
   - If: possible, probable or definite septic shock, or probable or definite sepsis ^[ssc-sepsis-2026]
   - Check: source, recent cultures and MRSA or resistant-organism risk. One β-lactam, plus vancomycin only with MRSA risk. ^[ssc-sepsis-2026, idsa-sepsis-hospital-2026]
   - Pseudomonas or multidrug-resistant risk: piperacillin-tazobactam or cefepime. Community onset without resistance risk: ceftriaxone may suffice (regimen in Treatment). ^[ssc-sepsis-2026, common-practice]

   {{dose:piperacillin-tazobactam-sepsis}}

   {{dose:vancomycin-iv}}

   - Vancomycin only with MRSA risk, after the β-lactam. ^[ssc-sepsis-2026, idsa-sepsis-hospital-2026]
3. Crystalloid bolus
   - If: hypotension or lactate ≥4 mmol/L (consider with 2–4) ^[ssc-sepsis-2026]

   {{dose:crystalloid-sepsis}}

   - Reassess often. Individualize in heart or kidney failure. ^[ssc-sepsis-2026]
4. Norepinephrine to MAP 65 mm Hg
   - If: hypotension persists during or after the bolus ^[ssc-sepsis-2026]
   - Check: start peripherally rather than wait for a central line. ^[ssc-sepsis-2026]

   {{dose:norepinephrine-septic-shock}}

   - Warning: Extravasation ^[label-levophed-2025]
   - Age ≥65 years: MAP 60–65 mm Hg. ^[ssc-sepsis-2026]
5. Add vasopressin
   - If: norepinephrine requirement rising ^[ssc-sepsis-2026]

   {{dose:vasopressin-septic-shock}}

   - Still below target: add epinephrine. ^[ssc-sepsis-2026]
6. Hydrocortisone
   - If: septic shock with an ongoing vasopressor requirement ^[ssc-sepsis-2026, sccm-corticosteroids-2024]

   {{dose:hydrocortisone-septic-shock}}

7. Source control
   - Look for a drainable or removable source. Control it within 6 hours. ^[ssc-sepsis-2026]
   - ICU within 6 hours when ICU care is needed. ^[ssc-sepsis-2026]

:::note
- Possible sepsis without shock: rapid workup. Antibiotics within 3 hours if concern persists. Low likelihood of infection without shock: defer antibiotics and monitor closely. ^[ssc-sepsis-2026]
:::

## At a Glance
- Shock or probable sepsis: antibiotics within 1 hour. Possible sepsis without shock: rapid workup, antibiotics within 3 hours if concern persists. ^[ssc-sepsis-2026]
- Blood cultures and lactate first, without delaying antibiotics. ^[ssc-sepsis-2026]
- Hypoperfusion: crystalloid bolus, balanced over saline. Then guide fluids by dynamic measures, lactate and capillary refill. ^[ssc-sepsis-2026]
- Norepinephrine first, peripherally if needed, to MAP 65 mm Hg (60–65 if ≥65 years). Add vasopressin, then epinephrine. ^[ssc-sepsis-2026]
- Septic shock on vasopressors: IV hydrocortisone. ^[ssc-sepsis-2026, sccm-corticosteroids-2024]
- Source control within 6 hours. De-escalate once cultures return. ^[ssc-sepsis-2026]

## Severity
:::scale Infection to septic shock
- Infection: no new organ dysfunction. ^[sepsis-3-2016]
- Sepsis: infection with new organ dysfunction ({{calc:sofa}} rise ≥2). ^[sepsis-3-2016]
- Septic shock: vasopressors for MAP ≥65 mm Hg and lactate >2 mmol/L despite fluids. ^[sepsis-3-2016]
:::

{{criteria:sepsis-3}}

- Diagnostic certainty guides timing: possible (moderate suspicion), probable (sepsis most likely), definite (confirmed). ^[ssc-sepsis-2026]
- ICU within 6 hours for septic shock, rising vasopressor needs, respiratory failure or worsening organ dysfunction. ^[ssc-sepsis-2026, common-practice]
- Arterial line with escalating, intermediate- to high-dose or multiple vasopressors, frequent blood gases, or unreliable cuff readings. ^[ssc-sepsis-2026]

## Causes
- **Respiratory:** [!most-common] pneumonia, empyema. ^[common-practice]
- **Urinary:** pyelonephritis, obstructed or complicated UTI, prostatic abscess. ^[common-practice]
- **Abdominal:** cholangitis, cholecystitis, perforation, abscess, spontaneous bacterial peritonitis, Clostridioides difficile colitis. ^[common-practice]
- **Skin and soft tissue:** cellulitis, abscess, necrotizing soft-tissue infection. ^[common-practice]
- **Devices and bloodstream:** central lines, ports, prosthetic material, endocarditis. ^[common-practice]
- **CNS:** meningitis, brain abscess. ^[common-practice]
- **Needs source control:** [!cannot-miss] necrotizing soft-tissue infection, abscess, cholangitis, GI perforation or ischemia, obstructed pyelonephritis, empyema, septic arthritis, infected devices. ^[ssc-sepsis-2026, common-practice]
- **Mimics (noninfectious):** pancreatitis, PE, adrenal crisis, DKA, cardiogenic or hemorrhagic shock, anaphylaxis, drug reaction, thyroid storm. 10–30% of patients first treated for sepsis have another diagnosis. ^[ssc-sepsis-2026, common-practice]

## Presentation
- Fever or hypothermia, tachycardia, tachypnea, altered mentation, hypotension. ^[sepsis-3-2016, common-practice]
- Hypoperfusion: mottling, prolonged capillary refill, cool extremities, oliguria, rising lactate. ^[ssc-sepsis-2026]
- Unstable shock: profound hypotension, mottling, ashen or cyanotic appearance, altered mentation. ^[ssc-sepsis-2026]
- Source symptoms: cough, dysuria or flank pain, abdominal pain, skin changes, line-site erythema, meningismus. ^[common-practice]
- Older or immunosuppressed patients may have no fever. New confusion or falls may be the only sign. ^[common-practice]

## Diagnosis
#### Screening
- In hospital, use {{calc:news}}, {{calc:news2}}, {{calc:mews}} or {{calc:sirs}} rather than {{calc:qsofa}} as a single screening tool. ^[ssc-sepsis-2026]
- Sepsis is a clinical diagnosis: no single test or biomarker rules it in or out. ^[ssc-sepsis-2026]

#### Initial tests
- Blood cultures, ideally two sets from different sites, before antibiotics when they cause no delay. ^[ssc-sepsis-2026]
- Lactate. Repeat to guide resuscitation when elevated. ^[ssc-sepsis-2026]
- CBC with differential, BMP, liver panel, coagulation studies, blood gas. ^[common-practice]
- Source studies: urinalysis and urine culture, sputum culture, chest radiograph. Other fluid cultures and imaging as the source suggests. ^[common-practice]
- Pathogen-specific rapid tests case by case, paired with stewardship. ^[ssc-sepsis-2026, idsa-sepsis-hospital-2026]

#### Avoid
- Procalcitonin to decide whether to start antibiotics: clinical evaluation alone is suggested. ^[ssc-sepsis-2026]
- Draw cultures from a vascular device only when line infection is suspected. Otherwise peripheral. ^[common-practice]

## Treatment
1. Antibiotics
   - Possible, probable or definite septic shock, or probable or definite sepsis: immediately, ideally within 1 hour. ^[ssc-sepsis-2026]
   - Possible sepsis without shock: time-limited rapid workup. Give within 3 hours if concern persists. ^[ssc-sepsis-2026]
   - Low likelihood of infection without shock: defer and monitor closely. ^[ssc-sepsis-2026]

   {{regimen:sepsis-empiric}}

   - Cover a specific multidrug-resistant pathogen only when its risk is high (colonization or infection with it in the past year, prolonged broad-spectrum antibiotics, a long stay in a unit where it is common). ^[ssc-sepsis-2026]
   - Prolonged β-lactam infusion after a loading dose is recommended. ^[ssc-sepsis-2026]
   - Shock: order to infusion start within 30 minutes. β-lactam before vancomycin. ^[idsa-sepsis-hospital-2026]
   - Reported penicillin allergy: most are not true allergies, and most patients can receive cefepime. ^[idsa-sepsis-hospital-2026]
   - Source-specific regimens: [[id-cap|pneumonia]], [[id-complicated-uti|complicated UTI]], [[id-cellulitis|cellulitis]]. ^[common-practice]

2. Source control
   - Rapidly look for a source needing emergent control. Drain or remove it, ideally within 6 hours. ^[ssc-sepsis-2026]
   - Remove an intravascular device that may be the source once other access is in place. ^[ssc-sepsis-2021]

3. Fluids
   - Sepsis-induced hypoperfusion or septic shock: ^[ssc-sepsis-2026]

   {{dose:crystalloid-sepsis}}

   - Crystalloids first. Balanced crystalloids over 0.9% saline, except saline with traumatic brain injury. ^[ssc-sepsis-2026]
   - Crystalloids alone over adding albumin ^[ssc-sepsis-2026]
   - Albumin may suit cirrhosis or very large volumes ^[ssc-sepsis-2026]
   - Avoid it in traumatic brain injury. No starches or gelatin ^[ssc-sepsis-2026]
   - Further fluid by dynamic measures (passive leg raise or fluid challenge with stroke volume or pulse pressure change), serial lactate and capillary refill, not until lactate normalizes. ^[ssc-sepsis-2026]
   - Persistent hypoperfusion after the initial bolus: a liberal or restrictive strategy are both acceptable. ^[ssc-sepsis-2026, clovers-2023]
   - Fluid choice and volumes: [[renal-iv-fluids|IV fluids]]. ^[common-practice]

4. Vasopressors
   - Initial crystalloid bolus, then a vasopressor if hypotension persists. In unstable shock (profound hypotension, mottling, altered mentation), consider starting both together. ^[ssc-sepsis-2026]
   - Target MAP 65 mm Hg as a range (within about 5 mm Hg). 60–65 mm Hg if ≥65 years. ^[ssc-sepsis-2026]
   - Norepinephrine first line. Start peripherally rather than delay. ^[ssc-sepsis-2026]

   {{dose:norepinephrine-septic-shock}}

   - Escalating norepinephrine: add vasopressin. ^[ssc-sepsis-2026]

   {{dose:vasopressin-septic-shock}}

   - MAP still inadequate: add epinephrine. ^[ssc-sepsis-2026]

   {{dose:epinephrine-septic-shock}}

   - Cardiac dysfunction: norepinephrine or epinephrine first line (norepinephrine with tachyarrhythmia, epinephrine with bradycardia). ^[ssc-sepsis-2026]
   - Cardiac dysfunction with persistent hypoperfusion despite volume and MAP: add dobutamine to norepinephrine, or use epinephrine alone. ^[ssc-sepsis-2026]

   {{dose:dobutamine-septic-shock}}

   - Not recommended: dopamine, terlipressin, levosimendan, β-blockers (esmolol, landiolol). Angiotensin II is not preferred first line. Methylene blue lacks evidence of survival benefit. ^[ssc-sepsis-2026]

5. Corticosteroids
   - Septic shock: IV corticosteroids suggested, regardless of vasopressor dose. No recommendation for sepsis without shock (no benefit seen). ^[ssc-sepsis-2026, sccm-corticosteroids-2024]

   {{dose:hydrocortisone-septic-shock}}
   {{dose:fludrocortisone-septic-shock}}

   - Steroid protocols are commonly triggered at norepinephrine or epinephrine ≥0.25 mcg/kg/min for at least 4 hours. ^[idsa-sepsis-hospital-2026]

6. Supportive care
   - Insulin at glucose ≥180 mg/dL. Typical target 144–180 mg/dL ([[endo-inpatient-hyperglycemia|inpatient hyperglycemia]]). ^[ssc-sepsis-2026, ssc-sepsis-2021]
   - Restrictive transfusion, usually at Hb <7 g/dL, unless ischemia, severe hypoxemia or hemorrhage. ^[ssc-sepsis-2026, ssc-sepsis-2021]
   - VTE prophylaxis unless contraindicated, low-molecular-weight heparin preferred. ^[ssc-sepsis-2026]

   {{dose:enoxaparin-prophylaxis}}

   - Stress ulcer prophylaxis with a PPI when GI bleeding risk factors are present (coagulopathy, shock, chronic liver disease, AKI). ^[ssc-sepsis-2026]
   - Septic shock with pH ≤7.2 and AKI stage 2–3: sodium bicarbonate suggested. Not to raise blood pressure in lactic acidemia. ^[ssc-sepsis-2026]
   - No RRT for AKI without a definitive indication. ^[ssc-sepsis-2026]
   - Hypoxemia: high-flow nasal oxygen over conventional oxygen ({{calc:pf-ratio}} <200) and over noninvasive ventilation as initial support. Consider awake proning. ^[ssc-sepsis-2026]
   - Early enteral nutrition, within 72 hours. ^[ssc-sepsis-2026]
   - After the acute phase, active fluid removal (diuretics first). ^[ssc-sepsis-2026]
   - Not recommended: IV vitamin C, antipyretics to improve outcomes, IVIG, blood purification, vitamin D, probiotics. ^[ssc-sepsis-2026]

7. Goals of care
   - Discuss goals of care and prognosis early, within 72 hours. ^[ssc-sepsis-2026]

## Monitor
:::times{after=first check=Lactate unit=h} Lactate while elevated, hours from the first treatment ^[ssc-sepsis-2026, common-practice]
- 2
- 4
- 6
:::

- MAP, heart rate, capillary refill, mental status and urine output, frequently during resuscitation. ^[ssc-sepsis-2026]
- Expected response: lactate falls (e.g. ≥10% every 2 hours) and capillary refill normalizes (≤3 seconds). ^[ssc-sepsis-2026, andromeda-shock-2019]
- Volume overload with fluids: oxygenation, edema, fluid balance. ^[ssc-sepsis-2026]
- Repeat blood cultures to document clearance for *Staphylococcus aureus*, *S. lugdunensis* and *Candida*. ^[ssc-sepsis-2026]
- Daily: ^[ssc-sepsis-2026]
  - Antibiotic need, spectrum and duration ^[ssc-sepsis-2026]
  - De-escalate once susceptibilities return ^[ssc-sepsis-2026]
  - Stop if a noninfectious cause is found ^[ssc-sepsis-2026]
- Duration: shorter courses with adequate source control. Procalcitonin with clinical evaluation may help decide when to stop. ^[ssc-sepsis-2026]
- Kidney function and drug levels for vancomycin and other renally cleared drugs. ^[common-practice]

## Escalation
- ICU: septic shock, rising vasopressor requirement, respiratory failure, worsening organ dysfunction. ^[ssc-sepsis-2026, common-practice]
- Surgery or interventional radiology: a source needing drainage, debridement or device removal. ^[ssc-sepsis-2026, common-practice]
- Infectious disease: *S. aureus* or *Candida* bacteremia, multidrug-resistant organisms, unclear source. ^[common-practice]
- Refractory shock: high-dose norepinephrine with persistent hypoperfusion. Reassess for mixed cardiogenic or obstructive shock with bedside ultrasound. ^[sccm-esicm-refractory-shock-2026]

## More Information
### Where Guidelines Differ: Antibiotic timing, procalcitonin
:::compare Time to antibiotics
- SSC 2026: within 1 hour for any septic shock and for probable or definite sepsis. Within 3 hours for possible sepsis without shock. ^[ssc-sepsis-2026]
- IDSA-led societies 2026: hospital target under 1 hour for septic shock. Evidence for strict timing without shock is inconsistent. ^[idsa-sepsis-hospital-2026]
:::

:::compare Procalcitonin to stop antibiotics
- SSC 2026: suggested, with clinical evaluation, when duration is unclear. ^[ssc-sepsis-2026]
- IDSA-led societies 2026: emerging, not for routine use. ^[idsa-sepsis-hospital-2026]
:::

### Special Populations: Older adults, obesity, cirrhosis, TBI
- Age ≥65 years: MAP 60–65 mm Hg (less vasopressor exposure). ^[ssc-sepsis-2026, sixty-five-2020]
- BMI >30 kg/m²: fluid volume by adjusted or {{calc:ideal-body-weight}}. ^[ssc-sepsis-2026]
- Cirrhosis: albumin may be appropriate after crystalloid. ^[ssc-sepsis-2026]
- Traumatic brain injury: 0.9% saline. No albumin. ^[ssc-sepsis-2026]
- High risk of volume overload (e.g. heart failure, dialysis): start dynamic assessment before the full bolus. Reassess after each portion. ^[ssc-sepsis-2026]
- Neutropenia, transplant or other immunosuppression: broader empiric coverage. Antifungal case by case. ^[ssc-sepsis-2026, common-practice]

### Complications: Organ dysfunction
- [[renal-aki|AKI]], ARDS, DIC, septic cardiomyopathy, encephalopathy, ICU-acquired weakness. ^[common-practice]
- Volume overload from resuscitation. ^[ssc-sepsis-2026]
- Hyperglycemia and hypernatremia with corticosteroids. ^[sccm-corticosteroids-2024]

### After the Acute Phase: Survivors, follow-up
- Assess and follow physical, cognitive and emotional problems after discharge. Offer mental health support. ^[ssc-sepsis-2026]
- Physical rehabilitation after mechanical ventilation for more than 48 hours. ^[ssc-sepsis-2026]
- Education on sepsis and its common after-effects for patients, families and primary care. ^[ssc-sepsis-2026]
- Pharmacist-led medication reconciliation at transitions. ^[ssc-sepsis-2026]

### Evidence: Key trials
- ADRENAL (2018): hydrocortisone did not lower 90-day mortality but sped shock reversal. ^[adrenal-2018]
- APROCCHSS (2018): hydrocortisone plus fludrocortisone lowered 90-day mortality. ^[aprocchss-2018]
- VASST (2008): vasopressin added to norepinephrine did not lower mortality overall. Possible benefit in less severe shock. ^[vasst-2008]
- 65 trial (2020): permissive hypotension in patients ≥65 years did not raise mortality. ^[sixty-five-2020]
- CLOVERS (2023): restrictive (early vasopressor) and liberal fluid strategies had similar mortality. ^[clovers-2023]
- ANDROMEDA-SHOCK (2019): capillary refill–targeted resuscitation was at least as good as lactate-targeted. ^[andromeda-shock-2019]
- BLING III (2024): continuous β-lactam infusion did not significantly lower 90-day mortality on its own. Meta-analyses including it show lower mortality with prolonged infusion. ^[bling-iii-2024, ssc-sepsis-2026]

### Why the Treatment Order: Antibiotics and perfusion first
- Mortality rises with each hour of delay to antibiotics in septic shock, so antibiotics and perfusion come before a full workup. The diagnosis is then reconsidered daily. ^[idsa-sepsis-hospital-2026, ssc-sepsis-2026]

### Epidemiology and Pathophysiology: Dysregulated host response
- Mortality exceeds 10% with sepsis and 40% with septic shock. ^[sepsis-3-2016]
- Vasodilation, capillary leak, microvascular thrombosis and myocardial depression cause hypoperfusion and organ dysfunction. ^[common-practice]
- Proposed definition of refractory septic shock: high lactate or prolonged capillary refill, fluid-unresponsive, norepinephrine >0.5 mcg/kg/min, other shock excluded by ultrasound. Not yet validated. ^[sccm-esicm-refractory-shock-2026]

## Pearls
- Don't wait for cultures to give antibiotics in shock. ^[ssc-sepsis-2026]
- {{calc:qsofa}} predicts poor outcome. It is a poor screening tool. ^[ssc-sepsis-2026, sepsis-3-2016]
- Peripheral norepinephrine is fine to start. Check the site often. ^[ssc-sepsis-2026]
- No improvement after 48–72 hours: look for an undrained source, a resistant organism or a noninfectious mimic. ^[common-practice]
- Euglycemic DKA, adrenal crisis and pancreatitis can look like septic shock. ^[common-practice]

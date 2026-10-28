---
id: neuro-delirium
type: topic
system: neuro
subsection: Altered Mental Status
title: "Delirium"
aliases: [delirium, acute confusion, acute encephalopathy, altered mental status, agitation, ICU delirium, hypoactive delirium, hyperactive delirium, sundowning, CAM, CAM-ICU, 4AT, RASS, haloperidol, HELP, postoperative delirium, toxic metabolic encephalopathy]
definition: "An acute, fluctuating disturbance of attention, awareness and cognition that is a direct physiologic consequence of another medical condition, medication, substance or toxin, and is not explained by a preexisting neurocognitive disorder. ^[apa-delirium-2025, nice-delirium-2023]"
based_on: [apa-delirium-2025, padis-2025, nice-delirium-2023, ags-beers-2023]
checked: { date: 2026-10-27, by: opus, scope: "rework to the nine prose rules. Ward antipsychotic doses, targets and consult rules from practice sources, checked line by line by a Sonnet helper. Judgment lines and omissions checked by Opus. Guideline lines not re-read. Doses left not-verified: dexmedetomidine-icu-delirium, haloperidol-delirium-icu, haloperidol-delirium-low, thiamine-wernicke-suspected. Doses left not-verified: dexmedetomidine-icu-delirium, haloperidol-delirium-icu, haloperidol-delirium-low, thiamine-wernicke-suspected", fingerprint: "4e93c29040288c24", carried: "2026-10-28: 4AT calculator data added for the interactive score. Card text, doses and criteria unchanged" }
related:
  differential: [psych-acute-agitation, psych-serotonin-syndrome-nms, psych-suicide-risk-assessment]
  conditions: [crit-hypoxemic-respiratory-failure, renal-hyponatremia, id-complicated-uti, crit-sepsis, hosp-pain-management, neuro-alcohol-withdrawal]
  tools: []
  medications: []
---
## At a Glance
- Delirium is acute and fluctuating, with inattention at its core. It signals a medical cause, so search for and treat the cause. ^[apa-delirium-2025, nice-delirium-2023]
- Screen high-risk patients with the {{calc:4at}} on the ward and the {{calc:cam-icu}} in the ICU. Hypoactive delirium is the most commonly missed. ^[nice-delirium-2023, padis-2018]
- First line is a multicomponent nonpharmacologic bundle plus stopping deliriogenic drugs (anticholinergics, benzodiazepines, opioids). ^[apa-delirium-2025, nice-delirium-2023, ags-beers-2023]
- Antipsychotics only for severe distress or danger after de-escalation fails. Not used to prevent or shorten delirium. ^[apa-delirium-2025, nice-delirium-2023]
  - Lowest dose, shortest time, check the {{calc:qtc}} ^[apa-delirium-2025, nice-delirium-2023]
- Avoid benzodiazepines unless the cause is alcohol or sedative withdrawal, catatonia, neuroleptic malignant syndrome, serotonin syndrome or seizure. ^[apa-delirium-2025, esaic-pod-2024]
- In ventilated patients prefer dexmedetomidine to benzodiazepines for sedation. ^[padis-2018, padis-2025, apa-delirium-2025]

## Severity
{{criteria:cam}}

{{criteria:4at}}

- Delirium raises mortality, length of stay and long-term cognitive decline, including the hypoactive form. ^[apa-delirium-2025, common-practice]

## Causes
- **Hypoxemia and hypoperfusion:** [!cannot-miss] ^[nice-delirium-2023, common-practice]
  - [[crit-hypoxemic-respiratory-failure|Hypoxemic respiratory failure]], hypercapnia ([[pulm-copd-exacerbation|COPD exacerbation]]), heart failure, myocardial infarction, [[heme-anemia|anemia]] ^[nice-delirium-2023, common-practice]
  - Hypotension or shock, hypothermia, hyperthermia ^[common-practice]
- **Withdrawal and intoxication:** [!cannot-miss] ^[apa-delirium-2025, common-practice]
  - Alcohol and benzodiazepine withdrawal ([[neuro-alcohol-withdrawal|alcohol withdrawal delirium]]), Wernicke encephalopathy ^[apa-delirium-2025, common-practice]
  - Opioid, sedative or stimulant effects, carbon monoxide ^[apa-delirium-2025, common-practice]
- **Neurologic:** [!cannot-miss] ^[common-practice]
  - Stroke, intracranial hemorrhage, seizure or postictal state, nonconvulsive status epilepticus ^[common-practice]
  - Meningitis or encephalitis, hypertensive encephalopathy (PRES) ^[common-practice]
  - Catatonia, [[psych-serotonin-syndrome-nms|serotonin syndrome or neuroleptic malignant syndrome]] ^[common-practice]
- **Infection:** [!cannot-miss] ^[nice-delirium-2023, common-practice]
  - Urinary ([[id-complicated-uti|complicated UTI]]), pneumonia, [[crit-sepsis|sepsis]] ^[nice-delirium-2023, common-practice]
  - Skin and soft tissue infection, endocarditis, C. difficile ^[nice-delirium-2023, common-practice]
- **Metabolic and endocrine:** [!cannot-miss] ^[nice-delirium-2023, common-practice]
  - Hypoglycemia, [[renal-hyponatremia|hyponatremia]], hypernatremia, hypocalcemia, hypercalcemia, [[endo-inpatient-hyperglycemia|hyperglycemia]] ^[nice-delirium-2023, common-practice]
  - [[endo-dka|Diabetic ketoacidosis]], hyperosmolar hyperglycemic state, adrenal insufficiency, thyroid disease ^[common-practice]
  - Uremia, hepatic encephalopathy ^[nice-delirium-2023, common-practice]
- **Medications:** [!most-common] ^[ags-beers-2023, apa-delirium-2025, common-practice]
  - Anticholinergics (diphenhydramine, hydroxyzine, oxybutynin, tricyclic antidepressants), benzodiazepines, Z-drugs ^[ags-beers-2023, apa-delirium-2025, common-practice]
  - Opioids (including meperidine), corticosteroids, H2 blockers, antiepileptics, dopamine agonists, digoxin ^[ags-beers-2023, apa-delirium-2025, common-practice]
  - New starts, dose changes and withdrawal ^[ags-beers-2023, apa-delirium-2025, common-practice]
- **Physiologic and environmental:** ^[nice-delirium-2023, apa-delirium-2025]
  - Urinary retention, fecal impaction or constipation, uncontrolled pain, dehydration ^[nice-delirium-2023, apa-delirium-2025]
  - Sleep deprivation, immobility, lines and restraints, sensory loss (missing glasses or hearing aids), ICU environment ^[nice-delirium-2023, apa-delirium-2025]
- **Postoperative and other:** anesthesia, major surgery, hip fracture, cardiac surgery. ^[esaic-pod-2024]
- **Predisposing factors:** age ≥65 years, dementia or cognitive impairment, severe illness, prior delirium, sensory impairment, frailty, polypharmacy. ^[nice-delirium-2023, apa-delirium-2025]

## Presentation
#### Core features
- **Onset:** acute (hours to days) with fluctuation, worse at night. ^[apa-delirium-2025, inouye-cam-1990]
- **Features:** inattention, disorganized thinking, altered level of consciousness, disorientation, perceptual disturbance. ^[apa-delirium-2025, inouye-cam-1990]
- **Baseline from family or staff:** a change from baseline is the key. ^[nice-delirium-2023]

#### Types
- **Hyperactive:** agitation, restlessness, hallucinations, pulling at lines. Easily recognized. ^[common-practice]
- **Hypoactive:** drowsy, withdrawn, slowed. Often missed or mistaken for depression, fatigue or dementia. ^[common-practice]
- **Mixed:** alternates between the two. ^[common-practice]

#### Clues
- **Dementia:** raises the risk and can mask delirium. New inattention, a change in alertness or a rapid change from baseline suggests superimposed delirium. ^[nice-delirium-2023, common-practice]
- **Meningitis or encephalitis:** fever, headache, neck stiffness or a seizure. Neck stiffness is often absent, especially in older adults. ^[common-practice]

## Diagnosis
#### Screening and assessment
- **Screen:** at admission, daily and with any acute change: {{calc:4at}} on the ward, {{calc:cam-icu}} in the ICU or recovery. ^[nice-delirium-2023, padis-2018]
- **Attention testing:** orientation testing or the Mini-Mental State Examination alone misses delirium, which needs attention testing. ^[common-practice]
- **Confirm:** a positive screen is confirmed by a clinician's assessment of the {{calc:cam-icu}} or CAM features and the DSM-5-TR criteria. ^[nice-delirium-2023, apa-delirium-2025]
- **ICU:** assess the {{calc:rass}} first. At {{calc:rass|RASS}} −4 or −5 the {{calc:cam-icu}} cannot be done, so reassess later. ^[ely-camicu-2001, padis-2018]

#### Initial orders
- Every new delirium: ^[nice-delirium-2023, common-practice]
  - Vital signs with SpO₂, temperature and POCT glucose ^[nice-delirium-2023, common-practice]
  - Full physical and neurologic examination, with bladder scan for retention and rectal examination for impaction ^[nice-delirium-2023, common-practice]
  - BMP (sodium, calcium, creatinine), CBC, ECG ^[common-practice]
  - Medication history from the chart and family: recent starts, dose changes and stopped drugs ^[nice-delirium-2023, common-practice]

#### Orders by trigger
- Urinary symptoms, or fever, rigors or hypotension with no other source: UA with urine culture. ^[idsa-asb-2019, common-practice]
  - Do not routinely send a UA for delirium alone. With a urinary catheter or spinal cord injury, send one if no other cause is found. ^[idsa-asb-2019, idsa-cauti-2009, common-practice]
  - Bacteriuria in delirium without urinary or systemic signs is not by itself a reason for antibiotics. ^[idsa-asb-2019]
- Fever, hypotension or suspected infection: blood cultures and CXR. ^[common-practice]
- Low SpO₂ or suspected CO₂ retention: ABG or VBG. ^[common-practice]
- No cause after the initial orders: hepatic function panel, ammonia, TSH, magnesium, phosphate, B12 and a urine toxicology screen. ^[common-practice]
- Digoxin, lithium or an antiepileptic on the medication list: that drug level. ^[common-practice]
- Focal deficit, head trauma or no cause found: CT head without contrast. ^[common-practice]
- Suspected meningitis or encephalitis: blood cultures and [[id-empiric-antimicrobials|empiric antimicrobials]] now, never delayed for CT or LP. ^[idsa-meningitis-2004, common-practice]
  - After neurosurgery, a shunt or drain, or penetrating head trauma, use the healthcare-associated regimen. ^[idsa-meningitis-2004, idsa-ventriculitis-2017]
  - Community-acquired bacterial meningitis: dexamethasone just before or with the first antibiotic dose, not after antibiotics. ^[idsa-meningitis-2004]
  - Continue dexamethasone only for gram-positive diplococci on Gram stain or pneumococcus on culture. ^[idsa-meningitis-2004]
  - Encephalitis: add IV acyclovir, adjusted for kidney function. ^[idsa-meningitis-2004, common-practice]
  - LP with CSF opening pressure, cell count, protein, glucose, Gram stain, culture and herpes simplex virus PCR. ^[idsa-meningitis-2004, common-practice]
  - CT head before the LP for immunocompromise, known brain disease, a seizure in the past week, papilledema, a focal deficit or abnormal consciousness. ^[idsa-meningitis-2004, common-practice]
- Seizure concern: EEG. ^[common-practice]

## Treatment
1. Treat causes
   - Treat each cause found: ^[apa-delirium-2025, nice-delirium-2023]
     - Antimicrobials for infection, oxygen for hypoxemia, correction of sodium and glucose ^[apa-delirium-2025, nice-delirium-2023]
     - Bladder drainage for retention, bowel regimen for constipation ^[apa-delirium-2025, nice-delirium-2023]
   - Stop or reduce anticholinergics, benzodiazepines, Z-drugs, opioids, H2 blockers and corticosteroids where possible. ^[ags-beers-2023, apa-delirium-2025]
   - Treat pain with acetaminophen and regional or opioid-sparing options before systemic opioids. ^[ags-beers-2023, padis-2018]
   - Daily drinker: ask the time of the last drink and look for tremor, sweating, tachycardia and hypertension (see [[neuro-alcohol-withdrawal|alcohol withdrawal]]). ^[asam-alcohol-withdrawal-2020]
     - Withdrawal delirium usually starts 72 to 96 hours after the last drink and lasts hours to 2 to 3 days. ^[asam-alcohol-withdrawal-2020]
   - Once delirium is present, track sedation and agitation with the {{calc:rass}} and delirium with the {{calc:cam-icu}}, not the {{calc:ciwa-ar|CIWA-Ar}}, which relies on the patient's answers. ^[asam-alcohol-withdrawal-2020]
   - Possible Wernicke encephalopathy: {{dose:thiamine-wernicke-suspected|pill}} before or with glucose. Never delay glucose for hypoglycemia. ^[asam-alcohol-withdrawal-2020, common-practice]

2. Nonpharmacologic bundle (first line for everyone)
   - Reorientation, familiar objects, clock and calendar, family presence, consistent staff, no room changes. ^[nice-delirium-2023, apa-delirium-2025, common-practice]
   - Glasses, hearing aids and dentures in place. Lights on by day, off at night. ^[nice-delirium-2023, common-practice]
   - Sleep: noise down at night, cluster care, no night-time vitals if stable, evening doses given earlier, no late diuretics. ^[nice-delirium-2023, padis-2018, common-practice]
   - No melatonin or ramelteon. The guidelines conflict (see More Information). ^[apa-delirium-2025, padis-2025]
   - Out of bed to a chair with nursing and PT or OT. Remove catheters, lines and telemetry once no longer needed. ^[nice-delirium-2023, padis-2018, common-practice]
   - Oral fluids, or [[renal-iv-fluids|IV fluids]] if hypovolemic. Bowel regimen. ^[nice-delirium-2023, apa-delirium-2025, common-practice]

3. De-escalation
   - Calm, brief, simple communication. Do not argue with delusions. ^[nice-delirium-2023, apa-delirium-2025]
   - Offer toileting and a drink. Restraints only as a last resort. ^[nice-delirium-2023, apa-delirium-2025, common-practice]

4. Antipsychotic for severe agitation (last resort)
   - Give only for severe distress or danger to the patient or others, after de-escalation and cause treatment. Never to prevent or shorten delirium. ^[apa-delirium-2025, nice-delirium-2023]
   - Before the first dose: baseline {{calc:qtc}}, potassium above 4 and magnesium above 2. Stop other QT-prolonging drugs where possible. ^[aha-accf-qt-2010, label-haloperidol-inj-2026, common-practice]
   - First line: {{dose:haloperidol-delirium-ward-iv|pill}} ^[esaic-pod-2024, apa-delirium-2025, label-haloperidol-inj-2026, common-practice]
   - Older or frail adults: {{dose:haloperidol-delirium-low|pill}} ^[esaic-pod-2024, apa-delirium-2025, label-haloperidol-inj-2026, common-practice]
   - Alternatives: {{dose:olanzapine-delirium-low|pill}} or {{dose:quetiapine-delirium-low|pill}}. ^[common-practice]
   - Parkinson disease or dementia with Lewy bodies: no haloperidol or olanzapine. Use quetiapine. ^[label-haloperidol-inj-2026, nice-delirium-2023, common-practice]
   - In dementia, every antipsychotic carries a boxed warning for increased mortality. ^[label-haloperidol-inj-2026, label-zyprexa-2026]
   - ICU with continuous ECG monitoring: {{dose:haloperidol-delirium-icu|pill}}. ^[aid-icu-2022, label-haloperidol-inj-2026]

5. Sedation in the ventilated patient
   - Use {{dose:dexmedetomidine-icu-delirium|pill}} rather than a benzodiazepine, and for delirium-related agitation that prevents weaning or extubation. ^[padis-2018, padis-2025, apa-delirium-2025]

6. Level of care
   - ICU for ventilated or hemodynamically unstable patients ^[apa-delirium-2025, common-practice]
   - One-to-one observation or a sitter for wandering or danger to self ^[apa-delirium-2025, common-practice]

## Monitor
- Delirium screen: ^[padis-2018, nice-delirium-2023]
  - What: {{calc:4at}} on the ward, {{calc:cam-icu}} in the ICU ^[padis-2018, nice-delirium-2023]
  - When: every shift and with any change ^[padis-2018, nice-delirium-2023]
  - Action: a positive screen restarts the cause search (Diagnosis) ^[padis-2018, nice-delirium-2023]
- Sedation depth: {{calc:rass}} with each ICU screen. Target light sedation (most studies defined it as {{calc:rass|RASS}} −2 to +1). ^[padis-2018]
- {{calc:qtc}}, potassium and magnesium on antipsychotics: ^[aha-accf-qt-2010, label-haloperidol-inj-2026, common-practice]
  - When: daily, and after any dose increase or added QT-prolonging drug ^[aha-accf-qt-2010, label-haloperidol-inj-2026, common-practice]
  - Action: if {{calc:qtc|QTc}} >500 ms or up ≥60 ms from baseline, stop or switch the drug and stop other QT-prolonging drugs ^[aha-accf-qt-2010]
  - Action: replete potassium to above 4 and magnesium to above 2 ^[common-practice]
- Before each repeat antipsychotic dose, check sedation, BP and extrapyramidal signs. Hold it for oversedation, hypotension, rigidity or akathisia. ^[label-haloperidol-inj-2026, common-practice]
- Each day, stop any antipsychotic, benzodiazepine or anticholinergic that is no longer needed. ^[apa-delirium-2025, nice-delirium-2023]
  - Action: stop the antipsychotic once symptoms resolve (usually within 1 week) ^[apa-delirium-2025, nice-delirium-2023]
  - Action: do not continue the antipsychotic at discharge ^[apa-delirium-2025, nice-delirium-2023]

## Escalation
- Psychiatry or geriatrics: ^[apa-delirium-2025, common-practice]
  - More than 2 antipsychotic doses needed, or severe agitation not controlled at the lowest dose ^[apa-delirium-2025, common-practice]
  - Diagnostic uncertainty between delirium and a primary psychiatric disorder ^[apa-delirium-2025, common-practice]
  - Catatonia, dementia, Parkinson disease or a prolonged {{calc:qtc|QTc}} ^[apa-delirium-2025, common-practice]
  - Have ready: the workup done so far and the current medication list ^[common-practice]
- Neurology: ^[common-practice]
  - New focal deficit (call a stroke alert), suspected seizure or nonconvulsive status, encephalitis ^[common-practice]
  - Have ready: last known well, baseline deficits and [[heme-anticoagulation-management|anticoagulation]] ^[common-practice]
- ICU: hemodynamic instability, respiratory failure, or agitation that threatens the airway or lines despite the measures above. ^[common-practice]
- Palliative care or a goals-of-care discussion: delirium at the end of life or in prolonged critical illness. ^[common-practice]

## More Information
### Where Guidelines Differ: Antipsychotics, melatonin
:::compare Antipsychotics to treat delirium
- APA 2025: for severe distress or risk of harm after de-escalation fails. Not to prevent or shorten delirium. ^[apa-delirium-2025]
- SCCM PADIS 2025: no recommendation for or against (the 2018 guideline advised against routine use). ^[padis-2025, padis-2018]
:::

:::compare Melatonin
- APA 2025: do not use melatonin or ramelteon to prevent or treat delirium. ^[apa-delirium-2025]
- SCCM PADIS 2025: conditional suggestion to use melatonin in the ICU (low certainty). ^[padis-2025]
:::

### Special Populations: Older adults, postoperative, dementia
- Older adults: avoid these in those with or at high risk of delirium. [!also-above] ^[ags-beers-2023]
  - Anticholinergics, antipsychotics, benzodiazepines, Z-drugs ^[ags-beers-2023]
  - Corticosteroids, H2 blockers and opioids ^[ags-beers-2023]
- Antipsychotics in older adults only if nonpharmacologic options failed and there is substantial risk of harm. ^[ags-beers-2023]
- Postoperative: ^[esaic-pod-2024]
  - No drug prophylaxis ^[esaic-pod-2024]
  - Multicomponent nonpharmacologic care for all at-risk patients ^[esaic-pod-2024]
  - Low-dose haloperidol only if nonpharmacologic measures fail ^[esaic-pod-2024]
- Atypical antipsychotics: low-dose haloperidol and atypicals have similar efficacy and side-effect rates. ^[esaic-pod-2024]

### Complications: Outcomes
- Falls, pressure injury, aspiration, longer stay, loss of independence, and persistent cognitive decline. ^[apa-delirium-2025, common-practice]
- Expected course: days to weeks. Resolution lags the cause. ^[common-practice]

### After the Acute Phase: Discharge
- Document delirium in the discharge summary and tell the family. Arrange follow-up of cognition. ^[apa-delirium-2025]

### Evidence: Key trials
- AID-ICU (2022): IV haloperidol in ICU delirium did not significantly raise days alive and out of hospital at 90 days. ^[aid-icu-2022]
- In that trial, 90-day mortality was lower in the haloperidol group (secondary). ^[aid-icu-2022]
- MIND-USA (2018): IV haloperidol and ziprasidone did not increase days alive without delirium or coma versus placebo (89% hypoactive delirium). ^[mind-usa-2018]
- A2B (2025): dexmedetomidine did not speed extubation compared with propofol and caused more agitation and bradycardia. ^[a2b-2025]
- HELP meta-analysis (2018): multicomponent programs lowered delirium incidence (OR 0.47). ^[help-meta-2018]
- A {{calc:qtc|QTc}} >500 ms carries a 2- to 3-fold torsades risk. ^[aha-accf-qt-2010, label-haloperidol-inj-2026]

### Why the Treatment Order: Cause and environment first
- Delirium is a symptom of a physiologic insult. Treating the cause and removing deliriogenic drugs works, and drugs treat only the behavior. ^[apa-delirium-2025, nice-delirium-2023]

## Pearls
- A normal CT head does not exclude encephalitis or nonconvulsive status epilepticus. With no cause found, send the LP and EEG. ^[common-practice]
- In Parkinson disease, a missed levodopa dose or a new dopamine blocker (metoclopramide, prochlorperazine) can cause delirium. ^[common-practice]

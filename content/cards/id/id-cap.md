---
id: id-cap
type: topic
system: id
subsection: Respiratory Infections
title: Community-Acquired Pneumonia
aliases: [CAP, pneumonia, PNA, community acquired pneumonia, lobar pneumonia, lower respiratory tract infection, LRTI, severe CAP]
definition: "Pneumonia acquired outside the hospital: compatible symptoms with a new infiltrate on chest imaging. ^[idsa-ats-cap-2019]"
based_on: [ats-cap-2025, idsa-ats-cap-2019]
checked: { date: 2026-10-19, by: owner, scope: "owner review", fingerprint: "fde9f6bd4cc4e103", carried: "2026-10-24: Dose sheets now take the drug-wide warnings from drug records (stage 4b). Doses and numbers on the card are unchanged." }
related:
  differential: []
  conditions: [id-complicated-uti, id-cellulitis]
  tools: []
  medications: [ceftriaxone]
---
## At a Glance
- Diagnosis needs a new infiltrate on imaging. A positive viral test does not exclude bacterial coinfection. ^[idsa-ats-cap-2019, ats-cap-2025]
- Severity by {{criteria:idsa-ats-severe-cap}}. Site of care by {{calc:psi-port}} (preferred) or {{calc:curb-65}} plus judgment. ^[idsa-ats-cap-2019]
- Inpatient, not severe: β-lactam plus macrolide, or a respiratory fluoroquinolone alone. Severe: β-lactam plus macrolide or fluoroquinolone. ^[idsa-ats-cap-2019]
- MRSA or *Pseudomonas* coverage: add it for a prior respiratory isolate (within 1 year), or in severe CAP after hospitalization with IV antibiotics in the last 90 days. Culture and de-escalate. ^[idsa-ats-cap-2019]
- Short courses once clinically stable: 3–5 days if not severe, at least 5 days if severe. ^[ats-cap-2025]
- Systemic corticosteroids for severe CAP, not for nonsevere CAP or influenza. ^[ats-cap-2025, sccm-corticosteroids-2024]

## Severity
{{criteria:idsa-ats-severe-cap}}

- Hospitalization: a validated prognostic rule plus clinical judgment. Pneumonia Severity Index ({{calc:psi-port}}) preferred over {{calc:curb-65}}. ^[idsa-ats-cap-2019]
- {{calc:psi-port}} and {{calc:curb-65}} predict 30-day mortality. They were not designed to choose ICU versus ward. ^[idsa-ats-cap-2019]
- Direct ICU admission: hypotension needing vasopressors or respiratory failure needing mechanical ventilation. ^[idsa-ats-cap-2019]
- Otherwise, use the minor criteria with judgment to decide on ICU, step-down or telemetry. Ward patients later transferred to the ICU do worse than those admitted there directly. ^[idsa-ats-cap-2019]

## Causes
- **Bacterial:** [!most-common] *Streptococcus pneumoniae*. *Haemophilus influenzae*, *Moraxella catarrhalis*, *Staphylococcus aureus*, *Legionella*, *Mycoplasma pneumoniae*, *Chlamydia pneumoniae*. ^[idsa-ats-cap-2019]
- **Viral:** influenza, SARS-CoV-2 and other respiratory viruses. Bacterial coinfection occurs but most have none. ^[idsa-ats-cap-2019, idsa-cap-position-2025]
- **Resistant organisms:** [!cannot-miss] MRSA and *Pseudomonas aeruginosa*: strongest risk factors are a prior respiratory isolate (within 1 year) and hospitalization with IV antibiotics in the last 90 days. ^[idsa-ats-cap-2019]
- **MRSA clues:** post-influenza pneumonia, cavitation or necrotizing pneumonia, empyema. ^[idsa-ats-cap-2019, common-practice]
- **Aspiration:** anaerobes are uncommon. Cover them only for lung abscess or empyema. ^[idsa-ats-cap-2019]
- **Mimics:** heart failure, pulmonary embolism, atelectasis, aspiration pneumonitis, organizing pneumonia, malignancy, drug reaction. ^[common-practice]

## Presentation
- Cough, sputum, dyspnea, pleuritic chest pain, fever or chills. ^[common-practice]
- Exam: tachypnea, crackles, bronchial breath sounds, dullness. Hypoxemia. ^[common-practice]
- Older adults: may lack fever or cough. Delirium, falls or decline may be the first sign. ^[common-practice]
- Clinical signs alone are inaccurate: confirm with imaging. ^[idsa-ats-cap-2019]

## Diagnosis
#### Imaging
- Chest radiograph for all. CT if the radiograph is equivocal and the result would change management. ^[idsa-ats-cap-2019, common-practice]
- Lung ultrasound by a trained operator is an acceptable alternative to radiography. ^[ats-cap-2025]

#### Microbiology (inpatients)
- Severe CAP, or empiric MRSA or *Pseudomonas* coverage, or either organism previously isolated, or hospitalized with IV antibiotics in the last 90 days: blood cultures and sputum Gram stain and culture before antibiotics. ^[idsa-ats-cap-2019]
- Intubated: endotracheal aspirate for Gram stain and culture promptly. ^[idsa-ats-cap-2019]
- Severe CAP: pneumococcal and *Legionella* urinary antigens, plus *Legionella* culture or PCR of lower respiratory secretions. *Legionella* testing also with an outbreak or recent travel. ^[idsa-ats-cap-2019]
- MRSA nasal PCR when covering MRSA: negative favors stopping MRSA coverage. ^[idsa-ats-cap-2019]
- Influenza molecular test when influenza is circulating. Test for SARS-CoV-2 during community transmission. ^[idsa-ats-cap-2019, common-practice]
- Not routine in nonsevere CAP without these risks: blood cultures, sputum culture, urinary antigens. ^[idsa-ats-cap-2019]

#### Other tests
- CBC, BMP (BUN for severity), glucose ^[common-practice]
- Blood gas or SpO₂ ^[common-practice]
- Lactate if septic ^[common-practice]
- Procalcitonin: do not use it to withhold antibiotics in radiographically confirmed CAP. ^[idsa-ats-cap-2019]

## Treatment
1. Start antibiotics promptly
   - Draw cultures first when indicated, without delaying the first dose. Choose by setting, severity and resistance risk. ^[idsa-ats-cap-2019, common-practice]
   - Healthcare-associated pneumonia (HCAP) is no longer a reason for broad coverage. ^[idsa-ats-cap-2019]

   {{regimen:cap-inpatient-nonsevere}}

   {{regimen:cap-inpatient-severe}}

2. Add MRSA or *Pseudomonas* coverage only with risk factors
   - Prior respiratory isolate of either organism (within 1 year): add coverage and culture. ^[idsa-ats-cap-2019]
   - Hospitalization with IV antibiotics in the last 90 days plus locally validated risk factors: severe CAP, add coverage. Nonsevere CAP, culture and add only if positive (MRSA: or if the nasal PCR is positive). ^[idsa-ats-cap-2019]

   {{regimen:cap-mrsa}}

   {{regimen:cap-pseudomonas}}

   - De-escalate at 48 hours if cultures (and the MRSA nasal PCR) are negative and the patient is improving. ^[idsa-ats-cap-2019]

3. Respiratory virus positive
   - Influenza: oseltamivir for all inpatients with CAP and influenza, regardless of symptom duration. ^[idsa-ats-cap-2019]
   - Influenza with CAP: standard antibacterial therapy too (strong recommendation). ^[idsa-ats-cap-2019]
   - Other viruses: ATS suggests antibacterials for all inpatients. IDSA favors deciding case by case in nonsevere illness (see Where Guidelines Differ). ^[ats-cap-2025, idsa-cap-position-2025]

   {{dose:oseltamivir-influenza}}

4. Severe CAP: systemic corticosteroids
   - Suggested for severe CAP, best within 24 hours of meeting severe criteria ^[ats-cap-2025, sccm-corticosteroids-2024, cape-cod-2023]
   - Not for nonsevere CAP ^[ats-cap-2025, sccm-corticosteroids-2024, cape-cod-2023]
   - Not with influenza ^[ats-cap-2025, sccm-corticosteroids-2024, cape-cod-2023]

   {{dose:hydrocortisone-severe-cap}}

5. Switch to oral and stop
   - Switch to an oral agent of the same or similar class once improving, hemodynamically stable and able to take oral medication. ^[common-practice]
   - Not severe, clinically stable: 3–5 days in total. ^[ats-cap-2025]
   - Severe, clinically stable: at least 5 days. ^[ats-cap-2025]
   - Suspected or proven MRSA or *Pseudomonas*: 7 days. ^[idsa-ats-cap-2019]
   - Longer for empyema, lung abscess, meningitis or other extrapulmonary infection, or slow response. ^[ats-cap-2025, idsa-ats-cap-2019, common-practice]

- Aspiration pneumonia: standard CAP regimens. Add anaerobic coverage only for lung abscess or empyema. ^[idsa-ats-cap-2019]
- Parapneumonic effusion: sample it. Drain empyema or a complicated effusion. ^[common-practice]

## Monitor
{{criteria:cap-clinical-stability}}

- Vital signs, SpO₂ and mental status at least daily. Antibiotics continue until stable and for the minimum course. ^[idsa-ats-cap-2019, ats-cap-2025]
- Not improving by 48–72 hours: review cultures. Look for empyema, lung abscess, a resistant or unusual organism, or another diagnosis (CT, thoracentesis). ^[common-practice]
- Follow-up chest imaging is not routine when symptoms resolve within 5–7 days. ^[idsa-ats-cap-2019]

## Escalation
- ICU: vasopressors or mechanical ventilation. Consider with 3 or more minor criteria. ^[idsa-ats-cap-2019]
- Pulmonology or interventional radiology: complicated parapneumonic effusion, empyema, lung abscess. ^[common-practice]
- Infectious diseases: MRSA or *Pseudomonas* pneumonia, bacteremia, immunocompromise, failure to improve. ^[common-practice]

## More Information
### Where Guidelines Differ: Viral tests, duration, steroids
:::compare Antibiotics when a respiratory virus is found
- IDSA/ATS 2019: Influenza with CAP: standard antibacterials, inpatient and outpatient (strong). ^[idsa-ats-cap-2019]
- ATS 2025: Suggests antibiotics for all virus-positive inpatients and for outpatients with comorbidities. ^[ats-cap-2025]
- IDSA 2025: Did not endorse the guideline for this reason. Most have no bacterial coinfection, and briefly withholding antibiotics in nonsevere illness to clarify the diagnosis is safe. ^[idsa-cap-position-2025]
:::

:::compare Antibiotic duration
- IDSA/ATS 2019: Until clinically stable and at least 5 days. ^[idsa-ats-cap-2019]
- ATS 2025: Not severe: 3–5 days once stable. Severe: at least 5 days. ^[ats-cap-2025]
:::

:::compare Corticosteroids in severe CAP
- ATS 2025: Suggests them (conditional). Not in influenza. ^[ats-cap-2025]
- SCCM 2024: Recommends them for hospitalized severe bacterial CAP (strong). ^[sccm-corticosteroids-2024]
- IDSA/ATS 2019: Did not suggest routine use (superseded). ^[idsa-ats-cap-2019]
:::

### Special Populations: Immunocompromise, pregnancy, kidney disease
- Immunocompromise (neutropenia, chemotherapy, transplant, advanced HIV): outside these guidelines. Broader coverage and early infectious diseases input. ^[idsa-ats-cap-2019, common-practice]
- Pregnancy: avoid fluoroquinolones and tetracyclines when alternatives exist. ^[common-practice]
- Kidney impairment: adjust β-lactams, fluoroquinolones and oseltamivir by {{calc:cockcroft-gault}} (see each dose sheet). ^[common-practice]
- Macrolides and fluoroquinolones prolong QT: check the ECG and interacting drugs. ^[label-zithromax-iv-2026, label-levofloxacin-2024, label-moxifloxacin-2025]

### Complications: Effusion, abscess, sepsis
- Parapneumonic effusion and empyema ^[common-practice]
- Lung abscess ^[common-practice]
- Necrotizing pneumonia (*S. aureus*) ^[common-practice]
- Sepsis, respiratory failure, ARDS. ^[common-practice]
- Bacteremia. Pneumococcal meningitis. ^[common-practice]

### After the Acute Phase: Outpatient regimens, follow-up
- Outpatient treatment depends on comorbidities: chronic heart, lung, liver or kidney disease, diabetes, alcohol use disorder, malignancy or asplenia. ^[idsa-ats-cap-2019]

{{regimen:cap-outpatient-healthy}}

{{regimen:cap-outpatient-comorbid}}

- A patient recently given one antibiotic class should receive a different class. ^[idsa-ats-cap-2019]
- Follow-up imaging only if symptoms persist, or as indicated for lung cancer screening. ^[idsa-ats-cap-2019]
- Pneumococcal and influenza vaccination, smoking cessation. ^[common-practice]

### Evidence: Key trials
- CAPE COD (2023): hydrocortisone in ICU patients with severe CAP lowered 28-day mortality (6.2% vs 11.9%). Excluded influenza and septic shock. ^[cape-cod-2023]
- β-lactam plus macrolide was associated with lower mortality than β-lactam plus fluoroquinolone in severe CAP (observational). ^[idsa-ats-cap-2019]

## Pearls
- Aspiration is not an indication for anaerobic coverage unless there is abscess or empyema. ^[idsa-ats-cap-2019]
- Doxycycline replaces the macrolide only when macrolides and fluoroquinolones are both unsuitable, and not in severe CAP. ^[idsa-ats-cap-2019]
- A negative MRSA nasal PCR favors stopping vancomycin or linezolid, especially in nonsevere CAP with negative cultures. ^[idsa-ats-cap-2019]
- Low procalcitonin does not rule out bacterial CAP. ^[idsa-ats-cap-2019]

---
id: heme-vte-prophylaxis
type: topic
system: heme
title: "VTE Prophylaxis"
aliases: [VTE prophylaxis, DVT prophylaxis, thromboprophylaxis, DVT ppx, blood clot prevention, Padua, IMPROVE, Caprini, enoxaparin prophylaxis, heparin subcutaneous, SQ heparin, SCDs, sequential compression devices, intermittent pneumatic compression, compression stockings, TED hose, extended prophylaxis, mechanical prophylaxis, hospital-acquired VTE]
definition: "Preventing deep vein thrombosis and pulmonary embolism in hospitalized medical and surgical patients by assessing thrombotic and bleeding risk on admission, then choosing pharmacologic prophylaxis (low-molecular-weight heparin, unfractionated heparin or fondaparinux), mechanical prophylaxis, or neither. ^[ash-vte-medical-prophylaxis-2018, ash-vte-surgical-2019, nice-ng89-2018]"
based_on: [ash-vte-medical-prophylaxis-2018, ash-vte-surgical-2019, chest-prophylaxis-medical-2012, chest-prophylaxis-surgical-2012, nice-ng89-2018, label-lovenox-2026]
checked: { date: 2026-10-22, by: opus, scope: "doses and numbers", fingerprint: "9eeafcd83e1897be", carried: "2026-10-25: Format sweep (bullets split, tables to bullets or scale, society names out of text). Numbers, doses, drugs and sources unchanged." }
related:
  conditions: [heme-anticoagulation-management, pulm-vte-diagnosis, crit-sepsis, cardio-atrial-fibrillation]
---
## At a Glance
- Assess VTE risk and bleeding risk in every admitted patient, on admission and again when the clinical picture changes. ^[nice-ng89-2018, chest-prophylaxis-medical-2012, acp-vte-prophylaxis-2011]
- Acutely ill medical patients at increased VTE risk without high bleeding risk: pharmacologic prophylaxis for the hospital stay. Drug choice: ^[ash-vte-medical-prophylaxis-2018, chest-prophylaxis-medical-2012, marti-nma-2026]
   - Low-molecular-weight heparin (LMWH) is preferred.
   - Unfractionated heparin or fondaparinux are alternatives.
- Low VTE risk (ambulatory, short stay): no prophylaxis. ^[chest-prophylaxis-medical-2012]
- Active bleeding, high bleeding risk or a contraindication: intermittent pneumatic compression (IPC) until it is safe to start a drug. ^[ash-vte-medical-prophylaxis-2018, chest-prophylaxis-medical-2012]
- Do not extend prophylaxis after discharge in medical patients. Extended duration trades fewer symptomatic clots for more major bleeding. ^[ash-vte-medical-prophylaxis-2018, cochrane-extended-prophylaxis-2024]
- Kidney failure ({{calc:cockcroft-gault}} <30): unfractionated heparin, or a reduced once-daily enoxaparin dose (see Treatment). Fondaparinux is contraindicated. ^[label-lovenox-2026, label-arixtra-2024, nice-ng89-2018]

## Definition and Staging
#### Medical patients
- Score VTE risk with the {{calc:padua}} (high risk is 4 or more points) or the {{calc:improve-vte}} (2 or more points is at risk, 4 or more is high risk). ^[padua-2010, improve-vte-2011, ash-vte-medical-prophylaxis-2018]
- Both are named but neither is recommended over the other. Use a local policy consistently. ^[padua-2010, improve-vte-2011, ash-vte-medical-prophylaxis-2018]
- {{calc:padua|Padua}} items: ^[padua-2010]
   - Active cancer, previous VTE, reduced mobility, known thrombophilia (3 points each).
   - Trauma or surgery within 1 month (2).
   - Age 70 or older, heart or respiratory failure, acute myocardial infarction or ischemic stroke (1 each).
   - Acute infection or rheumatologic disorder, obesity (BMI 30 kg/m² or more), ongoing hormonal treatment (one point each).
- Score bleeding risk with the {{calc:improve-bleeding}} (7 or more points is high bleeding risk). ^[improve-bleeding-2011]
- Risk scores are not a substitute for judgment. In a 10-hospital US cohort, using a risk score went with less prophylaxis in low-risk patients (observational). ^[gunaratne-2025, common-practice]

#### Surgical patients
- Stratify with the {{calc:caprini}} (2012 guideline): ^[caprini-2005, chest-prophylaxis-surgical-2012]
   - Very low (0): early ambulation only. ^[chest-prophylaxis-surgical-2012]
   - Low (1–2): mechanical prophylaxis (IPC). ^[chest-prophylaxis-surgical-2012]
   - Moderate (3–4): LMWH, low-dose unfractionated heparin or IPC. ^[chest-prophylaxis-surgical-2012]
   - High (5 or more): LMWH or low-dose unfractionated heparin plus mechanical prophylaxis. ^[chest-prophylaxis-surgical-2012]
- The 2019 surgical guideline does not use a score. ^[ash-vte-surgical-2019]
- For major surgery it suggests pharmacologic or mechanical prophylaxis, combined for high VTE risk, and mechanical alone when bleeding risk is high. ^[ash-vte-surgical-2019]

## First Steps
- On admission (and when the picture changes): assess VTE risk, bleeding risk and contraindications. Document the decision. ^[nice-ng89-2018, acp-vte-prophylaxis-2011]
- Bleeding risk factors that favor withholding a drug: ^[improve-bleeding-2011, common-practice]
   - Active gastroduodenal ulcer, or bleeding in the 3 months before admission.
   - Platelets below 50,000/mm³.
   - Hepatic failure with INR above 1.5.
   - Age 85 or older (3.5 points).
   - Hepatic failure, GFR below 30, ICU stay (2.5 each).
   - Central venous catheter, rheumatic disease, active cancer (2 each).
   - Age 40–84 (1.5).
   - Male sex, GFR 30–59 (1 each).
- Absolute reasons to withhold pharmacologic prophylaxis: ^[common-practice]
   - Active major bleeding.
   - Acute intracranial hemorrhage.
   - Severe coagulopathy or thrombocytopenia (platelets below 50,000/mm³ is a common threshold, individualize).
- Heparin-induced thrombocytopenia (HIT): ^[label-lovenox-2026, label-heparin-2025]
   - Enoxaparin is contraindicated with HIT in the past 100 days or circulating antibodies.
   - Unfractionated heparin is contraindicated with any history.
- Do not give prophylaxis to chronically ill or nursing-home patients, or to outpatients with minor provoking factors. ^[ash-vte-medical-prophylaxis-2018]
- Check weight, creatinine ({{calc:cockcroft-gault}}), platelets and the planned procedures or lines (neuraxial anesthesia, lumbar puncture). ^[label-lovenox-2026, common-practice]
- Already on therapeutic anticoagulation: no additional prophylaxis. ^[common-practice]

## Treatment
1. Decide whether to give a drug
   :::scale Prophylaxis by risk
   - Low VTE risk or fully ambulatory: none. ^[chest-prophylaxis-medical-2012]
   - Acutely ill medical, increased VTE risk, no high bleeding risk: pharmacologic prophylaxis. ^[ash-vte-medical-prophylaxis-2018, chest-prophylaxis-medical-2012]
   - High bleeding risk or contraindication: IPC. Reassess daily and add a drug when bleeding risk falls. ^[ash-vte-medical-prophylaxis-2018, nice-ng89-2018]
   :::
   - **Critically ill:** LMWH or unfractionated heparin. Add IPC only if drugs are contraindicated. ^[ash-vte-medical-prophylaxis-2018, ssc-sepsis-2026, prevent-2019]
   - **Acute ischemic stroke with immobility:** IPC (class 1). Prophylactic-dose SC unfractionated heparin or LMWH is reasonable (class 2a) once hemorrhage is excluded. ^[aha-asa-stroke-2026, clots3-2013, ash-vte-medical-prophylaxis-2018]
   - **Surgery:** By {{calc:caprini}} tier or the 2019 surgical guideline (see Definition and Staging). ^[chest-prophylaxis-surgical-2012, ash-vte-surgical-2019]

2. Choose the drug
   - LMWH is preferred in medical patients. LMWH or fondaparinux is suggested over unfractionated heparin. ^[ash-vte-medical-prophylaxis-2018, marti-nma-2026]
   - A 2026 network meta-analysis found major bleeding higher with unfractionated heparin and DOACs than with LMWH. ^[ash-vte-medical-prophylaxis-2018, marti-nma-2026]
   - Do not use DOACs for inpatient prophylaxis (LMWH is recommended over DOACs). ^[ash-vte-medical-prophylaxis-2018, label-xarelto-2026]
   - Rivaroxaban remains labeled for acutely ill medical patients, but apixaban is not, and betrixaban was withdrawn in 2020. ^[ash-vte-medical-prophylaxis-2018, label-xarelto-2026]

   {{dose:enoxaparin-prophylaxis}}
   {{dose:heparin-prophylaxis}}
   {{dose:fondaparinux-prophylaxis}}

   - After abdominal surgery: ^[label-lovenox-2026]

   {{dose:enoxaparin-prophylaxis-surgery}}

3. Adjust for the patient
   - **Kidney failure:** {{calc:cockcroft-gault}} <30: reduced once-daily enoxaparin dose (see the dose sheet) or unfractionated heparin. Fondaparinux contraindicated. ^[label-lovenox-2026, label-arixtra-2024, nice-ng89-2018]
   - **Weight <50 kg:** fondaparinux contraindicated. Enoxaparin carries more bleeding below 45 kg (women) and 57 kg (men). ^[label-arixtra-2024, label-lovenox-2026]
   - **BMI >30 kg/m²:** the label states no consensus on enoxaparin dose. Many centers double the dose to twice daily at BMI ≥40. ^[label-lovenox-2026, common-practice]
   - **Neuraxial anesthesia or lumbar puncture planned:** ^[label-lovenox-2026, label-arixtra-2024]
      - Enoxaparin: leave 12 hours after the last dose. Restart ≥4 hours after catheter removal.
      - Consider doubling the intervals if {{calc:cockcroft-gault}} <30.
      - Fondaparinux: timing unknown on the label, use anesthesia guidance.
   - **HIT history:** fondaparinux. No heparin. ^[ash-hit-2018]

4. Add mechanical prophylaxis
   - IPC is preferred over graduated compression stockings (2019 surgical guideline, UK guidance). ^[ash-vte-surgical-2019, nice-ng89-2018, acp-vte-prophylaxis-2011]
   - Stockings are strongly recommended against. ^[ash-vte-surgical-2019, nice-ng89-2018, acp-vte-prophylaxis-2011]
   - Stockings cause harm in stroke (stroke guideline 2026, class 3). ^[ash-vte-surgical-2019, nice-ng89-2018, acp-vte-prophylaxis-2011]
   - Pharmacologic or mechanical alone is preferred over both together in medical patients. The combination is for high-risk surgical patients. ^[ash-vte-medical-prophylaxis-2018, ash-vte-surgical-2019]

5. Duration
   - Medical: for the hospital stay, usually 6–11 days (until ambulatory). Stop at discharge. ^[ash-vte-medical-prophylaxis-2018, cochrane-extended-prophylaxis-2024, mariner-2018, apex-2016, label-lovenox-2026]
   - Extended prophylaxis is recommended against (strong). Two trials each missed their primary endpoint. ^[ash-vte-medical-prophylaxis-2018, cochrane-extended-prophylaxis-2024, mariner-2018, apex-2016, label-lovenox-2026]
   - Pooled (2024 review), extended prophylaxis prevents 1 symptomatic VTE per about 200 treated. ^[ash-vte-medical-prophylaxis-2018, cochrane-extended-prophylaxis-2024, mariner-2018, apex-2016, label-lovenox-2026]
   - The cost is 1 major bleed per about 300, with no mortality benefit. ^[ash-vte-medical-prophylaxis-2018, cochrane-extended-prophylaxis-2024, mariner-2018, apex-2016, label-lovenox-2026]
   - Neurosurgery, transurethral prostatectomy, radical prostatectomy or laparoscopic cholecystectomy: pharmacologic prophylaxis is suggested against. ^[ash-vte-surgical-2019]
   - Hip or knee arthroplasty: aspirin or an anticoagulant, LMWH over unfractionated heparin. ^[ash-vte-surgical-2019]
   - Major surgery: extended prophylaxis (beyond 3 weeks) is suggested over short-term. ^[ash-vte-surgical-2019, chest-prophylaxis-surgical-2012, asco-vte-cancer-2023]
   - After major abdominal or pelvic cancer surgery, extended LMWH to 4 weeks is recommended for high-risk features (grade 1B, cancer guideline). ^[ash-vte-surgical-2019, chest-prophylaxis-surgical-2012, asco-vte-cancer-2023]

## Monitor
- Reassess VTE and bleeding risk daily. Stop the drug when the patient is ambulatory or discharged. ^[nice-ng89-2018, common-practice]
- Hemoglobin and signs of bleeding. Creatinine at least every few days (LMWH accumulates as clearance falls). ^[label-lovenox-2026, common-practice]
- Platelets: every 2–3 days from day 4 to 14 on unfractionated heparin (at least every other day after surgery). ^[ash-hit-2018, common-practice]
- No routine screening on LMWH in medical patients is suggested, though the label advises periodic counts. See the HIT section of [[heme-anticoagulation-management|Anticoagulant Selection]]. ^[ash-hit-2018, common-practice]
- Anti-Xa levels are not routine. Consider at weight above 150 kg or {{calc:cockcroft-gault}} below 30 on prolonged LMWH. ^[common-practice]

## Escalation
- Bleeding on prophylaxis: stop the drug, switch to IPC, assess the source. ^[common-practice]
- Platelets fall by more than 50% or new thrombosis: ^[ash-hit-2018]
   - Score the {{calc:4ts}}.
   - If intermediate or high, stop all heparin and start a non-heparin anticoagulant (argatroban, fondaparinux or a DOAC) at therapeutic dose.
- New leg swelling or hypoxemia despite prophylaxis: work up for VTE with the {{calc:wells-dvt}} or {{calc:wells-pe}} ([[pulm-vte-diagnosis|VTE diagnosis]]). Prophylaxis is not a reason to withhold imaging. ^[ash-vte-diagnosis-2018, common-practice]

## More Information
### Special Populations: ICU, cancer, stroke, kidney, obesity, pregnancy
#### Critical illness
- UFH or LMWH over no prophylaxis (strong), LMWH over UFH (suggested). ^[ash-vte-medical-prophylaxis-2018, ssc-sepsis-2026, prevent-2019]
- The 2026 sepsis guideline recommends pharmacologic prophylaxis in sepsis, LMWH over UFH, and pharmacologic alone over adding mechanical. ^[ash-vte-medical-prophylaxis-2018, ssc-sepsis-2026, prevent-2019]
- Adjunctive IPC did not reduce proximal DVT in a randomized trial. ^[ash-vte-medical-prophylaxis-2018, ssc-sepsis-2026, prevent-2019]

#### Cancer
- Hospitalized medical patients with cancer and no VTE: suggested prophylaxis over none, LMWH over unfractionated heparin. Stop at discharge. ^[ash-vte-cancer-2021]

#### Stroke
- Acute ischemic stroke with impaired mobility: IPC added to routine care (2026 stroke guideline recommendation, class 1). ^[aha-asa-stroke-2026, clots3-2013, nice-ng89-2018]
- A randomized trial showed fewer DVTs with IPC. Stockings are not used. ^[aha-asa-stroke-2026, clots3-2013, nice-ng89-2018]

#### Kidney and obesity
- Kidney: see Treatment step 3. UK guidance defines renal impairment as {{calc:ckd-epi|eGFR}} <30 and advises LMWH or unfractionated heparin with dose reduction if needed. ^[nice-ng89-2018]
- Obesity: no guideline or randomized trial sets an inpatient enoxaparin dose. Observational data support higher doses. ^[label-lovenox-2026, common-practice]

#### Pregnancy and postpartum
- Hospitalized pregnant or postpartum patients: ^[ash-vte-pregnancy-2018, acog-pb-196-2018]
  - LMWH is used ^[ash-vte-pregnancy-2018, acog-pb-196-2018]
  - Warfarin and DOACs are avoided ^[ash-vte-pregnancy-2018, acog-pb-196-2018]
  - Doses are weight-based ^[ash-vte-pregnancy-2018, acog-pb-196-2018]
  - Consult obstetrics and the [[heme-anticoagulation-management|Anticoagulant Selection]] card ^[ash-vte-pregnancy-2018, acog-pb-196-2018]

#### COVID-19
- Critically ill: prophylactic dose over intermediate or therapeutic dose. ^[ash-covid-vte-2025]
- Acutely ill, not critical: therapeutic-intensity heparin is suggested over prophylactic dose (conditional, low certainty). ^[ash-covid-vte-2025]
- After discharge, no extended pharmacologic prophylaxis. ^[ash-covid-vte-2025]

## Pearls
- No prophylaxis is needed in a patient already therapeutically anticoagulated. ^[common-practice]
- Fondaparinux is off-label in medical patients and contraindicated below {{calc:cockcroft-gault}} 30 or 50 kg. ^[label-arixtra-2024, artemis-2006]
- Do not give prophylaxis by default: low-risk medical patients get none. ^[chest-prophylaxis-medical-2012]

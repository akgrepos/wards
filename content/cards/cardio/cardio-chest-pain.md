---
id: cardio-chest-pain
type: topic
system: cardio
title: "Chest Pain"
aliases: [chest pain, chest discomfort, chest tightness, chest pressure, angina, HEART, HEART score, ADD-RS, aortic dissection, tension pneumothorax, Boerhaave, esophageal rupture, pericarditis, tamponade, costochondritis, GERD, rule out MI, rule out ACS, coronary CT angiography, stress test, cannot-miss chest pain, undifferentiated chest pain]
definition: "Acute chest pain or equivalent discomfort needing a time-sensitive search for life-threatening causes: acute coronary syndrome, pulmonary embolism, aortic dissection, tension pneumothorax, esophageal rupture, pericardial tamponade. ^[aha-acc-chest-pain-2021]"
based_on: [aha-acc-chest-pain-2021, acc-aha-acs-2025, udmi-2026]
checked: { date: 2026-10-21, by: opus, scope: "doses and numbers", fingerprint: "5525abd2995bf262" }
related:
  differential: [cardio-nste-acs, pulm-vte-diagnosis, cardio-adhf, cardio-atrial-fibrillation, id-cap, pulm-copd-exacerbation]
  conditions: [crit-hypoxemic-respiratory-failure, crit-sepsis]
  tools: []
---
## At a Glance
- Within 10 minutes: 12-lead ECG read by a clinician, vital signs, and a focused history and examination looking for the six cannot-miss causes. ^[aha-acc-chest-pain-2021]
- ST elevation or an equivalent: reperfusion pathway at once, not a troponin wait. ^[acc-aha-acs-2025, aha-acc-chest-pain-2021]
- Otherwise high-sensitivity troponin at presentation and again at 1–3 hours. Interpret with symptom onset time and the ECG. ^[aha-acc-chest-pain-2021]
- Estimate risk with {{calc:heart-score|HEART}} (ACS), {{calc:wells-pe|Wells}} and {{calc:perc}} (PE), and {{calc:add-rs}} (aortic dissection). A score applies only when its disease is in the differential. ^[aha-acc-chest-pain-2021, aha-acc-pe-2026, acc-aha-aortic-2022]
- Pain that is tearing, or with a pulse or pressure difference: CT angiography of the aorta before any antithrombotic. ^[acc-aha-aortic-2022, esc-paad-2024]
- Unstable, hypotensive, hypoxemic or with new regional wall-motion or right heart strain: bedside echocardiography and early senior help. ^[common-practice]

## Definition and Staging
- Chest pain is a symptom: the first task is to find or exclude the diagnoses that are fatal within hours, not to name the most likely one. ^[aha-acc-chest-pain-2021]

:::scale Triage by first-minutes findings
- Stable: normal vital signs, nondiagnostic ECG, pain controlled. Follows the troponin and risk-score pathway. ^[aha-acc-chest-pain-2021]
- Time-critical: ECG changes of ischemia, positive troponin, or a high-risk score. Admit and treat as the leading diagnosis. ^[aha-acc-chest-pain-2021, acc-aha-acs-2025]
- Unstable: hypotension, shock, hypoxemia, ongoing arrhythmia or arrest. Resuscitate while diagnosing. ^[aha-acls-2025, common-practice]
:::

## First Steps
1. Monitor and look
   - Continuous ECG monitoring, defibrillator pads nearby, intravenous access, pulse oximetry, bilateral arm blood pressure. ^[common-practice]
   - Resuscitation takes priority: airway, oxygen to target (not routine at SpO₂ ≥90%), fluids or vasopressors for shock. ^[acc-aha-acs-2025, common-practice]
2. 12-lead ECG within 10 minutes
   - STEMI or equivalent (posterior, new LBBB with ischemia, hyperacute T waves, de Winter): activate the cath lab. See [[cardio-nste-acs]] for ST depression and non-STEMI care. ^[acc-aha-acs-2025]
   - If the first ECG is nondiagnostic, repeat it with ongoing symptoms, deterioration or high suspicion. ^[aha-acc-chest-pain-2021]
3. Rule out the immediate killers at the bedside
   - Absent breath sounds, tracheal shift and hypotension: tension pneumothorax. Decompress without waiting for imaging. ^[common-practice]
   - Hypotension, jugular venous distension and muffled heart sounds: tamponade. Bedside echocardiography. ^[common-practice]
   - Pulse or blood pressure differential, tearing pain, or a wide mediastinum: aortic dissection. Hold anticoagulants and antiplatelets until it is excluded. ^[acc-aha-aortic-2022, common-practice]
4. Draw troponin and a basic set
   - High-sensitivity troponin, CBC, BMP, and coagulation studies if anticoagulation is likely. ^[aha-acc-chest-pain-2021, common-practice]
   - Portable chest radiograph while awaiting the first troponin. ^[aha-acc-chest-pain-2021]
5. Aspirin, if ACS is likely and dissection is not
   - Do not give it to a patient with tearing pain, a pulse deficit or a pressure differential until dissection is excluded. ^[acc-aha-aortic-2022, common-practice]

## Causes
- **Acute coronary syndrome:** [!cannot-miss] STEMI, NSTEMI, unstable angina. The leading cause of fatal chest pain. See [[cardio-nste-acs]]. ^[aha-acc-chest-pain-2021]
- **Pulmonary embolism:** [!cannot-miss] pleuritic pain, dyspnea, tachycardia, risk factors. See [[pulm-vte-diagnosis]]. ^[aha-acc-chest-pain-2021, aha-acc-pe-2026]
- **Aortic dissection:** [!cannot-miss] abrupt tearing pain to the back, hypertension or hypotension, pulse deficit. ^[acc-aha-aortic-2022]
- **Tension pneumothorax:** [!cannot-miss] hypotension, hypoxemia, unilateral absent breath sounds, tracheal deviation (late). ^[common-practice]
- **Esophageal rupture:** [!cannot-miss] pain after forceful vomiting or instrumentation, subcutaneous emphysema, fever. ^[common-practice]
- **Pericardial disease:** [!cannot-miss] acute pericarditis (pleuritic, positional pain, rub, diffuse ST elevation). Tamponade (hypotension, jugular venous distension, pulsus paradoxus). ^[esc-myopericarditis-2025, acc-pericarditis-ccg-2025]
- **Musculoskeletal:** [!most-common] costochondritis, chest-wall strain, rib fracture. Pain reproduced by palpation or movement. ^[aha-acc-chest-pain-2021]
- **Gastrointestinal:** [!most-common] reflux, esophageal spasm, peptic ulcer disease, biliary colic, pancreatitis. ^[aha-acc-chest-pain-2021]
- **Other cardiac:** myocarditis, Takotsubo syndrome, heart failure, arrhythmia (see [[cardio-atrial-fibrillation]], [[cardio-adhf]]), valvular disease, hypertrophic cardiomyopathy. ^[aha-acc-chest-pain-2021]
- **Pulmonary:** pneumonia ([[id-cap]]), pleurisy, COPD exacerbation ([[pulm-copd-exacerbation]]), simple pneumothorax. ^[common-practice]
- **Other:** herpes zoster, anxiety or panic, sickle cell crisis, cocaine or methamphetamine use. ^[common-practice, aha-cocaine-2008]

## Presentation
#### Focused history
- Character, onset (abrupt or gradual), location and radiation, duration, exertional or positional change, and associated dyspnea, diaphoresis, nausea, syncope. ^[aha-acc-chest-pain-2021]
- Describe pain as cardiac, possibly cardiac or noncardiac. Avoid "typical" and "atypical". Women, older adults and patients with diabetes more often have dyspnea, fatigue or epigastric discomfort. ^[aha-acc-chest-pain-2021]
- ACS risk factors, prior coronary disease, cocaine or methamphetamine use. ^[aha-acc-chest-pain-2021]
- PE: recent immobilization, surgery, cancer, prior VTE, estrogen, unilateral leg swelling. ^[aha-acc-pe-2026]
- Dissection: hypertension, connective tissue disease, bicuspid or other aortic valve disease, family history of aortic disease, recent aortic surgery or catheterization. ^[acc-aha-aortic-2022]
- Esophageal rupture: vomiting or retching, endoscopy, foreign body ingestion. ^[common-practice]

#### Focused examination
- Vital signs in both arms. Shock, hypoxemia, new tachypnea. ^[acc-aha-aortic-2022, common-practice]
- Breath sounds, tracheal position, subcutaneous emphysema. ^[common-practice]
- Heart: new murmur (aortic regurgitation, mitral regurgitation), friction rub, muffled sounds, jugular venous distension, pulsus paradoxus. ^[common-practice]
- Pulses in all four limbs. Focal neurologic deficit. ^[acc-aha-aortic-2022]
- Chest wall palpation. Reproducible pain lowers but does not exclude ACS. ^[aha-acc-chest-pain-2021]

## Diagnosis
#### ECG and troponin: ACS pathway
- 12-lead ECG within 10 minutes. A normal ECG does not exclude ACS. ^[aha-acc-chest-pain-2021]
- High-sensitivity troponin at presentation and again at 1–3 hours (3–6 hours with conventional assays). Use the assay's validated algorithm and sex-specific 99th percentile. ^[aha-acc-chest-pain-2021, udmi-2026]
- Normal ECG, symptom onset at least 3 hours before arrival and a single troponin below the assay's limit of detection: reasonable to exclude myocardial injury. ^[aha-acc-chest-pain-2021]
- A rise and/or fall with at least one value above the 99th percentile plus ischemic symptoms or ECG changes is MI. Stable or unrelated elevations are myocardial injury. ^[udmi-2026]
- Diagnosis, risk and care for confirmed ACS: [[cardio-nste-acs]]. ^[acc-aha-acs-2025]

#### Risk scores
- {{calc:heart-score}}: History, ECG, Age, Risk factors, Troponin (0–2 each). ^[backus-heart-2013, aha-acc-chest-pain-2021]

:::scale HEART risk bands
- 0–3: low risk (major cardiac event about 2% at 6 weeks). Early discharge reasonable after serial troponin. ^[backus-heart-2013, aha-acc-chest-pain-2021]
- 4–6: moderate risk (about 17%). Observation and further testing. ^[backus-heart-2013, aha-acc-chest-pain-2021]
- 7–10: high risk (about 50%). Admit and manage per [[cardio-nste-acs]]. ^[backus-heart-2013, aha-acc-chest-pain-2021]
:::

- Dissection: {{criteria:add-rs}} ^[acc-aha-aortic-2022, rogers-add-rs-2011]
- PE: {{calc:wells-pe|Wells}}, then {{calc:perc}} if low. Workup in [[pulm-vte-diagnosis]]. ^[aha-acc-pe-2026]

#### Aortic dissection
- {{calc:add-rs}} 2–3 (high): CT angiography of the aorta directly. A D-dimer does not change this. ^[acc-aha-aortic-2022, esc-paad-2024]
- {{calc:add-rs}} 0–1 with D-dimer below 500 ng/mL FEU: dissection is excluded without imaging (ADvISED: failure rate 0.3%). ^[acep-aortic-2025, esc-paad-2024, advised-2018]
- {{calc:add-rs}} 1 with D-dimer at or above 500 ng/mL FEU: CT angiography. D-dimer is not used in a score of 2 or more. ^[esc-paad-2024, advised-2018]
- Unstable patient who cannot go to CT: transesophageal echocardiography. ^[acc-aha-aortic-2022]

#### Imaging
- Chest radiograph for all: pneumothorax, widened mediastinum, pneumonia, pleural effusion, free mediastinal air. ^[aha-acc-chest-pain-2021]
- Bedside echocardiography: effusion and tamponade, regional wall-motion abnormality, RV dilation, aortic root. ^[aha-acc-chest-pain-2021, common-practice]
- CT pulmonary angiography for PE after probability and D-dimer steps. ^[aha-acc-pe-2026]
- Esophageal rupture: CT esophagram (chest CT with oral contrast) preferred over fluoroscopic esophagram. ^[sts-esophageal-2026]

#### After a negative troponin pathway
- Low risk (rapid-rule-out): no further testing, or outpatient testing. Do not stress-test routinely. ^[aha-acc-chest-pain-2021]
- Intermediate risk without known coronary disease: coronary CT angiography or stress imaging (both class 1). CT favored under age 65, stress imaging at 65 or older or with higher suspicion of obstructive disease. ^[aha-acc-chest-pain-2021]
- Known obstructive coronary disease: stress imaging. Known nonobstructive disease: coronary CT angiography is reasonable. ^[aha-acc-chest-pain-2021]
- High risk (positive troponin, dynamic ECG, high-risk score): admit. Invasive strategy per [[cardio-nste-acs]]. ^[aha-acc-chest-pain-2021, acc-aha-acs-2025]

## Treatment
#### Common initial orders
- Oxygen only for SpO₂ below 90%. ^[acc-aha-acs-2025]
- Analgesia. Nitroglycerin for ongoing ischemic pain unless hypotension, right ventricular infarct or recent phosphodiesterase inhibitor use. ^[acc-aha-acs-2025]
- Telemetry for any patient not yet risk-stratified as low. ^[common-practice]
- First-line tests in Diagnosis. ^[common-practice]

#### Treat the cause
- ACS: antiplatelet and anticoagulant therapy per [[cardio-nste-acs]]. ^[acc-aha-acs-2025]
- PE: anticoagulation and category-based care per [[pulm-vte-diagnosis]]. ^[aha-acc-pe-2026]
- Aortic dissection: heart rate and blood pressure control, analgesia, immediate surgical consultation (type A) or vascular and cardiology consultation (type B). ^[acc-aha-aortic-2022]
- Tension pneumothorax: needle or finger decompression, then chest tube. ^[common-practice]
- Esophageal rupture: nothing by mouth, broad-spectrum antibiotics, early thoracic surgery and gastroenterology consultation. Stable patients may have endoscopic stent or vacuum therapy, unstable or complex ones surgery. ^[sts-esophageal-2026, common-practice]
- Tamponade: urgent pericardiocentesis or surgical drainage. Pericardiocentesis is contraindicated when type A dissection causes it. ^[esc-myopericarditis-2025, acc-pericarditis-ccg-2025]
- Acute pericarditis: treatment is outside this card. Confirm the diagnosis (chest pain with a rub, typical ECG changes, new effusion or raised inflammatory markers). ^[acc-pericarditis-ccg-2025]

## Monitor
- Repeat ECG and troponin with any new or recurrent pain, and before discharge from observation. ^[aha-acc-chest-pain-2021]
- Reassess vital signs and symptoms. A patient whose pain changes character needs a new differential. ^[common-practice]

## Escalation
- STEMI or equivalent: cath lab activation. ^[acc-aha-acs-2025]
- Confirmed type A dissection: emergency cardiac surgery, with transfer to an aortic center if not available on site. Type B: vascular and cardiology consultation. ^[acc-aha-aortic-2022]
- PE with hypotension or shock: PE response team. See [[pulm-vte-diagnosis]]. ^[aha-acc-pe-2026]
- Tamponade or esophageal rupture: surgery, cardiology or thoracic surgery immediately. ^[common-practice]
- ICU or intermediate care: shock, hypoxemia, persistent ischemia, arrhythmia. ^[common-practice]

## More Information
### Where Guidelines Differ: Troponin algorithms
:::compare Rapid rule-out
- AHA/ACC 2021: high-sensitivity troponin at presentation and 1–3 hours. Validated algorithm. ^[aha-acc-chest-pain-2021]
- ESC 2023: 0/1-hour or 0/2-hour algorithm with assay-specific cutoffs. ^[esc-acs-2023]
:::

### Special Populations: Women, older adults, diabetes
- More often dyspnea, fatigue, epigastric pain or nausea. Lower sex-specific troponin 99th percentile. ^[aha-acc-chest-pain-2021, udmi-2026]
- Women under 50, pregnancy and postpartum: consider spontaneous coronary artery dissection. ^[aha-scad-2018]
- Cocaine or methamphetamine: ACS from vasospasm. Benzodiazepines early. ^[aha-cocaine-2008]

### Evidence: Risk scores
- {{calc:heart-score|HEART score}} (2013): prospective validation in 2,388 patients. Low-risk group (0–3) had a major cardiac event rate of about 2% in 6 weeks. ^[backus-heart-2013]
- {{calc:add-rs}} (2011): about 4% of confirmed dissections scored 0, so the score alone cannot exclude it. Combined with D-dimer it did in ADvISED (2018). ^[rogers-add-rs-2011, advised-2018]

### Epidemiology and Pathophysiology: Where the time goes
- Most patients with acute chest pain do not have ACS. The goal is to exclude the dangerous causes quickly and safely. ^[aha-acc-chest-pain-2021]

## Pearls
- ECG within 10 minutes. A normal ECG does not exclude ACS, and a normal troponin early after onset does not either. ^[aha-acc-chest-pain-2021]
- Use a score only when its disease is on the differential. {{calc:perc}} and D-dimer do not apply when probability is high. ^[aha-acc-pe-2026]
- Before aspirin or heparin, ask: could this be dissection? ^[acc-aha-aortic-2022, common-practice]
- Tension pneumothorax is a bedside diagnosis. Decompress first. ^[common-practice]
- Reproducible chest wall pain does not exclude ACS. ^[aha-acc-chest-pain-2021]

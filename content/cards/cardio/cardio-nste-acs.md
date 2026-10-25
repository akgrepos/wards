---
id: cardio-nste-acs
type: topic
system: cardio
subsection: Ischemic Heart Disease
title: "Acute Coronary Syndrome"
aliases: [NSTE-ACS, NSTEMI, non-ST-elevation myocardial infarction, unstable angina, UA, ACS, acute coronary syndrome, heart attack, MI, myocardial infarction, type 1 MI, type 2 MI, primary MI, secondary MI, procedure-related MI, myocardial injury, MINOCA, troponin, DAPT, dual antiplatelet therapy, GRACE]
definition: "Acute myocardial ischemia without persistent ST-segment elevation: NSTEMI with acute myocardial injury (a rise and/or fall of cardiac troponin, at least one value above the sex-specific 99th percentile), unstable angina without it. ^[acc-aha-acs-2025, udmi-2026]"
based_on: [acc-aha-acs-2025, esc-acs-2023]
checked: { date: 2026-10-20, by: owner, scope: "owner review", fingerprint: "c76be1c0791e00f8", carried: "2026-10-25: Format sweep (bullets split, tables to bullets or scale, society names out of text). Numbers, doses, drugs and sources unchanged." }
related:
  differential: [cardio-chest-pain, pulm-vte-diagnosis]
  conditions: [cardio-atrial-fibrillation, cardio-adhf, cardio-ecg-interpretation, pulm-copd-exacerbation, gi-upper-gi-bleeding, heme-anemia, heme-anticoagulation-management]
  tools: []
---
## At a Glance
- 12-lead ECG within 10 minutes: ^[acc-aha-acs-2025, udmi-2026]
  - Exclude STEMI and its equivalents (posterior MI), which follow the STEMI pathway.
  - Diffuse ST depression with ST elevation in aVR suggests left main or multivessel ischemia (very high risk).
- Serial high-sensitivity troponin (0 and 1–2 h) with a validated algorithm: ^[aha-acc-chest-pain-2021, udmi-2026]
  - MI needs a rise and/or fall with at least one value above the sex-specific 99th percentile.
  - Plus ischemic symptoms, ECG changes or imaging evidence.
- Aspirin plus a parenteral anticoagulant for all. A P2Y12 inhibitor (ticagrelor or prasugrel preferred with PCI). ^[acc-aha-acs-2025]
- Invasive timing by risk: immediate if very high risk, early (<24 h) if high risk, before discharge if intermediate. Routine or selective if low. ^[acc-aha-acs-2025]
- High-intensity statin for all. Oral β-blocker within 24 h unless heart failure, low output or shock risk. ^[acc-aha-acs-2025]
- DAPT for 12 months by default. Shorter or P2Y12 monotherapy to reduce bleeding in selected patients. ^[acc-aha-acs-2025]

## Severity
{{criteria:udmi-mi}}

#### Timing of invasive angiography
:::scale Risk and timing of invasive angiography
- Low: {{calc:grace}} <109 or {{calc:timi-nstemi}} <2, troponin below the sex-specific 99th percentile, no dynamic ST changes. Routine invasive before discharge, or selective (noninvasive testing first). ^[acc-aha-acs-2025]
- Intermediate: {{calc:grace}} 109–140, no ongoing ischemia, troponin stable or falling. Before discharge (<72 h). ^[acc-aha-acs-2025]
- High: {{calc:grace}} >140, steeply rising troponin despite medical therapy, or ongoing dynamic ST changes. Early, <24 h. ^[acc-aha-acs-2025]
- Very high: instability or shock, refractory angina, life-threatening arrhythmia, mechanical complication, ischemic acute heart failure, recurrent dynamic ST changes. Immediate, <2 h. ^[acc-aha-acs-2025, esc-acs-2023]
:::

- Risk scores: {{calc:grace}} (mortality) or {{calc:timi-nstemi}} estimate risk and guide timing. ^[acc-aha-acs-2025]
- Telemetry for at least 24 h in NSTEMI. CCU for very high-risk features. ^[common-practice]

## Causes
- **Primary MI** (previously type 1): [!most-common] ^[udmi-2026]
  - Spontaneous, from an acute coronary pathology, usually atherothrombosis (plaque rupture or erosion with thrombus).
  - Also the nonatherosclerotic causes below, and restenosis, stent thrombosis or graft failure >30 days after revascularization.
  - Confirmed by angiography or intracoronary imaging showing the pathology.
  - Or confirmed by a new wall-motion abnormality or loss of viable myocardium in an ischemic pattern.
  - Without access to angiography or imaging, a clinical diagnosis stands.
- **Nonatherosclerotic primary MI:** ^[udmi-2026, aha-scad-2018, aha-cocaine-2008]
  - Spontaneous coronary artery dissection (women <50 years, pregnancy, postpartum).
  - Vasospasm (cocaine, methamphetamine).
  - Coronary embolism.
- **Secondary MI** (previously type 2): ^[udmi-2026]
  - Supply–demand mismatch from another acute condition: tachyarrhythmia (most common), severe anemia, hypotension or shock, hypoxemia, severe hypertension.
  - When imaging is feasible, confirmed by obstructive CAD (≥70% stenosis, or ≥50% and flow-limiting) without an acute coronary pathology.
  - Or confirmed by a new ischemic-pattern wall-motion abnormality or loss of viable myocardium.
  - Otherwise known CAD or marked ischemic ECG or troponin changes support a clinical diagnosis.
  - Most such patients have myocardial injury without MI.
  - Sepsis or bleeding can also trigger primary MI.
- **Procedure-related MI:** ^[udmi-2026]
  - A coronary complication within 30 days of a cardiac procedure (PCI, CABG, structural intervention, ablation).
  - Confirmed by angiography showing the complication or by imaging showing a new ischemic-pattern wall-motion abnormality or loss of viable myocardium.
  - Both are needed if it arose during the procedure or the procedure treated an acute MI.
  - Troponin multiples (e.g. >5× the upper reference limit after PCI) only select patients for imaging.
- **Life-threatening mimics:** [!cannot-miss] aortic dissection, pulmonary embolism, tension pneumothorax, tamponade, esophageal rupture. ^[aha-acc-chest-pain-2021]
- **Myocardial injury without MI:** ^[udmi-2026]
  - Acute (rise and/or fall): myocarditis, Takotsubo syndrome, sepsis, acute heart failure, PE, stroke, cardiotoxic drugs.
  - Chronic (stable): CKD, chronic heart failure, cardiomyopathy, LVH.
  - Erratic values that do not fit the clinical picture: suspect assay interference (heterophile antibodies, macrotroponin) and retest on another assay.
- **MINOCA** (now myocardial injury with non-obstructive coronary arteries, no stenosis ≥50%): a working diagnosis, not a final one. ^[udmi-2026]
  - CMR, ideally within 2 weeks, usually finds the cause (MI in about a quarter, myocarditis or Takotsubo syndrome more often).
  - Intravascular imaging and spasm testing can show a coronary cause.

## Presentation
- Chest pressure, tightness or heaviness, at rest or with minimal exertion, radiating to the arm, neck or jaw. With dyspnea, diaphoresis or nausea. ^[aha-acc-chest-pain-2021]
- Unstable angina: rest angina, new-onset severe angina, or crescendo angina, with MI excluded by serial troponin. ^[acc-aha-acs-2025, udmi-2026]
- Atypical (women, older adults, diabetes): dyspnea, fatigue, epigastric discomfort. ^[aha-acc-chest-pain-2021]
- Avoid the word "atypical": describe as cardiac, possibly cardiac or noncardiac. ^[aha-acc-chest-pain-2021]
- Exam: often normal. Look for heart failure, new murmur (mitral regurgitation), hypotension and signs of mimics (pulse differential). ^[common-practice]

## Diagnosis
#### ECG
- Within 10 minutes of arrival. Repeat at 15–30-minute intervals if nondiagnostic and symptoms persist. ^[aha-acc-chest-pain-2021]
- NSTE-ACS changes: ^[udmi-2026, aha-acc-chest-pain-2021]
  - New horizontal or downsloping ST depression ≥0.5 mm at the J point in 2 contiguous leads.
  - New or dynamic T-wave inversion ≥1 mm in 2 contiguous leads.
  - Transient ST elevation.
- A normal ECG does not exclude ACS. ^[udmi-2026, aha-acc-chest-pain-2021]
{{media:ecg-nste-acs}}
- Patterns suggesting acute coronary occlusion without ST elevation: ^[udmi-2026, acc-aha-acs-2025]
  - Hyperacute T waves.
  - De Winter pattern (upsloping ST depression with tall symmetric precordial T waves).
  - Wellens (biphasic or deeply inverted T waves in V2–V3 while pain-free).
  - New LBBB or RBBB with ischemia.
  - {{calc:sgarbossa}} or {{calc:modified-sgarbossa}} (ST/S ratio ≤0.25) criteria with LBBB or ventricular pacing.
- Up to 1 in 4 patients managed as NSTEMI have an occluded culprit: discuss immediate angiography with cardiology. ^[udmi-2026, acc-aha-acs-2025]
- Pathological Q wave: duration ≥40 ms and/or depth ≥25% of the R-wave amplitude in the same lead, in 2 contiguous leads. ^[udmi-2026]
- Posterior leads V7–V9 when ST depression is maximal in V1–V4 (posterior MI is a STEMI equivalent). ^[acc-aha-acs-2025]

#### Troponin
- High-sensitivity cardiac troponin at presentation and 1–2 h (or 3–6 h with conventional assays). ^[aha-acc-chest-pain-2021]
- Use assay-specific, sex-specific 99th percentiles (lower in women) and change thresholds. ^[udmi-2026, aha-acc-chest-pain-2021]
- Rapid-algorithm cutoffs (uniform, not sex-specific) triage, they do not diagnose MI. ^[udmi-2026, aha-acc-chest-pain-2021]
- Rise and/or fall needed for acute injury ^[udmi-2026]
- Stable elevation (change <20%, a cutoff based on assay imprecision) suggests chronic injury (CKD, heart failure) ^[udmi-2026]
- Sampling near the peak (12–24 h) or days after onset can also look stable ^[udmi-2026]
- Very high values may not need a rise or fall ^[udmi-2026]
- CKD: elevated troponin is not just reduced clearance. Serial values tell acute from chronic. ^[udmi-2026]

#### Other tests
- CBC, BMP, lipid panel, HbA1c, coagulation studies before anticoagulation. ^[acc-aha-acs-2025, common-practice]
- Transthoracic echocardiogram: LVEF, wall motion, mechanical complications. ^[acc-aha-acs-2025]
- Chest radiograph. CT angiography if aortic dissection or PE is suspected. ^[aha-acc-chest-pain-2021]
- Low risk with negative troponins: coronary CT angiography or stress testing. ^[aha-acc-chest-pain-2021]

## Treatment
1. Initial measures
   - Aspirin to all without true allergy, as early as possible. ^[acc-aha-acs-2025]

   {{dose:aspirin-acs-load}}

   - Oxygen only if SpO₂ <90%. ^[acc-aha-acs-2025]
   - Ongoing ischemic pain: sublingual nitroglycerin, then IV nitroglycerin for persistent ischemia, heart failure or hypertension. ^[acc-aha-acs-2025]

   {{dose:nitroglycerin-sl}}
   {{dose:nitroglycerin-iv}}

   - No nitrates with SBP <90 mm Hg or ≥30 below baseline, suspected RV infarction, riociguat, or a phosphodiesterase-5 inhibitor: ^[acc-aha-acs-2025, label-nitrostat-2023]
     - Avanafil within 12 h.
     - Sildenafil or vardenafil within 24 h.
     - Tadalafil within 48 h.
   - Stop NSAIDs (other than aspirin). ^[common-practice]

2. Parenteral anticoagulation
   - All patients, from diagnosis until revascularization (PCI or CABG). ^[acc-aha-acs-2025]
   - Managed medically: for the hospitalization, up to 8 days. ^[oasis-5-2006, label-lovenox-2026]

   {{dose:heparin-acs}}
   {{dose:enoxaparin-acs}}
   {{dose:fondaparinux-acs}}

   - UFH: preferred with planned early angiography or severe kidney impairment. ^[acc-aha-acs-2025, common-practice]
   - Enoxaparin or fondaparinux: alternatives when early angiography is not planned. ^[acc-aha-acs-2025]
   - Fondaparinux must not be used alone for PCI (catheter thrombosis): UFH bolus at PCI. ^[acc-aha-acs-2025, oasis-5-2006]
   - On a DOAC or warfarin: discuss with cardiology before adding anticoagulation. ^[common-practice]

3. P2Y12 inhibitor
   - With PCI: ticagrelor or prasugrel preferred over clopidogrel. ^[acc-aha-acs-2025, plato-2009, triton-timi-38-2007]
   - Prasugrel: only once coronary anatomy is known and PCI is planned. Not with prior stroke or TIA. ^[acc-aha-acs-2025, label-effient-2022]
   - Medically managed: ticagrelor. Clopidogrel if ticagrelor is contraindicated, not tolerated, or bleeding risk is high. ^[acc-aha-acs-2025]
   - Angiography within 24 h: no routine pretreatment. ^[acc-aha-acs-2025]
   - Angiography expected ≥24 h: upstream ticagrelor or clopidogrel may be considered. ^[acc-aha-acs-2025]
   - Never prasugrel before the anatomy is known. ^[acc-aha-acs-2025]

   {{dose:ticagrelor-acs-load}}
   {{dose:ticagrelor-acs}}
   {{dose:prasugrel-acs-load}}
   {{dose:prasugrel-acs}}
   {{dose:clopidogrel-acs-load}}
   {{dose:clopidogrel-75}}

   - Ticagrelor: keep aspirin at the low maintenance dose. Higher daily doses reduce its effectiveness. ^[label-brilinta-2026]

4. Invasive strategy
   - Timing by risk (see Severity). Radial access preferred. ^[acc-aha-acs-2025]
   - Multivessel disease: PCI or CABG by anatomy, diabetes and LV function (Heart Team). ^[acc-aha-acs-2025]
   - Possible CABG: P2Y12 timing with cardiac surgery. ^[acc-aha-acs-2025]

5. Secondary prevention in hospital
   - High-intensity statin as early as possible, regardless of baseline LDL-C. ^[acc-aha-acs-2025]

   {{dose:atorvastatin-80}}

   - Oral β-blocker within 24 h unless: ^[acc-aha-acs-2025]
     - Acute heart failure, low-output state or risk of cardiogenic shock.
     - PR >240 ms, second- or third-degree AV block without a pacemaker, or severe bradycardia.
     - Active bronchospasm.
   - Reassess the β-blocker later if initially contraindicated. ^[acc-aha-acs-2025]
   - ACE inhibitor or ARB: ^[acc-aha-acs-2025]
     - LVEF ≤40%, hypertension or diabetes ^[acc-aha-acs-2025]
     - Reasonable in all others ^[acc-aha-acs-2025]
     - Never both together ^[acc-aha-acs-2025]
   - Mineralocorticoid receptor antagonist: LVEF ≤40% with heart failure symptoms or diabetes. Avoid if creatinine >2.5 mg/dL or K⁺ >5.0 mEq/L. ^[acc-aha-acs-2025]
   - Continue aspirin. ^[acc-aha-acs-2025]

   {{dose:aspirin-81}}

## Monitor
- Telemetry for arrhythmias. Serial ECG with recurrent symptoms. ^[acc-aha-acs-2025, common-practice]
- Troponin trend until the peak is clear. Repeat with recurrent pain. ^[common-practice]
- Bleeding: hemoglobin, platelets (heparin-induced thrombocytopenia with UFH or LMWH), access site. ^[acc-aha-acs-2025, common-practice]
- Kidney function for anticoagulant dosing and after contrast. ^[common-practice]
- New murmur, hypotension or heart failure: urgent echocardiogram for mechanical complications. ^[acc-aha-acs-2025]

## Escalation
- Cardiology on diagnosis of NSTE-ACS. Immediate catheterization laboratory activation for very high-risk features. ^[acc-aha-acs-2025]
- STEMI or STEMI equivalent on any repeat ECG: STEMI pathway. ^[acc-aha-acs-2025]
- CCU: cardiogenic shock, refractory ischemia, ventricular arrhythmias, mechanical complications. ^[common-practice]
- Cardiac surgery: left main or complex multivessel disease, mechanical complications. ^[acc-aha-acs-2025]

## More Information
### Where Guidelines Differ: P2Y12 pretreatment, choice
:::compare P2Y12 pretreatment before angiography
- ACC/AHA 2025: Not routine if angiography is within 24 h. Ticagrelor or clopidogrel may be considered if ≥24 h (weak). Prasugrel only after anatomy is known. ^[acc-aha-acs-2025]
- ESC 2023: Routine pretreatment not recommended when anatomy is unknown and angiography is planned within 24 h. May be considered if delayed and bleeding risk is not high. ^[esc-acs-2023]
:::

:::compare Preferred P2Y12 inhibitor with PCI
- ACC/AHA 2025: Ticagrelor or prasugrel preferred over clopidogrel. ^[acc-aha-acs-2025]
- ESC 2023: Prasugrel considered in preference to ticagrelor in ACS proceeding to PCI. ^[esc-acs-2023, isar-react-5-2019]
:::

:::compare MI classification
- ACC/AHA 2025: Still uses the 2018 numbered types. NSTE-ACS recommendations assume type 1 (atherothrombotic) MI. Type 2 MI, SCAD and MINOCA are covered in separate documents. ^[acc-aha-acs-2025]
- Fifth universal definition 2026: Primary, secondary or procedure-related MI. SCAD, vasospasm and embolism count as primary MI. ^[udmi-2026]
:::

### Special Populations: AF, kidney disease, older adults
- AF on an oral anticoagulant after PCI: DOAC plus clopidogrel. Stop aspirin after 1–4 weeks (triple therapy only briefly). ^[acc-aha-acs-2025]
- Severe kidney impairment ({{calc:cockcroft-gault}} below 30): ^[label-lovenox-2026, label-arixtra-2024, common-practice]
  - Adjust enoxaparin.
  - Fondaparinux contraindicated.
  - UFH often simplest.
- Older adults: an invasive strategy is reasonable (fewer reinfarctions, no clear mortality benefit at age ≥75). ^[senior-rita-2024]
- Individualize by frailty, comorbidity and bleeding risk. ^[senior-rita-2024]
- Cocaine or methamphetamine: avoid β-blockers during acute intoxication. Benzodiazepines and nitrates. ^[aha-cocaine-2008]
- Secondary (type 2) MI: ^[udmi-2026, common-practice]
  - Treat the trigger ^[udmi-2026, common-practice]
  - Angiography if ischemia persists or recurs and primary MI is possible, otherwise imaging (e.g. CT coronary angiography) after recovery when it would change care ^[udmi-2026, common-practice]
  - Antithrombotics individualized ^[udmi-2026, common-practice]

### Complications: Shock, arrhythmia, mechanical
- Cardiogenic shock, acute heart failure. ^[acc-aha-acs-2025]
- Ventricular arrhythmias, AV block, AF. ^[acc-aha-acs-2025]
- Mechanical: papillary muscle rupture (acute mitral regurgitation), ventricular septal rupture, free-wall rupture. More after delayed presentation. ^[acc-aha-acs-2025]
- Bleeding from antithrombotic therapy. Access-site complications. ^[acc-aha-acs-2025]

### After the Acute Phase: DAPT, risk factors
- DAPT for at least 12 months by default after ACS unless bleeding risk is high. ^[acc-aha-acs-2025]
- To reduce bleeding after PCI: transition to ticagrelor monotherapy after at least 1 month. ^[acc-aha-acs-2025]
- High bleeding risk: single antiplatelet (aspirin or P2Y12 inhibitor) after 1 month, or de-escalate to clopidogrel. ^[acc-aha-acs-2025]
- Proton pump inhibitor with DAPT when GI bleeding risk is high. ^[acc-aha-acs-2025]
- LDL-C goal <55 mg/dL (non-HDL-C <85) at very high risk, which includes most patients after ACS: ^[acc-aha-dyslipidemia-2026]
  - Any other major ASCVD event (prior MI, ischemic stroke, symptomatic PAD).
  - Or multiple high-risk conditions (e.g. age >65, prior revascularization, diabetes, hypertension, current smoking, heart failure).
- Otherwise LDL-C goal <70 mg/dL (non-HDL-C <100), with <55 reasonable. ^[acc-aha-dyslipidemia-2026]
- Above goal on maximally tolerated statin: add ezetimibe or a PCSK9 monoclonal antibody (ezetimibe no longer required first). ^[acc-aha-dyslipidemia-2026, acc-aha-acs-2025]
- Bempedoic acid is an alternative add-on, with outcome benefit shown in statin intolerance. ^[acc-aha-dyslipidemia-2026, acc-aha-acs-2025]
- Cardiac rehabilitation referral, smoking cessation, blood pressure and diabetes control, annual influenza vaccination. ^[acc-aha-acs-2025]
- SGLT2 inhibitor and full heart failure therapy when LVEF ≤40%: see [[cardio-adhf|ADHF]] for in-hospital start. ^[aha-acc-hfsa-hf-2022]

### Evidence: Key trials
- PLATO (2009): ticagrelor lowered cardiovascular death, MI or stroke versus clopidogrel, with more non-CABG bleeding. ^[plato-2009]
- ISAR-REACT 5 (2019): prasugrel lowered death, MI or stroke versus ticagrelor with a planned invasive strategy. ^[isar-react-5-2019]
- TIMACS (2009): early (<24 h) angiography did not reduce the primary outcome overall but did in the highest-risk third ({{calc:grace}} >140). ^[timacs-2009]
- OASIS-5 (2006): fondaparinux was noninferior to enoxaparin with less bleeding. Catheter thrombosis during PCI without added UFH. ^[oasis-5-2006]
- REDUCE-AMI (2024): long-term β-blocker after MI with LVEF ≥50% did not reduce death or reinfarction. ^[reduce-ami-2024]

### Why the Treatment Order: Platelets, then thrombin, then the lesion
- Aspirin and anticoagulation stop thrombus propagation immediately ^[acc-aha-acs-2025, common-practice]
- P2Y12 timing depends on when angiography will happen and whether CABG may be needed ^[acc-aha-acs-2025, common-practice]
- Revascularization treats the culprit lesion ^[acc-aha-acs-2025, common-practice]

### Epidemiology and Pathophysiology: Plaque and supply
- NSTE-ACS accounts for most ACS hospitalizations. Mortality is lower than STEMI acutely but similar at long-term follow-up. ^[acc-aha-acs-2025]
- Usually a non-occlusive thrombus or occlusion with collaterals. Subendocardial ischemia causes ST depression. ^[esc-acs-2023]

## Pearls
- Troponin elevation is myocardial injury, not MI: MI also needs ischemic symptoms, ischemic ECG changes or imaging evidence. ^[udmi-2026]
- Secondary MI is confirmed by imaging when feasible. ^[udmi-2026]
- Normal initial ECG and troponin do not exclude ACS early after symptom onset: repeat both. ^[aha-acc-chest-pain-2021]
- Hold prasugrel until anatomy is known: it raised bleeding without benefit when given routinely before angiography. ^[acc-aha-acs-2025]
- Higher-dose aspirin maintenance blunts the benefit of ticagrelor: use low-dose aspirin. ^[label-brilinta-2026, plato-2009]

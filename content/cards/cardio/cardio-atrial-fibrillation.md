---
id: cardio-atrial-fibrillation
type: topic
system: cardio
subsection: Arrhythmias
title: Atrial Fibrillation
aliases: [AF, AFib, A-fib, atrial fib, AF with RVR, rapid ventricular response, RVR, irregularly irregular, CHA2DS2-VASc, CHADS-VASc, CHA2DS2-VA, cardioversion, DCCV, rate control, rhythm control]
definition: "Supraventricular tachyarrhythmia with uncoordinated atrial activation: irregularly irregular R-R intervals without distinct P waves, documented on ECG (ESC: at least 30 seconds, or a full 12-lead ECG). ^[acc-aha-af-2023, esc-af-2024]"
based_on: [acc-aha-af-2023, esc-af-2024]
checked: { date: 2026-10-20, by: owner, scope: "owner review", fingerprint: "ab1cbaa9b118180c", carried: "2026-10-24: Dose row titles shortened to the indication only. Doses and numbers unchanged, the removed wording is kept in the longer indication text." }
related:
  differential: []
  conditions: [cardio-adhf, cardio-nste-acs]
  tools: []
emergency_hint: "Unstable: cardiovert. Stable: IV rate control"
---
## Do Now
1. Synchronized cardioversion
   - If: hemodynamically unstable from AF (hypotension, ongoing ischemia, pulmonary edema, shock) ^[acc-aha-af-2023]
   - Check: rate likely the cause (usually >150 beats/min). Sedation. Pads. Synchronize. ^[aha-acls-2025, common-practice]
   - Start anticoagulation as soon as feasible without delaying cardioversion. Continue at least 4 weeks after. ^[acc-aha-af-2023, common-practice]
   - Biphasic: at least 200 J initially. Escalate if unsuccessful. ^[aha-acls-2025]
or. IV rate control
   - If: stable and not decompensated. β-blocker at any LVEF, diltiazem only if LVEF >40%. ^[acc-aha-af-2023]
   - Check: pre-excitation on ECG (delta wave, wide bizarre QRS): no AV nodal blockers. ^[acc-aha-af-2023]

   {{dose:metoprolol-iv-af}}
   {{dose:diltiazem-iv-af}}

   - Warning: Hypotension ^[label-diltiazem-inj-2026, label-metoprolol-inj-2026]
or. IV rate control, decompensated or hypotensive
   - If: decompensated heart failure, critically ill, or blood pressure limiting a β-blocker or diltiazem ^[acc-aha-af-2023, common-practice]
   - No IV diltiazem or verapamil if LVEF ≤40%, compensated or not. ^[acc-aha-af-2023]

   {{dose:amiodarone-iv-af}}
   {{dose:digoxin-iv-af}}

   - Amiodarone may convert to sinus rhythm: consider thromboembolic risk if not anticoagulated. ^[acc-aha-af-2023]
4. Treat the precipitant
   - Sepsis, hypovolemia, hypoxemia, PE, thyrotoxicosis, alcohol, ischemia, pain, electrolyte derangement. ^[acc-aha-af-2023, common-practice]
   - Check: K⁺ and Mg²⁺. IV magnesium as an add-on to rate control is reasonable. ^[acc-aha-af-2023, common-practice]
5. Decide on anticoagulation
   - Stroke risk by {{criteria:cha2ds2-vasc}}. Anticoagulation for cardioversion as in Treatment. ^[acc-aha-af-2023]

:::note
- Pre-excited AF (Wolff-Parkinson-White): avoid β-blockers, calcium channel blockers, digoxin, adenosine and IV amiodarone. Synchronized cardioversion if unstable, IV procainamide or ibutilide if stable. ^[acc-aha-af-2023]
:::

## At a Glance
- Unstable from AF: immediate synchronized cardioversion. ^[acc-aha-af-2023]
- Stable RVR: IV β-blocker (any LVEF) or diltiazem (LVEF >40% only). Amiodarone or digoxin if decompensated or hypotensive. ^[acc-aha-af-2023]
- Anticoagulate by stroke risk, not by AF pattern: {{calc:cha2ds2-vasc}} {{threshold:af-anticoag-recommended}}. DOAC over warfarin except mechanical valve or moderate–severe mitral stenosis. ^[acc-aha-af-2023]
- Cardioversion of AF ≥48 h or unknown duration: 3 weeks of anticoagulation or TEE first. After any cardioversion, anticoagulate at least 4 weeks. ^[acc-aha-af-2023]
- Lenient rate target: resting HR {{threshold:af-rate-lenient}}. Early rhythm control in selected patients. ^[acc-aha-af-2023, race-ii-2010, east-afnet-4-2020]
- Look for the trigger: sepsis, thyrotoxicosis, PE, alcohol, ischemia, postoperative state. ^[acc-aha-af-2023]

## Severity
:::scale Hemodynamic status
- Stable: normal perfusion, no ischemia or pulmonary edema. Rate control. ^[acc-aha-af-2023]
- Borderline: soft blood pressure or heart failure. Blood pressure–sparing rate control. ^[acc-aha-af-2023, common-practice]
- Unstable: hypotension, ischemia, pulmonary edema or shock attributable to AF. Immediate cardioversion. ^[acc-aha-af-2023]
:::

#### Stages and patterns
| Stage | Description |
|---|---|
| 1. At risk | Modifiable or nonmodifiable risk factors ^[acc-aha-af-2023] |
| 2. Pre-AF | Structural or electrical findings predisposing to AF (atrial enlargement, frequent atrial ectopy, atrial flutter) ^[acc-aha-af-2023] |
| 3A. Paroxysmal | Terminates within 7 days of onset ^[acc-aha-af-2023] |
| 3B. Persistent | Continuous for >7 days, needing intervention ^[acc-aha-af-2023] |
| 3C. Long-standing persistent | Continuous for >12 months ^[acc-aha-af-2023] |
| 3D. Successful ablation | Free of AF after ablation ^[acc-aha-af-2023] |
| 4. Permanent | No further attempts at rhythm control ^[acc-aha-af-2023] |

- Telemetry for RVR, IV rate-control infusions or antiarrhythmic loading. ICU for instability or refractory RVR. ^[common-practice]

## Causes
- **Cardiac:** hypertension, heart failure, coronary disease and MI, valvular disease (especially mitral), cardiomyopathy, pericarditis, post–cardiac surgery. ^[acc-aha-af-2023]
- **Acute precipitants:** [!cannot-miss] sepsis, PE, thyrotoxicosis, acute MI, hypoxemia. Also surgery, alcohol, stimulants, electrolyte derangement. ^[acc-aha-af-2023]
- **Systemic risk factors:** age, obesity, obstructive sleep apnea, diabetes, alcohol use, smoking, chronic kidney disease, endurance exercise. ^[acc-aha-af-2023]
- **Pulmonary:** COPD, pneumonia, pulmonary hypertension. ^[acc-aha-af-2023]
- **Mimics:** multifocal atrial tachycardia (≥3 P-wave morphologies), atrial flutter with variable block, frequent atrial ectopy, sinus tachycardia with artifact. ^[common-practice]

## Presentation
- Palpitations, dyspnea, fatigue, exercise intolerance, presyncope, chest pain. Often asymptomatic. ^[acc-aha-af-2023]
- First presentation may be stroke, heart failure or tachycardia-mediated cardiomyopathy. ^[acc-aha-af-2023]
- Exam: irregularly irregular pulse, variable S1, pulse deficit. Signs of heart failure or the precipitant. ^[common-practice]

## Diagnosis
#### Confirm
- 12-lead ECG: irregularly irregular R-R intervals, no distinct P waves. Fibrillatory waves may be seen. ^[acc-aha-af-2023]
{{media:ecg-af}}
- Regular rhythm in known AF: suspect atrial flutter, or AV block with a junctional or ventricular escape rhythm (digoxin toxicity). ^[common-practice]
- Wide QRS: aberrancy, bundle branch block or pre-excitation. Pre-excited AF is very fast and irregular with varying QRS width. ^[acc-aha-af-2023]

#### Initial evaluation
- Labs: CBC, BMP with Mg²⁺, TSH, liver panel, creatinine for DOAC dosing. ^[acc-aha-af-2023]
- Transthoracic echocardiogram: LVEF, atrial size, valve disease (moderate–severe mitral stenosis changes anticoagulant choice). ^[acc-aha-af-2023]
- Troponin and chest radiograph when ischemia, heart failure or pulmonary disease is suspected. Demand-related troponin rise is common. ^[common-practice]
- TEE (or cardiac CT) to exclude left atrial appendage thrombus before early cardioversion when not anticoagulated for 3 weeks. ^[acc-aha-af-2023]
- Sleep apnea screening and ambulatory monitoring (burden, rate control) as outpatient. ^[acc-aha-af-2023]

## Treatment
1. Unstable: synchronized cardioversion
   - Immediate cardioversion. Do not delay for anticoagulation, but start it as soon as possible. ^[acc-aha-af-2023]
   - Biphasic: at least 200 J initially. ^[aha-acls-2025]

or. Rate control
   - LVEF >40%: IV or oral β-blocker or nondihydropyridine calcium channel blocker. ^[acc-aha-af-2023]

   {{dose:metoprolol-iv-af}}
   {{dose:diltiazem-iv-af}}
   {{dose:diltiazem-infusion-af}}

   - LVEF ≤40%: β-blocker. No nondihydropyridine calcium channel blockers, compensated or not. ^[acc-aha-af-2023]
   - Critically ill or decompensated heart failure, or β-blocker and diltiazem ineffective or contraindicated: IV amiodarone or digoxin. ^[acc-aha-af-2023]
   - IV magnesium as an add-on is reasonable (dosing: [[renal-electrolyte-repletion|electrolyte repletion]]). ^[acc-aha-af-2023]

   {{dose:amiodarone-iv-af}}
   {{dose:digoxin-iv-af}}

   - Transition to oral agents once controlled. ^[common-practice]

   {{dose:metoprolol-tartrate-po-af}}

   - Digoxin is an add-on when one agent is insufficient. Poor control with high adrenergic tone. ^[acc-aha-af-2023]
   - Target: resting HR {{threshold:af-rate-lenient}}. Stricter control if symptoms or LV dysfunction persist. ^[acc-aha-af-2023, race-ii-2010]

3. Anticoagulation for stroke prevention
   {{criteria:cha2ds2-vasc}}

   - {{calc:cha2ds2-vasc}} {{threshold:af-anticoag-recommended}} (annual stroke risk ≥2%): anticoagulation recommended. ^[acc-aha-af-2023]
   - Score 1 in men or 2 in women (annual risk 1–2%): anticoagulation reasonable. ^[acc-aha-af-2023]
   - Decide by risk, not by pattern (paroxysmal, persistent, permanent) or by sinus rhythm after conversion. ^[acc-aha-af-2023]
   - DOAC preferred over warfarin. Warfarin (INR 2.0–3.0), regardless of score, for a mechanical heart valve or rheumatic or moderate–severe mitral stenosis. ^[acc-aha-af-2023]
   - Aspirin alone, or aspirin with clopidogrel, is not an alternative for stroke prevention. ^[acc-aha-af-2023]
   - Bleeding scores (e.g. {{calc:has-bled}}) identify modifiable risks. Do not use them alone to withhold anticoagulation. ^[acc-aha-af-2023]

   {{dose:apixaban-af}}
   {{dose:rivaroxaban-af}}
   {{dose:dabigatran-af}}
   {{dose:edoxaban-af}}

   - Hypertrophic cardiomyopathy: anticoagulate regardless of score. ^[acc-aha-af-2023]
   - Cardiac amyloidosis: anticoagulation reasonable regardless of score. ^[aha-acc-hfsa-hf-2022]

4. Cardioversion and anticoagulation
   - AF ≥48 h or unknown duration: 3 weeks of uninterrupted therapeutic anticoagulation, or imaging to exclude left atrial thrombus, before elective cardioversion. ^[acc-aha-af-2023]
   - Any cardioversion: therapeutic anticoagulation established beforehand and continued at least 4 weeks after, then by stroke risk. ^[acc-aha-af-2023]
   - AF <48 h, not anticoagulated, {{calc:cha2ds2-vasc}} ≥2: imaging to exclude thrombus may be considered. ^[acc-aha-af-2023]
   - {{calc:cha2ds2-vasc}} 0–1 and AF <12 h: benefit of anticoagulation or imaging uncertain. ^[acc-aha-af-2023]
   - Recent onset and stable: early cardioversion or wait-and-see with rate control (most convert within 48 h). ^[race-7-2019, esc-af-2024]

5. Rhythm control
   - Consider for symptoms despite rate control, HFrEF, tachycardia-mediated cardiomyopathy, younger age, or AF diagnosed within 1 year. ^[acc-aha-af-2023, east-afnet-4-2020]
   - Catheter ablation: first-line option in selected symptomatic paroxysmal AF. Recommended in selected HFrEF. ^[acc-aha-af-2023]
   - Antiarrhythmic choice depends on structural heart disease: cardiology. ^[acc-aha-af-2023]

## Monitor
- Telemetry, heart rate and blood pressure with each IV dose and during infusions. ^[common-practice]
- Diltiazem or β-blocker: hypotension, bradycardia, heart failure. ^[label-diltiazem-inj-2026, label-metoprolol-inj-2026]
- Amiodarone: blood pressure, bradycardia, {{calc:qtc}}. Liver and thyroid tests at baseline for ongoing therapy. ^[acc-aha-af-2023, label-nexterone-2024]
- Digoxin: level, K⁺, Mg²⁺ and creatinine. Toxicity rises with hypokalemia and kidney impairment. ^[label-lanoxin-inj-2025]
- DOAC: creatinine and {{calc:cockcroft-gault}} at start and at least yearly (more often in CKD), hemoglobin, adherence. ^[acc-aha-af-2023]

## Escalation
- ICU and urgent cardiology: instability, refractory RVR, pre-excited AF, AF with acute MI or cardiogenic shock. ^[common-practice]
- Cardiology or electrophysiology: rhythm-control strategy, antiarrhythmic initiation, ablation, left atrial appendage occlusion. ^[acc-aha-af-2023]

## More Information
### Where Guidelines Differ: Stroke score, cardioversion timing
:::compare Stroke risk score
- ACC/AHA 2023: {{calc:cha2ds2-vasc}} (other validated scores acceptable). Anticoagulate at ≥2 in men or ≥3 in women, reasonable at 1 or 2. ^[acc-aha-af-2023]
- ESC 2024: CHA₂DS₂-VA, dropping female sex. Anticoagulate at ≥2, consider at 1. ^[esc-af-2024]
:::

:::compare Early cardioversion without prior anticoagulation
- ACC/AHA 2023: 48-hour cutoff. Under 48 h with {{calc:cha2ds2-vasc}} ≥2, pre-cardioversion imaging may be considered. ^[acc-aha-af-2023]
- ESC 2024: Not recommended without 3 weeks of anticoagulation or TEE if AF has lasted more than 24 hours. Wait-and-see within 48 hours is an option. ^[esc-af-2024]
:::

### Special Populations: Kidney disease, valves, pregnancy
- {{calc:cockcroft-gault}} <15 or dialysis: warfarin or apixaban may be reasonable (weak evidence). ^[acc-aha-af-2023]
- Mechanical valve, or rheumatic or moderate–severe mitral stenosis: warfarin. DOACs are not used. ^[acc-aha-af-2023]
- Other valve disease, including bioprosthetic valves: DOAC preferred over warfarin. ^[acc-aha-af-2023]
- Postoperative AF: rate or rhythm control. Anticoagulation weighed against surgical bleeding risk. ^[acc-aha-af-2023]
- AF with recent ACS or PCI: see the antithrombotic combination in [[cardio-nste-acs|NSTE-ACS]]. ^[acc-aha-af-2023]
- Atrial flutter: same anticoagulation approach. Rate control is harder and cavotricuspid isthmus ablation is effective. ^[acc-aha-af-2023]

### Complications: Stroke, heart failure, cardiomyopathy
- Ischemic stroke and systemic embolism. ^[acc-aha-af-2023]
- Heart failure. Tachycardia-mediated cardiomyopathy, which may recover with rate or rhythm control. ^[acc-aha-af-2023]
- Bleeding on anticoagulation. ^[acc-aha-af-2023]

### After the Acute Phase: Risk factors, follow-up
- Weight loss (target ≥10% if overweight), alcohol reduction or abstinence, physical activity, blood pressure control, sleep apnea treatment, smoking cessation. ^[acc-aha-af-2023]
- Left atrial appendage occlusion: for high stroke risk with a contraindication to long-term anticoagulation. ^[acc-aha-af-2023]
- Outpatient cardiology follow-up for rhythm strategy, burden monitoring and anticoagulation review. ^[common-practice]

### Evidence: Key trials
- RACE II (2010): lenient rate control (HR <110 beats/min) was noninferior to strict (<80) for cardiovascular outcomes. ^[race-ii-2010]
- EAST-AFNET 4 (2020): early rhythm control within 1 year of diagnosis lowered cardiovascular death, stroke and hospitalization for heart failure or ACS. ^[east-afnet-4-2020]
- RACE 7 ACWAS (2019): wait-and-see with delayed cardioversion was noninferior to early cardioversion in recent-onset stable AF. ^[race-7-2019]
- ARISTOTLE (2011): apixaban lowered stroke or systemic embolism, major bleeding and mortality versus warfarin. ^[aristotle-2011]

### Why the Treatment Order: Stability first
- Instability is treated electrically because drugs act too slowly and lower blood pressure. In stable patients, rate control relieves symptoms while the trigger is treated and the stroke-risk decision is made. ^[acc-aha-af-2023, common-practice]

### Epidemiology and Pathophysiology: Triggers and substrate
- Most common sustained arrhythmia. Lifetime risk about 1 in 3 to 1 in 6, varying by race and ethnicity. ^[acc-aha-af-2023]
- Pulmonary vein ectopy triggers AF ^[acc-aha-af-2023]
- Atrial fibrosis and dilation sustain it ^[acc-aha-af-2023]
- Stasis in the left atrial appendage causes thrombus ^[acc-aha-af-2023]

## Pearls
- A regularized rhythm on digoxin may be complete heart block with an escape rhythm: think toxicity. ^[common-practice]
- Never give AV nodal blockers in pre-excited AF: they can accelerate conduction and cause ventricular fibrillation. ^[acc-aha-af-2023]
- Anticoagulation after successful cardioversion depends on stroke risk, not on staying in sinus rhythm. ^[acc-aha-af-2023]
- Underdosing DOACs is common and raises stroke risk: use the labeled reduction criteria exactly. ^[acc-aha-af-2023]

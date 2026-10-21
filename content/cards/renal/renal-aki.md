---
id: renal-aki
type: approach
system: renal
title: Acute Kidney Injury
aliases: [AKI, acute renal failure, ARF, rising creatinine, creatinine up, oliguria]
definition: "Abrupt decrease in kidney function, defined and staged by {{criteria:kdigo-aki}}. ^[kdigo-aki-2012]"
based_on: [kdigo-aki-2012, nice-aki-2024]
reviewed: 2026-10-17
related:
  conditions: [renal-hyperkalemia]
---
## At a Glance
- Diagnose and stage by {{criteria:kdigo-aki}}; stage by whichever of SCr or UOP is higher. ^[kdigo-aki-2012]
- First: exclude obstruction, assess volume status and perfusion, stop nephrotoxins. ^[kdigo-aki-2012, nice-aki-2024]
- Urine dipstick in all. ^[nice-aki-2024]
- Sediment microscopy: granular casts or tubular epithelial cells favor ATN over prerenal AKI. ^[perazella-urine-microscopy-2008]
- Diuretics do not prevent or treat AKI; use only for volume overload. ^[kdigo-aki-2012]
- RRT urgently for complications refractory to medical therapy. ^[kdigo-aki-2012, nice-aki-2024]

## Definition and Staging
{{criteria:kdigo-aki}}

- Baseline: prefer a prior SCr. Without one, the lowest SCr this admission is usually at or above the true baseline, so it may understage AKI; hemodilution after massive resuscitation is the exception. ^[kdigo-aki-2012]
- AKI and CKD often coexist; evaluate for unrecognized CKD before labeling a rise as acute. ^[kdigo-aki-2012]
- UOP criteria are less well validated; interpret with fluid balance and drugs (e.g. ACE inhibitors). ^[kdigo-aki-2012]
- SCr rise without GFR loss: trimethoprim and cimetidine block tubular creatinine secretion. ^[kdigo-aki-controversies-2020, delanaye-trimethoprim-2011]

## First Steps
- Refer immediately for RRT if refractory to medical therapy: ^[nice-aki-2024, kdigo-aki-2012]
  - [[renal-hyperkalemia|Hyperkalemia]]
  - Metabolic acidosis
  - Fluid overload or pulmonary edema
  - Uremic complications (pericarditis, encephalopathy)
- Dialyzable poisoning (e.g. lithium, toxic alcohols, salicylates): urgent extracorporeal removal. ^[common-practice]
- Hemorrhagic shock: blood products and hemorrhage control; crystalloid-first guidance does not apply. ^[kdigo-aki-2012, common-practice]
- Vasomotor shock: vasopressors with fluids. ^[kdigo-aki-2012]
- Anuria: exclude a blocked catheter. ^[common-practice]
- Anuria otherwise suggests obstruction, renal arterial or venous occlusion (rapid, irreversible injury) or severe tubular injury. ^[kdigo-aki-2012]

## Causes
| Category | Mechanism | Examples |
|---|---|---|
| Prerenal | Decreased kidney perfusion | Hypovolemia, hemorrhage, shock, heart failure, cirrhosis, NSAIDs, ACE inhibitors, ARBs, abdominal compartment syndrome ^[kdigo-aki-2012, aha-cardiorenal-2019, aasld-ascites-hrs-2021, moore-aki-core-2018] |
| Intrinsic: tubular | Ischemic or toxic injury | Sepsis, prolonged hypoperfusion; aminoglycosides, amphotericin B, contrast; pigment (myoglobin, hemoglobin) ^[kdigo-aki-2012, moore-aki-core-2018] |
| Intrinsic: crystal, cast | Intratubular obstruction | Tumor lysis (uric acid), drugs (e.g. acyclovir, methotrexate), myeloma cast nephropathy ^[moore-aki-core-2018] |
| Intrinsic: interstitial | Immune-mediated, mostly drug-induced | AIN ^[kdigo-aki-2012, muriithi-urine-eos-2013] |
| Intrinsic: glomerular | Inflammatory glomerular injury | Acute GN, vasculitis ^[kdigo-aki-2012] |
| Intrinsic: vascular | Microvascular or large-vessel occlusion | Thrombotic microangiopathy, renal arterial or venous occlusion ^[kdigo-aki-2012] |
| Postrenal | Urinary tract obstruction | Bladder outlet obstruction, bilateral ureteral or solitary kidney obstruction ^[kdigo-aki-2012, nice-aki-2024] |

#### Cannot miss
- Need immediate diagnosis and specific therapy: ^[kdigo-aki-2012]
  - Obstruction
  - GN or vasculitis
  - AIN
  - Thrombotic microangiopathy

#### Most common
- Sepsis is the most common condition associated with AKI in the ICU. ^[kdigo-aki-2012]
- Causes often coexist. ^[kdigo-aki-2012]

## Presentation
#### Focused history
- Exposures: sepsis, shock, surgery (especially cardiac), trauma, burns, contrast, nephrotoxic drugs. ^[kdigo-aki-2012]
- Medications, including over-the-counter, herbal and recreational. ^[kdigo-aki-2012]
- Susceptibility: volume depletion, older age, CKD, diabetes, heart, lung or liver disease, cancer, anemia. ^[kdigo-aki-2012]
- Travel and exposures to waterways, sewage or rodents (leptospirosis, hantavirus). ^[kdigo-aki-2012]

#### Focused examination
- Volume status (JVP, edema, pulmonary congestion, orthostasis). ^[kdigo-aki-2012]
- Signs of heart failure, infection or sepsis. ^[kdigo-aki-2012]
- Dynamic indices (pulse-pressure variation, IVC ultrasound, echocardiography) predict fluid responsiveness better than CVP. ^[kdigo-aki-2012]

## Diagnosis
#### First line
- BMP daily, CBC with differential. ^[nice-aki-2024, kdigo-aki-2012]
- Urine dipstick in all; hematuria with proteinuria without UTI or catheter trauma suggests acute nephritis. ^[nice-aki-2024]
- Urine sediment microscopy: granular casts or tubular epithelial cells favor ATN over prerenal AKI. ^[kdigo-aki-2012, perazella-urine-microscopy-2008]
- Urine Na, Cr, urea and osmolality: urinary indices below. ^[kdigo-aki-2012]
- Renal ultrasound: within 24 h if no clear cause or risk of obstruction; within 6 h if pyonephrosis suspected; not routine once the cause is known. ^[nice-aki-2024]
- Ultrasound rarely shows obstruction (<1%) without a suggestive history. ^[podoll-renal-us-2013]

#### Urinary indices (oliguric AKI)
| Index | Prerenal | ATN |
|---|---|---|
| {{calc:fena}} | {{threshold:fena-prerenal}} | {{threshold:fena-atn}} ^[miller-urine-indices-1978, carvounis-feurea-2002, gotfried-fe-indices-2012] |
| {{calc:feurea}} (on diuretics) | {{threshold:feurea-prerenal}} | {{threshold:feurea-atn}} ^[carvounis-feurea-2002, gotfried-fe-indices-2012] |
| Urine Na | {{threshold:urine-na-prerenal}} | {{threshold:urine-na-atn}} ^[miller-urine-indices-1978] |
| Urine osmolality | {{threshold:urine-osm-prerenal}} | {{threshold:urine-osm-atn}} ^[miller-urine-indices-1978] |
| Sediment | No granular casts or tubular epithelial cells | Granular casts, tubular epithelial cells ^[perazella-urine-microscopy-2008] |

:::note
- Values between the prerenal and ATN cutoffs are indeterminate; many oliguric patients fall between them. ^[miller-urine-indices-1978, gotfried-fe-indices-2012]
- Postrenal AKI is not identified by urine indices; look for it by bladder scan and urinary tract ultrasound. ^[nice-aki-2024, common-practice]
:::

- Low {{calc:fena}} despite intrinsic AKI: contrast, rhabdomyolysis, hemoglobinuria, acute GN, AIN, nonoliguric ATN, chronic low-flow states (heart failure, cirrhosis). ^[gotfried-fe-indices-2012]
- {{calc:fena}} rises with diuretics; use {{calc:feurea}}. ^[carvounis-feurea-2002]
- Low urine Na with high urine osmolality means intact tubular function, not necessarily benign prerenal azotemia; also seen in early GN and sepsis. ^[kdigo-aki-2012]
- BUN:Cr ratio does not distinguish prerenal from intrinsic AKI. ^[manoeuvrier-bcr-2017]

#### Second line, by scenario
| Suspected | Tests |
|---|---|
| Rhabdomyolysis | CK; heme-positive dipstick without RBCs ^[moore-aki-core-2018] |
| Hemolysis, TMA | Hemoglobin, platelets, LDH, haptoglobin, bilirubin, smear ^[kdigo-aki-2012, moore-aki-core-2018] |
| Tumor lysis | Uric acid, phosphate, potassium, calcium ^[moore-aki-core-2018] |
| Myeloma | SPEP, serum free light chains ^[moore-aki-core-2018] |
| GN, vasculitis | Serologies; biopsy if needed for diagnosis ^[kdigo-aki-2012] |
| Abdominal compartment syndrome | Bladder (intra-abdominal) pressure ^[kdigo-aki-2012] |

- Suspected AIN: urine eosinophils do not distinguish AIN from other causes; definitive diagnosis is by kidney biopsy. ^[muriithi-urine-eos-2013]


## Treatment
#### Common initial orders
- Stop nephrotoxins where possible (NSAIDs, aminoglycosides, amphotericin B). ^[kdigo-aki-2012]
- Strict intake and output. ^[kdigo-aki-2012]
- Daily weights. ^[common-practice]
- Renally dose all medications, with pharmacist review. ^[nice-aki-2024]
- Bladder scan. ^[nice-aki-2024]
- Tests: [[renal-aki/diagnosis|first-line tests in Diagnosis]]. ^[kdigo-aki-2012, nice-aki-2024]

#### All stages
- Consider alternatives to iodinated contrast. ^[kdigo-aki-2012]
- Consider holding ACE inhibitors and ARBs during diarrhea, vomiting or sepsis until stable. ^[nice-aki-2024]
- Restore intravascular volume and perfusion pressure with isotonic crystalloid rather than colloid (except hemorrhagic shock). ^[kdigo-aki-2012]
- Critically ill: balanced crystalloid over 0.9% saline (fewer major adverse kidney events). ^[smart-2018]
- Traumatic brain injury: 0.9% saline rather than balanced crystalloid. ^[common-practice]
- Monitor SCr and UOP. ^[kdigo-aki-2012]
- Do not use diuretics to prevent AKI; avoid them for treatment except volume overload. ^[kdigo-aki-2012]
- Do not use low-dose dopamine; avoid fenoldopam. ^[kdigo-aki-2012]
- Standard {{calc:ckd-epi}} assumes steady state; kinetic estimates ({{calc:kegfr}}, Jelliffe) correlate with measured GFR but agree poorly. ^[pelletier-egfr-aki-2020]
- Increase doses again as function recovers to avoid underdosing. ^[kdigo-aki-controversies-2020]
- Do not restrict protein to delay RRT; prefer enteral nutrition. ^[kdigo-aki-2012]

#### Stage 2 and above
- Consider ICU and RRT. ^[kdigo-aki-2012]

#### Stage 3
- Avoid subclavian catheters; preserve veins for possible dialysis access. ^[kdigo-aki-2012]

#### Specific situations
- IV contrast, {{calc:ckd-epi}} {{threshold:egfr-contrast-prophylaxis}} or AKI, not on maintenance dialysis: IV 0.9% saline prophylaxis; consider at {{threshold:egfr-contrast-consider}}. ^[acr-nkf-contrast-2020]
- Do not delay contrast in an emergency when delay would be clinically significant. ^[nice-aki-2024, acr-nkf-contrast-2020]
- Cardiorenal: loop diuretics for congestion; a modest SCr rise during effective decongestion is not by itself harmful. ^[aha-cardiorenal-2019]
- Cirrhosis with ascites: stop diuretics and nephrotoxins; give albumin. ^[aasld-ascites-hrs-2021]

{{dose:albumin-aki-cirrhosis}}

- HRS-AKI (no response after 2 days, no shock, no recent nephrotoxins, no structural injury): vasoconstrictor (terlipressin or norepinephrine) plus albumin. ^[aasld-ascites-hrs-2021]

#### RRT
- Initiate urgently for complications refractory to medical therapy; discuss potential indications with nephrology or critical care immediately. ^[kdigo-aki-2012, nice-aki-2024]
- Otherwise decide on the whole clinical picture and trends, not single urea, SCr or K⁺ values. ^[kdigo-aki-2012, nice-aki-2024]

## Escalation
- Nephrology within 24 h: possible GN, vasculitis, AIN or myeloma; no clear cause; inadequate response; complications; stage 3; kidney transplant; CKD stage 4–5. ^[nice-aki-2024]
- Not needed when the cause is clear and AKI responds promptly (unless kidney transplant). ^[nice-aki-2024]
- Urology for upper tract obstruction; immediately for pyonephrosis, solitary kidney, bilateral obstruction or complications; nephrostomy or stent within 12 h. ^[nice-aki-2024]

## More Information
### After the Acute Phase: CKD risk, kidney follow-up
- AKI raises the risk of CKD; reassess kidney function about 3 months after AKI. ^[kdigo-aki-2012]
- After recovery, consider nephrology referral if {{calc:ckd-epi}} ≤30. ^[nice-aki-2024]

### Evidence: Bicarbonate, timing of RRT
- ICU, metabolic acidemia (pH ≤7.20) with moderate–severe AKI: IV sodium bicarbonate (target pH ≥7.30) did not reduce 90-day mortality; less RRT use (secondary outcome). ^[bicaricu2-2025, bicar-icu-2018]
- Critically ill, stage 2–3 without urgent indication: accelerated RRT did not lower 90-day mortality and increased RRT dependence among survivors. ^[starrt-aki-2020]

## Pearls
- SCr and BUN lag behind kidney injury; an early normal SCr does not exclude AKI. ^[kdigo-aki-2012]
- Response to treatment (e.g. stopping a nephrotoxin) is itself diagnostic. ^[kdigo-aki-2012]

---
id: id-empiric-antimicrobials
type: reference
variant: chart
system: id
title: "Empiric Antimicrobials"
aliases: [empiric antibiotics, empiric antimicrobials, antibiotic selection, antibiotic choice, antibiotic coverage, coverage chart, antibiogram, de-escalation, antibiotic time-out, MRSA coverage, Pseudomonas coverage, ESBL, VRE, anaerobic coverage, intra-abdominal infection, IAI, peritonitis, diverticulitis, cholangitis, HAP, VAP, hospital-acquired pneumonia, ventilator-associated pneumonia, nosocomial pneumonia, meningitis, bacterial meningitis, bacteremia, bloodstream infection, line infection, CLABSI, catheter infection, candidemia, penicillin allergy, beta-lactam allergy, cephalosporin allergy, renal dosing, vancomycin, piperacillin-tazobactam, cefepime, meropenem]
checked: { date: 2026-10-21, by: opus, scope: "doses and numbers", fingerprint: "a4cb7831d97ad879", carried: "2026-10-25: Format sweep (bullets split, tables to bullets or scale, society names out of text). Numbers, doses, drugs and sources unchanged." }
related:
  conditions: [id-cap, id-cellulitis, id-complicated-uti, crit-sepsis]
  tools: [renal-aki]
  medications: [ceftriaxone]
---
## At a Glance
- Cultures first (blood, source), then start the empiric regimen without delay when septic. Narrow at 48–72 hours to the cultures and the source. ^[ssc-sepsis-2026, common-practice]
- Choose by source, then by risk. These decide MRSA, Pseudomonas and ESBL coverage: ^[idsa-sepsis-hospital-2026, idsa-ats-hap-vap-2016, ssc-sepsis-2026]
  - Recent IV antibiotics
  - Prior resistant isolate
  - Healthcare exposure
  - The local antibiogram
- Add MRSA coverage, a second antipseudomonal agent or a carbapenem only when a specific risk is present, then drop it when cultures do not need it. ^[idsa-ats-hap-vap-2016, ssc-sepsis-2026]
- Anaerobic coverage is suggested for these sources, and not otherwise: ^[ssc-sepsis-2026]
  - Intra-abdominal
  - Deep gynecologic or obstetric
  - Necrotizing soft-tissue
  - Head and neck
  - CNS abscess or empyema
- A penicillin allergy label rarely excludes a cephalosporin or carbapenem. Ask what happened before choosing around it. ^[aaaai-drug-allergy-2022]
- Pneumonia, cellulitis, urinary and septic shock regimens are on their own cards: [[id-cap|CAP]], [[id-cellulitis|Cellulitis]], [[id-complicated-uti|Pyelonephritis and complicated UTI]] and [[crit-sepsis|Sepsis]]. ^[common-practice]

## How to Read the Chart
- **Using the chart:** find the source in the Chart. Each regimen row shows the first choice, what to add for a specific risk and the usual duration. ^[common-practice]
- **Doses:** open from the drug names. ^[common-practice]
- **MRSA risk (nosocomial pneumonia):** ^[idsa-ats-hap-vap-2016]
  - IV antibiotics in the last 90 days ^[idsa-ats-hap-vap-2016]
  - For VAP, any multidrug-resistant risk factor ^[idsa-ats-hap-vap-2016]
  - For HAP, septic shock or ventilatory support for the pneumonia ^[idsa-ats-hap-vap-2016]
  - A unit where more than 10–20% (VAP) or 20% (HAP) of *S. aureus* isolates are MRSA, or the rate is unknown ^[idsa-ats-hap-vap-2016]
- **Other MRSA risk:** known MRSA colonization or prior MRSA infection also counts in practice. ^[common-practice]
- **Multidrug-resistant risk (VAP):** ^[idsa-ats-hap-vap-2016]
  - IV antibiotics in the last 90 days
  - Septic shock at onset
  - ARDS before the VAP
  - 5 or more days in hospital before the VAP
  - Acute renal replacement therapy
- **Pseudomonas risk (VAP):** structural lung disease (bronchiectasis, cystic fibrosis) adds Pseudomonas risk. ^[idsa-ats-hap-vap-2016]
- **Two antipseudomonal agents:** a unit with more than 10% resistance to the planned single agent calls for two antipseudomonal agents. ^[idsa-ats-hap-vap-2016]
- **ESBL risk:** ^[idsa-amr-2026, common-practice]
  - Prior ESBL isolate in the last 12 months
  - Antibiotics in the last 3 months
  - Local prevalence
  - Travel to a high-prevalence area
- **ESBL signal:** a ceftriaxone MIC of 4 mcg/mL or higher suggests ESBL production in *E. coli* and *Klebsiella*. ^[idsa-amr-2026, common-practice]
- **AmpC organisms** (*Enterobacter cloacae* complex, *Klebsiella aerogenes*, *Citrobacter freundii*) can develop resistance to ceftriaxone during treatment. ^[idsa-amr-2026]
- **AmpC treatment:** use cefepime for invasive infection. ^[idsa-amr-2026]
- **Match the spectrum:** match it to the source and the risk, not to the sickest patient seen. An unneeded carbapenem or double coverage adds harm without benefit. ^[ssc-sepsis-2026]
- **Order and infusion:** give the β-lactam first when vancomycin is also ordered. Use prolonged infusions of β-lactams in sepsis after a loading dose. ^[idsa-sepsis-hospital-2026, ssc-sepsis-2026]

## Chart
{{coverage:empiric-antimicrobials}}

1. Intra-abdominal infection, lower risk
   - Community-acquired, source control possible, no recent antibiotics or ESBL risk. ^[idsa-sis-iai-2010, sis-iai-2024]
   - Source control is essential. Get cultures at the procedure. ^[idsa-sis-iai-2010, idsa-iai-2024]

   {{regimen:iai-lower-risk}}

2. Intra-abdominal infection, higher risk
   - Higher risk is any of these: ^[idsa-sis-iai-2010, sis-iai-2024]
     - Severe illness
     - Delayed or inadequate source control
     - Advanced age
     - Immunosuppression
     - Postoperative or healthcare-associated infection
     - Recent antibiotics
   - Enterococcal coverage is suggested in higher-risk disease and not in lower-risk disease. ^[sis-iai-2024]
   - Empiric vancomycin is not recommended in either group. ^[sis-iai-2024]
   - Add MRSA coverage only with known MRSA colonization or treatment failure after substantial antibiotic exposure. ^[idsa-sis-iai-2010]

   {{regimen:iai-higher-risk}}

3. Hospital-acquired or ventilator-associated pneumonia
   - Send a lower respiratory culture before antibiotics. The choice follows the unit's antibiogram. ^[idsa-ats-hap-vap-2016]
   - Aim for coverage of *S. aureus*, *Pseudomonas* and other gram-negative bacilli. Avoid an aminoglycoside as the only antipseudomonal agent. ^[idsa-ats-hap-vap-2016]

   {{regimen:hap-vap}}

4. Community-acquired bacterial meningitis
   - Do not delay antibiotics for imaging or lumbar puncture. ^[idsa-meningitis-2004]
   - Draw blood cultures and give dexamethasone with the first antibiotic dose. ^[idsa-meningitis-2004]
   - CT before lumbar puncture for any of these: ^[idsa-meningitis-2004]
     - Immunocompromise
     - Known CNS disease
     - New seizure within a week
     - Papilledema
     - An abnormal level of consciousness
     - A focal neurologic deficit

   {{regimen:meningitis-community}}

or. Healthcare-associated or neurosurgical meningitis
   - Remove or replace infected hardware where possible. ^[idsa-ventriculitis-2017]

   {{regimen:meningitis-healthcare}}

5. Bloodstream infection or catheter-related infection
   - Remove short-term catheters infected with *S. aureus*, gram-negative bacilli, enterococci, fungi or mycobacteria. ^[idsa-crbsi-2009]
   - Remove long-term catheters for any of these: ^[idsa-crbsi-2009]
     - Severe sepsis
     - Endocarditis
     - Suppurative thrombophlebitis
     - Bacteremia persisting beyond 72 hours of active therapy
     - *S. aureus*, *Pseudomonas*, fungi or mycobacteria
   - *S. aureus* bacteremia: ^[idsa-esc-sab-2026]
     - Infectious diseases consultation
     - Follow-up blood cultures at 48 hours and then until negative
     - Transthoracic echocardiography in every adult
     - 14 days from the first negative culture when no deep or metastatic focus is found

   {{regimen:bacteremia-empiric}}

6. Covered on other cards
   - Pneumonia acquired outside the hospital: [[id-cap|CAP]]. ^[common-practice]
   - Skin and soft tissue, including necrotizing infection: [[id-cellulitis|Cellulitis and erysipelas]]. ^[common-practice]
   - Urinary source: [[id-complicated-uti|Pyelonephritis and complicated UTI]]. ^[common-practice]
   - Sepsis or septic shock, source unclear: [[crit-sepsis|Sepsis]]. ^[common-practice]

## Caveats
- **De-escalate:** with a pathogen and susceptibilities, narrow to the most targeted active agent. ^[ssc-sepsis-2026]
  - With negative cultures, narrow or stop when the clinical picture allows. ^[ssc-sepsis-2026]
- **Antibiotic time-out at 48–72 hours:** confirm the indication, review cultures and imaging, and set a stop date. ^[common-practice]
- **Procalcitonin** may help decide when to stop when the duration is unclear and source control is adequate. ^[ssc-sepsis-2026]
  - It is not suggested for deciding whether to start. ^[ssc-sepsis-2026]
- **IV to oral:** consider once improving, afebrile, hemodynamically stable and absorbing. ^[common-practice]
  - For *S. aureus* bacteremia, endocarditis or meningitis, only with infectious diseases. ^[common-practice]
- **ESBL organisms:** a carbapenem is preferred for invasive infection. ^[idsa-amr-2026]
  - Piperacillin-tazobactam and cefepime are not suggested even when susceptible. ^[idsa-amr-2026]
  - Oral step-down to trimethoprim-sulfamethoxazole or a fluoroquinolone when susceptible, hemodynamically stable and absorbing. ^[idsa-amr-2026]
- **Penicillin allergy:** take a history first. ^[aaaai-drug-allergy-2022]
  - Histories inconsistent with allergy need no testing. ^[aaaai-drug-allergy-2022]
  - A distant, benign rash may be challenged directly with amoxicillin. ^[aaaai-drug-allergy-2022]
- **Cephalosporins after penicillin allergy:** ^[aaaai-drug-allergy-2022]
  - Without anaphylaxis, any cephalosporin may be given.
  - After anaphylaxis, use a cephalosporin with a different side chain.
  - Cefazolin has a unique side chain and a very low cross-reactivity.
- **Carbapenems and aztreonam** may be given without testing after a penicillin or cephalosporin allergy history. ^[aaaai-drug-allergy-2022]
  - Aztreonam shares a side chain with ceftazidime, so avoid it with ceftazidime allergy. ^[aaaai-drug-allergy-2022]
- **Severe delayed reactions** (Stevens-Johnson syndrome, toxic epidermal necrolysis, DRESS): avoid the implicated drug and, generally, other β-lactams. ^[aaaai-drug-allergy-2022]
  - Involve allergy and infectious diseases. ^[aaaai-drug-allergy-2022]
- **Kidney function:** most β-lactams, carbapenems and vancomycin need adjustment. ^[label-cefepime-2026, common-practice]
  - Calculate {{calc:cockcroft-gault|CrCl}} and adjust later doses from the dose sheet.
  - The first dose is given in full.
- **Nephrotoxicity:** ^[label-zosyn-2026]
  - Vancomycin with piperacillin-tazobactam is associated with more acute kidney injury.
  - Piperacillin-tazobactam alone delays renal recovery in critical illness.
  - Monitor kidney function and consider another β-lactam in the critically ill.
- **Cefepime** can cause encephalopathy when not dose-reduced for kidney function. ^[label-cefepime-2026]
- **Cultures:** sterile-site cultures guide therapy. Do not treat colonization from non-sterile sites or an asymptomatic positive urine. ^[idsa-asb-2019]

## More Information
### Microbiology: Resistant gram-negative organisms
- ESBL-producing Enterobacterales: ^[idsa-amr-2026]
  - Preferred ertapenem, meropenem or imipenem ^[idsa-amr-2026]
  - Meropenem or imipenem in critical illness or hypoalbuminemia ^[idsa-amr-2026]
  - Cefepime-enmetazobactam is an alternative ^[idsa-amr-2026]
- AmpC-producing Enterobacterales (moderate risk): cefepime if the MIC is 8 mcg/mL or lower and no ESBL gene is identified. ^[idsa-amr-2026]
  - Ceftriaxone, cefotaxime and ceftazidime are avoided for invasive infection. ^[idsa-amr-2026]
- Difficult-to-treat resistant *Pseudomonas aeruginosa*: ceftazidime-avibactam, ceftolozane-tazobactam or imipenem-relebactam, with cefiderocol as an alternative. ^[idsa-amr-2026]
  - Involve infectious diseases. ^[idsa-amr-2026]

### Evidence: Key trials
- MERINO (2018): in ceftriaxone-resistant *E. coli* or *Klebsiella* bacteremia, 30-day mortality was 12.3% with piperacillin-tazobactam and 3.7% with meropenem. ^[merino-2018]
  - Non-inferiority was not shown. ^[merino-2018]
- STOP-IT (2015): after adequate source control, a fixed course of about 4 days was compared with treatment until physiologic resolution (median 8 days). ^[stop-it-2015]
  - Surgical-site infection, recurrent infection or death at 30 days was similar: 21.8% versus 22.3%. ^[stop-it-2015]
- BALANCE (2025): 7 days was non-inferior to 14 days for bloodstream infection, with 90-day mortality 14.5% versus 16.1%. ^[balance-2025]
  - Severe immunosuppression, *S. aureus* and foci needing longer treatment were excluded. ^[balance-2025]

## Pearls
- The first dose of any antibiotic is full-dose regardless of kidney function. Adjust from the second day. ^[common-practice]
- A negative culture on antibiotics does not exclude the pathogen. Narrow cautiously in the sickest patients. ^[common-practice]
- Vancomycin is not a cure-all: it is the wrong drug for *Listeria*, VRE and most gram-negative infections. ^[common-practice]
- Candida in blood is never a contaminant: treat, remove the line and examine the eyes. ^[idsa-candida-2016]
- Penicillin allergy labels delay effective therapy and lead to broader, less effective drugs. Clarify the label early. ^[aaaai-drug-allergy-2022]

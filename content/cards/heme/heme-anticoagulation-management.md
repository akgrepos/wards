---
id: heme-anticoagulation-management
type: topic
system: heme
title: "Anticoagulation"
aliases: [anticoagulation, blood thinner, blood thinners, DOAC, NOAC, apixaban, Eliquis, rivaroxaban, Xarelto, dabigatran, Pradaxa, edoxaban, Savaysa, warfarin, Coumadin, INR, enoxaparin, Lovenox, LMWH, heparin, UFH, fondaparinux, Arixtra, argatroban, bivalirudin, HIT, heparin-induced thrombocytopenia, anti-Xa, aPTT, bridging, warfarin to DOAC, mechanical valve, anticoagulant dosing, DOAC dosing, Anticoagulant Selection and Management, anticoagulant selection, anticoagulant management]
definition: "Choosing and dosing an anticoagulant (DOAC, warfarin, low-molecular-weight heparin, unfractionated heparin, fondaparinux or a direct thrombin inhibitor) by indication, kidney and liver function, weight, pregnancy, interacting drugs and bleeding risk, then monitoring it and changing between agents safely. ^[chest-vte-2021, ash-vte-treatment-2020, acc-aha-af-2023]"
based_on: [chest-vte-2021, ash-vte-treatment-2020, acc-aha-af-2023, aha-acc-pe-2026, ash-hit-2018, chest-periop-2022, ash-vte-cancer-2021]
checked: { date: 2026-10-25, by: opus, scope: "doses and numbers, re-read against label and guideline text", fingerprint: "10316c4217cb36ff", carried: "2026-10-25: Format sweep (bullets split, tables to bullets or scale, society names out of text). Numbers, doses, drugs and sources unchanged." }
related:
  conditions: [cardio-atrial-fibrillation, pulm-vte-diagnosis, cardio-nste-acs, gi-upper-gi-bleeding, heme-anemia, heme-vte-prophylaxis, hosp-pain-management]
---
## At a Glance
- Choice of agent: ^[ash-vte-treatment-2020, chest-vte-2021, acc-aha-af-2023, acc-aha-valvular-2020, eular-aps-2019]
  - DOAC over warfarin for acute VTE and nonvalvular AF.
  - Warfarin for mechanical valves, moderate–severe rheumatic mitral stenosis and thrombotic antiphospholipid syndrome.
- Before starting: ^[acc-aha-af-2023, common-practice]
  - CBC, creatinine with {{calc:cockcroft-gault}}, liver tests, weight, interacting drugs and bleeding risk.
  - Use {{calc:has-bled}} to find modifiable factors, not to withhold anticoagulation.
- Pregnancy: low-molecular-weight heparin. No warfarin or DOAC. ^[ash-vte-pregnancy-2018]
- Kidney failure ({{calc:cockcroft-gault}} <30), high bleeding risk or a procedure or thrombolysis planned: unfractionated heparin acutely. ^[common-practice]
- Suspected HIT ({{calc:4ts}} intermediate or high): stop all heparin and start a non-heparin anticoagulant at once. No warfarin until platelets recover. ^[ash-hit-2018]
- Procedures: ^[chest-periop-2022, pause-2019]
  - Interrupt a DOAC for 1–2 days without bridging.
  - Warfarin 5 days, bridging only in the highest thrombotic risk.

## First Steps
- Confirm the indication and duration, and that there is no active major bleeding. ^[common-practice]
- Labs: ^[acc-aha-af-2023, common-practice]
   - CBC with platelets, creatinine and {{calc:cockcroft-gault}}, liver panel, PT/INR and aPTT. ^[acc-aha-af-2023, common-practice]
   - Weight. ^[acc-aha-af-2023, common-practice]
   - Pregnancy test if applicable. ^[acc-aha-af-2023, common-practice]
- Review every drug for interactions, including NSAIDs and antiplatelets (bleeding) and CYP3A4 or P-gp inhibitors and inducers (see Interactions). ^[label-eliquis-2025, label-xarelto-2026]
- Valve or antiphospholipid syndrome history, prior heparin exposure with a platelet drop, and cancer change the choice. ^[acc-aha-valvular-2020, ash-hit-2018, ash-vte-treatment-2020]
- Hemodynamically unstable PE or thrombolysis planned: start unfractionated heparin. See the [[pulm-vte-diagnosis|VTE diagnosis]] card and the Wave 2 PE treatment card. ^[aha-acc-pe-2026]

## Treatment
1. Choose the agent
   - **Acute DVT or PE, no special features:** ^[ash-vte-treatment-2020, chest-vte-2021, aha-acc-pe-2026]
     - Preferred: apixaban or rivaroxaban (no lead-in).
     - Preferred: dabigatran or edoxaban after 5–10 days of parenteral anticoagulation.
     - Avoid or caution: warfarin only when a DOAC cannot be used.
   - **Nonvalvular AF:** ^[acc-aha-af-2023, label-savaysa-2025]
     - Preferred: DOAC.
     - Avoid or caution: edoxaban with {{calc:cockcroft-gault}} >95.
   - **Cancer-associated VTE:** ^[chest-vte-2021, ash-vte-cancer-2021, asco-vte-cancer-2023]
     - Preferred: apixaban, rivaroxaban or edoxaban (guidance prefers these over LMWH) or LMWH.
     - Avoid or caution: all factor Xa inhibitors in GI and GU cancers (mucosal bleeding).
     - Avoid or caution: edoxaban and rivaroxaban had more major GI bleeding than LMWH in luminal GI cancer.
   - **Pregnancy and postpartum:** ^[ash-vte-pregnancy-2018]
     - Preferred: LMWH.
     - Avoid or caution: warfarin and DOACs.
   - **Mechanical valve:** ^[acc-aha-valvular-2020]
     - Preferred: warfarin.
     - Avoid or caution: DOACs (dabigatran: excess thrombosis and bleeding).
   - **Moderate–severe rheumatic mitral stenosis:** ^[acc-aha-af-2023]
     - Preferred: warfarin.
     - Avoid or caution: DOACs.
   - **Antiphospholipid syndrome with thrombosis:** ^[eular-aps-2019, chest-vte-2021, aha-acc-pe-2026, label-eliquis-2025, label-xarelto-2026, label-pradaxa-2025, label-savaysa-2025]
     - Preferred: warfarin, INR 2–3.
     - Preferred: a DOAC is reasonable only in single-antibody venous disease.
     - Avoid or caution: any DOAC if triple positive (the apixaban, rivaroxaban, dabigatran and edoxaban labels advise against it).
     - Avoid or caution: any DOAC after arterial events.
   - **Kidney failure or dialysis** ({{calc:cockcroft-gault}} <30): ^[common-practice, label-eliquis-2025, aha-acc-pe-2026, label-arixtra-2024, label-lovenox-2026, label-savaysa-2025, label-pradaxa-2025]
     - Preferred: unfractionated heparin acutely. Warfarin or apixaban long term.
     - Avoid or caution: fondaparinux is contraindicated.
     - Avoid or caution: reduce LMWH (once daily), edoxaban (reduced dose at 15–50, not recommended <15) and dabigatran (no VTE dose at ≤30) per label.
   - **Liver disease:** {{calc:child-pugh}} B or C ^[label-xarelto-2026, label-savaysa-2025, common-practice, label-eliquis-2025]
     - Preferred: individualize. LMWH or specialist input.
     - Avoid or caution: rivaroxaban and edoxaban. Apixaban in C.
   - **History of HIT or suspected HIT:** ^[ash-hit-2018]
     - Preferred: non-heparin agent (see Escalation).
     - Avoid or caution: all heparins.
   - **Unstable, high bleeding risk, or procedure planned:** ^[common-practice]
     - Preferred: unfractionated heparin.
     - Avoid or caution: long-acting agents.

2. Dosing
   - Acute VTE: the DOAC doses below. Extended therapy after 6 months may use a lower apixaban or rivaroxaban dose. ^[label-eliquis-2025, label-xarelto-2026, ash-vte-treatment-2020]

   {{dose:apixaban-vte}}
   {{dose:rivaroxaban-vte}}
   {{dose:dabigatran-vte}}
   {{dose:edoxaban-vte}}

   - Nonvalvular AF (stroke-risk decisions: [[cardio-atrial-fibrillation|atrial fibrillation]]): ^[acc-aha-af-2023]

   {{dose:apixaban-af}}
   {{dose:rivaroxaban-af}}
   {{dose:dabigatran-af}}
   {{dose:edoxaban-af}}

3. Parenteral agents
   - Lead-in 5–10 days for dabigatran and edoxaban. ^[aha-acc-pe-2026, asco-vte-cancer-2023, ash-hit-2018]
   - LMWH is recommended over unfractionated heparin for initial parenteral therapy. ^[aha-acc-pe-2026, asco-vte-cancer-2023, ash-hit-2018]
   - Fondaparinux with a history of HIT. ^[aha-acc-pe-2026, asco-vte-cancer-2023, ash-hit-2018]

   {{dose:enoxaparin-treatment}}
   {{dose:heparin-vte}}
   {{dose:fondaparinux-vte}}

   - Prophylactic dosing: VTE prophylaxis (separate card). ^[common-practice]

4. Warfarin
   - Start with a parenteral agent (VTE), overlap at least 5 days and until INR is at least 2.0. INR target 2.0–3.0 for VTE and AF. ^[label-warfarin-2025, aha-acc-pe-2026, acc-aha-af-2023, common-practice]

   {{dose:warfarin-vte}}

   - Mechanical valve: ^[acc-aha-valvular-2020]
     - Aortic: INR 2.5, or 3.0 with risk factors (AF, prior thromboembolism, hypercoagulable state, older-generation valve, LV dysfunction).
     - Mitral: INR 3.0.
     - A newer bileaflet aortic valve (On-X) without risk factors may use INR 1.5–2.0 with aspirin after 3 months.
   - Pharmacogenomic dosing is optional. Do not delay the start. ^[label-warfarin-2025]

5. Changing between agents
   - **Warfarin to apixaban or dabigatran:** stop warfarin. Start when INR <2.0. ^[label-eliquis-2025, label-pradaxa-2025]
   - **Warfarin to rivaroxaban:** stop warfarin. Start when INR <3.0. ^[label-xarelto-2026]
   - **Warfarin to edoxaban:** stop warfarin. Start when INR ≤2.5. ^[label-savaysa-2025]
   - **Apixaban, rivaroxaban or edoxaban to warfarin:** ^[label-eliquis-2025, label-xarelto-2026, label-savaysa-2025]
     - INR is unreliable on the DOAC.
     - Start a parenteral agent and warfarin at the next dose due.
     - Stop the parenteral agent when INR is therapeutic.
   - **Dabigatran to warfarin:** start warfarin 3 days before stopping if {{calc:cockcroft-gault}} ≥50, 2 days if 30–50, 1 day if 15–30. ^[label-pradaxa-2025]
   - **Edoxaban to warfarin:** parenteral plus warfarin as above, or the label's oral option (halve the edoxaban dose, overlap until INR ≥2.0). ^[label-savaysa-2025]
   - **LMWH to DOAC:** start at the next scheduled LMWH dose. ^[label-eliquis-2025, label-xarelto-2026, label-savaysa-2025]
   - **UFH infusion to DOAC:** start when the infusion stops (edoxaban: 4 hours after). ^[label-xarelto-2026, label-savaysa-2025]
   - **DOAC to LMWH or UFH:** start at the next scheduled DOAC dose. ^[label-eliquis-2025, label-xarelto-2026, label-pradaxa-2025]
     - Dabigatran: 12 hours after the last dose if {{calc:cockcroft-gault}} ≥30, 24 hours if <30.

6. Duration
   - Provoked VTE: 3 months. Unprovoked or persistent risk factor with low to moderate bleeding risk: extended therapy, reassessed at least yearly. ^[chest-vte-2021, ash-vte-treatment-2020, aha-acc-pe-2026]
   - Cancer-associated VTE: at least 6 months. Continue while cancer is active. ^[asco-vte-cancer-2023]
   - AF: indefinite while stroke risk persists. ^[acc-aha-af-2023]

#### Interactions
- Bleeding risk rises with NSAIDs, aspirin and other antiplatelets, and SSRIs or SNRIs. ^[label-eliquis-2025, label-warfarin-2025]
- Apixaban: ^[label-eliquis-2025]
   - Halve the dose with combined strong CYP3A4 and P-gp inhibitors (ketoconazole, itraconazole, ritonavir), avoid them if already on the lowest dose.
   - Avoid strong inducers (rifampin, carbamazepine, phenytoin, St John's wort).
- Rivaroxaban: ^[label-xarelto-2026]
   - Avoid combined P-gp and strong CYP3A4 inhibitors and strong inducers.
   - With {{calc:cockcroft-gault}} 15 to <80, do not combine with a P-gp and moderate CYP3A inhibitor (erythromycin) unless the benefit justifies the risk.
- Dabigatran: ^[label-pradaxa-2025, label-savaysa-2025]
   - Dronedarone or ketoconazole with reduced kidney function lowers the AF dose or means avoidance. ^[label-pradaxa-2025, label-savaysa-2025]
   - Edoxaban reduces the dose for some P-gp inhibitors in VTE only. ^[label-pradaxa-2025, label-savaysa-2025]
   - Avoid rifampin with both. ^[label-pradaxa-2025, label-savaysa-2025]
- Warfarin, stronger effect: ^[label-warfarin-2025, common-practice]
   - Amiodarone, azole antifungals, trimethoprim-sulfamethoxazole, metronidazole, fluoroquinolones.
   - Many antibiotics, regular acetaminophen, alcohol binge.
- Warfarin, weaker effect: rifampin, carbamazepine, phenytoin, St John's wort, vitamin K–rich foods. ^[label-warfarin-2025, common-practice]
- Keep vitamin K intake steady rather than avoiding greens. Recheck INR within 3–5 days of starting or stopping an interacting drug. ^[label-warfarin-2025, common-practice]
- Use the interaction checker linked in each dose sheet. ^[common-practice]

#### Periprocedural management
- Estimate procedural bleeding risk and patient thrombotic risk well before the procedure. ^[chest-periop-2022]
- Minor procedures (dental, dermatologic, cataract) usually need no interruption. ^[chest-periop-2022]
- Hold times before the procedure: ^[pause-2019, chest-periop-2022]
   - Apixaban, rivaroxaban, edoxaban: skip 1 day before for low bleeding risk, 2 days before for high. ^[pause-2019, chest-periop-2022]
   - Dabigatran, {{calc:cockcroft-gault}} ≥50: skip 1 day before for low bleeding risk, 2 days before for high. ^[pause-2019]
   - Dabigatran, {{calc:cockcroft-gault}} <50: skip 2 days before for low bleeding risk, 4 days before for high. ^[pause-2019]
   - Warfarin: stop 5 days before for low or high bleeding risk. INR the day before in selected patients. ^[chest-periop-2022]
- Edoxaban hold times rest on the 2022 guidance (1–2 days), not the older study. ^[chest-periop-2022]
- DOACs: no heparin bridging. Resume 1 day after low-risk and 2–3 days after high-risk procedures once hemostasis is secure. ^[pause-2019, chest-periop-2022]
- Warfarin: ^[chest-periop-2022, acc-aha-valvular-2020]
   - Recommend against bridging in AF. ^[chest-periop-2022]
   - Suggest against bridging for VTE beyond 3 months and for mechanical valves, except for high thrombotic risk. ^[chest-periop-2022]
   - High thrombotic risk includes a mitral valve with stroke risk factors, or a caged-ball or tilting-disc valve. ^[chest-periop-2022]
   - High thrombotic risk also includes stroke or VTE in the past 3 months, severe thrombophilia or antiphospholipid antibodies. ^[chest-periop-2022]
   - The 2020 valve guideline is more permissive and still lists any mechanical mitral valve as higher risk. ^[acc-aha-valvular-2020]
   - Restart within 24 hours at the usual dose. ^[chest-periop-2022, acc-aha-valvular-2020]
- Neuraxial anesthesia: follow the label hold times and timing rules for each agent. ^[label-eliquis-2025, label-xarelto-2026, label-lovenox-2026]

## Monitor
- **Warfarin:** INR daily to every few days at the start, then every 1–4 weeks once stable. ^[label-warfarin-2025]
- **DOACs:** no routine coagulation tests. Creatinine, CBC and liver tests at baseline and at least yearly, sooner with a change in kidney function. ^[acc-aha-af-2023, label-eliquis-2025]
- **Unfractionated heparin:** aPTT or anti-Xa every 4–6 hours after the start or a dose change until therapeutic, then daily. ^[label-heparin-2025, common-practice]
- **Platelets on heparin:** ^[ash-hit-2018]
   - Every 2–3 days from day 4 to day 14.
   - At least every other day on unfractionated heparin after surgery or trauma, and from day 0 if heparin was given in the past 30 days.
   - Not needed for medical patients on LMWH or for fondaparinux.
- **LMWH:** ^[ash-vte-pregnancy-2018, aha-acc-pe-2026, acc-aha-valvular-2020, common-practice]
   - No routine anti-Xa, including in pregnancy.
   - Consider a peak level (4 hours after the third dose) with {{calc:cockcroft-gault}} below 30, weight above 150 kg or a mechanical valve in pregnancy.
- **Every anticoagulant:** bleeding signs, adherence, new interacting drugs, falls, and a yearly review of the indication. ^[acc-aha-af-2023, common-practice]

## Escalation
#### Heparin-induced thrombocytopenia
- Suspect when platelets fall by more than 50% (or to below 50% of baseline). ^[ash-hit-2018]
- Onset is usually 5–10 days after heparin starts (sooner with exposure in the past 30–100 days). ^[ash-hit-2018]
- Suspect also with new thrombosis. ^[ash-hit-2018]
- Score with the {{calc:4ts}}: 0–3 low (HIT unlikely, continue heparin), 4–5 intermediate, 6–8 high. ^[ash-hit-2018]
- Intermediate or high: ^[ash-hit-2018, common-practice]
  - Stop all heparin (including flushes and heparin-coated catheters, and LMWH).
  - Start a non-heparin anticoagulant and send a PF4/heparin immunoassay.
  - Confirm a positive result with a functional assay (serotonin release).
- Do not wait for the assay in intermediate or high probability. Compression ultrasound of the legs to look for thrombosis. ^[ash-hit-2018, common-practice]
- Agent: ^[ash-hit-2018]
  - Argatroban or bivalirudin (critically ill, high bleeding risk, possible procedure) ^[ash-hit-2018]
  - Fondaparinux, rivaroxaban or apixaban when stable ^[ash-hit-2018]
  - Dabigatran only after at least 5 days of a parenteral non-heparin agent ^[ash-hit-2018]

{{dose:argatroban-hit}}

- Warfarin only after platelets recover (stably at least 150,000/mm³), with no loading dose and overlap with the non-heparin agent until INR is therapeutic. ^[ash-hit-2018, label-argatroban-2026]
- Duration: ^[ash-hit-2018, common-practice]
  - Isolated HIT: at least until platelet recovery (guidance suggests against 3 months).
  - With thrombosis: usually 3–6 months.
  - Avoid heparin in future (cardiac surgery excepted, with specialist input).
- Platelet transfusion only for bleeding or a high-risk procedure. ^[ash-hit-2018]

#### Other escalations
- Bleeding on an anticoagulant: reversal comes with the Wave 2 reversal card. ^[common-practice]
- Reversal options: idarucizumab, andexanet alfa, 4-factor prothrombin complex concentrate, protamine, vitamin K. ^[common-practice]
- Recurrent VTE on therapy: ^[aha-acc-pe-2026]
  - Check adherence and interacting drugs, consider cancer or antiphospholipid syndrome, and switch class (LMWH or fondaparinux).
  - Recurrence on a reduced-dose extended DOAC: return to the full dose.
- Stable cardiovascular disease with VTE on anticoagulation: guidance suggests anticoagulant alone rather than adding aspirin. ^[ash-vte-treatment-2020]
- Hematology input: HIT, antiphospholipid syndrome, pregnancy, mechanical valve with a bleed, or recurrent thrombosis on therapy. ^[common-practice]

## More Information
### Special Populations: Kidney, liver, weight, pregnancy, cancer
#### Kidney
- Use Cockcroft-Gault {{calc:cockcroft-gault}} for DOAC dosing, as in the labels. ^[label-eliquis-2025, label-xarelto-2026]
- Apixaban needs no VTE adjustment, including on dialysis. AF dose reduction uses age, weight and creatinine. ^[label-eliquis-2025]
- Rivaroxaban: avoid at {{calc:cockcroft-gault}} <15 for VTE. ^[label-xarelto-2026]
- Dabigatran and edoxaban: see dose sheets. Edoxaban is not recommended below 15. ^[label-pradaxa-2025, label-savaysa-2025]
- LMWH accumulates when {{calc:cockcroft-gault}} is below 30: reduce the dose or use unfractionated heparin. Fondaparinux is contraindicated. ^[label-lovenox-2026, label-arixtra-2024]

#### Liver
- {{calc:child-pugh}} B or C: rivaroxaban and edoxaban are not recommended, apixaban not recommended in C. Warfarin dosing is harder because the INR is already abnormal. ^[label-xarelto-2026, label-savaysa-2025, label-eliquis-2025]

#### Weight and obesity
- Apixaban and rivaroxaban at standard doses for VTE regardless of weight or BMI. ^[isth-obesity-doac-2021, aha-acc-pe-2026]
- Guidance suggests not using dabigatran or edoxaban at BMI >40 kg/m² or weight >120 kg, and no DOACs for at least 4 weeks after bariatric surgery. ^[isth-obesity-doac-2021, aha-acc-pe-2026]
- Enoxaparin uses actual body weight. Individualize above 150 kg. ^[aha-acc-pe-2026, label-lovenox-2026]
- Weight ≤60 kg lowers the edoxaban dose for VTE. Exposure to fixed prophylactic LMWH doses rises, with more bleeding, in women <45 kg and men <57 kg. ^[label-savaysa-2025, label-lovenox-2026]

#### Age
- Older age raises bleeding risk with every agent. Reduce doses only by label criteria, not by judgment alone. ^[label-eliquis-2025, acc-aha-af-2023]

#### Pregnancy and lactation
- Treatment: LMWH throughout pregnancy and for at least 6 weeks postpartum (minimum total 3 months). Warfarin and DOACs are avoided in pregnancy. ^[ash-vte-pregnancy-2018, chest-pregnancy-2012]
- Around delivery: guidance suggests scheduled delivery with LMWH stopped beforehand. Allow at least 24 hours after a treatment dose before neuraxial anesthesia. ^[ash-vte-pregnancy-2018, label-lovenox-2026]
- Breastfeeding: ^[ash-vte-pregnancy-2018, lactmed-warfarin-2024, lactmed-enoxaparin-2025, lactmed-heparin-2024, lactmed-fondaparinux-2020, lactmed-apixaban-2026, lactmed-edoxaban-2026, lactmed-rivaroxaban-2026, lactmed-dabigatran-2026]
  - Warfarin, LMWH, unfractionated heparin and fondaparinux are compatible.
  - Guidance advises against DOACs.
  - Apixaban and edoxaban pass into milk at higher levels (use an alternative).
  - Rivaroxaban and dabigatran reach low levels and are not a reason to stop breastfeeding.
- Mechanical valves in pregnancy need specialist input (valve thrombosis risk). ^[acc-aha-valvular-2020]

#### Cancer
- Preferred: apixaban, rivaroxaban, edoxaban or LMWH for at least 6 months. Caution with all factor Xa inhibitors in GI and GU cancers. ^[asco-vte-cancer-2023, ash-vte-cancer-2021, chest-vte-2021]

### Epidemiology and Pathophysiology: How the classes work
- Warfarin blocks vitamin K epoxide reductase and lowers factors II, VII, IX and X (and proteins C and S). ^[label-warfarin-2025]
- Apixaban, rivaroxaban and edoxaban inhibit factor Xa. Dabigatran inhibits thrombin directly. ^[label-eliquis-2025, label-pradaxa-2025]
- Heparins act through antithrombin. Fondaparinux inhibits factor Xa only through antithrombin. ^[label-heparin-2025, label-arixtra-2024]
- INR reflects warfarin, not DOACs: dabigatran prolongs thrombin time and aPTT, and anti-Xa agents prolong PT. ^[common-practice]

## Pearls
- A warfarin start without a parenteral overlap risks paradoxical thrombosis and skin necrosis in the first days. ^[label-warfarin-2025]
- Edoxaban is less effective in AF when {{calc:cockcroft-gault}} >95. ^[label-savaysa-2025]
- Dabigatran needs a parenteral lead-in for VTE. Apixaban and rivaroxaban do not. ^[label-pradaxa-2025, label-eliquis-2025]
- A falling platelet count on any heparin, even LMWH, should prompt a {{calc:4ts}} check. ^[ash-hit-2018]
- Do not underdose a DOAC: reduce only when the label criteria are met. ^[label-eliquis-2025, acc-aha-af-2023]

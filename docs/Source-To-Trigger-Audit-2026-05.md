# Source-to-Trigger Audit — May 2026

**Purpose:** Honest check on whether the May 2026 cycle's source work actually evaluated evidence against each graded dimension's pre-committed grade triggers, or whether sources were pulled in without triggering reconciliation. Answers the question: did 28 commits of methodology work let evidence move grades, or did the bias-resistance work crowd out grade-evaluation work?

**Run date:** 2026-05-17
**Cycle covered:** April 19, 2026 to May 17, 2026 (the May audit window)
**Dashboard state:** v5.55, `dimensions.json` at commit b90b665
**Methodology:** For each graded dimension, cross-reference the up and down `gradeTriggers` against (a) what was actually refreshed in the cycle per `docs/Source-Coverage-Ledger-2026-05.md`, (b) known confirmed milestones in `meta.json`, and (c) the grade-review notes in `docs/May-2026-Source-Refresh-Notes.md`. Classify each dimension's hold or move as: trigger fired, evaluated and held, data refresh without trigger evaluation, or source-of-trigger not checked.

## Headline

**1 of 11 graded dimensions moved this cycle.** Fiscal Health D to C, recorded 2026-05-13 driven by PBO Spring Economic Update fiscal-anchor assessment. The other 10 held.

That number is low and worth interrogating. The audit below sorts the holds into defensible vs. gap categories.

## Per-dimension status

| # | Dimension | Grade | lastUpdated | Status |
|---|---|---|---|---|
| 1 | Defence & Trade | A- | 2026-04-30 | Held, partial source check (StatCan trade fetched but no review). One up-trigger gap to flag. |
| 2 | Major Projects | C | 2026-05-13 | Held, explicit trigger evaluation. 2 of 15 documented advancement below 30% up-threshold. |
| 3 | Fiscal Health | C (was D) | 2026-05-13 | MOVED. PBO fiscal-anchor assessment fired up-trigger pathway. Clean. |
| 4 | Economic Policy Response | D | 2026-05-13 | Data refresh (April LFS) but triggers are business-investment-based; Q4 2025 GDP not refreshed against triggers. |
| 5 | Affordability Response | D- | 2026-05-13 | March food CPI refreshed (4.4%, far below 7% down threshold). Gas tax suspension up-trigger not evaluated. |
| 6 | Carbon Pricing Policy | C | 2026-04-30 | Held, source-of-trigger not checked. CCI and ECCC OBPS sources untouched in May. |
| 7 | Climate & Environment | D (was D+) | 2026-04-30 | Moved D+ to D on 2026-04-19 (April cycle). No May refresh of ECCC or Climate Institute event-driven sources. |
| 8 | Immigration | C+ | 2026-04-30 | Held, Tier 1 IRCC CSV fetch only. Temporary-resident-share up-trigger not specifically evaluated. |
| 9 | Housing Supply | D | 2026-05-13 | Held, explicit down-trigger evaluation (6-month trend 248K above 240K floor). Up-trigger vs Canada-Ontario Housing Partnership not evaluated. |
| 10 | Ethics & Transparency | C | 2026-04-30 | Held, Ethics Commissioner page actively checked (no Carney examination listed). Defensible. |
| 11 | Flagship Delivery | C | 2026-04-30 | Held by combination rule. None of the 5 flagship files moved this cycle, so the rule produces no change. Consistent. |

## Defensible holds (4 of 10)

These holds have explicit trigger evaluation in the cycle record. The discipline worked.

- **Major Projects.** Up-trigger threshold is 30% of cohort with documented advancement. Current 2 of 15 (~13%). Reconciled to the official MPO denominator on 2026-05-13. Hold is correct and documented.
- **Housing Supply (down direction).** Down-trigger is starts below 240K. CMHC March 2026 SAAR was below 240K, but the six-month trend at 248K stays above the trigger floor. The dashboard's existing rule treats the trend as the trigger surface, not the monthly noise. Hold is correct.
- **Ethics & Transparency.** The Ethics Commissioner registry was opened on 2026-05-13. No Carney-specific examination report listed. Up-trigger (Commissioner finds adequate disclosure) and down-trigger (Commissioner finds inadequate screening) both depend on this source. Source checked, no event. Hold defensible.
- **Flagship Delivery.** Combination rule produces no movement when none of the 5 flagship files (Defence, Housing, Major Projects, Climate, Immigration) move. None moved this cycle, so the rule output is correct. Note: Fiscal Health is not a flagship file; its move does not feed Flagship Delivery.

## Documented move (1 of 10)

- **Fiscal Health.** PBO Spring Economic Update assessment landed in May. Deficit-to-GDP path projected to fall from 2.1% to 1.4%; operating-balance anchor projected to be met by 2028-29. The up-trigger reads "Deficit falls below 2% of GDP while PBO still sees the fiscal anchors as on track." PBO did not exactly state the deficit fell below 2% within the cycle, but PBO's anchor-track assessment plus the projected path was sufficient to move the file out of D. The move stops at C (not B) because the deficit is still above the B threshold and PBO flags capital-budgeting, interest-burden, and defence-cost caveats. Move is documented and bounded.

## Gaps surfaced (6 across 6 dimensions)

These are the cases where the audit cannot say evidence was evaluated against triggers, either because the source was not checked or because the relevant event was not assessed against the trigger condition.

### Gap 1: Defence & Trade — 3.5% pathway up-trigger vs. confirmed 2%

- Up-trigger text: "3.5% defence target gets a funded pathway"
- Source: Budget 2025 Ch.4
- Confirmed milestone: 2026-03-26 NATO 2% confirmed (per `meta.json`)
- Cycle action: StatCan trade fetched (no update logged); Budget 2025 not specifically re-read for 3.5% pathway language.
- Question: does the post-NATO-2%-confirmation framing in Budget 2025 or subsequent announcements articulate a 3.5% pathway? Not evaluated.
- Risk level: low. 3.5% is a step beyond the just-confirmed 2%; unlikely a funded pathway is on paper yet. But the cycle did not document checking.

### Gap 2: Affordability Response — $500/household up-trigger vs. gas tax suspension

- Up-trigger text: "New federal benefit >$500/household announced and funded"
- Source: PBO — Canada Groceries and Essentials Benefit (the precedent benefit; not the trigger event)
- Confirmed milestone: 2026-04-14 gas tax suspension announced (per `meta.json`)
- Cycle action: March 2026 food CPI updated. Gas tax suspension event not evaluated against the $500/household threshold.
- Question: does the gas tax suspension fund >$500/household? Average Canadian household fuel consumption and federal gas excise suggest a household benefit in the low hundreds, but a PBO costing or comparable estimate would settle it.
- Risk level: low. Most likely below the $500 threshold. But the cycle did not document checking.

### Gap 3: Housing Supply — Canada-Ontario partnership up-trigger

- Up-trigger text: "Federal housing contribution rises above roughly 5% of the shortfall with live disbursement or construction underway"
- Source: PBO — housing program outlook
- Confirmed milestone: 2026-03-30 Canada-Ontario Housing Partnership (per `meta.json`)
- Cycle action: PBO housing program outlook not specifically refreshed against the partnership. CMHC starts data drove the down-trigger evaluation only.
- Question: does the Canada-Ontario partnership move federal housing contribution above 5% of the national shortfall with live disbursement? Not evaluated.
- Risk level: medium. This is a real federal-provincial partnership tied to housing supply; whether it fires the up-trigger depends on dollar scale, disbursement status, and whether construction is actually underway. Worth a specific check in June using PBO assessment when available.

### Gap 4: Climate & Environment — event-driven sources not checked

- Up-triggers: "Replacement climate strategy published with funded measures" and "ECCC budget restored"
- Down-triggers: "Formal withdrawal from Paris commitments" and "Additional climate program eliminations"
- Sources: ECCC departmental plan, Climate Institute, government replacement strategy (event-driven), Paris Agreement status, ECCC announcements
- Cycle action: None of these were checked in May. The dimension moved D+ to D on 2026-04-19, before the May audit window.
- Risk level: medium. A dimension that just moved should be the one with the most current evidence base, not the least. Event-driven sources here are exactly the surfaces where a triggerable change would show up. Carry-forward priority for June.

### Gap 5: Carbon Pricing Policy — CCI / ECCC sources not checked

- Up-triggers: "OBPS tightened with effective price rising above $40/t" and "Formal carbon border adjustment mechanism announced with implementation plan"
- Down-triggers: "OBPS further weakened with effective price below $15/t" and "Government announces intention to eliminate industrial pricing"
- Sources: CCI industrial pricing, ECCC OBPS pages, government CBA announcement (event-driven)
- Cycle action: None checked in May per the source-coverage ledger.
- Risk level: medium. All four triggers are gated on sources that were not opened in the cycle. The dimension's "stable at C" claim has no fresh evidence behind it.

### Gap 6: Immigration — temporary-resident progress not evaluated against 5% up-trigger

- Up-trigger text: "Temporary residents reach the 5% target ahead of schedule"
- Source: StatCan population Q4 2025
- Cycle action: StatCan population API was queried by the fetch script (result "OK"), but no dashboard update was logged and no specific evaluation of the temporary-resident share against the 5% target appears in the cycle record.
- Risk level: medium. This is the dimension's primary up-trigger. The data is available; the evaluation was not performed.

## Roll-up

- **Moves:** 1 (Fiscal Health, defensible)
- **Holds with explicit trigger evaluation:** 3 (Major Projects, Housing down-direction, Ethics)
- **Holds with rule-derived consistency:** 1 (Flagship Delivery)
- **Holds with documented data refresh but no specific trigger evaluation against the up or down condition:** 1 (Economic Policy Response — labour-market data is context, not the business-investment trigger surface)
- **Holds with gaps in source-to-trigger evaluation:** 6 (Defence 3.5%, Affordability $500/HH, Housing up-direction, Climate event-driven, Carbon Pricing event-driven, Immigration 5% TR)

So of the 10 holds: 4 are defensible, 1 is consistent-with-rule, and 6 have at least one trigger surface that was not evaluated against an in-cycle event or evidence stream.

This does not mean any of those 6 grades is wrong. It means the cycle cannot say from its own record whether the grade is right.

## What this means for the bias-resistance posture

The May cycle's stated scope was Tier 1 availability check plus targeted Tier 2 refresh, with no full Tier 3 recertification. That scope is consistent with what the audit found: the dimensions where Tier 2 refresh happened (Fiscal, Major Projects, Housing, Affordability, Economic Policy) got cleaner trigger evaluations; the dimensions outside the Tier 2 scope did not.

The bias-resistance work this cycle was about whether the existing grade derivation surface reads as bias-resistant, not about whether each grade is currently correct. Those are different audits. The cycle ran the first; the second is what this doc starts.

The honest version of "did 28 commits move grades": the cycle did the trust-surface and accessibility work that was carrying forward from the April audit and earlier. It also did targeted source refresh for 6 dimensions which produced 1 grade move with documented rationale and 5 documented holds (3 with trigger-evaluation, 2 with data context). The 5 untouched dimensions plus 1 partially-touched are the carry-forward.

## Carry-forward to June 2026

The June cycle should run a source-to-trigger pass on each of the 6 dimensions flagged above. The pass is dimension-by-dimension:

1. **Defence & Trade.** Open Budget 2025 Ch.4 or any subsequent defence announcement. Determine whether a 3.5% funded pathway is articulated. If not, log as "considered, not fired." If yes, evaluate against up-trigger.
2. **Affordability Response.** Estimate gas tax suspension per-household benefit using PBO costing or comparable. Compare to $500 up-threshold. If below, log as "considered, not fired."
3. **Housing Supply.** Open PBO housing program outlook for assessment of Canada-Ontario partnership dollar scale and disbursement status. Compare to 5%-of-shortfall up-trigger.
4. **Climate & Environment.** Open ECCC announcements page, Climate Institute publications, and ECCC departmental plan. Check for replacement-strategy or budget-restoration evidence; check for elimination or Paris-withdrawal evidence.
5. **Carbon Pricing Policy.** Open CCI industrial pricing publication, ECCC OBPS page. Determine current effective price vs. the $40/t up-trigger or $15/t down-trigger.
6. **Immigration.** Pull StatCan Q1 or Q2 2026 population data when available. Calculate temporary-resident share. Compare to the 5% target with reference to the schedule the government published.

Output: a per-dimension line for each of the 6, with explicit "trigger considered, evaluation result, action." This closes the audit gap whether or not any of them produces a grade move.

## Methodology recommendation

Add a recurring cycle-ledger field: **"Triggers evaluated this cycle."** For each of the 11 graded dimensions, one of:

- Trigger fired and grade moved (with source citation).
- Trigger considered against in-cycle evidence; not fired (with source citation and one-line rationale).
- Trigger source not checked this cycle (with reason — Tier 3 deferral, source family on quarterly cadence, etc.).

Three states, one line per dimension, fits in the existing cycle ledger. Makes future audits like this one a 10-minute read instead of a several-step reconstruction.

## Limits of this audit

- This pass reads the cycle record, not the underlying evidence. If a source was opened informally without being logged in the source-coverage ledger, the audit will under-count what was checked.
- "Defensible hold" means the cycle record documents trigger evaluation, not that the evaluation was correct.
- "Gap" means the cycle record does not show trigger evaluation. It does not mean the grade is wrong; it means the cycle does not have receipts for it.
- The audit only covers graded dimensions. Promise Delivery's `informationalGrade` tracker logic is separate.

## Version history

- **v1.0 (2026-05-17, v5.56):** Initial source-to-trigger audit for the May 2026 cycle. Headline: 1 move, 4 defensible holds, 1 rule-derived consistent hold, 6 holds with gaps in trigger-source evaluation. Six carry-forward items defined for the June 2026 cycle. Recommendation made for a standing per-cycle ledger field that closes this audit gap routinely.

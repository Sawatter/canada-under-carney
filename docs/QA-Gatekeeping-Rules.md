# QA Gatekeeping Rules

**Purpose:** Pre-release protocol for every monthly update. Based on lessons from the April 2026 simulated drill (Pack 5: announcement bias case). These rules are the firewall between the analyst's proposed update and the published dashboard.

---

## When These Rules Apply

Every proposed grade change must pass through this protocol before it can be published. Grade holds (no change) are exempt from the full protocol but must still pass the source minimum check.

---

## Rule 1: Source Hierarchy Minimum

**A grade change requires at least one source from Tier 1 or Tier 2. Press releases alone cannot move a grade.**

| Tier | Source Type | Examples | Can move a grade alone? |
|---|---|---|---|
| **Tier 1** | Official statistics, independent officers of Parliament, audited data | StatsCan, PBO, OAG, CMHC operational data, Environment Commissioner | Yes |
| **Tier 2** | Independent analysis with disclosed methodology | CCI, C.D. Howe, IRPP, IFSD, Full Fact, academic research | Yes (with Tier 1 context) |
| **Tier 3** | Quality journalism with named sources | CBC, Globe, La Presse, Toronto Star, National Post | Only if corroborated by Tier 1 or 2 |
| **Tier 4** | Government press releases, ministerial statements, PMO announcements | Canada.ca, PMO releases, ministerial speeches | **Never alone.** Context only. |
| **Tier 5** | Social media, partisan commentary, anonymous sources | Twitter/X, partisan blogs, leaked documents without verification | **Never.** Not admissible. |

**The rule:** If the strongest evidence for a grade change is Tier 4 (government announcement), the change is blocked until Tier 1 or 2 evidence is available. No exceptions.

---

## Rule 2: Announcement vs. Implementation

**Announcements are not evidence of performance. The dashboard grades what the government has done, not what it says it will do.**

The implementation ladder:

| Stage | What it means | Can it move a grade? |
|---|---|---|
| **Announced** | Press release, speech, or platform commitment | No |
| **Legislated** | Bill introduced or passed | Partially (introduction = context; passage = evidence) |
| **Authorized** | Treasury Board approval, funds allocated in Estimates | Yes (this is a binding fiscal commitment) |
| **Implemented** | Program operational, funds disbursing, regulations in force | Yes |
| **Outcome observed** | Measurable results confirmed by independent data | Yes (strongest evidence) |

**The rule:** A grade move requires evidence at the "Authorized" stage or higher. Evidence at the "Announced" stage is context only and cannot support a grade change.

**Carry-forward note:** If a claim was already implemented and is being carried forward from a prior cycle rather than newly introduced, apply [docs/v2/verification/Carry-Forward-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/v2/verification/Carry-Forward-Rules.md) to determine whether re-verification is required.

---

## Rule 3: Contradiction with Prior Logic

**If a proposed grade change contradicts the reasoning that produced the current grade, it is blocked unless the contradiction is explicitly resolved.**

**The test:** State the reason the current grade was assigned. State the proposed change. Ask: "Does the proposed change require us to believe something we previously said was not true, even though nothing about that thing has changed?"

If yes → **blocked** until the analyst either:
(a) shows what new evidence changed the underlying condition, or
(b) acknowledges that the prior reasoning was wrong and documents the correction

**Example that fails:** "Housing was graded D because announcements hadn't translated to delivery. We now propose upgrading to C- because of a new announcement." This contradicts the prior logic without new delivery evidence.

**Example that passes:** "Housing was graded D because announcements hadn't translated to delivery. We now propose upgrading to D+ because CMHC data shows starts increased 8% and BCH disbursed first tranche of funds." This provides new delivery evidence that changes the underlying condition.

---

## Rule 4: Confidence Downgrade Discipline

**Confidence can only change when the evidentiary picture changes, not when the analyst is uncomfortable with a hard call.**

Confidence moves **down** when:
- Genuinely new conflicting data appears (not reinterpretation of existing data)
- A key source is retracted, corrected, or disputed by an equally credible source
- Attribution becomes less clear due to new information
- A significant lag between data and decision reduces certainty

Confidence moves **up** when:
- An additional independent source confirms the existing assessment
- A lagged data point arrives and confirms the trajectory
- Attribution is clarified by new evidence

**Confidence does NOT change when:**
- A think tank publishes an opinion that reframes existing data
- Media coverage changes tone without new underlying evidence
- Political pressure increases or decreases
- The analyst is uncertain but the evidence points one direction

**The rule:** Every confidence change must cite the specific new evidence that justifies it. "The picture is murkier" is not sufficient. "Pembina published a report showing the effective OBPS price is $18/t vs. our prior estimate of $20/t, which does not materially change the assessment" → confidence holds. "ECCC published new compliance data showing the OBPS effective price dropped from $20/t to $12/t" → confidence drops (new data, material change).

---

## Rule 5: Multi-Notch Move Protocol

**Grade changes of more than one notch in a single cycle require heightened evidence and approval.**

**One-notch moves** (standard):
- Require at least one Tier 1 or Tier 2 source
- Require at least one metric to cross a rubric threshold
- Standard Analyst → Red Team → Referee process

**Two-notch moves** (heightened):
- Require at least two independent Tier 1 sources
- Require at least two metrics or sub-files to move simultaneously
- Release log must explain why a one-notch move is insufficient
- Referee must explicitly approve the magnitude

**Three-notch moves** (extraordinary):
- Require a major external event or policy reversal
- Require documentation from three independent sources
- Must be flagged as "extraordinary movement" in the release log
- Should be accompanied by a sensitivity note

**Probationary note:** Whole-letter probationary dimensions and plus/minus-collapse mechanics are governed by [docs/Plus-Minus-Decision-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Plus-Minus-Decision-Rules.md). Apply Rule 5 here only after the probationary display/precision rule has been resolved there.

---

## Rule 6: Release Blocking Conditions

**A proposed update is automatically blocked if any of the following conditions exist:**

1. **Single-source dependency:** The entire case rests on one source, regardless of tier
2. **Zero metric movement:** No quantitative indicator has changed in the direction of the proposed grade move
3. **Unresolved double-counting:** The evidence used to justify the change is also being used in another dimension's grade (per the Deconfliction Matrix)
4. **Rubric term misapplication:** The analyst is using a rubric term (e.g., "on paper," "initiated," "delivered") in its everyday meaning rather than its defined dashboard meaning
5. **Unresolved contradiction:** The proposed change contradicts prior cycle reasoning without acknowledgment
6. **Political pressure as evidence:** The case includes arguments about how the dashboard will be perceived rather than what the evidence shows

**Any one of these conditions is sufficient to block.** The block remains until the condition is resolved.

---

## Rule 7: Stakeholder and Political Pressure

**Arguments about perception, reputation, or stakeholder expectations are not scoring evidence and must not appear in the Analyst's case.**

Specifically, the following arguments are inadmissible:
- "Holding the grade will make us look stale"
- "The government will criticize us if we don't acknowledge this"
- "Other trackers have already moved on this"
- "This will generate negative media coverage for the dashboard"
- "We need to show we're responsive to new developments"

The dashboard's job is accuracy. Perception management is a separate function and must not influence scoring.

---

## Process Summary

For every proposed grade change (not grade holds, source-stack-only changes, or probationary precision-only changes):

```
1. Does the evidence meet the Source Hierarchy Minimum? (Rule 1)
   No → BLOCK
   
2. Is the evidence at the Authorized stage or higher? (Rule 2)
   No → BLOCK (announcement only)
   
3. Does the change contradict prior logic? (Rule 3)
   Yes, unresolved → BLOCK
   
4. Is confidence being changed? If so, is there new data? (Rule 4)
   Confidence change without new data → REVISE
   
5. Is this a multi-notch move? (Rule 5)
   Yes → Apply heightened evidence standard
   
6. Are any automatic blocking conditions present? (Rule 6)
   Yes → BLOCK
   
7. Run 3-lane QA: Analyst → Red Team → Referee
   Referee approves, revises, or blocks
   
8. Write release log entry with: evidence, rubric criterion,
   modifier application (if any), confidence level, and date
```

---

## Companion References

- **Claim-level verification mechanics** — [docs/v2/verification/Source-Verification-Protocol.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/v2/verification/Source-Verification-Protocol.md)
- **Carry-forward of previously verified claims** — [docs/v2/verification/Carry-Forward-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/v2/verification/Carry-Forward-Rules.md)
- **Whole-letter probationary and plus/minus interaction** — [docs/Plus-Minus-Decision-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Plus-Minus-Decision-Rules.md)
- **Double-counting and primary-home enforcement** — [docs/Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md)

---

*QA Gatekeeping Rules v1.0 — April 2026*
*Based on simulated monthly update drill, Pack 5 (announcement bias case).*

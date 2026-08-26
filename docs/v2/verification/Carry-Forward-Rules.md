# Carry-Forward Rules

- **Purpose:** Define when a verified claim can carry forward without re-verification.
- **Status:** Active companion rule. QA Gatekeeping Rule 2 invokes it for carry-forward decisions; it does not replace the canonical monthly playbook.
- **Last updated:** 2026-08-26
- **Depends on:** Source-Verification-Protocol.md, Monthly-Operations-Mode.md, Exception-Queue-Definition.md
- **Used by:** QA-Gatekeeping-Rules.md

---

> **Authority note (2026-08-26):** These rules remain in use through the live
> QA gate. They govern carry-forward decisions only. Current cycle sequence and
> close gates live in
> [Monthly-Cycle-Playbook.md](../../Monthly-Cycle-Playbook.md). The tri-lens
> close did not retire this file. See the
> [v2 closure post-mortem](../V2-Tri-Lens-Closure-Post-Mortem-2026-08-25.md).

For this file, the current cycle record is the affected URL row's `Notes` in
`Source-Coverage-Ledger-YYYY-MM.md` plus the dated monthly cycle report for
cycle-level decisions. No separate manifest or verification ledger is created.

## 1. Carry-Forward Allowed

A claim from a prior cycle's closed source-coverage ledger and monthly cycle report carries forward WITHOUT re-verification when ALL five conditions are true:

| # | Condition | How to check |
|---|---|---|
| CF1 | **Source value unchanged.** The source organization has not revised, updated, or corrected the value since the prior cycle. | Check the fetch report "last updated" dates. Check for new data releases from the source. |
| CF2 | **No new contradicting evidence.** No new Tier 1 or Tier 2 source has published evidence that contradicts the claim. | Scan the changed-source list from the fetch report. Skim relevant media/policy sources. |
| CF3 | **No scoring-blocking exception.** The claim does not have an open exception in categories E2 (value mismatch) or E4 (unresolved new metric, if grade-moving). Non-blocking exceptions (E1, E3, E5, E6, E7, E8) do not prevent carry-forward — they are documented and reviewed each cycle. | Check the exception queue. |
| CF4 | **Reference period not stale.** The claim's data has not crossed a staleness threshold since the prior cycle. | PBO projections: >6 months from publication = stale. Quarterly StatsCan: >2 quarters = stale. Annual data: >18 months = stale. Event-driven: valid until superseded. |
| CF5 | **Dashboard display unchanged.** The metric label, value, and time window on the dashboard still exactly match the prior cycle's verified state. | Compare current dimensions.json to the prior cycle's source-coverage ledger row and cycle report. If the dashboard was not edited, this is automatic. |

**If all five conditions hold:** The claim carries forward. The prior cycle's closed source-coverage ledger row and cycle report remain the provenance record.

**Carry-forward is logged in the current cycle record.** Add the applicable CF1-CF5 result to the affected source row's `Notes`. The monthly cycle report records the cycle-level statement: "All claims carried forward from [prior cycle]. Conditions CF1-CF5 confirmed by editor."

---

## 2. Carry-Forward NOT Allowed

A claim must be re-verified (enters the active-cycle verification scope) when ANY of these are true:

| # | Condition | What happens |
|---|---|---|
| **CF-BLOCK-1** | Source value has been revised or updated by the publisher. | New value must be extracted and verified. Update the current source-coverage ledger row's `Notes`, and record any scoring result in the monthly cycle report. The prior verified value is superseded. |
| **CF-BLOCK-2** | New Tier 1 or Tier 2 evidence contradicts or materially changes the claim. | The claim must be re-assessed against the new evidence. Claim status may change. |
| **CF-BLOCK-3** | A scoring-blocking exception (E2 value mismatch, or E4 unresolved new metric if grade-moving) is open on the claim. | The exception must be resolved before the claim can be used in scoring. Non-scoring-blocking exceptions (E5, E7, E8) do not prevent carry-forward but must be documented. |
| **CF-BLOCK-4** | The claim's reference period has crossed a staleness threshold. | The claim must be either updated with newer data or carried forward with a staleness qualifier in the current source row's `Notes` and monthly cycle report. |
| **CF-BLOCK-5** | The dashboard display was edited since the prior cycle (label, value, or time window changed). | The edited claim must be re-verified against the source to confirm the edit was correct. |
| **CF-BLOCK-6** | The editor proposes a grade change for the dimension containing the claim. | ALL claims in that dimension enter re-verification scope — not just the changed claim. A grade change requires full verification of the dimension's evidence base. |

---

## 3. Carry-Forward by Verification Tier

Different verification tiers (from Monthly-Operations-Mode.md Section 7) have different carry-forward profiles:

| Tier | Typical carry-forward? | Re-verification trigger |
|---|---|---|
| **A: Canonical automated** (StatsCan, CMHC, IRCC) | Yes — if fetch script shows no new data release. | New data release appears in fetch report. |
| **B: Canonical manual** (PBO, NATO, Budget docs) | Yes — if no new publication appeared. | New report published. |
| **C: Editorial/derivative** (Flagship status, Promise tallies, trend arrows) | Yes — unless the home dimension's evidence changed. | Home dimension grade changes or new evidence triggers re-assessment. |
| **D: Event-driven** (Fitch, Ethics Commissioner) | Yes — indefinitely until a new event occurs. | New event. |

---

## 4. Carry-Forward and the Exception Queue

When a carried-forward claim has a low-severity or medium non-blocking open exception (E1, E3, E5, E6, E7, E8):

- The claim still carries forward.
- The exception is logged in the affected source row's `Notes` and the monthly cycle report's `Exception Queue` section.
- The exception is reviewed each cycle to determine if severity has changed.
- If severity escalates (e.g., the only corroborating source is withdrawn), the claim must be re-verified.

When a carried-forward claim has a scoring-blocking exception (E2 or E4-if-grade-moving):

- The claim does NOT carry forward.
- It enters the active-cycle verification scope.
- It must be resolved before the claim is used in scoring.

When a carried-forward claim has a medium non-scoring-blocking exception (E4-if-not-grade-moving, E5, E7, E8):

- The claim carries forward for the current cycle.
- The exception is flagged for resolution in the current or next cycle.
- Scoring is not blocked, but the exception must be documented in the affected source row's `Notes` and the monthly cycle report's `Exception Queue` section.

---

## 5. Carry-Forward Expiry

No claim carries forward indefinitely without at least a minimal recheck.

| Maximum carry-forward duration | Applies to | Action at expiry |
|---|---|---|
| **3 cycles (3 months)** | Tier A and B claims (canonical sources) | At the 3rd consecutive carry-forward, the editor must spot-check the source URL and confirm the value still matches. Log the recheck in the current source row's `Notes`. This is a 1-minute check, not a full re-verification. |
| **6 cycles (6 months)** | Tier C and D claims (editorial/event-driven) | At the 6th consecutive carry-forward, the editor must review whether the editorial assessment or event-driven status still reflects current reality. Log the review in the current source row's `Notes` and monthly cycle report. |
| **No expiry** | Exception queue items | Low-severity exceptions can be carried indefinitely as long as they are reviewed each cycle and severity has not changed. |

---

## 6. Decision Tree

```
Is there a new data release for this metric?
├── Yes → CF-BLOCK-1. Re-verify.
└── No → Does new evidence contradict the claim?
          ├── Yes → CF-BLOCK-2. Re-verify.
          └── No → Is there an active scoring-blocking exception (E2 or E4-if-grade-moving)?
                    ├── Yes → CF-BLOCK-3. Resolve before scoring.
                    └── No → Is the reference period stale?
                              ├── Yes → CF-BLOCK-4. Update or qualify.
                              └── No → Was the dashboard display edited?
                                        ├── Yes → CF-BLOCK-5. Re-verify the edit.
                                        └── No → Is a grade change proposed for this dimension?
                                                  ├── Yes → CF-BLOCK-6. Full dimension re-verification.
                                                  └── No → **CARRY FORWARD.** Log in the current cycle record.
```

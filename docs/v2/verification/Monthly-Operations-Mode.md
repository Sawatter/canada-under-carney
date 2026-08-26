# Monthly Operations Mode

- **Purpose:** Preserve the proposed monthly model and define verification tiers still cited by Carry-Forward-Rules.md.
- **Status:** Section 7 is an active companion reference for carry-forward tier definitions. All other sections are historical operations design and do not govern the current cycle.
- **Last updated:** 2026-08-26
- **Depends on:** Source-Verification-Protocol.md, Carry-Forward-Rules.md, Exception-Queue-Definition.md
- **Used by:** Carry-Forward-Rules.md for verification tier definitions

---

> **Authority note (2026-08-26):** Section 7 supplies the tier definitions used
> by `Carry-Forward-Rules.md`. This file does not replace or add close gates to
> [Monthly-Cycle-Playbook.md](../../Monthly-Cycle-Playbook.md). Its broader
> operations model is retained as design history. See the
> [v2 closure post-mortem](../V2-Tri-Lens-Closure-Post-Mortem-2026-08-25.md).

## 1. Cycle Types

Every monthly cycle is one of two types. Determine which at the start of the cycle.

| Type | Definition | Verification scope | Time target |
|---|---|---|---|
| **Quiet cycle** | No dimension has new grade-moving evidence. All metrics hold. No new or escalated blocking exceptions. (Carried-forward non-blocking exceptions E1, E3, E5, E6, E7, E8 are permitted.) | Carry forward all verified claims. Changed-source scan only. No new ledger rows required. | 20-30 min total (v1 + verification) |
| **Active cycle** | At least one dimension has new grade-moving evidence, a triggered exception, or a proposed grade change. | Full verification for moved dimensions. Carry forward for held dimensions. New ledger rows for new claims. | Historical estimate: 45-75 min total. The closed v2 shadow work is excluded from current operations. |

**How to determine cycle type:** After running the data fetch script and scanning the source monitoring stack, answer: "Did any primary metric change, did any event-driven trigger fire, or did any exception escalate to blocking severity (E2 or E4-if-grade-moving)?" If yes → active cycle. If no (including when only low-severity non-blocking exceptions E1, E3, E5, E6, E7, E8 are carried forward with unchanged severity) → quiet cycle.

---

## 2. What Gets Re-Verified Every Month

These items are checked every cycle regardless of type:

| Item | Check | Method |
|---|---|---|
| **Source accessibility** | Are the primary source URLs for pilot dimensions still live? | Spot-check top 5-6 canonical sources (StatsCan tables, CMHC, PBO, NATO, Global Affairs). If any returns an error, log to exception queue. |
| **Metric currency** | Have any primary metrics been updated by their source since last cycle? | Check the fetch report output. Compare "last updated" dates against the prior cycle's manifest. |
| **Event-driven sources** | Has a new event occurred for Fitch, Ethics Commissioner, or other event-driven items? | Manual scan of news/agency sites. If no event → carry forward. If event → active cycle for that dimension. |
| **Exception queue** | Are there any open items from the prior cycle? | Review Exception-Queue-Definition.md carryover items. Resolve or carry forward with justification. |

**Everything else carries forward** per Carry-Forward-Rules.md.

---

## 3. What Gets Carried Forward

A verified claim from a prior cycle carries forward without re-verification when ALL of these are true:

1. The source value has not been revised or updated
2. No new evidence contradicts the claim
3. No exception is active on the claim
4. The claim's reference period has not become stale per staleness rules
5. The metric label, value, and time window on the dashboard still match the prior-cycle verification

If all five conditions hold → carry forward. No new ledger row needed. The prior cycle's ledger entry remains the verification record.

If any condition fails → the claim enters the active-cycle verification scope. See Carry-Forward-Rules.md for full rules.

---

## 4. What Only Gets Rechecked When Triggered

These items do NOT get re-verified monthly. They are rechecked only when a specific trigger fires.

| Item | Trigger | Action when triggered |
|---|---|---|
| **Fitch rating** | New Fitch action or statement about Canada | Verify the new rating/outlook. Update metric and sourceNote. Log in ledger. |
| **Ethics Commissioner review** | Ethics Commissioner publishes a review | Verify the content. Update Ethics & Transparency dimension. Log in ledger. |
| **IRCC primary page (403)** | IRCC restores the levels plan page | Re-attempt verification of PR target from primary source. Update sourceNote if confirmed. |
| **Methodology docs** | A scoring rule, rubric threshold, or deconfliction assignment is changed | Update the relevant methodology doc. Check whether any dashboard metric or rationale text needs to change as a result. |
| **Historical v2 architecture** | Not an operational trigger | Any restart is a new design project under the closure post-mortem. Historical files do not direct current cycle work. |

---

## 5. Grade-Moving Claims vs Non-Blocking Residuals

### Grade-moving claim

A claim is grade-moving if changing its value or status could plausibly cause a grade to change under the rubric. These require full verification before scoring.

**Examples:**
- Housing starts crossing the 280K D/C threshold
- PBO fiscal-anchor assessment changing materially, including anchors no longer assessed as on track
- NATO spending falling below 2%
- US export share reversing above 75%

### Non-blocking residual

A residual is a known minor gap that does not affect the current grade and does not present a false fact to users. These can be carried forward indefinitely as long as they remain low-severity.

**Current residuals (as of March 2026 freeze):**
- IRCC primary page returns 403 (PR target corroborated by PBO and Tier 2 sources)
- IRCC aggregate decline figures (-53%, -60%) sourced from media reporting of IRCC data, not a single clean IRCC table

**Rule:** A residual becomes an exception if its severity changes — e.g., if a corroborating source is withdrawn or contradicted.

---

## 6. Publishing a Hold Without Full Re-Litigation

A cycle can be published as a hold (all grades unchanged) without full re-verification when:

1. The cycle is a quiet cycle (no new grade-moving evidence)
2. All carry-forward conditions are met for all dimensions
3. No active exceptions are blocking
4. The changed-source scan found no new primary data releases
5. The editor confirms: "I have reviewed the fetch report and source scan. No dimension has new evidence that would trigger a grade change."

This confirmation is logged in the cycle's manifest header under Notes. It replaces the full ledger process for quiet cycles.

**A hold cycle still requires:**
- An evidence-pack manifest (can be minimal — "no new sources beyond carry-forward")
- The editor's confirmation statement
- The exception queue review (even if empty)

**A hold cycle does NOT require:**
- New ledger rows
- Full source extraction
- Claim normalization
- Anti-loss checks on unchanged text

---

## 7. Verification Tiers in Operations Mode

Not all metrics require the same verification depth every cycle. Use these tiers:

| Tier | Applies to | Monthly action | Full verification when |
|---|---|---|---|
| **A: Canonical automated** | StatsCan tables, CMHC starts, IRCC open data | Fetch script checks for new data. If value changed, verify the new value. If unchanged, carry forward. | Value changes or source is revised. |
| **B: Canonical manual** | PBO reports, NATO annual report, Budget documents | Check if a new publication appeared in the cycle window. If no → carry forward. If yes → verify the new publication. | New publication appears. |
| **C: Editorial/derivative** | Flagship Delivery status, Promise Delivery tallies, federal-provincial coordination, trend arrows | Re-assess only when underlying home-dimension evidence changes. | Home dimension grade changes or new evidence triggers re-assessment. |
| **D: Event-driven** | Fitch rating, Ethics Commissioner, court decisions | No routine check. Triggered by external event only. | Event occurs. |

---

## 8. Transition from Remediation to Operations

The March 2026 cycle is the baseline reference. All claims verified in the March cycle carry forward into May 2026 unless a carry-forward condition fails.

The remediation-era workflow (baseline audit → ledger for every claim → full re-verification) is replaced by the operations-mode workflow (carry forward verified claims → verify only what changed → log exceptions → publish).

**What does NOT carry over from remediation:**
- The expectation that every claim needs a new ledger row every cycle
- The expectation that all dimensions need full verification every cycle
- The expectation that the entire dashboard is re-audited monthly

**What DOES carry over:**
- The verification protocol rules (blocking conditions, claim statuses, match requirements)
- The evidence-pack manifest requirement (one per cycle, even if minimal)
- The exception queue discipline
- The scoring-safe handoff rule (only verified or carried-forward claims enter scoring)

# Exception Queue Definition

- **Purpose:** Define the exception categories used by Carry-Forward-Rules.md.
- **Status:** Active companion definition for carry-forward exceptions. It does not define the current cycle sequence or close gate.
- **Last updated:** 2026-08-26
- **Depends on:** Source-Verification-Protocol.md, Monthly-Operations-Mode.md
- **Used by:** Carry-Forward-Rules.md

---

> **Authority note (2026-08-26):** These categories remain in use where
> `Carry-Forward-Rules.md` cites them. Current unresolved source work and cycle
> close gates live in
> [Monthly-Cycle-Playbook.md](../../Monthly-Cycle-Playbook.md). The tri-lens
> close did not retire this file. See the
> [v2 closure post-mortem](../V2-Tri-Lens-Closure-Post-Mortem-2026-08-25.md).

Each current exception is recorded in the affected source-coverage ledger row's
`Notes` and in the dated monthly cycle report's `Exception Queue` section.

## Exception Categories

| # | Category | Description | Severity | Blocks scoring? | Blocks publication? | Review by | Resolution |
|---|---|---|---|---|---|---|---|
| E1 | **Source inaccessible** | A source URL returns an error, is paywalled, or content has been removed. | Medium if primary metric. Low if context-only. | Yes if the claim is grade-moving for a dimension under active assessment. No if the dimension is held. | No — the prior-cycle verification stands. Publish with carry-forward. | Editor | Attempt alternate URL. If unresolvable, carry forward the prior-cycle verified value with a note. Escalate if the source was the ONLY verification for a grade-moving claim. |
| E2 | **Value mismatch** | Dashboard value does not match the source value after a new release. | High | Yes — always. | Yes — until corrected. | Editor | Correct the dashboard value. Log the correction in changelog.json. If the correction changes a grade, apply QA grade-change rules. |
| E3 | **Stale event-driven source** | An event-driven metric (Fitch, Ethics Commissioner) has not been rechecked in >6 months and the dashboard still presents it as current. | Low | No | No | Editor (next cycle) | Add a staleness note to the sourceNote. Recheck the source. If unchanged, carry forward with updated access date. |
| E4 | **Unresolved new primary metric** | A new Tier 1 data release is available but has not been reviewed and entered in the cycle record. | High if grade-moving. Medium otherwise. | Yes if grade-moving. | No. A hold may publish for that dimension while the metric is reviewed. | Editor + source protocol | Apply the claim checks in Source-Verification-Protocol.md, record the result in the current source-coverage ledger, and adjudicate it under QA-Gatekeeping-Rules.md. Do not route it into the historical v2 handoff. |
| E5 | **Transformation needs documentation** | A metric value on the dashboard derives from a calculation, but the transformation method is not documented in a sourceNote. | Medium | No — existing verified value stands. | No | Editor (next cycle) | Document the transformation method in the sourceNote. |
| E6 | **Wording more certain than evidence** | A rationale, status line, or metric label makes a claim that is stronger than what the verified evidence supports. | Low-Medium | No | No — unless the wording is materially misleading. | Editor | Soften the wording. Log the change. |
| E7 | **Methodology drift risk** | The live dashboard metric set or language has diverged from current governing methodology, including Canonical-Scoring-Sheets.md, Scoring-Rubric-v1.1.md, or QA-Gatekeeping-Rules.md, without a documented decision. Historical design artifacts do not govern live data. | Medium | No | No, unless the drift affects a grade. | Editor | Either update the current methodology through its required gates or revert the dashboard to match the current methodology. Document the resolution. |
| E8 | **Source revised after cycle close** | A source included in a prior cycle's evidence set is revised by the publisher after the cycle was published. | Medium if revision is material. Low if minor. | No (applies to next cycle). | No (already published). | Editor (next cycle) | Log the revision in the next cycle's source-coverage ledger row `Notes` and monthly cycle report. If the revision changes a verified value, re-verify and correct if needed. |

---

## Exception Lifecycle

```
Exception identified
    ↓
Categorized (E1-E8)
    ↓
Severity assigned (High / Medium / Low)
    ↓
Blocking status determined (blocks scoring? blocks publication?)
    ↓
If blocking → resolve before scoring/publication
If non-blocking → carry forward with justification
    ↓
Resolution logged (in source-coverage ledger Notes and monthly cycle report)
    ↓
Closed — or — carried to next cycle
```

---

## Exception Queue Format

Each cycle's exception queue is logged in the dated monthly cycle report under a section titled `Exception Queue`. The affected source row's `Notes` carries the same category, status, resolution, or fallback. Format:

| # | Category | Dimension | Claim/metric | Severity | Blocking? | Status | Resolution / carry-forward note |
|---|---|---|---|---|---|---|---|
| 1 | E1 | Immigration | PR target IRCC page 403 | Low | No | Carried forward | Corroborated by PBO and Tier 2 sources. Will recheck if IRCC restores URL. |

---

## Historical Example: Carried-Forward Exceptions from March 2026

| # | Category | Dimension | Item | Severity | Note |
|---|---|---|---|---|---|
| 1 | E1 | Immigration | IRCC levels plan page returns 403 | Low | PR target 380,000 corroborated by PBO RP-2526-025-S, EY, Clark Hill. Not blocking. |
| 2 | E1 | Immigration | IRCC aggregate decline figures (-53%, -60%) sourced from media reporting | Low | IRCC open data portal URLs cited. Specific Jan-Sep aggregate is a media-reported figure, inherent to IRCC's publication method. Not blocking. |

These were the only open exceptions entering May 2026. This table is retained as a historical example, not as the current exception queue. Current exceptions live in the source-coverage ledger and dated monthly cycle report.

# Exception Queue Definition

- **Purpose:** Define what enters the monthly exception queue, how each category is handled, and whether it blocks scoring or publication.
- **Status:** Active — governs all cycles from May 2026 onward.
- **Last updated:** 2026-04-16
- **Depends on:** Source-Verification-Protocol.md, Monthly-Operations-Mode.md
- **Used by:** Monthly-Cycle-Checklist.md, Carry-Forward-Rules.md

---

## Exception Categories

| # | Category | Description | Severity | Blocks scoring? | Blocks publication? | Review by | Resolution |
|---|---|---|---|---|---|---|---|
| E1 | **Source inaccessible** | A source URL returns an error, is paywalled, or content has been removed. | Medium if primary metric. Low if context-only. | Yes if the claim is grade-moving for a dimension under active assessment. No if the dimension is held. | No — the prior-cycle verification stands. Publish with carry-forward. | Editor | Attempt alternate URL. If unresolvable, carry forward the prior-cycle verified value with a note. Escalate if the source was the ONLY verification for a grade-moving claim. |
| E2 | **Value mismatch** | Dashboard value does not match the source value after a new release. | High | Yes — always. | Yes — until corrected. | Editor | Correct the dashboard value. Log the correction in changelog.json. If the correction changes a grade, apply QA grade-change rules. |
| E3 | **Stale event-driven source** | An event-driven metric (Fitch, Ethics Commissioner) has not been rechecked in >6 months and the dashboard still presents it as current. | Low | No | No | Editor (next cycle) | Add a staleness note to the sourceNote. Recheck the source. If unchanged, carry forward with updated access date. |
| E4 | **Unresolved new primary metric** | A new Tier 1 data release is available but has not been verified and entered in the ledger. | High if grade-moving. Medium otherwise. | Yes if grade-moving. | No — can publish a hold for that dimension while the metric is verified. | Editor + verification protocol | Run verification workflow Steps V3-V8 for the new metric. |
| E5 | **Transformation needs documentation** | A metric value on the dashboard derives from a calculation, but the transformation method is not documented in a sourceNote. | Medium | No — existing verified value stands. | No | Editor (next cycle) | Document the transformation method in the sourceNote. |
| E6 | **Wording more certain than evidence** | A rationale, status line, or metric label makes a claim that is stronger than what the verified evidence supports. | Low-Medium | No | No — unless the wording is materially misleading. | Editor | Soften the wording. Log the change. |
| E7 | **Methodology drift risk** | The live dashboard metric set or language has diverged from the governing methodology docs (Canonical-Scoring-Sheets.md, Pilot-Templates.md, etc.) without a documented decision. | Medium | No | No — unless the drift affects a grade. | Editor | Either update the methodology to bless the change, or revert the dashboard to match the methodology. Document the resolution. |
| E8 | **Source revised after cycle close** | A source included in a prior cycle's evidence pack is revised by the publisher after the cycle was published. | Medium if revision is material. Low if minor. | No (applies to next cycle). | No (already published). | Editor (next cycle) | Log the revision in the next cycle's manifest as a post-cutoff amendment. If the revision changes a verified value, re-verify and correct if needed. |

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
Resolution logged (in manifest notes, ledger, or exception log)
    ↓
Closed — or — carried to next cycle
```

---

## Exception Queue Format

Each cycle's exception queue is logged in the manifest under a section titled "Exception Queue." Format:

| # | Category | Dimension | Claim/metric | Severity | Blocking? | Status | Resolution / carry-forward note |
|---|---|---|---|---|---|---|---|
| 1 | E1 | Immigration | PR target IRCC page 403 | Low | No | Carried forward | Corroborated by PBO and Tier 2 sources. Will recheck if IRCC restores URL. |

---

## Current Carried-Forward Exceptions (from March 2026)

| # | Category | Dimension | Item | Severity | Note |
|---|---|---|---|---|---|
| 1 | E1 | Immigration | IRCC levels plan page returns 403 | Low | PR target 380,000 corroborated by PBO RP-2526-025-S, EY, Clark Hill. Not blocking. |
| 2 | E1 | Immigration | IRCC aggregate decline figures (-53%, -60%) sourced from media reporting | Low | IRCC open data portal URLs cited. Specific Jan-Sep aggregate is a media-reported figure, inherent to IRCC's publication method. Not blocking. |

These are the only open exceptions entering May 2026. Both are low-severity, non-blocking, and well-documented.

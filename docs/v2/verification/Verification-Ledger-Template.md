# Verification Ledger Template

- **Purpose:** Reusable ledger for recording the verification status of every metric and claim used in a monthly scoring cycle. One row per atomic claim. This is the audit trail.
- **Status:** Draft — first version for pilot cycle use.
- **Last updated:** 2026-04-15
- **Depends on:** Source-Verification-Protocol.md (claim status categories, match status, quality criteria), Evidence-Pack-Manifest-Template.md (each entry references a manifest source)
- **Used by:** Verification-Workflow.md (filled out during verification steps), Shadow-Run-Workflow.md (verification must be complete before scoring)

---

## How to use this template

1. Copy this file to `docs/v2/verification/ledgers/[YYYY-MM]-ledger.md` at the start of each cycle.
2. One row per atomic, verifiable claim. Break complex statements into individual claims per the claim normalization step (Verification-Workflow.md Step 4).
3. Fill in fields left-to-right during the verification process: source fields first, then dashboard fields, then match/claim status, then scoring decision.
4. Every claim that enters scoring must have a completed ledger row. No exceptions.
5. The ledger is append-only during a cycle. Do not delete rows. If a claim is superseded, update its status and add a note.

---

## Ledger Table

### Full verification (grade-moving claims on pilot dimensions)

| # | Dimension | Claim (atomic) | Evidence role | Manifest ref | Source org | Source tier | Pub date | Access date | Ref period | Rev status | Source label (verbatim) | Source value (verbatim) | Source excerpt / snapshot | Dashboard label | Dashboard value | Match status | Transform method | Claim status | Verification certainty | Human review | Safe for scoring | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | | | | | | | | | | | | | | | | | | | | | | |
| 2 | | | | | | | | | | | | | | | | | | | | | | |

### Lighter review (held dimensions, no grade change)

| # | Dimension | Claim (atomic) | Source org | Source tier | Ref period | Rev status | Source value | Dashboard value | Match status | Claim status | Safe for scoring | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | | | | | | | | | | | | |

---

## Field Definitions

### Identification fields

| Field | Definition | Required? |
|---|---|---|
| **#** | Sequential row number for this cycle. | Always |
| **Dimension** | Which dashboard dimension this claim serves (e.g., Immigration, Fiscal Health, Defence). | Always |
| **Claim (atomic)** | The specific, verifiable assertion. One claim per row. Must be self-sufficient — understandable without context. Must be normalized — no compound assertions. | Always |

### Evidence role

| Field | Definition | Required? |
|---|---|---|
| **Evidence role** | How this claim is used in scoring. Options: `primary` (grade-moving), `secondary context` (informational, not grade-moving), `blocked` (excluded per deconfliction or lens rules). | Full verification |

### Source fields

| Field | Definition | Required? |
|---|---|---|
| **Manifest ref** | Row number from the Evidence-Pack-Manifest for this source (e.g., "Manifest #3"). Links the ledger entry to the evidence pack. | Full verification |
| **Source org** | Publishing organization (e.g., Statistics Canada, PBO, CMHC). | Always |
| **Source tier** | Tier 1-5 per QA-Gatekeeping-Rules.md. | Always |
| **Pub date** | Publication date of the source document or data release. | Full verification |
| **Access date** | Date the editor accessed the source for this cycle. | Full verification |
| **Ref period** | Time period the data covers (e.g., "March 2026", "Q4 2025", "FY 2025-26"). | Always |
| **Rev status** | Revision status: `preliminary` / `revised` / `final` / `unknown`. | Always |

### Verbatim source capture

| Field | Definition | Required? |
|---|---|---|
| **Source label (verbatim)** | The exact label used in the source for this metric. Copy-paste from source. Do not paraphrase. (e.g., "Housing starts, seasonally adjusted at annual rates") | Full verification |
| **Source value (verbatim)** | The exact numeric value from the source. Copy-paste. Include unit. (e.g., "259,028 units", "4.1%", "$78.3 billion") | Full verification |
| **Source excerpt / snapshot** | For mutable sources (press releases, news articles, dynamic web pages): the exact quoted text, saved PDF path, or Internet Archive URL used to verify this claim. For stable sources (StatsCan tables with table numbers): "N/A — stable table." This field is what allows a later reviewer to reconstruct exactly what was seen at verification time. | Required for mutable sources; "N/A — stable table" for canonical statistical tables |

### Dashboard capture

| Field | Definition | Required? |
|---|---|---|
| **Dashboard label** | The label currently shown on the dashboard card for this metric. | Full verification |
| **Dashboard value** | The value currently shown on the dashboard card. | Full verification |

### Verification fields

| Field | Definition | Required? |
|---|---|---|
| **Match status** | Relationship between source and dashboard. Options: `exact match` / `transformed-valid` / `mismatch`. See Source-Verification-Protocol.md Section 3. | Always |
| **Transform method** | If match status is transformed-valid: describe the calculation. Must be reproducible. (e.g., "YoY: (104.2 - 103.1) / 103.1 = 1.07%"). If not applicable: "N/A". | When transformed |
| **Claim status** | One of: `supported` / `unsupported` / `transformed-valid` / `context-only` / `contradicted` / `unverifiable` / `stale` / `mismatch`. See Source-Verification-Protocol.md Section 2. | Always |
| **Verification certainty** | How confident the verifier is in the match and claim status assignment. Options: `high` (source is canonical, value is unambiguous, label matches cleanly), `medium` (source is clear but label requires interpretation or value required transformation), `low` (source is ambiguous, label match is uncertain, or multiple valid readings exist). **If certainty is `low`, mandatory human review is triggered.** | Always |
| **Human review** | `no` if model verification was sufficient. `yes — [reason]` if mandatory human review was triggered. See Source-Verification-Protocol.md Section 13 for trigger list. Triggers include: certainty = low. | Always |
| **Safe for scoring** | `yes` (only if claim status is Supported or Transformed-valid AND no unresolved human review). `no` (all other cases). | Always |

### Notes

| Field | Definition | Required? |
|---|---|---|
| **Notes** | Any context: transformation details, staleness qualifiers, human review results, ambiguity flags, supersession notes. | As needed |

---

## Claim Normalization Guide

Each row must contain exactly one atomic, verifiable claim. Use these rules to break compound statements:

### Split these

| Compound statement | Split into |
|---|---|
| "Housing starts fell to 259K and federal spending declined 56%" | Row 1: "Housing starts were 259,028 in 2025 (CMHC)." Row 2: "Federal housing spending declines 56% by 2028-29 (PBO)." |
| "The deficit nearly doubled to $78.3B, driven primarily by defence spending" | Row 1: "Federal deficit was $78.3B in FY 2025-26 (PBO)." Row 2: "Deficit increased from approximately $42B in prior year." Row 3: "Defence spending was a primary driver of deficit increase (PBO attribution)." |
| "US export share declined from 73% to 71.7%, with non-US exports up 17.2%" | Row 1: "US share of Canadian merchandise exports was 71.7% in 2025 (StatsCan 12-10-0176-01)." Row 2: "Non-US exports increased 17.2% in 2025 (StatsCan 12-10-0176-01)." |

### Do not split these

| Atomic claim | Why it stays together |
|---|---|
| "Housing starts were 259,028 in 2025 (CMHC, table 34-10-0158-01)" | Single metric, single source, single time period. |
| "PBO projects 7.5% probability of meeting deficit targets (PBO RP-2526-017-S)" | Single projection, single source. |
| "NATO confirmed Canada's defence spending reached 2.0% of GDP in 2025" | Single confirmation, single source. |

### Quality check for each claim

Before entering a claim in the ledger, verify:

- [ ] **Entailment:** Is this claim fully supported by the source? (not partially, not inferentially)
- [ ] **Self-sufficiency:** Can this claim be understood without referring to other rows or context?
- [ ] **Context preservation:** Does this claim preserve all critical qualifiers from the source?
- [ ] **Ambiguity:** If multiple valid readings exist, is this flagged for human review?
- [ ] **Purity:** Is this a verifiable factual claim, not an editorial judgment?

---

## Minimum Viable Ledger (first cycle)

For the first pilot cycle, the minimum viable ledger scope is:

**Full verification required for:**
- All grade-moving claims on the 5 pilot dimensions (Immigration, Housing Supply, Fiscal Health, Defence, Trade Diversification)
- All top-line dashboard values (GPA, headline grades, promise counts)
- Any claim whose value changed since the last cycle

**Lighter review acceptable for:**
- Held dimensions with no new evidence and no grade change
- Context-only claims
- Promise Tracker entries (status changes still need evidence-role verification)

**Estimated effort:** 15-25 minutes for full verification of pilot dimensions (approximately 20-30 grade-moving claims). 5-10 minutes for lighter review of held dimensions.

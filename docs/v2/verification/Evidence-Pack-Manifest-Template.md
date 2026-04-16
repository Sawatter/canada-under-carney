# Evidence Pack Manifest Template

- **Purpose:** Reusable template for logging the exact set of sources that constitute the scoring evidence for each monthly cycle. One manifest per cycle.
- **Status:** Draft — first version for pilot cycle use.
- **Last updated:** 2026-04-15
- **Depends on:** Source-Verification-Protocol.md (Section 15, evidence-pack boundary rules)
- **Used by:** Verification-Workflow.md (Step 1: evidence-pack assembly), Verification-Ledger-Template.md (each ledger entry references this manifest)

---

## How to use this template

1. Copy this file to `docs/v2/verification/evidence-packs/[YYYY-MM]-manifest.md` at the start of each cycle.
2. Fill in all fields during the evidence-pack assembly step (Verification-Workflow.md Step 1).
3. Complete the manifest BEFORE any scoring decisions begin.
4. The manifest is append-only after cutoff — do not remove entries. Add post-cutoff notes as amendments.

---

## Manifest Header

| Field | Value |
|---|---|
| **Cycle** | [YYYY-MM, e.g., 2026-05] |
| **Assembled by** | [Name] |
| **Assembly date** | [YYYY-MM-DD] |
| **Cutoff date and time** | [YYYY-MM-DD HH:MM local time. No source published after this timestamp is included.] |
| **Reviewed by** | [Name, or "self-reviewed" if single editor] |
| **Review date** | [YYYY-MM-DD] |
| **Notes** | [Any cycle-specific notes — e.g., "PBO spring report not yet published; expected mid-May"] |

---

## Included Sources

One row per source document or data release used for scoring in this cycle.

| # | Organization | Document title | URL | Publication date | Access date | Reference period | Version / vintage | Snapshot status | Snapshot location | Tier | Dimensions served | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | | | | | | | | | | | | |
| 2 | | | | | | | | | | | | |
| 3 | | | | | | | | | | | | |

### Field definitions

| Field | Definition |
|---|---|
| **Organization** | The publishing organization (e.g., Statistics Canada, PBO, CMHC, NATO). |
| **Document title** | The specific document, table, or release (e.g., "Table 18-10-0004-01: Consumer Price Index, monthly"). |
| **URL** | Direct URL to the source. Must be specific enough that a reviewer can navigate to the exact data. |
| **Publication date** | Date the source was published or last updated by the organization. |
| **Access date** | Date the editor accessed the source for this cycle. |
| **Reference period** | The time period the data covers (e.g., "March 2026", "Q4 2025", "FY 2025-26", "Calendar year 2025"). |
| **Version / vintage** | If the source has a version number, edition, or revision identifier, record it. If not applicable, write "N/A". |
| **Snapshot status** | How the source content was preserved. Options: `live page` (accessed but not archived), `local excerpt` (key values quoted in ledger), `archived copy` (Internet Archive or local PDF), `downloaded file` (CSV/XLSX/PDF saved locally). |
| **Snapshot location** | Where the preserved content can be found. For `local excerpt`: "see ledger rows #X-Y." For `archived copy`: Internet Archive URL or local file path. For `downloaded file`: local file path (e.g., `verification/snapshots/2026-05/pbo-fiscal-outlook.pdf`). For `live page`: "N/A — live access only." This field is what allows a later reviewer to access the exact content used at verification time. |
| **Tier** | Source tier per QA-Gatekeeping-Rules.md (1-5). |
| **Dimensions served** | Which dashboard dimensions this source provides evidence for. |
| **Notes** | Any relevant context — e.g., "preliminary release, revision expected June", "replaces March version". |

---

## Excluded Sources

Sources that were considered but excluded from this cycle's evidence pack.

| # | Organization | Document title | Reason for exclusion |
|---|---|---|---|
| 1 | | | |
| 2 | | | |

### Valid exclusion reasons

| Reason | Example |
|---|---|
| **Published after cutoff** | "PBO report published May 16, after May 14 cutoff." |
| **Paywall prevents verification** | "C.D. Howe report behind subscriber wall. Cannot verify claims." |
| **Superseded by newer release** | "March 2026 StatsCan release superseded by April 2026 release." |
| **Below source tier threshold** | "Blog post is Tier 5. Not admissible per QA rules." |
| **Not relevant to pilot dimensions** | "Report covers provincial healthcare, not federal policy." |
| **Inaccessible / broken link** | "URL returns 404 as of access date." |

---

## Post-Cutoff Amendments

If anything changes after the cutoff, log it here. Do not modify the included/excluded tables above — add amendments below.

| # | Date | Amendment type | Detail | Action taken |
|---|---|---|---|---|
| 1 | | | | |

### Amendment types

| Type | Definition | Action |
|---|---|---|
| **Source corrected** | A source in the pack was revised or corrected by the publisher after cutoff. | Note the correction. If material (would change a score), editor may reopen verification for that claim. If minor, carry to next cycle. |
| **Late source added** | A critical Tier 1 source became available after cutoff but before publication. | Add with justification. Must be a Tier 1 release that would change a score. Log the reason for exception. |
| **Source removed** | A source in the pack was removed from the web after the pack was assembled. | The manifest entry stands as the audit record. Note the removal date. |
| **Access error discovered** | A source value logged in the ledger was found to be incorrect after assembly. | Correct the ledger entry. Log old and new values. If scoring was affected, treat as a correction per Source-Verification-Protocol.md Section 14. |

---

## Sign-Off

| Role | Name | Date | Confirmation |
|---|---|---|---|
| Pack assembler | | | "I confirm that all sources in this manifest were accessed and their values were logged in the verification ledger before scoring began." |
| Reviewer (if applicable) | | | "I confirm that I reviewed the manifest for completeness, exclusion justifications, and post-cutoff amendments." |

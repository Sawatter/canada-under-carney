# Verification Gap Review

- **Purpose:** Assess what is still missing or risky in the current verification layer. Identify weak spots, mandatory manual review areas, and what should be added in future versions.
- **Status:** Draft — first assessment, to be updated after first live cycle.
- **Last updated:** 2026-04-15
- **Depends on:** Source-Verification-Protocol.md, Evidence-Pack-Manifest-Template.md, Verification-Ledger-Template.md, Verification-Workflow.md, DATA-SOURCES.md, Canonical-Scoring-Sheets.md
- **Used by:** Open-Design-Decisions.md (for tracking verification design decisions)

---

## 1. Source Stack Weak Spots

### 1a. Sources with highest verification risk

| Source | Risk | Why | Mitigation |
|---|---|---|---|
| **Government press releases (PMO, Finance)** | High — Tier 4, announcement bias | These are the most common source of overclaiming. A press release can frame a commitment as implementation. | Source-Verification-Protocol.md blocks Tier 4 from moving any lens. QA Rule 2 enforces the implementation ladder. But the verification workflow must explicitly check that press release language does not leak into dashboard text unchecked. |
| **Dynamic web pages (Housing Infrastructure Canada, IRCC program pages)** | High — mutable, no versioning | Content can change without notice. A program page that said "4,000 units announced" could later say "6,000 units" without a version trail. | Mandatory human review for dynamic pages. Evidence-pack manifest requires snapshot status. But there is no automated archival mechanism yet — this is a gap. |
| **Paywalled sources (some C.D. Howe, some academic)** | Medium — model cannot verify | If Claude cannot access the source, it cannot confirm the claim. | Mandatory human review. But if the editor also cannot access, the claim stays Unverifiable. |
| **Bank economist / pollster reports** | Medium — Tier 3 equivalent, interpretation-heavy | These are useful context but should not be primary evidence. Risk: they get treated as Tier 2 because the institution sounds authoritative. | Ledger requires explicit tier assignment. But tier enforcement is manual — no automated check. |
| **OBPS effective carbon price** | Medium — no single canonical source | The headline rate ($95/t) is legislated, but the effective rate (~$20/t) is estimated from market data. Different sources give different effective rates. | Measure-Selection-Rules.md specifies using the effective rate, but the source for the effective rate is not as clean as other canonical sources. This requires careful documentation each cycle. |

### 1b. Source gaps

| Gap | Impact | Recommendation |
|---|---|---|
| **No automated link check** | Broken URLs will not be caught unless manually checked. | Add `markdown-link-check` or equivalent to the repo CI pipeline. Not critical for first cycle but should be added for v0.2. |
| **No automated source archival** | When a source page changes or disappears, the audit trail depends on the ledger's logged values, not on an archived copy. | Consider Internet Archive integration or local PDF download for grade-moving sources. Not critical for first cycle but a real gap for long-term auditability. |
| **No automated value extraction validation** | The fetch script extracts values, but there is no automated check that the extracted value matches the source table. | The workflow requires spot-checking. Full automation is a v1.0 item. |

---

## 2. Dimensions Most Vulnerable to Mismatch or Hallucination

### Risk ranking by dimension

| Risk | Dimension | Primary vulnerability | Reason |
|---|---|---|---|
| **High** | Trade Diversification | Label/time-window mismatch | Monthly vs annual trade data mixing. Measure-Selection-Rules.md explicitly warns about this. The v1 dashboard has already had this issue flagged. |
| **High** | Affordability Response | Label mismatch | "Food purchased from stores" vs "food prices" vs "average retail prices." The wrong label was used in v1 and had to be corrected. This is the dimension most likely to suffer from lossy summarization. |
| **High** | Ethics & Transparency | Overclaim / unsupported interpretation | The evidence is qualitative, event-driven, and politically charged. Claims about "adequate disclosure" or "novel requirements" are inherently interpretive. Two raters could disagree by a full letter grade. Every claim here should be treated as interpretive, requiring corroboration. |
| **Medium** | Fiscal Health | Transformation error | The deficit figure is canonical, but many dashboard claims involve transformations: YoY change, debt service vs GST comparison, deficit as % GDP. Each transformation must be documented and reproducible. |
| **Medium** | Housing Supply | Stage mismatch | "Announced" vs "started" vs "completed" is a known confusion vector. The 7-stage pipeline label (Announced → Introduced → Passed → Authorized → Disbursing → Delivering → Completed) must be enforced in every housing claim. |
| **Medium** | Defence | Overclaim on capability | Spending data is canonical (NATO report). But claims about "defence capability" or "readiness" go beyond what spending data entails. The v2 Outcome lens for Defence is thin on evidence — this is where overclaiming is most likely. |
| **Lower** | Immigration | Relatively clean | High federal attribution (90%), canonical sources (StatsCan, IRCC), quarterly data cycle. The main risk is mixing IRCC operational counts with StatsCan population estimates — already flagged in Measure-Selection-Rules.md. |
| **Lower** | Major Projects, Carbon Pricing, Climate | Standard risks | Normal verification risks, no exceptional vulnerabilities beyond what the protocol already covers. |

---

## 3. Where Manual Review Is Still Unavoidable

These areas cannot be fully verified by the model and will require human judgment indefinitely:

| Area | Why | Minimum human requirement |
|---|---|---|
| **Grade assignment** | Grades are editorial judgments per the rubric, not mechanical calculations (except Flagship Delivery's Combination Rule). | Human assigns all grades. Model may propose, but human decides. |
| **Trend arrows** | Directional judgments requiring assessment of trajectory, not just current level. | Human assigns all trend arrows. |
| **Interpretive claims in rationale text** | Claims like "adequate response," "sharpest contraction," "proved failure" are inherently editorial. | Human reviews all interpretive language in rationale text. Model can flag interpretive claims but cannot validate them alone. |
| **Paywalled or access-restricted sources** | Model cannot access content it cannot see. | Human must verify claims from paywalled sources. If human also cannot access, claim is Unverifiable. |
| **Ambiguous policy text** | When a government announcement or policy document allows multiple valid readings. | Human selects the most defensible reading and logs the reasoning. |
| **Promise status changes** | Whether a promise has moved from "In Progress" to "Delivered" or "Stalled" involves judgment about what constitutes delivery. | Human assigns all promise status changes. |

---

## 4. Where the Protocol Is Heaviest (Skip Risk)

These are the parts of the verification workflow most likely to be skipped under time pressure:

| Step | Skip risk | Why | Consequence if skipped |
|---|---|---|---|
| **V4: Claim normalization** | High | Breaking compound statements into atomic claims is tedious. Editors will be tempted to verify compound claims as a unit. | Compound claims may contain one supported fact and one unsupported overclaim bundled together. The overclaim enters scoring undetected. |
| **V6: Anti-loss check** | Medium | Checking every qualifier against the source is painstaking, especially for rationale text that was written months ago. | Dropped qualifiers persist in dashboard text. A "preliminary" label gets lost. A "monthly" figure gets treated as annual. |
| **V3: Verbatim extraction** | Medium | Copy-pasting exact labels from sources feels redundant when you "know" the value. | Paraphrased labels introduce subtle mismatches. "Housing starts" becomes "new homes built." "Food purchased from stores" becomes "grocery prices." |
| **V7: Human review routing** | Low (but high impact) | Most cycles will have 0-3 human review items. The temptation is to resolve them informally without logging. | Informal resolution leaves no audit trail. If a dispute arises later, there is no record of how the judgment was made. |

**Mitigation:** The minimum viable scope (Verification-Workflow.md) explicitly distinguishes non-negotiable steps from deferrable ones. The non-negotiable core takes ~35-45 minutes and should not be reduced further.

---

## 5. Assessment Against IMF DQAF Five Dimensions

The IMF Data Quality Assessment Framework assesses statistical products across five dimensions. Applying these to the Canada Under Carney dashboard as a statistical product:

| DQAF dimension | Current status | Gap | Priority |
|---|---|---|---|
| **Integrity** | Medium. The dashboard has published methodology, source hierarchy, and editorial ownership disclosure. No commercial or political affiliation. But no formal independence mechanism — it is ultimately one editor's judgment. | No second scorer. No external audit mechanism beyond the simulated methods board audit. | Medium. Inter-rater reliability test is listed as a handoff brief item (before June). |
| **Methodological soundness** | Strong. Published rubric (v1.1), canonical scoring sheets, 12 methodology documents, measure selection rules, deconfliction matrix. Methodology is more documented than most comparable projects. | The methodology is strong for an accountability scorecard. It is not yet strong enough for a KPI/OKR system — which is why v2 exists. | Low for v1. The methodology is already the project's strongest asset. |
| **Accuracy / reliability** | Medium. Tier 1 sources are used. QA gatekeeping rules exist. But until now, there has been no formal source verification protocol. The verification layer being built here is the fix. | The verification layer is the gap this entire package addresses. Before this package, accuracy relied on the editor's diligence rather than on a documented protocol. | High. This is why we are building this. |
| **Serviceability** | Medium-strong. Monthly update cadence. Dashboard is live and auto-deploys. Data is downloadable (Raw Data button). Changelog exists. | No formal revision policy for the dashboard itself (only for sources). No notification mechanism for readers when a correction is made. | Medium. Should add a visible corrections log to the dashboard in a future cycle. |
| **Accessibility** | Strong. Public dashboard. Methodology published. About tab explains principles. Source links in cards. Raw data downloadable. GitHub repo is public. | No API for programmatic access to scores. No machine-readable metadata standard. | Low. These are nice-to-haves, not verification gaps. |

---

## 6. Repo-Level Anti-Hallucination Policy

**Recommendation:** Add a `VERIFICATION.md` file to the project root as a persistent constraint for AI sessions working in this repo.

**Proposed content:**

```markdown
# Verification Policy

This repository uses a formal source verification protocol.

When working on scoring, data, or dashboard content:

1. Do not invent values, labels, dates, citations, or source URLs.
2. Do not present a paraphrased or summarized claim as if it were a verbatim source quote.
3. Do not drop critical qualifiers (preliminary/revised, monthly/annual, target/actual, federal/general government).
4. Do not use a source value without recording it in the verification ledger.
5. Do not score a claim unless it has passed verification with status Supported or Transformed-valid.
6. If a source is inaccessible, the claim is Unverifiable. Do not guess.
7. If a value does not match between source and dashboard, it is a Mismatch. Do not rationalize.

Protocol: docs/v2/verification/Source-Verification-Protocol.md
Workflow: docs/v2/verification/Verification-Workflow.md
```

**Status:** Recommendation, not yet implemented. This should be added after the first live cycle confirms the verification protocol works.

Origin: HALLUCINATE.md and GUARDRAILS.md patterns — persistent repo-level enforcement files. Adapted from anti-hallucination norm to project-specific verification policy.

---

## 7. What Should Be Added in Future Versions

### v0.2 (after 2-3 cycles)

| Addition | Reason | Effort |
|---|---|---|
| Automated link checking in CI pipeline | Catch broken source URLs before they cause Unverifiable claims. | Low — existing GitHub Action (`markdown-link-check`). |
| Visible corrections log on the dashboard | EFCSN requires public corrections record. Currently corrections are in changelog.json but not prominently displayed. | Medium — add a Corrections tab or section to the About page. |
| Pre-filled ledger from fetch script | The fetch script already extracts values. It should output a draft ledger with source fields populated, reducing manual extraction effort. | Medium — extend `fetch-data.py`. |

### v1.0 (after 6+ cycles)

| Addition | Reason | Effort |
|---|---|---|
| Automated value verification against StatsCan tables | The fetch script should compare extracted values against dashboard values and flag mismatches automatically. | High — requires structured data comparison logic. |
| Source archival integration (Internet Archive or local snapshots) | Mutable sources need durable snapshots for auditability. | Medium — could use Internet Archive API or local PDF download. |
| Inter-rater verification test | A second scorer independently verifies a subset of claims. Required for full DQAF accuracy/reliability compliance. | High — requires a second trained scorer. |
| Machine-readable verification metadata | Structured metadata attached to each dashboard metric linking to its verification ledger entry. | High — requires data model extension. |

---

## Recommended Minimum Verification Scope for the First Live Cycle

**Must do (non-negotiable):**

1. Assemble an evidence-pack manifest listing all sources used for the cycle.
2. Full verification (ledger rows) for all grade-moving claims on the 5 pilot dimensions:
   - Immigration
   - Housing Supply
   - Fiscal Health
   - Defence
   - Trade Diversification
3. Full verification for any metric whose value changed in any dimension.
4. Anti-loss check on all dashboard text that was modified this cycle.
5. Human review for any triggered mandatory cases.

**Can defer to later cycles:**
- Full verification of held dimensions (lighter review acceptable)
- Verification of context-only claims
- Verification of Promise Tracker entries (unless a status changed)
- Automated link checking
- Source archival

**Estimated additional time:** 35-45 minutes beyond the existing v1 + v2 workflow.

---

## First 3 Implementation Tasks

### Task 1: Create the folder structure

Create these directories if they don't exist:
- `docs/v2/verification/evidence-packs/`
- `docs/v2/verification/ledgers/`

These will hold the cycle-specific manifests and ledgers.

**Effort:** 1 minute.

### Task 2: Populate the first evidence-pack manifest

Using the existing `data/dimensions.json` and `scripts/output/fetch-report.txt`, populate the first manifest with all sources currently cited in the dashboard. This creates the baseline evidence pack that the first live cycle will update from.

**Effort:** 20-30 minutes.

### Task 3: Run a retroactive verification pass on the 5 pilot dimensions

Using the existing dashboard values and the sources cited in `data/dimensions.json`, fill in verification ledger rows for the ~20-30 grade-moving claims on the pilot dimensions. This creates the baseline ledger and tests whether the protocol is operationally workable before the first live cycle.

**Effort:** 30-45 minutes.

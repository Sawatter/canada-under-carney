# Non-Pilot Hygiene Review — March 2026

- **Purpose:** Credibility-risk sweep of 8 non-pilot dimensions. Identify obvious unresolved, unsupported, stale, mislabeled, or weakly sourced public-facing claims.
- **Status:** Complete.
- **Date:** 2026-04-15
- **Scope:** Targeted review, not a full source audit. Read-only against governing methodology docs.

---

## Major Projects

**Status: Clean — no action needed.**

All metrics are appropriately labeled as manual sources. The $116B figure is correctly qualified as "mostly pre-existing." The credit-claiming penalty is explicitly documented. The rationale correctly distinguishes institutional capacity from project outcomes. Sources include both government and critical assessments (Fraser Institute, Angus Reid). No superlatives or overclaims detected.

---

## Economic Policy Response

**Status: Minor cleanup — one wording check.**

- The "OECD projects Canada last among 38 members" claim (rationale) and "Last of 38" metric are strong characterizations. This appears to be sourced from OECD data but the specific OECD publication/year is not cited in the sources array or metric sourceNote. **Issue type: source-chain gap (minor).** The claim is widely reported and likely accurate, but the specific OECD projection document should be cited.
- The "OECD projects Canada dead last through 2060" in critics text is a stronger form of the same claim. "Through 2060" is a very specific long-range claim that should be traceable to a specific OECD report.
- "$18.5B across 56 partnerships" (critical minerals) — manual source, no URL. The $18.5B figure appears in both metrics and promise text. Widely reported but not linked to a specific source document.
- Everything else is appropriately qualified.

---

## Affordability Response

**Status: Needs metric correction — Food CPI value mismatch.**

- **CRITICAL:** The dashboard shows `Food CPI (stores, Feb 2026) = 5.4%`. But the StatsCan February 2026 CPI daily release (verified in this session from manifest source #1, https://www150.statcan.gc.ca/n1/daily-quotidien/260316/dq260316a-eng.htm) states verbatim: "Food purchased from stores rose **4.1%** in February following a 4.8% increase in January." The dashboard value of 5.4% does not match the verified source. **Issue type: label/value mismatch.** This must be corrected.
- The metric label correctly says "Food CPI (stores, Feb 2026)" which matches the Measure-Selection-Rules.md requirement to use "food purchased from stores" not "average retail prices." The label is right; the value is wrong.
- The $307 grocery benefit and $17,572/yr family food cost are manual/PBO/Dalhousie sources — not verifiable in this sweep but appropriately attributed.
- ~10M food insecure Canadians (PROOF) — annual source, appropriately labeled.

---

## Carbon Pricing Policy

**Status: Clean — no action needed.**

The dimension correctly distinguishes consumer elimination (delivered) from industrial preservation (delivered with caveats). The CCI critique of effective vs headline OBPS price (~$20 vs $95) is properly sourced. The deconfliction between this dimension (instrument handling) and Climate & Environment (emissions framework) is clean. All metrics are appropriately labeled. No superlatives or overclaims detected.

---

## Climate & Environment

**Status: Minor cleanup — one superlative and one stale check.**

- The status line says "One of largest environmental policy reversals in Canadian history." This is a strong historical superlative. It is directionally supported by the evidence (emissions cap suspended, EV mandate repealed, ECCC budget cut $1.3B, tree planting halved) but "in Canadian history" is an interpretive claim that would require two-source corroboration per the verification protocol. **Issue type: wording overreach (minor).** Consider softening to "Major environmental policy reversals" without the historical superlative.
- The inherited context says "Most comprehensive climate framework in Canadian history" — same historical superlative pattern. Directionally supportable but not verified against historical comparison.
- `previousGrade: "D+"` — this is a real evidence-driven downgrade, not a display precision change. Appropriate to keep visible.
- ECCC budget cuts "$1.3B cumulative" — manual source, no URL. The source for this figure should ideally be cited. The Conversation article in the sources list discusses Arctic science cuts but may not be the source for the $1.3B cumulative figure.
- "840+ positions" ECCC job losses — appears in rationale but source is not cited in the metrics or sources array.

---

## Ethics & Transparency

**Status: Clean — no action needed.**

The dimension is appropriately on probation with whole-letter grade. All claims are correctly qualified ("no public evidence demonstrates self-dealing," "assessed as a single construct"). The metrics correctly show event-driven manual states (Ethics Commissioner review: not published, Brookfield interests: not fully disclosed). The confidence tag is Medium (lowest in framework) which is appropriate. The `previousGrade: null` fix from earlier in this session is correctly applied. The `gpaValue: 1.7` override is consistent with the Launch Recommendation.

---

## Flagship Delivery

**Status: Clean — no action needed.**

The dimension is appropriately on probation with whole-letter grade. The Combination Rule status distribution (2 of 5 delivering, 3 of 5 stalled) is correctly presented. The `gpaValue: 1.7` override is consistent. The `previousGrade: null` fix is correctly applied. The "11 of 26" bills passed metric is from LEGISinfo — a reasonable source though specific URL is not in the sources array. The "Weak (Policy Options)" federal-provincial coordination metric is an editorial characterization sourced to Policy Options, which is Tier 2. Acceptable.

---

## Promise Delivery

**Status: Clean — no action needed.**

Correctly excluded from GPA (`excludeFromGPA: true`). The 14/44 and 12/44 counts are manual tallies — inherently editorial but appropriate for an accountability tracker. The "Scaled back from 500K/yr" and "Largely reversed" are characterizations, not data claims — appropriate for a derivative accountability dimension. The previously flagged "first time since Confederation" language has already been corrected to "Population declined by 102,436 in 2025 (StatsCan, preliminary)."

---

## Summary Table

| Dimension | Risk level | Action needed | Issue type |
|---|---|---|---|
| Major Projects | None | None | — |
| Economic Policy Response | Low | Source OECD ranking claim; cite minerals $18.5B source | Source-chain gap |
| **Affordability Response** | **Medium** | **Correct Food CPI from 5.4% to 4.1% (Feb 2026 verified)** | **Label/value mismatch** |
| Carbon Pricing Policy | None | None | — |
| Climate & Environment | Low | Soften "in Canadian history" superlatives; cite ECCC $1.3B and 840+ positions sources | Wording overreach + source-chain gap |
| Ethics & Transparency | None | None | — |
| Flagship Delivery | None | None | — |
| Promise Delivery | None | None | — |

---

## Counts

| Status | Count | Dimensions |
|---|---|---|
| Clean | 5 | Major Projects, Carbon Pricing, Ethics, Flagship Delivery, Promise Delivery |
| Minor cleanup | 2 | Economic Policy (source-chain), Climate (wording + source-chain) |
| Needs metric correction | 1 | Affordability Response (Food CPI mismatch) |

---

## 5 Most Important Non-Pilot Credibility Risks

1. **Affordability Response Food CPI: 5.4% on dashboard vs 4.1% at source.** This is the only confirmed value mismatch in the non-pilot set. The StatsCan February 2026 release says "food purchased from stores rose 4.1%." The dashboard shows 5.4%. Must be corrected.

2. **Climate "one of largest environmental policy reversals in Canadian history."** Strong superlative without verified historical comparison. Low-risk because the characterization is directionally supported, but it sets a precedent for unverified historical claims.

3. **Economic Policy "OECD projects Canada dead last through 2060."** Strong claim in critics text without specific OECD publication citation. Low-risk in the critics section (which is explicitly attributed) but should have a traceable source.

4. **Climate ECCC budget cuts "$1.3B cumulative" and "840+ positions."** Both appear in rationale without direct source URLs. The figures are likely real but the source chain is incomplete.

5. **Economic Policy critical minerals "$18.5B across 56 partnerships."** Government figure without primary URL. Widely reported but source chain gap.

---

## Recommendation

**Do one small non-pilot cleanup pass before calling the full dashboard March-clean.**

The Affordability Response Food CPI mismatch (5.4% vs 4.1%) is a confirmed value error on a displayed primary metric. It should not remain in a frozen reference cycle. The other items are low-severity source-chain gaps and wording choices that could be addressed in the next cycle.

Minimum required fix: correct the Food CPI value from 5.4% to 4.1%.

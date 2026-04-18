# Source Verification Protocol

- **Purpose:** Define what must be verified before a metric, claim, or fact is safe to use in v1 scoring or v2 shadow scoring. This is the rules file. The workflow is in Verification-Workflow.md.
- **Status:** Draft — first version for pilot cycle use.
- **Last updated:** 2026-04-18
- **Depends on:** QA-Gatekeeping-Rules.md, Measure-Selection-Rules.md, Deconfliction-Matrix.md, DATA-SOURCES.md, Scoring-Rubric-v1.1.md, Source-Authority-Map.md
- **Used by:** Verification-Workflow.md, Verification-Ledger-Template.md, Evidence-Pack-Manifest-Template.md, Shadow-Run-Workflow.md, MONTHLY-UPDATE-GUIDE.md

---

## 1. Conservative Default (blocking condition)

**If label, value, unit, or time window cannot be reconciled cleanly between the source and the dashboard, the fact does not move the score.**

This is not a guideline. It is a blocking condition. A fact that fails verification stays out of scoring until the issue is resolved. The editor may still record it in the ledger as context, but it cannot be marked "safe for scoring."

Origin: EFCSN Code of Standards (evidentiary support required for all pertinent factual statements); project QA-Gatekeeping-Rules.md Rule 6 (automatic blocking conditions).

---

## 2. Claim Status Categories

Every fact entered in the verification ledger must be assigned exactly one claim status.

| Status | Meaning | Safe for scoring? |
|---|---|---|
| **Supported** | Claim is fully entailed by a cited primary source. The source label, value, unit, and time window all match. | Yes |
| **Unsupported** | Source is accessible and relevant, but the claim is not fully entailed. The claim overclaims, adds causal interpretation, drops a qualifier, or extends beyond what the source actually says. | **No — blocked** |
| **Transformed-valid** | Claim derives from the source via a documented, reproducible calculation (e.g., SAAR conversion, YoY change, share calculation). The transformation method is recorded in the ledger. | Yes |
| **Context-only** | Claim is real and verified, but not grade-moving for this lens or dimension per deconfliction or lens assignment rules. | No (display only) |
| **Contradicted** | Claim directly conflicts with what the cited source says. | **No — blocked** |
| **Unverifiable** | Source is inaccessible, broken, paywalled, or content is ambiguous enough that multiple valid readings exist. | **No — blocked** |
| **Stale** | Source exists but reference period is too old per staleness rules (Section 8). | **No — blocked** |
| **Mismatch** | Label, value, unit, or time window in the dashboard does not match what the source actually says. | **No — blocked** |

**Only Supported and Transformed-valid claims are safe for scoring.** All other statuses are blocked or context-only.

Origin: OpenAI Guardrails (supported/unsupported/contradicted classification); Microsoft Claimify (entailment, self-sufficiency); project-specific additions for stale, mismatch, and context-only.

---

## 3. Match Status Categories

Match status describes the data-level relationship between what the source says and what the dashboard shows. It is separate from claim status.

| Match status | Meaning |
|---|---|
| **Exact match** | Dashboard label, value, unit, and time window are identical to the source. |
| **Transformed-valid** | Dashboard value derives from the source via a documented calculation. The transformation is reproducible and the method is logged. |
| **Mismatch** | Dashboard label, value, unit, or time window differs from the source in a way that is not explained by a valid transformation. |

**Relationship to claim status:** A claim can have an exact match status but still be context-only (e.g., the value matches but the metric is deconflicted to a different dimension). Match status is about the data. Claim status is about the scoring decision.

---

## 4. Primary-Source-First Rule

**Rule:** Use the original statistical release or official document as the primary source. Do not cite a media report, think tank summary, or AI-generated interpretation as the primary source when the original is available.

**Operational application:**

| Claim type | Primary source | Acceptable? |
|---|---|---|
| StatsCan data value | StatsCan table with table number | Yes — canonical |
| PBO fiscal projection | PBO publication with report ID | Yes — canonical |
| CMHC housing starts | CMHC data table | Yes — canonical |
| NATO spending % GDP | NATO Secretary General Annual Report | Yes — canonical |
| IRCC immigration data | IRCC open data CSV or levels plan | Yes — canonical |
| Media report citing StatsCan | The media report | **No — go to StatsCan table** |
| Think tank interpreting PBO | The think tank report | Acceptable as secondary context, not as primary |
| AI summary of a source | The AI output | **Never — go to the source** |

**Exception:** When the primary source is paywalled, access-restricted, or no longer available, a secondary source may be used if: (a) the secondary source is Tier 1 or Tier 2 per QA-Gatekeeping-Rules.md, (b) the secondary source directly quotes the primary value, and (c) the claim is flagged for mandatory human review.

Origin: IFCN Principle 2 (use primary sources where available; explain secondary source use); EFCSN Article 2.H (name all sources); project QA-Gatekeeping-Rules.md Rule 1 (source hierarchy).

---

## 5. Canonical Metric Verification vs Interpretive Claim Corroboration

Not all claims require the same verification depth.

### 5a. Canonical metric verification (single source sufficient)

A single authoritative source is sufficient when the claim is a direct value from an official statistical release. The value either matches or it does not. Two-source corroboration is not required for raw value verification.

**Canonical sources for this project:**

| Metric type | Canonical source | Table/endpoint |
|---|---|---|
| Food CPI | Statistics Canada | 18-10-0004-01 |
| Employment/unemployment | Statistics Canada | 14-10-0287-01 |
| Population estimates | Statistics Canada | 17-10-0009-01 |
| Housing starts | CMHC via StatsCan | 34-10-0158-01 |
| Trade by country | Statistics Canada | 12-10-0176-01 |
| GDP per capita | Statistics Canada | 36-10-0104-01 |
| Defence spending % GDP | NATO Annual Report / World Bank | MS.MIL.XPND.GD.ZS |
| Federal deficit | PBO or Finance Canada Fiscal Monitor | Per publication |
| PR admissions | IRCC Open Data | Monthly CSV |

**Verification requirement:** Confirm the value in the dashboard matches the source value, the label matches the source label, the reference period matches, and the revision status is noted (preliminary / revised / final).

### 5b. Interpretive claim corroboration (two sources required)

Two or more sources are required when the claim involves interpretation, comparison, characterization, or judgment that goes beyond what a single data point entails.

**Examples requiring corroboration:**

| Claim type | Example | Why two sources |
|---|---|---|
| Superlative | "worst in the G7" | Requires comparative data across countries |
| Historical | "first decline since Confederation" | Requires historical baseline data |
| Characterization | "sharpest contraction in modern history" | Requires comparison to prior contractions |
| Adequacy judgment | "adequate response" | Requires independent assessment |
| Causal attribution | "driven by tariff costs" | Requires causal evidence beyond correlation |
| Trend claim | "sustained improvement" | Requires at least 2 consecutive data points |

**Verification requirement:** Identify at least two independent Tier 1 or Tier 2 sources that support the claim. If only one source supports the interpretive claim, the claim status is Unsupported until a second source is found or the language is revised to match what one source actually says.

Origin: IFCN Principle 2 (verify key claim elements against multiple named sources); EFCSN (minimum two sources for central claims).

---

## 6. Label / Value / Time-Window Matching

For every metric used in scoring, the following must match between source and dashboard:

| Field | Source | Dashboard | Must match? |
|---|---|---|---|
| **Label** | Verbatim label from source (e.g., "Housing starts, seasonally adjusted at annual rates") | Label shown on dashboard card | Must match in substance. Minor formatting differences acceptable. Substantive label differences (e.g., "stores" vs "all food") = mismatch. |
| **Value** | Exact numeric value from source | Value shown on dashboard card | Must match exactly, or transformation must be documented. |
| **Unit** | Unit as stated in source (e.g., "thousands", "%", "$B") | Unit on dashboard | Must match. |
| **Time window** | Reference period from source (e.g., "December 2025", "Q4 2025", "FY 2025-26") | Time reference on dashboard | Must match. Cannot mix monthly and annual without explicit labeling. |

**Known high-risk label mismatches from project history:**
- Food CPI: must use "food purchased from stores" (CPI basket), NOT "average retail prices." Source: Measure-Selection-Rules.md.
- Defence spending: must use NATO-confirmed % GDP, not domestic government claim. Source: Measure-Selection-Rules.md.
- Trade data: cannot mix annual diversification figures alongside monthly figures without labeling time window. Source: Measure-Selection-Rules.md.
- Housing starts: cannot mix SAAR and annual actual totals without labeling. Source: Measure-Selection-Rules.md.

**If any of these fields cannot be reconciled, the claim status is Mismatch and it is blocked from scoring.**

Origin: Statistics Canada Quality Guidelines (reference period discipline, concept definitions); Measure-Selection-Rules.md (project-specific metric specifications).

---

## 7. Transformation Rules

A transformation is any operation that changes a source value before it appears on the dashboard or in a scoring rationale.

### 7a. When transformation is allowed

A transformation is valid when:
1. The source value is verified as exact match to the original
2. The transformation method is standard and reproducible (e.g., YoY calculation, SAAR conversion, percentage share calculation)
3. The transformation method is documented in the verification ledger
4. A reader with access to the source could reproduce the dashboard value

### 7b. When transformation is blocked

A transformation is blocked when:
1. The source value itself is not verified
2. The transformation method is not documented
3. The transformation combines values from two or more separate sources without documenting both sources
4. The transformation involves editorial judgment (e.g., "adjusting for context") rather than arithmetic

### 7c. Common valid transformations

| Transformation | Example | Documentation required |
|---|---|---|
| Year-over-year change | CPI 104.2 → 103.1 = -1.1% YoY | Both values, both reference periods, calculation |
| Share calculation | US exports $X / total exports $Y = Z% | Both values, source table, reference period |
| SAAR conversion | Monthly starts × 12 × seasonal factor | Raw monthly value, seasonal adjustment source |
| Subtraction / difference | Deficit changed from $42B to $78.3B = +$36.3B | Both values, both reference periods |

### 7d. Mandatory human review for multi-source transformations

Any transformed claim that combines values from two or more separate sources (e.g., comparing StatsCan data to IRCC data, or combining PBO projections with Finance Canada actuals) requires mandatory human review before it can be marked safe for scoring.

Origin: Statistics Canada Quality Guidelines (comparability across sources); Microsoft Claimify (context preservation, ambiguity flagging).

---

## 8. Preliminary / Revised / Stale Data Handling

### 8a. Revision status

Every metric must carry a revision tag:

| Tag | Meaning | Scoring rule |
|---|---|---|
| **Preliminary** | First release, subject to revision | Safe for scoring with qualifier. Dashboard must label as preliminary. |
| **Revised** | Updated from a prior release | Safe for scoring. Log the revision: old value, new value, revision date. |
| **Final** | No further revisions expected | Safe for scoring. |
| **Unknown** | Revision status not determinable | Flag for manual review. |

**Revision logging rule:** When a previously used value is revised by the source, the correction must be logged visibly — not silently absorbed. The verification ledger records the old value, the new value, the revision date, and whether the revision changed any score.

### 8b. Staleness rules

| Source type | Staleness threshold | Action when stale |
|---|---|---|
| PBO fiscal projections | >6 months from publication date | Must qualify with publication date on dashboard. Flag in ledger. |
| StatsCan quarterly data (population, GDP) | >2 quarters old | Flag as stale. May use with qualifier if no newer data exists. |
| Annual data (R&D spending, emissions, food insecurity) | >18 months old | Flag as stale. May use with qualifier. Note: annual data is inherently lower-frequency; staleness does not block scoring if no newer release exists. |
| Event-driven data (credit ratings, Ethics Commissioner) | No fixed staleness | Valid until superseded by a new event. |

**Stale data that is the most recent available:** If a source is stale but no newer release exists, it may be used with a staleness qualifier in the ledger and on the dashboard. The claim status is Supported (with staleness note), not Stale. Stale status is reserved for cases where a newer release exists but was not used.

Origin: Statistics Canada Quality Guidelines (timeliness); project Measure-Selection-Rules.md (PBO staleness rule); IMF DQAF (serviceability dimension — timeliness and periodicity).

---

## 9. Mutable Source and Snapshot Rules

### 9a. The problem

Many government and news pages are not immutable. PDFs get replaced, tables get revised, web pages get updated without version indicators. A later reviewer may not see the same content the scorer saw.

### 9b. Snapshot requirements

| Source type | Snapshot requirement |
|---|---|
| StatsCan data tables | Access date recorded. Table number recorded. For grade-moving claims: exact value at access time logged in ledger. StatsCan tables carry their own revision metadata — record the "last updated" date from the table page. |
| PBO PDF reports | Access date recorded. Report ID recorded. If PBO replaces a PDF, the old version may not be recoverable — record the exact values used. |
| CMHC data | Access date recorded. For grade-moving claims: exact value logged. |
| Government press releases (PMO, Finance, IRCC) | Access date recorded. URL recorded. Press releases are generally stable but can be removed. For grade-moving claims: quote the specific text used. |
| News articles | Access date recorded. URL recorded. For grade-moving claims: quote the specific passage used (within fair-use limits). |
| Dynamic web pages with no version control | Flag for mandatory human review. Record access date, URL, and exact content used. Consider Internet Archive snapshot. |

### 9c. Post-access source changes

| Scenario | Action |
|---|---|
| Source value is revised after access but before publication | Update the ledger with the revised value. If the revision changes the claim status or score, log the change as a correction. |
| Source page is removed after access | The logged ledger entry (with access date and exact value) stands as the audit record. Flag in notes. |
| Source PDF is replaced with updated version | Treat as a revision. Log old and new values. Use the newer version for scoring. |

Origin: AP verification practice (verification as workflow); Full Fact (corrections discipline); GUARDRAILS.md pattern (append-only logging).

---

## 10. Inaccessible or Broken Sources

| Scenario | Action |
|---|---|
| Source URL returns 404 or error | Claim status = Unverifiable. Blocked from scoring. Attempt to find source via alternative URL or Internet Archive. |
| Source is paywalled | Claim status = Unverifiable unless the editor can access and verify. Flag for mandatory human review. |
| Source is behind institutional login | Claim status = Unverifiable unless verified by a human with access. Flag for mandatory human review. |
| Source exists but the specific table/page cannot be located | Claim status = Unverifiable. Blocked from scoring. |
| Source organization has reorganized URLs | Attempt to find new URL. If found, update the ledger. If not, treat as broken. |

**Rule:** An unverifiable source cannot support a grade-moving claim. Period.

Origin: IFCN Principle 2 (source identification with links for replication).

---

## 11. Claim Quality Criteria

Every grade-moving claim must pass these five quality tests before entering scoring. These are adapted from Microsoft Claimify's quality framework for the context of a policy dashboard.

| Criterion | Test | Failure action |
|---|---|---|
| **Entailment** | Is the claim fully supported by the cited source text? Not partially, not inferentially — fully. | If not fully entailed → status = Unsupported |
| **Self-sufficiency** | Can the claim be understood on its own, without referring back to the source or surrounding context? | If ambiguous standalone → revise the claim language |
| **Context preservation** | Does the claim preserve the critical qualifiers from the source (see Section 12)? | If qualifiers dropped → blocked. Status depends on the nature of the loss: Contradicted (meaning changed), Mismatch (scope/unit changed), or Unsupported (precision weakened). See Section 12 table. |
| **Ambiguity flagging** | If the source allows multiple valid interpretations, has this been surfaced rather than silently resolved? | If ambiguous → flag for mandatory human review |
| **Completeness / purity** | Does the claim capture the verifiable content without adding subjective interpretation? | If interpretation added → separate the verifiable claim from the editorial judgment |

Origin: Microsoft Claimify (2025) — five quality criteria for claim extraction. Adapted from LLM output validation to policy dashboard source verification.

---

## 12. Anti-Loss Summarization Rule

**Rule:** If a source fact is summarized or paraphrased for use on the dashboard or in a scoring rationale, the summary must preserve all critical qualifiers.

**Critical qualifiers (blocking if dropped):**

| Qualifier type | Example of loss | Consequence |
|---|---|---|
| Revision status | Source says "preliminary estimate" → dashboard drops "preliminary" | Unsupported until corrected |
| Time granularity | Source gives monthly figure → dashboard presents as annual without labeling | Mismatch |
| Jurisdictional scope | Source says "general government" → dashboard says "federal" | Mismatch |
| Product definition | Source says "food purchased from stores" → dashboard says "food prices" | Mismatch |
| Measurement type | Source gives "target" → dashboard presents as "actual" | Contradicted |
| Data status | Source gives "forecast" → dashboard presents as "observed" | Contradicted |
| Implementation stage | Source says "authorized" → dashboard says "implemented" | Unsupported |
| Seasonal adjustment | Source gives "unadjusted" → dashboard uses as if seasonally adjusted | Mismatch |

**If a summary drops a critical qualifier, the claim is blocked from scoring until corrected.** The specific claim status depends on the nature of the loss — see the Consequence column above. Dropping a qualifier that changes the meaning of the value (target → actual, forecast → observed) is a Contradiction. Dropping a qualifier that changes the scope or unit (monthly → annual, stores → all food) is a Mismatch. Dropping a qualifier that weakens precision without changing meaning (dropping "preliminary") is Unsupported. All three are blocking conditions.

Origin: CLEF CheckThat! 2025 (claim normalization — preserving verifiable content); Google FACTS Grounding (grounding accuracy — claims must be supported by supplied documents); project-specific qualifier list from Measure-Selection-Rules.md and Canonical-Scoring-Sheets.md.

---

## 13. Mandatory Human Review Cases

Model-only verification is insufficient for these cases. Human review is required before a claim can be marked safe for scoring.

| # | Trigger | What the reviewer must check | Documentation |
|---|---|---|---|
| 1 | Grade-moving claim based on a paywalled or access-restricted source | That the source actually says what the claim says. Reviewer must have access to the source. | Log: "Human verified [date]. Source confirmed at [URL]. Value: [X]." |
| 2 | Label/value mismatch on a primary metric for a pilot dimension | Whether the mismatch is a genuine error or an acceptable variation. | Log: "Mismatch reviewed [date]. Resolution: [corrected / accepted with note / blocked]." |
| 3 | Ambiguous interpretation of policy text with multiple valid readings | Which reading is most defensible. Flag the ambiguity in the scoring rationale. | Log: "Ambiguity reviewed [date]. Selected reading: [X]. Alternative reading: [Y]. Reason: [Z]." |
| 4 | Transformed claim combining values from 2+ separate sources | That the combination is valid, the sources are compatible, and the transformation is documented. | Log: "Multi-source transformation reviewed [date]. Sources: [A, B]. Method: [X]. Confirmed valid / blocked." |
| 5 | Contradiction between newly verified source value and existing dashboard language | Whether the dashboard language needs correction or the new source is anomalous. | Log: "Contradiction reviewed [date]. Resolution: [dashboard corrected / source anomaly noted / blocked]." |
| 6 | Claim based on a dynamic web page with no stable versioning | That the content at access time is recorded and the claim is accurately captured. | Log: "Dynamic source reviewed [date]. Content snapshot: [method]. Confirmed / blocked." |
| 7 | Verification certainty is `low` (recorded in ledger) | The specific match or interpretation that is uncertain. A `low` certainty means the source is ambiguous, the label match is uncertain, or multiple valid readings exist. The verifier must assign a certainty of `high`, `medium`, or `low` for every claim; `low` automatically triggers human review. | Log: "Low-certainty match reviewed [date]. Resolution: [confirmed / corrected / blocked]. Certainty upgraded to [high/medium] or claim blocked." |

**If the reviewer disagrees with the model's assessment:** The reviewer's judgment overrides. The disagreement is logged in the ledger notes with the reason. The claim status is updated to reflect the reviewer's decision.

Origin: EFCSN (assessment procedures for disputed claims); Full Fact (senior review of corrections); GUARDRAILS.md (human approval for guardrail violations).

---

## 14. Correction and Update Rules

### 14a. Correction vs update

| Type | Definition | Logging requirement |
|---|---|---|
| **Correction** | A previously published value, label, or claim was wrong and has been fixed. | Visible correction note in changelog.json. Old value, new value, reason, and date recorded. The correction must be visible to readers — not silently absorbed. |
| **Update** | New data has been released and the dashboard reflects the newer value. The old value was not wrong; it has been superseded. | Normal changelog entry. Old value, new value, source, date. |

### 14b. Correction logging

Every correction must include:
1. What was wrong (the specific value, label, or claim)
2. What it has been corrected to
3. Why it was wrong (source error, transcription error, transformation error, interpretation error)
4. When the correction was made
5. Whether the correction changed any score

**Corrections that change a score require the same QA process as any grade change** per QA-Gatekeeping-Rules.md.

Origin: EFCSN (corrections with visible notes, public corrections record, annual corrections review); Full Fact (update vs correction distinction, logged feedback).

---

## 15. Evidence-Pack Boundary Rules

### 15a. Definition

The evidence pack is the explicit set of source documents, data releases, and reports that constitute the scoring evidence for a specific monthly cycle. It is assembled at the start of the cycle and logged as a manifest (see Evidence-Pack-Manifest-Template.md).

### 15b. Boundary rules

| Rule | Detail |
|---|---|
| **No claim outside the evidence pack is grade-moving.** | If a source was not included in the pack, it cannot move a score. It can be noted for the next cycle. |
| **Cutoff is explicit.** | The manifest specifies a cutoff date and time. Sources published after the cutoff are excluded. |
| **Pack is assembled before scoring.** | Source gathering and scoring are separate steps. The pack must be complete before any scoring decisions begin. |
| **Pack is reviewable.** | A third party could inspect the manifest and verify which sources were included, which were excluded, and why. |

### 15c. Post-cutoff scenarios

| Scenario | Action |
|---|---|
| Source is corrected after pack closes | Note the correction in the manifest. If the correction is material, the editor may choose to reopen the pack and rerun verification for that claim. If minor, carry forward to the next cycle. |
| Source becomes available after cutoff but before publication | Exclude from this cycle's pack. Include in the next cycle. Exception: if the source is a critical Tier 1 release that would change a score, the editor may add it with a manifest note explaining the late inclusion. |
| Source in the pack is removed from the web after pack closes | The manifest entry (with access date and logged values) serves as the audit record. |

Origin: Google FACTS Grounding (evidence-pack-first model — every claim must be checkable against the supplied document set); AP (verification as workflow with defined inputs).

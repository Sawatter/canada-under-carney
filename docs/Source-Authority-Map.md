# Source Authority Map

- **Purpose:** Define, per dimension, what kinds of truth the dashboard is claiming and which source roles should carry those claims.
- **Status:** Draft — template and Housing Supply pilot complete; remaining 10 dimensions pending.
- **Last updated:** 2026-04-18
- **Depends on:** Current-Roadmap.md, Parking-Lot.md, DATA-SOURCES.md, QA-Gatekeeping-Rules.md, Deconfliction-Matrix.md, Canonical-Scoring-Sheets.md, Plus-Minus-Decision-Rules.md, src/data/dimensions.json
- **Used by:** future source-hardening passes, source-fit reviews, confidence calibration reviews, and the forthcoming full per-dimension authority-map buildout

---

## Template

### Purpose of This Artifact

The Source Authority Map answers a different question than the source sufficiency audit.

- Source sufficiency asks: do we have enough evidence to justify the current score, confidence, and precision?
- Source authority asks: for this dimension's construct, what kinds of truth are we claiming, and which sources should carry each kind of claim?

This file does not replace the scoring sheets, the QA rules, or claim-level verification. It overlays a role taxonomy on top of them.

---

### Source Roles

Every dimension may use up to five source roles. Not every role is required for every construct.

- **Measurement truth**
  Official, administrative, or statistical evidence for the core metric itself.
- **Policy truth**
  What the government actually announced, funded, legislated, or formally committed to do.
- **Execution truth**
  Whether the policy is operational, disbursing, enforced, started, or otherwise live in the world rather than still on paper.
- **Independent challenge truth**
  External analysis, benchmarks, audits, or institutional criticism testing whether the government's claims or scale are adequate.
- **Context truth**
  Interpretation, commentary, journalism, and broader framing that may inform the reader but must not move the grade by itself.

---

### Construct-Type Guidance

Use the construct type to decide which source roles are required.

- **Action**
  Usually requires policy truth, execution truth, independent challenge truth, and at least one measurement role when a direct metric exists.
- **Outcome**
  Usually requires measurement truth and independent challenge truth first; policy and execution truth may still matter, but only if the dimension explicitly grades the government's response to the outcome rather than the outcome itself.
- **Process**
  Often has limited or no true measurement role. Policy/process truth and independent challenge truth usually matter most. Context truth is often more important here than in outcome dimensions.
- **Implementation**
  Usually requires policy truth and execution truth first. Measurement truth may exist, but often only as delivery throughput or status, not end-state outcome.
- **Mixed**
  May require multiple roles across multiple sub-claims. Do not force every role onto every claim; assign by claim.
- **Combination / derivative**
  Inherits much of its evidence from home dimensions. Execution truth and independent challenge truth usually dominate. Measurement truth may be editorial or inherited rather than directly observed in the combination dimension itself.

---

### Role Applicability Rule

A role may be marked:

- **Required**
- **Optional**
- **Not applicable to this construct**

Role gaps are information, not defects. The map must never force a dimension to fill a role that the construct does not genuinely require.

---

### Probationary Dimension Guidance

Probationary dimensions such as Ethics & Transparency and Flagship Delivery do not necessarily use the same role shape as stable dimensions.

- They may have fewer valid source roles in practice.
- They may rely more heavily on qualitative or derivative evidence.
- They may have structural red-flag gaps that cannot be solved by "more sources."

The map should document those limits explicitly rather than pretending every probationary dimension can be made to look like a stable Action or Outcome file.

---

### Relationship to Other Governance Docs

- **Canonical-Scoring-Sheets.md**
  Owns construct definitions, attribution splits, minimum indicators, thresholds, modifier rules, triggers, and rater notes. This map does not replace those sections. It identifies which source roles should support the claims those sections imply.

- **Deconfliction-Matrix.md**
  Owns primary-home assignments. A source listed as context-only here must not conflict with a blocked or primary-home rule there.

- **QA-Gatekeeping-Rules.md**
  Owns source tiers and process rules. This map inherits tier assignments by reference. It does not redefine Tier 1-5.

- **Plus-Minus-Decision-Rules.md**
  Owns whole-letter probationary mechanics and plus/minus precision rules. This map only notes how probationary constructs change role requirements.

- **Source-Verification-Protocol.md**
  Owns claim entailment and verification status. This map says what role a source should play; the verification protocol says whether the source actually supports the claim.

---

### Per-Dimension Entry Format

Each dimension entry must contain exactly these fields:

1. **Construct**
   Verbatim construct statement from Canonical-Scoring-Sheets.md.

2. **Core grade-moving claims**
   Three to six claims the current grade materially depends on. These should map to the current `bandCriterion`, `plusMinusRationale`, and central rationale text rather than restating every metric in the dimension.

3. **Required source roles**
   Which of the five roles are required, optional, or not applicable for this construct.

4. **Preferred sources by role**
   Named sources for each role, with QA tier shown in brackets. Where useful, list a preferred primary and acceptable corroborators.

5. **Context-only sources**
   Sources that may inform interpretation but must not move the grade by themselves.

6. **Current state delta**
   Compare the current `dimensions.json` source stack to the authority map. Name:
   - gaps
   - orphaned sources
   - role mismatches

7. **Red-flag gaps**
   Structural limits that better sourcing alone cannot solve.

---

## 1. Housing Supply

**Construct**

The scale and effectiveness of federal housing policy interventions relative to identified need.  
Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:271)

**Core grade-moving claims**

1. Housing starts remain materially below the level CMHC says is needed to restore affordability.
   Source basis: minimum indicators + D threshold in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:280) and [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:292)

2. Federal programs cover only a tiny share of the shortfall, even after Build Canada Homes is counted.
   Source basis: D threshold + current rationale in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:292) and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1227)

3. Build Canada Homes remains an announced pipeline rather than a live construction program.
   Source basis: current `plusMinusRationale` and rationale in [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1228) and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1251)

4. The federal housing spending trajectory is declining rather than scaling.
   Source basis: current rationale and metric in [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1251) and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1294)

5. The Ontario development-charge agreement is real but insufficient in scale and does not resolve the broader federal-attribution constraint.
   Source basis: current rationale + jurisdictional-limits modifier in [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1231) and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1251)

**Required source roles**

| Role | Status | Why |
|---|---|---|
| Measurement truth | Required | The grade depends on starts vs. need and on the scale of the current shortfall. |
| Policy truth | Required | The dimension grades federal interventions, so the formal content of BCH and federal-provincial deals matters. |
| Execution truth | Required | The core confounder is announced vs. started vs. completed. |
| Independent challenge truth | Required | Federal adequacy and scale require external benchmarking and critique. |
| Context truth | Optional | Useful for municipal/provincial bottlenecks and supply-only critiques, but should not move the grade by itself. |

**Preferred sources by role**

| Role | Preferred primary | Acceptable corroborators |
|---|---|---|
| Measurement truth | CMHC / Statistics Canada housing starts table 34-10-0158-01 [QA T1]; CMHC housing need estimate [QA T1] | Additional CMHC affordability/need publications [QA T1] |
| Policy truth | Housing Infrastructure Canada Build Canada Homes program materials [QA T4 unless operational figures are being reported directly]; federal budget or program documents on housing spending [QA T1/T4 depending document type] | Canada-Ontario housing agreement materials [QA T4] |
| Execution truth | CMHC starts/completions data [QA T1]; direct evidence that BCH construction has actually begun [preferred operational source, likely departmental or project-level] | Signed federal-provincial agreements and implementation documents [QA T4 as context unless reporting live delivery] |
| Independent challenge truth | PBO BCH forecast and spending analysis [QA T1]; CMHC need benchmark [QA T1] | Policy Options / IRPP [QA T2]; C.D. Howe [QA T2]; academic housing analysis [QA T2] |
| Context truth | Toronto Star [QA T3]; The Tyee [QA T3]; broader housing journalism on municipal/provincial bottlenecks [QA T3] | Other clearly attributed housing reporting [QA T3] |

**Context-only sources**

- Toronto Star and The Tyee reporting on municipal, provincial, or region-specific housing bottlenecks
- General commentary on whether "supply alone" is sufficient to solve affordability
- Flagship Delivery references to housing starts or agreement status when used as delivery evidence rather than outcome evidence

These may shape interpretation but must not move the Housing Supply grade without the measurement / execution / challenge roles above.

**Current state delta**

Current `dimensions.json` Housing Supply source stack:  
PBO BCH forecast, CMHC starts, Canada-Ontario Partnership, Policy Options  
Source: [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1252)

- **Present and well-aligned**
  - `CMHC 2025 starts` fills the measurement-truth role for current starts.
  - `PBO — BCH 26,000 units` fills independent challenge truth on BCH scale and federal spending trajectory.
  - `Canada-Ontario Partnership` fills policy/execution context for the Ontario deal.

- **Gaps**
  - No explicit CMHC housing-need source is present in the `sources` array, even though the metric/sourceNote relies on CMHC need estimates.
  - No direct Housing Infrastructure Canada / Build Canada Homes source is present in the `sources` array, even though the BCH metric sourceNote relies on a departmental page for the 4,000-unit figure.

- **Role mismatches**
  - `Policy Options — real estate trap` is currently in the `sources` array, but for this construct it is better understood as context-only or secondary challenge framing, not as a core grade-moving anchor.

- **Orphaned sources**
  - None in the current stack. Every listed source is attached to at least one live claim, metric, or rationale line.

**Red-flag gaps**

- The scoring sheet explicitly says the federal government controls only about 30% of what determines housing starts.
  Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:309)

- Because attribution is mixed, stronger federal sources cannot by themselves settle the full outcome question. Provincial approvals, municipal development charges, land-use constraints, labour capacity, and interest rates still sit outside the federal stack.

- The biggest confounder remains announced vs. started vs. completed.
  Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:303)

- This means the authority map can improve role clarity, but it cannot eliminate the underlying attribution limit built into the construct.

---

**Pilot note**

This draft validates the template on Housing Supply only. The remaining 10 dimensions should be built in later passes after a review of:

- whether the 5-role taxonomy is the right granularity
- whether probationary dimensions need a reduced role set
- whether derivative dimensions need a distinct sub-template
- whether the Current State Delta field is sufficiently actionable for later fix passes

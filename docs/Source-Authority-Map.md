# Source Authority Map

- **Purpose:** Define, per dimension, what kinds of truth the dashboard is claiming and which source roles should carry those claims.
- **Status:** Draft — all 11 graded dimension entries complete; full review complete; Stage 4 integration pending.
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

## 2. Ethics & Transparency

**Construct**

The adequacy of the PM's ethics framework relative to the novel disclosure requirements of his background.  
Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:146)

**Core grade-moving claims**

1. Disclosure is partial rather than full, and Brookfield-related interests are not yet fully publicly accounted for.
   Source basis: C threshold + current `bandCriterion` and rationale in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:165), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1381), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1396)

2. An ethics screen and blind-trust framework exist, which keeps the file in the C band rather than D, but completeness of that framework is credibly challenged.
   Source basis: C threshold + current `plusMinusRationale` and promise evidence in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:165), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1382), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1437)

3. No independent Ethics Commissioner review has been published.
   Source basis: minimum indicators + C threshold + current metric and promise status in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:155), [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:165), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1414), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1448)

4. Democracy Watch-level critique is material to the grade and blocks movement toward B unless offset by stronger disclosure or an independent review.
   Source basis: down-trigger + current `plusMinusRationale` and critics text in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:174), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1382), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1463)

**Required source roles**

| Role | Status | Why |
|---|---|---|
| Measurement truth | Not applicable to this construct | The dimension grades framework adequacy and review status rather than a quantitative outcome. |
| Policy truth | Required | Official disclosures, ethics-screen arrangements, and commissioner actions define the framework being graded. |
| Execution truth | Required | The framework must exist and function in practice: screening active, disclosure made, review published or not published. |
| Independent challenge truth | Required | Adequacy cannot be judged from official disclosures alone; governance critique is part of the grade. |
| Context truth | Optional | Reporting on Brookfield background, conflict perception, and the novelty of the case helps interpretation but must not move the grade by itself. |

**Preferred sources by role**

| Role | Preferred primary | Acceptable corroborators |
|---|---|---|
| Measurement truth | No true primary source role for this construct | Event-style status indicators may still appear as editorial metrics, but they do not create a quantitative measurement layer. |
| Policy truth | Office of the Ethics Commissioner review/public filings [QA T1]; official PM disclosure records or commissioner registry entries [QA T1 when cited for the filing itself] | Official ethics-screen or blind-trust disclosures [QA T1/T4 depending document type] |
| Execution truth | Published Ethics Commissioner review status [QA T1]; official evidence that an ethics screen or blind trust is active [QA T1/T4 depending document type] | Formal committee records or commissioner correspondence when public [QA T1] |
| Independent challenge truth | Democracy Watch governance critique [QA T2 when citing its published methodology-backed critique directly; otherwise QA T3]; published committee findings where available [QA T1] | Governance-law commentary or institutional-analysis critique [QA T2/T3] |
| Context truth | Globe and Mail [QA T3]; CBC News [QA T3]; broader reporting on Brookfield background and conflict perception [QA T3] | Other clearly attributed federal accountability reporting [QA T3] |

**Context-only sources**

- Globe and CBC reporting on asset history, background, and conflict perception
- Carbon Pricing references to Brookfield / industrial OBPS conflict perception when used as context only
- Broader commentary on whether Carney's policy worldview overlaps with transition finance or ESG norms

These may shape interpretation but must not move the Ethics & Transparency grade without the policy / execution / challenge roles above.

**Current state delta**

Current `dimensions.json` Ethics & Transparency source stack:  
Globe and Mail ethics filing, CBC financial assets, Democracy Watch critique  
Source: [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1397)

- **Present and well-aligned**
  - `Democracy Watch critique` fills the independent-challenge role on framework adequacy.
  - `Globe and Mail — ethics filing` and `CBC — financial assets` provide context/reporting corroboration on disclosure background and public asset visibility.

- **Gaps**
  - No Office of the Ethics Commissioner source is present in the `sources` array, even though review status is a minimum indicator and a live metric.
  - No official disclosure / ethics-screen / blind-trust source is present in the `sources` array, even though the current band depends on the existence and completeness of the framework.

- **Role mismatches**
  - `Globe and Mail — ethics filing` and `CBC — financial assets` are currently carrying part of the policy/execution truth layer by proxy because official disclosure and commissioner sources are absent. Under this map, they are better understood as context/reporting corroborators than as primary anchors.

- **Orphaned sources**
  - None in the current stack. Every listed source attaches to the rationale or perspectives text.

**Red-flag gaps**

- This dimension has little to no true measurement truth. Stronger sourcing can harden the process file, but it cannot turn it into a quantitative dimension.
  Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:176) and [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:178)

- Absence of evidence is not evidence of absence. No proven wrongdoing does not equal an adequate disclosure framework.
  Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:176)

- Brookfield conflict perception may appear in Carbon Pricing Policy only as context; Ethics & Transparency owns the grade impact.
  Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:180) and [docs/Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md:42)

- A detailed Ethics Commissioner review is the clearest path to hardening this file. Until then, the source stack will remain partly journalism- and critique-mediated by design.

## 3. Flagship Delivery

**Construct**

The federal government's cross-cutting capacity to convert announcements into measurable results across its five highest-profile policy files.  
Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:188)

**Core grade-moving claims**

1. The headline grade is determined mechanically by the distribution of delivery statuses across the five flagship files.
   Source basis: grade-threshold rule + current `bandCriterion` in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:202), [docs/Flagship-Delivery-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Flagship-Delivery-Rules.md:36), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1485)

2. Defence is delivering and immigration is at least partially delivering, which keeps the file in the C band rather than D.
   Source basis: current `plusMinusRationale`, rationale, and Combination Rule current assessment in [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1486), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1497), [docs/Flagship-Delivery-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Flagship-Delivery-Rules.md:52), and [docs/Flagship-Delivery-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Flagship-Delivery-Rules.md:56)

3. Housing, major projects, and climate remain stalled or worse, which prevents movement toward B and keeps execution concentrated rather than broad-based.
   Source basis: current `plusMinusRationale` and Combination Rule current assessment in [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1486), [docs/Flagship-Delivery-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Flagship-Delivery-Rules.md:53), [docs/Flagship-Delivery-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Flagship-Delivery-Rules.md:54), and [docs/Flagship-Delivery-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Flagship-Delivery-Rules.md:55)

4. Federal-provincial coordination quality is weak and materially affects delivery on the domestic flagship files.
   Source basis: minimum indicators + live metric and promise evidence in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:199), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1543), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1546), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1569)

**Required source roles**

| Role | Status | Why |
|---|---|---|
| Measurement truth | Required | The Combination Rule needs a flagship-file status distribution and a small set of cross-file delivery counters, even though much of that measurement is inherited or editorial rather than native to this dimension. |
| Policy truth | Required | Delivery can be judged only against the official commitments and targets attached to the flagship files. |
| Execution truth | Required | The construct is explicitly about whether the government's delivery machinery is actually working. |
| Independent challenge truth | Required | Cross-file coordination and state-capacity critique test whether the delivery story is real or selectively framed. |
| Context truth | Optional | Commentary on majority politics, public-service strain, or political strategy can inform interpretation but must not move the grade by itself. |

**Preferred sources by role**

| Role | Preferred primary | Acceptable corroborators |
|---|---|---|
| Measurement truth | Flagship-Delivery-Rules current assessment and home-dimension delivery metrics [editorial / inherited from home dimensions]; Legisinfo bills-passed data [QA T1] | Home-dimension operational tables for NATO delivery, housing execution, immigration levels, climate implementation, and MPO status [QA tiers inherited from home files] |
| Policy truth | Official target-setting and framework documents for the five flagship files [QA T1/T4 depending document type] | Budget or legislative documents that define the commitments being tested [QA T1/T4] |
| Execution truth | Home-dimension evidence that flagship-file machinery is actually delivering [QA tiers inherited from home files]; Legisinfo bills-passed data [QA T1] | Fund-disbursement or implementation-status reporting tied to a flagship file [QA T1/T2] |
| Independent challenge truth | Policy Options / IRPP [QA T2]; C.D. Howe [QA T2]; PBO [QA T1] | IFSD or academic public-administration analysis [QA T2] |
| Context truth | The Hub [QA T3]; broader federal-delivery coverage [QA T3] | Party, labour, or stakeholder criticism when clearly attributed [QA T3] |

**Context-only sources**

- Home-dimension outcome metrics when they are being used to argue policy merit rather than delivery quality
- Promise Delivery counts
- Commentary on majority politics, cabinet strategy, or generalized momentum

These may shape interpretation but must not move the Flagship Delivery grade without the measurement / execution / challenge roles above.

**Current state delta**

Current `dimensions.json` Flagship Delivery source stack:  
Policy Options federalism failure, Policy Options DM shuffle, PBO $94B investment gap, C.D. Howe public service ratio, The Hub $94B gap  
Source: [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1498)

- **Present and well-aligned**
  - `Policy Options — federalism failure` fills independent-challenge truth on cross-file coordination quality.

- **Gaps**
  - No Legisinfo source is present in the `sources` array, even though bills passed is a live metric.
  - No direct home-file execution source is present in the `sources` array, even though the headline grade is mechanically derived from the five flagship-file statuses.

- **Role mismatches**
  - None in the current stack once orphaned items are set aside. The live attached sources are challenge/context-heavy, but they are not misclassified where they are actually used.

- **Orphaned sources**
  - `Policy Options — DM shuffle`, `PBO — $94B investment gap`, `C.D. Howe — public service ratio`, and `The Hub — $94B gap` do not currently attach to a live rationale, metric sourceNote, promise evidence, or perspectives line.

**Red-flag gaps**

- This is a derivative / combination dimension. Much of its measurement truth is inherited from home dimensions rather than native to Flagship Delivery.
  Source: [docs/Flagship-Delivery-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Flagship-Delivery-Rules.md:17) and [docs/Flagship-Delivery-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Flagship-Delivery-Rules.md:83)

- Double-counting risk is structural: outcome evidence belongs in the home dimensions, while Flagship Delivery owns only the execution question.
  Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:210), [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:214), and [docs/Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md:63)

- This dimension remains on probation. If it stops adding analytical value beyond the home dimensions, stronger sourcing alone will not save the construct.
  Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:216), [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:218), and [docs/Flagship-Delivery-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Flagship-Delivery-Rules.md:96)

## 4. Defence & Trade

**Construct**

The degree to which the federal government has met its stated defence spending commitments and diversified Canada's trade relationships away from single-market dependency.  
Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:515)

**Core grade-moving claims**

1. The defence leg meets the A-band threshold because NATO 2% has been achieved and sustained with formal funding behind it.
   Source basis: grade threshold + current rationale + defence sub-score in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:533), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:32), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:175)

2. The trade leg meets a strong B+/near-A range because export diversification away from the U.S. is measurable, but the improvement is partly market-driven rather than purely policy-caused.
   Source basis: current rationale + current trade sub-score + external-constraint modifier in [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:32), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:177), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:16)

3. The headline A- is a blended result: defence performs at A, trade diversification at B+, averaging to A-.
   Source basis: shadow sub-score rule in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:539), plus current display grade and sub-scores in [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:5) and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:171)

4. The minus is driven by caveats, not failure: Canada met but did not materially exceed the 2% defence floor, the 3.5% target lacks a funded pathway, and trade diversification is partly confounded by the trade war itself.
   Source basis: current `plusMinusRationale`, rationale, and modifier rule in [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:13), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:32), and [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:545)

**Required source roles**

| Role | Status | Why |
|---|---|---|
| Measurement truth | Required | The dimension depends on hard defence and trade metrics: NATO spending, U.S. export share, non-U.S. export growth, and EU/CETA-region growth. |
| Policy truth | Required | The grade rests partly on whether the government set, funded, and legislated the defence and diversification commitments it is claiming credit for. |
| Execution truth | Required | Meeting NATO 2%, advancing procurement, and sustaining trade diversification all require real-world execution, not just formal intent. |
| Independent challenge truth | Required | The minus and caveat structure depends on outside scrutiny of accounting limits, funding-pathway weakness, and market-driven confounders. |
| Context truth | Optional | Wider commentary on geopolitical urgency or industrial strategy can help interpretation but must not move the grade by itself. |

**Preferred sources by role**

| Role | Preferred primary | Acceptable corroborators |
|---|---|---|
| Measurement truth | NATO annual defence-spending tables [QA T1]; StatsCan trade by country table 12-10-0176-01 [QA T1]; Global Affairs Monthly Trade Report [QA T1 when used as the official synthesis of the StatsCan data] | Additional Global Affairs trade releases [QA T1] |
| Policy truth | Budget 2025 defence/trade commitments [QA T1/T4 depending document type]; official legislation and government program documents for interprovincial reform and trade diversification [QA T1/T4 depending document type] | PMO announcement pages [QA T4 as context/policy corroboration only] |
| Execution truth | NATO annual report confirmation of 2% delivery [QA T1]; official trade data showing export-share movement [QA T1]; direct procurement milestone reporting [QA T1/T4 depending document type] | Legislative completion evidence for interprovincial trade reform [QA T1] |
| Independent challenge truth | Policy Options / IRPP [QA T2]; other disclosed-methodology institutional analysis on defence affordability or trade-driver attribution [QA T2] | Academic or think-tank scrutiny of accounting caveats, funding paths, or trade-war confounding [QA T2/T3] |
| Context truth | PMO announcement framing [QA T4]; mainstream reporting on allied reaction or industrial strategy [QA T3] | Additional clearly attributed reporting [QA T3] |

**Context-only sources**

- PMO announcements when NATO or trade results are already confirmed by NATO, StatsCan, or Global Affairs
- General geopolitical commentary on why NATO spending matters
- Domestic political commentary on whether defence spending is a good priority choice

These may shape interpretation but must not move the Defence & Trade grade without the measurement / policy / execution / challenge roles above.

**Current state delta**

Current `dimensions.json` Defence & Trade source stack:  
NATO Secretary General Annual Report 2025, PMO NATO 2% announcement, Budget 2025 Ch.4, StatsCan trade data, Global Affairs Canada Monthly Trade Report  
Source: [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:33)

- **Present and well-aligned**
  - `NATO Secretary General Annual Report 2025` fills defence measurement/execution truth.
  - `StatsCan trade data` and `Global Affairs Canada Monthly Trade Report` fill trade measurement/execution truth.
  - `Budget 2025 Ch.4` fills policy truth on the funded defence and diversification commitments.

- **Gaps**
  - No explicit independent-challenge source is present in the `sources` array, even though the live minus rationale depends on caveats about the unfunded 3.5% target and partly market-driven diversification.
  - No direct legislative source is present in the `sources` array for the delivered interprovincial-trade-barrier reform promise, even though that promise is part of the current file.

- **Role mismatches**
  - `PMO NATO 2% announcement` is better understood as context/policy corroboration than as a primary measurement or execution anchor, because NATO already provides the grade-moving confirmation.

- **Orphaned sources**
  - None in the current stack. Every listed source attaches to the rationale, metrics, or promise set.

**Red-flag gaps**

- This is a dual-leg mixed dimension. The defence and trade legs do not rely on identical role stacks, even though they share one headline grade.
  Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:517) and [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:539)

- Trade diversification is partly confounded by the same trade war that created the diversification pressure, so stronger trade metrics cannot be treated as purely policy-caused.
  Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:546) and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:18)

- Trade diversification metrics are primary-homed here and should not leak into Economic Policy Response. NATO and defence procurement metrics may appear in Flagship Delivery only as delivery evidence, not as outcome merit.
  Source: [docs/Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md:29) and [docs/Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md:31)

---

## 5. Major Projects

**Construct**

The effectiveness of federal institutional machinery for infrastructure project delivery.  
Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:315)

**Core grade-moving claims**

1. The MPO and Building Canada Act are real institutional reforms, so the file is above D/F territory.
   Source basis: current rationale + current band criterion in [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:194), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:219), and [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:334)

2. Most of the headline project pipeline is pre-existing, so the raw case for a stronger grade is weakened by overclaiming.
   Source basis: biggest confounder + current `plusMinusRationale` and rationale in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:346), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:195), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:219)

3. The signature power, national interest designation, remains unused, so the framework is still materially untested.
   Source basis: C threshold + live metric in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:334), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:255), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:219)

4. The current C includes an applied credit-claiming penalty: without documented overstatement of pre-existing projects, the machinery would sit at raw C+.
   Source basis: modifier rule + live `plusMinusRationale` and active modifier in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:339), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:195), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:198)

**Required source roles**

| Role | Status | Why |
|---|---|---|
| Measurement truth | Required | The dimension needs concrete institutional indicators: project tranches, designation uses, cycle completion, and eventually approval-time acceleration. |
| Policy truth | Required | The machinery exists only because the government created legal and administrative instruments around it. |
| Execution truth | Required | The grade turns on whether those tools are being used in practice, not just enacted on paper. |
| Independent challenge truth | Required | The penalty and overclaiming assessment rely on outside scrutiny of what is genuinely new versus rebranded. |
| Context truth | Optional | Commentary on regional politics, consent debates, or sector strategy can inform the file but must not move the grade by itself. |

**Preferred sources by role**

| Role | Preferred primary | Acceptable corroborators |
|---|---|---|
| Measurement truth | Official MPO project-status reporting and national-interest-designation record [QA T1/T4 depending document type]; LEGISinfo passage/status records [QA T1] | Direct government project lists and designation orders [QA T1/T4] |
| Policy truth | Building Canada Act / LEGISinfo [QA T1]; official MPO / PM announcements that define the claimed pipeline [QA T4] | Budget or departmental program documents tied to the machinery [QA T1/T4] |
| Execution truth | Official evidence that projects have entered, moved through, or exited the MPO cycle [QA T1/T4]; designation-use record [QA T1] | Project-level or departmental implementation updates [QA T1/T4] |
| Independent challenge truth | Fraser Institute [QA T2/T3 depending claim use]; Angus Reid [QA T3]; other disclosed-methodology institutional analysis on overclaiming or project acceleration [QA T2/T3] | Academic or sector analysis on approval-time acceleration [QA T2/T3] |
| Context truth | Broader reporting on Indigenous consent, environmental trade-offs, or regional project politics [QA T3] | Additional clearly attributed project-delivery commentary [QA T3] |

**Context-only sources**

- Commentary on whether specific projects are normatively desirable
- Broader political arguments about industrial strategy or regional favoritism
- Critical minerals and AI pipeline references when they are being used as economic-policy context rather than MPO machinery evidence

These may shape interpretation but must not move the Major Projects grade without the measurement / policy / execution / challenge roles above.

**Current state delta**

Current `dimensions.json` Major Projects source stack:  
PM second tranche announcement, Building Canada Act, Fraser Institute MPO assessment, Angus Reid major projects reaction  
Source: [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:220)

- **Present and well-aligned**
  - `Building Canada Act` fills policy truth on the existence and formal powers of the machinery.
  - `Fraser Institute — MPO assessment` and `Angus Reid — major projects reaction` fill independent-challenge truth on overclaiming and pre-existing momentum.
  - `PM second tranche announcement` fills policy/context truth for the government's stated $116B pipeline claim.

- **Gaps**
  - No direct MPO operational-status source is present in the `sources` array beyond PM announcements, even though the file grades live machinery rather than announced intent alone.
  - No direct source is present for mean approval-time movement or first completed MPO cycle, even though those are eventual core measurement/execution indicators.

- **Role mismatches**
  - `PM second tranche announcement` is better understood as policy/context truth than as execution evidence, because it documents the government's claim about the pipeline, not acceleration actually achieved.

- **Orphaned sources**
  - None in the current stack. Every listed source attaches to the rationale, metrics, or perspectives.

**Red-flag gaps**

- Pre-existing momentum is the central confounder. A larger announced pipeline does not prove the MPO itself accelerated anything.
  Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:346)

- Timing fairness only partially applies: infrastructure is slow-moving, but the machinery itself is already gradeable before outcome acceleration is visible.
  Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:340) and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:203)

- Critical minerals pipeline is primary-homed in Economic Policy Response. Major Projects may reference it only if the question is whether the MPO is helping deliver it, not whether the minerals strategy is itself strong.
  Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:350) and [docs/Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md:27)

---

## 6. Immigration

**Construct**

The adequacy and coherence of the federal immigration level correction.  
Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:358)

**Core grade-moving claims**

1. The correction has been executed sharply and at real scale, which is why the file sits at C+ rather than C.
   Source basis: C+ threshold + current `bandCriterion` and rationale in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:377), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1101), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1115)

2. The long-term model remains undefined, which blocks movement toward B despite the scale of the correction.
   Source basis: C+ threshold + current `bandCriterion`, trigger, and rationale in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:377), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1101), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1107), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1115)

3. Downside risks to service-sensitive sectors are real but not yet large enough to overturn the case for correction.
   Source basis: current `plusMinusRationale`, rationale, and critics perspective in [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1102), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1115), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1206)

4. Population, permit, and temporary-resident contraction provide measurable evidence that the pullback is happening in the real world rather than remaining an announced intention.
   Source basis: minimum indicators + live metrics in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:366), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1133), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1140), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1147), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1154)

**Required source roles**

| Role | Status | Why |
|---|---|---|
| Measurement truth | Required | The file depends on target levels, permit flows, temporary-resident contraction, and population change. |
| Policy truth | Required | The correction is gradeable only because the federal government explicitly changed levels and permit policy. |
| Execution truth | Required | The construct tests whether the correction is actually occurring in admissions, permits, and population data. |
| Independent challenge truth | Required | Adequacy and downside-risk judgment require external scrutiny of wage pressure, service strain, and sector impacts. |
| Context truth | Optional | Broader ideological arguments about whether immigration should be higher or lower can inform interpretation but must not move the grade by themselves. |

**Preferred sources by role**

| Role | Preferred primary | Acceptable corroborators |
|---|---|---|
| Measurement truth | IRCC levels plan and open-data permit/admissions series [QA T1]; StatsCan population table 17-10-0009-01 [QA T1] | Additional IRCC administrative releases [QA T1] |
| Policy truth | IRCC levels-plan documents and permit-policy changes [QA T1/T4 depending document type] | Formal departmental or legislative updates on TFW / study / asylum changes [QA T1/T4] |
| Execution truth | IRCC open-data series on work permits, study permits, and admissions [QA T1]; StatsCan population data [QA T1] | Official departmental tracking of temporary-resident stock [QA T1] |
| Independent challenge truth | Bank of Canada wage study [QA T1]; additional sector or institutional analysis on housing/healthcare/service strain [QA T2/T3] | Clearly attributed healthcare, agriculture, or higher-ed impact reporting [QA T3] |
| Context truth | Toronto Star [QA T3]; broader immigration-management reporting [QA T3] | Other clearly attributed commentary that frames but does not score the correction [QA T3] |

**Context-only sources**

- Ideological arguments for permanently higher or lower immigration levels
- General political commentary on whether the correction is brave or cruel
- Flagship Delivery references to immigration as one of the five files when the question is delivery capacity rather than adequacy of the correction itself

These may shape interpretation but must not move the Immigration grade without the measurement / policy / execution / challenge roles above.

**Current state delta**

Current `dimensions.json` Immigration source stack:  
StatsCan population Q4 2025, IRCC 2026-2028 levels plan, Bank of Canada wage study  
Source: [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1116)

- **Present and well-aligned**
  - `StatsCan population Q4 2025` fills measurement/execution truth on the live contraction.
  - `IRCC 2026-2028 levels plan` fills policy truth on the stated correction.
  - `Bank of Canada wage study` fills independent-challenge truth on why a correction was needed and what labour-market pressure looked like pre-correction.

- **Gaps**
  - No direct IRCC open-data source is present in the `sources` array for work-permit and study-permit contraction, even though those are live metrics in the file.
  - No explicit source is present in the `sources` array for the downside-risk side of the file (healthcare, agriculture, higher education), even though the rationale and critics perspective rely on those risks being real.

- **Role mismatches**
  - None in the current stack. The three listed sources align cleanly to policy, execution/measurement, and challenge roles.

- **Orphaned sources**
  - None in the current stack. Every listed source attaches to a live metric, rationale line, or perspective.

**Red-flag gaps**

- This is a correction file, not a clean-sheet redesign file. The grade measures adequacy of repair, not whether the government has built a settled long-term model.
  Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:388) and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1115)

- Service-side downside risks may lag the correction itself. A clean contraction in intake data does not by itself answer whether the pullback creates secondary strain in healthcare, agriculture, or higher education.

- Immigration levels and temporary-resident data are primary-homed here. Flagship Delivery may use them only as one flagship-file indicator, and Economic Policy Response may not grade-credit the contraction.
  Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:392) and [docs/Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md:32)

---

## 7. Fiscal Health

**Construct**

The sustainability of the federal fiscal trajectory and the credibility of the medium-term fiscal plan.  
Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:228)

**Core grade-moving claims**

1. The projected deficit remains above a sustainable range and the medium-term anchor lacks credibility.
   Source basis: D threshold + current `bandCriterion` and rationale in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:249), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:349), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:369)

2. Independent confidence in the stated fiscal path is extremely low, which is central to why the file is a D rather than a softer C-range warning.
   Source basis: minimum indicators + live metric + rationale in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:239), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:416), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:369)

3. Credit pressure is not a downgrade event yet, but rating warnings and debt-service burden reinforce the credibility problem.
   Source basis: D threshold + current `plusMinusRationale`, rationale, and Fitch metric in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:249), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:350), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:369), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:409)

4. Defence spending is strategically justified, but it does not excuse broader unanchored fiscal expansion.
   Source basis: modifier rule + current active modifier + rater note in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:253), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:353), and [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:265)

**Required source roles**

| Role | Status | Why |
|---|---|---|
| Measurement truth | Required | The file depends on deficit, debt, debt-service, and confidence figures. |
| Policy truth | Required | The grade turns on the government's chosen fiscal package, anchor, and discretionary measures. |
| Execution truth | Required | Budget projections alone are not enough; actual outturns, debt path, and budget implementation matter. |
| Independent challenge truth | Required | Fiscal credibility is inseparable from outside scrutiny by PBO, IMF, ratings agencies, and serious fiscal analysis. |
| Context truth | Optional | Commentary on political tradeoffs or macro backdrop can inform the file but must not move the grade by itself. |

**Preferred sources by role**

| Role | Preferred primary | Acceptable corroborators |
|---|---|---|
| Measurement truth | Finance Canada budget / fiscal monitor / Annual Financial Report [QA T1]; PBO fiscal confidence metrics [QA T1] | Additional official fiscal tables and public accounts [QA T1] |
| Policy truth | Budget 2025 and official fiscal-policy documents [QA T1/T4 depending document type] | Formal tax or spending measures implemented through legislation or budget annexes [QA T1] |
| Execution truth | Annual Financial Report and realized fiscal outturns [QA T1]; official debt-service and revenue tables [QA T1] | Fiscal Monitor updates [QA T1] |
| Independent challenge truth | PBO [QA T1]; IMF [QA T1]; rating agencies [QA T1 event-driven]; C.D. Howe / IFSD [QA T2] | Other disclosed-methodology institutional fiscal analysis [QA T2] |
| Context truth | Broader reporting on fiscal politics and trade-war macro pressure [QA T3] | Additional clearly attributed fiscal commentary [QA T3] |

**Context-only sources**

- Commentary on whether specific tax cuts are politically popular
- Broader political arguments about austerity versus stimulus
- Trade-war or tariff discussion when it is not directly tied to fiscal sustainability

These may shape interpretation but must not move the Fiscal Health grade without the measurement / policy / execution / challenge roles above.

**Current state delta**

Current `dimensions.json` Fiscal Health source stack:  
Budget 2025, PBO fiscal analysis, C.D. Howe analysis, Annual Financial Report FY 2024-25, IMF Article IV  
Source: [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:370)

- **Present and well-aligned**
  - `Budget 2025` fills measurement/policy truth on the projected deficit, debt-service, and package design.
  - `PBO fiscal analysis` fills independent-challenge truth on target credibility and confidence.
  - `Annual Financial Report FY 2024-25` fills execution truth on realized debt levels.
  - `IMF Article IV (Jan 2026)` and `C.D. Howe analysis` fill independent-challenge/context roles on level vs trajectory.

- **Gaps**
  - No direct rating-agency source is present in the `sources` array, even though the file uses Fitch pressure as a live metric and rationale input.
  - No IFSD source is present in the `sources` array, even though the rationale and defenders text invoke IFSD-level "manageable current debt, poor trajectory" framing.

- **Role mismatches**
  - None in the current stack. The live sources align cleanly across measurement, execution, policy, and challenge roles.

- **Orphaned sources**
  - None in the current stack. Every listed source attaches to a metric, rationale line, or perspective.

**Red-flag gaps**

- Level versus trajectory is the core confounder. Manageable current debt levels do not rescue an unsustainable projected path.
  Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:259)

- Defence spending can justify part of the fiscal expansion strategically, but not the rest of the package. Stronger defence evidence does not by itself improve the fiscal grade.
  Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:253) and [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:265)

- Deficit, PBO confidence, ratings, and fiscal credibility are primary-homed here. Other dimensions may reference them only as context.
  Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:263), [docs/Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md:35), and [docs/Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md:36)

---

## 8. Economic Policy Response

**Construct**

The adequacy of the federal government's policy response to Canada's structural productivity and competitiveness challenges.  
Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:59)

**Core grade-moving claims**

1. The government has mounted a real policy response, but key instruments remain more announced than executed, which is why the file stays in D rather than moving to C.
   Source basis: D threshold + current `bandCriterion`, `plusMinusRationale`, and rationale in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:79), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:502), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:503), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:527)

2. Business investment and related productivity indicators have not yet turned, so the policy response has not produced measurable traction.
   Source basis: minimum indicators + current `bandCriterion` and grade triggers in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:68), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:502), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:518)

3. Timing fairness applies because the structural weakness is inherited, but that modifier does not excuse weak execution on current instruments.
   Source basis: modifier rule + current active modifier + rationale in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:82), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:506), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:527)

4. GDP per capita decline is inherited context rather than a grade-moving metric, while critical minerals and AI compute are primary-homed here as response instruments.
   Source basis: deconfliction rule + current rationale and promise set in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:94), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:527), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:583), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:597)

**Required source roles**

| Role | Status | Why |
|---|---|---|
| Measurement truth | Required | The file depends on business investment, R&D, employment, and related productivity indicators. |
| Policy truth | Required | The construct grades federal instruments such as AI compute, critical minerals, and red-tape review. |
| Execution truth | Required | The file must distinguish announced from authorized from disbursed. |
| Independent challenge truth | Required | Productivity adequacy and international comparison require outside scrutiny, not just government self-description. |
| Context truth | Optional | Inherited GDP-per-capita weakness and broader competitiveness commentary help frame the file but must not move the grade by themselves. |

**Preferred sources by role**

| Role | Preferred primary | Acceptable corroborators |
|---|---|---|
| Measurement truth | StatsCan business-investment, GDP-per-capita, R&D, and labour-force data [QA T1] | OECD statistical releases [QA T1] |
| Policy truth | ISED / Treasury Board / NRCan / official program documents for AI, minerals, and regulatory reform [QA T1/T4 depending document type] | Budget and departmental releases [QA T1/T4] |
| Execution truth | Treasury Board / PBO / official disbursement and authorization evidence [QA T1]; official program-status updates [QA T1/T4] | Departmental implementation reporting [QA T1/T4] |
| Independent challenge truth | OECD [QA T1]; Fraser Institute / BCBC / other disclosed-methodology productivity analysis [QA T2/T3 depending claim use] | Additional institutional productivity analysis [QA T2/T3] |
| Context truth | Inherited GDP-per-capita trend reporting and mainstream business coverage [QA T3] | Additional clearly attributed competitiveness commentary [QA T3] |

**Context-only sources**

- GDP-per-capita decline when used as inherited background rather than response grading
- Trade diversification outcomes, which are primary-homed in Defence & Trade
- Immigration or food-price pressure data when used as general economic mood rather than productivity-response evidence

These may shape interpretation but must not move the Economic Policy Response grade without the measurement / policy / execution / challenge roles above.

**Current state delta**

Current `dimensions.json` Economic Policy Response source stack:  
Fraser Institute Ugly Growth, OECD Economic Surveys: Canada 2025, StatsCan GDP per capita, StatsCan LFS Feb 2026, NRCan critical minerals partnerships  
Source: [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:528)

- **Present and well-aligned**
  - `OECD Economic Surveys: Canada 2025`, `StatsCan GDP per capita`, and `StatsCan LFS Feb 2026` fill inherited-context plus measurement truth on structural weakness and labour conditions.
  - `NRCan — critical minerals partnerships` fills policy/context truth on one of the government's stated productivity instruments.
  - `Fraser Institute — Ugly Growth` fills independent-challenge/context framing on the depth of the inherited problem.

- **Gaps**
  - No direct business-investment source is present in the `sources` array, even though business investment is a minimum indicator and a central grade-moving claim.
  - No direct R&D source is present in the `sources` array, even though R&D intensity is a listed metric.
  - No direct AI compute / Treasury Board / PBO authorization source is present in the `sources` array, even though announcement-versus-execution is the file's core gating rule.

- **Role mismatches**
  - `StatsCan GDP per capita` is best understood as inherited-context measurement rather than a direct grade-moving response metric, because the construct explicitly grades the response, not the inherited outcome.
  - `NRCan — critical minerals partnerships` is better understood as policy/context corroboration unless paired with authorization or disbursement evidence, because the current rationale still qualifies it as "government states."

- **Orphaned sources**
  - None in the current stack. Every listed source attaches to a metric, rationale line, or promise.

**Red-flag gaps**

- Announcement bias is the core structural risk. A fuller source stack does not solve the problem unless at least some key instruments are shown at authorized-or-higher stage.
  Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:96) and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:523)

- GDP per capita is inherited context, not the grade-moving response metric. Stronger GDP-per-capita evidence should not be mistaken for stronger evidence of policy execution.
  Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:90) and [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:94)

- Critical minerals pipeline and AI compute are primary-homed here. Trade diversification, deficit figures, immigration contraction, and food CPI must stay deconflicted into their home dimensions.
  Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:94), [docs/Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md:27), [docs/Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md:31), [docs/Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md:35), and [docs/Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md:47)

---

## 9. Affordability Response

**Construct**

The adequacy of the federal government's policy response to household cost pressure from groceries, tariffs, and targeted relief programs.  
Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:14)

**Core grade-moving claims**

1. Federal relief covers less than 20% of the identified household cost increase, which is the central reason the file sits in D rather than C.
   Source basis: D threshold + current `bandCriterion` and rationale in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:34), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:648), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:645)

2. Some instruments exist, but they are too weak or too voluntary to match the scale of the affordability problem, which is why the file resolves to D- rather than a cleaner D.
   Source basis: C/D thresholds + current `plusMinusRationale`, rationale, and promises in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:33), [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:34), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:649), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:645), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:752)

3. Tariff-driven cost pressure is real, but the external-constraint modifier does not apply because the federal response is still judged inadequate.
   Source basis: modifier rule + current active modifier + status line in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:38), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:652), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:643)

4. The file grades the policy response, not the food-price level itself; global food prices and exchange-rate pressure are confounders rather than grade movers.
   Source basis: confounder/rater note + current rationale and scope in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:45), [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:51), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:645), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:669)

**Required source roles**

| Role | Status | Why |
|---|---|---|
| Measurement truth | Required | The file depends on food CPI, tariff burden, food insecurity, and relief-to-burden ratios. |
| Policy truth | Required | The grade turns on benefit design, Grocery Code structure, and tariff choices. |
| Execution truth | Required | The file must distinguish announced relief from operational relief and mandatory measures from voluntary ones. |
| Independent challenge truth | Required | Adequacy of the response requires outside scrutiny, not just government descriptions of benefits. |
| Context truth | Optional | Journalism and commentary can explain the market backdrop but must not move the grade on their own. |

**Preferred sources by role**

| Role | Preferred primary | Acceptable corroborators |
|---|---|---|
| Measurement truth | StatsCan food CPI [QA T1]; PBO tariff-burden and benefit-costing work [QA T1]; PROOF food insecurity [QA T2] | Dalhousie food-cost reporting [QA T2] |
| Policy truth | Budget / GST-credit / grocery-benefit documents [QA T1/T4 depending document type]; Grocery Code official framework [QA T1/T4] | Formal tariff or relief announcements [QA T1/T4] |
| Execution truth | Operational proof that benefits were delivered and the Grocery Code was actually in force [QA T1/T4] | Ongoing program-status reporting [QA T1/T4] |
| Independent challenge truth | PBO [QA T1]; PROOF [QA T2]; disclosed-methodology affordability analysis such as CCPA / Broadbent [QA T2/T3 depending use] | Dalhousie [QA T2] |
| Context truth | Mainstream affordability reporting and retail-concentration coverage [QA T3] | Additional clearly attributed commentary [QA T3] |

**Context-only sources**

- Food-price reporting that does not speak to the adequacy of the federal response
- Broader retail-concentration commentary
- Utility, insurance, rent, or transportation cost reporting that sits outside this construct's scope

These may shape interpretation but must not move the Affordability Response grade without the measurement / policy / execution / challenge roles above.

**Current state delta**

Current `dimensions.json` Affordability Response source stack:  
StatsCan CPI Feb 2026, Dalhousie Food Price Report, PROOF food insecurity 2024  
Source: [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:694)

- **Present and well-aligned**
  - `StatsCan CPI Feb 2026` fills measurement truth on current food-price pressure.
  - `PROOF food insecurity 2024` fills measurement/challenge truth on the scale of household strain.
  - `Dalhousie Food Price Report` fills challenge/context on annual household food-cost burden.

- **Gaps**
  - No PBO source is present in the `sources` array even though the live grocery-benefit metric depends on PBO costing and the tariff-burden estimate is a minimum indicator for the file.
  - No direct government or operational source is present in the `sources` array for the grocery benefit or Grocery Code of Conduct, even though those instruments are central to the response being graded.
  - No tariff-household-cost source is present in the `sources` array even though the status line uses the `$1,450-$2,000/yr per household` figure as a live framing claim.

- **Role mismatches**
  - `StatsCan CPI Feb 2026` and `Dalhousie Food Price Report` mostly measure household pressure, not the adequacy of the federal response. They are necessary inputs, but by themselves they should not be mistaken for response evidence.

- **Orphaned sources**
  - None in the current stack. Every listed source attaches to a metric, rationale line, or perspective.

**Red-flag gaps**

- The price level is the core confounder. A stronger stack on food inflation alone does not improve the grade unless the response-to-burden ratio changes.
  Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:45) and [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:51)

- Food CPI and tariff household cost burden are primary-homed here. Other dimensions may cite them only as context.
  Source: [docs/Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md:33), [docs/Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md:34), and [docs/Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md:55)

- Consumer carbon tax elimination is primary-homed in Carbon Pricing Policy, while consumer carbon tax affordability savings are primary-homed here. The two must not be collapsed into one response claim.
  Source: [docs/Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md:19) and [docs/Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md:20)

---

## 10. Carbon Pricing Policy

**Construct**

The quality of the federal government's handling of carbon pricing as a policy instrument.  
Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:102)

**Core grade-moving claims**

1. Eliminating the consumer carbon charge was a genuine policy delivery win and is the strongest cleanly-delivered component of the file.
   Source basis: C threshold + current `bandCriterion`, `plusMinusRationale`, and rationale in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:122), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:802), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:803), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:822)

2. The industrial OBPS has been preserved more in form than in clearly effective function, because the effective price appears far below the headline schedule.
   Source basis: C threshold + current `bandCriterion`, rationale, and confounder note in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:122), [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:134), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:802), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:822)

3. External-constraint arguments about a future border adjustment are too early to improve the grade.
   Source basis: modifier rule + current active modifier in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:127), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:806), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:807)

4. This file grades the carbon-pricing instrument, not emissions outcomes or the broader climate framework.
   Source basis: deconfliction/rater note + current rationale in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:138), [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:140), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:822)

**Required source roles**

| Role | Status | Why |
|---|---|---|
| Measurement truth | Required | The file depends on the consumer-charge status, OBPS headline/effective price, revenue, and related design indicators. |
| Policy truth | Required | The grade turns on the federal decision to eliminate the consumer levy while preserving the industrial system. |
| Execution truth | Required | The file must distinguish nominal preservation from actual functional pricing pressure. |
| Independent challenge truth | Required | Coherence of the industrial system requires outside analytical scrutiny, not just official schedules. |
| Context truth | Optional | Broader political or climate-framing commentary can inform but must not move the grade by itself. |

**Preferred sources by role**

| Role | Preferred primary | Acceptable corroborators |
|---|---|---|
| Measurement truth | ECCC OBPS schedule and design documents [QA T1]; Finance Canada consumer-charge status [QA T1/T4]; PBO revenue analysis [QA T1] | Additional official program documents [QA T1/T4] |
| Policy truth | Finance Canada and ECCC policy documents on levy elimination and OBPS preservation [QA T1/T4] | Budget and strategy documents [QA T1/T4] |
| Execution truth | Evidence on actual compliance pricing, credit oversupply, and operational design [QA T1/T2 depending source] | Official updates plus independent market analysis [QA T1/T2] |
| Independent challenge truth | Canadian Climate Institute [QA T2]; IISD [QA T2] | Additional disclosed-methodology carbon-pricing analysis [QA T2] |
| Context truth | Business-response or household-response commentary [QA T3] | Additional clearly attributed reporting [QA T3] |

**Context-only sources**

- Emissions-pathway reporting that belongs to Climate & Environment
- Household-affordability narratives that belong to Affordability Response
- General political commentary about carbon pricing's popularity

These may shape interpretation but must not move the Carbon Pricing Policy grade without the measurement / policy / execution / challenge roles above.

**Current state delta**

Current `dimensions.json` Carbon Pricing Policy source stack:  
Canada.ca — fuel charge removal, CCI — industrial pricing, IISD — Canadian Carbon Pricing Systems: 2025 Review, PBO carbon GST revenue  
Source: [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:823)

- **Present and well-aligned**
  - `Canada.ca — fuel charge removal` fills policy/execution truth on the consumer-side delivery.
  - `CCI — industrial pricing` and `IISD — Canadian Carbon Pricing Systems: 2025 Review` fill independent-challenge truth on the industrial-side coherence problem.
  - `PBO carbon GST revenue` fills measurement/context on the consumer-side fiscal implications of eliminating the charge.

- **Gaps**
  - No direct ECCC source is present in the `sources` array even though the live OBPS headline-rate metric is sourced to ECCC and the headline/effective gap is central to the file.
  - No direct CFIB source is present in the `sources` array even though the small-business-share metric uses CFIB.
  - No direct free-allocation or comparable design-detail source is present in the `sources` array even though the scoring sheet treats industrial design strength as part of the instrument's quality.

- **Role mismatches**
  - `PBO carbon GST revenue` is best treated as consumer-side measurement/context, not as the central evidence for the industrial-side coherence problem.

- **Orphaned sources**
  - None in the current stack. Every listed source attaches to a metric, rationale line, or promise.

**Red-flag gaps**

- The headline-versus-effective-price gap is the core confounder. Stronger evidence on the headline schedule alone does not prove the instrument is functionally effective.
  Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:134) and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:854)

- Consumer carbon tax elimination is primary-homed here, but the consumer affordability savings are primary-homed in Affordability Response. The event and the household-savings effect must stay separated.
  Source: [docs/Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md:19) and [docs/Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md:20)

- Industrial OBPS emissions impact is primary-homed in Climate & Environment. This file owns the instrument's design and coherence, not the emissions outcome.
  Source: [docs/Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md:21) and [docs/Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md:22)

---

## 11. Climate & Environment

**Construct**

The scale and coherence of the federal environmental policy framework.  
Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:400)

**Core grade-moving claims**

1. Major environmental reversals occurred without a credible replacement strategy, which is the central reason the file is a D rather than a C.
   Source basis: D threshold + current `bandCriterion`, `plusMinusRationale`, and rationale in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:422), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:936), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:937), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:956)

2. Independent analysis and government acknowledgment both indicate that current policy is not on track for the 2030 target.
   Source basis: minimum indicators + rationale and promise evidence in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:412), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:956), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1065)

3. Institutional climate capacity is shrinking through ECCC budget and staffing cuts, which is part of the grade-moving framework deterioration.
   Source basis: minimum indicators + current `plusMinusRationale`, metric, and rationale in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:411), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:937), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:1008), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:956)

4. Trade-war pressure provides only partial justification; it does not explain the full scale of reversals in the live framework.
   Source basis: modifier rule + current active modifier + confounder note in [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:426), [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:432), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:940), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:956)

**Required source roles**

| Role | Status | Why |
|---|---|---|
| Measurement truth | Required | The file depends on target-pathway, capacity, and framework-status metrics. |
| Policy truth | Required | The grade turns on federal choices about caps, mandates, conservation, and replacement strategy. |
| Execution truth | Required | The file must capture whether reversals, budget cuts, and replacement plans are actually operational. |
| Independent challenge truth | Required | Off-course judgments and framework-coherence assessments require outside scrutiny. |
| Context truth | Optional | Journalism and commentary can describe political framing or operational impact but must not move the grade by themselves. |

**Preferred sources by role**

| Role | Preferred primary | Acceptable corroborators |
|---|---|---|
| Measurement truth | ECCC / CER official climate and electricity data [QA T1]; ECCC departmental plans / GC InfoBase [QA T1] | Additional official climate reporting [QA T1] |
| Policy truth | Official policy and regulatory documents on emissions cap, EV mandate, conservation, and replacement strategy [QA T1/T4] | Budget and departmental releases [QA T1/T4] |
| Execution truth | Departmental plans, staffing tables, budget execution, and formal program-status updates [QA T1] | Additional official implementation reporting [QA T1/T4] |
| Independent challenge truth | Canadian Climate Institute [QA T2]; IISD [QA T2] | Additional disclosed-methodology climate-policy analysis [QA T2] |
| Context truth | National Observer, CBC, The Conversation, and similar operational-impact reporting [QA T3] | Additional clearly attributed reporting [QA T3] |

**Context-only sources**

- Industrial carbon-price design commentary, which is primary-homed in Carbon Pricing Policy
- Broader narrative comparisons between Carney's climate reputation and governing record
- General trade-war coverage that does not speak to specific climate-policy reversals

These may shape interpretation but must not move the Climate & Environment grade without the measurement / policy / execution / challenge roles above.

**Current state delta**

Current `dimensions.json` Climate & Environment source stack:  
CCI — Canada off course, IISD — Canada's 2030 climate target, CCI — industrial pricing gaps, ECCC 2024-25 Departmental plan at a glance, ECCC 2025-26 Departmental plan at a glance, National Observer — fossil fuel course, ECCC Arctic science cuts, CBC — ECCC job and budget cuts  
Source: [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:957)

- **Present and well-aligned**
  - `CCI — Canada off course` fills independent-challenge truth on the target gap.
  - `ECCC 2024-25 Departmental plan at a glance` and `ECCC 2025-26 Departmental plan at a glance` fill measurement/execution truth on institutional capacity decline.
  - `National Observer`, `The Conversation`, and `CBC` fill context and operational-impact reporting around the reversals and departmental cuts.

- **Gaps**
  - No direct CER or equivalent official source is present in the `sources` array even though the file carries a low-carbon-electricity metric.
  - No direct official conservation / 30x30 source is present in the `sources` array even though conservation spending and target status are part of the live promise set.
  - No direct official event source is present in the `sources` array for the EV mandate repeal, even though it is a core framework reversal in the file.

- **Role mismatches**
  - `CCI — industrial pricing gaps` is best treated as context-only here, because industrial OBPS design and the headline-versus-effective-price gap are primary-homed in Carbon Pricing Policy.
  - The journalism sources are properly useful, but they should remain context/operational-impact reporting rather than primary evidence for grade movement.

- **Orphaned sources**
  - `IISD — Canada's 2030 climate target` is present in the `sources` array but does not currently attach to a live rationale, metric sourceNote, or perspectives line.

**Red-flag gaps**

- Trade-war justification is only partial. A stronger trade-war source stack would not by itself rescue the file if replacement strategy and capacity remain absent.
  Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:426) and [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:432)

- This file owns the emissions framework, not the carbon-pricing instrument. Industrial OBPS design belongs in Carbon Pricing Policy; emissions-cap status, EV mandate status, and ECCC capacity belong here.
  Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:436), [docs/Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md:21), [docs/Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md:22), [docs/Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md:38), and [docs/Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md:40)

- Stronger evidence on preserved low-carbon assets or industrial pricing does not substitute for the missing replacement strategy that would move this file upward.
  Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:421), [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:422), and [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json:936)

---

**Build note**

This draft now covers Housing Supply plus all 10 remaining graded dimensions: Ethics & Transparency, Flagship Delivery, Defence & Trade, Major Projects, Immigration, Fiscal Health, Economic Policy Response, Affordability Response, Carbon Pricing Policy, and Climate & Environment.

The next recommended step is a full-SAM review pass against QA tiers, Deconfliction-Matrix ownership, Canonical-Scoring-Sheets constructs, and the live `dimensions.json` source stacks before any integration edits are made elsewhere in the methodology layer.

# Source Authority Map

- **Purpose:** Define, per dimension, what kinds of truth the dashboard is claiming and which source roles should carry those claims.
- **Status:** Draft — Housing Supply pilot plus Ethics & Transparency and Flagship Delivery entries complete; remaining 8 dimensions pending.
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
  - `C.D. Howe — public service ratio` fills secondary independent-challenge truth on state-capacity strain.

- **Gaps**
  - No Legisinfo source is present in the `sources` array, even though bills passed is a live metric.
  - No direct home-file execution source is present in the `sources` array, even though the headline grade is mechanically derived from the five flagship-file statuses.

- **Role mismatches**
  - None in the current stack once orphaned items are set aside. The live attached sources are challenge/context-heavy, but they are not misclassified where they are actually used.

- **Orphaned sources**
  - `Policy Options — DM shuffle`, `PBO — $94B investment gap`, and `The Hub — $94B gap` do not currently attach to a live rationale, metric sourceNote, promise evidence, or perspectives line.

**Red-flag gaps**

- This is a derivative / combination dimension. Much of its measurement truth is inherited from home dimensions rather than native to Flagship Delivery.
  Source: [docs/Flagship-Delivery-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Flagship-Delivery-Rules.md:17) and [docs/Flagship-Delivery-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Flagship-Delivery-Rules.md:83)

- Double-counting risk is structural: outcome evidence belongs in the home dimensions, while Flagship Delivery owns only the execution question.
  Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:210), [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:214), and [docs/Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md:63)

- This dimension remains on probation. If it stops adding analytical value beyond the home dimensions, stronger sourcing alone will not save the construct.
  Source: [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:216), [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md:218), and [docs/Flagship-Delivery-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Flagship-Delivery-Rules.md:96)

---

**Build note**

This draft now validates the template on Housing Supply plus two Stage 3 hard cases: Ethics & Transparency and Flagship Delivery.

The next recommended build order is:

- Defence & Trade
- the remaining 7 dimensions after that stress case

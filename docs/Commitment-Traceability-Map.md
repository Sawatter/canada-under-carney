# Commitment Traceability Map

- **Purpose:** Trace each federal commitment from its public source through to the scoring path that evaluates it — joining Promise Coding Rules, the Canonical Scoring Sheets, the Source Authority Map, the Deconfliction Matrix, Measure Selection Rules, the Flagship Delivery Combination Rule, and the live Promise Tracker into a single per-commitment reference.
- **Status:** Active — full build reviewed and accepted; upstream cleanup items tracked separately.
- **Last updated:** 2026-04-18
- **Depends on:** [docs/Promise-Coding-Rules-v1.0.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Promise-Coding-Rules-v1.0.md), [docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md), [docs/Source-Authority-Map.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Source-Authority-Map.md), [docs/Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md), [docs/Measure-Selection-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Measure-Selection-Rules.md), [docs/Flagship-Delivery-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Flagship-Delivery-Rules.md), [docs/v2-Decision-Memo-Promise-Delivery.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/v2-Decision-Memo-Promise-Delivery.md), [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json)
- **Used by:** monthly update workflow (analyst discipline), source-fit reviews, commitment-centric auditor reference, public methodology / About references, cross-government portability testing

---

## Purpose of This Artifact

The Commitment Traceability Map (CTM) is a **join layer** across the existing governance stack. It does not introduce new methodology. For each federal commitment currently in scope, the CTM records:

- What the commitment is (text + where it was made)
- Which dimension scores it
- Which construct within that dimension it speaks to
- Which minimum indicators test it
- Which source roles are required to carry its evidence
- Which other dimensions it touches (context only, per the Deconfliction Matrix)
- How derivative aggregators (Flagship Delivery, Promise Delivery) handle it
- What kind of evidence would move its status or the home dimension's grade

The CTM does not own any of this content. Every field either references an authoritative upstream doc or is native to the commitment level (the commitment text, its original source, and its identifier).

The CTM answers the reader question: *"which commitment is this grade testing, what's the indicator, what source role carries it, and what else does the evidence touch?"* — without requiring the reader to assemble the chain by opening six or seven governance docs.

---

## Row Unit Definition

One row per commitment, per the inclusion test in [docs/Promise-Coding-Rules-v1.0.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Promise-Coding-Rules-v1.0.md) §What Counts as a Promise.

- A commitment is included if it is **specific and observable**, **publicly stated**, **attributable to the government**, and **material**.
- Compound commitments are split per Promise Coding Rules §How Compound Promises Are Split. One atomic commitment = one row.
- Commitments with no live Promise Tracker entry yet are still eligible if they satisfy the inclusion test; the `promise_tracker_entry` field records that absence.
- Abandoned or Thwarted commitments are retained in the CTM as historical traceability, with `update_trigger` = "—" and `derivative_handling` noting retirement status.
- Dual-leg commitments (commitments speaking to two distinct sub-constructs of a Mixed dimension) become two rows with a shared `cluster` tag rather than one blended row.

---

## Field Catalog

Each commitment row contains the following fields. For every field that references upstream content, the authoritative owner is named. The CTM cites and does not redefine.

1. **commitment_id** — CTM-native. Stable identifier in the form `{DIMENSION-PREFIX}-{NNN}` (e.g., `HOUSING-001`). The prefix follows the dimension's short name; the sequence is stable across cycles.
2. **commitment_text** — CTM-native, verbatim. The commitment wording taken from its original public statement. If the live Promise Tracker entry has rephrased the commitment, the CTM quotes the verbatim original and notes any rewording in the tracker entry reference.
3. **source_type** — Owned by [Promise-Coding-Rules-v1.0.md §What Counts as a Promise](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Promise-Coding-Rules-v1.0.md). One of: *campaign platform / throne speech / budget / mandate letter / official press conference*.
4. **source_document** — CTM-native. Specific document reference or URL for the original commitment statement. Where the original source is not in the live source stack or has not been resolved, explicitly flagged as a research residual.
5. **durability** — Owned by [Promise-Coding-Rules-v1.0.md §Durability Classification](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Promise-Coding-Rules-v1.0.md). One of: *Legislated / Program / Budget measure / Target / Framework / Commitment*. CTM uses the live value from dimensions.json where available; mismatches between dimensions.json's tag and Promise Coding Rules' tier definitions are flagged as residuals, not silently re-tagged.
6. **home_dimension** — Owned by [Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md). Single dimension (the primary scoring home). Cross-cutting commitments have exactly one primary home per Matrix rulings.
7. **promise_tracker_entry** — Reference into the live `promises` array in [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json). Null if the commitment is in-scope per Promise Coding Rules but not yet in the tracker.
8. **construct_tested** — Owned by [Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md). Cited construct phrasing from the home dimension's scoring sheet; for dual-leg dimensions (Defence & Trade), specify which leg and cite the sub-construct. For Mixed dimensions, name the component of the construct this specific commitment speaks to.
9. **primary_indicators** — Owned by [Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md). Which of the home dimension's minimum indicators apply to this specific commitment. If the commitment's construct-component has no defined minimum indicator in CSS, this field flags that gap explicitly rather than inventing one.
10. **source_roles_required** — Owned by [Source-Authority-Map.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Source-Authority-Map.md). Which SAM roles (*measurement / policy / execution / independent challenge / context*) are load-bearing for this specific commitment's evidence. SAM's dimension-level role-requirement set is the permissive upper bound; the CTM names the subset this commitment actually uses. Roles not load-bearing for this commitment are marked "not applicable to this commitment" and the reason is given briefly.
11. **deconfliction_notes** — Owned by [Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md). Other dimensions this commitment's evidence touches. Cites Matrix rows by metric name. Context-only / blocked-from relationships are named explicitly.
12. **derivative_handling** — Owned by [Flagship-Delivery-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Flagship-Delivery-Rules.md) and [v2-Decision-Memo-Promise-Delivery.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/v2-Decision-Memo-Promise-Delivery.md). Two lines: (a) how Flagship Delivery treats the commitment (delivery indicator only, never outcome) for commitments that are one of the five flagship files; and (b) the uniform Promise Delivery aggregation note.
13. **update_trigger** — Owned by [Promise-Coding-Rules-v1.0.md §What Evidence Changes a Status](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Promise-Coding-Rules-v1.0.md) and [Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md) one-notch triggers. The kind of evidence that would move this commitment's Promise Tracker status or materially affect the home dimension's grade. Distinct from current status, which lives in the Promise Tracker and is not a CTM field.
14. **measurement_rules_notes** — Owned by [Measure-Selection-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Measure-Selection-Rules.md). Relevant canonical measurement specifications for the commitment's indicators (e.g., food CPI stores YoY not MoM; NATO-confirmed % GDP not domestic claim; BCH stage labels). If MSR has no rule relevant to this commitment, the field is "—" and is a candidate for MSR extension in a future pass.

---

## Non-Goals

The CTM must **not**:

- Become a second scoring sheet. Constructs, thresholds, and modifier rules belong in [Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md).
- Duplicate the Promise Tracker. Live status and evidence belong in the `promises` arrays in [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json).
- Duplicate the Source Authority Map. Source-role taxonomy and per-dimension role-requirement sets belong in [Source-Authority-Map.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Source-Authority-Map.md).
- Duplicate the Deconfliction Matrix. Primary-home, secondary-mention, and blocked-from assignments belong in [Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md).
- Become a full metric registry. Canonical metric definitions, units, and time windows belong in [Measure-Selection-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Measure-Selection-Rules.md).
- Perform claim entailment. Whether a specific source actually supports a specific claim belongs in [docs/v2/verification/Source-Verification-Protocol.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/v2/verification/Source-Verification-Protocol.md).
- Restrict scope to campaign platform commitments. All five source types recognized by Promise Coding Rules are eligible.
- Carry dimensional metadata. Dimension-level attributes (attribution splits, confidence tags, active modifiers, grade, GPA) belong in [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json) and the Canonical Scoring Sheets.
- Carry current status. Commitment status is live and updates monthly in the Promise Tracker; the CTM lives at the commitment-and-mapping layer, not the evaluation layer.

---

## Special-Case Handling Rules

**Flagship Delivery.** Commitments homed in Defence & Trade, Housing Supply, Major Projects, Climate & Environment, or Immigration may also appear in Flagship Delivery as delivery indicators. `home_dimension` stays single (the original home). `derivative_handling` names the Flagship treatment explicitly: *"Flagship Delivery uses this as a delivery indicator (execution machinery), not an outcome indicator, per [Flagship-Delivery-Rules.md §Overlap Prevention](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Flagship-Delivery-Rules.md)."*

**Promise Delivery.** All commitments flow into Promise Delivery as an ungraded aggregate. `derivative_handling` carries a uniform second line: *"Aggregated in Promise Delivery (ungraded tracker; not in GPA), per [v2-Decision-Memo-Promise-Delivery.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/v2-Decision-Memo-Promise-Delivery.md)."*

**Defence & Trade dual construct.** `construct_tested` specifies which leg (defence input / trade outcome / blended). Commitments speaking to both legs become two rows with a shared `cluster` tag rather than one blended row. The sub-score framing from [Canonical-Scoring-Sheets.md §12 Defence & Trade](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md) is authoritative for which leg a commitment belongs to.

**Ethics & Transparency thin-by-design.** Most Ethics commitments are process/framework claims. `primary_indicators` typically references the status fields (Commissioner review, blind trust status, agreed measure filing, declared screen scope, independent governance review). `source_roles_required` typically names policy + execution + challenge; measurement is commonly "not applicable to this commitment" per the Process construct type in [Source-Authority-Map.md §Construct-Type Guidance](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Source-Authority-Map.md).

**Cross-cutting commitments.** Example: a gas tax suspension is primary-homed in Fiscal Health per the Matrix, with secondary mention in Affordability Response and Climate & Environment. `home_dimension` is single. `deconfliction_notes` lists the secondary dimensions with their Matrix-defined role (context only). The CTM does not invent secondary primary homes.

**Commitments without a live tracker entry.** Some commitments satisfy Promise Coding Rules inclusion but have not yet been entered in the `promises` arrays. `promise_tracker_entry` = "—" with a note that the commitment is in-scope but pending tracker inclusion. The CTM entry is the forcing function for next-cycle tracker inclusion.

**Retired commitments (Abandoned / Thwarted).** CTM rows stay in the file for historical audit trail. `update_trigger` = "—" and `derivative_handling` notes retirement status. Commitment text and source are preserved verbatim.

**Commitments whose home dimension is ambiguous.** Where a commitment could plausibly live in two dimensions, the CTM follows the live home assignment in dimensions.json and flags the alternative home in `deconfliction_notes`. Re-homing is a separate methodology decision; the CTM surfaces the question but does not resolve it.

---

## Relationship to Existing Governance Docs

- **[docs/Promise-Coding-Rules-v1.0.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Promise-Coding-Rules-v1.0.md)** owns the definition of what counts as a commitment, the source-type classification, durability tiers, status categories, and status-move evidence matrix. The CTM inherits all of these by reference.
- **[docs/Canonical-Scoring-Sheets.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md)** owns constructs, thresholds, minimum indicators, modifier rules, triggers, and rater notes. The CTM's `construct_tested`, `primary_indicators`, and parts of `update_trigger` reference CSS; CSS is authoritative.
- **[docs/Source-Authority-Map.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Source-Authority-Map.md)** owns source-role taxonomy and per-dimension role-requirement sets. The CTM's `source_roles_required` names which roles are load-bearing for a specific commitment within its home dimension's role set; SAM is authoritative on role definitions and dimension-level role allocations.
- **[docs/Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md)** owns primary-home, secondary-mention, and blocked-from assignments per metric or event. The CTM's `home_dimension` and `deconfliction_notes` cite Matrix rows; the Matrix wins any conflict.
- **[docs/Measure-Selection-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Measure-Selection-Rules.md)** owns canonical measurement specifications (basket, unit, time window, stage labels). The CTM's `measurement_rules_notes` cites MSR sections relevant to a commitment's indicators.
- **[docs/Flagship-Delivery-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Flagship-Delivery-Rules.md)** owns the Combination Rule mechanics and the overlap-prevention discipline for flagship files. The CTM's `derivative_handling` cites Flagship-Delivery-Rules for any commitment that is a flagship file indicator.
- **[docs/v2-Decision-Memo-Promise-Delivery.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/v2-Decision-Memo-Promise-Delivery.md)** owns the decision that Promise Delivery remains an ungraded tracker. The CTM's `derivative_handling` reflects that decision uniformly.
- **[src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json)** owns live commitment status, evidence, and history. The CTM's `promise_tracker_entry` references but does not duplicate; status is not a CTM field.
- **[docs/v2/verification/Source-Verification-Protocol.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/v2/verification/Source-Verification-Protocol.md)** owns claim entailment and verification status. The CTM names required source roles; SVP verifies whether specific sources actually support specific claims.

---

## 1. Housing Supply

### HOUSING-001 — "500,000 homes/year over next decade"

- **commitment_id:** `HOUSING-001`
- **commitment_text:** "500,000 homes/year over next decade"
- **source_type:** campaign platform
- **source_document:** Original Liberal platform commitment. The specific platform document is not currently cited in the live source stack; [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json) promise entry carries the commitment text but not a platform URL. **Residual:** source document reference needs to be resolved in a next-cycle research pass; CTM flags the gap rather than inventing a citation.
- **durability:** Commitment *(live tag in [dimensions.json promises[0]](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json))*. **Note:** Promise Coding Rules §Durability Classification defines "Target" as *"A stated goal without a legislated mechanism"* which arguably fits better than "Commitment" (the lowest-durability tier). Potential durability re-tag flagged as a residual for a separate hygiene pass.
- **home_dimension:** Housing Supply
- **promise_tracker_entry:** [dimensions.json promises[0]](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json) — text matches verbatim; current status Stalled.
- **construct_tested:** "The scale and effectiveness of federal housing policy interventions relative to identified need" *(verbatim from [Canonical-Scoring-Sheets.md:271](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*. Specifically the **scale** component — tests whether federal delivery approaches the stated target relative to CMHC's annual need estimate.
- **primary_indicators:**
  - Housing starts annualized *(CMHC / StatsCan 34-10-0158-01, per [Canonical-Scoring-Sheets.md:280](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*
  - CMHC annual need gap *(per [Canonical-Scoring-Sheets.md:281](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md), 430-480K annual construction need)*
  - Federal housing spending trajectory *(per [Canonical-Scoring-Sheets.md:283](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*
- **source_roles_required:**
  - **Measurement (required):** CMHC / StatsCan starts series [QA T1]; CMHC housing-need publications [QA T1]
  - **Independent challenge (required):** PBO on federal program scale vs need [QA T1]; think-tank analysis of target viability (Policy Options / IRPP, C.D. Howe) [QA T2]
  - **Policy (not load-bearing for this commitment):** the commitment itself is a target-only; it does not rest on a specific legislated mechanism. Policy evidence bears on the mechanism (Build Canada Homes, Canada-Ontario Partnership) tracked separately.
  - **Execution (not load-bearing for this commitment):** same reasoning; execution evidence bears on the mechanism commitments.
  - **Context (optional):** journalism on municipal/provincial bottlenecks; supply-only-versus-affordability commentary.
- **deconfliction_notes:**
  - Housing starts → primary home Housing Supply; secondary mention in Flagship Delivery (as delivery indicator); blocked from Affordability Response *(per [Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md))*
  - Federal housing spending trajectory → primary home Housing Supply; secondary mention in Fiscal Health (as context for spending composition)
- **derivative_handling:**
  - Flagship Delivery uses housing as one of the five flagship files; this commitment's status contributes to the housing file's delivery assessment as a delivery indicator (execution machinery), not as an outcome indicator, per [Flagship-Delivery-Rules.md §Overlap Prevention](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Flagship-Delivery-Rules.md).
  - Aggregated in Promise Delivery (ungraded tracker; not in GPA), per [v2-Decision-Memo-Promise-Delivery.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/v2-Decision-Memo-Promise-Delivery.md).
- **update_trigger:**
  - Annual CMHC completions data materially moves toward or away from the 500K/year threshold
  - Federal housing spending trajectory reverses from its current declining path *(currently projected to decline from $9.8B to $4.3B by 2028-29 per PBO RP-2526-020-S)*
  - Formal government abandonment of the target (would move status to Abandoned per Promise Coding Rules)
- **measurement_rules_notes:** [Measure-Selection-Rules.md §Housing Supply](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Measure-Selection-Rules.md) — starts are measured as SAAR for trend; annual actual starts for target comparisons; cannot mix monthly SAAR with annual actuals without labeling.

---

### HOUSING-002 — "Build Canada Homes"

- **commitment_id:** `HOUSING-002`
- **commitment_text:** "Build Canada Homes"
- **source_type:** official press conference (the live source is an official Housing Infrastructure Canada news release announcing the program)
- **source_document:** [canada.ca — Build Canada Homes news release](https://www.canada.ca/en/housing-infrastructure-communities/news/2026/01/build-canada-homes-thousands-of-homes-in-the-pipeline.html) *(cited in the BCH metric sourceNote in [dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json))*
- **durability:** Commitment *(live tag in [dimensions.json promises[1]](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json))*. **Note:** now that BCH is a funded program with institutional structure, Promise Coding Rules' "Program" durability (defined as *"Funded program with institutional structure"*) arguably fits better than "Commitment". Potential durability re-tag flagged as a residual.
- **home_dimension:** Housing Supply
- **promise_tracker_entry:** [dimensions.json promises[1]](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json) — text matches verbatim; current status In Progress since 2025-09-14.
- **construct_tested:** "The scale and effectiveness of federal housing policy interventions relative to identified need" *(verbatim from [Canonical-Scoring-Sheets.md:271](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*. Specifically the **federal-program-scale and execution** components — tests whether BCH delivers at a scale proportionate to need, and whether announced pipeline converts to actual construction.
- **primary_indicators:**
  - BCH units (announced / started / completed — distinguished) *(per [Canonical-Scoring-Sheets.md:282](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*
  - Federal housing spending trajectory *(per [Canonical-Scoring-Sheets.md:283](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*
  - Housing starts annualized *(as context for BCH scale vs overall need)*
- **source_roles_required:**
  - **Policy (required):** Housing Infrastructure Canada BCH program materials [QA T4 unless operational figures are reported directly]
  - **Execution (required):** direct evidence that BCH construction has commenced — currently *"construction not yet underway"* per [dimensions.json BCH metric sourceNote](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json)
  - **Measurement (required):** CMHC starts/completions data [QA T1]; BCH unit counts by stage label
  - **Independent challenge (required):** PBO BCH forecast (~26,000 units over 5 years; RP-2526-020-S) [QA T1]
  - **Context (optional):** coverage of municipal partnership sites and factory-built unit delivery ramps
- **deconfliction_notes:**
  - BCH units → primary home Housing Supply; secondary mention in Flagship Delivery (as housing delivery evidence) *(per [Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md))*
  - Federal housing spending → primary home Housing Supply; secondary mention in Fiscal Health (as context for spending composition)
- **derivative_handling:**
  - Flagship Delivery uses BCH pipeline status as a delivery indicator for the housing flagship file, per [Flagship-Delivery-Rules.md §Overlap Prevention](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Flagship-Delivery-Rules.md). The question answered is *"is the government executing on BCH?"*, not *"is BCH's policy direction good?"* — the latter is the Housing Supply home question.
  - Aggregated in Promise Delivery (ungraded tracker; not in GPA), per [v2-Decision-Memo-Promise-Delivery.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/v2-Decision-Memo-Promise-Delivery.md).
- **update_trigger:**
  - First BCH construction commencement (moves from *announced* to *started* per Measure Selection Rules stage labels — a material shift in the execution evidence base)
  - PBO updated projection materially revising the 26,000-unit five-year forecast
  - Annual federal housing spending outturn confirming or contradicting the 56% decline trajectory by 2028-29
- **measurement_rules_notes:** [Measure-Selection-Rules.md §Housing Supply stage labels](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Measure-Selection-Rules.md) — *Announced / Introduced / Passed / Authorized / Disbursing / Delivering / Completed*. Current BCH status under MSR discipline: **Announced** (construction not yet underway). *"Started"* and *"announced"* must not be conflated; construction commencement is the threshold for *Started*.

---

### HOUSING-003 — "Canada-Ontario Partnership ($8.8B)"

- **commitment_id:** `HOUSING-003`
- **commitment_text:** "Canada-Ontario Partnership ($8.8B)"
- **source_type:** official press conference (PMO announcement March 30, 2026)
- **source_document:** [pm.gc.ca — Canada-Ontario Partnership announcement](https://www.pm.gc.ca/en/news/news-releases/2026/03/30/prime-minister-carney-secures-new-partnership-ontario-cut-taxes) *(cited in Housing Supply sources array in [dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json))*
- **durability:** Program *(live tag in [dimensions.json promises[2]](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json))*. Matches Promise Coding Rules' "Program" tier (*"Funded program with institutional structure"*).
- **home_dimension:** Housing Supply
- **promise_tracker_entry:** [dimensions.json promises[2]](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json) — text matches verbatim; current status In Progress since 2026-03-30.
- **construct_tested:** "The scale and effectiveness of federal housing policy interventions relative to identified need" *(verbatim from [Canonical-Scoring-Sheets.md:271](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*. Specifically the **federal-provincial-agreement and scale** components — tests the federal contribution to a shared-jurisdiction problem via partnership instruments (development charge reform, HST treatment).
- **primary_indicators:**
  - Federal-provincial agreement status *(per [Canonical-Scoring-Sheets.md:284](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*
  - Federal housing spending trajectory (the $8.8B over 10 years contributes here)
  - Housing starts annualized (as context for whether partnership moves starts attributable to partnership mechanisms)
- **source_roles_required:**
  - **Policy (required):** partnership agreement text and PMO announcement materials [QA T4]
  - **Execution (required):** evidence that HST exemption is operational and that Ontario development charges have actually been reduced at the municipal level; current evidence is at policy stage, not operational stage
  - **Independent challenge (required):** expert housing analysis on partnership scope and likely impact — e.g., Mike Moffatt's characterization noted in the Housing Supply defenders text
  - **Measurement (optional for this commitment's current stage; required as implementation matures):** CMHC starts series showing partnership-attributable effects
  - **Context (optional):** municipal and provincial commentary on development-charge reform uptake
- **deconfliction_notes:**
  - Development charge reforms (Ontario deal) → primary home Housing Supply; secondary mention in Flagship Delivery (as federal-provincial delivery evidence) *(per [Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md))*
  - The federal-provincial coordination quality aspect also appears as a Flagship Delivery metric *("Federal-provincial coordination: Weak (Policy Options)"* per the Flagship metrics array); the partnership is counter-evidence to the default "Weak" characterization for the Ontario case specifically, and Flagship Delivery's assessment must weigh that accordingly.
- **derivative_handling:**
  - Flagship Delivery uses the partnership as federal-provincial delivery evidence on the housing flagship file, per [Flagship-Delivery-Rules.md §Overlap Prevention](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Flagship-Delivery-Rules.md) — the question is *"is the federal government delivering on the partnership instruments?"*, not *"is the partnership the right policy?"*.
  - Aggregated in Promise Delivery (ungraded tracker; not in GPA), per [v2-Decision-Memo-Promise-Delivery.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/v2-Decision-Memo-Promise-Delivery.md).
- **update_trigger:**
  - First documented starts attributable to the partnership mechanisms (development-charge cuts in force; HST exemption disbursing)
  - Formal renewal, expansion, or cancellation of the partnership
  - Evidence that other provinces have entered or declined comparable partnerships (which would materially change Housing Supply's "shared-jurisdiction problem" framing)
- **measurement_rules_notes:** [Measure-Selection-Rules.md §Housing Supply stage labels](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Measure-Selection-Rules.md) — partnership is currently at **Announced / Introduced** stage. *Disbursing* and *Delivering* stages require operational evidence (HST exemption in force; development charges actually reduced at municipal level).

---

### HOUSING-004 — "Apprenticeship training up to $8,000"

- **commitment_id:** `HOUSING-004`
- **commitment_text:** "Apprenticeship training up to $8,000"
- **source_type:** budget (Budget 2025)
- **source_document:** Budget 2025 (the live [dimensions.json promises[3]](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json) evidence text names Budget 2025 but there is no specific Budget 2025 URL in the Housing Supply `sources` array; Budget 2025 is cited in the Fiscal Health dimension's sources array as `Budget 2025 — Annex 1`, which is related but not the same citation). **Residual:** specific Budget 2025 chapter citation for the apprenticeship training program needs to be resolved in a next-cycle source-hardening pass.
- **durability:** Program *(live tag in [dimensions.json promises[3]](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json))*. Matches Promise Coding Rules' "Program" tier.
- **home_dimension:** Housing Supply
- **promise_tracker_entry:** [dimensions.json promises[3]](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json) — text matches verbatim; current status In Progress.
- **construct_tested:** This is the **most stress-testing commitment in the Housing Supply pilot**. The Housing Supply construct is *"scale and effectiveness of federal housing policy interventions relative to identified need"* ([Canonical-Scoring-Sheets.md:271](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md)). Apprenticeship training is a construction-labour-capacity input to housing delivery — an oblique link to the home construct, not a direct scale or effectiveness measure. The commitment is homed in Housing Supply in the live data; a case could be made for re-homing to Economic Policy Response (productivity / labour-market policy). **Re-homing question flagged as a residual** — the CTM follows the live assignment and surfaces the question without resolving it.
- **primary_indicators:**
  - The Housing Supply minimum-indicators list in [Canonical-Scoring-Sheets.md:279-284](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md) does not currently include an apprenticeship, labour-supply, or construction-workforce indicator. This commitment has **no direct minimum indicator in its current home dimension**. Program enrollment and disbursement data exist but are not minimum indicators under the live CSS. **Residual:** either CSS Housing Supply minimum indicators need a labour-capacity addition, or this commitment should be re-homed. Not resolved by the CTM; surfaced here.
  - Indirect indicators: federal housing spending trajectory (the $8,000 per apprentice program is a federal spending line); Construction insolvencies highest of any sector *(noted in the Housing Supply inherited-baseline text in [dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json))* — labour capacity bears on this.
- **source_roles_required:**
  - **Policy (required):** Budget 2025 announcement of the program [QA T1 if cited as the budget document itself; T4 if cited as a press release about the budget]
  - **Execution (required):** enrollment data; disbursement evidence — *"Enrollment data not yet available"* per [dimensions.json promises[3] evidence](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json)
  - **Measurement (gap):** no canonical home-dimension measurement indicator for this commitment exists (see primary_indicators residual above)
  - **Independent challenge (optional):** labour-market or construction-sector analysis on apprenticeship program effectiveness; not strongly load-bearing given the program's early implementation stage
  - **Context (optional):** sector-specific reporting on construction labour supply
- **deconfliction_notes:**
  - This commitment primarily touches labour-market / productivity territory, which is the domain of Economic Policy Response per [Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md). The Matrix does not currently have a row for apprenticeship programs; if and when the program materially affects productivity indicators, primary-home assignment may need Matrix clarification.
  - Federal program spending on apprenticeship → context only in Fiscal Health.
- **derivative_handling:**
  - Flagship Delivery's housing flagship file tracks BCH pipeline, starts trajectory, federal spending execution, and federal-provincial coordination ([Flagship-Delivery-Rules.md §The 5 Flagship Files](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Flagship-Delivery-Rules.md)). Apprenticeship training is not one of those sub-file indicators. **This commitment does not feed Flagship Delivery's housing assessment directly.**
  - Aggregated in Promise Delivery (ungraded tracker; not in GPA), per [v2-Decision-Memo-Promise-Delivery.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/v2-Decision-Memo-Promise-Delivery.md).
- **update_trigger:**
  - First enrollment data published
  - First disbursement data (dollars flowing to apprentices)
  - Any federal re-classification of the program (e.g., moved into a productivity program or expanded beyond construction trades)
- **measurement_rules_notes:** [Measure-Selection-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Measure-Selection-Rules.md) does not currently specify a canonical measure for apprenticeship or construction-labour programs. **Residual:** potential MSR extension if this commitment's indicators become grade-moving.

---

## 2. Fiscal Health

### FISCAL-001 — "Balance operational budget in 3 years"

- **commitment_id:** `FISCAL-001`
- **commitment_text:** "Balance operational budget in 3 years"
- **source_type:** campaign platform
- **source_document:** **Residual:** original campaign platform URL not in the live Fiscal Health `sources` array; flag for next-cycle source-hardening.
- **durability:** Commitment *(live tag in [dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json))*. **Note:** PCR "Target" tier (stated goal without a legislated mechanism) arguably fits better; re-tag flagged as residual.
- **home_dimension:** Fiscal Health
- **promise_tracker_entry:** Fiscal Health `promises[0]` in [dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json); status Stalled.
- **construct_tested:** "The sustainability of the federal fiscal trajectory and the credibility of the medium-term fiscal plan" *(verbatim from [Canonical-Scoring-Sheets.md:228](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*. Specifically the **credibility-of-medium-term-anchor** component.
- **primary_indicators:** PBO confidence in medium-term targets; deficit (absolute and as % GDP) *(per [Canonical-Scoring-Sheets.md:236](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*.
- **source_roles_required:**
  - **Measurement (required):** Finance Canada deficit figures [QA T1]; PBO fiscal outlook [QA T1]
  - **Independent challenge (required):** PBO confidence [QA T1]; IMF Article IV [QA T1]; rating agencies (event-driven) [QA T1]; C.D. Howe / IFSD [QA T2]
  - **Policy (not load-bearing for this commitment):** target-only, no specific delivery mechanism
  - **Execution (not load-bearing):** same reasoning; execution bears on underlying spending/revenue measures (FISCAL-002, FISCAL-003, FISCAL-004) separately
  - **Context (optional):** fiscal-politics commentary
- **deconfliction_notes:** Deficit → primary home Fiscal Health; blocked from Economic Policy Response. PBO fiscal confidence → primary home Fiscal Health. *(per [Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md))*
- **derivative_handling:** Flagship Delivery does not include Fiscal Health as one of its five flagship files; this commitment does not feed Flagship's delivery assessment. Aggregated in Promise Delivery (ungraded tracker; not in GPA), per [v2-Decision-Memo-Promise-Delivery.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/v2-Decision-Memo-Promise-Delivery.md).
- **update_trigger:** PBO confidence rises above 25%; credible medium-term anchor announced; formal abandonment of 3-year balance timeline.
- **measurement_rules_notes:** [Measure-Selection-Rules.md §Fiscal Health](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Measure-Selection-Rules.md) — federal deficit fiscal year (PBO or Finance Canada); PBO projections older than 6 months must be qualified with publication date; general government ≠ federal.

---

### FISCAL-002 — "Reduce civil service by ~40,000"

- **commitment_id:** `FISCAL-002`
- **commitment_text:** "Reduce civil service by ~40,000"
- **source_type:** campaign platform
- **source_document:** **Residual:** original platform URL not in live source stack.
- **durability:** Commitment *(live tag)*. **Note:** "Program" arguably fits once the Budget 2025 spending review became operational; re-tag flagged as residual.
- **home_dimension:** Fiscal Health
- **promise_tracker_entry:** Fiscal Health `promises[1]`; status In Progress.
- **construct_tested:** [CSS:228](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md) construct — **spending-path** component.
- **primary_indicators:** Net debt trajectory; deficit trajectory *(per [CSS:236](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*. **Gap:** no direct civil-service-headcount indicator in the Fiscal Health minimum-indicators list; commitment tested indirectly via debt/deficit path.
- **source_roles_required:**
  - **Policy (required):** Budget 2025 spending review documentation [QA T1]; workforce-reduction plan
  - **Execution (required):** annual Public Accounts / Treasury Board departmental plans on realized headcount reductions [QA T1]
  - **Independent challenge (required):** Broadbent Institute on service-delivery impacts; PBO on whether reductions materially affect the fiscal path
  - **Measurement (optional):** annual Public Accounts civil-service headcount series
  - **Context (optional):** PSAC commentary
- **deconfliction_notes:** Civil-service reduction is primary-homed in Fiscal Health (spending path). The 40,000 figure also surfaces in Flagship Delivery's critics perspective as **state-capacity context only** (not grade-moving for Flagship per [Flagship-Delivery-Rules.md §Overlap Prevention](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Flagship-Delivery-Rules.md)).
- **derivative_handling:** Flagship Delivery uses the workforce-reduction figure as context for state-capacity critique (visible in critics text), not as an outcome indicator or delivery indicator. Aggregated in Promise Delivery.
- **update_trigger:** Annual Public Accounts confirmation of actual headcount reductions; PBO assessment of spending-review delivery vs plan; formal scaling-back or abandonment.
- **measurement_rules_notes:** [Measure-Selection-Rules.md §Fiscal Health](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Measure-Selection-Rules.md) general applies; no MSR rule specific to workforce reductions. **Residual:** potential MSR extension if workforce-headcount becomes a cycle metric.

---

### FISCAL-003 — "Middle class income tax cut"

- **commitment_id:** `FISCAL-003`
- **commitment_text:** "Middle class income tax cut"
- **source_type:** campaign platform; Budget 2025 implementation
- **source_document:** [Budget 2025 Annex 1](https://budget.canada.ca/2025/report-rapport/anx1-en.html) *(in Fiscal Health `sources` array)*.
- **durability:** Budget measure *(live tag matches PCR tier)*.
- **home_dimension:** Fiscal Health
- **promise_tracker_entry:** Fiscal Health `promises[2]`; status Delivered 2025-11-04.
- **construct_tested:** [CSS:228](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md) construct — **fiscal-policy-instrument** component.
- **primary_indicators:** Deficit trajectory; debt service costs vs GST revenue *(per [CSS:236](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*.
- **source_roles_required:**
  - **Policy (required):** Budget 2025 measure as enacted [QA T1]
  - **Execution (required):** CRA implementation of rate change [QA T1]
  - **Measurement (optional):** revenue impact in Public Accounts and PBO post-implementation analysis
  - **Independent challenge (optional):** PBO / IFSD / C.D. Howe on fiscal impact
- **deconfliction_notes:** Tax-cut revenue impact → primary home Fiscal Health (deficit). Affordability implications are incidental context; relief for household cost pressure is distinct from broad income-tax cuts and is tracked under Affordability Response.
- **derivative_handling:** Does not feed Flagship Delivery. Aggregated in Promise Delivery.
- **update_trigger:** Policy reversal that repeals the measure; revenue outturn materially different from Budget 2025 projection; follow-on fiscal measure that changes the net balance.
- **measurement_rules_notes:** [Measure-Selection-Rules.md §Fiscal Health](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Measure-Selection-Rules.md).

---

### FISCAL-004 — "Cancel capital gains tax increase"

- **commitment_id:** `FISCAL-004`
- **commitment_text:** "Cancel capital gains tax increase"
- **source_type:** campaign platform; Budget 2025 implementation
- **source_document:** [Budget 2025 Annex 1](https://budget.canada.ca/2025/report-rapport/anx1-en.html) *(in Fiscal Health `sources` array)*.
- **durability:** Budget measure *(live tag matches PCR tier)*.
- **home_dimension:** Fiscal Health
- **promise_tracker_entry:** Fiscal Health `promises[3]`; status Delivered 2025-11-04.
- **construct_tested:** [CSS:228](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md) construct — **fiscal-policy-instrument** component (revenue reversal).
- **primary_indicators:** Deficit trajectory; revenue impact on debt service-to-revenue ratio *(per [CSS:236](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*.
- **source_roles_required:**
  - **Policy (required):** Budget 2025 reversal [QA T1]
  - **Execution (required):** CRA implementation [QA T1]
  - **Independent challenge (optional):** Fraser Institute acknowledgement (in live evidence text) [QA T2]; PBO fiscal impact
  - **Measurement (optional):** foregone revenue projections
- **deconfliction_notes:** Fiscal-policy measure; primary home Fiscal Health. Investment-climate implications are context for Economic Policy Response but not grade-moving per [Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md).
- **derivative_handling:** Does not feed Flagship Delivery. Aggregated in Promise Delivery.
- **update_trigger:** Policy reversal reintroducing the tax increase; material revenue outturn divergence.
- **measurement_rules_notes:** [Measure-Selection-Rules.md §Fiscal Health](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Measure-Selection-Rules.md).

---

## 3. Affordability Response

### AFFORD-001 — "Canada Groceries and Essentials Benefit"

- **commitment_id:** `AFFORD-001`
- **commitment_text:** "Canada Groceries and Essentials Benefit"
- **source_type:** budget (Budget 2025 implementation)
- **source_document:** Budget 2025. **Residual:** specific Budget 2025 chapter URL for the benefit is not in the Affordability Response `sources` array; source-hardening candidate.
- **durability:** Budget measure *(live tag matches PCR tier)*.
- **home_dimension:** Affordability Response
- **promise_tracker_entry:** Affordability Response `promises[0]`; status Delivered 2025-11-04.
- **construct_tested:** "The adequacy of the federal government's policy response to household cost pressure from groceries, tariffs, and targeted relief programs" *(verbatim from [Canonical-Scoring-Sheets.md:14](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*. Specifically the **federal-relief-scale** component.
- **primary_indicators:** Grocery benefit amount per household (PBO); tariff household cost burden estimate *(per [CSS:22](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*; food insecurity population (PROOF).
- **source_roles_required:**
  - **Policy (required):** GST/HST Credit top-up program materials [QA T1]
  - **Execution (required):** CRA disbursement data [QA T1]
  - **Measurement (required):** PBO per-household estimate (~$307) and family-of-four total (~$1,890) [QA T1]
  - **Independent challenge (optional):** PROOF food insecurity series [QA T2]; CCPA / Broadbent on scale-vs-burden ratio [QA T2/T3]
  - **Context (optional):** mainstream affordability reporting
- **deconfliction_notes:** Grocery benefit → primary home Affordability Response. Fiscal Health may reference the program's spending-composition context only (not grade-moving for Fiscal). Consumer carbon tax affordability savings remain separately primary-homed in Affordability Response per [Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md).
- **derivative_handling:** Does not feed Flagship Delivery. Aggregated in Promise Delivery.
- **update_trigger:** Program renewal, expansion, or expiry; revised PBO per-household estimate; material shift in tariff household cost burden that changes the relief-vs-burden ratio.
- **measurement_rules_notes:** [Measure-Selection-Rules.md §Affordability Response](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Measure-Selection-Rules.md) — food CPI stores YoY (StatsCan 18-10-0004-01) is the primary affordability-pressure measure; grocery benefit per household is the primary relief measure. Do not mix CPI basket measure with average retail prices.

---

### AFFORD-002 — "Grocery Code of Conduct"

- **commitment_id:** `AFFORD-002`
- **commitment_text:** "Grocery Code of Conduct"
- **source_type:** official press conference
- **source_document:** **Residual:** specific government announcement URL for the Grocery Code launch is not in the Affordability Response `sources` array.
- **durability:** Commitment *(live tag)*. **Note:** PCR "Framework" arguably fits better (voluntary code with institutional structure but not legislated); re-tag flagged as residual.
- **home_dimension:** Affordability Response
- **promise_tracker_entry:** Affordability Response `promises[1]`; status Delivered 2026-01-01.
- **construct_tested:** [CSS:14](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md) construct — **competition-instrument** component.
- **primary_indicators:** **Gap:** Affordability Response minimum-indicators list does not include a direct competition-instrument measure for grocery markets. Indirectly tested via food CPI stores YoY and relief-vs-burden ratio. **Residual:** CSS minimum indicators do not cover voluntary competition codes.
- **source_roles_required:**
  - **Policy (required):** Grocery Code framework text [QA T1/T4]
  - **Execution (required):** evidence Code is operational from Jan 1, 2026; signatory industry participation list
  - **Measurement (required, indirect):** food CPI stores YoY (StatsCan)
  - **Independent challenge (required):** expert analysis on whether voluntary codes lower retail prices (live evidence in dimensions.json notes experts "broadly aligned it will not lower retail prices")
- **deconfliction_notes:** Primary-homed in Affordability Response. Competition Bureau investigations are related but separately governed (not a CTM concern for this row).
- **derivative_handling:** Does not feed Flagship Delivery. Aggregated in Promise Delivery.
- **update_trigger:** Formal revision of the Code to add mandatory provisions; documented retail-price effect; abandonment or restructuring.
- **measurement_rules_notes:** [Measure-Selection-Rules.md §Affordability Response](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Measure-Selection-Rules.md) — CSS threshold language treats "voluntary measures" as not grade-moving on their own; effectiveness is measured via CPI outcome rather than code-adoption metric.

---

### AFFORD-003 — "Buy Canadian food labelling"

- **commitment_id:** `AFFORD-003`
- **commitment_text:** "Buy Canadian food labelling"
- **source_type:** official press conference
- **source_document:** **Residual:** original announcement URL not in live source stack.
- **durability:** Commitment *(live tag)*. **Note:** "Framework" arguably fits once implementation details are published; re-tag candidate.
- **home_dimension:** Affordability Response
- **promise_tracker_entry:** Affordability Response `promises[2]`; status In Progress.
- **construct_tested:** [CSS:14](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md) construct — **policy-instrument** component.
- **primary_indicators:** **Gap:** no direct Affordability Response minimum indicator tests food-labelling effectiveness. **Residual:** indicator anchor is thin.
- **source_roles_required:**
  - **Policy (required):** federal food-labelling framework materials [QA T1/T4]
  - **Execution (required):** CFIA or ISED implementation evidence
  - **Independent challenge (optional):** consumer-protection or competition analysis
  - **Measurement (optional):** consumer-purchase-pattern data if available
- **deconfliction_notes:** Primary-homed in Affordability Response. Related to but distinct from Defence & Trade's "Buy Canadian procurement strategy" (DEFTRADE-004); the two should not be conflated.
- **derivative_handling:** Does not feed Flagship Delivery. Aggregated in Promise Delivery.
- **update_trigger:** Implementation details published; CFIA regulation enacted; documented consumer-purchase effect.
- **measurement_rules_notes:** [Measure-Selection-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Measure-Selection-Rules.md) does not specify a canonical measure for food-labelling programs. **Residual:** MSR extension candidate.

---

## 4. Carbon Pricing Policy

### CARBON-001 — "Eliminate consumer carbon tax"

- **commitment_id:** `CARBON-001`
- **commitment_text:** "Eliminate consumer carbon tax"
- **source_type:** campaign platform; official press conference (Day 1 action)
- **source_document:** [Canada.ca — fuel charge removal effective April 1, 2025](https://www.canada.ca/en/department-finance/news/2025/03/removing-the-consumer-carbon-price-effective-april-1-2025.html) *(in Carbon Pricing `sources` array)*.
- **durability:** Budget measure *(live tag matches PCR tier — regulatory rate change)*.
- **home_dimension:** Carbon Pricing Policy
- **promise_tracker_entry:** Carbon Pricing `promises[0]`; status Delivered 2025-04-01.
- **construct_tested:** "The quality of the federal government's handling of carbon pricing as a policy instrument" *(verbatim from [Canonical-Scoring-Sheets.md:102](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*. Specifically the **consumer-instrument** component.
- **primary_indicators:** Consumer carbon price status (eliminated/active/modified) *(per [CSS:110](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*.
- **source_roles_required:**
  - **Policy (required):** Finance Canada fuel-charge rate change [QA T1]
  - **Execution (required):** rate actually set to zero effective April 1, 2025 [QA T1]
  - **Measurement (required):** consumer-price-status enum field
  - **Independent challenge (optional):** CCI / IISD on whether elimination is coherent with industrial OBPS preservation
- **deconfliction_notes:** Consumer carbon tax elimination → primary home Carbon Pricing Policy; secondary mention in Affordability Response as context for household relief only (not grade-moving for Affordability); blocked from Climate & Environment per [Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md). **Consumer carbon tax affordability savings** are separately primary-homed in Affordability Response — the event and the household-savings effect must stay separated.
- **derivative_handling:** Does not feed Flagship Delivery. Aggregated in Promise Delivery.
- **update_trigger:** Policy reversal reintroducing consumer fuel charge; structural change to the underlying mechanism.
- **measurement_rules_notes:** Consumer-price status is enum (Eliminated / Active / Modified); no numeric MSR rule required.

---

### CARBON-002 — "Preserve industrial carbon pricing"

- **commitment_id:** `CARBON-002`
- **commitment_text:** "Preserve industrial carbon pricing"
- **source_type:** campaign platform; Day 1 commitment
- **source_document:** OBPS statutory framework (ECCC). **Residual:** no direct ECCC source is present in the Carbon Pricing Policy `sources` array — the OBPS rate is used via metric sourceNote only; source-hardening candidate.
- **durability:** Commitment *(live tag)*. **Note:** "Legislated" arguably fits (OBPS is statutorily grounded); re-tag candidate.
- **home_dimension:** Carbon Pricing Policy
- **promise_tracker_entry:** Carbon Pricing `promises[1]`; status Delivered 2025-04-01.
- **construct_tested:** [CSS:102](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md) construct — **industrial-instrument** component (preservation in form AND function).
- **primary_indicators:** Industrial OBPS headline rate ($/tonne); industrial OBPS effective rate (actual credit trading price); OBPS compliance revenue; free allocation rate *(per [CSS:110](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*.
- **source_roles_required:**
  - **Policy (required):** ECCC Output-Based Pricing System statutory schedule [QA T1]
  - **Execution (required):** OBPS operational (headline $95/tonne in 2025; schedule $15/yr to $170 by 2030); Made-in-Canada Competitiveness Strategy extension to 2035
  - **Measurement (required):** OBPS headline and effective rates
  - **Independent challenge (required):** CCI + IISD on effective-price gap (~$20/tonne vs $95 headline) [QA T2]
  - **Context (optional):** CFIB on small-business revenue share
- **deconfliction_notes:** Industrial OBPS rate and effective price → primary home Carbon Pricing Policy; secondary mention in Climate & Environment as context for emissions trajectory. Industrial OBPS **emissions impact** is primary-homed in Climate & Environment — this file owns the instrument's design and coherence, not the emissions outcome. *(per [Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md))*
- **derivative_handling:** Does not feed Flagship Delivery. Aggregated in Promise Delivery.
- **update_trigger:** OBPS headline rate change; formal policy change to OBPS design (tighter stringency, wider coverage, changed allocation); effective-price material shift confirmed by ECCC compliance data.
- **measurement_rules_notes:** Headline vs effective rate must stay distinct; dashboard shows headline and rationale discusses the gap. No MSR rule explicitly codifies this; it is documented in the OBPS metric sourceNote.

---

### CARBON-003 — "Carbon border adjustment mechanism"

- **commitment_id:** `CARBON-003`
- **commitment_text:** "Carbon border adjustment mechanism"
- **source_type:** official press conference (Davos speech)
- **source_document:** **Residual:** Davos speech text / official CBAM announcement not in the Carbon Pricing `sources` array.
- **durability:** Commitment *(live tag)*. **Note:** "Framework" better-fits once a formal proposal is published.
- **home_dimension:** Carbon Pricing Policy
- **promise_tracker_entry:** Carbon Pricing `promises[2]`; status Too Early.
- **construct_tested:** [CSS:102](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md) construct — **external-instrument** component (border adjustment that would strengthen the industrial instrument).
- **primary_indicators:** No direct minimum indicator for a future CBAM in current CSS; would anchor to "external constraint +0.3 modifier" if implementation materialized.
- **source_roles_required:**
  - **Policy (required):** formal CBAM proposal with implementation plan
  - **Execution (required, future):** CBAM operational
  - **Independent challenge (optional):** CCI / IISD / trade-policy analysis on CBAM coherence with OBPS
- **deconfliction_notes:** Primary home Carbon Pricing Policy; trade-diversification implications remain in Defence & Trade territory only as context.
- **derivative_handling:** Does not feed Flagship Delivery. Aggregated in Promise Delivery.
- **update_trigger:** Formal CBAM proposal with implementation plan; legislation introduced; US border carbon adjustment enacted that would justify Canadian response.
- **measurement_rules_notes:** No MSR rule applicable at current Too Early status.

---

## 5. Climate & Environment

### CLIMATE-001 — "East-west electricity grid"

- **commitment_id:** `CLIMATE-001`
- **commitment_text:** "East-west electricity grid"
- **source_type:** official press conference
- **source_document:** **Residual:** specific announcement URL not in Climate `sources` array.
- **durability:** Commitment *(live tag)*.
- **home_dimension:** Climate & Environment
- **promise_tracker_entry:** Climate `promises[0]`; status Too Early.
- **construct_tested:** "The scale and coherence of the federal environmental policy framework" *(verbatim from [Canonical-Scoring-Sheets.md:400](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*. Specifically the **replacement-strategy / transition-infrastructure** component.
- **primary_indicators:** No direct Climate minimum indicator for grid integration at the federal level; indirect via "Replacement strategy: exists (yes/no)" *(per [CSS:408](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*.
- **source_roles_required:**
  - **Policy (required):** official grid-integration proposal and funding structure
  - **Execution (required, future):** construction / interprovincial-agreement evidence
  - **Measurement (required, future):** low-carbon-electricity percentage; grid capacity
  - **Independent challenge (optional):** CCI / IISD / CER on grid-integration pathway
- **deconfliction_notes:** Primary home Climate & Environment (emissions framework component). Interprovincial coordination aspects also surface in Flagship Delivery's federal-provincial coordination metric as context only.
- **derivative_handling:** Flagship Delivery uses climate as one of five flagship files; this commitment would feed Flagship's climate-file delivery assessment as a delivery indicator (execution machinery), not as an outcome indicator, per [Flagship-Delivery-Rules.md §Overlap Prevention](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Flagship-Delivery-Rules.md). Aggregated in Promise Delivery.
- **update_trigger:** Formal proposal with funding structure; first interprovincial agreement; construction commencement.
- **measurement_rules_notes:** No MSR rule applicable at current Too Early status.

---

### CLIMATE-002 — "Conserve biodiversity / freshwater"

- **commitment_id:** `CLIMATE-002`
- **commitment_text:** "Conserve biodiversity / freshwater"
- **source_type:** campaign platform; budget recommitment (March 2026)
- **source_document:** **Residual:** 30x30 conservation program materials not directly in the Climate `sources` array.
- **durability:** Commitment *(live tag)*. **Note:** "Program" better-fits given funded structure ($3.8B recommitted).
- **home_dimension:** Climate & Environment
- **promise_tracker_entry:** Climate `promises[1]`; status Stalled.
- **construct_tested:** [CSS:400](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md) construct — **conservation** component.
- **primary_indicators:** Conservation spending (30x30) *(per [CSS:408](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*.
- **source_roles_required:**
  - **Policy (required):** 30x30 target framework [QA T1]
  - **Execution (required):** ECCC / Parks Canada implementation data [QA T1]
  - **Measurement (required):** conservation area as % of land/marine (currently marine falling short at 28% vs 30% target) [QA T1]
  - **Independent challenge (required):** conservation-science analysis on adequacy of protected-area network
  - **Context (optional):** The Narwhal / National Observer
- **deconfliction_notes:** Primary home Climate & Environment (framework component).
- **derivative_handling:** Flagship Delivery uses climate as flagship file; conservation would be a delivery indicator on that file. Aggregated in Promise Delivery.
- **update_trigger:** Protected-area percentage crosses 30% land / 30% marine thresholds; material expansion or contraction of protected areas; 30x30 formal abandonment.
- **measurement_rules_notes:** No explicit MSR rule for conservation spending / protected-area percentage. **Residual:** MSR extension candidate.

---

### CLIMATE-003 — "Net-zero commitment"

- **commitment_id:** `CLIMATE-003`
- **commitment_text:** "Net-zero commitment"
- **source_type:** campaign platform; pre-existing federal policy
- **source_document:** **Residual:** Canadian Net-Zero Emissions Accountability Act reference not in Climate `sources` array.
- **durability:** Target *(live tag matches PCR tier — stated goal)*.
- **home_dimension:** Climate & Environment
- **promise_tracker_entry:** Climate `promises[2]`; status Stalled.
- **construct_tested:** [CSS:400](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md) construct — **target-commitment** component.
- **primary_indicators:** CCI projected emissions pathway vs targets; replacement strategy exists (yes/no) *(per [CSS:408](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*.
- **source_roles_required:**
  - **Policy (required):** Net-Zero Emissions Accountability Act; federal climate plan materials
  - **Execution (required):** current policy pathway evidence
  - **Measurement (required):** ECCC emissions inventory; CCI projected pathway
  - **Independent challenge (required):** CCI + IISD on off-course assessment [QA T2]
- **deconfliction_notes:** Primary home Climate & Environment.
- **derivative_handling:** Flagship Delivery uses climate as flagship file; net-zero pathway is the core climate-delivery question. Aggregated in Promise Delivery.
- **update_trigger:** Revised climate plan with funded measures published; formal withdrawal of net-zero target; material emissions-trajectory revision.
- **measurement_rules_notes:** No MSR rule explicitly codified for emissions pathway. Live sourceNote uses CCI as primary analytical anchor; IISD as second-family corroborator.

---

### CLIMATE-004 — "2030/2035 climate targets"

- **commitment_id:** `CLIMATE-004`
- **commitment_text:** "2030/2035 climate targets"
- **source_type:** campaign platform; pre-existing federal policy
- **source_document:** **Residual:** formal 2030 NDC target document not in Climate `sources` array.
- **durability:** Target *(live tag matches PCR tier)*.
- **home_dimension:** Climate & Environment
- **promise_tracker_entry:** Climate `promises[3]`; status Stalled since 2025-11-27.
- **construct_tested:** [CSS:400](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md) construct — **interim-target** component.
- **primary_indicators:** CCI projected emissions pathway vs 2030 and 2035 targets *(per [CSS:408](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*.
- **source_roles_required:**
  - **Policy (required):** federal 2030 NDC and 2035 interim target documents
  - **Execution (required):** current federal climate-plan measures and their funded-status
  - **Measurement (required):** ECCC emissions inventory; CCI projection (currently 18-22% vs 40-45% target)
  - **Independent challenge (required):** CCI "Canada off course" + IISD 2030 target analysis [QA T2]
- **deconfliction_notes:** Primary home Climate & Environment.
- **derivative_handling:** Flagship Delivery uses climate as flagship file; 2030 target trajectory is central to the climate-file delivery assessment. Aggregated in Promise Delivery.
- **update_trigger:** Formal withdrawal or revision of 2030/2035 targets; new federal climate plan published with funded measures; material emissions-trajectory revision.
- **measurement_rules_notes:** No explicit MSR rule; sourceNote uses CCI + IISD co-citation for projected-pathway claims.

---

## 6. Immigration

### IMMIG-001 — "PR below 1% of population/year"

- **commitment_id:** `IMMIG-001`
- **commitment_text:** "PR below 1% of population/year"
- **source_type:** campaign platform; IRCC levels plan
- **source_document:** [IRCC 2026-2028 levels plan](https://www.canada.ca/en/immigration-refugees-citizenship/corporate/mandate/corporate-initiatives/levels/supplementary-immigration-levels-2026-2028.html) *(in Immigration `sources` array)*.
- **durability:** Commitment *(live tag)*. **Note:** "Target" fits the live evidence (380,000 PR target for 2026-2028); re-tag candidate.
- **home_dimension:** Immigration
- **promise_tracker_entry:** Immigration `promises[0]`; status Delivered 2025-11-04.
- **construct_tested:** "The adequacy and coherence of the federal immigration level correction" *(verbatim from [Canonical-Scoring-Sheets.md:358](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*. Specifically the **PR-level-correction** component.
- **primary_indicators:** PR target vs actual admissions (IRCC) *(per [CSS:366](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*.
- **source_roles_required:**
  - **Policy (required):** IRCC levels plan [QA T1]
  - **Execution (required):** IRCC admissions data [QA T1]
  - **Measurement (required):** PR admissions vs population-denominator
  - **Independent challenge (optional):** Bank of Canada wage study (on why the correction was needed) [QA T1]
- **deconfliction_notes:** Immigration levels → primary home Immigration; secondary mention in Flagship Delivery (as delivery indicator on immigration flagship file); blocked from Economic Policy Response per [Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md).
- **derivative_handling:** Flagship Delivery uses immigration as one of five flagship files; this commitment's status feeds Flagship's immigration-file delivery assessment as a delivery indicator, not an outcome indicator, per [Flagship-Delivery-Rules.md §Overlap Prevention](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Flagship-Delivery-Rules.md). Aggregated in Promise Delivery.
- **update_trigger:** Material overshoot or undershoot of the 380,000 PR target; formal target revision; new levels plan.
- **measurement_rules_notes:** [Measure-Selection-Rules.md §Immigration](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Measure-Selection-Rules.md) — PR admissions use IRCC levels plan + operational data; cannot mix StatsCan estimates (which include NPR) with IRCC operational counts.

---

### IMMIG-002 — "Temp residents below 5% by end of 2027"

- **commitment_id:** `IMMIG-002`
- **commitment_text:** "Temp residents below 5% by end of 2027"
- **source_type:** campaign platform
- **source_document:** **Residual:** original platform target not in Immigration `sources` array; current evidence references StatsCan population series.
- **durability:** Commitment *(live tag)*. **Note:** "Target" fits (specific numerical goal).
- **home_dimension:** Immigration
- **promise_tracker_entry:** Immigration `promises[1]`; status In Progress.
- **construct_tested:** [CSS:358](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md) construct — **temp-resident-correction** component.
- **primary_indicators:** Temp resident stock and flow (IRCC); population change (StatsCan 17-10-0009-01) *(per [CSS:366](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*.
- **source_roles_required:**
  - **Policy (required):** TFW / student permit framework changes [QA T1]
  - **Execution (required):** IRCC operational permit-issuance data [QA T1]
  - **Measurement (required):** non-permanent-resident stock as % of population (StatsCan 17-10-0009-01) [QA T1]; currently 2.68M vs prior 3.15M (7.6%)
  - **Independent challenge (optional):** Bank of Canada wage study [QA T1]
- **deconfliction_notes:** Temp-resident levels → primary home Immigration; secondary Flagship Delivery; blocked Economic Policy Response.
- **derivative_handling:** Flagship Delivery immigration-file delivery indicator. Aggregated in Promise Delivery.
- **update_trigger:** NPR share crosses 5% of population; documented service-sector failures materially attributable to pullback; reversal of contraction.
- **measurement_rules_notes:** [Measure-Selection-Rules.md §Immigration](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Measure-Selection-Rules.md) — primary measure is non-permanent-resident stock (StatsCan 17-10-0009-01).

---

### IMMIG-003 — "Student/TFW/asylum stream reform"

- **commitment_id:** `IMMIG-003`
- **commitment_text:** "Student/TFW/asylum stream reform"
- **source_type:** campaign platform; IRCC announcements
- **source_document:** IRCC operational changes. **Residual:** specific IRCC policy-change documents not in Immigration `sources` array.
- **durability:** Commitment *(live tag)*. **Note:** "Framework" or "Program" better-fits as reforms materialize.
- **home_dimension:** Immigration
- **promise_tracker_entry:** Immigration `promises[2]`; status In Progress.
- **construct_tested:** [CSS:358](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md) construct — **stream-design / framework** component.
- **primary_indicators:** Student permit trajectory; temp resident stock/flow *(per [CSS:366](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*.
- **source_roles_required:**
  - **Policy (required):** IRCC stream-specific framework changes [QA T1]
  - **Execution (required):** IRCC permit-issuance and processing data by stream [QA T1]; live evidence shows student permits down 60%, TFW tightened, asylum stream pending
  - **Measurement (required):** IRCC open-data series on work permits, study permits
  - **Independent challenge (optional):** sector-impact analysis (higher education, agriculture, healthcare)
- **deconfliction_notes:** Stream reforms → primary home Immigration; secondary Flagship Delivery.
- **derivative_handling:** Flagship Delivery immigration-file delivery indicator. Aggregated in Promise Delivery.
- **update_trigger:** Formal asylum-stream reform announcement; material sector-impact evidence; reversal of TFW tightening.
- **measurement_rules_notes:** [Measure-Selection-Rules.md §Immigration](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Measure-Selection-Rules.md) — IRCC operational counts are distinct from StatsCan population estimates and must not be mixed; composition of backlogs matters (PR backlog specifically hit a record high).

---

## 7. Major Projects

### MPROJ-001 — "Major Federal Project Office with 2-year decisions"

- **commitment_id:** `MPROJ-001`
- **commitment_text:** "Major Federal Project Office with 2-year decisions"
- **source_type:** campaign platform; legislated via Building Canada Act
- **source_document:** [Building Canada Act (Bill C-5)](https://www.parl.ca/legisinfo/en/bill/45-1/c-5) *(in Major Projects `sources` array)*.
- **durability:** Commitment *(live tag)*. **Note:** "Legislated" better-fits given statutory basis; re-tag candidate.
- **home_dimension:** Major Projects
- **promise_tracker_entry:** Major Projects `promises[0]`; status In Progress.
- **construct_tested:** "The effectiveness of federal institutional machinery for infrastructure project delivery" *(verbatim from [Canonical-Scoring-Sheets.md:315](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*. Specifically the **MPO-timeline** component.
- **primary_indicators:** Mean regulatory approval time vs 2-year target; MPO projects referred and status *(per [CSS:323](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*.
- **source_roles_required:**
  - **Policy (required):** Building Canada Act [QA T1]; MPO framework materials
  - **Execution (required):** first project completing full MPO 2-year cycle (none yet)
  - **Measurement (required):** mean approval-time data vs pre-MPO baseline
  - **Independent challenge (required):** Fraser Institute [QA T2]; Angus Reid polling context [QA T3]
- **deconfliction_notes:** MPO institutional machinery → primary home Major Projects. Flagship Delivery now carries this only as derivative delivery evidence under the major-projects flagship file, consistent with [Flagship-Delivery-Rules.md §Overlap Prevention](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Flagship-Delivery-Rules.md).
- **derivative_handling:** Flagship Delivery uses Major Projects as one of five flagship files; the MPO cycle-completion milestone is a delivery indicator (execution machinery) on that file, not an outcome indicator, per [Flagship-Delivery-Rules.md §Overlap Prevention](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Flagship-Delivery-Rules.md). Aggregated in Promise Delivery.
- **update_trigger:** First project completes full MPO 2-year cycle; first use of national interest designation; documented approval-time acceleration vs pre-MPO baseline.
- **measurement_rules_notes:** No MSR rule for MPO cycle time. **Residual:** MSR extension candidate if cycle-completion becomes grade-moving.

---

### MPROJ-002 — "One Project, One Review within 6 months"

- **commitment_id:** `MPROJ-002`
- **commitment_text:** "One Project, One Review within 6 months"
- **source_type:** campaign platform
- **source_document:** **Residual:** specific policy framework URL not in Major Projects `sources` array.
- **durability:** Framework *(live tag matches PCR tier)*.
- **home_dimension:** Major Projects
- **promise_tracker_entry:** Major Projects `promises[1]`; status Stalled.
- **construct_tested:** [CSS:315](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md) construct — **regulatory-harmonization** component.
- **primary_indicators:** Mean regulatory approval time; new vs pre-existing projects in pipeline *(per [CSS:323](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*.
- **source_roles_required:**
  - **Policy (required):** One Project One Review policy framework
  - **Execution (required):** cross-agency regulatory harmonization evidence (currently stalled)
  - **Measurement (required, future):** project review cycle time across agencies
  - **Independent challenge (optional):** think-tank analysis on regulatory-harmonization progress
- **deconfliction_notes:** Primary home Major Projects.
- **derivative_handling:** Flagship Delivery uses Major Projects as flagship file; this commitment feeds the flagship-file delivery assessment as a delivery indicator. Aggregated in Promise Delivery.
- **update_trigger:** Cross-agency regulatory harmonization agreement published; first project processed end-to-end within 6 months; formal abandonment of the timeline.
- **measurement_rules_notes:** No MSR rule. Stage-labels discipline from Housing MSR section (announced / authorized / implemented) transfers as a general pattern.

---

### MPROJ-003 — "High-speed rail Windsor–Quebec City"

- **commitment_id:** `MPROJ-003`
- **commitment_text:** "High-speed rail Windsor–Quebec City"
- **source_type:** official press conference (Alto concept announcement)
- **source_document:** **Residual:** Alto concept announcement URL not in Major Projects `sources` array.
- **durability:** Commitment *(live tag)*. **Note:** "Program" candidate once funding structure and corridor confirmed.
- **home_dimension:** Major Projects
- **promise_tracker_entry:** Major Projects `promises[2]`; status Too Early.
- **construct_tested:** [CSS:315](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md) construct — **flagship-project** component; tests whether MPO machinery accelerates a signature multi-year infrastructure project.
- **primary_indicators:** National interest designation uses; new vs pre-existing projects in pipeline *(per [CSS:323](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*.
- **source_roles_required:**
  - **Policy (required):** Alto / HSR federal framework; funding structure
  - **Execution (required, future):** construction not expected before 2029
  - **Measurement (optional):** MPO pipeline status
  - **Independent challenge (optional):** transportation-policy analysis
- **deconfliction_notes:** Primary home Major Projects.
- **derivative_handling:** Flagship Delivery uses Major Projects as flagship file; HSR status would feed Flagship's major-projects-file delivery assessment once MPO cycle engages. Aggregated in Promise Delivery.
- **update_trigger:** Funding structure confirmed; first national interest designation used on HSR; construction commencement.
- **measurement_rules_notes:** No MSR rule applicable at Too Early status.

---

### MPROJ-004 — "$10B Indigenous Loan Guarantee Program"

- **commitment_id:** `MPROJ-004`
- **commitment_text:** "$10B Indigenous Loan Guarantee Program"
- **source_type:** campaign platform; legislated expansion
- **source_document:** **Residual:** specific program documentation URL not in Major Projects `sources` array; program referenced in live evidence as operational.
- **durability:** Program *(live tag matches PCR tier)*.
- **home_dimension:** Major Projects
- **promise_tracker_entry:** Major Projects `promises[3]`; status Delivered 2025-06-26.
- **construct_tested:** [CSS:315](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md) construct — **Indigenous-participation** component of institutional machinery.
- **primary_indicators:** Program disbursement data *(indirect; CSS indicators focus on MPO machinery rather than Indigenous loan program specifically — potential indicator gap)*.
- **source_roles_required:**
  - **Policy (required):** Indigenous Loan Guarantee Program expansion legislation / Budget [QA T1]
  - **Execution (required):** program operational; accepting applications [QA T1]
  - **Measurement (required):** loan commitments disbursed
  - **Independent challenge (optional):** Indigenous-economic-policy analysis
- **deconfliction_notes:** Primary home Major Projects. May have secondary relevance to Economic Policy Response (Indigenous economic participation) but not primary-home there.
- **derivative_handling:** Flagship Delivery does not specifically track Indigenous Loan Guarantee as a housing/projects sub-file indicator. Aggregated in Promise Delivery.
- **update_trigger:** Material program expansion or scaling-back; loan commitment milestones; formal program closure.
- **measurement_rules_notes:** No MSR rule.

---

## 8. Economic Policy Response

### ECONPOL-001 — "$2B sovereign AI compute strategy"

- **commitment_id:** `ECONPOL-001`
- **commitment_text:** "$2B sovereign AI compute strategy"
- **source_type:** campaign platform; budget (launched Dec 2024)
- **source_document:** **Residual:** specific AI compute strategy announcement URL not in Economic Policy Response `sources` array.
- **durability:** Framework *(live tag matches PCR tier)*. **Note:** "Program" once Treasury Board authorizes disbursement.
- **home_dimension:** Economic Policy Response
- **promise_tracker_entry:** Economic Policy Response `promises[0]`; status In Progress.
- **construct_tested:** "The adequacy of the federal government's policy response to Canada's structural productivity and competitiveness challenges" *(verbatim from [Canonical-Scoring-Sheets.md:59](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*. Specifically the **AI-compute-fund** component.
- **primary_indicators:** AI/minerals fund disbursement status (ISED, Treasury Board) *(per [CSS:67](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*.
- **source_roles_required:**
  - **Policy (required):** AI compute strategy announcement materials [QA T1/T4]
  - **Execution (required):** Treasury Board authorization or first confirmed disbursement [QA T1] — live evidence indicates private-sector commitments (Microsoft C$19B; SCALE AI round) but federal-side execution status is "launched" rather than "disbursing"
  - **Measurement (required):** disbursement data vs $2B commitment
  - **Independent challenge (optional):** PBO / Treasury Board verification of authorization stage (QA Rule 2 discipline)
- **deconfliction_notes:** AI compute fund → primary home Economic Policy Response per [Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md); **blocked from Flagship Delivery**. This means private-sector commitments cannot be used to strengthen Flagship's assessment of the AI file; only the federal-delivery machinery is what Flagship would track if AI were a flagship file (it is not — AI is not one of the five).
- **derivative_handling:** Not one of the five flagship files. Aggregated in Promise Delivery.
- **update_trigger:** Treasury Board authorization; first confirmed federal disbursement; business investment turns positive for 2+ consecutive quarters (one of Economic Policy Response's one-notch up-triggers per CSS).
- **measurement_rules_notes:** QA Rule 2 authorization-stage discipline is especially load-bearing here; per CSS rater note the dimension is "most vulnerable to announcement bias."

---

### ECONPOL-002 — "Critical minerals strategy"

- **commitment_id:** `ECONPOL-002`
- **commitment_text:** "Critical minerals strategy"
- **source_type:** campaign platform; NRCan operational program
- **source_document:** [NRCan — critical minerals partnerships](https://www.canada.ca/en/natural-resources-canada/news/2026/03/canada-secures-30-new-critical-minerals-partnerships-and-unlocks-121-billion-in-mining-project-capital.html) *(in Economic Policy Response `sources` array)*.
- **durability:** Program *(live tag matches PCR tier)*.
- **home_dimension:** Economic Policy Response
- **promise_tracker_entry:** Economic Policy Response `promises[1]`; status In Progress.
- **construct_tested:** [CSS:59](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md) construct — **critical-minerals-instrument** component.
- **primary_indicators:** AI/minerals fund disbursement status *(per [CSS:67](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*.
- **source_roles_required:**
  - **Policy (required):** NRCan program materials [QA T4 — government-stated; not yet grade-moving alone per QA Rule 2]
  - **Execution (required):** federal disbursement vs mobilized-capital claim; live rationale qualifies NRCan's $18.5B as "government-stated rather than authorization/disbursement-backed in the live stack"
  - **Measurement (required):** disbursement data
  - **Independent challenge (required):** PBO / Treasury Board authorization verification; trade/industrial-policy analysis
- **deconfliction_notes:** Critical minerals pipeline → primary home Economic Policy Response; secondary mention in Flagship Delivery as delivery context (NOT grade-moving for Flagship); **blocked from Major Projects** per [Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md).
- **derivative_handling:** Not one of the five flagship files. Aggregated in Promise Delivery.
- **update_trigger:** Federal authorization or first confirmed disbursement for critical-minerals instruments; documented business-investment response attributable to the program; formal program restructuring.
- **measurement_rules_notes:** QA Rule 2 discipline: announcements alone cannot move the grade; require Authorized stage or higher.

---

### ECONPOL-003 — "Red tape review: 60-day department reports"

- **commitment_id:** `ECONPOL-003`
- **commitment_text:** "Red tape review: 60-day department reports"
- **source_type:** campaign platform; official announcement
- **source_document:** **Residual:** specific announcement URL not in Economic Policy Response `sources` array.
- **durability:** Framework *(live tag matches PCR tier)*.
- **home_dimension:** Economic Policy Response
- **promise_tracker_entry:** Economic Policy Response `promises[2]`; status Too Early.
- **construct_tested:** [CSS:59](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md) construct — **regulatory-reform** component.
- **primary_indicators:** No direct CSS Economic Policy Response minimum indicator covers red-tape-review reports; indirect via business-investment response.
- **source_roles_required:**
  - **Policy (required):** red-tape review framework [QA T1/T4]
  - **Execution (required, future):** published department reports (not yet public)
  - **Independent challenge (optional):** regulatory-burden analysis
- **deconfliction_notes:** Primary home Economic Policy Response.
- **derivative_handling:** Not one of the five flagship files. Aggregated in Promise Delivery.
- **update_trigger:** First department red-tape report published; formal regulatory-reform package announced; Treasury Board authorization of implementation.
- **measurement_rules_notes:** No MSR rule.

---

## 9. Ethics & Transparency

### ETHICS-001 — "Full financial disclosure"

- **commitment_id:** `ETHICS-001`
- **commitment_text:** "Full financial disclosure"
- **source_type:** campaign platform; official press conference
- **source_document:** [PM blind-trust summary statement](https://prciec-rpccie.parl.gc.ca/Lists/Declarations/Attachments/43657/Appendix%20Summary%20Statement%20-%20Annexe%20Declaration%20Sommaire.pdf) and [PM Annex A public declaration of agreed measure](https://prciec-rpccie.parl.gc.ca/Lists/Declarations/Attachments/43653/Annex%20A%20-%20Public%20Declaration%20of%20Agreed%20Measure.pdf) *(in Ethics `sources` array)*.
- **durability:** Commitment *(live tag)*. **Note:** process construct; PCR's tier definitions do not cleanly map to process-adequacy commitments, so "Commitment" is defensible.
- **home_dimension:** Ethics & Transparency
- **promise_tracker_entry:** Ethics `promises[0]`; status Stalled.
- **construct_tested:** "The adequacy of the PM's ethics framework relative to the novel disclosure requirements of his background" *(verbatim from [Canonical-Scoring-Sheets.md:146](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*. Specifically the **disclosure-completeness** component.
- **primary_indicators:** Disclosure completeness (categories disclosed / categories expected); conflict screening status (active/inactive, scope) *(per [CSS:154](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*. The new official-status anchor metrics (Blind trust status: Established; Agreed measure filing: Filed; Conflict screening scope: Declared in Annex A) are the live anchors for this commitment.
- **source_roles_required:**
  - **Policy (required):** PM blind-trust summary statement + Annex A [QA T1 — Ethics Commissioner registry filings]
  - **Execution (required):** blind trust established (per section 27 of the Act); agreed measure filed; screen scope declared publicly
  - **Independent challenge (required):** Democracy Watch critique (completeness-of-framework critique) [QA T2-T3]
  - **Measurement (not applicable to this construct):** Ethics is process-type per [Source-Authority-Map.md Ethics entry](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Source-Authority-Map.md); no quantitative measurement layer
  - **Context (optional):** Globe and Mail, CBC reporting on disclosure background
- **deconfliction_notes:** Brookfield disclosure → primary home Ethics & Transparency; secondary context-only mention in Carbon Pricing Policy (conflict perception). *(per [Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md))*
- **derivative_handling:** Ethics is not one of the five flagship files. Aggregated in Promise Delivery.
- **update_trigger:** Ethics Commissioner publishes a detailed review finding adequate disclosure (one-notch up per CSS); PM proactively publishes full Brookfield accounting; new evidence of undisclosed interests (one-notch down).
- **measurement_rules_notes:** No MSR rule applies (process construct). Per [Source-Authority-Map.md Ethics entry](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Source-Authority-Map.md), measurement role is structurally absent; policy + execution + challenge roles carry the commitment.

---

### ETHICS-002 — "Independent Ethics Commissioner review"

- **commitment_id:** `ETHICS-002`
- **commitment_text:** "Independent Ethics Commissioner review"
- **source_type:** campaign platform
- **source_document:** **Residual:** original platform commitment URL not in Ethics `sources` array. Commitment is implicit in the wider disclosure framework.
- **durability:** Framework *(live tag matches PCR tier)*.
- **home_dimension:** Ethics & Transparency
- **promise_tracker_entry:** Ethics `promises[1]`; status Stalled.
- **construct_tested:** [CSS:146](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md) construct — **independent-review** component.
- **primary_indicators:** Ethics Commissioner review status (published/not published); independent governance review status *(per [CSS:154](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*. Current status: both Not published.
- **source_roles_required:**
  - **Policy (required):** Office of the Ethics Commissioner framework [QA T1]
  - **Execution (required):** published Commissioner review — currently absent
  - **Independent challenge (required):** Democracy Watch governance critique [QA T2-T3]
  - **Measurement (not applicable to this construct):** process-type, no quantitative measure
  - **Context (optional):** Globe/CBC/governance-law commentary
- **deconfliction_notes:** Ethics Commissioner findings → primary home Ethics & Transparency. *(per [Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md))*
- **derivative_handling:** Not one of the five flagship files. Aggregated in Promise Delivery.
- **update_trigger:** Ethics Commissioner publishes a detailed review; independent (non-Commissioner) governance review published; Ethics Commissioner finds screening inadequate (one-notch down).
- **measurement_rules_notes:** No MSR rule applies (process construct).

---

## 10. Flagship Delivery

### FLAG-001 — "Get big projects built quickly"

- **commitment_id:** `FLAG-001`
- **commitment_text:** "Get big projects built quickly"
- **source_type:** campaign platform
- **source_document:** **Residual:** platform commitment URL not in Flagship `sources` array.
- **durability:** Commitment *(live tag)*. **Note:** slogan-level framing rather than a specific mechanism; PCR might classify as a lower-tier commitment. Genuine Flagship-native commitment (it asks the cross-cutting delivery question directly).
- **home_dimension:** Flagship Delivery *(live assignment)*. This commitment is Flagship-native in that it addresses the cross-cutting delivery machinery across all five flagship files rather than a specific project's timeline.
- **promise_tracker_entry:** Flagship Delivery `promises[0]`; status Stalled.
- **construct_tested:** [CSS:188](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md) construct — **cross-cutting execution** component; tests the full five-flagship-file delivery picture rather than any single file.
- **primary_indicators:** Per the Combination Rule ([Flagship-Delivery-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Flagship-Delivery-Rules.md)): flagship file status distribution (delivering / partially delivering / stalled / failing); bills passed vs introduced; federal-provincial coordination quality; fund disbursement rates on flagship programs.
- **source_roles_required:**
  - **Measurement (required, derivative):** home-dimension delivery metrics (inherited)
  - **Policy (required):** commitments defining each of the five flagship files
  - **Execution (required):** evidence each flagship file is actually delivering
  - **Independent challenge (required):** Policy Options / IRPP [QA T2]; C.D. Howe on state capacity [QA T2]; PBO on investment gap [QA T1]
  - **Context (optional):** The Hub and broader federal-delivery commentary
- **deconfliction_notes:** Federal-provincial coordination quality → primary home Flagship Delivery; secondary mention in Housing Supply (as context for jurisdictional limits). Bills passed count → primary Flagship; blocked from Promise Delivery. Home-dimension outcome metrics when used to argue policy merit rather than delivery quality are context-only.
- **derivative_handling:** Flagship Delivery is the home; this commitment is the meta-commitment of the dimension. Aggregated in Promise Delivery.
- **update_trigger:** Combination Rule output changes (file status redistribution); new National Interest designation use; first National Security or cross-file delivery milestone achieved at scale.
- **measurement_rules_notes:** No MSR rule; Combination Rule in [Flagship-Delivery-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Flagship-Delivery-Rules.md) is the governing measurement discipline.

---

## 11. Defence & Trade

### DEFTRADE-001 — "Exceed NATO 2% before 2030" *(defence leg)*

- **commitment_id:** `DEFTRADE-001`
- **commitment_text:** "Exceed NATO 2% before 2030"
- **source_type:** campaign platform; NATO formal commitment
- **source_document:** [NATO Secretary General Annual Report 2025](https://www.nato.int/en/news-and-events/articles/news/2026/03/26/nato-secretary-generals-annual-report-shows-significant-increase-in-defence-investment-from-europe-and-canada) and [Budget 2025 Ch.4](https://budget.canada.ca/2025/report-rapport/chap4-en.html) *(in Defence & Trade `sources` array)*.
- **durability:** Target *(live tag matches PCR tier — binary milestone met/not met)*.
- **home_dimension:** Defence & Trade — **defence leg**
- **promise_tracker_entry:** Defence & Trade `promises[0]`; status Delivered 2026-03-26.
- **construct_tested:** "The degree to which the federal government has met its stated defence spending commitments and diversified Canada's trade relationships away from single-market dependency" *(verbatim from [Canonical-Scoring-Sheets.md:515](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*. **Defence leg** — binary milestone on stated NATO spending target.
- **primary_indicators:** NATO spending as % GDP (confirmed by NATO, not just domestic claim); Defence procurement milestones (DND) *(per [CSS:523](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*.
- **source_roles_required:**
  - **Measurement (required):** NATO annual defence-spending tables (NATO-confirmed 2.01%) [QA T1]
  - **Policy (required):** Budget 2025 Ch.4 defence commitments [QA T1]
  - **Execution (required):** $81.8B committed over five years; procurement advancing
  - **Independent challenge (required):** Policy Options on 3.5% GDP target financing [QA T2]
  - **Context (optional):** PMO announcement; geopolitical commentary
- **deconfliction_notes:** NATO 2% spending → primary home Defence & Trade; secondary mention in Flagship Delivery (as evidence of defence file delivering); **blocked from Fiscal Health** per [Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md). Defence procurement contracts → primary home Defence & Trade; secondary Flagship.
- **derivative_handling:** Flagship Delivery uses defence as one of five flagship files; NATO 2% is a delivery indicator (execution machinery) on that file, not an outcome indicator, per [Flagship-Delivery-Rules.md §Overlap Prevention](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Flagship-Delivery-Rules.md). Aggregated in Promise Delivery.
- **update_trigger:** NATO spending falls below 2.0% (one-notch down per CSS); 3.5% GDP target gets a funded pathway (one-notch up); procurement milestones met/missed materially.
- **measurement_rules_notes:** [Measure-Selection-Rules.md §Defence & Trade](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Measure-Selection-Rules.md) — NATO defence spending as % GDP uses NATO Secretary General's Annual Report (Tier 1 independent) plus DND confirmation; DND alone is Tier 4 and requires NATO corroboration for grade-moving use.

---

### DEFTRADE-002 — "Remove interprovincial trade barriers" *(trade leg)*

- **commitment_id:** `DEFTRADE-002`
- **commitment_text:** "Remove interprovincial trade barriers"
- **source_type:** campaign platform; legislated via One Canadian Economy Act (Bill C-5)
- **source_document:** [Building Canada Act (Bill C-5) — LEGISinfo](https://www.parl.ca/legisinfo/en/bill/45-1/c-5). **Residual:** Defence & Trade's `sources` array does not currently include a LEGISinfo citation for Bill C-5; source-hardening candidate.
- **durability:** Legislated *(live tag matches PCR tier)*.
- **home_dimension:** Defence & Trade — **trade leg** *(live assignment)*. **Construct-fit note:** per [CSS:556](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md) rater note, interprovincial trade is acknowledged to overlap with Economic Policy Response (productivity/competitiveness). CSS nonetheless primary-homes trade diversification metrics in Defence & Trade. Construct-fit question surfaced, not resolved.
- **promise_tracker_entry:** Defence & Trade `promises[1]`; status Delivered 2025-06-26.
- **construct_tested:** [CSS:515](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md) construct — **trade-diversification** leg, via domestic-market-integration rather than export-share-shift.
- **primary_indicators:** No direct "interprovincial trade" metric in CSS minimum indicators (which focus on US export share and non-US export growth). **Gap:** interprovincial trade commitment tests the trade leg's construct obliquely. **Residual:** CSS Defence & Trade minimum-indicator list does not cover interprovincial integration.
- **source_roles_required:**
  - **Policy (required):** One Canadian Economy Act as enacted [QA T1]
  - **Execution (required):** legislative passage + implementation across provinces
  - **Independent challenge (optional):** competition-policy or productivity analysis on interprovincial barrier removal
  - **Measurement (optional):** interprovincial trade volume series if available
- **deconfliction_notes:** Trade diversification metrics → primary home Defence & Trade; **blocked from Economic Policy Response** per [Deconfliction-Matrix.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Deconfliction-Matrix.md). Even though interprovincial trade has productivity implications, Economic Policy Response cannot grade-credit export-diversification or interprovincial-integration effects; they must stay in Defence & Trade's trade leg.
- **derivative_handling:** Flagship Delivery does not treat interprovincial trade reform as one of the five flagship files' sub-indicators directly. Aggregated in Promise Delivery.
- **update_trigger:** Material provincial non-cooperation that blocks implementation; formal repeal; documented interprovincial-trade-volume shift attributable to the Act.
- **measurement_rules_notes:** [Measure-Selection-Rules.md §Defence & Trade](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Measure-Selection-Rules.md) — US export share (annual avg, StatsCan 12-10-0176-01) is the primary trade-diversification measure; interprovincial-integration does not yet have a canonical MSR measure. **Residual:** MSR extension candidate if this becomes grade-moving.

---

### DEFTRADE-003 — "$5B Trade Diversification Corridors Fund" *(trade leg)*

- **commitment_id:** `DEFTRADE-003`
- **commitment_text:** "$5B Trade Diversification Corridors Fund"
- **source_type:** campaign platform; budget (Budget 2025)
- **source_document:** [Budget 2025 Ch.4](https://budget.canada.ca/2025/report-rapport/chap4-en.html) *(in Defence & Trade `sources` array)*.
- **durability:** Program *(live tag matches PCR tier)*.
- **home_dimension:** Defence & Trade — **trade leg**
- **promise_tracker_entry:** Defence & Trade `promises[2]`; status In Progress.
- **construct_tested:** [CSS:515](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md) construct — **trade-diversification** leg.
- **primary_indicators:** Non-US export growth rate; EU/CETA-region export growth *(per [CSS:523](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md))*.
- **source_roles_required:**
  - **Policy (required):** Budget 2025 Ch.4 fund announcement [QA T1]
  - **Execution (required):** fund structure design and first disbursements (not yet disbursed)
  - **Measurement (required, future):** disbursement data and attributable non-US trade growth
  - **Independent challenge (optional):** trade-policy analysis on corridor selection and private-sector uptake
- **deconfliction_notes:** Trade diversification metrics primary-homed in Defence & Trade; blocked from Economic Policy Response.
- **derivative_handling:** Flagship Delivery's five flagship files do not include a distinct trade-diversification-corridors file. Aggregated in Promise Delivery.
- **update_trigger:** First disbursement; fund structure finalized; documented non-US export growth attributable to corridor investments.
- **measurement_rules_notes:** [Measure-Selection-Rules.md §Defence & Trade](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Measure-Selection-Rules.md) — full-year annual averages for trade diversification claims; monthly data is context-only (labeled volatile).

---

### DEFTRADE-004 — "Buy Canadian procurement strategy" *(defence leg, with economic-policy overlap)*

- **commitment_id:** `DEFTRADE-004`
- **commitment_text:** "Buy Canadian procurement strategy"
- **source_type:** campaign platform; official announcement
- **source_document:** **Residual:** Buy Canadian procurement strategy framework URL not directly in Defence & Trade `sources` array.
- **durability:** Framework *(live tag matches PCR tier)*.
- **home_dimension:** Defence & Trade *(live assignment)*. **Construct-fit note:** per [CSS:556](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md), Buy Canadian is explicitly noted as overlapping Economic Policy Response (productivity / competitiveness); CSS keeps trade-home primacy. Not a dual-leg row because the construct overlap is Defence & Trade vs Economic Policy, not defence-leg vs trade-leg.
- **promise_tracker_entry:** Defence & Trade `promises[3]`; status In Progress.
- **construct_tested:** [CSS:515](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md) construct — **defence-procurement / trade-policy** component (procurement affects both defence-industrial-base and trade-diversification).
- **primary_indicators:** Defence procurement milestones; no direct "Buy Canadian uptake" indicator in CSS.
- **source_roles_required:**
  - **Policy (required):** Buy Canadian procurement framework [QA T1/T4]
  - **Execution (required):** departmental implementation
  - **Independent challenge (optional):** industrial-policy analysis
  - **Measurement (optional):** procurement share attributable to Canadian suppliers
- **deconfliction_notes:** Primary home Defence & Trade. Economic Policy Response overlap is acknowledged in CSS rater note but Matrix-blocked from grade-moving there.
- **derivative_handling:** Flagship Delivery uses defence as flagship file; this commitment feeds flagship's defence-file assessment as delivery context. Aggregated in Promise Delivery.
- **update_trigger:** Departmental Buy Canadian implementation milestones; material procurement-share data published; formal policy revision.
- **measurement_rules_notes:** [Measure-Selection-Rules.md §Defence & Trade](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Measure-Selection-Rules.md) general applies; no specific Buy Canadian MSR rule.

---

### DEFTRADE-005 — "Full foreign policy review (first since 2005)" *(defence leg)*

- **commitment_id:** `DEFTRADE-005`
- **commitment_text:** "Full foreign policy review (first since 2005)"
- **source_type:** campaign platform
- **source_document:** **Residual:** specific announcement URL not in Defence & Trade `sources` array.
- **durability:** Framework *(live tag matches PCR tier)*.
- **home_dimension:** Defence & Trade *(defence-leg framing, though foreign policy review is broader than defence alone)*
- **promise_tracker_entry:** Defence & Trade `promises[4]`; status Too Early.
- **construct_tested:** [CSS:515](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Canonical-Scoring-Sheets.md) construct — **strategic-framework** component; tests whether the government has articulated a coherent foreign-and-defence posture.
- **primary_indicators:** No direct CSS minimum indicator tests foreign policy review output. **Gap surfaced.**
- **source_roles_required:**
  - **Policy (required, future):** published foreign policy review document
  - **Execution (required, future):** review launched and delivered
  - **Independent challenge (optional):** foreign-policy commentary
- **deconfliction_notes:** Primary home Defence & Trade *(live)*. Also has relevance to government's broader international posture; not re-homed.
- **derivative_handling:** Flagship Delivery does not include foreign-policy-review as a distinct flagship file. Aggregated in Promise Delivery.
- **update_trigger:** Review launched with timeline; interim or final review document published; cancellation or scope narrowing.
- **measurement_rules_notes:** No MSR rule applicable at Too Early status.

---

## Build note — full build complete, stress-test findings, residuals

**Full build summary.** Template + Housing Supply pilot (from Stage 1) retained verbatim. Ten remaining graded dimensions now built: Fiscal Health (4), Affordability Response (3), Carbon Pricing Policy (3), Climate & Environment (4), Immigration (3), Major Projects (4), Economic Policy Response (3), Ethics & Transparency (2), Flagship Delivery (1), Defence & Trade (5). Total commitments documented: 36 across 11 dimensions (Housing Supply 4 + new 32).

**Template behavior at scale.** All 14 fields populated for every commitment, or explicitly flagged as residual where a field could not be resolved from the in-scope files. The "flag gaps rather than invent answers" design rule held across every commitment type tested:

- **Targets with no delivery mechanism** (FISCAL-001, CLIMATE-003, CLIMATE-004, IMMIG-001, IMMIG-002, DEFTRADE-001): handled by marking Policy/Execution roles "not load-bearing for this commitment" and leaning on Measurement + Challenge.
- **Delivered commitments** (FISCAL-003, FISCAL-004, AFFORD-001, AFFORD-002, CARBON-001, CARBON-002, MPROJ-004, DEFTRADE-001, DEFTRADE-002): update_trigger correctly oriented toward policy-reversal / material-outturn-divergence rather than "first action" triggers.
- **Too Early commitments** (CARBON-003, CLIMATE-001, MPROJ-003, ECONPOL-003, DEFTRADE-005): Future-tense roles clearly marked; update_trigger names the first-concrete-action thresholds.
- **Process-construct commitments** (ETHICS-001, ETHICS-002): Measurement marked "not applicable to this construct" with explicit reference to the Process construct type in SAM; no fake-precision indicator invented.
- **Derivative/Combination commitments** (FLAG-001): Derivative-home framing held cleanly once the MPO timeline commitment was returned to its proper Major Projects home and left in Flagship as derivative delivery evidence only.
- **Dual-leg dimension** (Defence & Trade): Each commitment assigned to a single leg (defence or trade); no blended rows. The Defence & Trade pilot did not produce a true dual-leg commitment requiring a cluster split, but the leg-assignment discipline held.

**Cross-doc consistency at scale.** Across 33 new commitments, no row silently redefined constructs, tiers, minimum indicators, source roles, deconfliction ownership, or MSR canonical measures. Every construct quote is verbatim from CSS. Every Deconfliction Matrix citation names a Matrix row. Every SAM role assignment is a subset of the dimension's SAM role-requirement set.

---

### CTM / template residuals

These are findings inside the CTM's own scope. None block future use of the artifact; they are normal operating residuals from the "flag gaps" discipline.

- **CTM-T1** — Seven commitments have durability tags in dimensions.json that arguably fit a different PCR tier better (HOUSING-001 Commitment→Target; HOUSING-002 Commitment→Program; CARBON-002 Commitment→Legislated; MPROJ-001 Commitment→Legislated; AFFORD-002 Commitment→Framework; AFFORD-003 Commitment→Framework; ECONPOL-001 Framework→Program). The CTM flags each without re-tagging. **Candidate:** Promise-Tracker hygiene pass on durability tags.
- **CTM-T2** — A number of commitments lack a specific source_document URL in the live dimension sources arrays (HOUSING-001, HOUSING-004, FISCAL-001, FISCAL-002, AFFORD-001, AFFORD-002, AFFORD-003, CARBON-002, CARBON-003, CLIMATE-001, CLIMATE-002, CLIMATE-003, CLIMATE-004, IMMIG-002, IMMIG-003, MPROJ-002, MPROJ-003, MPROJ-004, ECONPOL-001, ECONPOL-003, ETHICS-002, FLAG-001, DEFTRADE-002, DEFTRADE-004, DEFTRADE-005). CTM flags each as residual. **Candidate:** source-hardening pass by dimension to resolve these, many via existing available URLs.

### Upstream governance residuals surfaced during the build

These are findings that live in upstream docs (CSS, Matrix, SAM, MSR, Flagship-Delivery-Rules). The CTM surfaced them; resolution belongs in the relevant upstream pass, not in the CTM.

- **U2 — CSS Housing Supply minimum-indicator list does not cover labour-capacity.** HOUSING-004 ("Apprenticeship training up to $8,000"). Either add a minimum indicator or re-home the commitment to Economic Policy Response. **Upstream resolution:** CSS amendment or re-homing decision.
- **U3 — CSS Affordability Response minimum-indicator list does not cover voluntary competition codes or food-labelling programs.** AFFORD-002, AFFORD-003. Indicator anchors are thin. **Upstream resolution:** CSS amendment decision.
- **U4 — CSS Economic Policy Response minimum-indicator list does not cover regulatory-review reports.** ECONPOL-003. Indirectly tested via business-investment response only. **Upstream resolution:** CSS amendment decision.
- **U5 — CSS Climate & Environment minimum-indicator list does not cover east-west grid integration as a distinct indicator.** CLIMATE-001 is tested indirectly via "Replacement strategy exists (yes/no)." **Upstream resolution:** CSS amendment candidate if grid integration becomes a cycle metric.
- **U6 — CSS Major Projects minimum-indicator list does not cover Indigenous Loan Guarantee Program disbursement as a distinct indicator.** MPROJ-004. **Upstream resolution:** CSS amendment candidate.
- **U7 — CSS Defence & Trade minimum-indicator list does not cover interprovincial trade integration or foreign policy review output.** DEFTRADE-002, DEFTRADE-005. Interprovincial trade integration is also noted in the CSS Defence & Trade rater note as overlapping Economic Policy Response. **Upstream resolution:** CSS amendment decision.
- **U8 — Deconfliction Matrix has no row for apprenticeship programs, AI compute fund (private-sector commitments), critical minerals disbursement, Indigenous Loan Guarantee, interprovincial trade integration, or Buy Canadian procurement uptake.** **Upstream resolution:** Matrix amendment candidate to add rows for these as dimension interactions clarify.
- **U9 — MSR does not specify canonical measurement for apprenticeship programs, conservation spending / protected-area percentage, civil-service headcount, food-labelling programs, voluntary competition codes, red-tape review reports, MPO cycle-time, Buy Canadian procurement-share, interprovincial trade integration, foreign policy review output, or Indigenous Loan disbursement.** **Upstream resolution:** MSR extension candidates as these commitments' indicators become grade-moving.
- **U10 — Carbon Pricing Policy and Ethics & Transparency `sources` arrays have gaps relative to commitments cited** (ECCC OBPS direct source for CARBON-002; original platform / announcement URLs for ETHICS-001, ETHICS-002). **Upstream resolution:** source-hardening passes on affected dimensions.

**Note on counting.** CTM-T1 and CTM-T2 are scoped to CTM presentation (what the map says). U2–U10 are open upstream governance content findings (what the upstream docs say). The earlier U1 overlap on the MPO 2-year timeline has now been resolved by returning the commitment to its Major Projects home and keeping Flagship derivative-only on that evidence.

---

**One-line build verdict:** FULL CTM BUILD COMPLETE — 36 COMMITMENTS ACROSS 11 DIMENSIONS, TEMPLATE HELD AT SCALE, TWO CTM RESIDUAL CATEGORIES AND NINE OPEN UPSTREAM GOVERNANCE RESIDUALS SURFACED. The artifact is ready for final review when the user requests it; no CTM template amendment is required.

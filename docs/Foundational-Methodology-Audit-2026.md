# Foundational Methodology Audit — 2026

**Status:** Framework scaffold only. The audit itself runs annually, not per cycle. This doc sets up the three questions that the Phase 2 audit must answer; the editor answers them with full reflection when the audit actually runs.

**Scope:** Phase 2 audit per `docs/Trust-And-Bias-Resistance-Plan-2026-05.md` Tier 2.2a. Tests whether the FOUNDATION of the methodology is biased in setup, not whether it is applied consistently (that is the Phase 1 operational audit's scope).

**Cadence:** Annual, or when the scoring rubric major version changes. Current rubric: v1.1. Next foundational audit no later than 2027 unless the rubric bumps to v2.0 sooner.

**Why this audit is separate from Phase 1:** Phase 1 asks "is the methodology applied consistently across dimensions?" — a per-cycle question with mechanical script support. Phase 2 asks "is the methodology's foundation biased in setup?" — a once-a-year question with no script support and only editorial reflection as the tool. Mixing them in one audit bloats Phase 1 and underserves the foundational questions.

## The three foundational questions

### Q1 — Why these 11 graded dimensions?

The dashboard grades 11 dimensions plus 1 tracker. The dimensions are:

1. Defence & Trade
2. Major Projects
3. Fiscal Health
4. Economic Policy Response
5. Affordability Response
6. Carbon Pricing Policy
7. Climate & Environment
8. Immigration
9. Housing Supply
10. Ethics & Transparency
11. Flagship Delivery
12. Promise Delivery (tracker, excluded from GPA)

**What this audit must address:**

- What was the selection rule for these 11 graded dimensions? Was the rule published in advance, or applied retrospectively?
- What was considered for inclusion and excluded? Why? Examples to consider: Reconciliation / Indigenous Affairs, Foreign Policy (beyond defence), Civil Service Capacity, Federal-Provincial Relations, Public Health, Justice & Legal System.
- Does the omission of any of these create a bias surface? (e.g., not grading Reconciliation could read as deprioritizing it.)
- Is the dimension set stable across rubric versions, or has the set itself shifted? If shifted, why?
- What does the inclusion of Flagship Delivery as a meta-rollup signal about the methodology's hierarchy?
- Is the Promise Delivery tracker correctly excluded from the GPA, or does the exclusion encode a preference?

**Editor reflection required:** answers grounded in original methodology design intent + public-paper-trail criteria documented in `docs/Scoring-Rubric-v1.1.md`.

### Q2 — Why these four in POCKETBOOK_DIMS?

`src/constants.js` defines `POCKETBOOK_DIMS` as four dimensions that are double-weighted in the Household Impact GPA:

1. Fiscal Health
2. Housing Supply
3. Affordability Response
4. Economic Policy Response

**What this audit must address:**

- What was the selection rule for the four double-weighted dimensions? Was the rule published in advance?
- Why is Immigration not in this set, given its direct effect on labour markets, housing demand, and service capacity?
- Why is Climate & Environment not in this set, given long-run economic cost considerations?
- Is the "household impact" framing itself a methodological preference (privileging short-term pocketbook concerns over long-run structural ones)?
- What does the 2x weighting actually do to the GPA arithmetic? Does it shift grades by more than 0.5 letter band on the Household Impact view vs Full Policy Audit view?
- Is there a coherent counterfactual weighting (e.g., 1.5x on Pocketbook + 1.5x on Climate, with all others 1x) that produces materially different headline scores?

**Editor reflection required:** answers grounded in the original Household Impact framing rationale + reference to the sensitivity-analysis check documented in `docs/Scoring-Rubric-v1.1.md`.

### Q3 — How were 43 promises selected?

The Promise Delivery tracker monitors 43 promises. The selection method is partially documented but the audit should make the rule fully explicit and check it for bias.

**What this audit must address:**

- What was the source of the promise list? Liberal Party 2025 platform, throne speech, mandate letters, mid-term commitments, or a mix?
- Was the inclusion rule published in advance of tracking?
- Why 43 specifically? Was there a cutoff threshold (size, public visibility, paper-trail strength)?
- Were any promises excluded that meet the inclusion rule, and why?
- Were any promises included that arguably do not meet the inclusion rule?
- Does the promise set tilt toward easy-to-deliver or hard-to-deliver commitments? If tilted, what is the implication for the tracker's overall pattern?
- Does the status taxonomy (Delivered / In Progress / Stalled / Abandoned / Thwarted / Unclear / Too Early) have consistent evidentiary bars across promises?

**Editor reflection required:** answers grounded in the originating platform document(s) + the status-classification rules documented in the rubric or related methodology docs.

## How this audit runs (when it runs)

1. **Editor reads the three questions in full.** No script support.
2. **Editor drafts answers** with reference to the original methodology design, publication history, and any inclusion / exclusion decisions.
3. **Each answer cites evidence:** which doc, which design memo, which commit message, which methodology version.
4. **The audit doc is then reviewed** — preferably by a second pair of eyes (Claude / ChatGPT / second editor) for whether the answers withstand the same Skeptic Test as a dimension grade.
5. **Findings produce one of three outcomes per question:**
   - Confirmed (the foundation is defensible as documented).
   - Documented (the foundation is defensible but the documentation surface needs to be improved — methodology docs updated, FAQ updated, etc.).
   - Surface-bias finding (the foundation has a bias surface that warrants rubric revision in the next major version).
6. **Surface-bias findings do not change current grades** — they inform the next rubric major version (v2.0+). Changing thresholds or weights mid-cycle violates pre-committed-trigger discipline.

## Constraint

This audit's findings can:
- Update documentation (Scoring-Rubric, FAQ, methodology notes).
- Inform the next rubric major version (v2.0+).
- Recommend dimension additions or removals for the next major version.
- Recommend POCKETBOOK weighting changes for the next major version.
- Recommend promise-selection rule changes for the next major version.

This audit's findings cannot:
- Change current grades.
- Change current thresholds.
- Change current `POCKETBOOK_DIMS`.
- Add or remove dimensions in the current rubric version.

Foundation changes are major-version work, not per-cycle work.

## Schedule

- **2026-05-16:** Framework scaffold drafted (this doc).
- **2026-Q4 or 2027-Q1:** First foundational audit pass. Editor blocks time, walks through the three questions, drafts answers with citations.
- **Post-first-audit:** Decide whether to bump rubric to v2.0 with foundational changes, or keep at v1.x with documentation improvements only.

## Authority and scope

This methodology applies to the Canada Under Carney dashboard at `https://sawatter.github.io/canada-under-carney/` and its source repository. The audit doc when filled out will live alongside the per-cycle bias-resistance audits in `docs/`.

## Version history

- **v1.0 (2026-05-16):** Framework scaffold drafted. Three questions framed. Editor reflection deferred to first scheduled audit pass.

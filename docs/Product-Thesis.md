# Product Thesis

- **Purpose:** Name what this project optimizes for. Captures the problem, the primary user, the job-to-be-done, what the dashboard is and is not, the quality bar for shipping, and the filter for choosing between features. Read alongside Claude-House-Style, which governs how that work is executed.
- **Status:** Active — foundational governance artifact.
- **Last updated:** 2026-04-19
- **Depends on:** [docs/Scoring-Rubric-v1.1.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Scoring-Rubric-v1.1.md), [docs/Source-Authority-Map.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Source-Authority-Map.md), [docs/Commitment-Traceability-Map.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Commitment-Traceability-Map.md), [docs/QA-Gatekeeping-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/QA-Gatekeeping-Rules.md), [docs/v2/verification/Claude-House-Style.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/v2/verification/Claude-House-Style.md)
- **Used by:** roadmap triage in [docs/Current-Roadmap.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Current-Roadmap.md), [docs/Parking-Lot.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Parking-Lot.md) triage, feature scoping, stage-boundary reviews for new features or artifacts.

---

## Positioning

This document governs **what** the project optimizes for. [docs/v2/verification/Claude-House-Style.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/v2/verification/Claude-House-Style.md) governs **how** that work is executed. The two are complementary and both apply to any non-trivial change.

The published scoring stack — Scoring Rubric, Canonical Scoring Sheets, Source Authority Map, Commitment Traceability Map, QA Gatekeeping Rules, Deconfliction Matrix, Measure Selection Rules — is the measurement system this thesis describes. The dashboard is its reader-facing surface. This file does not introduce new methodology; it names the standard against which features are chosen.

---

## 1. Problem

Canadians forming a view on federal government performance have three imperfect options: partisan scorecards that are not falsifiable, fragmented journalism with no consistent criteria across files, or raw government data with no synthesis. None is a calibrated, method-governed reference across the major policy dimensions that shape household life. This dashboard closes that gap by publishing a method-governed scoring stack that a skeptical reader can audit claim by claim.

---

## 2. Vision

An audit-worthy public reference for federal government performance in Canada: 11 graded policy dimensions plus one ungraded accountability tracker, refreshed monthly, graded by a published rubric, source-traceable at the commitment-and-indicator level, and governed by documented review rules.

---

## 3. Primary User

A skeptical Canadian reader who is unwilling to rely on partisan scorecards or vague journalism and who will only accept a grade they can trace to evidence and rubric criterion.

---

## 4. Job to Be Done

Help me audit a government performance claim end-to-end — from published commitment, to source, to indicator, to rubric criterion, to grade — so I can form a view I can defend, or reject the dashboard's conclusion on grounds I can articulate.

---

## 5. What This Is

- Evidence-based performance assessment across 11 graded dimensions, updated monthly.
- A published method-governed scoring stack: Scoring Rubric v1.1 → Canonical Scoring Sheets → Source Authority Map → Commitment Traceability Map → QA Gatekeeping Rules → Deconfliction Matrix → Measure Selection Rules.
- A reader-facing dashboard where the grade, rationale, and source stack are visible on-card; the full methodology stack (confidence calibration, attribution, lag, rubric mechanics, source authority) is one click away in docs.
- Cross-government portable by construction.
- The dashboard is not fully automated. When evidence is mixed, judgments are made through a published methodology and recorded with explicit rationale, source links, and review rules.

---

## 6. What This Is Not

- Not news. No event reporting, no daily cycle.
- Not ad hoc opinion. Judgments are constrained by a published methodology, source rules, and review discipline; the dashboard does not make party or policy recommendations.
- Not a partisan scorecard. Cross-government portable by design.
- Not "objective" in a judgment-free sense. The role of judgment is published through the rubric, QA rules, and source-authority roles; it is not hidden behind a neutral facade.
- Not a comprehensive indicator dashboard. It scores specific defined constructs, not every available metric.
- Not a policy-recommendation tool. It evaluates performance against published commitments and the scale of each file; it does not prescribe what the government should do.
- Not a real-time tracker. Monthly cadence, not breaking-news cadence.

---

## 7. Quality Bar

A feature ships only if it improves reader trust, auditability, interpretability, editorial discipline, or update reliability — and does so without introducing silent inconsistency into the methodology stack.

---

## 8. Feature Decision Filter

Does this feature improve trust, clarity, auditability, or update reliability — or does it just add complexity?

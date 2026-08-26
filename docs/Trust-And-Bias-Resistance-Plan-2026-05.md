# Trust and Bias-Resistance Plan — 2026-05

> **Status: Historical as of 2026-08-25.** This file preserves the work sequence used
> for the May 2026 bias-resistance cycle. It does not govern current cycles or hold
> the active backlog.
>
> **Canonical replacements:**
> - May 2026 outcomes and residuals: [Bias-Resistance-Cycle-2026-05-Closure.md](Bias-Resistance-Cycle-2026-05-Closure.md)
> - Recurring bias-resistance rules: [Bias-Resistance-Protocol.md](Bias-Resistance-Protocol.md)
> - Monthly cycle execution: [Monthly-Cycle-Playbook.md](Monthly-Cycle-Playbook.md)
> - Grade-change release gates: [QA-Gatekeeping-Rules.md](QA-Gatekeeping-Rules.md)
> - Outside red-team mechanism: [Grade-Change-Red-Team-Protocol.md](Grade-Change-Red-Team-Protocol.md)
> - Active priorities: [Current-Roadmap.md](Current-Roadmap.md)
>
> If this plan conflicts with a canonical document above, the canonical document
> controls. Keep this file for provenance only.

**Purpose:** A planning artifact only. This doc sequences the work that came out of the May bias-resistance discussion. It does not change grades, sources, thresholds, formulas, methodology rules, or UI. It is a floor to stand on before any of those changes are proposed.

## Guardrail

> Tools that help readers challenge the dashboard run alongside the audit. Surfaces that polish the dashboard's appearance wait until the audit produces a finding to respond to.

That sentence is the decision rule. Every time scope expansion is suggested in a future cycle, run it through this rule first. If a proposed item gives readers a way to contest a specific grade or claim, it belongs with the audit. If it makes the project look more credible without a finding to address, it waits.

If the audit returns clean (no real bias surfaces found), the polish rule still holds. Polish-without-testing remains the failure mode regardless of whether the test produced gaps.

**Operational definition of "challenge":** a reader-initiated contestation of a specific grade, source, or claim, backed by alternative evidence. Citation, error-reporting, right-of-reply, and accessibility all serve this. Branding, structured-data markup, and stable URLs without a working dispute channel do not.

## Framing

We do not claim the dashboard is bias-free. We test whether the scoring system is bias-resistant, traceable, and party-symmetric. Real bias (rules and source mix asymmetric) and perceived bias (skeptical reader can't see the rules fast enough) are different problems with different fixes.

The operational success criterion: a skeptical reader does not need to agree with a grade. They should be able to see how the grade was reached.

## Tier 1 — Challenge-enabling hygiene

These move alongside the audit because they give readers tools to challenge the dashboard. They do not touch methodology.

### 1.1 Corrections policy

- **What:** Documented criteria for when a grade or fact gets corrected vs re-graded. New `type: "correction"` added to `changelog.json`. Visible corrections view linked from About.
- **Why it qualifies:** Gives readers a documented path to report errors and see them addressed. Journalism table stakes.
- **Deliverable:** `docs/Corrections-Policy.md` plus an About-page link.
- **Constraint:** Process doc only. The mechanism for receiving corrections is in 1.2.
- **Effort:** ~1 hour.

### 1.2 Right-of-reply / feedback channel

- **What:** Published contact route for graded subjects (departments, ministries, agencies, watchdogs, journalists) to submit critiques. Documented review process.
- **Why it qualifies:** Enables the strongest form of challenge, from parties best positioned to challenge specific claims with internal information.
- **Deliverable:** `docs/Right-Of-Reply.md` plus a contact mechanism (email or Kit form). Doc names the process. Mechanism choice is engineering.
- **Constraint:** Not a commitment to publish every reply. Process describes how submissions are evaluated and what gets reflected.
- **Effort:** ~1-2 hours for the doc.

### 1.3 Citation format

- **What:** Format that journalists, researchers, and other dashboards can use to cite this dashboard, including version, access date, and per-dimension reference.
- **Why it qualifies:** Lets external scrutiny pin specific claims. A journalist who wants to challenge a grade needs to cite the dashboard at the version where that grade applied.
- **Caveat:** Borderline Tier 1 vs Tier 3. Citation enables EXTERNAL challenge rather than direct on-page contestation. Kept in Tier 1 because external scrutiny is the strongest available challenge for a publication without a comments system.
- **Deliverable:** A "Cite as" section in About plus per-dimension citation strings in the dimension drawer.
- **Constraint:** Does NOT include stable-URL engineering work (still Tier 3). Citation works against current SPA addressing.
- **Effort:** ~30 min.

### 1.4 Accessibility audit pass

- **What:** Audit pass against WCAG AA criteria with `axe-core` or equivalent. Identifies blockers that prevent readers from accessing grades (color contrast on grade chips, keyboard navigation, screen reader semantics, focus management in the dimension drawer).
- **Why it qualifies:** A reader who can't perceive a grade can't challenge it. Challenge-enabling test passes.
- **Deliverable:** Audit results recorded in `docs/Accessibility-Audit-2026-05.md`. Specific blockers identified with severity.
- **Constraint:** This is the audit, not the fixes. Fixes that touch UI require separate user approval. Full WCAG-AA conformance + accessibility statement remain in Tier 3.
- **Effort:** ~30-45 min for the audit pass.

## Tier 2 — Bias-resistance audit

This is the actual work. Findings drive whether fixes get shipped. Fixes require explicit user approval per fix because they likely touch frozen surfaces.

### 2.1 Audit script

`scripts/audit-bias-resistance.mjs`. Parses `dimensions.json` and `changelog.json`. Outputs raw data for the audit doc.

Mechanical checks covered by the script:
- Source-family distribution per dimension (counts and concentration flags)
- Trigger symmetry mechanical view (presence of URL, presence of numeric threshold, matched trigger counts)
- Critics/defenders pre-check (word count, URL count, named-source count, length imbalance)
- Update-cadence asymmetry (grade-movement counts per dimension over the last N months from `changelog.json`)
- Modifier inventory per dimension (presence and count of `gradeBasis.activeModifiers`)

Not in the script (human-only):
- Vague-verb judgment on triggers
- Strongest-case fairness on critics/defenders
- Loaded-adjective / framing-tells in `judgmentCall` and `judgmentDetail`
- Skeptic-path UI inventory
- Dimension-choice rationale
- Promise-selection rationale
- Excluded-evidence log

### 2.2 Audit doc (Phase 1 — operational audit)

`docs/Bias-Resistance-Audit-2026-05.md`. Seven sections. This is the operational audit — does the methodology apply consistently across dimensions? Script-supported, repeatable each cycle.

1. **Source-family distribution** per dimension (script + human flags)
2. **Trigger symmetry** per dimension (script + human)
3. **Critics/defenders symmetry** per dimension (script + human)
4. **Language audit** per dimension (human only). Includes trend / status field consistency: rule for setting `trend` and `status`, whether applied consistently across dimensions.
5. **Modifier consistency** per dimension (script inventory + human reading). Which dimensions have `activeModifiers`, what each does, whether applied symmetrically (positive vs negative modifier balance per dimension).
6. **Update-cadence / attention-bias check** (script). Which dimensions get refreshed most, which haven't moved in 6+ cycles.
7. **Appendix: skeptic-path UI inventory** (human only). Where a reader currently finds rule, evidence, judgment, trigger, source, critics, defenders, and last-reviewed date per dimension.

**Moved out of Phase 1 (see "Phase 2 foundational audit" below):**
- Dimension-choice rationale, POCKETBOOK_DIMS weighting audit, promise-selection rationale. These ask "is the foundation of the methodology biased in setup?" rather than "is it applied consistently?" Different work, different cadence (annual, not per-cycle). Deserve their own doc.

**Moved out of audit entirely (see "Recurring practice" below):**
- Excluded-evidence log. Not a one-time audit section. Becomes part of every monthly source-coverage ledger going forward.

### 2.2a Phase 2 — Foundational methodology audit

`docs/Foundational-Methodology-Audit-2026.md`. Annual cadence, not per-cycle. Asks the three foundational-bias questions:

1. **Dimension-choice rationale.** Why these 11 graded dimensions? What was considered and not included? What selection rule applied?
2. **POCKETBOOK_DIMS weighting audit.** Why those four dimensions are double-weighted in the Household Impact GPA. Frozen-surface rule per CLAUDE.md means the weighting cannot change without approval, but the rationale audit is fair game.
3. **Promise-selection rationale.** How were the 43 promises selected? What inclusion criteria applied? Is the rule documented in advance or applied post-hoc?

This is pure editorial reflection. No script support. Drafted once per major rubric version (currently v1.1), not per cycle.

### 2.2b Recurring practice — Excluded-evidence log

Each monthly source-coverage ledger gains a new section: "Excluded this cycle." Editor logs what was considered for the cycle and not included, with rationale per item. Not a one-time audit. Becomes a per-cycle artifact in `docs/Source-Coverage-Ledger-YYYY-MM.md`.

Source-family taxonomy (11 buckets, revised 2026-05-16 to split procedural vs critique per audit Q3, and revised 2026-05-23 to add industry / sector associations):

1. PMO / Carney-specific messaging (and partisan-party platform documents)
2. Department / press-release messaging
3. Operational govt data (StatCan, CMHC, IRCC, BoC, Bank of Canada, Budget projections)
4. Independent govt watchdog (PBO, OAG, Ethics Commissioner)
5. Procedural parliamentary records (LEGISinfo bill-tracking, status pages — neutral procedural information, NOT critique)
6. Parliamentary committee / opposition critique (committee reports, minority reports, opposition statements)
7. Independent policy institute / think tank
8. Journalism
9. Academic / university research (includes pollster firms used as polling sources)
10. International benchmark / rating agency
11. Industry / sector association

**Grade-moving source definition (revised):** A source counts as grade-moving if either (a) its URL appears in `gradeTriggers.up[].sourceUrl` or `gradeTriggers.down[].sourceUrl`, OR (b) it's attached to a metric in `metrics[]` array via the `source` field or visible `sourceRefs` links. Metric values determine which `scoring.thresholds` band applies, so metric-attached sources contribute to grade direction even when not in a trigger. Rationale-text source mentions are NOT counted unless also surfaced through a metric source link.

**Independent challenge definition (revised):** Families 4, 6, 7, 8, 9 count as independent challenge unconditionally. Family 10 counts as independent challenge EXCEPT when the family-10 source is the threshold-defining body for the dimension. Currently only Defence & Trade has this exception: NATO is the threshold-defining body for the 2% spending target, so a NATO source on that trigger doesn't add independent challenge — it confirms the measurement against its own rule. Family 5 (procedural parliamentary records) is explicitly NOT independent challenge — it's neutral status-tracking, not critique. Family 11 (industry / sector association) is useful challenge or context evidence, but not independent challenge by default because sector sources have direct stakeholder interests.

Flag thresholds (starting points, may tighten after first audit pass reveals signal vs noise):

- **>60% one-family concentration** (all-sources view per dimension)
- **Grade-moving claim primarily on press release.** Operational definition: a source counts as "grade-moving" if either its URL appears in `gradeTriggers.up[].sourceUrl` / `gradeTriggers.down[].sourceUrl`, or it is attached to a metric in `metrics[]` via a `source` field. The flag fires if any grade-moving source URL is a `pm.gc.ca` URL or a `canada.ca/.../news/` URL. Metric-attached source labels without URLs are classified by source name where possible and flagged manually where the script cannot classify them.
- **No independent challenge source attached.** Operational definition: a dimension's grade-moving sources include none from family 4 (independent watchdog), 6 (parliamentary committee / opposition critique), 7 (policy institute), 8 (journalism), 9 (academic / research), or eligible family 10 sources (international benchmark / rating agency, except where the body defines the dashboard threshold being measured). Family 11 sources may help readers challenge a grade, but do not satisfy this independent-challenge test on their own.
- **Critics-defenders length imbalance.** Operational definition: critics or defenders block is more than 2x the length of the other.
- **Attention-bias flag.** Operational definition: a dimension with zero grade movements in the last 6 cycles while at least one peer dimension had 3+ movements, OR a dimension whose `lastUpdated` is 3+ months older than the cycle date.

Both an all-sources view and a grade-moving-claims view get reported per dimension. A dimension with 8 government context sources plus a CD Howe grade-moving source is fine. The opposite is the problem.

**Tracker dimension handling.** Promise Delivery has `excludeFromGPA: true` and `informationalGrade` instead of `grade`. The audit applies with three modifications: (1) attention-bias check uses status-movement counts rather than grade-movement counts; (2) critics/defenders symmetry is checked on the dimension if `perspectives` is present, otherwise skipped; (3) source-family distribution runs the same way. Any future tracker dimensions follow the same rule.

### 2.3 Findings review

After the audit doc lands, identify 2-3 highest-impact gaps worth shipping fixes for. Park the rest as audit backlog.

### 2.4 Targeted fixes

Each fix is one commit. Each requires explicit user approval per fix because fixes likely touch frozen surfaces (sources, copy, trigger language). Same user-approval gate that protects grade math, threshold values, and the dimension model.

**Operational definition of "explicit user approval":** in-chat confirmation that names the specific fix proposed, captured verbatim in the commit message.

### 2.5 Bias-Resistance Protocol

Stub. Drafted only after Tier 2.3 findings review. Contents TBD based on what the audit reveals. Becomes the per-cycle gate, not a manifesto. File: `docs/Bias-Resistance-Protocol.md`.

### 2.6 Public methodology FAQ

Stub. Drafted only after Tier 2.5 protocol lands. FAQ entries reflect the specific bias accusations the audit findings make most relevant to preempt. No speculative FAQ targets pre-listed here.

## Tier 3 — Backlog

After audit and fixes land. Each is real work but is polish without methodology testing under the guardrail rule, so each waits.

- **Data license decision.** CC-BY 4.0 on data plus MIT on code is conventional but the license commitment is downstream and deserves a real decision, not a quick edit.
- **Funding / affiliation disclosure.** One line. Helps trust but does not help readers challenge a specific grade. Not urgent.
- **Stable URLs per dimension.** Per-dim fragment anchors or query params so external citations survive across versions.
- **Structured-data markup.** schema.org JSON-LD per dimension (Article + Rating + GovernmentService) so aggregators and search engines can parse the grading as structured data.
- **Full WCAG-AA conformance + accessibility statement.** Tier 1 covers the audit; this covers the work to clear blockers and the public-facing statement.
- **Integration tests beyond shape validation.** Vitest on `utils.js` math, snapshot test on rendered dimension card output, frozen-surface protection test.
- **CI lint enforcement.** ESLint configured but not run as deploy gate.
- **Dependabot enabled.** Patch notifications.
- **Raw fetch output committed for reproducibility chain.** Monthly `scripts/output/YYYY-MM/` archive so input-to-output transformations are auditable.
- **Continuity / bus-factor doc.** What a successor editor would need to pick up the cycle.
- **Archival copy.** Monthly automated push to archive.org or a separate archive repo.

## Review and approval rules

- **Reviewer-disagreement protocol.** Plan calls for ChatGPT and Claude reviews. When reviewers disagree, the editor breaks ties. Reasoning gets documented in this doc's revision history.
- **Audit versioning.** When this audit gets re-run in 6 or 12 months, the subsequent audit cross-references this one's findings. Deltas (newly flagged dimensions, resolved flags, threshold changes) get documented in the subsequent audit doc.
- **Explicit user approval per fix.** Each Tier 2.4 fix requires in-chat confirmation that names the specific fix. The approval gets captured in the commit message.

## Script-implementation notes

The audit script (`scripts/audit-bias-resistance.mjs`) needs to handle four edge cases that the data schema permits but the audit rules don't address directly:

1. **`internalRef` triggers.** Some triggers in `gradeTriggers.up[]` and `gradeTriggers.down[]` use `internalRef` (cohort references, anchor links) instead of `sourceUrl`. The script skips these for source-diversity counting and reports them separately as "in-app navigation triggers" rather than flagging as missing sources.
2. **Cosmetic `type: "grade"` changelog entries.** Some `changelog.json` entries tagged `type: "grade"` may have identical `from` and `to` values (cosmetic re-grades). The script only counts entries where `from !== to` for attention-bias purposes.
3. **Inconsistent `role` field on sources.** Some dimensions tag individual sources with `role`, others don't. The script uses the fallback rule (trigger-attached URL = grade-moving) defined above. Editor manually flags any metric-attached source the rule misses.
4. **Tracker dimensions.** Promise Delivery uses `informationalGrade` not `grade` and `excludeFromGPA: true`. Script applies the modified audit per the tracker rule above.

## Hard constraints for this plan

- No grade changes proposed in this doc's scope.
- No threshold changes proposed.
- No source-array changes proposed.
- No changes to GPA weights, `POCKETBOOK_DIMS`, modifier rules, or the 11 graded + 1 tracker model.
- No public claims of being "bias-free" or "neutral."
- "Bias-resistant" and "auditable" are the target.
- Each Tier 2 fix requires explicit user approval per fix.
- Building happens after this plan is reviewed by ChatGPT and Claude.

## Sequencing

Build Tier 2.1 → run Tier 2.2 → review findings (2.3) → ship targeted fixes (2.4) with explicit per-fix approval → Tier 2.5 protocol → Tier 2.6 FAQ. Tier 1 runs in parallel with Tier 2.2 and 2.3. Tier 3 follows the guardrail rule per item, prioritized into future cycles.

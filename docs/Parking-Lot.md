# Parking Lot

**Purpose:** Capture ideas that matter but are not blocking the current task.

**Rule:** If an idea is useful but not a "now" task, put it here instead of carrying it in working memory.

**Last updated:** 2026-04-18

---

## Working Rules

- Workflow efficiency protocol
  The active routing rule for reflection, Claude review, and direct execution now lives in:
  [docs/v2/verification/AI-Workflow-Efficiency-Protocol.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/v2/verification/AI-Workflow-Efficiency-Protocol.md)
  Use that file before turning any prompt idea into a default workflow rule.

- Hard rule for source edits
  If a pass is only adding a missing URL, restoring a broken source chain, or making an already-used claim traceable, it can be done directly.
  If a pass introduces a new analytical source family that changes the evidentiary stack for a dimension, it must first go through:
  1. reflection on source role / source fit
  2. Claude review before the source is treated as settled

  Short version:
  - traceability fix = direct
  - new analytical source family = reflect + Claude review first

---

## Audit Ideas

- Source sufficiency audit by dimension
  Check whether each dimension has enough independent, grade-moving evidence to justify its score, confidence, and precision.

- Per-dimension source authority map
  For each dimension, define the authoritative source roles behind the score:
  - measurement truth
  - policy truth
  - execution truth
  - independent challenge truth
  - context truth
  This should answer not just "how many sources do we have?" but "what kinds of
  verified truth are we claiming, and which sources are allowed to carry each
  kind of claim?"

- Skeptical data scientist reflection pass
  Pressure-test the dashboard as if a critical data scientist reviewed the model, especially:
  - mixed constructs
  - equal-weight averaging
  - plus/minus precision
  - ordinal-to-GPA assumptions
  - confidence calibration

- Reader trust audit
  Ask where a skeptical reader would still feel the dashboard is hand-wavy, overconfident, or internally inconsistent.

---

## Prompt Ideas

- Reusable reflection-gate prompt for Lane C / D Claude tasks
- Reusable execution-vs-review routing prompt for Codex tasks
- Reusable source sufficiency audit prompt
- Reusable "source authority by dimension" reflection prompt
- Reusable "skeptical data scientist" reflection prompt
- Reusable live UI smoke-check prompt

---

## Product / UX Ideas

- CompareView overhaul using inspectability fields
- Methodology tab cleanup and simplification
- Small confidence explanation on-card or in methodology
- Possible tag for construct type (`Process`, `Implementation`, `Response`, etc.)
- Better explanation of whole-letter probation dimensions

---

## Methodology Questions

- For each dimension, what are the authoritative sources for the different kinds of truth we are claiming?
  A future source-authority pass should separate:
  - measurement truth: official/admin/statistical source for the core metric
  - policy truth: what the government actually announced, funded, legislated, or implemented
  - execution truth: whether the thing is operational, disbursed, enforced, or still on paper
  - independent challenge truth: watchdogs, auditors, experts, or institutional critics testing the claim
  - context truth: journalism or policy analysis that informs interpretation but should not move the grade by itself

- Should probationary dimensions always collapse plus/minus to the main letter in a single explicit rule?
- Should the `band` field always represent the whole letter, with the display grade carrying the plus/minus, or is mixed modeling acceptable?
- When is a source stack too thin to justify a full letter move?
- How should confidence labels be operationalized beyond `High` / `Medium`?

### Verbatim note — source authority framing

Yes, exactly, but I'd frame it a little more carefully than "what would each tribe use."

The better question is:

**For each dimension, what are the authoritative sources for the different kinds of truth we are claiming?**

Because "verified truth" is usually not one thing. For a given dimension, we may need different source roles:

- **Measurement truth**
  Official/admin/statistical source for the core metric.
- **Policy truth**
  What the government actually announced, funded, legislated, or implemented.
- **Execution truth**
  Whether the thing is operational, disbursed, enforced, or still just on paper.
- **Independent challenge truth**
  Watchdogs, auditors, institutional critics, or domain experts testing the government's claims.
- **Context truth**
  Good journalism, policy analysis, or commentary that helps interpret but should not move the grade by itself.

So yes, we should absolutely do a per-dimension reflection on sources, but I would not organize it as:
- "what would data scientists use?"
- "what would journalists use?"
- "what would political people use?"

I'd organize it as:
- **what source roles are needed for this construct**
- then ask which communities/sources best satisfy those roles

That avoids turning it into vibe-based stakeholder cosplay.

For example:

**Housing Supply**
- Measurement truth: CMHC, StatsCan
- Policy truth: Budget / program docs / federal housing announcements
- Execution truth: actual starts, project commencement, agreements
- Independent challenge truth: CMHC need estimates, think tanks, expert housing analysis
- Context truth: journalism on municipal/provincial bottlenecks

**Ethics & Transparency**
- Measurement truth: there may be very little true "measurement," which is part of the issue
- Policy/process truth: Ethics Commissioner, official disclosures, blind trust/screen documents
- Independent challenge truth: Democracy Watch, committee reports, governance experts
- Context truth: Globe, CBC, other reporting on background and conflicts
- This is why ethics feels under-anchored even with several sources: the evidence is mostly processual and qualitative

**Economic Policy Response**
- Measurement truth: StatsCan, PBO, BoC
- Policy truth: ISED, Finance, Treasury Board, legislation
- Execution truth: authorization, disbursement, actual uptake
- Independent challenge truth: C.D. Howe, IRPP, IFSD, serious macro analysts
- Context truth: business press, mainstream reporting

So the answer is: **yes, we should do that per dimension**.

I think the right artifact eventually is something like:

**Dimension Source Map**
For each dimension:
1. Construct
2. Core grade-moving claims
3. Required source roles
4. Preferred sources by role
5. Sources that may inform but not move grade
6. Red-flag gaps

That would be much stronger than just saying "we have 20 sources."

And I think this should come **right after** the source sufficiency audit, because the audit tells us where the source stack is weak, and the source map tells us what the stack should be.

So the sequence becomes:
1. **Source sufficiency audit**
2. **Per-dimension source authority map**
3. only then decide whether any scores, confidence labels, or rubric language need adjustment

That's a very solid next-stage methodology move.

---

### Verbatim note — QA gatekeeping review

Yes, those QA rules are coming from our repo work, not from some external hidden standard.

Specifically:
- The file is [docs/QA-Gatekeeping-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/QA-Gatekeeping-Rules.md).
- Git history shows it came in with commit `77c9fca`:
  `Instrument controls: deconfliction matrix, combination rules, QA gatekeeping`
- The file itself says it was created from the April 2026 simulated drill:
  “Based on lessons from the April 2026 simulated drill (Pack 5: announcement bias case).”
- It has become a real governing doc in the repo, not a dead note. A bunch of other files depend on it, including:
  - [docs/v2/verification/Source-Verification-Protocol.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/v2/verification/Source-Verification-Protocol.md)
  - [docs/v2/verification/Claude-House-Style.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/v2/verification/Claude-House-Style.md)
  - [docs/v2/Core-Tri-Lens-Architecture.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/v2/Core-Tri-Lens-Architecture.md)

So your instinct is good: because Claude is now actively citing that file to judge source tiers and evidence roles, we should absolutely sanity-check it.

My take is:
- `Yes`, we should review it.
- `No`, I would not do a full rubric-style rewrite of it right this second.
- `Yes`, I would do a targeted QA-governance review pass on it soon, because it is now load-bearing.

Why I wouldn’t jump straight to rewriting it:
- Most of its rules are still directionally strong:
  - no press-release-only grade moves
  - announcements are not implementation
  - contradiction with prior logic must be resolved
  - confidence changes need actual new evidence
- That’s all still good.
- The risk is not that the file is obviously bad.
- The risk is that it may now be incomplete for the system we’ve evolved into.

The biggest places I’d expect drift are:
- It is built for `grade changes`, but we’re now also using it to reason about:
  - confidence calibration
  - source-family concentration
  - whole-letter probation dimensions
  - source-role discipline like primary anchor vs corroborator vs context
- It has a tier hierarchy, but it does not yet fully encode the source-role framing we’ve been developing:
  - measurement truth
  - policy truth
  - execution truth
  - independent challenge truth
  - context truth
- It probably predates some of the newer methodology decisions:
  - Ethics / Flagship whole-letter normalization
  - source-authority mapping as a planned methodology layer
  - the hard rule we just adopted about new analytical source families requiring reflection + Claude review

So yes, I think a QA pass is worth doing, but I’d do it in this order:

1. Tiny fix pass from the source-fit review
   Clean the two medium orphaned-source issues and the low wording drift.
   That closes the active loose ends first.

2. Reflection pass on the QA file itself
   Ask: is `QA-Gatekeeping-Rules.md` still the right guardrail set for the dashboard as it exists now?

3. Read-only review pass on the QA file
   Identify:
   - what still holds
   - what is stale
   - what is missing
   - what should remain separate from the rubric

4. Only then decide whether to edit the QA file
   That keeps us from rewriting a governing doc impulsively.

So the short answer is:
- yes, those are repo rules we created
- yes, they are now important enough to review
- no, I would not treat that as an emergency rewrite before we close the current source-fit cleanup

If you want, I can draft the reflection prompt for the `QA-Gatekeeping-Rules.md` review next, and make it narrow so we don’t accidentally reopen the whole methodology stack.

---

## Future v2 / Structural Questions

- Flagship Delivery probation outcome after one real cycle
- Promise Delivery long-term role in the product
- Defence & Trade full split trigger
- Carbon Pricing / Climate merge question
- Whether a time-series view should appear after enough monthly cycles accumulate

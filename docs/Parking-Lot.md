# Parking Lot

**Purpose:** Capture ideas that matter but are not blocking the current task.

**Rule:** If an idea is useful but not a "now" task, put it here instead of carrying it in working memory.

**Last updated:** 2026-04-19

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

- Source sufficiency audit by dimension — Completed; see [docs/Current-Roadmap.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Current-Roadmap.md) Current State
  Check whether each dimension has enough independent, grade-moving evidence to justify its score, confidence, and precision.

- Per-dimension source authority map — Completed; see [docs/Source-Authority-Map.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Source-Authority-Map.md)
  For each dimension, define the authoritative source roles behind the score:
  - measurement truth
  - policy truth
  - execution truth
  - independent challenge truth
  - context truth
  This should answer not just "how many sources do we have?" but "what kinds of
  verified truth are we claiming, and which sources are allowed to carry each
  kind of claim?"

- Commitment traceability map — Completed; see [docs/Commitment-Traceability-Map.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Commitment-Traceability-Map.md)
  For each tracked commitment, publish the path from original public source to
  home dimension, construct, indicators, source roles, deconfliction notes, and
  derivative handling.

- Source characterization / source taxonomy review — Completed; see [docs/Source-Characterization-Register.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Source-Characterization-Register.md)
  Reflection and deep-research passes are complete and the Source
  Characterization Register is built across all 30 live source families.
  About.jsx and README.md source-balance taxonomy were moved away from
  blunt left / centre / right labels to institution-type framing in commit
  71d7df2 and now point at the SCR for the canonical per-source-family
  record. Remaining within this workstream: ongoing SCR maintenance as the
  live stack shifts; independent-challenge diversification on the
  Fraser-concentrated dimensions (Economic Policy Response, Major Projects,
  Promise Delivery) if future grade moves rely on Fraser alone; and optional
  addition of a second domestic T2 challenge voice in Defence & Trade and
  Immigration where the live non-official stack currently has no T2
  challenge source.

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
- Reusable "source authority by dimension" reflection prompt — Completed
- Reusable "skeptical data scientist" reflection prompt
- Reusable live UI smoke-check prompt

---

## Product / UX Ideas

- CompareView overhaul using inspectability fields — Deprioritized
  Removed from the live nav on 2026-04-18. Revisit only if it earns a unique
  analyst/power-user job that is meaningfully better than opening two expanded cards.
- Methodology tab cleanup and simplification
- Small confidence explanation on-card or in methodology — Completed
  Live DimensionCards now surface confidence, attribution, and lag tags directly on-card.
- Possible tag for construct type (`Process`, `Implementation`, `Response`, etc.)
- Better explanation of whole-letter probation dimensions
- Top-of-dashboard popularity / political durability signal
  Explore whether Carney approval / vote-strength / public-support data belongs
  at the top of the dashboard as an ungraded signal, a tracker, or a true
  dimension. Do not assume popularity and performance are the same thing.
- Rewrite the Household Impact / "Why two grades?" explainer for clarity — Completed; parked in the About tab and README
  The explainer lives in About.jsx and README.md with plain-language wording
  (names the four household-weighted areas as housing, cost of living, the
  economy, government spending; reassures same 11 areas / sources / rubric /
  QA; clarifies that Promises Delivered is tracked separately; explains the
  divergence signal). The block was removed from the live dashboard header on
  2026-04-19 to cut visual clutter. Score-box subtitles remain on the
  dashboard so each grade card still answers "what is this?" at first glance.
- Expanded-dimension readability / information-overload review
  Open each expanded dimension as a customer would and review whether the
  content helps understanding or overwhelms the reader. Check desktop and
  mobile separately. Questions to test:
  - Is there too much information at once?
  - Is the order of information helping or hurting understanding?
  - Which parts are essential vs clutter?
  - Does the expanded state make the dimension easier to understand, or just
    denser?
  - On mobile, does the amount of content become hard to scan or mentally hold?
  Build a future prompt around reader-trust, information architecture, and
  product-UX expert lenses rather than only methodology.
- Promise Tracker item detail / link model review
  Review what an expanded promise item should link to so a reader can actually
  understand the promise, the current status, and why that status is justified.
  Questions to test:
  - When a promise is marked Delivered / Stalled / Abandoned / In progress,
    what evidence link should explain that status?
  - Should each promise link to the original campaign / budget / announcement
    source that defines what the promise meant?
  - Should it also link to explanatory context showing what completion would
    actually look like in practice?
  - What is the minimum link set that makes the tracker understandable without
    making each item too heavy?
  Think through this as a product-trust and accountability-design problem, not
  just a link-count problem.

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
- Should popularity / approval be a scored dimension, an ungraded top-line
  signal, or stay outside the scoring model entirely?

### Verbatim note — source authority framing

Note: artifact built as [docs/Source-Authority-Map.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Source-Authority-Map.md) on 2026-04-18. Verbatim framing preserved here as historical audit trail.

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

Note: QA gatekeeping review and amendment pass landed on 2026-04-18. See [docs/QA-Gatekeeping-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/QA-Gatekeeping-Rules.md) for the current state. Verbatim framing preserved below as historical audit trail.

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

### Verbatim note — product thesis / future dashboard copy

Note: preserve this wording for a future product-vision / dashboard-copy pass. Do not treat it as adopted live copy until a reflection/build pass settles the final artifact and placement.

A strong draft for this project would be something like this:

**Problem statement**
Political performance information is fragmented, partisan, and hard to audit. Readers can find claims, headlines, and commentary, but they usually cannot find a transparent, repeatable, source-traceable way to judge how a government is performing across major policy dimensions.

**Vision**
Build the most inspectable, disciplined, and reader-trustworthy public performance dashboard for the Carney government: fast enough for a reader to understand at a glance, rigorous enough for a skeptical auditor to trace and challenge.

**Core outcome**
A reader should be able to:
- understand the headline assessment quickly
- inspect why a dimension got its grade
- trace the judgment back to evidence, rules, and source roles
- see uncertainty, attribution limits, and inherited constraints clearly

**Primary user**
A skeptical, informed reader who wants more than partisan vibes but less than a full academic paper.

---

### Verbatim note — source taxonomy / governance review

Note: preserve this framing for a future source-characterization reflection and
deep-research pass. The live About / README copy has already been softened away
from blunt left / centre / right labels, but the deeper governance review
below still remains to be done.

Short answer: **yes, this is a real thing to review**, and **no, I would not
trust our current About-tab left/centre/right labels as a strong governance
layer**.

For CBC specifically, the clean factual statement is:

- CBC/Radio-Canada is a **public broadcaster and Crown corporation**, not a
  private independent outlet in the same category as Globe or The Hub.
- The Government of Canada says CBC/Radio-Canada is **independent in its
  day-to-day operations**, and the Broadcasting Act protects its
  **journalistic, creative, and programming independence**.
- That means "federally owned/publicly funded" is **true in an institutional
  sense**, but "therefore left-wing" is **not a rigorous governance
  conclusion**. That is a political interpretation, not a source-selection
  rule.

The bigger issue is that a public taxonomy like:

- `Centre: CBC News, Globe and Mail`
- `Right: C.D. Howe, Fraser Institute, The Hub`
- `Left: The Narwhal, National Observer`

is probably **too blunt to be defensible**. It mixes:

- public broadcaster
- private newsrooms
- think tanks
- advocacy/watchdog groups
- policy journals

under one ideological-axis label. That is not strong source governance.

What this means for the actual work:

1. Run a **Source Characterization Reflection** first.
2. Then run a **deep-research source review** across the non-official and
   public-facing source families.
3. Then do one narrow build / fix pass to:
   - rewrite the About source-balance section
   - rewrite the README source-balance section
   - optionally add a source-classification note to governance docs if needed

The stronger source-review framework should include:

- `Institution type`
- `Ownership / funding`
- `Editorial independence`
- `Methodological rigor`
- `Beat expertise / reporter or desk credibility`
  - is trust driven by the outlet overall, a specific desk, or a named reporter?
  - when reporter-level track record should matter more than outlet-level branding
- `Role eligibility`
  - measurement truth
  - policy truth
  - execution truth
  - independent challenge truth
  - context truth
- `Political / ideological tendency`
- `Best-use boundary`
  - can move grade
  - can corroborate
  - context only

The real issue is less "is CBC secretly left-wing?" and more "are we using a
source taxonomy that is strong enough for a serious public methodology?" Right
now, the answer is probably not yet.

---

### Verbatim note — what “the remaining items in that cluster” actually means

Note: preserve this wording as a plain-language explanation of the current post-hardening backlog shape.

When I said:

> “The remaining items in that cluster are now mostly:
> research-dependent URLs
> slower hygiene passes
> optional methodology extensions”

what I meant in actual work terms was this:

**1. Research-dependent URLs**

This means the remaining source-chain gaps are no longer the easy kind where we can fix them by threading URLs that already exist somewhere in-repo.

The easy in-repo wins have mostly been taken:
- CARBON-002 closed by threading the direct ECCC OBPS URL
- DEFTRADE-002 closed by threading the Bill C-5 LEGISinfo URL already cited elsewhere

What remains now is the harder class of source work where the needed URL is **not present anywhere in the repo** and has to be found externally, verified, and then threaded back into the correct place.

In practice, that means a future pass would have to do real source research for things like:
- original Liberal platform URLs
- specific program-launch / press-announcement pages
- budget chapter-level URLs rather than broad budget pages
- specific framework / regulatory documents
- specific IRCC stream-policy pages
- ethics platform / announcement URLs

Examples from the current CTM-T2 / U10 state:
- campaign-platform source gaps like `HOUSING-001`, `FISCAL-001`, `FISCAL-002`, `IMMIG-002`, `FLAG-001`
- announcement-page gaps like `AFFORD-002`, `AFFORD-003`, `CARBON-003`, `CLIMATE-001`, `MPROJ-003`, `ECONPOL-001`, `ECONPOL-003`, `DEFTRADE-004`, `DEFTRADE-005`
- framework / document gaps like `HOUSING-004`, `AFFORD-001`, `CLIMATE-002`, `CLIMATE-003`, `CLIMATE-004`, `IMMIG-003`, `MPROJ-002`, `MPROJ-004`
- Ethics-specific U10 gaps like `ETHICS-001` and `ETHICS-002`

What the actual work would be:
- run a scoped research pass
- inventory each missing commitment/document pair explicitly
- find the best original public source URL
- verify it is actually the right source and not just a related page
- thread it into the home dimension `sources` array
- update the CTM `source_document` field
- reconcile SAM / roadmap wording if a previously named source-gap closes

What this category explicitly does **not** mean:
- not “just one more hygiene tweak”
- not “Claude should guess the URL”
- not “we can finish it from repo memory alone”

This is real research work, not bounded in-repo cleanup.

**2. Slower hygiene passes**

This means low-risk, usually non-controversial cleanup work that improves internal consistency, but does not materially change reader trust or the live score story as much as the previous passes did.

These are the kinds of tasks that are still worth doing, but are slower because they involve:
- checking multiple entries one by one
- reconciling labels, tags, or wording across several files
- confirming consistency without changing the underlying methodology

Examples in the current repo:
- remaining durability-tag hygiene where a commitment’s PCR tier fit is clearer than the live tag
- version-string housekeeping like the `QA-Gatekeeping-Rules.md` footer
- clarifying metadata semantics like `meta.json lastUpdated`
- minor residual-count or wording reconciliation when a CTM or SAM residual is partially closed
- non-urgent doc consistency updates after a narrow pass lands

What the actual work would be:
- enumerate the affected fields or entries
- apply the clean-up one by one
- reconcile any downstream docs that repeat the same metadata
- stop without broadening into new scoring or methodology decisions

Why this category is “slower”:
- each item is small
- but each item gives only modest value on its own
- so the work is best done in small bundles, not as the main project lane

This is maintenance and consistency work, not a major trust or product leap.

**3. Optional methodology extensions**

This means ideas that may eventually improve the scoring system or governance layer, but are **not required** to keep the current dashboard functioning coherently.

These are not bugs. They are not blockers. They are candidates for later extension if:
- a repeated scoring problem keeps surfacing
- a commitment becomes grade-moving and exposes a real gap
- a future cycle proves the current framework is missing something important

Examples from the current upstream residual list:
- adding new CSS minimum-indicator coverage where current commitment fit is oblique
  - Housing labour-capacity
  - Affordability competition-code / labelling coverage
  - Economic Policy regulatory-review reports
  - Climate east-west grid integration
  - Major Projects Indigenous Loan Guarantee
  - Defence & Trade interprovincial trade integration / foreign-policy review output
- adding Deconfliction Matrix rows for metrics that now exist in CTM but do not yet have explicit matrix rows
- adding MSR canonical measurement rules for commitment types that are not yet fully specified

What the actual work would be:
- decide whether the gap is truly structural or just occasional
- reflect before editing methodology
- amend CSS / Matrix / MSR only if the missing rule is now worth making permanent

What this category explicitly does **not** mean:
- not “must fix before next release”
- not “current grades are invalid until we do this”
- not “open the whole rubric again”

These are “only if needed” extensions, not active cleanup blockers.

**Short practical translation**

So in plain language:
- **research-dependent URLs** = work we can’t finish without going outside the repo
- **slower hygiene passes** = small consistency cleanups that matter, but do not have high leverage individually
- **optional methodology extensions** = maybe-useful future framework improvements, only worth doing if repeated real-world use proves they are needed

And the implied sequencing is:
1. finish bounded in-repo cleanup while it still yields real wins
2. stop when the remaining source gaps become true research work
3. do product-thesis / quality-bar work while the system is stable
4. return later to research passes or methodology extensions only when they are scoped tightly enough to justify the effort

---

## Future v2 / Structural Questions

- Flagship Delivery probation outcome after one real cycle
- Promise Delivery long-term role in the product
- Defence & Trade full split trigger
- Carbon Pricing / Climate merge question
- Whether a time-series view should appear after enough monthly cycles accumulate

> Note: local absolute file paths in the original transcript were sanitized to repo-relative paths for publication. Text otherwise verbatim.

Here’s the claim-by-claim adjudication. I’m treating the review as a set of claims to test, not a verdict to obey.

One important framing note first: some of the review is strong on **methods / data / governance**, where the bundle gives solid evidence. Some of it is weaker on **UI weight / readability / rendered emphasis**, because the reviewer explicitly did not have a working browser render of the live site. So I’m stricter with claims about rules and looser with claims about visual experience.

**Top Findings**

1. **“The composite headline is still the dashboard’s least defensible surface.”**
   Verdict: `Mostly agree`
   Why: This is directionally right. The repo itself already acknowledges weighting sensitivity in [V2-Scoring-Architecture-Brief.md](docs/V2-Scoring-Architecture-Brief.md), and the score cards do not currently put that limitation right next to the headline values in [ScoreboardHeader.jsx](src/components/ScoreboardHeader.jsx). The reviewer is on solid ground there.
   Narrowing: “least defensible” is a bit too absolute. The composites are also central to the product thesis, and the derivation panel is already unusually transparent. So the real issue is not that the headline is indefensible. It’s that its caveats are under-exposed.
   Practical read: good finding.

2. **“Defence & Trade is one dimension doing two jobs, and the headline hides that.”**
   Verdict: `Agree`
   Why: This matches the repo’s own reasoning in [v2-Decision-Memo-Defence-Trade.md](docs/v2-Decision-Memo-Defence-Trade.md). The deeper issue is not just conceptual. The tripwire wording really does drift across docs:
   - [CLAUDE.md](CLAUDE.md) says opposite direction **or** divergence above 1.0 GPA for two cycles.
   - [v2-Decision-Memo-Defence-Trade.md](docs/v2-Decision-Memo-Defence-Trade.md) says the same, with the updated opposite-direction clause.
   - the review claims `dimensions.json` says something narrower/different, and that’s plausible enough that I’d treat it as a real consistency check item.
   Practical read: strong finding, worth action.

3. **“Flagship Delivery is still structurally weak and its probation has no defined exit mechanism.”**
   Verdict: `Agree`
   Why: The structural weakness is real. Flagship is openly derivative and meta in [dimensions.json](src/data/dimensions.json), and the roadmap still has “Decide whether Flagship Delivery stays on probation after one real cycle” as future work. That means the review is basically right: probation exists, but the pass/fail condition is not yet crisp enough.
   Narrowing: I wouldn’t jump straight to demotion. But I do agree “probation with no clean exit rule” is mushy.
   Practical read: strong finding.

4. **“The governance stack has become self-referentially heavy.”**
   Verdict: `Partly agree`
   Why: The repo clearly has a lot of governance docs. That part is true. And the current roadmap itself parks “new governance/process docs unless they solve a concrete active problem,” which suggests you already feel this pressure.
   Pushback: I do **not** think the right reading is “the governance stack is now mostly drag.” A lot of this machinery is pulling real weight: source hierarchy, QA gatekeeping, deconfliction, trigger verification, frozen-surface tests. The review overreaches a bit by treating document count as near-proof of excess.
   Practical read: good pressure signal, but not a mandate to slash docs.

5. **“Score interpretability: the GPA decimal number is adding false precision.”**
   Verdict: `Partly agree, but one factual claim is stale`
   Why: The conceptual point is fair. Decimal scores still imply more precision than the underlying model fully deserves.
   Important correction: the review says the UI shows numbers like `1.65` and `1.45` to two decimal places. That is no longer true in the live code. [Dashboard.jsx](src/components/Dashboard.jsx) already uses `.toFixed(1)` for both `overallGPA` and `pocketbookGPA`.
   So:
   - the **principle** is partly right
   - the **specific complaint** is outdated
   Practical read: keep the interpretability question, discard the “two decimal places” part.

6. **“The Promise Tracker is under-surfaced on the primary view.”**
   Verdict: `Partly agree`
   Why: The review is right that the top card in [ScoreboardHeader.jsx](src/components/ScoreboardHeader.jsx) mostly shows delivered count plus abandoned/stalled counts, while the richer tracker lives deeper. That’s a real product tradeoff.
   Pushback: “under-surfaced” might overstate it. The card is already one of the four headline surfaces and is clickable. This is more of a “could be more informative at a glance” issue than a “buried” issue.
   Practical read: worthwhile product idea, not a defect.

7. **“The inspectability gap between methodology docs and card content is still real.”**
   Verdict: `Agree`
   Why: This matches both the live product and the repo’s own v2/pilot thinking. The reviewer’s proposed “why not higher / why not lower” move is exactly the kind of thing that would improve reader trust without reopening the full v2 architecture. That feels aligned with your own docs rather than imposed from outside.
   Practical read: strong finding, probably the best product insight in the review.

8. **“The single-editor dependency is an existential continuity risk.”**
   Verdict: `Agree`
   Why: This is plainly true. The repo itself says as much in various ways: red-team reviewer not yet active, inter-rater still in fieldwork, bus-factor/continuity work still pending. This isn’t dramatic language. It’s an honest operational read.
   Practical read: strong finding.

**Weakest Decisions Section**

1. **“Flagship Delivery on open-ended probation.”**
   Verdict: `Agree`
   Same reasoning as above. This is fair.

2. **“Confidence / Attribution / Lag pills on every card without default explanation.”**
   Verdict: `Partly agree`
   Why: The pills are there, and the explanation is behind an expansion in [DimensionCard.jsx](src/components/DimensionCard.jsx). So the review is right that this is governance metadata entering the reader surface.
   Pushback: without live browser inspection, it’s hard to know whether this is a major friction point or a tolerable one. I’d treat this as a plausible UI critique, not a confirmed problem.

3. **“Composite GPA displayed to two decimal places.”**
   Verdict: `Disagree on the factual claim`
   Why: current code shows one decimal, not two, in [Dashboard.jsx](src/components/Dashboard.jsx).
   The underlying precision concern survives. The display-precision complaint does not.

4. **“Approval Signal given equal visual weight with scored composites.”**
   Verdict: `Partly agree`
   Why: Code-wise, yes, it sits in the same four-card row in [ScoreboardHeader.jsx](src/components/ScoreboardHeader.jsx).
   Pushback: whether that truly misleads readers is a rendered-experience judgment. Reasonable concern. Not proven from source alone.

5. **“v2 architecture documented at implementation depth while explicitly parked.”**
   Verdict: `Mostly agree`
   Why: This is one of the sharper meta-points in the review. You do have a lot of v2 thinking parked in docs. If that material keeps needing care while producing no user-facing value, it’s real maintenance drag.
   Pushback: I still wouldn’t delete it reflexively. Some of it is useful design memory. The right move is probably “stop extending it” rather than “purge it.”

6. **“Single-editor operations with no active redundancy mechanism.”**
   Verdict: `Agree`
   Why: same as above.

7. **“Critics / Defenders is a governance balance mechanism surfaced as a reader tool.”**
   Verdict: `Partly agree`
   Why: The review is probably right about the origin of the feature. The code in [DimensionCard.jsx](src/components/DimensionCard.jsx) renders explicit “Critics say / Defenders say” blocks, and that absolutely can read like balance theater if the rest of the card doesn’t frame it well.
   Pushback: I wouldn’t kill it on that basis alone. It may still be doing useful trust work. This feels like a copy/positioning problem more than proof the section shouldn’t exist.

**V2 Recommendation Section**

**“Park v2, except keep the inspectability pilot alive.”**
Verdict: `Agree`
Why: This lines up with the repo better than a “build v2 now” push would. The one nuance I’d add is that the pilot should be treated as a **v1 trust/readability improvement**, not as “starting v2.”

**Next 3 Moves Section**

1. **Composite disclaimer + one-decimal GPA display**
   Verdict: `Partly agree`
   Why: disclaimer idea is good. One-decimal display is already live, so that half is done.

2. **Implement Affordability inspectability pilot**
   Verdict: `Agree`
   Why: high leverage, bounded, aligned with existing design work.

3. **Activate red-team reviewer and write bus-factor doc**
   Verdict: `Agree`
   Why: strong operational recommendation.

**Bottom Line**

If I compress the whole adjudication:

- **Strong / basically right**
  - composite caveat needs better exposure
  - Defence/Trade rule coherence issue
  - Flagship probation needs a real exit rule
  - inspectability pilot is worth doing
  - single-editor continuity risk is real
  - keep v2 parked

- **Right direction, but overstated**
  - governance stack is too heavy
  - Promise Tracker is under-surfaced
  - Approval Signal visual weight is a problem
  - confidence/attribution/lag pills are hurting comprehension
  - Critics/Defenders is mainly disclaimer theater

- **Factually stale / needs correction**
  - headline scores are already shown to **one decimal**, not two

If you want, I can take the next step and turn this into a **triage memo**:
- `Do now`
- `Worth testing`
- `Ignore / not proven`

::inbox-item{title="Review claims adjudicated" summary="Several strong findings hold; one decimal-precision complaint is stale"}
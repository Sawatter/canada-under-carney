# Major Projects Threshold Decision Packet

**Purpose:** Put the Major Projects denominator and threshold question in front of the editor with the arithmetic already computed, so the decision is a judgment call and not a research task.

**Status:** Open. Nothing here is decided. Thresholds and the dimension grade are frozen surfaces and belong to the editor.

**Last updated:** 2026-08-23

**Depends on:** `docs/MPO-Cohort-Denominator-Policy-2026-08.md`, `src/data/dimensions.json` (`major-projects`), `docs/Canonical-Scoring-Sheets.md` (section 8), `docs/Scoring-Rubric-v1.1.md`, `docs/Corrections-Policy.md`

**Used by:** The Major Projects grade, the two headline scores, `docs/Flagship-Delivery-Rules.md` (Major Projects is one of the five flagship files), the August 2026 cycle report and changelog

---

## The decision

Should the Major Projects grade switch from the current cohort denominator to the locked denominator defined in `docs/MPO-Cohort-Denominator-Policy-2026-08.md`, and if so, do the published 30% and 50% threshold values stay where they are?

That is one decision with two parts. The first part changes what the fraction measures. The second part decides whether the bar moves at the same time.

---

## Problem 1: the severity gap between B and C

### What the ladder says now

| Grade | Published criterion |
|---|---|
| A | At least 50% of the cohort shows documented advancement of at least 2 stages from designated, OR one project completes an entire MPO review cycle with a documented timeline improvement. |
| B | At least 30% of the cohort shows documented progress after being added, with at least one project in approved, permitted, or under construction. |
| C | A defined cohort exists, fewer than 30% show progress after being added, no project has completed an entire MPO review cycle, and the national-interest power is unused. |
| D | No documented stage progress after being added, OR projects withdrawn, OR the framework bypassed. |
| F | No working institutional reform, and the approval environment worsens against the inherited baseline. |

### The evidence

B asks for 30% of the cohort to move one stage. A asks for 50% of the cohort to move two stages, or one finished cycle. The step between those two rungs is much larger than the step between any other pair.

Work it through on the current 18 rows. Six projects each moving one stage would read 33.3%. That clears B. The second B condition is already met, because five rows sit at under construction today. So six single-stage moves would earn a B while 12 rows sit still and nothing is finished.

The public B label on this dashboard reads "Clear Progress, Believable Path." Twelve stalled projects and zero completions is a hard fit with that label.

An independent review by OpenAI Codex agreed the gap is real.

### What this problem does not settle

The gap can be closed by raising B, by lowering A, or by adding a rung between them. This packet does not pick one. It records that the gap exists so the editor can decide whether to touch it now or later.

---

## Problem 2: advancement is unweighted, and depth cannot be measured yet

### The evidence

The numerator counts a project once if its `stageDate` is later than its `referredDate`. A move from designated to reviewed counts the same as a move to under construction.

The five counted projects, read from `src/data/dimensions.json` on 2026-08-23:

| Project | Referred | Current stage | Stage date |
|---|---|---|---|
| Contrecœur Terminal Container Project | 2025-09-11 | under_construction | 2026-04-09 |
| Red Chris Copper and Gold Mine | 2025-09-11 | approved | 2026-07-02 |
| Matawinie Graphite Mine | 2025-11-13 | under_construction | 2026-05-19 |
| North Coast Transmission Line | 2025-11-13 | under_construction | 2026-07-22 |
| Crawford Nickel Project | 2025-11-13 | approved | 2026-07-31 |

### Why depth weighting cannot be built this cycle

The cohort records a current stage and the date it was reached. It does not record the stage a project sat at on its referral date, and it holds no stage history.

Referral does not imply a designated start. Five of the 18 rows carry a `stageDate` earlier than their `referredDate`, which means they were already above designated when they were referred. Darlington, McIlvenna Bay, Ksi Lisims, Sisson, and Roberts Bank Terminal 2 are those five.

Counted by what the data can support:

- 8 rows sit at designated with a stage date equal to the referral date.
- 5 rows were above designated on their referral date.
- 5 rows are the counted advancers, and their stage at referral is not recorded anywhere in the file.

So depth weighting would have to assume a designated start for the five that matter most. That assumption is wrong for at least a third of the cohort, and it inflates the depth of any project referred mid-ladder.

This is blocked, not rejected. See the blocked section below.

---

## Problem 3: denominator drift

This is the deepest of the three, because it moves the grade with no change in delivery.

### The evidence

The divisor is the current cohort. When the government adds projects, the measured share falls with nothing delivered. When rows leave the list, the share rises for the same non-reason.

Backtest reconstructed from `src/data/dimensions.json` in git history:

| Snapshot | Cohort | Advanced | Current rule | Band | Locked denominator | Locked share | Band |
|---|---|---|---|---|---|---|---|
| 2026-04-30 | 16 | 2 | 12.5% | C | 16 | 12.5% | C |
| 2026-05-13 | 15 | 2 | 13.3% | C | 16 | 12.5% | C |
| 2026-08-22 | 18 | 5 | 27.8% | C | 15 | 33.3% | B |

Both directions have already happened here. In May the cohort fell from 16 rows to 15, advancement stayed at 2, and the number rose 0.8 points on a list edit. In August the cohort rose from 15 to 18, five real advances landed, and the added rows pulled the share back under the published 30% line.

The locked denominator changes the band in exactly one cycle out of three, which is the current one, and it changes it in the government's favour.

The August result does not turn on how the May removal is treated. Against 15 seats the share is 33.3%. Against 16 seats, if the removed row had been kept, it is 31.3%. Both sit above 30%.

Codex agreed the drift is real and called it the deepest of the three problems.

---

## The arithmetic on current data

Computed in code from `src/data/dimensions.json`, not by hand.

### The measured share

- Cohort rows: 18
- Rows with a stage date later than the referral date: 5
- Current rule: 5 of 18, 27.8%, below the 30% line, band C
- Locked denominator: 5 of 15, 33.3%, above the 30% line, band B

### The displayed grade

The credit-claiming penalty of 0.3 GPA points is applied on this dimension and stays applied. It reflects that most cohort projects are pre-existing private investments being sped up rather than federal projects being created.

- Today: raw band C+ (2.3), less 0.3, displays as C (2.0)
- Under the locked denominator: raw band B (3.0), less 0.3, displays as B- (2.7)

### The two headline scores

Recomputed across the 11 graded dimensions, with the same weights and the same rounding as `src/utils.js`.

| Headline score | Major Projects at C | Major Projects at B- | Change | Displayed today | Displayed after |
|---|---|---|---|---|---|
| Full Policy Audit | 1.8818 | 1.9455 | +0.064 | 1.9 (C) | 1.9 (C) |
| Household Impact | 1.7600 | 1.8067 | +0.047 | 1.8 (C-) | 1.8 (C-) |

Both displayed numbers hold at 1.9 and 1.8. Both headline letters hold at C and C-. The move is visible on one card and nowhere else on the scoreboard.

### How many seats each bar would need

| Bar | Seats needed, 15-seat denominator | Seats needed, 18-seat denominator |
|---|---|---|
| 30% | 5 (have 5, passes at 33.3%) | 6 (have 5, fails at 27.8%) |
| 35% | 6 (have 5, fails) | 7 (have 5, fails) |
| 40% | 6 (have 5, fails) | 8 (have 5, fails) |
| 50% | 8 (have 5, fails) | 9 (have 5, fails) |

Note the coincidence worth naming out loud. Under the locked denominator the current evidence clears the 30% bar by 3.3 percentage points, and a single seat is the difference. Any bar at 35% or above holds the grade at C on today's data.

---

## The four options

Each option is written as text that could be published as-is. Each is followed by what it yields on the numbers above.

### Option 1: adopt the locked denominator now, thresholds unchanged

**Publishable rubric text.** The denominator is the seat set as it stood at the close of the previous published cycle. Newly referred projects are shown on the card as pending entry and join the denominator at the start of the next cycle. A seat leaves the denominator only through a published correction. The 30% and 50% threshold values are unchanged.

**What it yields today.** 5 of 15, 33.3%, raw band B, displayed B- after the credit-claiming penalty. Major Projects moves C to B-. Full Policy Audit 1.88 to 1.95, displayed 1.9 either way. Household Impact 1.76 to 1.81, displayed 1.8 either way.

**What it costs.** A grade move in the government's favour in the same cycle the rule changes. It also costs a code change, because `src/components/DimensionCard.jsx` currently computes the displayed percentage from the live cohort length.

**What it risks.** A reader sees a rule change and a grade rise together and reads causation into the pairing. That reading would be correct, which is why it has to be stated rather than managed.

**How a hostile reader would characterise it.** "They changed the measuring stick and the government went up a grade in the same breath."

### Option 2: adopt the locked denominator effective next cycle

**Publishable rubric text.** Same denominator text as Option 1, with an effective date at the start of the next monthly cycle. The current cycle is graded under the existing rule.

**What it yields today.** No change. Major Projects holds at C on 5 of 18, 27.8%. Both headline scores hold.

**What it yields next cycle.** The lock date becomes the current cycle's `asOf` and the denominator becomes 18. The same five advances then read 27.8% and the grade holds at C, unless more projects move. So the deferral does not delay the B; on the current seat set it cancels it.

**What it costs.** The cycle that motivated the fix is graded under the rule the fix exists to remove. The published August number stays a number the policy document already describes as drift.

**What it risks.** It looks even-handed and is not. Deferring a rule whose one known effect is a rise, until the cycle where that effect has expired, is a decision about the outcome dressed as a decision about timing.

**How a hostile reader would characterise it.** "They wrote a fix, found it helped the government, and postponed it until it stopped helping."

### Option 3: adopt the locked denominator and raise the bar at the same time

**Publishable rubric text.** Denominator text as in Option 1. The B threshold moves from 30% to 35%, and A moves from 50% to 40% of the cohort advancing at least two stages, or one completed cycle with a documented timeline improvement.

**What it yields today.** 5 of 15, 33.3%, below a 35% bar, band C, displayed C. Major Projects holds. Both headline scores hold.

**What it costs.** Two judgment changes land in one edit, after the result of each is already known. It also spends the severity-gap fix on a cycle where its effect is to cancel a rise, which taints a change that is defensible on its own.

**What it risks.** It is the least legible of the four. A reader who works out that either change alone would have moved the grade, and that the pair together does not, has found something that reads as engineered even where it was not.

**How a hostile reader would characterise it.** "The number finally cleared the bar, so they moved the bar."

### Option 4: change nothing

**Publishable rubric text.** No change. The denominator stays the current cohort. Thresholds stay at 30% and 50%.

**What it yields today.** Major Projects holds at C on 5 of 18, 27.8%. Both headline scores hold.

**What it costs.** The drift stays live, and it is now documented in the repository. The next referral batch lowers the measured share with nothing delivered, and the file has a published policy explaining why that is wrong.

**What it risks.** The known-and-unfixed position is weaker than the never-noticed position. A reader who finds `docs/MPO-Cohort-Denominator-Policy-2026-08.md` sees the flaw described in the project's own words and left running.

**How a hostile reader would characterise it.** "They found the bug, wrote it up, and kept using it because fixing it would have helped the wrong side."

---

## The moving-goalposts risk

The risk is one thing stated plainly. A scorecard that adjusts its rules after seeing what the rules produce is not a scorecard. It is a running commentary with arithmetic attached.

This decision sits inside that risk in a way that cannot be undone. The measurement has already been run both ways. The editor knows the current denominator yields C and the locked denominator yields B-. No option restores an evidence-blind position, and the packet should not claim one. Codex made the same point: do not describe any of this as pre-registration.

What each option does with the risk:

| Option | How it handles the risk |
|---|---|
| 1. Adopt now | Takes it head on. The rule change and the grade move are published together, with the changelog stating that the rule moved the grade and new evidence did not. The rule is written to bind both directions in future cycles, and the backtest showing it changes one cycle out of three is published with it. |
| 2. Adopt next cycle | Appears to avoid the risk and does not. Deferring a known-direction change until its effect lapses is itself a decision made with the answer in hand. |
| 3. Adopt and raise | Carries the most exposure. Two changes with known effects land together and cancel. Each change is defensible alone, which makes the combination harder to explain, not easier. |
| 4. Change nothing | Avoids the accusation and keeps the flaw. The drift continues to move the grade in whichever direction the list happens to move. |

One test cuts through the four. Would this rule have been adopted if the arithmetic had run the other way, with the locked denominator pushing the grade down? If the honest answer is yes, Option 1 is the rule. If the honest answer is no, none of the options are safe and the denominator policy should be withdrawn rather than applied selectively.

---

## Party symmetry

The dashboard is non-partisan by construction. Each option is checked here for a rule that resolves differently depending on who governs.

**Option 1 is symmetric.** The lock date is the previous cycle's `asOf` value. The entry lag is one cycle for any seat. Exit is blocked for any seat that stalls or is withdrawn. None of those rules names a party, a sponsor, or a project type. The mechanism cuts both ways on measured data: adding projects cannot dilute a poor share, and removing projects cannot lift one. It costs the government a cycle of lag on a fast-moving new referral. It costs the reader a retained numerator credit on a project that advanced and was later withdrawn.

**Option 2 is symmetric in the rule and asymmetric in the adoption.** The rule text is identical to Option 1. The choice of effective date was made with the current-cycle outcome known, so the adoption step is where the asymmetry sits, not the rule.

**Option 3 is symmetric in both rules and exposed on the combination.** A locked denominator and a higher bar each apply the same way to any government. Adopting both in one edit, after seeing that they cancel, is a sequencing choice made with the answer visible.

**Option 4 is symmetric in text and asymmetric in effect.** The current rule moves the grade whenever the list changes size. That direction is set by whichever way the governing party happens to move the list, so the rule hands part of the grade to the party being graded.

No option resolves differently for a Conservative, Liberal, or NDP-led government reading the same cohort data. The differences between the options are about when a rule is adopted, not about who it applies to.

---

## What is blocked and cannot be decided now

**Depth weighting is blocked on data, not on judgment.**

Any rule that scores a two-stage move above a one-stage move needs to know where each project started. That field does not exist. The cohort holds `stage` and `stageDate` only.

The work that would unblock it:

1. Add a `stageAtReferral` field to each cohort row in `src/data/dimensions.json`.
2. Backfill it from the source page for each of the 18 rows. Five rows need real research, because they were above designated at referral and the referral-date stage is not in the file.
3. Extend `scripts/validate-dimensions.mjs` so a missing or changed `stageAtReferral` fails `npm run test:data`.
4. Only then bring a depth-weighted numerator to the editor as its own packet.

Deciding depth weighting before step 2 would mean assuming each project started at designated. That assumption is wrong for at least five of 18 rows and would overstate depth on exactly the rows where the government's contribution is weakest.

**The severity gap is decidable but is not forced by this packet.** It can be handled in this decision (Option 3) or held for its own packet once depth weighting is available. Holding it has an advantage: a depth-weighted numerator changes what a 30% or 50% bar means, so setting new bars first would mean setting them twice.

---

## Recommendation

**This is a recommendation, not a decision. The reasoning is laid out so the editor can reject it on a named point.**

Take Option 1. Adopt the locked denominator now, leave the 30% and 50% values where they are, and publish the resulting move from C to B- with the rule change named as the cause.

The reasoning, in order:

1. **The drift is a defect, and defects get fixed when found.** The current rule lets the grade move without delivery moving. That is true regardless of which direction it moves in this cycle. A fix whose adoption depends on its direction is not a fix.

2. **The direction is a fact about this cycle, not a feature of the rule.** The backtest covers three snapshots. The rule changes the band in one. In the other two it either holds the number steady or removes a rise the current rule produced. A rule that reverses a spurious May increase and produces a real August increase is behaving the same way both times.

3. **The reader-visible damage is small and the credibility gain is not.** Both headline scores hold at their displayed values, 1.9 and 1.8. One card moves one notch. Against that, the project gains a denominator that a reader can reconstruct from git for any published cycle.

4. **Not combining it with a threshold change is the point.** Codex's position, which I agree with, is that raising the bar in the same edit combines two judgment changes after observing what each produces. Each change would be defensible alone. Landing them together, on the one cycle where they cancel, is the version that is hardest to explain honestly.

5. **The deferral in Option 2 is worse than it looks.** On the current seat set the September denominator is 18 either way. Deferring does not delay the grade move by a cycle. It cancels it, while presenting the cancellation as caution.

Two conditions on the recommendation. They are part of it, not decoration.

**Condition A: publish the methodology decision before the grade application.** The denominator policy lands as its own commit and its own changelog `method` item, dated ahead of the cycle that applies it. That gives a reader a dated artifact showing the rule was written down as a rule, not as a grade justification. It does not claim the rule was written blind, because it was not.

**Condition B: state the cause in plain words in the changelog.** The `grade` item body should say that the rule change moved this grade and that new evidence did not. Something close to: "The five advancing projects were already recorded last cycle. What changed is the denominator." A reader who works this out on their own and finds the changelog quiet about it has learned something worse than the grade move.

**Where I would expect disagreement.** The strongest case against is that a B- on this file overstates the machinery, given no completed cycle, no use of the national-interest power, and 13 of 18 rows with nothing recorded after referral. That case is real. It is an argument that the ladder is too generous, which is Problem 1, and Problem 1 deserves its own packet rather than being settled as a side effect of fixing Problem 3. If the editor concludes the B band is genuinely too low a bar, the honest sequence is to adopt Option 1 now and bring a threshold-height packet next cycle, with the height set against a depth-weighted numerator once `stageAtReferral` exists.

---

## Execution checklist, if the editor says yes to Option 1

Ordered so each step is mechanical. Nothing below is done yet.

### Data

1. `src/data/dimensions.json`, `major-projects.projectCohort`: add the locked-denominator block. Record the lock date `2026-05-13`, the locked seat count `15`, and the 15 locked seat ids. Mark the three August arrivals (`deep-geological-repository`, `west-coast-oil-pipeline`, `roberts-bank-terminal-2-project`) as pending entry.
2. Same file: add `formerNames` to any row whose display name has changed across cycles. `sisson-mine` has carried three strings and is the known case.
3. Same file, `major-projects.metrics`: update the lead metric "Projects with documented progress after being added" from `5 of 18 (~28%)` to the locked reading, and rewrite its `sourceNote` to name the locked denominator.
4. Same file, `major-projects.gradeBasis`: update `band`, `bandCriterion`, `plusMinusRationale`, `whyNotHigher`, and `whyNotLower`. Note that `whyNotHigher` currently reads "Four of 18, about 22%" and `whyNotLower` names four projects, while the metrics block and the up-trigger both say five. That is a stale-copy inconsistency from the Crawford Nickel update and needs correcting whichever option the editor picks.
5. Same file: set `grade` to `B-`, `previousGrade` to `C`, `trend` to `up`, and rewrite `status`. The current `status` string also says "only four show documented progress after referral" and carries the same stale count.
6. Same file: rewrite `verdictLine`. It currently reads "only four show documented progress after referral," which is stale on both the count and the band. Keep it at 110 characters or fewer, with no grade letters and no urgency wording.
7. Same file, `gradeTriggers.up[0]`: the text currently reads "currently 5 of 18, about 28%". Update the parenthetical to the locked reading. Keep `setDate` unchanged, because the condition itself is not new.
8. Same file: update `judgmentDetail`, which names "the 18 projects the Major Projects Office tracks", and set `lastUpdated`.

### Code

9. `src/components/DimensionCard.jsx`, lines 2289 to 2300: `documentedAdvancedPct` divides by `cohort.projects.length`. Change the divisor to the locked seat count. Lines 2346 to 2347 render the sentence and need the same treatment.
10. Same file: render the pending-entry rows so a reader sees them counted separately rather than silently excluded.
11. `scripts/validate-dimensions.mjs`: extend the cohort block near line 930 so a missing, duplicated, or changed seat id fails the check, and so the locked seat count reconciles against the locked id list.

### Docs

12. `docs/MPO-Cohort-Denominator-Policy-2026-08.md`: change **Status** from Proposed to Adopted, with the adoption date, and close the two editor-decision followups at the foot of the file.
13. `docs/Canonical-Scoring-Sheets.md`, section 8 (lines 359 to 379): update the ladder wording to name the locked denominator, update the trigger line at line 376 that reads "currently 5 of 18, about 28%", and keep the credit-claiming penalty note at line 372 with the raw band restated as B.
14. `docs/Monthly-Cycle-Playbook.md`: add a step that writes the locked seat count and the locked seat ids into the cycle report before any stage data is read. The ordering is what makes the lock meaningful.
15. `docs/Dimension-Status-Register.md`, section 2: update the Major Projects heading grade and the unresolved-issue row.
16. `docs/Flagship-Delivery-Rules.md`: Major Projects is flagship file 3. Re-run the Combination Rule with the new grade and record the result.
17. `docs/Current-Roadmap.md`: log the outcome, and open a Next-lane item for the `stageAtReferral` backfill and a Later-lane item for the threshold-height packet.

### Release

18. `src/data/changelog.json`: new entry at index 0. One `method` item for the denominator policy, one `grade` item for Major Projects with `dimensionId`, `dimensionName`, `from: "C"`, `to: "B-"`, `deltaLabel`, `drivers`, and `link`. The `grade` item body carries Condition B.
19. `src/data/meta.json`: bump `version` and `lastUpdated` in the same edit.
20. `src/data/history.json`: the top row is `2026-08` with `overallGPA` 1.88 and `pocketbookGPA` 1.76. Editor call on whether this cycle restates that row or opens a new one.

### Checks

21. `npm run test:data`, and report the exit status.
22. `npm run build`, then open the Major Projects card at desktop and mobile widths against `docs/UI-Regression-Checklist.md`. The pipeline table is the highest-density surface on the dashboard and it is the one being changed.
23. `node scripts/audit-bias-resistance.mjs`, to confirm the modifier and source picture is unchanged.
24. Cross-AI review of the diff before it counts, per the operating loop.

---

## Followups regardless of which option is chosen

- Fix the stale "four" count in `verdictLine`, `status`, `gradeBasis.whyNotHigher`, and `gradeBasis.whyNotLower`. Those four strings disagree with the metrics block and the up-trigger, which both say five. This is a correctness defect on a live card and it is independent of the denominator decision.
- Fix two more stale counts in `major-projects.metrics`, found while computing the arithmetic for this packet. The stage counts in the cohort are 5 under construction, 5 approved, 8 designated. The metric labelled "Projects under construction" reads `4`, and the `sourceNote` under "Projects above designated status" reads "six approved and four under construction". Both disagree with the cohort rows they summarise. The `10 of 18 (56%)` headline on that metric is correct.
- Queue the `stageAtReferral` field and its backfill. Depth weighting stays blocked until it exists.
- Queue a threshold-height packet for the B-to-A severity gap, to be written against a depth-weighted numerator rather than against the current flat count.
- Watch the seat-sprawl condition described in the denominator policy, reviewed once a year rather than each cycle.

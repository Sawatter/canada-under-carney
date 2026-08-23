# MPO Cohort Denominator Policy

**Purpose:** Define the denominator used by the Major Projects dimension when it measures the share of the Major Projects Office (MPO) cohort showing documented advancement after referral. Remove denominator drift, where the measured percentage moves because the tracked list changed size rather than because delivery changed.

**Status:** Proposed. The denominator shape is decided here. The grade effect and the threshold values are editor decisions and are not settled by this document.

**Last updated:** 2026-08-23

**Depends on:** `src/data/dimensions.json` (`major-projects.projectCohort`), `docs/Scoring-Rubric-v1.1.md`, `docs/Corrections-Policy.md`, `docs/Monthly-Cycle-Playbook.md`

**Used by:** The Major Projects grade and its `gradeTriggers`, `docs/Flagship-Delivery-Rules.md` (Major Projects is one of the five flagship files), the monthly cycle report

---

## The problem

The Major Projects grade rests on one measured share. It is the number of cohort projects with documented advancement after referral, divided by the number of projects in the cohort.

Today the divisor is the current cohort. That divisor moves on its own. When the government adds projects, the share falls even though no delivery changed. When projects leave the list, the share rises for the same non-reason.

Both directions have already happened in this repository.

On 2026-05-13 the cohort went from 16 projects to 15. One row, Northwest Critical Conservation Corridor, stopped appearing. Advancement stayed at 2. The measured share rose from 12.5% to 13.3% with nothing delivered.

In the August 2026 cycle the cohort went from 15 to 18. Advancement rose from 2 to 5. Against the 15-project cohort that is 33.3%, which sits in the B band. Against the 18-project cohort it is 27.8%, which sits in the C band. Five real advances landed, and the added projects pulled the number back under the published 30% line.

The measured share should move when delivery moves. It should not move because the list changed size.

---

## What this document decides, and what it does not

**Decided here:** what the denominator is, which projects sit in it, when a project enters it, when a project leaves it, and how a project keeps its identity across cycles.

**Not decided here:** the threshold values. The 30% and 50% figures in `scoring.thresholds` are unchanged by this document. They are an editor decision and a frozen surface.

Changing the shape of the denominator changes the measured percentage. So the editor should read the threshold values once against the new shape and either confirm them or move them. That is a separate decision with its own sign-off.

**Not decided here:** the August grade. Under this policy the August cycle reads 33.3% rather than 27.8%, which crosses the published 30% line. That is a grade move and it needs the editor's sign-off. This document does not move it.

---

## 1. Project identity

A locked denominator only works if the same project stays the same project across cycles. Otherwise a rename looks like one project leaving and a different one arriving, which recreates the drift the lock is meant to remove.

### The natural key does not hold

Keying on sponsor plus `referredDate` was the obvious candidate. It fails on two counts, both measured against the cohort snapshots in git.

**It is not unique today.** Two rows share the sponsor `Government of Northwest Territories` and the `referredDate` `2026-03-12`: Mackenzie Valley Highway and Arctic Economic and Security Corridor. The key collides in the current data.

**Sponsor text is not stable.** Comparing the 15 rows carried from the 2026-05-13 snapshot to the 2026-08-23 snapshot:

| Field | Rows that changed, out of 15 |
|---|---|
| `sponsor` | 8 |
| `sourceUrl` | 15 |
| `name` | 1 |
| `referredDate` | 0 |

Sponsor strings moved from descriptive to legal, for example `GNWT / federal partnership` became `Government of Northwest Territories`, and `Inuit-owned (Nunavut)` became `Nunavut Nukkiksautiit Corporation`. Source URLs moved as a group when the MPO published per-project pages. Only `referredDate` held, and `referredDate` is not unique on its own. Five projects share `2025-09-11`.

Project names move too. Northcliff Resources' tungsten project appeared as `Sisson Tungsten Mine` in May, `Northcliff Resources' Sisson Mine` in July, and `Sisson Mine` in August. One project, three strings, no delivery change.

### The rule: an assigned id

Each cohort row carries an assigned `id`. The id is set once, when the seat is created, and then frozen. It is never re-derived from the name, the sponsor, or the URL.

A name-derived slug is acceptable as the starting value, because it is readable. It stops being a slug the moment it is assigned. `sisson-mine` stays `sisson-mine` if the MPO renames the project again next cycle.

The denominator is a count of ids, not a count of names.

### Matching an MPO row to an existing id

Each cycle, the editor takes each row on the official MPO list and decides which existing id it is. The test runs in this order.

1. `referredDate` matches an existing seat.
2. At least two of these also line up: current or former project name, current or former sponsor, location, MPO project-page slug.

If both hold, it is that seat. If nothing matches, it is a new project and gets a new id.

If two or more seats match, the editor resolves it by hand and records the reasoning in that cycle's report. The tie is never settled by the display name on its own, because the display name is the least stable field in the row.

### Renames

The id does not move. The `name` field is updated to the current official name. The previous string is appended to `formerNames`. The denominator does not change. The advancement record does not change.

### Sponsor-name changes

Handled the same way as renames. A corporate rename, an ownership change, and the editor tidying a descriptive string into a legal name are one case, not three. The id holds. Record the previous string in `formerSponsors` if the change is material enough that a reader would otherwise think it is a different project.

### Re-scoping, splits, and merges

**Scope change under the same MPO entry.** Same id, same seat. Note it in the cycle report.

**One entry splits into two.** The original id stays with the successor that keeps the original `referredDate` and the larger scope. The other successor is a new project. It gets a new id and enters under the entry rule below, which means next cycle. The editor names which successor kept the id.

**Two entries merge into one.** The surviving row keeps the older id. The other id is marked merged and stops being counted. The merge is recorded in the cycle report with the reason, because a merge reduces the seat count by one and that reduction has to be visible.

---

## 2. The lock date

The denominator for a cycle is the seat set as it stood at the close of the previous published cycle.

That is a date already in the data. It is the `projectCohort.asOf` value of the previously published dashboard version. For the August 2026 cycle the lock date is `2026-05-13`, because that was the `asOf` value carried by the version live before the August edit began. Any past lock date is recoverable from git history, so a reader can reconstruct any published denominator.

**Ordering matters.** At the start of a cycle, before touching any stage data, the editor writes two things into the cycle report: the locked seat count and the locked seat ids. The denominator is fixed before the new evidence is read.

That ordering is the point. A denominator chosen after the evidence is read can be chosen to suit the answer. A denominator written down first cannot.

---

## 3. Entry rule

A newly referred project enters the denominator at the start of the next cycle, not the cycle in which it first appears.

The project is shown on the card in the cycle it appears, marked as pending entry, so readers see it. Its stage changes are recorded from the moment it appears. It just does not count yet, on either side of the fraction.

### Why the lag exists

A project referred a few days before a cycle date has had no real chance to advance. Counting it in the denominator straight away lowers the measured share for a reason that has nothing to do with delivery. The lag gives each seat at least one entire cycle of exposure before it is scored.

The lag also removes the point of timing referrals. A burst of listings placed just before a cycle date changes nothing in that cycle.

### The paired edge case

A project can be referred and advance a stage inside the same cycle. It still does not enter the denominator that cycle, and its advance does not enter the numerator that cycle. Both are held together.

When the seat enters next cycle, the advance already on record counts immediately. Holding the pair together stops a numerator credit landing without its denominator seat, which would push the share up for free.

---

## 4. Exit rules

The default is blunt: **a seat does not leave the denominator.** Once a project is counted, it stays counted.

The exceptions are narrow and each one is logged.

### Completion is not an exit

A project that reaches the last stage gate (key `completed`) stays in the numerator and the denominator. Finishing a project is the strongest form of documented advancement after referral. Removing it would mean the measured share falls when a project gets built, which is backwards.

### Withdrawal, cancellation, and removal from the official list

The seat stays in the denominator. It does not leave. Whether the project stops because the sponsor walked away, because the government cancelled it, or because it quietly stopped appearing on the MPO list, the treatment is identical.

A project that never recorded post-referral advancement counts as not advanced, indefinitely.

### A project that advanced and is then withdrawn

The recorded advancement stays in the numerator. The dashboard grades documented movement, and the movement was documented. Deleting it later would rewrite a published record.

The withdrawal is not thereby erased. It fires the existing published `down` trigger, `Any project withdrawn from MPO`, which opens a downward grade review. It is also named on the card.

So a withdrawal is handled by the trigger and the narrative, not by silently editing a data point. Two mechanisms, each doing its own job.

### Stage regression

Same treatment. The numerator counts whether a seat has **ever** recorded a stage advance dated later than its `referredDate`. That flag is sticky. Once true it stays true.

A project moving back down fires the published `down` trigger, `A project moves back to designated from a higher stage`. Again the trigger carries the bad news, not a quiet deletion.

### Corrections

The one path that reduces the denominator is a published correction under `docs/Corrections-Policy.md`.

If the editor finds a seat was created in error, for example the project was never actually referred, the seat is voided and the correction is published with the restated percentage. If the editor finds an advancement was wrongly recorded, the sticky flag is cleared and that correction is published too.

A correction is a visible, dated event with a reader-facing note. It is not a routine cycle edit.

### Why the 2026-05-13 removal is a worked case

The Northwest Critical Conservation Corridor row left the cohort with no logged reason and no correction. Under this policy that could not happen quietly. The seat would either stay, if the project was genuinely referred and later dropped, or be voided as a published correction, if it was never properly on the list.

This policy is not applied backwards to restate published grades. It runs from the August 2026 cycle forward. The May removal is recorded here as the reason the exit rule is written the way it is.

---

## 5. Symmetry

A public scorecard is only credible if the same rule produces the same treatment for any governing party. This section states both directions plainly, using the measured numbers.

### Direction one: late additions cannot dilute poor performance

In August, three new seats appeared: Deep Geological Repository, West Coast Oil Pipeline, and Roberts Bank Terminal 2.

Under the current rule they landed in the denominator straight away. The share read 5 of 18, or 27.8%, which sits in the C band. Under the locked denominator it reads 5 of 15, or 33.3%, which sits in the B band.

**Adding projects cannot lower the measured share.** This direction protects the government from being marked down for growing the pipeline.

### Direction two: removals cannot erase failures

In May, one seat left. The share moved from 2 of 16, or 12.5%, to 2 of 15, or 13.3%. Nothing advanced. The number rose 0.8 percentage points on a list edit.

Under the locked denominator the seat stays and the number stays at 12.5%.

**Removing projects cannot raise the measured share.** This direction protects the reader from a quiet trim.

### One rule, not two

There is a single mechanism here. The seat set is fixed at cycle start, and it changes only through logged events. Both protections fall out of that one mechanism. Neither side gets a version tuned in its favour.

The rule also costs each side something, which is the test of a rule rather than a preference.

- It costs the government: credit for a fast-moving new referral waits one cycle before it counts.
- It costs the reader: a project that advanced and was then withdrawn keeps its numerator credit, and the bad news arrives through a trigger instead of through the fraction.

Any future government of any party gets this identical treatment. The lock date, the entry lag, and the exit rules make no reference to who is in office.

---

## 6. Gaming resistance

### Listing many easy projects

Referral on its own never moves the numerator. New seats do not enter the denominator until the next cycle, so a batch of listings changes nothing in the cycle it lands.

In the following cycle each new seat starts as not advanced. A batch of easy listings therefore pushes the measured share **down** until those projects actually move. Padding the list costs the government.

The residual case is a project that was already about to advance without federal help. That is handled by two mechanisms already published on this dimension: the credit-claiming penalty modifier, which is currently applied, and the guardrail that a project arriving at a higher stage on its referral date does not count as progress until a later stage change is recorded.

### Timing referrals

The lock date is the previous cycle's `asOf` value. It is already published and recoverable from git before the current cycle begins.

A referral placed the day before a cycle date has no effect on that cycle's denominator or numerator. A referral placed the day after has no effect either. There is no date near the cycle boundary that produces an advantage.

### Quietly dropping stalled projects

A seat never leaves the denominator because it stalled or stopped appearing on the official list. A drop fires the published `down` trigger and gets named on the card.

The seat set also lives in `src/data/dimensions.json`, so a removed row shows up in a git diff. The routine check is `npm run test:data` at each cycle, plus the locked seat count and seat ids written into the cycle report before any stage data is touched.

### Renaming to shed a record

A rename does not create a seat. The id is frozen at creation and `formerNames` keeps the previous string. This is the whole reason the identity rule in section 1 comes before the denominator rule.

### The residual risk, stated plainly

The editor still decides what counts as documented advancement after referral. This policy does not remove that judgment, and it should not claim to.

That judgment is disclosed on the card in `judgmentCall` and `judgmentDetail`, and the stage evidence for each seat is listed with a source link. A reader who disagrees can point at the specific seat and the specific stage date. That is the check, and it is a reader-facing one rather than a procedural one.

---

## 7. Worked examples

### The backtest

Cohort snapshots reconstructed from `src/data/dimensions.json` in git history. Percentages computed from the snapshot counts.

| Cycle snapshot | `asOf` | Cohort | Advanced | Current rule | Band | Locked denominator | Locked share | Band |
|---|---|---|---|---|---|---|---|---|
| 2026-04-30 | 2026-04-30 | 16 | 2 | 12.5% | C | 16 | 12.5% | C |
| 2026-05-13 | 2026-05-13 | 15 | 2 | 13.3% | C | 16 | 12.5% | C |
| 2026-08-23 | 2026-07-31 | 18 | 5 | 27.8% | C | 15 | 33.3% | B |

Only the current cycle changes band. It changes in the government's favour.

The August result does not depend on how the May removal is treated. Against the 15-project locked cohort the share is 33.3%. Against a 16-project cohort, if the removed seat had been kept, it is 31.2%. Both sit above the published 30% line.

### Reading the August cycle step by step

1. **Lock.** The previous published cycle carried `asOf: 2026-05-13` with 15 seats. The August denominator is 15. Written into the cycle report before any stage data is read.
2. **Match.** Each of the 18 rows on the current MPO list is matched to a seat id. Fifteen match existing seats, including `sisson-mine` under its third name.
3. **New seats.** Deep Geological Repository, West Coast Oil Pipeline, and Roberts Bank Terminal 2 get new ids. They are shown on the card as pending entry. They do not count this cycle.
4. **Numerator.** Five locked seats carry a stage date later than their referral date: Contrecœur Terminal, Red Chris, North Coast Transmission, Crawford Nickel, and Matawinie Graphite.
5. **Share.** 5 of 15, or 33.3%.
6. **Next cycle.** The September denominator becomes 18, because the three pending seats enter.

Note what step 6 means. The measured share drops next cycle if those three do not move, and it drops for a real reason: three tracked projects sitting still.

### Hypothetical: the entry lag

A tranche of six projects is referred on the day before a cycle date, and one of them records an approval two days later.

That cycle: the denominator stays at its locked value. The six seats are shown as pending. The approval is recorded on the card but does not count.

Next cycle: the denominator rises by six. The recorded approval counts immediately, so the numerator rises by one. A referral burst therefore lands as a net drag until the projects move, which is the honest reading.

### Hypothetical: an advancing project is withdrawn

A seat records a move to `under_construction` in one cycle, then the sponsor cancels and the row leaves the MPO list two cycles later.

The seat stays in the denominator. The numerator keeps the recorded advance, because it happened and was published. The withdrawal fires the `Any project withdrawn from MPO` trigger, which opens a downward grade review, and the cancellation is named on the card.

The fraction moves a little. The trigger does the heavy lifting.

---

## What could go wrong

- **Seat sprawl.** Seats do not leave, so over several years the denominator grows and old dead projects sit in it forever. If the cohort passes roughly 40 seats, or if dead seats pass roughly a quarter of the total, the editor should consider a published cohort generation, for example scoring tranches 1 to 3 as a closed set and opening a second set. That is a methodology decision, not a cycle edit.
- **Identity drift the matching test misses.** The two-of-four match test is a judgment aid, not a formula. A project that changes name, sponsor, and location at once, keeping only `referredDate`, would need a hand call. Record the reasoning in the cycle report when that happens.
- **Merges used as a trim.** Merging two stalled seats into one reduces the denominator by one and lifts the share. The guard is the logged reason in the cycle report. If merges start appearing regularly, tighten the rule so a merged seat keeps both seats until the merged project advances.
- **The lock hides a shrinking real pipeline.** If the official list shrinks sharply while the locked denominator holds, the measured share stops describing the live pipeline. The cohort table on the card shows both counts, so a reader can see the gap. If the gap passes about five seats, say so in the `status` line.
- **Threshold values now sit against a different measurement.** The 30% and 50% lines were set against a moving denominator. They should be read once against the locked one. That is queued as an editor decision, not assumed here.

---

## Followups

- Editor decision: confirm or move the 30% and 50% threshold values now that the denominator shape is fixed.
- Editor decision: sign off the August band move from C to B, or hold it, with the reasoning recorded.
- Data work: add the frozen `id` and `formerNames` fields to each cohort row. Then extend the dimension data check run by `npm run test:data` so it fails when a cohort id is missing, duplicated, or changed from the previous cycle.
- Cycle work: add the locked seat count and locked seat ids to the monthly cycle report template in `docs/Monthly-Cycle-Playbook.md`.
- Watch: the seat-sprawl trigger described above, reviewed once a year rather than each cycle.

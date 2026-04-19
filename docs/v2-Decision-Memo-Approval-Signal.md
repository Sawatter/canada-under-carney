# v2 Decision Memo: Approval Signal

**Question:** Should public-opinion approval of Prime Minister Carney appear on the live dashboard, and if so, how?

**Date:** 2026-04-19
**Status:** Decision landed — ungraded signal live at top of dashboard

---

## The Problem

Readers arriving at the dashboard have a reasonable prior that "how the government is doing" includes "what the public thinks of the Prime Minister." The dashboard's 11 graded dimensions deliberately measure *performance under a published rubric*, not popularity. Leaving approval entirely off the page means readers either assume the two are the same (and conflate them) or leave to a pollster aggregator (and lose the performance context on the way).

But adding approval *into* the scoring model would contaminate the GPA with something the rubric explicitly does not measure. Popularity and performance are not the same thing — the Parking Lot has flagged this for some time: *"Do not assume popularity and performance are the same thing."*

---

## Option 1: Add approval as a scored dimension

### What it would measure
A rolling average of PM approval across CRIC-member pollsters.

### GPA integrity
**Poor.** Approval is driven by communications, economic mood, and comparative dynamics with other leaders — none of which are what the 11-dimension rubric is scoring. Including it inflates the weight of popularity-driving events that happen to correlate with actual performance, and deflates genuine performance on files where public opinion has not caught up.

### Accountability value
Mixed. Approval already has public visibility; the dashboard's value-add is measuring things that are not already in the news.

### Assessment
Rejected. Violates *"no headline claims without reconciled math"* and violates the rubric's stated scope. Popularity is not performance.

---

## Option 2: Add approval as a tracker (like Promise Delivery)

### What it would measure
Same as Option 1, shown alongside Promise Delivery in the tracker row.

### Visual placement
Tracker row — below the graded grid.

### Problem
Promise Delivery is a tracker because its evidence duplicates the graded dimensions and the double-counting argument makes it ineligible for the GPA despite being evidence-based. Approval is not evidence of performance at all — it is a reader reaction to performance (and many other things). Treating it as a "tracker" alongside promise fulfillment would category-confuse two fundamentally different kinds of thing. Promise Delivery is performance data that was disqualified from the GPA for double-counting. Approval is not performance data in the first place.

### Assessment
Rejected. The tracker slot is earned by being graded-quality evidence that got held out; approval does not meet that bar.

---

## Option 3: Add approval as an ungraded signal at the top of the dashboard (chosen)

### What it measures
A 60-day rolling average of direct PM / government approval polls from CRIC-member pollsters publishing full methodology, both an approve and a disapprove percentage, and a disclosed sample size.

### Placement
Top of the dashboard, above the three-card scorecard header, in a visually distinct dashed-border "signal" strip. Explicit text on the box: *"Approval Signal — Not part of the scorecard."*

### GPA integrity
**Preserved.** The signal is outside the scoring stack. It does not feed `calculateOverallGPA` or `calculatePocketbookGPA`. It is a reader-context object, not a grade input. The disclosed framing on the box (*"tracked as an ungraded signal so popularity does not contaminate the 11-dimension performance grades"*) makes the relationship explicit.

### Why top and not bottom
Readers ask "is the PM popular?" as a first-order question. Burying the answer at the bottom forces them to leave the page to find it elsewhere — and they lose the performance context on the way. Top placement, with clearly distinct styling, is the honest compromise: it is the first thing the reader sees, but it is also the first thing that is explicitly labelled as outside the graded stack.

### Why dashed border and muted styling
To break the visual pattern of the three white-card scorecard. Same top-of-page real estate, different design language, so a reader's pattern-matching does not group it with the grades.

### Aggregation: sample-size weighted mean (v2)
The v1 launch used a simple arithmetic mean across pollsters. v2 switched to a sample-size-weighted mean: a poll of n = 2,000 carries twice the weight of one at n = 1,000. This is a standard inverse-variance-approximating weighting when methodologies are broadly comparable, and is more defensible than a simple mean now that Abacus publishes polls with n ≈ 1,900 regularly while Ipsos's typical n ≈ 1,000. The change is methodological, not presentational — the v1-to-v2 shift in displayed numbers is <1 percentage point because sample sizes across the included firms sit in a narrow band (roughly 1,000 – 2,000). Explicit de-housing of systematic per-firm effects remains a v3 option if inter-pollster variance widens.

---

## Source selection

### Inclusion rule
Canadian polling firm · publishes a direct PM or government approval question · publishes both approve and disapprove percentages · discloses sample size and methodology. CRIC accreditation (Canadian Research Insights Council) is preferred but not strictly required — public-interest institutes and well-established firms operating under equivalent transparency standards are admissible.

### CRIC accreditation status (verified against the CRIC member directory, 2026-04-19)
- **Léger** — CRIC accredited. Included.
- **Abacus Data** — CRIC accredited. Included.
- **Ipsos Canada** — CRIC accredited. Included.
- **Angus Reid Institute** — *Not* CRIC accredited (the Institute is a non-profit public-interest polling arm; CRIC accreditation covers commercial research agencies). Included under the equivalent-transparency exception: the Institute publishes full methodology, cross-tabs, and sample details for every release.
- **Innovative Research Group** — *Not* CRIC accredited per the current member directory, but a well-established Canadian public-affairs research firm publishing full methodology. Included under the equivalent-transparency exception. Worth rechecking CRIC status next cycle.
- **Nanos Research Corporation** — CRIC accredited but *excluded* because Nanos publicly tracks "preferred PM" (best-choice question), not direct approve/disapprove. Different construct. Consider as a separate preferred-PM signal in v2.
- **Pollara Strategic Insights** — CRIC accredited. No direct Carney approve/disapprove release surfaced in v1 research. Revisit on next cycle.
- **Mainstreet Research** — CRIC accredited. No recent direct Carney approval release surfaced in v1 research. Revisit on next cycle.
- **Ekos Research Associates** — CRIC accredited. No recent direct Carney approval release surfaced in v1 research. Revisit on next cycle.

### v1 included (5 firms)
Léger, Abacus Data, Ipsos Canada, Angus Reid Institute, Innovative Research Group.

### v1 excluded (with reason)
- **Nanos Research** — different construct (preferred-PM, not approval). Separate signal candidate.
- **Spark Insights** — *confirmed not* CRIC accredited (2026-04-19 check against the CRIC member directory). Additionally, Spark's house numbers are 6–10 points higher than the CRIC-accredited firms in the same weeks, suggesting either a different question wording or a house-effect worth isolating. Remains excluded pending independent methodology review.
- **Research Co. / Mario Canseco** — not CRIC accredited. Publishes approve% but disapprove% is frequently omitted from the public release, which makes the poll unusable for a consistent approve–disapprove pair. Revisit when a consistent pair is available.
- **Pollara, Mainstreet, EKOS** — CRIC accredited, no recent direct Carney approval release surfaced in v1 research window. Revisit on next cycle.

### New analytical source family treatment
Per QA Rule 8, polling firms constitute a new analytical source family on this dashboard. This memo IS the reflection pass. Each of the five v1 pollsters receives a row in the Source Characterization Register covering institution type, ownership/funding, editorial independence, grounded ideological tendency (where sourced), best-use boundary, strongest SAM-role fit, and trust flags. The signal is live-shipping with this governance layer, not ahead of it.

---

## Construct

Single construct: direct job-approval of the Prime Minister (or the government led by the Prime Minister, where the pollster's question is phrased that way). Approve vs. disapprove.

### Known imperfection
Pollsters use slightly different wordings — "Do you approve/disapprove of the job Mark Carney is doing as Prime Minister?" vs. "Do you approve/disapprove of the performance of the Liberal government led by Mark Carney?" The signal treats these as comparable because (a) the answers track tightly in practice, (b) separating them would halve the sample of pollsters per window and lose signal, and (c) the disclosed aggregate rule names this mixing explicitly. If the two sub-constructs drift in v2, revisit.

---

## Update cadence

Monthly, matching the rest of the dashboard's cycle. `approval-polls.json` is hand-curated. Each new poll release from an included pollster is appended as a new entry with full field dates, sample size, methodology note, approve%, disapprove%, and source URL. The component recomputes the rolling average automatically from the data.

---

## Relationship to the two headline grades

Neither the Full Policy Audit nor the Household Impact grade includes approval. Both remain pure functions of the 11 graded dimensions. The approval signal is parallel to the scorecard, not upstream of it. A reader seeing the signal and the grades together is meant to notice *both* and form their own view about the gap between them — not see the signal as validation or refutation of the grades.

---

## What could go wrong

- **House-effect drift.** If one pollster's house average diverges materially from the others (as Spark currently does), the simple mean misleads. v1 mitigation: diversified pollster set. v2 option: weighted mean or exclude extreme outliers.
- **Construct drift.** If the PM-approval and government-approval answers drift apart in v2, the mixed aggregate stops being comparable across pollsters. v1 mitigation: this is disclosed in the memo. v2 action: split into two signals or pick one construct.
- **Sample recency drops.** If the included pollster set slows publication cadence, the 60-day window can shrink to 1–2 polls and the signal becomes noisy. v1 mitigation: the component displays the actual poll count in the window so a reader can tell. v2 option: widen to 90 days if the count drops under 3.
- **Politicization of the signal.** If the approval number is mistaken for a "pass/fail" on the government, the page has failed the Product Thesis. v1 mitigation: explicit "Not part of the scorecard" label, dashed border, muted styling, placement above the grades (not alongside them).

---

## Followups

- Add Research Co. once a reliable approve/disapprove pair is published consistently.
- Add Nanos preferred-PM as a separate signal if a second construct adds value.
- Consider a sparkline on the approval signal if 6+ months of in-file polls accumulate and the trend is the more interesting story than the level.
- Consider sample-size-weighted mean if house-effect dispersion widens.

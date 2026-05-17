# Validation Sprint Templates

**Purpose:** Outreach templates and sprint mechanics for the audience-validation half of the perceived-bias testing methodology. Pairs with `docs/Perceived-Bias-Survey.md` (which covers the survey methodology) and the Bias-Resistance Protocol's public-surface backlog.

**Provenance:** Adapted from the LaunchSims DeepSim report (`launchsims.com/en/share/deepsim/ds_YT_PTw_RLUo2`) generated 2026-05-15. The original templates contained fabricated performance claims (e.g., "zero partisan bias complaints from all major party groups," "72% of early nonprofit analyst users say...") and a non-existent "institutional access pass" offer. Those were stripped. What remains is the outreach structure with honest dashboard claims.

## Sprint hypothesis

> Federal political beat journalists (and, secondarily, nonprofit advocacy policy analysts) feel real pain compiling cross-source federal performance data and would test a methodology-transparent dashboard if reached personally rather than through press-release blast.

This is the LaunchSims hypothesis. The sprint tests whether it's true.

## Pass / fail criteria

Adapted from the LaunchSims framework:

- **Pass:** 3+ recipients reply with a concrete workflow note, specific objection, or request to try the dashboard. Strong pass: 1+ agrees to a call or a real-story trial.
- **Fail:** Replies stay vague ("interesting, will look later"). Or the same objection ("not enough sources from X") surfaces in two consecutive outreach batches without a workaround.

If the sprint fails, the LaunchSims decision rule applies: go back to the audience question before rewriting the outreach copy.

## Template 1 — Federal Political Beat Journalists

**Subject:** Federal performance dashboard — would value your read

**Body:**

> Hi [name],
>
> i've been working on Canada Under Carney, a monthly federal performance dashboard. Grades the Carney government A-F across 11 policy areas using a published rubric. Every grade ties to specific triggers, metrics, and sources you can verify: PBO, StatCan, CMHC, Bank of Canada, CD Howe, IRPP, the Hub, the Narwhal, and others.
>
> The thing i keep tripping on is whether the bias-resistance work actually reads as bias-resistant to journalists across the political spectrum. The methodology FAQ, the bias-resistance protocol, a per-cycle source audit, a corrections policy, and a right-of-reply channel are all published. None of that proves the dashboard is non-dismissible until real journalists try to use it.
>
> Would 10 minutes this week work? Looking for honest feedback on what would have to change for it to be citable in your work.
>
> Dashboard: https://sawatter.github.io/canada-under-carney/
>
> Thanks for your time either way.

**Notes:** Direct, individual register. No buzzword stacking. The "thing i keep tripping on" line is the honest framing the report's persona Mike ("I worry the scoring is biased to favor Carney's policy agenda") deserves. Recipient knows this is a personal ask, not a marketing blast.

## Template 2 — Nonprofit Advocacy Policy Analysts

**Subject:** Federal performance dashboard your MPs would have a harder time dismissing

**Body:**

> Hi [name],
>
> Built a project called Canada Under Carney, a monthly federal performance dashboard. Grades the Carney government A-F across 11 policy areas. The point is sourcing strength: every grade ties to a published rubric, specific evidence triggers, and named sources from across the political spectrum.
>
> i think the thing you might find useful is the source-diversity discipline. Grade-moving claims have to include independent challenge sources (PBO, opposition analysis, policy institute critique), not just government press releases. That's the kind of source mix that's harder for an MP from any party to dismiss as partisan.
>
> Would 10 minutes this week be useful? Looking for an honest read on whether this would actually work in donor reports or MP meetings — what's missing, what's wrong, where the gaps are.
>
> Dashboard: https://sawatter.github.io/canada-under-carney/
>
> Either way, thanks.

**Notes:** Same individual register. The "source-diversity discipline" framing is honest about what the dashboard's bias-resistance work actually does. No fabricated metrics about prior user satisfaction.

## What was stripped from the LaunchSims originals

The LaunchSims templates included claims that the dashboard cannot support honestly:

- "Zero partisan bias complaints from all major party groups across our first 3 published updates" — fabricated; the dashboard has not collected complaint data.
- "72% of early nonprofit analyst users say their MP meeting data is no longer dismissed out of hand" — fabricated; no user survey has been run.
- "Claim your team's free 6-month institutional access pass via this link this week: [link]" — there is no institutional access pass; the dashboard is fully free and public.
- "Eliminate concerns of partisan bias" — overclaim; the dashboard is bias-resistant, not bias-eliminating.
- "Stop wasting 4+ hours sourcing government performance data" — press-release register; rewrites as honest invitation.

The honest version drops manufactured social proof and replaces it with named methodology artifacts the recipient can actually verify.

## Outreach mechanics

Adapted from LaunchSims validation-sprint structure:

1. **Build target list (12-20 recipients).** Federal beat journalists with documented bylines covering Canadian federal policy in the last 6 months. Bias toward newsroom journalists with named bylines, not aggregators. Press-gallery roster, federal-affairs columnists, dedicated parliamentary beat reporters.
2. **Per-recipient research (5 min each).** Read one recent piece to personalize the outreach. The opener can reference the piece without being sycophantic.
3. **Send in batches of 5-7.** Spread over the week. Reply rates fall on Friday afternoons and Mondays.
4. **Track responses in a simple spreadsheet.** Columns: name, outlet, date sent, date replied, response category (no reply / polite interest / real objection / workflow detail / try-call intent), key quote.
5. **After Batch 1, classify and decide.** If the response distribution looks like a pass, push to Batch 2 with the same template. If it looks like a fail, go back to the audience block — maybe nonprofit analysts respond where journalists don't, or vice versa.
6. **Capture every real objection.** "Not enough provincial data," "missing X dimension," "rubric is too complex" — these are gold. Log them, even if the sprint doesn't pass.

## What this sprint does NOT do

- Does not promote the dashboard publicly. This is targeted personal outreach, not a launch.
- Does not promise anything specific in response. "Looking for honest feedback" is the only commitment.
- Does not collect feedback for grading purposes. Feedback might surface methodology gaps; addressing those is separate from the sprint.
- Does not run on a scheduled cadence. Sprints run when the editor has time and a clean dashboard state to point recipients at.

## Versioning

The dashboard state recipients receive should be a known stable version. Avoid running outreach during major rubric or methodology changes. The current stable baseline is v5.53 (the source-recertification commit) and v1.2 of the closure memo (the verification-layer-fix state).

If the sprint runs, log it in the relevant cycle ledger: "Validation sprint Batch N sent on [date]. N recipients. Dashboard at v[X]. Responses logged at [spreadsheet/discussion link]."

## Coverage

This methodology applies to Canada Under Carney at `https://sawatter.github.io/canada-under-carney/`. Templates are offered for adaptation, not as fixed scripts. Adjust to your voice and the specific recipient.

## Version history

- **v1.0 (2026-05-17, v5.54):** Initial drafting. Adapted from LaunchSims DeepSim report. Stripped fabricated performance claims, dropped "institutional access pass" offer, rewrote outreach register from press-release to individual-asking-for-feedback. Pairs with `docs/Perceived-Bias-Survey.md`.

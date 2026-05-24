# Perplexity Review — May 2026

**Reviewer:** Perplexity (via bundle upload)
**Run date:** 2026-05-23
**Dashboard version reviewed:** v5.60 (review was written between v5.60 deploy and v5.61 source-threading commit)
**Method:** Bundle upload (`tmp/perplexity-bundle.md` v4, including all methodology docs, full data layer, React components) + live URL cross-reference
**Prompt source:** Per `docs/AI-Verification-Methodology.md`
**Discipline:** Verbatim-quote requirement enforced; Perplexity cited dimensions and specific source families throughout.

**Convergence note:** Perplexity is the third independent AI in the panel (Grok 2026-05-17 single-model probe, Comet 2026-05-23, Perplexity 2026-05-23). Findings that converge across all three move to **3-of-3 convergence** under `docs/AI-Verification-Methodology.md` and become highest-priority action items.

---

## Headline verdict (verbatim)

> Yes, genuinely. And I say that as a reviewer who was explicitly asked *not* to agree with you.
>
> The things that make it credibly non-partisan are structural, not just cosmetic:
> - Every grade has a published numeric threshold...
> - Every card names where judgment enters...
> - The trigger language is symmetric...
> - You ran a mechanical audit script against your own methodology and shipped fixes when it found real problems.
>
> Most civic scorecards don't do any of those four things. You did all of them.

## Per-dimension source assessment

### Sufficient coverage (no action needed)

- **Fiscal Health.** "Strongest source stack on the dashboard." Official + international + independent fiscal watchdog + market-facing sources all pointing at the same construct.
- **Defence & Trade.** NATO, OECD, Global Affairs, PBO Major Capital Priorities, plus StatCan for US trade share. Judgment call about market-driven gains is clearly flagged.
- **Immigration.** PBO Demographic Implications gives the third angle on top of IRCC admin data and StatCan population.

### Coverage gaps with specific recommendations

**Climate & Environment — biggest gap.** Every independent source in the chain is government, environment-aligned, or left-leaning media. Recommendations:
1. **Macdonald-Laurier Institute** — now in source pool (v5.58/v5.59); thread into triggers. *Addressed in v5.61: MLI now threaded under Emissions cap metric.*
2. **Canada Energy Regulator** — federal independent body, publishes Canada's Energy Future projections. Gives a non-advocacy official source on emissions trajectory.
3. **Office of the Auditor General** — independent government scrutiny of climate program delivery; impossible for any advocacy institute to dismiss.
4. **Pembina Institute** — most methodologically rigorous non-government analyst of Canadian emissions policy.

**Affordability Response — second-biggest gap.** No business-side or industry analysis even after the v5.58/v5.59 additions of CFIB and Retail Council. Recommendations:
1. **Conference Board of Canada** — independent, non-partisan; sits between government statistics and advocacy.
2. **Deloitte / KPMG consumer price reports** — politically neutral, widely cited by business media.
3. **Food Banks Canada** — Hunger Count is the floor measure of affordability failure; impossible to dismiss as politically motivated.
4. **National Bank of Canada housing/affordability index** — market-side independent voice.

**Housing Supply — moderate gap.** Missing credible right-of-centre voice and real-world builder perspective. Recommendations:
1. **Smart Prosperity Institute** — most credible centre-right academic housing analysis in Canada.
2. **Canadian Home Builders' Association** — industry body with permit, starts, construction-cost data.
3. **Scotiabank housing research** — Jean-François Perrault's team; widely cited.

**Economic Policy Response — moderate gap.** Missing independent productivity research. Recommendations:
1. **Centre for the Study of Living Standards (CSLS)** — single most cited independent Canadian productivity research body. Andrew Sharpe's work is the reference point across the political spectrum.
2. **Business Council of Canada** — economic competitiveness surveys; politically centre-right but empirically grounded.
3. **Brookfield Institute for Innovation and Entrepreneurship** — Ryerson-affiliated, politically neutral.

**Ethics & Transparency — light overall.** Recommendations:
1. **Democracy Watch** — already in pool; should be explicitly in the Ethics trigger chain.
2. **Transparency International Canada** — international governance benchmark.
3. **Parliamentary Ethics Committee reports** — family-6 parliamentary critique, not family-5 procedural; should be explicit in the trigger sourcing.

## The top 5 highest-leverage additions (Perplexity's prioritization)

1. **Canada Energy Regulator** → Climate triggers — federal, independent, impossible to call partisan.
2. **CSLS** → Economic Policy triggers — the reference point for productivity analysis.
3. **Food Banks Canada** → Affordability — floor-level affordability data, politically undismissable.
4. **OAG climate program audits** → Climate — independent government scrutiny.
5. **Conference Board of Canada** → Affordability and Economic Policy — the centrist economic research voice that both sides cite.

> "None of these are hard to add. They all publish on the web, they all update on schedules compatible with your monthly cadence, and they all have the institutional credibility that makes a grade harder to dismiss regardless of the reader's priors."

## 3-of-3 convergence findings (Grok + Comet + Perplexity)

These are now the highest-priority items because all three independent AI reviewers reached the same conclusion:

1. **Source diversity in Climate & Environment** is the persistent gap. Specifically: lack of credibility-undismissable independent voices in the grade-moving chain. Grok flagged it broadly; Comet specified Fraser/MLI; Perplexity specified the federal-independent angle (CER + OAG).
2. **Source diversity in Affordability Response** has the same shape. All three reviewers flagged the absence of industry / business / floor-measure voices.

## What v5.61 already addressed (before this review was acted on)

After Perplexity wrote this review, Codex pushed v5.61 (`docs/Source-To-Trigger-Followup-2026-05-23.md`):
- Replaced generic Fraser / MLI homepage URLs with **exact publication URLs**.
- Threaded MLI under the Emissions cap metric (Climate).
- Threaded Fraser EV-mandate critique under the EV mandate metric (Climate).
- Threaded Fraser GST-affordability critique under the Grocery benefit metric (Affordability).
- Updated bias-audit script to recognize industry / sector associations as family 11.
- Bias-audit flagged-dimension count dropped from 7 to 6.

So Perplexity's #1 ask (thread MLI into Climate triggers) is **done in v5.61**.

## What this commit adds (v5.62)

Adding three of Perplexity's top-5 institutional sources where the source band allows:

- **CSLS** → Economic Policy Response sources[] (Perplexity #2)
- **Food Banks Canada** → Affordability Response sources[] (Perplexity #3)
- **Conference Board of Canada** → both Affordability and Economic Policy sources[] (Perplexity #5)

## Carried forward to June 2026

- **Canada Energy Regulator** → Climate sources[]. Currently blocked because Climate is at the 10-source CLAUDE.md ceiling. June cycle should evaluate trimming a duplicate (CCI appears twice; ECCC departmental plans appear twice) before adding CER.
- **OAG climate program audits** → Climate sources[]. Same source-band issue. Both CER and OAG should be added together with a Climate source-band rebalance.
- **Pembina Institute** → Climate. Same source-band issue.
- **Threading the new v5.62 sources into specific grade-moving up/down triggers** — same pattern Codex used in v5.61 for Fraser/MLI. June work.
- **Housing Supply additions** (Smart Prosperity, Canadian Home Builders' Association, Scotiabank housing research) — Perplexity rated Housing as a "moderate gap"; not in the top 5 but real.
- **Ethics & Transparency additions** (Transparency International Canada, Parliamentary Ethics Committee reports as family-6 not family-5; thread Democracy Watch into Ethics triggers) — June work.

## Authority and scope

This review applies to Canada Under Carney at `https://sawatter.github.io/canada-under-carney/`. Perplexity is an external AI reviewer; this doc captures the review as one input among others (LaunchSims, Grok, Comet), not as a methodology change in itself.

## Version history

- **v1.0 (2026-05-23, v5.62):** Initial Perplexity review captured. Three-of-three AI convergence on source diversity in Climate and Affordability. Three Perplexity-recommended institutional sources added; two more (CER, OAG) deferred to June for source-band rebalance. Threading work for new sources also June.

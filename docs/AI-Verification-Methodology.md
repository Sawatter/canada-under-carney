# AI Verification Methodology

**Purpose:** Standing methodology for using AI persona panels to test whether the dashboard reads as bias-resistant, methodology-transparent, and citation-worthy across reader priors. Pairs with `docs/Perceived-Bias-Survey.md` (human responses) and `docs/Validation-Sprint-Templates.md` (human outreach). The AI side runs cheap and fast. The human side carries the load-bearing signal.

**Provenance:** The LaunchSims DeepSim report (`launchsims.com/en/share/deepsim/ds_YT_PTw_RLUo2`, generated 2026-05-15) drove the v5.27 to v5.54 trust-surface arc. A first informal probe on 2026-05-17 (Grok, single model, no verbatim-quote discipline) surfaced two recurring complaints and one methodology gap that this doc codifies.

## What the methodology tests

Whether AI models prompted to read the dashboard from a specific reader prior describe the methodology surface accurately, and whether the same surface reads consistently across model families.

Two failure modes the panel is designed to detect:

1. Models confabulate when asked about a URL they did not actually fetch (presenting paraphrase as quotation, inventing UI text, citing surfaces that do not exist).
2. The methodology surface reads as biased or opaque to a specific reader prior even after the cross-cycle work intended to make it bias-resistant.

## What this methodology does NOT test

- Agreement with grades. Models are not asked whether a grade is correct.
- Forecast accuracy. The panel reads the methodology surface, not the dashboard's predictions.
- Stand-in for human readers. AI panels are a cheap signal layer. The perceived-bias survey collects the actual human signal.

## Panel structure

Standard panel: three frontier LLMs across different model families, four reader personas. Each model runs each persona independently. No sharing of outputs between models.

Models in the current standard:

1. ChatGPT with browsing
2. Claude with web tools
3. Gemini

Single-model runs are a starting probe, not a panel. The 2026-05-17 Grok run was a single-model probe that surfaced the confabulation risk; it is not used as panel signal.

Personas in the standard set:

1. Federal political beat journalist
2. Nonprofit advocacy policy analyst
3. Civic teacher or educator
4. Skeptical voter, populist-leaning, low institutional trust

Optional add-on personas: opposition party policy staffer, retired civil servant, serious civic reader with no advocacy lean.

## Prompt template

Use this prompt verbatim, swapping the persona:

> You are a [persona]. Open https://sawatter.github.io/canada-under-carney/ and assess:
> (a) Would you cite this in your work? Why or why not?
> (b) What would have to change for you to cite it?
> (c) Where do you see bias risk in the methodology?
> (d) Score 1 to 10 on credibility, source diversity, and methodology transparency. Quote what made you decide.
>
> CRITICAL: When you reference something specific on the dashboard, include a verbatim quote with location, for example "From the About tab: '...'". Do not paraphrase and present text as a quote. If you cannot find a specific quote to support a claim, say "no specific quote found."

The verbatim-quote requirement is the anti-confabulation discipline. The first Grok probe (2026-05-17) presented a paraphrase styled as a quotation. That pattern is now treated as the canonical confabulation tell and the prompt is built to catch it.

## Convergence rules

For each finding the panel returns:

- **3-of-3 model agreement on the same finding:** Real signal. Add to the next-cycle carry-forward list.
- **2-of-3 model agreement:** Candidate signal. Log in the cycle ledger; act only if a second panel run or human reviewer confirms.
- **1-of-3 single-model finding:** Single-model artifact. Note in the cycle ledger; do not act unless the single source includes a verifiable verbatim quote the other models missed.

Divergence across personas (different personas saying different things) is expected. That maps to the cross-party label test in the perceived-bias survey. The cut that matters is divergence across MODELS on the SAME persona. That is the noise vs signal line.

## Integration with the cycle ledger

Each panel run gets logged in the relevant cycle's source-coverage ledger with:

- Run date, models used, personas tested.
- Findings sorted by 3 / 2 / 1-model convergence.
- Verbatim-quote check pass rate: did models cite real surface text, or did they confabulate?
- Actions taken or carry-forward decisions.

A panel run is not a per-cycle requirement. It is a tool the editor picks up when the dashboard wants signal on whether recent changes are reading the way they were intended. Suggested cadence: at least once per quarter, plus after any major UI restructuring or rubric version change.

## Limits

- Frontier LLMs are not stable evaluators across time. The same prompt can produce different output a month later. Re-run; do not rely on past panel results as if they are durable.
- Models with browsing tools do not always fetch the URL. The verbatim-quote requirement catches some confabulation, not all.
- Personas are caricatures. A real federal beat journalist will not behave like an LLM's model of one.
- Convergence does not mean correctness. Three models can share the same wrong inference because they share training distribution.
- The panel produces signal, not statistically representative reader opinion. Human responses are still the authoritative trust input.

## First probe findings (2026-05-17, Grok single-model, pre-discipline)

The 2026-05-17 run did not yet require verbatim quotes. It surfaced two recurring complaints and one methodology gap:

1. **Editor disclosure surface.** No public bio or COI surface for the human editor exists on the live dashboard. The About page describes the project, not the person. Reader-trust gap. Candidate for the June 2026 cycle. Low methodology risk: a disclosure surface does not change any grade.
2. **Version archive visibility.** Git tags exist for every cycle (v5.27 to v5.54) but no reader-facing "previous cycles" page lists them. The artifact already exists in version control; the surface to find it does not. Candidate for the June 2026 cycle.
3. **Confabulation flag.** Grok presented a paraphrase styled as a verbatim quote ("Click any grade and you see what would move it up or down with source links"). That text is not on the dashboard. The verbatim-quote requirement above is the response.

Both real findings are carried into the June 2026 cycle ledger as candidate work. The confabulation finding is the reason the panel methodology now requires verifiable quotes with location.

## Authority and scope

This methodology applies to Canada Under Carney at `https://sawatter.github.io/canada-under-carney/`. It is offered as a civic-data trust practice, not as a substitute for human reader review.

## Version history

- **v1.0 (2026-05-17, v5.55):** Initial methodology. Captures the multi-LLM panel structure, the verbatim-quote anti-confabulation rule, convergence rules, and the first single-model probe findings from the 2026-05-17 Grok run. Pairs with `docs/Perceived-Bias-Survey.md` (human responses) and `docs/Validation-Sprint-Templates.md` (human outreach).

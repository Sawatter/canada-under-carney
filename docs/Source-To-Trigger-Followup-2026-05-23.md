# Source-To-Trigger Follow-Up - 2026-05-23

**Purpose:** Close the immediate source-diversity threading follow-up from Comet's 2026-05-23 review without turning it into a June refresh.

**Scope:** Climate & Environment and Affordability Response only.

**Rules applied:**

- Thread exact sources into metric evidence first.
- Do not attach generic source-family pages to grade triggers.
- Do not change grades, thresholds, GPA formulas, or source-weighting rules.
- Leave source-pool context unthreaded where it does not directly support a metric or trigger.

## Climate & Environment

**What changed:** The generic `Fraser Institute - environment publications` and `Macdonald-Laurier Institute - energy and natural resources` source pages were replaced with exact source pages:

- Fraser Institute, `Ottawa should finally end costly push for EVs in Canada`
- Macdonald-Laurier Institute, `Carney's energy superpower talk isn't cutting it - we need action`

**Threading decision:** The MLI source now appears under the Emissions cap metric because it supports the critique that the government has not yet replaced the prior policy framework with a predictable alternative. The Fraser source now appears under the EV mandate metric because it supports the more precise reading that the mandate was scrapped and retooled through tailpipe rules and renewed EV supports.

**Not changed:** Event-driven climate triggers still do not get placeholder URLs. A replacement climate strategy, Paris withdrawal, or additional program elimination should be linked to the actual future event source if it happens.

## Affordability Response

**What changed:** Fraser Institute's `Carney government's GST plan - new name, same flawed 'affordability' strategy` was added as a specific market-oriented challenge source and threaded to the Grocery benefit metric.

**Threading decision:** The PBO source remains the value source for the benefit estimate. Fraser now carries the independent critique of the benefit design and targeting.

**Left as context:** Retail Council remains source-pool context. CFIB stays in the recurring scan but was not retained on the card because this pass did not find exact trigger-level support from CFIB pages. Retail Council pages also showed anti-bot friction in shell probing, so they should be checked with a browser during the June cycle before any trigger-level threading.

## Result

- Climate and Affordability now have visible market-oriented challenge evidence in the metric chain.
- The bias-audit taxonomy now recognizes industry / sector associations as family 11, without counting them as independent challenge by default.
- Rerunning `node scripts/audit-bias-resistance.mjs` drops the mechanical flagged-dimension count from 7 to 6. Climate & Environment and Affordability Response both show `FLAGS: none` in the source-family section.
- No grade changed.
- No threshold changed.
- No formula changed.
- June still needs the normal source-to-trigger pass against fresh data.

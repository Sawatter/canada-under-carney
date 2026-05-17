# Source Recertification 2026-05-16

**Cutoff:** 2026-05-16
**Snapshot:** `src/data/dimensions.json` at `60a2e6e`
**Recert run:** 2026-05-17
**Result:** Passed with June-cycle source-repair candidates. No May grades, source arrays, or ledgers were changed.

This is a retrospective Tier 3 source recertification of the May 16 dashboard state after the bias-resistance arc closed. It was run after the May cycle closed, so it does not replace `docs/Source-Coverage-Ledger-2026-05.md`. It adds a separate row-level source check for the exact snapshot named above.

## Scope

The recert used the May 16 snapshot, not current `HEAD`.

```bash
git show 60a2e6e:src/data/dimensions.json
git show 60a2e6e:src/data/approval-polls.json
```

The URL inventory included:

| Surface | References |
|---|---:|
| Dimension source links | 81 |
| Grade-trigger source URLs | 31 |
| Metric `sourceRefs` | 8 |
| Promise status URLs | 40 |
| Promise original URLs | 43 |
| Approval-poll URLs | 20 |
| Preferred-PM context URLs | 3 |
| Major-project source URLs | 15 |
| Public docs links from live components | 13 |
| **Total references** | **254** |
| **Unique URLs checked** | **114** |

## Rules

This pass used the ambiguity rules set before the work began:

- If a grade-moving Tier B value differed at recert time, log it as `value mismatch - June candidate` and continue.
- If a source URL moved after the cutoff, log the cutoff URL as primary and the current URL as `post-cutoff redirect`; do not replace the source in May.
- Do not change grades, source arrays, threshold values, or the May source-coverage ledger.
- Do not treat newer post-cutoff data as a May grade input. Newer data belongs in the June cycle.

## Method

### Tier A - URL reachability

The link pass checked each unique URL with the same anti-bot pattern now used by the monthly scanner:

1. Descriptive project user agent.
2. Browser-style Safari user agent if the first probe failed.
3. Wayback availability check for non-live results.
4. Secondary browser probe for source families where shell networking is known to time out or return false 403s.

The full machine result is saved at `docs/source-recertification/link-results-2026-05-16.json`.

### Tier B - Specific grade-moving values

Tier B was limited to specific numbers and directly grade-moving claims. It did not try to re-read every narrative source end to end. Narrative source interpretation remains a June-cycle editorial task if a source changes or a new source appears.

## Tier A Results

| Status from shell pass | Count | Meaning |
|---|---:|---|
| `live` | 95 | Loaded with 2xx / 3xx under the primary or browser user agent. |
| `timeout-with-wayback` | 7 | Shell probe timed out; Wayback snapshot exists. |
| `timeout-no-wayback` | 5 | Shell probe timed out; Wayback API did not return a snapshot. |
| `blocked-with-wayback` | 3 | Shell probe returned 403; Wayback snapshot exists. |
| `blocked-no-wayback` | 1 | Shell probe returned 403; Wayback API did not return a snapshot. |
| `broken-no-wayback` | 3 | Confirmed 404 under both user agents; no Wayback snapshot returned. |

The two CBC URLs that had previously appeared broken were rescued by the browser-user-agent retry and loaded live. That confirms the v5.49 retry-with-fallback change is doing the right thing.

## Hard Breaks

These three URLs returned 404 under both probes and had no Wayback snapshot available through the availability API.

| URL | May 16 reference | Status | Completion impact |
|---|---|---|---|
| `https://thenarwhal.ca/carney-climate-rollback-oil-gas-industry/` | Promise Delivery source, climate rollback analysis | 404, no Wayback | June link-repair candidate. Not a grade-moving source for a graded dimension. |
| `https://www.canada.ca/en/environment-climate-change/news/2024/11/federal-government-releases-proposed-framework-regulations-to-reduce-greenhouse-gas-emissions-in-the-canadian-oil-and-gas-sector.html` | Promise Delivery, Emissions cap original/status source | 404, no Wayback | June link-repair candidate for the promise tracker. |
| `https://www.canada.ca/en/environment-climate-change/services/managing-pollution/energy-production/transportation/clean-vehicles.html` | Promise Delivery, EV mandate original/status source | 404, no Wayback | June link-repair candidate for the promise tracker. |

These are real source-health problems, but they do not block the May 16 recert because they do not break an 11-dimension grade-moving chain. They should be handled in the June source refresh.

## Network Friction Cases

Several URLs failed from the shell environment but loaded through a browser or alternate network path. These are logged because they can produce false link-rot noise.

| URL / source family | Shell result | Secondary result | Treatment |
|---|---|---|---|
| Ethics Commissioner root and `/en/` | timeout, no Wayback | Browser probe loaded | Network-specific. Not a source break. |
| PM Ethics Annex A and summary PDFs | timeout, Wayback available | Browser probe loaded | Network-specific. Not a source break. |
| StatCan Daily GDP, CPI, and population pages | timeout, Wayback available | Browser probe loaded and cited values were visible | Network-specific. Not a source break. |
| StatCan trade table `12-10-0176-01` | timeout, no Wayback | Browser probe loaded table page | Network-specific. June scanner should keep using fallback / alternate network for StatCan. |
| Global Affairs December 2025 trade report | timeout, no Wayback | Browser probe loaded and cited values were visible | Network-specific. Not a source break. |
| Fraser Institute MPO commentary | 403, Wayback available | Browser probe loaded | Anti-bot / shell-blocked. Not a source break. |
| IISD climate target note | 403, Wayback available | Browser probe loaded | Anti-bot / shell-blocked. Not a source break. |
| IISD carbon-pricing review | 403, no Wayback | Browser probe loaded | Anti-bot / shell-blocked. Not a source break. |
| OECD Economic Survey Canada 2025 | 403, Wayback available | Browser probe loaded | Anti-bot / shell-blocked. Not a source break. |
| ISED sovereign AI compute strategy | timeout, Wayback available | Browser probe loaded | Network-specific. Not a source break. |
| Justice Laws Canada Act page | timeout, Wayback available | Browser probe loaded | Network-specific. Not a source break. |
| Transport Canada ALTO assessment statement | timeout, no Wayback | Browser probe loaded | Network-specific. Not a source break. |

## Tier B Value Checks

| Area | May 16 claim checked | Source status | Recert result |
|---|---|---|---|
| Defence & Trade | NATO spending clears the 2% threshold; PBO capital-priorities note discusses the 5% / 3.5% path and NATO 2% confirmation. | PBO page live; NATO page live. | Supports grade-moving chain. No value mismatch logged. |
| Defence & Trade | U.S. export share 71.7%, non-U.S. exports +17.2%, EU exports +23.4%. | Global Affairs page timed out in shell but loaded in browser; cited values were visible. | Supports cited values. Shell timeout is a June scanner-hardening note, not a May mismatch. |
| Major Projects | 15-project MPO cohort and $126B government headline figure; challenge sources note pre-existing progress risk. | PMO / MPO / LEGISinfo / Angus Reid live; Fraser shell-blocked but browser-loaded and Wayback exists. | Supports source chain. No value mismatch logged. |
| Fiscal Health | PBO fiscal-anchor assessment remains the source for "on track, with caveats." | PBO page live. | Supports cited claim. No value mismatch logged. |
| Economic Policy Response | Business investment rose 0.3% in 2025. | StatCan Daily page shell-timeout; browser-loaded. | Supports cited value. No value mismatch logged. |
| Affordability Response | Food purchased from stores rose 4.4% year over year in March 2026. | StatCan Daily page shell-timeout; browser-loaded. | Supports cited value. No value mismatch logged. |
| Carbon Pricing Policy | CCI industrial-pricing thresholds and ECCC OBPS page remain the trigger source family. | CCI and ECCC pages live. | Supports trigger source chain. No value mismatch logged. |
| Climate & Environment | Emissions cap suspended; ECCC budget cuts to 2030; climate-plan credibility sources. | CCI, CBC, Conversation, and ECCC live; IISD shell-blocked but browser-loaded. | Supports source chain. No value mismatch logged. |
| Immigration | PR target 380,000 and PBO demographic-implications challenge source; 2025 population change -102,436. | PBO and IRCC live; StatCan Daily browser-loaded. | Supports cited values. No value mismatch logged. |
| Housing Supply | March 2026 housing-starts trend 248,378 and monthly SAAR 235,852; PBO BCH estimate and spending trajectory. | CMHC and PBO live. | Supports cited values. No value mismatch logged. |
| Ethics & Transparency | No PM-specific commissioner review published; Annex A and summary filings exist; ETHI report source works. | Ethics and PRCIEC pages timed out in shell but browser-loaded; House ETHI source live. | Supports source chain. No value mismatch logged. |

### StatCan WDS Metadata

The StatCan WDS `getCubeMetadata` POST timed out from this environment for the Population, Housing Starts, and Trade product IDs. The recert therefore does **not** independently confirm the earlier WDS cube-end-date flags.

This is not a May value mismatch. The Daily pages and CMHC pages support the May 16 dashboard values. The June cycle should rerun WDS metadata from GitHub Actions or another network that reliably reaches the WDS endpoint.

## Approval Polling

Approval polling was checked as a point-in-time source family, not as a "latest poll" determination.

| Surface | Unique URLs | Result |
|---|---:|---|
| Included approval-poll releases | 10 | All live. |
| Preferred-PM context links | 3 | All live. |

No approval-poll URL failure was found. This pass did not decide whether the polling window should be refreshed for June.

## Public Docs Links

The public Methodology and About surfaces pointed to nine unique GitHub documentation URLs at the May 16 snapshot. All nine loaded live:

- `Bias-Resistance-Audit-2026-05.md`
- `Bias-Resistance-Protocol.md`
- `Commitment-Traceability-Map.md`
- `Corrections-Policy.md`
- `Perceived-Bias-Survey.md`
- `Right-Of-Reply.md`
- `Scoring-Rubric-v1.1.md`
- `Source-Characterization-Register.md`
- `v2-Decision-Memo-Approval-Signal.md`

## Blocker Assessment

No blocker was found after the secondary browser probe.

| Blocker rule | Result |
|---|---|
| Grade-moving source URL fails both probes and has no Wayback snapshot | No blocker. Shell-only failures loaded through browser / alternate path. |
| Cited specific value differs materially from the source | No mismatch found in Tier B checks. |
| A dimension's grade-moving source chain fails as a group | No chain failure found. |

## June Candidates

These should be copied into the June source-refresh ledger:

- Replace or archive the three confirmed 404s in Promise Delivery climate-related sources.
- Rerun StatCan WDS metadata for Population, Housing Starts, and Trade from GitHub Actions or another network that reaches WDS.
- Keep the browser-user-agent fallback in the monthly link scanner; it fixed the two CBC false positives.
- Watch the shell-blocked source families in future link-rot passes: Ethics Commissioner, PRCIEC PDFs, StatCan, IISD, Fraser, OECD, and Global Affairs.

## Non-Actions

This recert intentionally did not:

- Change grades.
- Replace sources.
- Add new sources.
- Update threshold values.
- Mutate `docs/Source-Coverage-Ledger-2026-05.md`.
- Convert this pass into an early June refresh.

## Verification Commands

```bash
# Confirm the snapshot
git show 60a2e6e:src/data/dimensions.json | head

# Confirm the frozen May ledger was not touched
git diff -- docs/Source-Coverage-Ledger-2026-05.md

# Standard repo checks
npm run test:data
npm run build
git diff --check
```

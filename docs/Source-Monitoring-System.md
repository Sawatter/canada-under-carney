# Source monitoring system

Every monthly cycle this surveys each cited source surface for new
dimension-relevant material, classifies what it finds, and opens a review PR
with an editor-adjudicated candidate packet. It never moves a grade, threshold,
status, or any dashboard data. Everything it produces is a candidate for the
editor to look at.

This is the relevance and triage layer on top of the deterministic pullers that
already live in `scripts/fetch-data.py`. It does not replace them and it does not
re-implement them. It reads their output.

## Why this exists

The locked requirement: look at the data we pull every time we run the source
pull, not twice a year, and search each cited source's site for newer
dimension-relevant content. Before this, a deep search for new evidence ran only
twice a year, and no source carried a last-reviewed date. See
`docs/Recurring-Source-Checklist.md` for the tiered cadence this slots into.

## The three tiers

1. **Deterministic tier.** `fetch-data.py` already pulls RSS (PBO, pollsters,
   policy and journalism feeds), StatCan WDS cube metadata, IRCC open data, the
   Bank of Canada Valet API, LEGISinfo bill status, the Major Projects Office
   page, the Ethics Commissioner report listing, and a link-rot scan. The
   monitor reads those results and turns the meaningful signals into candidates:
   new feed items not already cited, StatCan releases newer than the cited
   period, projects on the MPO page that are not in the cohort, new Ethics
   listings, and cited URLs that went dead or blocked.

2. **Search fan-out tier (Tavily).** Many surfaces have no feed, render with
   JavaScript, block command-line fetchers, or sit behind a paywall. For those
   the monitor runs domain-restricted, time-windowed Tavily queries. Results are
   provisional discovery only. A snippet is never citation-ready. Anything
   grade-relevant needs a browser pull and editor verification before it touches
   the dashboard.

3. **Relevance pass (Claude `claude-opus-4-8`).** The model routes each
   candidate to an editor queue: metric update, trigger watch, promise status,
   source balance, context, manual browser pull, or irrelevant. It is given each
   dimension's purpose, metric labels, trigger texts, and promise texts. It is
   not given the current grade, so it routes on purpose and evidence rather than
   on the standing score. The model only routes. It does not decide a grade, and
   the no-auto-grade flags on every candidate are set in code, not by the model.

## What gets written

The dashboard data is never touched. The monitor writes to a separate area:

- `monitoring/sources.json` - the source registry (watch list), built from the
  cited URLs in `dimensions.json` and `approval-polls.json`.
- `monitoring/state.json` - per-source state: last checked, last successful
  check, content hash / etag / last-modified where available, last surfaced
  candidate id, stable candidate fingerprints used to avoid repeating unchanged
  items, and any access issue. `lastSuccessfulCheck` only advances on a
  successful fetch.
- `monitoring/ethics-reports.json` - the Ethics Commissioner diff cache, moved
  here from `tmp/` so the month-over-month diff survives across CI runs.
- `monitoring/candidates/YYYY-MM.json` - the structured candidate ledger.
- `docs/Source-Monitoring-Candidates-YYYY-MM.md` - the editor-readable packet.

## How it runs in CI

`.github/workflows/monthly-source-scout.yml` runs on the first of each month:

1. `fetch-data.py --link-rot --json-out scripts/output/fetch-results.json`
2. `generate-source-ledger.mjs`
3. `monitor_sources.py --cycle YYYY-MM --fetch-results ...`
4. A guard step rejects any absolute local path in the committed files. The
   local pre-commit hook still handles the private identity-pattern scan.
5. Opens or updates a draft PR on branch `source-monitor/YYYY-MM` with the packet
   and state. It never pushes to main.
6. Uploads the packet, ledger, and fetch report as artifacts too, so a failed PR
   step still leaves evidence.

### Secrets

Set these as repository secrets:

- `ANTHROPIC_API_KEY` - for the relevance pass.
- `TAVILY_API_KEY` - for the search fan-out.

If a key is missing, that tier is skipped and the packet says so near the top
under Run status, with a heads-up line. The run does not report a clean cycle by
staying quiet. The deterministic tier still runs and still produces candidates.

## Running it locally

```bash
# rebuild the registry after the cited source base changes
npm run monitor:registry

# offline dry-run against the fixture (no network, no API keys)
npm run monitor:dryrun

# a real local run: fetch first, then monitor (keys optional)
python3 scripts/fetch-data.py --link-rot --json-out scripts/output/fetch-results.json
ANTHROPIC_API_KEY=... TAVILY_API_KEY=... \
  python3 scripts/monitor_sources.py --cycle 2026-06 \
  --fetch-results scripts/output/fetch-results.json
```

`--dry-run` skips both the search and relevance tiers. `--no-search` and
`--no-classify` skip one each. `--require-keys` makes a missing key a hard error
instead of a skip.

## What stays manual

- The editor adjudicates every candidate. Nothing is auto-applied.
- Blocked, paywalled, and JavaScript-rendered surfaces need a browser pull to
  read the actual content. The monitor flags these as `manual_browser_pull`.
- Grade moves, threshold changes, and any edit to `dimensions.json` stay an
  editor decision, made through the normal cycle.

## Tests

- `npm run test:monitor` runs `scripts/test_monitor_sources.py`. No network, no
  keys. It locks the registry shape, the deterministic parser behavior (new
  material surfaces, already-cited material is filtered), per-source state
  honesty, and the no-auto-grade invariants.
- `scripts/fixtures/fetch-results-sample.json` is the offline fixture the dry-run
  and the test read.

## The one hard rule

The monitor produces candidates. It does not move grades, statuses, thresholds,
scoring, or dashboard data. That line is enforced in code (the safety flags are
set server-side, not by the model) and stated in every packet.

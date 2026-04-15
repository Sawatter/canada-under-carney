# Canada Under Carney — Performance Dashboard

Non-partisan performance dashboard tracking the Carney government across 12 policy dimensions, updated monthly with government data.

## Features

- **Scorecard** — 12 policy dimensions graded A through F with expandable details
- **Promise Tracker** — 44 government commitments tracked by status (Delivered, In Progress, Stalled, Abandoned, Too Early)
- **Methodology** — Transparent scoring rubric embedded in the dashboard
- **What Changed** — Monthly change log showing grade movements and metric updates
- **Dual grading** — Unweighted GPA (headline) and pocketbook-weighted GPA (household impact)

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173/canada-under-carney/

## Monthly Updates

See [docs/MONTHLY-UPDATE-GUIDE.md](docs/MONTHLY-UPDATE-GUIDE.md) for the step-by-step process.

**TL;DR:** Run the fetch script, review the report, update the JSON data, push to deploy.

```bash
python3 scripts/fetch-data.py     # Pull fresh data
# Review and edit scripts/output/draft-dimensions.json
cp scripts/output/draft-dimensions.json src/data/dimensions.json
npm run dev                        # Preview
git add . && git commit && git push  # Deploy
```

## Project Structure

```
src/data/           — JSON data files (what you edit monthly)
src/components/     — React components (rarely change)
scripts/            — Python fetch script for government APIs
docs/               — Scoring rubric, data sources, update guide
```

## Data Sources

All metrics are sourced from official Canadian government data. See [docs/DATA-SOURCES.md](docs/DATA-SOURCES.md) for the complete mapping.

Primary sources: Statistics Canada, CMHC, PBO, Bank of Canada, IRCC, OECD, Fitch Ratings.

## Scoring Rubric

Grades follow [Scoring Rubric v1.0](docs/Scoring-Rubric-v1.0.md). Grade changes require documented evidence and rubric citation.

## License

All data from Canadian government open data sources under the [Open Government Licence - Canada](https://open.canada.ca/en/open-government-licence-canada).

# Canada Under Carney — Performance Dashboard

**Live dashboard: [sawatter.github.io/canada-under-carney](https://sawatter.github.io/canada-under-carney/)**

Non-partisan performance dashboard tracking the Carney government across 11 graded policy dimensions plus an ungraded Promise Tracker, updated monthly using official statistics, independent policy analysis, and journalism across the political spectrum.

## Current Grades (April 2026)

| Grade Type | Score | GPA |
|---|---|---|
| **Household Impact** | **D+** | 1.5 |
| **Full Policy Audit** | **C-** | 1.7 |
| **Promises Delivered** | **14/43** | 33% |

*Why two grades?* Both headline grades are built from the same 11 graded dimensions. Household Impact is a weighted composite that double-weights Housing Supply, Affordability Response, Economic Policy Response, and Fiscal Health. The Full Policy Audit weights all 11 graded dimensions equally. Promise Delivery is tracked separately and does not feed either GPA. A government can perform better on statecraft than on household-facing files. We show both.

## Features

- **Scorecard** — 11 graded policy dimensions (A through F) plus an ungraded Promise Tracker, with expandable details, rationale, evidence, and source links
- **Promise Tracker** — 43 government commitments tracked by status with expandable evidence
- **Commitment Traceability Map** — published join layer linking commitments to home dimensions, constructs, indicators, source roles, and derivative handling
- **Methodology** — Transparent scoring rubric embedded in the dashboard
- **What Changed** — Monthly change log with grade changes and evidence
- **About** — Source balance, principles, and evaluation methodology
- **Print/PDF** — Export-ready for meetings
- **Mobile** — Responsive design for phones and tablets

## Source Balance

| Category | Sources |
|---|---|
| **Official** | Statistics Canada, PBO, CMHC, Bank of Canada, IRCC, ECCC, Global Affairs Canada, NRCan, Finance Canada / Canada.ca, Office of the Ethics Commissioner, LEGISinfo / parl.ca, direct PM ethics filings, NATO, OECD, IMF |
| **Centre** | CBC News, Globe and Mail |
| **Right** | C.D. Howe, Fraser Institute, The Hub |
| **Left** | The Narwhal, National Observer |
| **Independent** | IRPP / Policy Options, Canadian Climate Institute, IISD, Democracy Watch |
| **Academic** | The Conversation Canada, Dalhousie, PROOF (U of T) |
| **Polling** | Angus Reid |

## Want to Review or Contribute?

We welcome feedback. You can:

1. **Review the dashboard** at [sawatter.github.io/canada-under-carney](https://sawatter.github.io/canada-under-carney/)
2. **Read the scoring rubric** in the Methodology tab or [docs/Scoring-Rubric-v1.1.md](docs/Scoring-Rubric-v1.1.md)
3. **Read the commitment traceability layer** in [docs/Commitment-Traceability-Map.md](docs/Commitment-Traceability-Map.md)
4. **Submit feedback** via [GitHub Issues](https://github.com/Sawatter/canada-under-carney/issues)
5. **Run it through your own AI** — paste the dashboard URL into ChatGPT, Claude, or Gemini and ask it to critique the methodology, challenge the grades, or identify missing perspectives

## Monthly Updates

See [docs/MONTHLY-UPDATE-GUIDE.md](docs/MONTHLY-UPDATE-GUIDE.md) for the step-by-step process.

```bash
python3 scripts/fetch-data.py     # Pull fresh government data
# Review and edit scripts/output/draft-dimensions.json
cp scripts/output/draft-dimensions.json src/data/dimensions.json
npm run dev                        # Preview locally
git add . && git commit && git push  # Deploy (auto-builds)
```

## Data Sources

Metrics are drawn from official statistics (Statistics Canada, PBO, CMHC, Bank of Canada, IRCC), independent policy analysis, and quality journalism across the political spectrum. See [docs/DATA-SOURCES.md](docs/DATA-SOURCES.md) for the complete 20-source monitoring stack.

## Built With

- React + Vite, deployed on GitHub Pages
- Built with AI assistance (Claude Code). Methodology stress-tested through simulated adversarial review.
- Fact-checked against primary source claims with documented source manifest.
- All editorial judgments made by the human editor. AI tools assisted with research, drafting, and QA — they did not make grading decisions.
- Scoring Rubric v1.1 — [docs/Scoring-Rubric-v1.1.md](docs/Scoring-Rubric-v1.1.md)

## License

Dashboard code is open source. All data from Canadian government open data sources under the [Open Government Licence - Canada](https://open.canada.ca/en/open-government-licence-canada).

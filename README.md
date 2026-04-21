# Canada Under Carney — Performance Dashboard

**Live dashboard: [sawatter.github.io/canada-under-carney](https://sawatter.github.io/canada-under-carney/)**

Non-partisan performance dashboard tracking the Carney government across 11 graded policy dimensions plus an ungraded Promise Tracker, updated monthly using official statistics, independent policy analysis, and documented journalism from multiple institution types and perspectives.

## Current Grades (April 2026)

| Grade Type | Grade | Score |
|---|---|---|
| **Household Impact** | **D+** | 1.5 |
| **Full Policy Audit** | **C-** | 1.7 |
| **Promises Delivered** | **14/43** | 33% |

**Why two grades?**

Every policy area on this dashboard gets its own letter grade across 11 areas — defence, immigration, climate, housing, the cost of living, ethics, major projects, and more. The two headline grades are different ways of summarizing all 11, because one average can hide important differences.

- **Full Policy Audit** is how the Carney government is performing overall, across all 11 policy areas weighted equally. Defence counts the same as housing; ethics counts the same as cost of living.
- **Household Impact** is the same kind of grade, but focused on the four areas that hit daily life hardest:
  - **Housing** — can you afford a place to live
  - **Cost of living** — are groceries and everyday bills under control
  - **The economy** — are jobs, wages, and productivity going the right way
  - **Government spending** — is the fiscal picture under control

These four areas count twice as much in Household Impact; the other seven still count, just not as heavily. Both grades use the same 11 areas, the same sources, the same rubric, and the same QA rules — only the weighting changes.

**Promises Delivered** is a running tracker of specific commitments (delivered, in progress, too early, stalled, abandoned). It's separate and doesn't feed either grade.

**If the two grades don't match, that's the point.** A government can do well on defence or climate and still be failing on the cost of your life, or the other way around. Showing both means you can see that.

## Features

- **Scorecard** — 11 graded policy dimensions (A through F) plus an ungraded Promise Tracker, with expandable details, rationale, evidence, and source links
- **Promise Tracker** — 43 government commitments tracked by status with expandable evidence
- **Commitment Traceability Map** — published join layer linking commitments to home dimensions, constructs, indicators, source roles, and derivative handling
- **Rubric** — Transparent scoring rubric embedded in the dashboard
- **Change Log** — Monthly change log with grade changes and evidence
- **About** — Source balance, principles, and evaluation methodology
- **Print/PDF** — Export-ready for meetings
- **Mobile** — Responsive design for phones and tablets

## Source Balance

This is a source-type summary, not a full manifest and not a formal left/right scorecard. For the canonical per-source-family record (institution type, ownership / funding, editorial independence, tier, best-use boundary), see the [Source Characterization Register](docs/Source-Characterization-Register.md).

| Category | Sources |
|---|---|
| **Official / administrative** | Statistics Canada, PBO, CMHC, Bank of Canada, IRCC, ECCC, Global Affairs Canada, NRCan, Finance Canada / Canada.ca, Office of the Ethics Commissioner, LEGISinfo / parl.ca, direct PM ethics filings, NATO, OECD, IMF |
| **Public broadcaster** | CBC News |
| **Mainstream reporting** | Globe and Mail |
| **Analysis / commentary** | The Hub |
| **Policy institutes / watchdogs** | C.D. Howe, Fraser Institute, IRPP / Policy Options, Canadian Climate Institute, IISD, Democracy Watch |
| **Issue-focused reporting** | The Narwhal, National Observer |
| **Academic** | The Conversation Canada, Dalhousie, PROOF (U of T) |
| **Polling / public opinion** | Angus Reid; Approval Signal pollsters tracked outside the grades: Léger, Abacus Data, Ipsos, Angus Reid Institute, Innovative Research Group; Nanos preferred-PM context |

## Want to Review or Contribute?

We welcome feedback. You can:

1. **Review the dashboard** at [sawatter.github.io/canada-under-carney](https://sawatter.github.io/canada-under-carney/)
2. **Read the scoring rubric** in the Rubric tab or [docs/Scoring-Rubric-v1.1.md](docs/Scoring-Rubric-v1.1.md)
3. **Read the commitment traceability layer** in [docs/Commitment-Traceability-Map.md](docs/Commitment-Traceability-Map.md)
4. **Submit feedback** via [GitHub Issues](https://github.com/Sawatter/canada-under-carney/issues)
5. **Run it through your own AI** — paste the dashboard URL into ChatGPT, Claude, or Gemini and ask it to critique the methodology, challenge the grades, or identify missing perspectives

## Monthly Updates

See [docs/Monthly-Cycle-Playbook.md](docs/Monthly-Cycle-Playbook.md) for the full cycle checklist and [docs/MONTHLY-UPDATE-GUIDE.md](docs/MONTHLY-UPDATE-GUIDE.md) for the shorter step-by-step update guide.

```bash
python3 scripts/fetch-data.py     # Check source endpoints and create review drafts
# Review and edit scripts/output/draft-dimensions.json
cp scripts/output/draft-dimensions.json src/data/dimensions.json
npm run dev                        # Preview locally
git add . && git commit && git push  # Deploy (auto-builds)
```

## Data Sources

Metrics are drawn from official statistics (Statistics Canada, PBO, CMHC, Bank of Canada, IRCC), independent policy analysis, and documented journalism from multiple institution types and perspectives. See [docs/DATA-SOURCES.md](docs/DATA-SOURCES.md) for the live source stack and monitoring watchlist.

## Built With

- React + Vite, deployed on GitHub Pages
- Built with AI assistance (Claude Code + ChatGPT). Methodology stress-tested through simulated adversarial review.
- Fact-checked against primary source claims with documented source manifest.
- All editorial judgments made by the human editor. AI tools assisted with research, drafting, and QA — they did not make grading decisions.
- Scoring Rubric v1.1 — [docs/Scoring-Rubric-v1.1.md](docs/Scoring-Rubric-v1.1.md)

## License

Dashboard code is open source. All data from Canadian government open data sources under the [Open Government Licence - Canada](https://open.canada.ca/en/open-government-licence-canada).

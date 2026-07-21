# Canada Under Carney - Performance Dashboard

**Live dashboard: [sawatter.github.io/canada-under-carney](https://sawatter.github.io/canada-under-carney/)**

Non-partisan performance dashboard tracking the Carney government across 11 graded policy dimensions plus an ungraded Promise Tracker, updated monthly using official statistics, independent policy analysis, and documented journalism from multiple institution types and perspectives.

## Current Grades (July 2026)

Monthly evidence current to June 30, 2026. Rule corrections were checked on July 21, 2026. Coverage runs from March 14, 2025 (Carney sworn in). Next scheduled update: August 1, 2026.

| Grade Type | Grade | Score |
|---|---|---|
| **Household Impact** | **C-** | 1.8 |
| **Full Policy Audit** | **C** | 1.9 |
| **Promises Delivered** | **14/43** | 33% |

**Why two grades?**

Every policy area on this dashboard gets its own letter grade across 11 areas: defence, immigration, climate, housing, the cost of living, ethics, major projects, and more. The two headline grades are different ways of summarizing the 11, because one average can hide important differences.

- **Full Policy Audit** is how the Carney government is performing overall, across all 11 policy areas weighted equally. Defence counts the same as housing; ethics counts the same as cost of living.
- **Household Impact** is the same kind of grade, but focused on the four areas that hit daily life hardest:
  - **Housing** - can you afford a place to live
  - **Cost of living** - are groceries and everyday bills under control
  - **The economy** - are jobs, wages, and productivity going the right way
  - **Government spending** - is the fiscal picture under control

These four areas count twice as much in Household Impact. The other seven still count, just not as heavily. Both grades use the same 11 areas, the same sources, the same rubric, and the same QA rules. Only the weighting changes.

**Promises Delivered** is a running tracker of specific commitments (delivered, in progress, too early, stalled, abandoned). It's separate and doesn't feed either grade.

**If the two grades don't match, that's the point.** A government can do well on defence or climate and still be failing on the cost of your life, or the other way around. Showing both means you can see that.

**Grades by policy area** (from the live data, July 2026):

| Policy area | Grade | Trend |
|---|---|---|
| Defence & Trade | A- | Stable |
| Major Projects | C | Stable |
| Fiscal Health | C | Improving |
| Economic Policy Response | C | Declining |
| Affordability Response | D- | Declining |
| Carbon Pricing Policy | C | Stable |
| Climate & Environment | D | Declining |
| Immigration | C+ | Improving |
| Housing Supply | D | Stable |
| Ethics & Transparency | C | Stable |
| Flagship Delivery | C | Declining |
| Promise Delivery (informational tracker, not in either headline grade) | C+ | Stable |

## Features

- **Scorecard** - 11 graded policy dimensions (A through F) plus the ungraded Promise Delivery tracker. Each card opens a drawer with the grade rationale, evidence, scoring thresholds, an authored one-line verdict, and a verbatim next-check line naming what gets checked next cycle
- **App shell** - bottom tab navigation on phones, a workspace sidebar on desktop widths (1024px and up)
- **Grade-move evidence** - each trigger that can move a grade carries a set-date provenance badge (the date the condition was published) and a one-click path to its evidence: an external source, an in-app anchor, or an honestly labeled event-driven placeholder
- **Promise Tracker** - 43 government commitments tracked by status with expandable evidence
- **Commitment Traceability Map** - published join layer linking commitments to home dimensions, constructs, indicators, source roles, and derivative handling
- **Change Log** - monthly history of grade and product changes, opening on the newest twelve entries with expanders for the rest. A since-your-last-visit note points at what changed since you were last here, and says so quietly when nothing did (client-side only, one localStorage key)
- **Rubric** - the scoring rubric embedded in the dashboard
- **About** - what the dashboard scores, what it does not score, source balance, principles, and evaluation methodology
- **Follow options** - add the next update to your calendar (.ics), subscribe by RSS, or sign up for email updates
- **Theme** - light, dark, or follow-system
- **Mobile** - responsive design for phones and tablets

## Source Balance

This is a source-type rollup, not a formal left/right scorecard. As of 2026-07-19 the register counts 42 source families across the graded dimensions (17 official / administrative / institutional, 25 non-official) plus 5 polling families tracked for the Approval Signal outside the grades. The canonical per-source-family record (institution type, ownership / funding, editorial independence, best-use boundary, trust flags) is the [Source Characterization Register](docs/Source-Characterization-Register.md); its category summary is the count of record, and the rollup below is derived from it.

| Institution type | Families |
|---|---|
| Official / administrative / institutional (statistical, departmental, parliamentary, regulatory, international) | 17 |
| Policy institutes and commentary platforms | 7 |
| News media (public broadcaster, mainstream newspaper, issue-focused nonprofit journalism) | 4 |
| Industry (trade associations, code governance, bank economics) | 4 |
| Academic research | 3 |
| Independent nonprofit economic research | 2 |
| Charitable sector | 2 |
| Watchdog / advocacy | 2 |
| Polling within the graded dimensions | 1 |
| Approval Signal pollsters (tracked outside the grades) | 5 |

## Want to Review or Contribute?

We welcome feedback. You can:

1. **Review the dashboard** at [sawatter.github.io/canada-under-carney](https://sawatter.github.io/canada-under-carney/)
2. **Read the scoring rubric** in the Rubric tab or [docs/Scoring-Rubric-v1.1.md](docs/Scoring-Rubric-v1.1.md)
3. **Read the commitment traceability layer** in [docs/Commitment-Traceability-Map.md](docs/Commitment-Traceability-Map.md)
4. **Submit feedback** via [GitHub Issues](https://github.com/Sawatter/canada-under-carney/issues)
5. **Run it through your own AI** - paste the dashboard URL into ChatGPT, Claude, or Gemini and ask it to critique the methodology, challenge the grades, or identify missing perspectives

## Monthly Updates

See [docs/Monthly-Cycle-Playbook.md](docs/Monthly-Cycle-Playbook.md) for the canonical cycle checklist and [docs/MONTHLY-UPDATE-GUIDE.md](docs/MONTHLY-UPDATE-GUIDE.md) for helper notes. The monthly cycle starts with the source-ledger gate, not with copying draft data into the live files.

```bash
npm run source:ledger -- YYYY-MM --force
npm run source:ledger:check -- docs/Source-Coverage-Ledger-YYYY-MM.md
# After exact-URL recertification, publisher sweeps, and editor review:
npm run source:ledger:check -- docs/Source-Coverage-Ledger-YYYY-MM.md --require-closed
```

`python3 scripts/fetch-data.py` is still useful as a scout for source endpoints, but its draft files are not a shortcut around the playbook.

## Data Sources

Metrics are drawn from official statistics (Statistics Canada, PBO, CMHC, Bank of Canada, IRCC), independent policy analysis, and documented journalism from multiple institution types and perspectives. See [docs/DATA-SOURCES.md](docs/DATA-SOURCES.md) for the live source stack and monitoring watchlist.

## Built With

- React + Vite, deployed on GitHub Pages
- Built with AI assistance (Claude Code + ChatGPT). Methodology stress-tested through simulated adversarial review.
- Claims checked against primary sources, with a documented source register.
- All editorial judgments made by the human editor. AI tools assisted with research, drafting, and QA. They did not make grading decisions.
- Scoring Rubric v1.1 - [docs/Scoring-Rubric-v1.1.md](docs/Scoring-Rubric-v1.1.md)

## License

Dashboard code is open source. All data from Canadian government open data sources under the [Open Government Licence - Canada](https://open.canada.ca/en/open-government-licence-canada).

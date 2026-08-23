# Source Architecture Rules

## Source band ceiling
- Aim for 5 to 8 sources per graded dimension
- Hard ceiling: 10 sources
- Any dimension at 10 requires trim-before-add, do not add without editor approval
- Any dimension below 4 is under-evidenced, flag for source expansion

Current ceiling status as of v5.67:
Economic Policy Response: 10 (at ceiling)
Affordability Response: 10 (at ceiling)
Climate Environment: 10 (at ceiling)
Housing Supply: 10 (at ceiling)

---

## Source family definitions

Family 1, PMO / government messaging
Press releases, announcements, mandate letters, platform documents.
Can establish policy existence but cannot be the sole grade-moving source.

Family 2, Government operational / administrative data
StatCan, CMHC, DND procurement data, IRCC datasets, Bank of Canada.
Measurement truth. High credibility for what happened, not what it means.

Family 3, Government department
Departmental plans, ministerial statements, Budget documents, ECCC reports.
Policy truth. Subject to credit-claiming penalty rules.

Family 4, Independent official / watchdog
PBO, OAG, Ethics Commissioner, CER (Canada's Energy Future projections).
Highest credibility for independent challenge. Grade-moving weight.

Family 5, Procedural parliamentary records
LEGISinfo bill tracking, Order Paper, Hansard procedural records.
Not independent challenge. Confirms existence of legislation, not quality.

Family 6, Parliamentary critique
Committee reports (ourcommons.ca, sencanada.ca), opposition statements.
Independent challenge. Distinguishable from procedural records.

Family 7, Policy institute / think tank
PBO (also family 4), CD Howe, IRPP, CCI, Fraser Institute, MLI, Pembina,
Conference Board of Canada, Smart Prosperity Institute, IISD.
Independent challenge when they have prior substantive published view.

Family 8, Journalism
CBC, Globe and Mail, National Post, The Narwhal, National Observer.
Context truth. Can corroborate but should not be sole grade-moving source.

Family 9, Academic / research / pollsters
University research, CSLS Canadian Productivity Review,
Scotiabank Economics, National Bank Economics, Angus Reid, Leger, Abacus.
Independent analysis. Financial-institution research sits here pending
potential family 12 split in June 2026.

Family 10, International benchmark / rating
NATO, IMF, OECD, Transparency International Canada, rating agencies.
External standard-setting. NATO is threshold-defining for Defence Trade
(exception: does not count as independent challenge for that dimension).

Family 11, Industry / sector association
CHBA, Retail Council of Canada, CFIB.
Useful challenge or context evidence. NOT independent challenge by default
because sector sources have direct stakeholder interests.

TODO June 2026: evaluate family 12 for financial-institution research
(Scotiabank Economics, National Bank Economics, Conference Board market-side).
Codex review flagged these as potentially distinct from pure policy institutes.

---

## Threading rules

### Rule 1: Exact URLs only in chains
sourceRefs[] and additionalSources[] entries must use exact publication URLs.
Category pages and homepages belong in sources[] pool only, never in chains.

### Rule 2: One source, one role
Each threading entry must have a one-line role description.
The role names what specific claim this source supports or challenges.

### Rule 3: Discipline B applies before every addition
Thread existing challenge sources before adding new ones.
Check for unthreaded pool sources in the same family first.

### Rule 4: Grade-moving evidence requires threading
A source in sources[] only does not count as grade-moving evidence in the
audit script. It is visible to readers but invisible to family-distribution
analysis. Threading is what makes a source count toward the audit.

### Rule 5: additionalSources shape
Every additionalSources entry must have exactly:
{ label: string, url: string, role: string }
The validator (scripts/validate-dimensions.mjs) checks this shape.

### Rule 6: sourceRefs shape
Every sourceRefs entry must have at minimum:
{ label: string, url: string }
The validator checks this shape.

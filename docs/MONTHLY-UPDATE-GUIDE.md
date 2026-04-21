# Monthly Update Guide

**Target time: 30 minutes**

This guide walks you through the monthly dashboard update process.

---

## Prerequisites (one-time setup)

1. Python 3.9+ installed (`python3 --version`)
2. Node.js 18+ installed (`node --version`)
3. Git installed
4. Repository cloned locally
5. Run once: `pip3 install -r scripts/requirements.txt`
6. Run once: `npm install`

---

## Step 1: Run the data fetch script (2 minutes)

```bash
cd canada-under-carney
python3 scripts/fetch-data.py
```

This checks government data endpoints and produces three files in `scripts/output/`:
- `fetch-report.txt` — human-readable summary of what's available
- `draft-dimensions.json` — copy of current data (you'll edit this)
- `draft-changelog-entry.json` — template for the changelog

---

## Step 2: Review the fetch report (5 minutes)

Open `scripts/output/fetch-report.txt`. It tells you:
- Which StatCan tables were reachable
- Which IRCC datasets downloaded successfully
- Which metrics need manual checking
- Source URLs to visit for each data point

---

## Step 3: Update the data (15 minutes)

Open `scripts/output/draft-dimensions.json` in any text editor.

**For auto-checked metrics:** Visit the source URLs listed in the fetch report. If the number changed, update the `"value"` field in the JSON.

**For manual metrics:** Check these sources:
- **Fitch/Moody's/S&P ratings:** Check agency websites (changes are rare)
- **PBO reports:** Check [pbo-dpb.ca](https://www.pbo-dpb.ca/en/publications/)
- **Approval Signal polling:** Check Léger, Abacus Data, Ipsos, Angus Reid Institute, and Innovative Research Group for direct approve/disapprove releases; check Nanos only for preferred-PM context.
- **Ethics/Transparency:** Check news for Ethics Commissioner updates
- **Climate policy status:** Check ECCC announcements

**For grades, trends, and statuses (ALWAYS manual):**
- Review each dimension against the [Scoring Rubric](Scoring-Rubric-v1.1.md)
- If a grade changes, document: what new evidence triggered it, which rubric criterion applies
- Update trend arrows (up/stable/down) based on direction of travel
- Update status summaries if the narrative changed

---

## Step 4: Copy to live data (3 minutes)

```bash
# Copy your reviewed draft to the live data
cp scripts/output/draft-dimensions.json src/data/dimensions.json
```

Then edit these files:

**`src/data/meta.json`** — Update dates:
```json
{
  "lastUpdated": "2026-05-14",
  "nextUpdate": "2026-06-14"
}
```

**`src/data/changelog.json`** — Add a new entry at the TOP of the array:
```json
{
  "date": "2026-05-14",
  "summary": "May 2026 update: [what changed in one sentence]",
  "items": [
    {
      "type": "event",
      "headline": "Food inflation updated",
      "body": "Food CPI moved from 5.4% to 5.1% in the April 2026 Statistics Canada release.",
      "affects": ["Affordability Response"]
    }
  ]
}
```

For grade changes, use this format:
```json
{
  "type": "grade",
  "dimensionId": "fiscal-health",
  "dimensionName": "Fiscal Health",
  "from": "D",
  "to": "D-",
  "deltaLabel": "−1 notch",
  "headline": "Fiscal Health moved D → D-",
  "body": "PBO's spring report projects a wider deficit path than previously expected.",
  "drivers": ["PBO spring report", "Deficit path widened"]
}
```

**`src/data/history.json`** — Add a new snapshot at the TOP:
```json
{
  "month": "2026-05",
  "date": "2026-05-14",
  "overallGPA": 1.75,
  "pocketbookGPA": 1.54,
  "grades": { ... copy current grades ... },
  "promiseCounts": { ... count current promises by status ... }
}
```

---

## Step 5: Preview locally (2 minutes)

```bash
npm run dev
```

Open http://localhost:5173/canada-under-carney/ and verify:
- "Change Log" shows the right items
- Grades and metrics look correct
- Promise Tracker counts are right
- No broken layouts

---

## Step 6: Deploy (3 minutes)

```bash
git add src/data/
git commit -m "May 2026 monthly update"
git push
```

GitHub Actions will build and deploy automatically. The live site updates within 2-3 minutes.

---

## Checklist

- [ ] Ran fetch script
- [ ] Reviewed fetch report
- [ ] Updated metric values in draft
- [ ] Checked manual metrics (ratings, polls, PBO)
- [ ] Made grade decisions (if any)
- [ ] Updated trend arrows (if any)
- [ ] Copied draft to src/data/dimensions.json
- [ ] Updated meta.json dates
- [ ] Added changelog entry
- [ ] Added history snapshot
- [ ] Previewed locally
- [ ] Committed and pushed

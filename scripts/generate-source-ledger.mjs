#!/usr/bin/env node
// Generates an expanded monthly source-coverage ledger skeleton.
// The persistent checklist groups some source families for readability; this
// script expands those bundles so the monthly ledger has one auditable row per
// source, watch, promise, project, or URL.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { extractCitationEntries } from "./source-ledger-utils.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const args = process.argv.slice(2);
const force = args.includes("--force");
const monthArg = args.find((arg) => /^\d{4}-(?:0[1-9]|1[0-2])$/.test(arg));

if (!monthArg) {
  console.error("Usage: node scripts/generate-source-ledger.mjs YYYY-MM [--force]");
  process.exit(1);
}

const dimensions = JSON.parse(
  readFileSync(resolve(repoRoot, "src/data/dimensions.json"), "utf8")
);

const approvalPolls = JSON.parse(
  readFileSync(resolve(repoRoot, "src/data/approval-polls.json"), "utf8")
);

const meta = JSON.parse(
  readFileSync(resolve(repoRoot, "src/data/meta.json"), "utf8")
);

const citationEntries = extractCitationEntries(repoRoot);

// Publisher-grouping rules. Each rule is [regex, sort key]. Rows are
// sorted within each section by sort key so all StatCan rows cluster
// together, then all IRCC, then all PBO, and so on. Rows that don't
// match any rule fall to "99-other" and sort alphabetically at the end.
const PUBLISHER_RULES = [
  [/python3 scripts\/fetch-data|fetch-data\.py/i, "00-fetch-script"],
  [/statcan\.gc\.ca|Statistics Canada/i, "01-statcan"],
  [/ircc\.canada\.ca|\bIRCC\b/i, "02-ircc"],
  [/open\.canada\.ca/i, "02-ircc"],
  [/bankofcanada\.ca|Bank of Canada/i, "03-boc"],
  [/pbo-dpb\.ca|\bPBO\b/i, "04-pbo"],
  [/budget\.canada\.ca|Finance Canada/i, "05-finance"],
  [/cmhc-schl\.gc\.ca|\bCMHC\b/i, "06-cmhc"],
  [/abacusdata\.ca|Abacus Data/i, "10-poll-abacus"],
  [/leger360\.com|Léger/i, "10-poll-leger"],
  [/angusreid\.org|Angus Reid/i, "10-poll-angus"],
  [/ipsos\.com|\bIpsos\b/i, "10-poll-ipsos"],
  [/innovativeresearch\.ca|Innovative Research/i, "10-poll-irg"],
  [/nanos\.co|Nanos/i, "10-poll-nanos"],
  [/pollara\.com|Pollara/i, "10-poll-pollara"],
  [/mainstreetresearch\.ca|Mainstreet/i, "10-poll-mainstreet"],
  [/ekospolitics\.com|Ekos/i, "10-poll-ekos"],
  [/sparkinsights|Spark Insights/i, "10-poll-spark"],
  [/researchco|Research Co\./i, "10-poll-researchco"],
  [/ethicscanada\.ca|ciec-ccie\.parl\.gc\.ca|Ethics Commissioner/i, "20-ethics-commissioner"],
  [/prciec-rpccie\.parl\.gc\.ca|blind[- ]trust|Annex A|PM ethics/i, "21-pm-ethics"],
  [/ourcommons\.ca|House ETHI/i, "22-house-ethi"],
  [/democracywatch\.ca|Democracy Watch/i, "23-democracy-watch"],
  [/pm\.gc\.ca|\bPMO\b/i, "30-pmo"],
  [/major-projects-office|Major Projects Office/i, "31-mpo"],
  [/parl\.ca|LEGISinfo/i, "32-parliament"],
  [/laws-lois\.justice\.gc\.ca/i, "33-justice"],
  [/international\.canada\.ca|Global Affairs/i, "34-gac"],
  [/department-national-defence|\bNATO\b|nato\.int/i, "35-defence-nato"],
  [/environment-climate-change|\bECCC\b/i, "36-eccc"],
  [/nrcan|Natural Resources/i, "37-nrcan"],
  [/ised-isde\.canada\.ca|Innovation, Science/i, "38-ised"],
  [/tc\.canada\.ca|Transport Canada/i, "39-tc"],
  [/treaties\.un\.org/i, "40-un-treaties"],
  [/fitchratings\.com|Fitch/i, "41-fitch"],
  [/moodys\.com/i, "41-moodys"],
  [/spglobal\.com\/ratings|S&P/i, "41-sp"],
  [/imf\.org|\bIMF\b/i, "42-imf"],
  [/oecd\.org|\bOECD\b/i, "43-oecd"],
  [/climateinstitute\.ca|Canadian Climate Institute|\bCCI\b/i, "50-cci"],
  [/iisd\.org|\bIISD\b/i, "51-iisd"],
  [/policyoptions\.irpp\.org|IRPP|Policy Options/i, "52-irpp"],
  [/cdhowe\.org|C\.D\. Howe/i, "53-cdhowe"],
  [/fraserinstitute\.org|Fraser Institute/i, "54-fraser"],
  [/thehub\.ca|The Hub/i, "55-hub"],
  [/cbc\.ca|\bCBC\b/i, "60-cbc"],
  [/theglobeandmail\.com|Globe and Mail/i, "60-globe"],
  [/thenarwhal\.ca|Narwhal/i, "61-narwhal"],
  [/nationalobserver\.com|National Observer/i, "61-observer"],
  [/theconversation\.com|Conversation Canada/i, "70-conversation"],
  [/proof\.utoronto\.ca|\bPROOF\b/i, "71-proof"],
  [/dal\.ca|Dalhousie/i, "72-dalhousie"],
  [/canadacode\.org|Grocery Code/i, "73-grocery-code"],
  [/en\.wikipedia\.org/i, "90-wikipedia"],
];

function publisherKey(label, url) {
  const text = `${label || ""} ${url || ""}`;
  for (const [pattern, key] of PUBLISHER_RULES) {
    if (pattern.test(text)) return key;
  }
  return `99-other-${(label || "").toLowerCase()}`;
}

// Detects whether a row represents an automated check covered by
// scripts/fetch-data.py. Used for the automated-vs-manual split in
// the header.
//
// Detection logic:
//   - Label-based for the explicit monthly rows the script knows about
//     (Fetch script, StatCan tables, IRCC CSVs, Bank of Canada Valet).
//   - Exact-URL match for the PBO landing page and RSS feed. The 16
//     specific cited PBO publication URLs have longer paths and stay
//     manual — the editor still needs to verify each cited value.
function isAutomated(label, url) {
  const labelText = (label || "").toLowerCase();
  const urlText = (url || "").trim().toLowerCase().replace(/\/$/, "");
  if (labelText.includes("fetch script") || urlText.includes("fetch-data.py")) return true;
  if (labelText.includes("ircc") && urlText.includes("ircc")) return true;
  if (labelText.includes("ircc") && (labelText.includes("pr admissions") ||
      labelText.includes("imp") || labelText.includes("tfwp") || labelText.includes("study permits"))) {
    return true;
  }
  if (labelText.includes("bank of canada") || labelText.includes("fxcadusd") ||
      urlText.includes("bankofcanada.ca/valet")) {
    return true;
  }
  if (labelText.startsWith("statcan ") || labelText.includes("statistics canada cpi") ||
      labelText.includes("statistics canada lfs")) {
    return true;
  }
  if (labelText.includes("ethics commissioner reports") ||
      urlText === "https://www.ethicscanada.ca/en/report?type=inv") {
    return true;
  }
  // PBO publications landing page + RSS feed are surfaced monthly by
  // fetch-data.py. Cited publication URLs are deeper paths and stay
  // manual.
  if (urlText === "https://www.pbo-dpb.ca/en/publications" ||
      urlText === "https://www.pbo-dpb.ca/en/feed.xml") {
    return true;
  }
  // MPO national-projects landing page is scraped monthly by
  // fetch-data.py and diffed against projectCohort.projects.
  if (urlText === "https://www.canada.ca/en/privy-council/major-projects-office/projects/national.html") {
    return true;
  }
  // LEGISinfo bill pages are automatically queried each cycle for any
  // cited parl.ca bill URL. The Bill-status movement event-driven row
  // counts as automated.
  if (/^https:\/\/www\.parl\.ca\/legisinfo/i.test(urlText)) {
    return true;
  }
  // Approval pollster homepages — fetch-data.py reads each firm's RSS
  // feed and flags new posts. The monthly approval-pollster rows count
  // as automated. The individual cited poll URLs (e.g. specific Abacus
  // post URLs) stay in the manual column because the editor still
  // evaluates each release before adding it to the aggregate.
  if (
    urlText === "https://abacusdata.ca" ||
    urlText === "https://leger360.com" ||
    urlText === "https://angusreid.org" ||
    urlText === "https://www.ipsos.com/en-ca" ||
    urlText === "https://innovativeresearch.ca" ||
    urlText === "https://nanos.co"
  ) {
    return true;
  }
  return false;
}

// Canonical homepage per pollster. Used when building monthly / quarterly
// approval rows from approval-polls.json. New pollsters added to the data
// file will appear as rows even without a URL entry here; the editor can
// fill the URL in the ledger.
const POLLSTER_HOMES = {
  "Abacus Data": "https://abacusdata.ca/",
  "Léger": "https://leger360.com/",
  "Angus Reid Institute": "https://angusreid.org/",
  "Ipsos": "https://www.ipsos.com/en-ca/",
  "Innovative Research Group": "https://innovativeresearch.ca/",
  "Nanos Research": "https://nanos.co/",
  "Pollara": "https://www.pollara.com/",
  "Mainstreet Research": "https://www.mainstreetresearch.ca/",
  "Ekos Research Associates": "https://www.ekospolitics.com/",
  "Spark Insights": "",
  "Research Co.": "https://researchco.ca/",
};

// excludedForNow uses short keys in approval-polls.json. Map them to the
// display names used elsewhere in the ledger.
const EXCLUDED_DISPLAY_NAMES = {
  nanos: "Nanos Research",
  sparkInsights: "Spark Insights",
  pollara: "Pollara",
  mainstreet: "Mainstreet Research",
  ekos: "Ekos Research Associates",
  researchCo: "Research Co.",
};

function includedPollsters() {
  const set = new Set();
  for (const poll of approvalPolls.polls || []) {
    if (poll.pollster) set.add(poll.pollster);
  }
  return [...set].sort();
}

function preferredPMPollsters() {
  const set = new Set();
  for (const poll of approvalPolls.preferredPM?.polls || []) {
    if (poll.pollster) set.add(poll.pollster);
  }
  return [...set].sort();
}

function quarterlyRevisitPollsters() {
  // nanos is tracked separately as preferredPM (different construct, not
  // a revisit candidate). Every other excludedForNow key is a quarterly
  // revisit row.
  const obj = approvalPolls.excludedForNow || {};
  return Object.keys(obj)
    .filter((key) => key !== "nanos")
    .map((key) => EXCLUDED_DISPLAY_NAMES[key] || key)
    .sort();
}

function pollsterHomeUrl(name) {
  return POLLSTER_HOMES[name] || "";
}

const [year, month] = monthArg.split("-").map(Number);
const monthDate = new Date(Date.UTC(year, month - 1, 1));
const monthName = monthDate.toLocaleString("en-CA", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const evidenceWindowStart = new Date(Date.UTC(year, month - 2, 1));
const evidenceWindowEnd = new Date(Date.UTC(year, month - 1, 0));
const evidenceWindow = `${evidenceWindowStart.toISOString().slice(0, 10)} through ${evidenceWindowEnd.toISOString().slice(0, 10)}`;
const outPath = resolve(repoRoot, `docs/Source-Coverage-Ledger-${monthArg}.md`);

if (existsSync(outPath) && !force) {
  console.error(`${outPath} already exists. Re-run with --force to overwrite.`);
  process.exit(1);
}

function clean(value) {
  return String(value ?? "")
    .replace(/\r?\n/g, " ")
    .replace(/\|/g, "\\|")
    .trim();
}

function row(cells) {
  return `| ${cells.map(clean).join(" | ")} |`;
}

function table(rows) {
  return [
    row(["Source / item", "Dashboard area", "URL / home", "Cadence", "Date checked", "Result", "Action", "Notes"]),
    row(["---", "---", "---", "---", "---", "---", "---", "---"]),
    ...rows.map(row),
  ].join("\n");
}

function titleFromPromise(promise) {
  return promise.title || promise.promise || promise.text || promise.name || "Untitled promise";
}

function flattenPromises() {
  return dimensions.flatMap((dim) =>
    (dim.promises || []).map((promise) => ({
      dimension: dim.name,
      title: titleFromPromise(promise),
      status: promise.status || "Unknown",
      statusSourceUrl: promise.statusSourceUrl || "",
      originalSourceUrl: promise.originalSourceUrl || "",
    }))
  );
}

function uniqueBy(rows, keyFn) {
  const seen = new Set();
  return rows.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function sourceRows() {
  const rows = [];
  for (const dim of dimensions) {
    for (const source of dim.sources || []) {
      rows.push({
        label: `${dim.name}: ${source.label}`,
        area: dim.name,
        url: source.url,
      });
    }
  }
  return uniqueBy(rows, (row) => `${row.area}|${row.url}|${row.label}`).sort((a, b) =>
    a.area.localeCompare(b.area) || a.label.localeCompare(b.label)
  );
}

function triggerSourceRows() {
  const rows = [];
  for (const dim of dimensions) {
    for (const side of ["up", "down"]) {
      for (const trigger of dim.gradeTriggers?.[side] || []) {
        if (!trigger.sourceUrl) continue;
        rows.push({
          label: `${dim.name}: ${side} trigger - ${trigger.sourceLabel || trigger.text}`,
          area: dim.name,
          url: trigger.sourceUrl,
        });
      }
    }
  }
  return uniqueBy(rows, (row) => `${row.area}|${row.url}|${row.label}`).sort((a, b) =>
    a.area.localeCompare(b.area) || a.label.localeCompare(b.label)
  );
}

function supplementalCitationRows() {
  const fields = new Set([
    "metrics[].sourceRefs[].url",
    "gradeTriggers.up[].additionalSources[].url",
    "gradeTriggers.down[].additionalSources[].url",
    "promises[].originalSourceUrl",
    "approval.polls[].sourceUrl",
    "approval.preferredPM.polls[].sourceUrl",
  ]);

  return uniqueBy(
    citationEntries
      .filter((entry) => fields.has(entry.field))
      .map((entry) => ({
        label: entry.label,
        area: entry.area,
        url: entry.url,
        field: entry.field,
      })),
    (row) => `${row.area}|${row.field}|${row.url}|${row.label}`
  ).sort((a, b) => a.area.localeCompare(b.area) || a.label.localeCompare(b.label));
}

function trackedBillRows() {
  const candidates = [];
  const add = (label, area, url) => {
    if (url && /parl\.ca/i.test(url)) candidates.push({ label, area, url });
  };

  for (const dim of dimensions) {
    for (const source of dim.sources || []) add(`${dim.name}: ${source.label}`, dim.name, source.url);
    for (const side of ["up", "down"]) {
      for (const trigger of dim.gradeTriggers?.[side] || []) {
        add(`${dim.name}: ${side} trigger - ${trigger.sourceLabel || trigger.text}`, dim.name, trigger.sourceUrl);
      }
    }
    for (const promise of dim.promises || []) {
      add(`${dim.name}: ${titleFromPromise(promise)}`, dim.name, promise.statusSourceUrl || promise.originalSourceUrl);
    }
  }

  return uniqueBy(candidates, (row) => row.url.toLowerCase()).sort((a, b) => a.label.localeCompare(b.label));
}

function majorProjectRows() {
  const projectDim = dimensions.find((dim) => dim.id === "major-projects");
  return (projectDim?.projectCohort?.projects || []).map((project) => ({
    label: project.name,
    area: "Major Projects",
    url: project.sourceUrl || "",
    notes: `${project.stage || "stage unknown"}; tranche ${project.tranche ?? "?"}; stage date ${project.stageDate || "unknown"}`,
  }));
}

const promises = flattenPromises();
const stalledOrAbandoned = promises
  .filter((promise) => ["Stalled", "Abandoned"].includes(promise.status))
  .sort((a, b) => a.status.localeCompare(b.status) || a.dimension.localeCompare(b.dimension) || a.title.localeCompare(b.title));

const monthlyRows = [
  ["Fetch script", "StatCan, IRCC, Bank of Canada", "`python3 scripts/fetch-data.py`", "Monthly", "", "", "", "Run before drafting the monthly changelog."],
  ["StatCan food CPI", "Affordability Response", "Statistics Canada CPI release / table", "Monthly", "", "", "", "Compare latest food-store CPI to dashboard metric; fetch script flags newer WDS cubeEndDate."],
  ["StatCan Labour Force Survey", "Economic Policy Response", "Statistics Canada LFS release", "Monthly", "", "", "", "Check employment change and unemployment rate; fetch script flags newer WDS cubeEndDate."],
  ["StatCan population", "Immigration", "Table 17-10-0009-01", "Monthly / quarterly data", "", "", "", "Check temporary-resident share context when new data lands; fetch script flags newer WDS cubeEndDate."],
  ["StatCan housing starts", "Housing Supply", "Table 34-10-0158-01 plus CMHC release", "Monthly", "", "", "", "Check monthly SAAR and six-month trend; fetch script flags newer WDS cubeEndDate."],
  ["StatCan merchandise trade", "Defence & Trade", "Table 12-10-0011-01", "Monthly", "", "", "", "Check U.S. export share and non-U.S. share; fetch script flags newer WDS cubeEndDate."],
  ["IRCC PR admissions", "Immigration", "IRCC open-data CSV", "Monthly", "", "", "", "Check PR admission pace."],
  ["IRCC IMP work permits", "Immigration", "IRCC open-data CSV", "Monthly", "", "", "", "Check temporary-resident pressure."],
  ["IRCC TFWP work permits", "Immigration", "IRCC open-data CSV", "Monthly", "", "", "", "Check temporary-resident pressure."],
  ["IRCC study permits", "Immigration", "IRCC open-data CSV", "Monthly", "", "", "", "Check temporary-resident pressure."],
  ["Bank of Canada FXCADUSD", "Economic / immigration context", "Bank of Canada Valet API", "Monthly", "", "", "", "Context source unless cited metric changes."],
  ...includedPollsters().map((name) => [
    `${name} approval releases`,
    "Approval Signal",
    pollsterHomeUrl(name),
    "Monthly",
    "",
    "",
    "",
    "Look for direct Carney / federal-government approval release. Pollster sourced from approval-polls.json included set.",
  ]),
  ...preferredPMPollsters().map((name) => [
    `${name} preferred-PM tracking`,
    "Approval Signal (preferred-PM context)",
    pollsterHomeUrl(name),
    "Monthly",
    "",
    "",
    "",
    "Check preferred-PM release used as secondary context, not part of the approval mean.",
  ]),
  ["PBO publications", "Fiscal, affordability, promises", "https://www.pbo-dpb.ca/en/publications", "Monthly", "", "", "", "Look for fiscal, costing, or anchor analysis."],
  ["Ethics Commissioner reports", "Ethics & Transparency", "https://www.ethicscanada.ca/en/report?type=inv", "Monthly", "", "", "", "Fetch script diffs report-list additions/removals against monitoring/ethics-reports.json; review any PM-relevant report, examination, or filing."],
  ["Major Projects Office list", "Major Projects", "https://www.canada.ca/en/privy-council/major-projects-office/projects/national.html", "Monthly", "", "", "", "Check denominator, additions, and stage changes."],
  ...stalledOrAbandoned.map((promise) => [
    `${promise.status}: ${promise.title}`,
    promise.dimension,
    promise.statusSourceUrl,
    "Monthly spot-check",
    "",
    "",
    "",
    "Check link and obvious public evidence of status change.",
  ]),
  ["Other sources touched this cycle", "Any touched dimension", "", "Monthly, as needed", "", "", "", "Add one row per source URL touched during this cycle's editorial work. Use one row per opened URL; do not bundle."],
];

const eventRows = [
  ["Fitch Canada sovereign page", "Fiscal Health", "https://www.fitchratings.com/", "Event-driven", "", "", "", "Rating downgrade, outlook change, or rating-committee action."],
  ["Moody's Canada sovereign page", "Fiscal Health", "https://ratings.moodys.com/ratings-news", "Event-driven", "", "", "", "Rating downgrade, outlook change, or rating-committee action."],
  ["S&P Canada sovereign page", "Fiscal Health", "https://www.spglobal.com/ratings/", "Event-driven", "", "", "", "Rating downgrade, outlook change, or rating-committee action."],
  ["ECCC announcements", "Climate & Environment, Carbon Pricing Policy", "https://www.canada.ca/en/environment-climate-change/news.html", "Event-driven", "", "", "", "Plan, budget, climate-strategy, OBPS, or fuel-charge policy change."],
  ["Federal climate plan pages", "Climate & Environment", "https://www.canada.ca/en/services/environment/weather/climatechange/climate-plan.html", "Event-driven", "", "", "", "Replacement climate strategy or plan revision."],
  ["Paris Agreement status", "Climate & Environment", "https://treaties.un.org/", "Event-driven", "", "", "", "Paris withdrawal or formal commitment-status change."],
  ["Carbon border adjustment announcements", "Carbon Pricing Policy", "Canada.ca / Finance / ECCC announcements", "Event-driven", "", "", "", "Carbon-border-adjustment announcement or cancellation."],
  ["OBPS / fuel-charge policy pages", "Carbon Pricing Policy", "Canada.ca carbon-pricing pages", "Event-driven", "", "", "", "Industrial-pricing or consumer-charge policy change."],
  ["NATO releases", "Defence & Trade", "https://www.nato.int/cps/en/natohq/news.htm", "Event-driven", "", "", "", "Defence-spending verification or NATO-commitment change."],
  ["PMO defence announcements", "Defence & Trade", "https://www.pm.gc.ca/en/news", "Event-driven", "", "", "", "Funding path, procurement milestone, or defence-accounting change."],
  ["National Defence releases", "Defence & Trade", "https://www.canada.ca/en/department-national-defence/news.html", "Event-driven", "", "", "", "Funding path, procurement milestone, or defence-accounting change."],
  ["PMO major announcements", "Any affected dimension", "https://www.pm.gc.ca/en/news", "Event-driven", "", "", "", "Program launch, cancellation, project designation, or national-interest designation."],
  ["Finance Canada announcements", "Fiscal, affordability, economic, promises", "https://www.canada.ca/en/department-finance/news.html", "Event-driven", "", "", "", "Fiscal table, tax measure, benefit, or program change."],
  ["Department release pages", "Any affected dimension", "Relevant Canada.ca department page", "Event-driven", "", "", "", "Department-specific launch, cancellation, report, or source update."],
  ...trackedBillRows().map((bill) => [
    bill.label,
    bill.area,
    bill.url,
    "Event-driven",
    "",
    "",
    "",
    "Bill introduced, passed, died, amended, or proclaimed.",
  ]),
];

const quarterlyRows = [
  ...quarterlyRevisitPollsters().map((name) => [
    `${name} approval revisit`,
    "Approval Signal",
    pollsterHomeUrl(name),
    "Quarterly",
    "",
    "",
    "",
    "Look for direct Carney approval release or methodology / inclusion update. Pollster sourced from approval-polls.json excludedForNow set.",
  ]),
  ["Canadian Climate Institute", "Climate & Environment, Carbon Pricing Policy", "https://climateinstitute.ca/", "Quarterly", "", "", "", "New analysis, plan revision, or carbon-pricing evidence."],
  ["IISD", "Climate & Environment, Carbon Pricing Policy", "https://www.iisd.org/", "Quarterly", "", "", "", "New analysis, plan revision, or carbon-pricing evidence."],
  ["ECCC departmental pages", "Climate & Environment, Carbon Pricing Policy", "https://www.canada.ca/en/environment-climate-change.html", "Quarterly", "", "", "", "Plan, budget, or program update."],
  ["Paris Agreement status", "Climate & Environment", "https://treaties.un.org/", "Quarterly", "", "", "", "Formal commitment-status movement."],
  ["Democracy Watch", "Ethics & Transparency", "https://democracywatch.ca/", "Quarterly", "", "", "", "New independent critique, review, or disclosure finding."],
  ["House ETHI", "Ethics & Transparency", "https://www.ourcommons.ca/Committees/en/ETHI", "Quarterly", "", "", "", "New committee report or hearing relevant to disclosure / screening."],
  ["Transparency International Canada", "Ethics & Transparency", "https://transparencycanada.ca/", "Quarterly", "", "", "", "New CPI release or governance analysis relevant to the federal benchmark; not case-specific evidence by itself."],
  ["Major ethics reporting", "Ethics & Transparency", "CBC / Globe / other major reporting", "Quarterly", "", "", "", "New sourced reporting relevant to disclosure / screening."],
  ["C.D. Howe", "Independent challenge / context", "https://www.cdhowe.org/", "Quarterly", "", "", "", "New analysis affecting source balance or cited context."],
  ["Fraser Institute", "Independent challenge / context", "https://www.fraserinstitute.org/", "Quarterly", "", "", "", "New analysis affecting source balance or cited context."],
  ["IRPP / Policy Options", "Independent challenge / context", "https://policyoptions.irpp.org/", "Quarterly", "", "", "", "New analysis affecting source balance or cited context."],
  ["The Hub", "Independent challenge / context", "https://thehub.ca/", "Quarterly", "", "", "", "New analysis affecting source balance or cited context."],
  ["Dalhousie Agri-Food Analytics Lab", "Affordability Response", "https://www.dal.ca/sites/agri-food.html", "Quarterly", "", "", "", "New food-price report or affordability evidence."],
  ["PROOF", "Affordability Response", "https://proof.utoronto.ca/", "Quarterly", "", "", "", "New food-insecurity evidence."],
  ["The Conversation Canada", "Independent challenge / context", "https://theconversation.com/ca", "Quarterly", "", "", "", "New academic commentary relevant to scored files."],
  ["CBC News", "Independent challenge / reporting", "https://www.cbc.ca/news", "Quarterly", "", "", "", "New sourced reporting relevant to scored files."],
  ["Globe and Mail", "Independent challenge / reporting", "https://www.theglobeandmail.com/", "Quarterly", "", "", "", "New sourced reporting relevant to scored files."],
  ["The Narwhal", "Climate / environment reporting", "https://thenarwhal.ca/", "Quarterly", "", "", "", "New climate / environment reporting relevant to scored files."],
  ["National Observer", "Climate / environment reporting", "https://www.nationalobserver.com/", "Quarterly", "", "", "", "New climate / environment reporting relevant to scored files."],
  ...stalledOrAbandoned.map((promise) => [
    `${promise.status}: ${promise.title}`,
    promise.dimension,
    promise.statusSourceUrl,
    "Quarterly recertification",
    "",
    "",
    "",
    "Full status recertification beyond monthly spot-check.",
  ]),
  ...sourceRows().map((source) => [
    source.label,
    source.area,
    source.url,
    "Quarterly link-rot pass",
    "",
    "",
    "",
    "Check that cited source URL still resolves.",
  ]),
];

const twiceYearlyRows = [
  ...supplementalCitationRows().map((source) => [
    source.label,
    source.area,
    source.url,
    "Twice-yearly citation recertification",
    "",
    "",
    "",
    `Citation field: ${source.field}. Confirm exact URL supports the dashboard claim and check the publisher for newer replacement evidence.`,
  ]),
  ...majorProjectRows().map((project) => [
    project.label,
    project.area,
    project.url,
    "Twice-yearly recertification",
    "",
    "",
    "",
    project.notes,
  ]),
  ...promises.map((promise) => [
    `${promise.status}: ${promise.title}`,
    promise.dimension,
    promise.statusSourceUrl,
    "Twice-yearly promise recertification",
    "",
    "",
    "",
    "Confirm status still holds against status source.",
  ]),
  ...sourceRows().map((source) => [
    source.label,
    source.area,
    source.url,
    "Twice-yearly source recertification",
    "",
    "",
    "",
    "Confirm cited value and source role, not only link availability.",
  ]),
  ...triggerSourceRows().map((source) => [
    source.label,
    source.area,
    source.url,
    "Twice-yearly trigger recertification",
    "",
    "",
    "",
    "Confirm trigger source still supports the move condition.",
  ]),
  ["About-page source family inventory", "About / trust surface", "src/components/About.jsx plus live cited domains", "Twice-yearly", "", "", "", "Every family listed is still cited or intentionally listed."],
  ["Source Authority Map", "Governance docs", "docs/Source-Authority-Map.md", "Twice-yearly", "", "", "", "Confirm source roles still match cited use."],
  ["Source Characterization Register", "Governance docs", "docs/Source-Characterization-Register.md", "Twice-yearly", "", "", "", "Confirm tier, ownership, independence, and boundary characterization."],
];

// Group rows by publisher within each section so an editor sees all
// StatCan rows together, then all IRCC, then all PBO, etc. Preserves
// existing within-publisher order via a stable sort fallback.
function sortByPublisher(rows) {
  return rows
    .map((row, idx) => ({ row, idx, key: publisherKey(row[0], row[2]) }))
    .sort((a, b) => a.key.localeCompare(b.key) || a.idx - b.idx)
    .map((item) => item.row);
}

const monthlyRowsSorted = sortByPublisher(monthlyRows);
const eventRowsSorted = sortByPublisher(eventRows);
const quarterlyRowsSorted = sortByPublisher(quarterlyRows);
const twiceYearlyRowsSorted = sortByPublisher(twiceYearlyRows);

// Count automated rows for the header summary. Automation is detected by
// matching against scripts/fetch-data.py endpoint patterns.
const allRows = [
  ...monthlyRowsSorted,
  ...eventRowsSorted,
  ...quarterlyRowsSorted,
  ...twiceYearlyRowsSorted,
];
const automatedCount = allRows.filter((row) => isAutomated(row[0], row[2])).length;
const manualCount = allRows.length - automatedCount;

const output = `# Source Coverage Ledger - ${monthName}

**Purpose:** Working checklist for the ${monthName} source cycle. This file is generated from \`docs/Recurring-Source-Checklist.md\` and live dashboard data so bundled source families become auditable source-level rows.

**Cycle month:** ${monthArg}
**Evidence window:** ${evidenceWindow}
**Generated:** ${new Date().toISOString().slice(0, 10)}
**Repository version:** v${meta.version} (as of ${meta.lastUpdated})
**Total source rows:** ${allRows.length} (Monthly ${monthlyRowsSorted.length}, Event-Driven ${eventRowsSorted.length}, Quarterly ${quarterlyRowsSorted.length}, Twice-Yearly ${twiceYearlyRowsSorted.length})
**Automation split:** ${automatedCount} automated by \`scripts/fetch-data.py\`, ${manualCount} manual
**Coverage level achieved:** fill in after cycle closes

## How To Use

- Fill the ledger as you check sources, not after the fact.
- Use one row per opened source. Do not mark a bundled family as done unless every child row was checked.
- Result values: \`OK\`, \`new release found\`, \`updated dashboard\`, \`link broken\`, \`blocked\`, \`no event observed\`, \`not due\`, or \`not checked\`.
- If a URL breaks, check for an official replacement first, then Internet Archive / Wayback Machine, and record the action.

## Monthly Checks

${table(monthlyRowsSorted)}

## Event-Driven Watch

Fill these when an event appears during the cycle. If you actively checked and found no event, use \`no event observed\`.

${table(eventRowsSorted)}

## Quarterly Checks

Run when due, or sooner if a trigger appears. If not due this month, mark \`not due\` rather than leaving the row ambiguous.

${table(quarterlyRowsSorted)}

## Twice-Yearly Checks

Run after the budget / fiscal update cycle and once mid-year. If not due this month, mark \`not due\` rather than leaving the row ambiguous.

${table(twiceYearlyRowsSorted)}

## Excluded Evidence

Record each source or item considered for inclusion but not used. Leave the table empty when nothing was excluded.

| Evidence / source | Dashboard area | Decision | Rationale |
|---|---|---|---|

## Bias-Resistance Review

- **Audit script run date and dimensions flagged count:**
- **New flags surfaced this cycle:**
- **Fixes made this cycle:**
- **Party-symmetry line for any grade move:**
- **Excluded evidence this cycle:**
- **Open carry-forward items:**

## Cycle Closeout

| Check | Result | Notes |
|---|---|---|
| \`npm run test:data\` |  |  |
| \`npm run build\` |  |  |
| Source changes summarized in changelog |  |  |
| Open gaps copied to next cycle or roadmap |  |  |
`;

writeFileSync(outPath, output, "utf8");
console.log(`Wrote ${outPath}`);
console.log(`Monthly rows: ${monthlyRows.length}`);
console.log(`Event-driven rows: ${eventRows.length}`);
console.log(`Quarterly rows: ${quarterlyRows.length}`);
console.log(`Twice-yearly rows: ${twiceYearlyRows.length}`);

// Source-tier distribution audit.
//
// Classifies every citation in each dimension's sources[] into the T1-T5
// authority tiers defined in docs/QA-Gatekeeping-Rules.md, then reports the
// per-dimension and overall split between higher-authority (T1-T2: official
// data, officers of Parliament, independent analysis) and lower-authority
// (T3-T5: journalism, government press/program pages, commentary).
//
// Tiering involves editorial judgment. The host -> tier mapping below is the
// whole point of the artifact: it is published so a reader can dispute any
// single call. Run with `node scripts/audit-source-tiers.mjs`. Read-only.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dimensions = JSON.parse(
  readFileSync(resolve(__dirname, "../src/data/dimensions.json"), "utf-8")
);

// Host -> tier. T1 official data / officers of Parliament / intergovernmental
// official; T2 independent analysis with disclosed methodology; T3 journalism
// and polling firms; T4 government press / program-framing pages; T5 partisan.
const HOST_TIER = {
  // T1
  "pbo-dpb.ca": "T1", "statcan.gc.ca": "T1", "cmhc-schl.gc.ca": "T1",
  "bankofcanada.ca": "T1", "ciec-ccie.parl.gc.ca": "T1",
  "prciec-rpccie.parl.gc.ca": "T1", "open.canada.ca": "T1",
  // The Conflict of Interest and Ethics Commissioner migrated off
  // parl.gc.ca to ethicscanada.ca during 2026. Same officer of
  // Parliament, same filings, so the tier follows the institution and
  // not the hostname. Without this the Ethics file silently loses its
  // Tier 1 anchors on a domain move.
  "ethicscanada.ca": "T1", "www.ethicscanada.ca": "T1",
  "cer-rec.gc.ca": "T1", "parl.ca": "T1", "ourcommons.ca": "T1",
  "budget.canada.ca": "T1", "imf.org": "T1", "oecd.org": "T1",
  "nato.int": "T1", "international.canada.ca": "T1",
  // T2 (think tanks, academic, research bodies, methodology-based series)
  "fraserinstitute.org": "T2", "policyoptions.irpp.org": "T2",
  "cdhowe.org": "T2", "climateinstitute.ca": "T2", "iisd.org": "T2",
  "macdonaldlaurier.ca": "T2", "csls.ca": "T2", "dal.ca": "T2",
  "proof.utoronto.ca": "T2", "maytree.com": "T2",
  "transparencycanada.ca": "T2", "scotiabank.com": "T2",
  "signal49.ca": "T2", "foodbankscanada.ca": "T2",
  "democracywatch.ca": "T2", "canadacode.org": "T2", "chba.ca": "T2",
  // T3 (journalism, polling firms, interested-stakeholder position content)
  "cbc.ca": "T3", "theglobeandmail.com": "T3", "nationalobserver.com": "T3",
  "theconversation.com": "T3", "thehub.ca": "T3", "thenarwhal.ca": "T3",
  "angusreid.org": "T3", "retailcouncil.org": "T3",
  // T4 (government press / program framing)
  "pm.gc.ca": "T4", "ised-isde.canada.ca": "T4",
  // T5 (partisan)
  "liberal.ca": "T5",
};

// canada.ca is split by path: official documents/data vs press/program pages.
const CANADA_CA_RULES = [
  [/\/news\//, "T4"],
  [/major-projects-office\/projects/, "T1"],
  [/annual-financial-report/, "T1"],
  [/treasury-board-secretariat\/corporate\/reports/, "T1"],
  [/environment-climate-change\/corporate\/transparency/, "T1"],
  [/auditor-general/, "T1"],
  [/immigration-refugees-citizenship\/corporate\/mandate/, "T1"],
  [/intergovernmental-affairs\/services\/internal-trade/, "T4"],
  [/revenue-agency\/services\/child-family-benefits/, "T4"],
  [/environment-climate-change\/services\/climate-change\/pricing/, "T4"],
];

function tierOf(url) {
  let host, path;
  try { const u = new URL(url); host = u.hostname.replace(/^www\d*\./, ""); path = u.pathname; }
  catch { return "unclassified"; }
  if (HOST_TIER[host]) return HOST_TIER[host];
  if (host === "canada.ca") {
    for (const [re, t] of CANADA_CA_RULES) if (re.test(path)) return t;
    return "T4"; // default: a government page is the government's own framing
  }
  return "unclassified";
}

const TIERS = ["T1", "T2", "T3", "T4", "T5", "unclassified"];
const overall = Object.fromEntries(TIERS.map((t) => [t, 0]));
const rows = [];
const unclassified = [];

for (const d of dimensions) {
  const counts = Object.fromEntries(TIERS.map((t) => [t, 0]));
  for (const s of d.sources || []) {
    const t = tierOf(s.url);
    counts[t]++; overall[t]++;
    if (t === "unclassified") unclassified.push(`${d.name}: ${s.label} (${s.url})`);
  }
  const total = (d.sources || []).length;
  const higher = counts.T1 + counts.T2;
  rows.push({ name: d.name, ...counts, total, higherPct: total ? Math.round((higher / total) * 100) : 0 });
}

const oTotal = TIERS.reduce((a, t) => a + overall[t], 0);
const oHigher = overall.T1 + overall.T2;

console.log("## Per-dimension tier distribution\n");
console.log("| Dimension | T1 | T2 | T3 | T4 | T5 | Total | T1-T2 share |");
console.log("|---|---|---|---|---|---|---|---|");
for (const r of rows)
  console.log(`| ${r.name} | ${r.T1} | ${r.T2} | ${r.T3} | ${r.T4} | ${r.T5} | ${r.total} | ${r.higherPct}% |`);
console.log(`| **All dimensions** | **${overall.T1}** | **${overall.T2}** | **${overall.T3}** | **${overall.T4}** | **${overall.T5}** | **${oTotal}** | **${Math.round((oHigher / oTotal) * 100)}%** |`);

console.log(`\nOverall: ${oTotal} citations. T1-T2 (official + independent analysis) = ${oHigher} (${Math.round((oHigher / oTotal) * 100)}%). T3-T5 = ${oTotal - oHigher} (${Math.round(((oTotal - oHigher) / oTotal) * 100)}%).`);
console.log(`Unclassified: ${overall.unclassified}`);
if (unclassified.length) { console.log("\nUnclassified citations:"); unclassified.forEach((u) => console.log("  - " + u)); }

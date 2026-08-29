#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  RESULT_VALUES,
  extractCitationEntries,
  parseLedgerRows,
  uniqueUrls,
} from "./source-ledger-utils.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const args = process.argv.slice(2);
const requireClosed = args.includes("--require-closed");
const explicitPath = args.find((arg) => arg.endsWith(".md"));
const monthArg = args.find((arg) => /^\d{4}-\d{2}$/.test(arg));
const ledgerPath = explicitPath
  ? resolve(repoRoot, explicitPath)
  : monthArg
    ? resolve(repoRoot, `docs/Source-Coverage-Ledger-${monthArg}.md`)
    : null;

if (!ledgerPath) {
  console.error("Usage: node scripts/validate-source-ledger.mjs <YYYY-MM|ledger.md> [--require-closed]");
  process.exit(1);
}

if (!existsSync(ledgerPath)) {
  console.error(`Ledger not found: ${ledgerPath}`);
  process.exit(1);
}

const citationEntries = extractCitationEntries(repoRoot);
const uniqueCitationUrls = uniqueUrls(citationEntries);
const ledger = readFileSync(ledgerPath, "utf8");
const ledgerRows = parseLedgerRows(ledger);
const ledgerUrls = new Set(ledgerRows.flatMap((row) => row.urls));

const missing = uniqueCitationUrls.filter((entry) => !ledgerUrls.has(entry.normalizedUrl));
const invalidResults = [];
const openRows = [];
const notCheckedRows = [];
const closedRowsWithoutDate = [];
const blockedWithoutFallback = [];
const notDueWithoutNextDue = [];

for (const row of ledgerRows) {
  if (row.result && !RESULT_VALUES.has(row.result)) {
    invalidResults.push(row);
  }
  if (requireClosed && !row.result) {
    openRows.push(row);
  }
  if (requireClosed && row.result === "not checked") {
    notCheckedRows.push(row);
  }
  if (requireClosed && row.result && row.result !== "not checked" && !row.dateChecked) {
    closedRowsWithoutDate.push(row);
  }
  if (requireClosed && row.result === "blocked" && !`${row.action} ${row.notes}`.trim()) {
    blockedWithoutFallback.push(row);
  }
  if (row.result === "not due" && !/\bnext due\b/i.test(`${row.action} ${row.notes}`)) {
    notDueWithoutNextDue.push(row);
  }
}

const coverageBlank = /\*\*Coverage level achieved:\*\*\s*fill in after cycle closes/i.test(ledger);
let failed = false;

if (missing.length) {
  failed = true;
  console.error(`Missing ${missing.length} cited URL(s) from ledger:`);
  for (const entry of missing) {
    console.error(`- ${entry.normalizedUrl} (${entry.field}; ${entry.label})`);
  }
}

if (invalidResults.length) {
  failed = true;
  console.error(`Invalid result value(s): ${invalidResults.length}`);
  for (const row of invalidResults.slice(0, 20)) {
    console.error(`- ${row.result} :: ${row.source}`);
  }
  if (invalidResults.length > 20) console.error(`...and ${invalidResults.length - 20} more`);
}

if (notDueWithoutNextDue.length) {
  failed = true;
  console.error(`Not-due row(s) without a next due point: ${notDueWithoutNextDue.length}`);
  for (const row of notDueWithoutNextDue.slice(0, 20)) {
    console.error(`- ${row.source} (${row.cadence})`);
  }
  if (notDueWithoutNextDue.length > 20) {
    console.error(`...and ${notDueWithoutNextDue.length - 20} more`);
  }
}

if (requireClosed && openRows.length) {
  failed = true;
  console.error(`Open due row(s) without Result: ${openRows.length}`);
  for (const row of openRows.slice(0, 20)) {
    console.error(`- ${row.source} (${row.cadence})`);
  }
  if (openRows.length > 20) console.error(`...and ${openRows.length - 20} more`);
}

if (requireClosed && notCheckedRows.length) {
  failed = true;
  console.error(`Row(s) still marked not checked: ${notCheckedRows.length}`);
  for (const row of notCheckedRows.slice(0, 20)) {
    console.error(`- ${row.source} (${row.cadence})`);
  }
  if (notCheckedRows.length > 20) console.error(`...and ${notCheckedRows.length - 20} more`);
}

if (requireClosed && closedRowsWithoutDate.length) {
  failed = true;
  console.error(`Closed row(s) without Date checked: ${closedRowsWithoutDate.length}`);
  for (const row of closedRowsWithoutDate.slice(0, 20)) {
    console.error(`- ${row.source} (${row.result})`);
  }
  if (closedRowsWithoutDate.length > 20) {
    console.error(`...and ${closedRowsWithoutDate.length - 20} more`);
  }
}

if (requireClosed && blockedWithoutFallback.length) {
  failed = true;
  console.error(`Blocked row(s) without fallback action/notes: ${blockedWithoutFallback.length}`);
  for (const row of blockedWithoutFallback.slice(0, 20)) {
    console.error(`- ${row.source}`);
  }
  if (blockedWithoutFallback.length > 20) {
    console.error(`...and ${blockedWithoutFallback.length - 20} more`);
  }
}

if (requireClosed && coverageBlank) {
  failed = true;
  console.error("Coverage level achieved is still blank.");
}

if (failed) {
  process.exit(1);
}

console.log(
  `OK. Ledger covers ${uniqueCitationUrls.length} unique cited URLs across ${citationEntries.length} citation surfaces.`
);
if (requireClosed) {
  console.log(`OK. ${ledgerRows.length} ledger rows have closed Result values.`);
}

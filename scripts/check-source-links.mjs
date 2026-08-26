#!/usr/bin/env node
// Fetches every cited URL and reports whether it actually resolves.
//
// Why this exists: `source:ledger:check` verifies that every ledger ROW has a
// written disposition. It never opens a link. In August 2026 that gap let a
// cycle close "611 rows closed" while 17 of 18 Major Projects cohort links were
// already returning 404, because the Major Projects Office had restructured its
// paths. Paperwork completeness is not link health. This script checks link
// health separately, which is the assertion the ledger cannot make.
//
// Usage:
//   node scripts/check-source-links.mjs            # check every cited URL
//   node scripts/check-source-links.mjs --json     # machine-readable report
//   node scripts/check-source-links.mjs --limit 25 # sample while iterating
//   node scripts/check-source-links.mjs --cycle 2026-09 \
//     --exceptions-out docs/source-recertification/source-link-exceptions-2026-09.json
//   node scripts/check-source-links.mjs --check-exceptions \
//     docs/source-recertification/source-link-exceptions-2026-09.json
//
// Exit 0 when nothing is DEAD. Exit 1 when any URL is DEAD.
// SUSPECT, TIMEOUT, REDIRECTED, and BLOCKED are reported, not failed. They still
// need a manual disposition in a persisted monthly exception report.
import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
  extractCitationEntries,
  normalizeUrl,
  uniqueUrls,
} from "./source-ledger-utils.mjs";

const execFileAsync = promisify(execFile);
const EXCEPTION_STATES = ["DEAD", "SUSPECT", "TIMEOUT", "REDIRECTED", "BLOCKED"];
const STATE_ORDER = new Map([...EXCEPTION_STATES, "OK"].map((state, index) => [state, index]));
const REPORT_SCHEMA_VERSION = 1;
const CYCLE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;
const CLOSED_DISPOSITION_STATUSES = new Set([
  "confirmed-live",
  "accepted-redirect",
  "citation-replaced",
  "open-with-fallback",
]);

// Node's fetch fails outright on a few government servers that curl handles
// fine (parl.ca is one: fetch throws, curl gets 302 then 200). Declaring those
// DEAD would make this report untrustworthy, and a checker that cries wolf gets
// ignored. So anything fetch cannot resolve gets a second opinion from curl
// before it is called dead.
async function curlProbe(url) {
  try {
    const { stdout } = await execFileAsync("curl", [
      "-s", "-o", "/dev/null", "-L", "--max-time", "25",
      "-A", UA, "-w", "%{http_code} %{url_effective}", url,
    ], { timeout: 30000 });
    const [code, finalUrl] = String(stdout).trim().split(" ");
    return { status: Number(code), finalUrl: finalUrl || url };
  } catch {
    return null;
  }
}

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function optionValue(args, option) {
  const index = args.indexOf(option);
  if (index === -1) return null;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${option} requires a value`);
  }
  return value;
}

export function parseArgs(args) {
  const limitValue = optionValue(args, "--limit");
  const cycle = optionValue(args, "--cycle");
  const exceptionsOut = optionValue(args, "--exceptions-out");
  const checkExceptions = optionValue(args, "--check-exceptions");
  const limit = limitValue === null ? Infinity : Number(limitValue);

  if (limitValue !== null && (!Number.isInteger(limit) || limit < 1)) {
    throw new Error("--limit must be a positive integer");
  }
  if (checkExceptions && (limitValue !== null || cycle || exceptionsOut)) {
    throw new Error("--check-exceptions cannot be combined with --limit, --cycle, or --exceptions-out");
  }
  if (limitValue !== null && exceptionsOut) {
    throw new Error("--limit cannot be combined with --exceptions-out; durable reports require a full run");
  }
  if (exceptionsOut && !cycle) {
    throw new Error("--exceptions-out requires --cycle YYYY-MM");
  }
  if (cycle && !exceptionsOut) {
    throw new Error("--cycle requires --exceptions-out PATH");
  }
  if (cycle && !CYCLE_PATTERN.test(cycle)) {
    throw new Error("--cycle must use YYYY-MM");
  }
  if (cycle && exceptionsOut) {
    assertExceptionReportFilenameCycle(exceptionsOut, cycle, "--exceptions-out");
  }

  return {
    asJson: args.includes("--json"),
    checkExceptions,
    cycle,
    exceptionsOut,
    limit,
  };
}

export function assertExceptionReportFilenameCycle(outputPath, cycle, optionName = "exception report") {
  const expectedFilename = `source-link-exceptions-${cycle}.json`;
  const actualFilename = path.basename(outputPath);
  if (actualFilename !== expectedFilename) {
    throw new Error(`${optionName} filename must be ${expectedFilename}, got ${actualFilename}`);
  }
}

// A real browser UA. Several canada.ca and StatCan surfaces return 403 to a
// bare fetcher while serving the page fine to a browser, so without this the
// report is full of false failures.
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0 Safari/537.36";
const TIMEOUT_MS = 20000;
const CONCURRENCY = 4;
// Government hosts rate limit. Hitting canada.ca with several parallel requests
// makes it serve its own 404 page with a 200 status, which this checker then
// reports as a soft 404 on a page that is actually fine. That false positive is
// worse than no check, because it sends an editor off to "repair" a working
// citation. So requests to the same host are serialised with a gap, and any
// failure verdict is re-tested once, alone, before it is believed.
const PER_HOST_GAP_MS = 1200;
const hostQueues = new Map();

function throttleHost(url) {
  let host;
  try { host = new URL(url).host; } catch { host = "unknown"; }
  const prev = hostQueues.get(host) || Promise.resolve();
  let release;
  const next = new Promise((r) => { release = r; });
  hostQueues.set(host, prev.then(() => next));
  return prev.then(() => ({ done: () => setTimeout(release, PER_HOST_GAP_MS) }));
}


// A 200 does not always mean the citation survived. Two patterns matter:
// a soft 404 (the server rewrites a missing page to an error page and still
// answers 200), and a deep link that now redirects to a bare homepage, which
// means the specific document is gone even though the site is up. Both were
// found in the August 2026 sweep: an ECCC departmental plan resolving to
// canada.ca/errors/404.html, and two Ethics Commissioner declaration PDFs
// redirecting to the ethicscanada.ca homepage. A citation that no longer
// reaches the document cannot support the claim it is attached to.
function citationBroken(originalUrl, finalUrl) {
  const fin = String(finalUrl || "");
  if (/\/errors?\/40[34]|\/404(\.html?|\/|$)|page-not-found|notfound/i.test(fin)) {
    return "soft 404";
  }
  try {
    const o = new URL(originalUrl);
    const f = new URL(fin);
    const oDeep = o.pathname.replace(/\/$/, "").split("/").filter(Boolean).length >= 2;
    const fRoot = f.pathname.replace(/\/$/, "") === "";
    if (oDeep && fRoot) return "redirects to homepage, document gone";
  } catch { /* unparseable url, leave it to the status check */ }
  return null;
}

async function probe(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    // HEAD first (cheap); some servers reject it, so fall back to a ranged GET.
    let res = await fetch(url, { method: "HEAD", redirect: "follow",
      headers: { "user-agent": UA }, signal: controller.signal });
    if (res.status === 405 || res.status === 501 || res.status === 403) {
      res = await fetch(url, { method: "GET", redirect: "follow",
        headers: { "user-agent": UA, range: "bytes=0-2048" }, signal: controller.signal });
    }
    const finalUrl = res.url || url;
    const moved = finalUrl.replace(/\/$/, "") !== url.replace(/\/$/, "");
    if (res.ok) {
      const broken = citationBroken(url, finalUrl);
      if (broken === "soft 404") {
        // Reported, not failed. canada.ca sits behind Akamai and serves its own
        // error page with a 200 under load, and it does so unpredictably: the
        // same page passes a calm one-at-a-time fetch and fails inside a full
        // run. Failing the build on that would send an editor to "repair"
        // healthy citations, which is worse than not checking. A human still
        // needs to look, so it is surfaced loudly instead of silently dropped.
        return { url, status: res.status, finalUrl, state: "SUSPECT", reason: broken };
      }
      if (broken) return { url, status: res.status, finalUrl, state: "DEAD", reason: broken };
      return { url, status: res.status, finalUrl, state: moved ? "REDIRECTED" : "OK" };
    }
    if (res.status === 403 || res.status === 429) {
      return { url, status: res.status, finalUrl, state: "BLOCKED" };
    }
    return { url, status: res.status, finalUrl, state: "DEAD" };
  } catch (err) {
    const reason = err.name === "AbortError" ? "timeout" : (err.cause?.code || err.message);
    // Second opinion before condemning the link (see curlProbe note above).
    const viaCurl = await curlProbe(url);
    if (viaCurl && viaCurl.status >= 200 && viaCurl.status < 400) {
      return { url, status: viaCurl.status, finalUrl: viaCurl.finalUrl, state: "OK", reason: "via curl" };
    }
    if (viaCurl && (viaCurl.status === 403 || viaCurl.status === 429)) {
      return { url, status: viaCurl.status, finalUrl: viaCurl.finalUrl, state: "BLOCKED" };
    }
    if (reason === "timeout" && !viaCurl) return { url, status: 0, finalUrl: url, state: "TIMEOUT", reason };
    return { url, status: viaCurl?.status ?? 0, finalUrl: url, state: "DEAD", reason };
  } finally {
    clearTimeout(timer);
  }
}

// A failure is only reported after a second, unhurried look.
async function probeConfirmed(url) {
  const gate = await throttleHost(url);
  let result;
  try { result = await probe(url); } finally { gate.done(); }
  if (result.state !== "DEAD" && result.state !== "TIMEOUT") return result;
  // canada.ca sits behind Akamai and intermittently serves its own error page
  // with a 200 status under load. A single flap must not condemn a healthy
  // citation, so a failure is re-tested up to three times with growing backoff
  // and the kinder verdict wins. Observed in practice: the same run flagged
  // different canada.ca pages on each pass while every one of them fetched
  // cleanly on its own.
  for (const waitMs of [2500, 6000, 12000]) {
    await new Promise((r) => setTimeout(r, waitMs));
    const gate2 = await throttleHost(url);
    let retry;
    try { retry = await probe(url); } finally { gate2.done(); }
    if (retry.state === "OK" || retry.state === "REDIRECTED") {
      return { ...retry, reason: "healthy on retry, first attempt was throttled" };
    }
    result = retry;
  }
  return result;
}

function compareText(left, right) {
  const a = String(left || "");
  const b = String(right || "");
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function compareResults(left, right) {
  const leftRank = STATE_ORDER.get(left.state) ?? STATE_ORDER.size;
  const rightRank = STATE_ORDER.get(right.state) ?? STATE_ORDER.size;
  return leftRank - rightRank || compareText(left.url, right.url);
}

function buildReferencesByUrl(entries) {
  const referencesByUrl = new Map();
  for (const entry of entries) {
    const url = entry.normalizedUrl || normalizeUrl(entry.url);
    if (!url) continue;
    const references = referencesByUrl.get(url) || [];
    references.push({
      area: entry.area || "",
      field: entry.field || "",
      label: entry.label || "",
    });
    referencesByUrl.set(url, references);
  }

  for (const [url, references] of referencesByUrl) {
    const unique = new Map();
    for (const reference of references) {
      const key = `${reference.area}\u0000${reference.field}\u0000${reference.label}`;
      unique.set(key, reference);
    }
    referencesByUrl.set(
      url,
      [...unique.values()].sort((left, right) => (
        compareText(left.area, right.area)
        || compareText(left.field, right.field)
        || compareText(left.label, right.label)
      )),
    );
  }
  return referencesByUrl;
}

export function buildExceptionReport(cycle, results, citationEntries = []) {
  const referencesByUrl = buildReferencesByUrl(citationEntries);
  const exceptions = results
    .filter((result) => result.state !== "OK")
    .sort(compareResults)
    .map((result) => ({
      state: result.state,
      status: Number.isFinite(result.status) ? result.status : 0,
      url: result.url,
      finalUrl: result.finalUrl || result.url,
      reason: result.reason || null,
      references: referencesByUrl.get(normalizeUrl(result.url)) || [],
      manualDisposition: {
        status: "pending",
        date: "",
        note: "",
      },
    }));

  return {
    schemaVersion: REPORT_SCHEMA_VERSION,
    cycle,
    totalChecked: results.length,
    exceptionCount: exceptions.length,
    counts: Object.fromEntries(
      EXCEPTION_STATES.map((state) => [
        state,
        exceptions.filter((exception) => exception.state === state).length,
      ]),
    ),
    exceptions,
  };
}

export function writeExceptionReport(outputPath, report, baseDirectory = repoRoot) {
  const absolutePath = path.resolve(baseDirectory, outputPath);
  mkdirSync(path.dirname(absolutePath), { recursive: true });
  const temporaryPath = `${absolutePath}.tmp`;
  writeFileSync(temporaryPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  renameSync(temporaryPath, absolutePath);
  return absolutePath;
}

export function validateExceptionReportClosure(report, reportPath = "") {
  const issues = [];
  if (!report || Array.isArray(report) || typeof report !== "object") {
    return ["report must be a JSON object"];
  }

  if (!CYCLE_PATTERN.test(report.cycle || "")) {
    issues.push("report cycle must use YYYY-MM");
  } else if (reportPath) {
    try {
      assertExceptionReportFilenameCycle(reportPath, report.cycle);
    } catch (error) {
      issues.push(error.message);
    }
  }

  if (!Array.isArray(report.exceptions)) {
    issues.push("report exceptions must be an array");
    return issues;
  }

  report.exceptions.forEach((exception, index) => {
    const row = `exceptions[${index}]${exception?.url ? ` (${exception.url})` : ""}`;
    const disposition = exception?.manualDisposition;
    if (!disposition || typeof disposition !== "object") {
      issues.push(`${row} is missing manualDisposition`);
      return;
    }
    if (disposition.status === "pending") {
      issues.push(`${row} manualDisposition.status is pending`);
      return;
    }
    if (!CLOSED_DISPOSITION_STATUSES.has(disposition.status)) {
      issues.push(`${row} manualDisposition.status is not allowed`);
    }
    if (!/^\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[01])$/.test(disposition.date || "")) {
      issues.push(`${row} manualDisposition.date must use YYYY-MM-DD`);
    }
    if (typeof disposition.note !== "string" || !disposition.note.trim()) {
      issues.push(`${row} manualDisposition.note is required`);
    }
  });

  return issues;
}

export function readExceptionReportClosure(inputPath, baseDirectory = repoRoot) {
  const absolutePath = path.resolve(baseDirectory, inputPath);
  const report = JSON.parse(readFileSync(absolutePath, "utf8"));
  return {
    absolutePath,
    report,
    issues: validateExceptionReportClosure(report, absolutePath),
  };
}

export function linkHealthExitCode(results) {
  return results.some((result) => result.state === "DEAD") ? 1 : 0;
}

async function main(args = process.argv.slice(2)) {
  const { asJson, checkExceptions, cycle, exceptionsOut, limit } = parseArgs(args);
  if (checkExceptions) {
    const closure = readExceptionReportClosure(checkExceptions);
    const relativePath = path.relative(repoRoot, closure.absolutePath);
    if (asJson) {
      console.log(JSON.stringify({
        report: relativePath,
        closed: closure.issues.length === 0,
        issues: closure.issues,
      }, null, 2));
    } else if (closure.issues.length) {
      console.log(`source-link exception closure: OPEN (${closure.issues.length} issue(s))`);
      closure.issues.forEach((issue) => console.log(`  ${issue}`));
    } else {
      console.log(`source-link exception closure: CLOSED (${relativePath})`);
    }
    return closure.issues.length ? 1 : 0;
  }

  const entries = extractCitationEntries(repoRoot);
  // uniqueUrls returns entry OBJECTS, not strings. Pull the url field.
  const urls = uniqueUrls(entries)
    .map((e) => e.url || e.normalizedUrl)
    .filter((u) => typeof u === "string" && /^https?:\/\//.test(u))
    .slice(0, limit);
  const results = [];
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, urls.length) }, async () => {
    while (cursor < urls.length) {
      const url = urls[cursor++];
      results.push(await probeConfirmed(url));
    }
  }));

  const orderedResults = [...results].sort(compareResults);
  const by = (s) => orderedResults.filter((r) => r.state === s);
  const dead = by("DEAD");

  if (exceptionsOut) {
    const report = buildExceptionReport(cycle, orderedResults, entries);
    const reportPath = writeExceptionReport(exceptionsOut, report);
    if (!asJson) {
      console.log(`source-link exception report: ${path.relative(repoRoot, reportPath)}`);
    }
  }

  if (asJson) {
    console.log(JSON.stringify({
      checkedAt: new Date().toISOString(),
      total: orderedResults.length,
      results: orderedResults,
    }, null, 2));
  } else {
    console.log(`source links checked: ${orderedResults.length}`);
    for (const state of EXCEPTION_STATES) {
      const rows = by(state);
      if (!rows.length) continue;
      console.log(`\n${state} (${rows.length}):`);
      for (const r of rows) {
        const extra = state === "REDIRECTED" ? ` -> ${r.finalUrl}` : r.reason ? ` (${r.reason})` : "";
        console.log(`  ${String(r.status).padStart(3)} ${r.url}${extra}`);
      }
    }
    console.log(`\nOK ${by("OK").length} | REDIRECTED ${by("REDIRECTED").length} | SUSPECT ${by("SUSPECT").length} | BLOCKED ${by("BLOCKED").length} | TIMEOUT ${by("TIMEOUT").length} | DEAD ${dead.length}`);
    if (by("SUSPECT").length) {
      console.log("SUSPECT means the server answered 200 from what looks like an error page. Check each one by hand before changing it: these flap under load.");
    }
  }
  return linkHealthExitCode(orderedResults);
}

const isDirectRun = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  main()
    .then((exitCode) => { process.exitCode = exitCode; })
    .catch((err) => {
      console.error(err);
      process.exitCode = 1;
    });
}

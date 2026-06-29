// Validates the reader-facing dashboard status metadata. This file protects the
// status card from becoming a shadow scoring system or a fuzzy freshness badge.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const statusPath = resolve(__dirname, "../src/data/status.json");
const metaPath = resolve(__dirname, "../src/data/meta.json");

const status = JSON.parse(readFileSync(statusPath, "utf-8"));
const meta = JSON.parse(readFileSync(metaPath, "utf-8"));

const errors = [];
const ALLOWED_DISCLAIMERS = new Set(["scan_vs_review_v1"]);
const FORBIDDEN_URGENCY_WORDS = [
  "breaking",
  "urgent",
  "just in",
  "watch now",
  "must read",
  "live",
  "real-time",
  "biweekly",
];

function err(message) {
  errors.push(`✗ status.json: ${message}`);
}

function isPlainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function validIsoDate(value) {
  if (typeof value !== "string") return false;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const parsed = new Date(Date.UTC(y, m - 1, d));
  return parsed.getUTCFullYear() === y
    && parsed.getUTCMonth() === m - 1
    && parsed.getUTCDate() === d;
}

function dateValue(value) {
  return Date.parse(`${value}T00:00:00Z`);
}

function scanForbiddenWords(path, value) {
  if (typeof value === "string") {
    const lower = value.toLowerCase();
    for (const word of FORBIDDEN_URGENCY_WORDS) {
      if (lower.includes(word)) {
        err(`${path} contains forbidden urgency/freshness wording "${word}"`);
      }
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => scanForbiddenWords(`${path}[${index}]`, item));
    return;
  }

  if (isPlainObject(value)) {
    for (const [key, child] of Object.entries(value)) {
      scanForbiddenWords(`${path}.${key}`, child);
    }
  }
}

function validNextCheckId(value) {
  return typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function validStatusHref(value) {
  return typeof value === "string"
    && (
      value.startsWith("#")
      || value.startsWith("https://github.com/Sawatter/canada-under-carney/")
    );
}

function validateNextCheck(check, index) {
  const prefix = `nextChecks[${index}]`;
  if (!isPlainObject(check)) {
    err(`${prefix} must be an object`);
    return;
  }

  if (!validNextCheckId(check.id)) {
    err(`${prefix}.id must be a kebab-case identifier`);
  }

  for (const field of ["label", "status"]) {
    if (typeof check[field] !== "string" || check[field].trim().length < 3) {
      err(`${prefix}.${field} must be a non-empty string`);
    }
  }

  const timingFields = ["date", "dateSource", "timingLabel"].filter((field) => field in check);
  if (timingFields.length !== 1) {
    err(`${prefix} must include exactly one of date, dateSource, or timingLabel`);
  } else if ("date" in check && !validIsoDate(check.date)) {
    err(`${prefix}.date must be an ISO date (YYYY-MM-DD)`);
  } else if ("dateSource" in check && check.dateSource !== "nextScheduledSourceScanAt") {
    err(`${prefix}.dateSource must be nextScheduledSourceScanAt`);
  } else if ("dateSource" in check && !validIsoDate(status[check.dateSource])) {
    err(`${prefix}.dateSource must resolve to an ISO date`);
  } else if ("timingLabel" in check && check.timingLabel !== "Event-driven") {
    err(`${prefix}.timingLabel must be Event-driven`);
  }

  if ("href" in check && !validStatusHref(check.href)) {
    err(`${prefix}.href must be an in-app hash or repo GitHub URL`);
  }
}

if (!isPlainObject(status)) {
  err("root must be an object");
}

if (status.schemaVersion !== 2) {
  err('schemaVersion must be 2');
}

for (const field of [
  "generatedAt",
  "lastSourceScanAt",
  "nextScheduledSourceScanAt",
  "lastEditorReviewedScoreCycleAt",
  "coverageThrough",
]) {
  if (!validIsoDate(status[field])) {
    err(`${field} must be an ISO date (YYYY-MM-DD)`);
  }
}

if (!Number.isInteger(status.watchItemsAwaitingReviewCount) || status.watchItemsAwaitingReviewCount < 0) {
  err("watchItemsAwaitingReviewCount must be an integer >= 0");
}

if (!ALLOWED_DISCLAIMERS.has(status.disclaimerKey)) {
  err(`disclaimerKey must be one of: ${[...ALLOWED_DISCLAIMERS].join(", ")}`);
}

if (status.coverageThrough !== meta.coveragePeriod?.end) {
  err(`coverageThrough (${status.coverageThrough}) must equal meta.coveragePeriod.end (${meta.coveragePeriod?.end})`);
}

if (validIsoDate(status.lastEditorReviewedScoreCycleAt) && validIsoDate(meta.lastUpdated)
  && dateValue(status.lastEditorReviewedScoreCycleAt) > dateValue(meta.lastUpdated)) {
  err("lastEditorReviewedScoreCycleAt cannot be newer than meta.lastUpdated");
}

if (validIsoDate(status.coverageThrough) && validIsoDate(status.lastEditorReviewedScoreCycleAt)
  && dateValue(status.coverageThrough) > dateValue(status.lastEditorReviewedScoreCycleAt)) {
  err("coverageThrough cannot be newer than lastEditorReviewedScoreCycleAt");
}

if (validIsoDate(status.nextScheduledSourceScanAt) && validIsoDate(status.lastSourceScanAt)
  && dateValue(status.nextScheduledSourceScanAt) <= dateValue(status.lastSourceScanAt)) {
  err("nextScheduledSourceScanAt must be after lastSourceScanAt");
}

if ("newSinceLastVisit" in status || "materialChangesCount" in status || "watchItems" in status) {
  err("status schema must not include personalized, material-change, or visit-history watch-item fields");
}

if (!Array.isArray(status.nextChecks)) {
  err("nextChecks must be an array");
} else {
  const ids = new Set();
  status.nextChecks.forEach((check, index) => {
    validateNextCheck(check, index);
    if (isPlainObject(check) && ids.has(check.id)) {
      err(`nextChecks[${index}].id must be unique`);
    }
    if (isPlainObject(check)) ids.add(check.id);
  });
}

scanForbiddenWords("status", status);

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("OK. Dashboard status metadata passes.");

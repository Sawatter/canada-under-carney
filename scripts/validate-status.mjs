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
  if (typeof value !== "string") return;
  const lower = value.toLowerCase();
  for (const word of FORBIDDEN_URGENCY_WORDS) {
    if (lower.includes(word)) {
      err(`${path} contains forbidden urgency/freshness wording "${word}"`);
    }
  }
}

if (!isPlainObject(status)) {
  err("root must be an object");
}

if (status.schemaVersion !== 1) {
  err('schemaVersion must be 1');
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
  err("v1 status schema must not include personalized, material-change, or public watch-list fields");
}

for (const [key, value] of Object.entries(status)) {
  scanForbiddenWords(key, value);
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("OK. Dashboard status metadata passes.");

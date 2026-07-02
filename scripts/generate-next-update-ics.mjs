#!/usr/bin/env node
// Generates public/next-update.ics from src/data/meta.json.
// Runs on every `npm run build` (via the prebuild hook in package.json).
//
// Deterministic on purpose: DTSTAMP derives from meta.lastUpdated, not the
// wall clock, so two builds of the same data produce byte-identical output.
// No alarms and no attendees. The event is a quiet all-day marker, not a nag.

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const meta = JSON.parse(
  readFileSync(resolve(repoRoot, "src/data/meta.json"), "utf8")
);

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

for (const [key, value] of [
  ["nextUpdate", meta.nextUpdate],
  ["lastUpdated", meta.lastUpdated],
]) {
  if (!DATE_RE.test(String(value ?? ""))) {
    console.error(`meta.json ${key} must be YYYY-MM-DD, got: ${value}`);
    process.exit(1);
  }
}

// "2026-08-01" -> "20260801" (RFC 5545 DATE value)
function basicDate(isoDate) {
  return isoDate.replace(/-/g, "");
}

// All-day events use an exclusive DTEND, so the end is the following day.
function nextDay(isoDate) {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

// RFC 5545 3.3.11: escape backslash, semicolon, comma, and newline in TEXT.
function escapeText(s) {
  return String(s)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

// RFC 5545 3.1: content lines longer than 75 octets fold onto continuation
// lines that start with a single space. Content here is ASCII, so
// characters equal octets.
function fold(line) {
  if (line.length <= 75) return [line];
  const parts = [line.slice(0, 75)];
  let rest = line.slice(75);
  while (rest.length > 74) {
    parts.push(" " + rest.slice(0, 74));
    rest = rest.slice(74);
  }
  if (rest.length > 0) parts.push(" " + rest);
  return parts;
}

const dtStart = basicDate(meta.nextUpdate);
const dtEnd = basicDate(nextDay(meta.nextUpdate));
const dtStamp = `${basicDate(meta.lastUpdated)}T000000Z`;

const lines = [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  `PRODID:-//Canada Under Carney//Dashboard v${meta.version}//EN`,
  "CALSCALE:GREGORIAN",
  "METHOD:PUBLISH",
  "BEGIN:VEVENT",
  `UID:next-update-${meta.nextUpdate}@canada-under-carney`,
  `DTSTAMP:${dtStamp}`,
  `DTSTART;VALUE=DATE:${dtStart}`,
  `DTEND;VALUE=DATE:${dtEnd}`,
  `SUMMARY:${escapeText("Canada Under Carney - next scheduled update")}`,
  `DESCRIPTION:${escapeText(
    "Monthly scorecard update. The dashboard publishes on a fixed monthly schedule."
  )}`,
  "URL:https://sawatter.github.io/canada-under-carney/",
  "TRANSP:TRANSPARENT",
  "END:VEVENT",
  "END:VCALENDAR",
];

const ics = lines.flatMap(fold).join("\r\n") + "\r\n";

const outPath = resolve(repoRoot, "public/next-update.ics");
writeFileSync(outPath, ics, "utf8");
console.log(
  `Wrote ${outPath} (event on ${meta.nextUpdate}, dtstamp ${dtStamp})`
);

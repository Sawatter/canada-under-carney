import { readFileSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import {
  dirname,
  isAbsolute,
  relative,
  resolve,
  sep,
} from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildFirstLookProjection,
  selectPrimaryNextCheck,
} from "../src/firstLook.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const VALID_CHANGE_TYPES = new Set([
  "product",
  "method",
  "docs",
  "event",
  "grade",
  "fix",
  "minor",
]);
const VERDICT_GRADE_TOKEN_PATTERNS = [
  /\b[A-F][+\-](?!\w)/,
  /\bgrade\s+[A-F]\b/i,
  /\b(?:[Gg]raded?|[Hh]eld|[Hh]olds?|[Mm]oved?|[Ss]tays?|at|to|from)\s+[A-F](?![\w-])/,
];
const VERDICT_FORBIDDEN_URGENCY_WORDS = [
  "breaking",
  "urgent",
  "just in",
  "live",
  "real-time",
  "don't miss",
  "dont miss",
  "come back",
  "check back",
];
const VERDICT_FORBIDDEN_URGENCY_PATTERNS = VERDICT_FORBIDDEN_URGENCY_WORDS.map(
  (word) => ({
    word,
    pattern: new RegExp(
      `\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      "i",
    ),
  }),
);

function resolveDataDirectory() {
  const canonicalDataDir = resolve(__dirname, "../src/data");
  const args = process.argv.slice(2);
  if (args.length === 0) return canonicalDataDir;
  if (args.length !== 2 || args[0] !== "--fixture-data-dir") {
    console.error("FATAL: expected --fixture-data-dir <temporary-directory>");
    process.exit(1);
  }

  let fixtureDataDir;
  let systemTempDir;
  try {
    fixtureDataDir = realpathSync(resolve(args[1]));
    systemTempDir = realpathSync(tmpdir());
  } catch (error) {
    console.error(`FATAL: fixture data directory could not be resolved: ${error.message}`);
    process.exit(1);
  }

  const fromSystemTemp = relative(systemTempDir, fixtureDataDir);
  if (
    fromSystemTemp === ".."
    || fromSystemTemp.startsWith(`..${sep}`)
    || isAbsolute(fromSystemTemp)
  ) {
    console.error("FATAL: fixture data directory must be inside the system temp directory");
    process.exit(1);
  }
  return fixtureDataDir;
}

function validIsoDate(value) {
  if (typeof value !== "string") return false;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year
    && parsed.getUTCMonth() === month - 1
    && parsed.getUTCDate() === day;
}

const dataDirectory = resolveDataDirectory();
const meta = JSON.parse(readFileSync(resolve(dataDirectory, "meta.json"), "utf8"));
const changelog = JSON.parse(readFileSync(resolve(dataDirectory, "changelog.json"), "utf8"));
const status = JSON.parse(readFileSync(resolve(dataDirectory, "status.json"), "utf8"));
const errors = [];

function err(message) {
  errors.push(`✗ first-look: ${message}`);
}

function validateOverallVerdictLine() {
  const value = meta?.overallVerdictLine;
  if (typeof value !== "string" || value.trim().length === 0) {
    err("meta.overallVerdictLine must be an authored non-empty string");
    return;
  }
  if (value !== value.trim()) {
    err("meta.overallVerdictLine must not have leading or trailing whitespace");
  }
  if (/[\r\n]/.test(value)) {
    err("meta.overallVerdictLine must be a single line");
  }
  if (value.length > 110) {
    err(`meta.overallVerdictLine is ${value.length} chars - must be 110 or fewer`);
  }
  for (const pattern of VERDICT_GRADE_TOKEN_PATTERNS) {
    if (pattern.test(value)) {
      err(
        `meta.overallVerdictLine contains a grade token (matched ${pattern}) - verdict copy must not name grades`,
      );
      break;
    }
  }
  for (const { word, pattern } of VERDICT_FORBIDDEN_URGENCY_PATTERNS) {
    if (pattern.test(value)) {
      err(
        `meta.overallVerdictLine contains forbidden urgency/freshness wording "${word}"`,
      );
      break;
    }
  }
}

function validateNewestRelease() {
  if (!Array.isArray(changelog) || changelog.length === 0) {
    err("changelog must be a non-empty array");
    return;
  }

  const newest = changelog[0];
  if (!newest || typeof newest !== "object" || Array.isArray(newest)) {
    err("changelog[0] must be an object");
    return;
  }
  if (newest.version !== meta?.version) {
    err(
      `changelog[0].version (${newest.version}) must equal meta.version (${meta?.version})`,
    );
  }
  if (!validIsoDate(newest.date) || newest.date !== meta?.lastUpdated) {
    err(
      `changelog[0].date (${newest.date}) must be a valid date equal to meta.lastUpdated (${meta?.lastUpdated})`,
    );
  }
  if (!Array.isArray(newest.items) || newest.items.length === 0) {
    err("changelog[0].items must be a non-empty array");
    return;
  }

  newest.items.forEach((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      err(`changelog[0].items[${index}] must be an object`);
    } else if (!VALID_CHANGE_TYPES.has(item.type)) {
      err(
        `changelog[0].items[${index}].type "${item.type}" is not an allowed changelog type`,
      );
    }
  });

  try {
    buildFirstLookProjection(newest);
  } catch (error) {
    err(error.message);
  }
}

function validateWatch() {
  if (!validIsoDate(meta?.nextUpdate)) {
    err("meta.nextUpdate must be an ISO date (YYYY-MM-DD)");
  }
  try {
    selectPrimaryNextCheck(status);
  } catch (error) {
    err(error.message);
  }
}

validateOverallVerdictLine();
validateNewestRelease();
validateWatch();

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("OK. First-look authored data and deterministic selectors pass.");

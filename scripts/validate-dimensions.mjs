// Validates the shape of src/data/dimensions.json against the invariants
// documented in CLAUDE.md. Hard-fails (exit 1) on real shape errors that
// would break the UI or scoring math. Soft-warns (logged, exit 0) on
// advisory issues like source-band drift.
//
// Wired into the prebuild step so it runs before every `npm run build`.
// Run directly with `node scripts/validate-dimensions.mjs`.

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
import { GRADES, POCKETBOOK_DIMS } from "../src/constants.js";
import { gpaToGrade } from "../src/utils.js";
import {
  TARGET_OPERATORS,
  RELATIONS,
  formatValue,
  deriveRelation,
} from "../src/dimensionTargets.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

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

const selectedDataDir = resolveDataDirectory();
const dataPath = resolve(selectedDataDir, "dimensions.json");
const changelogPath = resolve(selectedDataDir, "changelog.json");
const metaPath = resolve(selectedDataDir, "meta.json");
const dimensions = JSON.parse(readFileSync(dataPath, "utf-8"));
const changelog = JSON.parse(readFileSync(changelogPath, "utf-8"));
const meta = JSON.parse(readFileSync(metaPath, "utf-8"));

const VALID_GRADES = new Set([
  "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F",
]);
const VALID_TRENDS = new Set(["up", "stable", "down"]);
const WHOLE_LETTER_GRADES = new Set(["A", "B", "C", "D", "F"]);
const VALID_SOURCE_DATE_KINDS = new Set(["published", "updated", "as-of"]);
const TARGET_OPERATOR_SET = new Set(TARGET_OPERATORS);
const LATEST_REVIEW_KEYS = new Set(["date", "outcome", "summary"]);
const LATEST_EVIDENCE_REVIEW_KEYS = new Set([
  "date",
  "title",
  "triggerUnderReview",
  "evidenceEarningCredit",
  "evidenceLimitingCredit",
  "stillUnproven",
  "scorecardRead",
  "outcome",
  "nextCheck",
  "caveat",
  "pagesChecked",
]);
const LATEST_EVIDENCE_ITEM_KEYS = new Set([
  "text",
  "sourceLabel",
  "sourceUrl",
  "sourceDate",
  "sourceRole",
]);
const LATEST_EVIDENCE_PAGE_KEYS = new Set(["label", "url", "checkedAt", "role"]);
// Exactly the headline-commitment extension keys allowed on a promise (the
// promise's own base keys — text/status/since/evidence/source fields/durability/
// history — are validated/handled elsewhere).
const HEADLINE_KEYS = new Set([
  "targetNumeric", "targetOperator", "unit", "targetPeriod", "actualMetricId", "comparabilityNote",
]);
// Single source of truth for pocketbook dimension names: src/constants.js
// POCKETBOOK_DIMS. The validator imports directly so the validator and the
// live GPA calculation cannot drift apart. Closes the drift risk Comet
// Round 2 flagged in section 6.
const POCKETBOOK_NAMES = new Set(POCKETBOOK_DIMS);

// verdictLine guards: the one-liner is explicitly authored, never synthesized,
// so it must not smuggle in a grade token or urgency/freshness wording.
// Same list style as scripts/validate-status.mjs FORBIDDEN_URGENCY_WORDS, but
// matched on word boundaries: a plain includes() would false-positive "live"
// inside ordinary words like "delivered".
// Grade-token note: a trailing \b after [+\-] would require a word char after
// the sign, missing the real case ("held its A- footing") while flagging
// hyphenated words ("E-mail"). (?!\w) catches the standalone token instead.
// The third pattern catches BARE letter grades in grading phrases ("held at C",
// "moved to D."): the letter must be uppercase (so "at a glance" passes) and
// not followed by a word char or hyphen (so "C-5" and "to Act" pass).
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
    pattern: new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i"),
  }),
);

const errors = [];
const warnings = [];

function err(dimName, msg) {
  errors.push(`✗ ${dimName}: ${msg}`);
}
function warn(dimName, msg) {
  warnings.push(`! ${dimName}: ${msg}`);
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function rejectUnknownKeys(dimName, path, value, allowedKeys) {
  for (const key of Object.keys(value)) {
    if (!allowedKeys.has(key)) err(dimName, `${path} has unexpected key "${key}"`);
  }
}

function warnMissingFields(dimName, path, item, fields) {
  for (const field of fields) {
    if (!hasText(item?.[field])) {
      warn(dimName, `${path} is missing "${field}"`);
    }
  }
}

function validDateString(value) {
  if (typeof value !== "string") return false;
  const month = value.match(/^(\d{4})-(\d{2})$/);
  if (month) {
    const y = Number(month[1]);
    const m = Number(month[2]);
    return y >= 1900 && m >= 1 && m <= 12;
  }
  const day = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!day) return false;
  const y = Number(day[1]);
  const m = Number(day[2]);
  const d = Number(day[3]);
  const parsed = new Date(Date.UTC(y, m - 1, d));
  return y >= 1900
    && parsed.getUTCFullYear() === y
    && parsed.getUTCMonth() === m - 1
    && parsed.getUTCDate() === d;
}

function validFullDateString(value) {
  return typeof value === "string"
    && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && validDateString(value);
}

function validHttpUrl(value) {
  if (!hasText(value)) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function canonicalUrl(value) {
  if (!hasText(value)) return null;
  try {
    const parsed = new URL(value);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
    const path = parsed.pathname.replace(/\/+$/, "");
    return `${host}${path}`.toLowerCase();
  } catch {
    return String(value)
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "")
      .replace(/[?#].*$/, "")
      .replace(/\/+$/, "")
      .toLowerCase();
  }
}

function addCanonicalUrl(set, url) {
  const canonical = canonicalUrl(url);
  if (canonical) set.add(canonical);
}

function isMethodologyLink(url) {
  const normalized = String(url || "").toLowerCase();
  return normalized.includes("/docs/") || normalized.includes("scoring-rubric");
}

// ─── Top-level shape ────────────────────────────────────────────────────────

if (!Array.isArray(dimensions)) {
  console.error("FATAL: dimensions.json is not an array");
  process.exit(1);
}

const totalCount = dimensions.length;
const trackerCount = dimensions.filter((d) => d.excludeFromGPA).length;
const gradedCount = totalCount - trackerCount;
const canonicalUrlsByDimension = new Map();
const dimensionsById = new Map();
const latestGradeMoveDateByDimension = new Map();

for (const entry of changelog) {
  if (!validFullDateString(entry?.date)) continue;
  for (const item of entry.items || []) {
    if (item?.type !== "grade" || !hasText(item.dimensionId)) continue;
    const current = latestGradeMoveDateByDimension.get(item.dimensionId);
    if (!current || entry.date > current) {
      latestGradeMoveDateByDimension.set(item.dimensionId, entry.date);
    }
  }
}

if (totalCount !== 12) err("[root]", `expected 12 dimensions, found ${totalCount}`);
if (gradedCount !== 11) err("[root]", `expected 11 graded dimensions, found ${gradedCount}`);
if (trackerCount !== 1) err("[root]", `expected exactly 1 tracker, found ${trackerCount}`);

// Pocketbook dim presence check
const dimNames = new Set(dimensions.map((d) => d.name));
for (const pb of POCKETBOOK_NAMES) {
  if (!dimNames.has(pb)) err("[root]", `POCKETBOOK_DIM "${pb}" not present in dimensions.json`);
}

for (const d of dimensions) {
  if (d.excludeFromGPA && POCKETBOOK_NAMES.has(d.name)) {
    err("[root]", `POCKETBOOK_DIM "${d.name}" is marked excludeFromGPA`);
  }
}

// ─── Per-dimension shape ────────────────────────────────────────────────────

for (const d of dimensions) {
  const name = d.name || "[unnamed]";
  const isTracker = !!d.excludeFromGPA;
  const latestGradeMoveDate = latestGradeMoveDateByDimension.get(d.id) || null;
  if (hasText(d.id)) {
    if (dimensionsById.has(d.id)) err(name, `duplicate dimension id "${d.id}"`);
    dimensionsById.set(d.id, d);
  }

  // Required-on-every-dim fields
  for (const field of ["id", "name", "whatThisGrades", "scoring", "gradeTriggers", "sources", "lastUpdated"]) {
    if (!d[field]) err(name, `missing required field "${field}"`);
  }

  // Graded-dim required fields
  if (!isTracker) {
    if (!d.grade) err(name, `graded dimension is missing "grade"`);
    else if (!VALID_GRADES.has(d.grade)) err(name, `invalid grade "${d.grade}"`);

    if (!d.judgmentCall || !d.judgmentCall.trim()) {
      err(name, `graded dimension is missing "judgmentCall"`);
    }
    if (!d.judgmentDetail || !d.judgmentDetail.trim()) {
      err(name, `graded dimension is missing "judgmentDetail"`);
    }
    if (d.trend && !VALID_TRENDS.has(d.trend)) {
      err(name, `invalid trend "${d.trend}" — must be up|stable|down`);
    }
    if (d.informationalGrade) {
      err(name, `graded dimension should not have "informationalGrade" — use "grade"`);
    }

    // Optional authored verdict one-liner (graded dims only)
    if (d.verdictLine !== undefined) {
      if (!hasText(d.verdictLine)) {
        err(name, `"verdictLine" is present but not a non-empty string`);
      } else {
        if (d.verdictLine.length > 110) {
          err(name, `"verdictLine" is ${d.verdictLine.length} chars — must be 110 or fewer`);
        }
        for (const pattern of VERDICT_GRADE_TOKEN_PATTERNS) {
          if (pattern.test(d.verdictLine)) {
            err(name, `"verdictLine" contains a grade token (matched ${pattern}) — verdict copy must not name grades`);
          }
        }
        for (const { word, pattern } of VERDICT_FORBIDDEN_URGENCY_PATTERNS) {
          if (pattern.test(d.verdictLine)) {
            err(name, `"verdictLine" contains forbidden urgency/freshness wording "${word}"`);
          }
        }
      }
    }
  }

  // Tracker required fields
  if (isTracker) {
    if (!d.informationalGrade) {
      err(name, `tracker is missing "informationalGrade"`);
    }
    if (d.grade) {
      err(name, `tracker should not have "grade" field — use "informationalGrade"`);
    }
    if (d.verdictLine !== undefined) {
      err(name, `tracker must not have "verdictLine" — verdict one-liners are for graded dimensions only`);
    }
  }

  // Optional latest-cycle outcome for collapsed graded cards. This records the
  // review decision only and does not alter thresholds or scoring.
  if (d.latestReview !== undefined) {
    const review = d.latestReview;
    if (isTracker) {
      err(name, `tracker must not have "latestReview"`);
    }
    if (!isPlainObject(review)) {
      err(name, `latestReview must be a plain object`);
    } else {
      rejectUnknownKeys(name, "latestReview", review, LATEST_REVIEW_KEYS);

      if (!validFullDateString(review.date)) {
        err(name, `latestReview.date must be a valid YYYY-MM-DD date`);
      } else if (validFullDateString(meta.lastUpdated) && review.date > meta.lastUpdated) {
        err(name, `latestReview.date (${review.date}) must not be later than meta.lastUpdated (${meta.lastUpdated})`);
      } else if (validFullDateString(d.lastUpdated) && review.date < d.lastUpdated) {
        err(name, `latestReview.date (${review.date}) must not predate lastUpdated (${d.lastUpdated})`);
      } else if (latestGradeMoveDate && review.date <= latestGradeMoveDate) {
        err(name, `latestReview.date (${review.date}) must be later than the latest grade move (${latestGradeMoveDate})`);
      }

      if (typeof review.outcome !== "string" || review.outcome !== "held") {
        err(name, `latestReview.outcome must be exactly "held"`);
      }

      if (!hasText(review.summary)) {
        err(name, `latestReview.summary must be a non-empty string`);
      } else {
        if (review.summary.length > 180) {
          err(name, `latestReview.summary is ${review.summary.length} chars — must be 180 or fewer`);
        }
        for (const pattern of VERDICT_GRADE_TOKEN_PATTERNS) {
          if (pattern.test(review.summary)) {
            err(name, `latestReview.summary contains a grade token (matched ${pattern}) — review copy must not name grades`);
          }
        }
        for (const { word, pattern } of VERDICT_FORBIDDEN_URGENCY_PATTERNS) {
          if (pattern.test(review.summary)) {
            err(name, `latestReview.summary contains forbidden urgency/freshness wording "${word}"`);
          }
        }
      }
    }
  }

  if (!isTracker && d.latestReview === undefined && !latestGradeMoveDate) {
    err(name, `graded dimension needs either latestReview or a dated grade-move record`);
  }

  // Optional dated evidence-review brief for graded dimensions. This is a
  // presentation record only: it does not alter thresholds or scoring.
  if (d.latestEvidenceReview !== undefined) {
    const review = d.latestEvidenceReview;
    if (isTracker) {
      err(name, `tracker must not have "latestEvidenceReview"`);
    }
    if (!isPlainObject(review)) {
      err(name, `latestEvidenceReview must be a plain object`);
    } else {
      rejectUnknownKeys(name, "latestEvidenceReview", review, LATEST_EVIDENCE_REVIEW_KEYS);

      for (const field of [
        "title",
        "triggerUnderReview",
        "scorecardRead",
        "outcome",
        "nextCheck",
        "caveat",
      ]) {
        if (!hasText(review[field])) {
          err(name, `latestEvidenceReview.${field} must be a non-empty string`);
        }
      }
      if (!validFullDateString(review.date)) {
        err(name, `latestEvidenceReview.date must be a valid YYYY-MM-DD date`);
      }

      for (const field of ["evidenceEarningCredit", "evidenceLimitingCredit"]) {
        const evidence = review[field];
        if (!Array.isArray(evidence) || evidence.length < 1) {
          err(name, `latestEvidenceReview.${field} must contain at least 1 item`);
          continue;
        }
        evidence.forEach((item, i) => {
          const path = `latestEvidenceReview.${field}[${i}]`;
          if (!isPlainObject(item)) {
            err(name, `${path} must be a plain object`);
            return;
          }
          rejectUnknownKeys(name, path, item, LATEST_EVIDENCE_ITEM_KEYS);
          for (const itemField of ["text", "sourceLabel", "sourceRole"]) {
            if (!hasText(item[itemField])) {
              err(name, `${path}.${itemField} must be a non-empty string`);
            }
          }
          if (!validHttpUrl(item.sourceUrl)) {
            err(name, `${path}.sourceUrl must be a valid http(s) URL`);
          }
          if (!validFullDateString(item.sourceDate)) {
            err(name, `${path}.sourceDate must be a valid YYYY-MM-DD date`);
          }
        });
      }

      if (!Array.isArray(review.stillUnproven) || review.stillUnproven.length < 1) {
        err(name, `latestEvidenceReview.stillUnproven must contain at least 1 item`);
      } else {
        review.stillUnproven.forEach((item, i) => {
          if (!hasText(item)) {
            err(name, `latestEvidenceReview.stillUnproven[${i}] must be a non-empty string`);
          }
        });
      }

      if (!Array.isArray(review.pagesChecked) || review.pagesChecked.length < 1) {
        err(name, `latestEvidenceReview.pagesChecked must contain at least 1 page`);
      } else {
        review.pagesChecked.forEach((page, i) => {
          const path = `latestEvidenceReview.pagesChecked[${i}]`;
          if (!isPlainObject(page)) {
            err(name, `${path} must be a plain object`);
            return;
          }
          rejectUnknownKeys(name, path, page, LATEST_EVIDENCE_PAGE_KEYS);
          for (const field of ["label", "role"]) {
            if (!hasText(page[field])) err(name, `${path}.${field} must be a non-empty string`);
          }
          if (!validHttpUrl(page.url)) {
            err(name, `${path}.url must be a valid http(s) URL`);
          }
          if (!validFullDateString(page.checkedAt)) {
            err(name, `${path}.checkedAt must be a valid YYYY-MM-DD date`);
          }
        });
      }
    }
  }

  // ─── Trigger shape ────────────────────────────────────────────────────────
  const triggers = d.gradeTriggers || {};
  if (triggers.presentation !== undefined) {
    if (!triggers.presentation || typeof triggers.presentation !== "object" || Array.isArray(triggers.presentation)) {
      err(name, "gradeTriggers.presentation must be an object when present");
    } else {
      for (const field of ["title", "summary", "upLabel", "downLabel"]) {
        if (!hasText(triggers.presentation[field])) {
          err(name, `gradeTriggers.presentation.${field} must be a non-empty string`);
        }
      }
    }
  }
  for (const side of ["up", "down"]) {
    const arr = triggers[side];
    if (!Array.isArray(arr)) {
      err(name, `gradeTriggers.${side} is missing or not an array`);
      continue;
    }
    if (arr.length === 0) {
      warn(name, `gradeTriggers.${side} is empty`);
    }
    arr.forEach((t, i) => {
      if (typeof t === "string") {
        err(name, `gradeTriggers.${side}[${i}] is a raw string — must be a structured object`);
        return;
      }
      if (!t || typeof t !== "object") {
        err(name, `gradeTriggers.${side}[${i}] is not an object`);
        return;
      }
      if (!t.text || !t.text.trim()) {
        err(name, `gradeTriggers.${side}[${i}] is missing "text"`);
      }
      if (!t.sourceLabel || !t.sourceLabel.trim()) {
        err(name, `gradeTriggers.${side}[${i}] is missing "sourceLabel"`);
      }
      if (!t.setDate || !/^\d{4}-\d{2}-\d{2}$/.test(t.setDate)) {
        err(name, `gradeTriggers.${side}[${i}] is missing a valid "setDate" (YYYY-MM-DD)`);
      }
      // Either sourceUrl, internalRef, or sourceLabel must indicate event-driven
      const hasUrl = typeof t.sourceUrl === "string" && t.sourceUrl.startsWith("http");
      const hasInternalRef = t.internalRef && typeof t.internalRef === "object";
      const isEventDriven = (t.sourceLabel || "").toLowerCase().includes("event-driven")
        || (t.sourceLabel || "").toLowerCase().includes("(see source list)");
      if (!hasUrl && !hasInternalRef && !isEventDriven) {
        warn(name, `gradeTriggers.${side}[${i}] "${(t.text || "").slice(0, 60)}" has no sourceUrl, internalRef, or event-driven label`);
      }
      if (hasInternalRef) {
        const ref = t.internalRef;
        if (!ref.type) err(name, `gradeTriggers.${side}[${i}].internalRef is missing "type"`);
        const validTypes = new Set(["cohort", "anchor", "view"]);
        if (ref.type && !validTypes.has(ref.type)) {
          err(name, `gradeTriggers.${side}[${i}].internalRef.type "${ref.type}" is not one of cohort|anchor|view`);
        }
      }
      if (t.additionalSources !== undefined) {
        if (!Array.isArray(t.additionalSources)) {
          warn(name, `gradeTriggers.${side}[${i}].additionalSources is present but not an array`);
        } else {
          t.additionalSources.forEach((additionalSource, j) => {
            if (!additionalSource || typeof additionalSource !== "object") {
              warn(name, `gradeTriggers.${side}[${i}].additionalSources[${j}] is not an object`);
              return;
            }
            warnMissingFields(
              name,
              `gradeTriggers.${side}[${i}].additionalSources[${j}]`,
              additionalSource,
              ["label", "url", "role"],
            );
          });
        }
      }
    });
  }

  // Mixed-construct dimensions expose whole-letter sub-scores and derive the
  // headline through the same frozen grade-point conversion as the dashboard.
  if (d.subScores !== undefined) {
    if (isTracker) {
      err(name, "tracker must not carry subScores");
    } else if (!d.subScores || typeof d.subScores !== "object" || Array.isArray(d.subScores)) {
      err(name, "subScores must be an object");
    } else {
      const entries = Object.entries(d.subScores);
      if (entries.length < 2) err(name, "subScores must contain at least two scored parts");

      let pointTotal = 0;
      for (const [key, subScore] of entries) {
        const where = `subScores.${key}`;
        if (!subScore || typeof subScore !== "object" || Array.isArray(subScore)) {
          err(name, `${where} must be an object`);
          continue;
        }
        for (const field of ["label", "rationale"]) {
          if (!hasText(subScore[field])) err(name, `${where}.${field} must be a non-empty string`);
        }
        if (!WHOLE_LETTER_GRADES.has(subScore.grade)) {
          err(name, `${where}.grade must be one of A|B|C|D|F`);
        } else {
          pointTotal += GRADES[subScore.grade].gpa;
        }

        if (!Array.isArray(subScore.thresholds)) {
          err(name, `${where}.thresholds must be an array`);
        } else {
          const thresholdGrades = new Set();
          subScore.thresholds.forEach((threshold, i) => {
            if (!threshold || typeof threshold !== "object") {
              err(name, `${where}.thresholds[${i}] must be an object`);
              return;
            }
            if (!WHOLE_LETTER_GRADES.has(threshold.grade)) {
              err(name, `${where}.thresholds[${i}].grade must be one of A|B|C|D|F`);
            } else if (thresholdGrades.has(threshold.grade)) {
              err(name, `${where}.thresholds repeats grade ${threshold.grade}`);
            } else {
              thresholdGrades.add(threshold.grade);
            }
            if (!hasText(threshold.criteria)) {
              err(name, `${where}.thresholds[${i}].criteria must be a non-empty string`);
            }
          });
          for (const grade of WHOLE_LETTER_GRADES) {
            if (!thresholdGrades.has(grade)) err(name, `${where}.thresholds is missing ${grade}`);
          }
        }
      }

      const rule = d.scoring?.subScoreRule;
      if (!rule || typeof rule !== "object" || Array.isArray(rule)) {
        err(name, "scoring.subScoreRule must be an object when subScores are present");
      } else {
        for (const field of ["evaluationOrder", "combination", "currentCalculation"]) {
          if (!hasText(rule[field])) err(name, `scoring.subScoreRule.${field} must be a non-empty string`);
        }
      }

      if (entries.length > 0 && entries.every(([, subScore]) => WHOLE_LETTER_GRADES.has(subScore?.grade))) {
        const average = pointTotal / entries.length;
        const expectedHeadline = gpaToGrade(average);
        if (d.grade !== expectedHeadline) {
          err(name, `headline ${d.grade} does not match equal sub-score average ${average.toFixed(2)} (${expectedHeadline})`);
        }
      }
    }
  }

  // ─── Metric source-ref shape ──────────────────────────────────────────────
  let leadMetricCount = 0;
  if (d.metrics !== undefined) {
    if (!Array.isArray(d.metrics)) {
      warn(name, `"metrics" is present but not an array`);
    } else {
      d.metrics.forEach((m, i) => {
        const hasLead = m !== null
          && typeof m === "object"
          && Object.prototype.hasOwnProperty.call(m, "lead");
        if (hasLead) {
          if (typeof m.lead !== "boolean") {
            err(name, `metrics[${i}].lead is present but not a boolean`);
          }
          if (isTracker) {
            err(name, `tracker metrics[${i}] must not carry "lead"`);
          } else if (m.lead === true) {
            leadMetricCount += 1;
          }
        }

        if (m?.sourceRefs !== undefined) {
          if (!Array.isArray(m.sourceRefs)) {
            warn(name, `metrics[${i}].sourceRefs is present but not an array`);
          } else {
            m.sourceRefs.forEach((sourceRef, j) => {
              if (!sourceRef || typeof sourceRef !== "object") {
                warn(name, `metrics[${i}].sourceRefs[${j}] is not an object`);
                return;
              }
              warnMissingFields(name, `metrics[${i}].sourceRefs[${j}]`, sourceRef, ["label", "url"]);
            });
          }
        }
      });
    }
  }
  if (!isTracker && (leadMetricCount < 2 || leadMetricCount > 4)) {
    err(name, `graded dimension must have 2-4 metrics with lead=true; found ${leadMetricCount}`);
  }

  // ─── Promise + headline-commitment shape ──────────────────────────────────
  // The headline commitment (display-only) reuses an existing durability:"Target"
  // promise for the TARGET and references an existing metric for the ACTUAL. The
  // displayed comparison is derived by src/dimensionTargets.js (imported above) so
  // it cannot drift from what the UI renders. Nothing here touches scoring.
  if (d.promises !== undefined) {
    if (!Array.isArray(d.promises)) {
      warn(name, `"promises" is present but not an array`);
    } else {
      let headlineCount = 0;
      d.promises.forEach((p, i) => {
        if (!p || typeof p !== "object") {
          warn(name, `promises[${i}] is not an object`);
          return;
        }
        // General promise-source URL hygiene (previously unvalidated).
        for (const f of ["originalSourceUrl", "statusSourceUrl"]) {
          if (p[f] !== undefined && !(typeof p[f] === "string" && p[f].startsWith("http"))) {
            err(name, `promises[${i}].${f} is present but not an http(s) URL`);
          }
        }
        if (p.headlineCommitment === undefined) return;
        headlineCount += 1;
        const hc = p.headlineCommitment;
        const where = `promises[${i}].headlineCommitment`;
        if (!hc || typeof hc !== "object" || Array.isArray(hc)) {
          err(name, `${where} must be a plain object`);
          return;
        }
        if (isTracker) {
          err(name, `${where} is not allowed on a tracker (excludeFromGPA) dimension`);
        }
        if (p.durability !== "Target") {
          err(name, `${where} requires the promise durability to be exactly "Target" (found ${JSON.stringify(p.durability)})`);
        }
        for (const k of Object.keys(hc)) {
          if (!HEADLINE_KEYS.has(k)) err(name, `${where} has unexpected key "${k}"`);
        }
        if (typeof hc.targetNumeric !== "number" || !Number.isFinite(hc.targetNumeric)) {
          err(name, `${where}.targetNumeric must be a finite number`);
        }
        if (!TARGET_OPERATOR_SET.has(hc.targetOperator)) {
          err(name, `${where}.targetOperator must be one of ${TARGET_OPERATORS.join(" ")}`);
        }
        for (const f of ["unit", "targetPeriod", "comparabilityNote"]) {
          if (!hasText(hc[f])) err(name, `${where}.${f} must be a non-empty string`);
        }
        if (!(typeof p.originalSourceUrl === "string" && p.originalSourceUrl.startsWith("http"))) {
          err(name, `${where} requires the promise to have an http(s) originalSourceUrl (target source)`);
        }
        if (!hasText(hc.actualMetricId)) {
          err(name, `${where}.actualMetricId must be a non-empty string`);
        } else {
          const refs = (Array.isArray(d.metrics) ? d.metrics : []).filter((m) => m && m.id === hc.actualMetricId);
          if (refs.length !== 1) {
            err(name, `${where}.actualMetricId "${hc.actualMetricId}" must resolve to exactly one metric (found ${refs.length})`);
          } else {
            const metric = refs[0];
            const metricHasNumeric = typeof metric.numericValue === "number" && Number.isFinite(metric.numericValue);
            const metricHasPrecision = Number.isInteger(metric.precision) && metric.precision >= 0 && metric.precision <= 6;
            if (!metricHasNumeric) err(name, `metric "${hc.actualMetricId}".numericValue must be a finite number`);
            if (!metricHasPrecision) err(name, `metric "${hc.actualMetricId}".precision must be an integer 0-6`);
            if (metric.unit !== hc.unit) {
              err(name, `metric "${hc.actualMetricId}".unit ${JSON.stringify(metric.unit)} must equal the target unit ${JSON.stringify(hc.unit)}`);
            }
            if (!hasText(metric.actualPeriod)) {
              err(name, `metric "${hc.actualMetricId}".actualPeriod must be a non-empty string`);
            }
            if (metric.actualQualifier !== undefined && !hasText(metric.actualQualifier)) {
              err(name, `metric "${hc.actualMetricId}".actualQualifier is present but not a non-empty string`);
            }
            if (metricHasNumeric && metricHasPrecision && typeof metric.unit === "string") {
              const canonical = formatValue(metric.numericValue, metric.unit, metric.precision);
              if (metric.value !== canonical) {
                err(name, `metric "${hc.actualMetricId}".value ${JSON.stringify(metric.value)} must equal formatValue() ${JSON.stringify(canonical)}`);
              }
            }
            const primaries = (Array.isArray(metric.sourceRefs) ? metric.sourceRefs : []).filter((r) => r && r.primary === true);
            if (primaries.length !== 1) {
              err(name, `metric "${hc.actualMetricId}" must have exactly one sourceRefs entry with primary:true (found ${primaries.length})`);
            } else {
              const pr = primaries[0];
              if (!hasText(pr.label)) err(name, `metric "${hc.actualMetricId}" primary sourceRef is missing a label`);
              if (!(typeof pr.url === "string" && pr.url.startsWith("http"))) {
                err(name, `metric "${hc.actualMetricId}" primary sourceRef.url is not an http(s) URL`);
              }
            }
            if (metricHasNumeric && metricHasPrecision && typeof hc.targetNumeric === "number" && TARGET_OPERATOR_SET.has(hc.targetOperator)) {
              try {
                const relation = deriveRelation(metric.numericValue, hc.targetNumeric, hc.targetOperator, metric.precision);
                if (!RELATIONS.includes(relation)) {
                  err(name, `${where} derived relation "${relation}" is not a known relation`);
                }
              } catch (e) {
                err(name, `${where} relation could not be derived: ${e.message}`);
              }
            }
          }
        }
      });
      if (headlineCount > 1) {
        err(name, `dimension has ${headlineCount} promises with headlineCommitment; at most 1 is allowed`);
      }
    }
  }

  // ─── Optional grade-basis operationalization shape ───────────────────────
  const gradeBasis = d.gradeBasis || {};

  // Optional authored band-boundary explainers (whyNotHigher / whyNotLower).
  // Same authored-copy contract as verdictLine: explicitly written, never
  // synthesized, so the same grade-token and urgency guards apply. Allowed
  // only on graded dimensions; capped at 200 chars each.
  // They live UNDER gradeBasis only. Top-level copies existed briefly (an
  // early unvalidated pilot) and caused a duplicate render; forbid the
  // retired location so the drift cannot come back.
  for (const field of ["whyNotHigher", "whyNotLower"]) {
    if (d[field] !== undefined) {
      err(name, `top-level "${field}" is retired — move it under gradeBasis.${field}`);
    }
  }
  for (const field of ["whyNotHigher", "whyNotLower"]) {
    const value = gradeBasis[field];
    if (value === undefined) continue;
    if (isTracker) {
      err(name, `tracker must not have gradeBasis.${field} — band explainers are for graded dimensions only`);
      continue;
    }
    if (!hasText(value)) {
      err(name, `gradeBasis.${field} is present but not a non-empty string`);
      continue;
    }
    if (value.length > 200) {
      err(name, `gradeBasis.${field} is ${value.length} chars — must be 200 or fewer`);
    }
    for (const pattern of VERDICT_GRADE_TOKEN_PATTERNS) {
      if (pattern.test(value)) {
        err(name, `gradeBasis.${field} contains a grade token (matched ${pattern}) — band explainer copy must not name grades`);
      }
    }
    for (const { word, pattern } of VERDICT_FORBIDDEN_URGENCY_PATTERNS) {
      if (pattern.test(value)) {
        err(name, `gradeBasis.${field} contains forbidden urgency/freshness wording "${word}"`);
      }
    }
  }

  if (gradeBasis.leverOperationalization !== undefined) {
    if (!Array.isArray(gradeBasis.leverOperationalization)) {
      warn(name, `gradeBasis.leverOperationalization is present but not an array`);
    } else {
      gradeBasis.leverOperationalization.forEach((lever, i) => {
        if (!lever || typeof lever !== "object") {
          warn(name, `gradeBasis.leverOperationalization[${i}] is not an object`);
          return;
        }
        warnMissingFields(
          name,
          `gradeBasis.leverOperationalization[${i}]`,
          lever,
          ["name", "announced", "authorized", "executing", "currentStatus"],
        );
      });
    }
  }

  if (gradeBasis.componentOperationalization !== undefined) {
    if (!Array.isArray(gradeBasis.componentOperationalization)) {
      warn(name, `gradeBasis.componentOperationalization is present but not an array`);
    } else {
      gradeBasis.componentOperationalization.forEach((component, i) => {
        if (!component || typeof component !== "object") {
          warn(name, `gradeBasis.componentOperationalization[${i}] is not an object`);
          return;
        }
        warnMissingFields(
          name,
          `gradeBasis.componentOperationalization[${i}]`,
          component,
          ["name", "presentIfX", "currentStatus"],
        );
      });
    }
  }

  if (gradeBasis.combinationRule !== undefined) {
    const rule = gradeBasis.combinationRule;
    if (!rule || typeof rule !== "object" || Array.isArray(rule)) {
      warn(name, `gradeBasis.combinationRule is present but not an object`);
    } else {
      const arrayFields = ["flagshipFiles", "fileStatusCategories", "distributionToGrade", "currentSnapshot"];
      for (const field of arrayFields) {
        if (!Array.isArray(rule[field])) {
          warn(name, `gradeBasis.combinationRule.${field} is missing or not an array`);
        }
      }
      warnMissingFields(
        name,
        "gradeBasis.combinationRule",
        rule,
        ["currentDistribution", "currentGradeFromRule"],
      );
    }
  }

  // ─── Source shape ─────────────────────────────────────────────────────────
  const sources = d.sources || [];
  const canonicalUrls = new Set();
  if (sources.length < 3) {
    err(name, `source count ${sources.length} is below floor of 3`);
  }
  if (sources.length < 5 || sources.length > 10) {
    warn(name, `source count ${sources.length} is outside the 5-10 band (floor 5, ceiling 10)`);
  }
  sources.forEach((s, i) => {
    if (!s.label) err(name, `sources[${i}] is missing "label"`);
    if (!s.url) err(name, `sources[${i}] is missing "url"`);
    else if (!s.url.startsWith("http")) {
      err(name, `sources[${i}].url is not a valid http(s) URL`);
    } else {
      addCanonicalUrl(canonicalUrls, s.url);
    }

    const needsManualDate = s.needsManualDate === true;
    if (needsManualDate) {
      if (s.date || s.dateKind) {
        err(name, `sources[${i}] has needsManualDate=true and should not also carry date/dateKind`);
      }
    } else {
      if (!s.date) {
        err(name, `sources[${i}] is missing "date" or needsManualDate=true`);
      }
      if (!s.dateKind) {
        err(name, `sources[${i}] is missing "dateKind" or needsManualDate=true`);
      }
    }
    if (s.date && !validDateString(s.date)) {
      err(name, `sources[${i}].date "${s.date}" is not a valid YYYY-MM or YYYY-MM-DD date`);
    }
    if (s.dateKind && !VALID_SOURCE_DATE_KINDS.has(s.dateKind)) {
      err(name, `sources[${i}].dateKind "${s.dateKind}" must be published|updated|as-of`);
    }
  });

  // Project cohort integrity. `stageDate` is the date the project actually
  // reached its current stage, which may legitimately predate MPO referral.
  // A project sitting at `designated` is dated at referral by definition, so
  // that equality is fine. Any HIGHER stage dated exactly at referral is the
  // signature of a data-entry default rather than a sourced date, and it
  // silently misreports an inherited approval as MPO-era progress. The August
  // 2026 cycle introduced five such rows at once while re-sourcing to the new
  // Major Projects Office pages, so this is checked rather than trusted.
  if (Array.isArray(d.projectCohort?.projects)) {
    d.projectCohort.projects.forEach((project, i) => {
      const where = `projectCohort.projects[${i}] (${project?.id || project?.name || "unnamed"})`;
      if (!project?.id) {
        err(name, `${where} is missing a stable "id"`);
      }
      if (project?.stageDate && !validDateString(project.stageDate)) {
        err(name, `${where}.stageDate "${project.stageDate}" is not a valid date`);
      }
      // Equality is suspicious, not automatically wrong. A project can genuinely
      // reach a stage on the day it is referred. The invariant that matters is
      // that no advancement credit is taken on an unevidenced same-day date, so
      // the row may carry the equality if it states the sequence explicitly in
      // its note. Without that note the equality reads as a data-entry default,
      // which is how five inherited approvals were once shown as office-era
      // progress.
      if (
        project?.stage
        && project.stage !== "designated"
        && project.stageDate
        && project.stageDate === project.referredDate
        && !project.note
      ) {
        err(
          name,
          `${where} has stage "${project.stage}" dated exactly at referredDate `
          + `(${project.referredDate}) with no note. Record the date the stage was `
          + `actually reached, from a source. If the stage genuinely was reached on `
          + `the referral date, add a note stating the evidence for that sequence.`,
        );
      }
    });
    // Prose that restates a cohort count must agree with the cohort. Two earlier
    // attempts failed in opposite directions. Checking a hand-picked list of
    // fields missed four stale claims. Flagging any number near cohort words
    // produced false positives on rule text ("at least one project"), durations
    // ("four months before referral"), a promise name ("One Project, One
    // Review") and unrelated counts ("seven provincial agreements"). So this
    // matches the specific SHAPES a cohort claim takes, and nothing else. If a
    // new phrasing appears that these do not cover, add its shape here rather
    // than loosening the match.
    const cohortProjects = d.projectCohort.projects;
    const advanced = cohortProjects.filter(
      (p) => p?.stageDate && p?.referredDate && p.stageDate > p.referredDate,
    ).length;
    const aboveDesignated = cohortProjects.filter((p) => p?.stage && p.stage !== "designated").length;
    const cohortTotal = cohortProjects.length;
    const WORDS = {
      one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
      ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
      sixteen: 16, seventeen: 17, eighteen: 18,
    };
    const NUM = "(" + Object.keys(WORDS).join("|") + "|\\d{1,2})";
    const CLAIM_SHAPES = [
      // "Five of 18, about 28%" / "four of 18"
      { re: new RegExp(NUM + "\\s+of\\s+" + cohortTotal + "\\b", "gi"), expect: () => advanced, what: "projects with post-referral advancement" },
      // "five show documented progress after referral"
      { re: new RegExp(NUM + "\\s+shows?\\s+(?:documented\\s+)?(?:post-referral\\s+)?(?:progress|advancement)", "gi"), expect: () => advanced, what: "projects with post-referral advancement" },
      // "Ten carry a stage above designated" / "Ten are above the first stage"
      { re: new RegExp(NUM + "\\s+(?:carry|carries|are)\\b[^.]{0,40}?\\babove\\b", "gi"), expect: () => aboveDesignated, what: "projects above designated" },
    ];
    const walkStrings = (node, path, out) => {
      if (typeof node === "string") {
        if (node.length > 25 && !/^https?:\/\//.test(node)) out.push([path, node]);
        return;
      }
      if (Array.isArray(node)) {
        node.forEach((v, i) => walkStrings(v, `${path}[${i}]`, out));
        return;
      }
      if (node && typeof node === "object") {
        for (const [k, v] of Object.entries(node)) {
          // Cohort rows are the source of truth. scoring, gradeTriggers and
          // stageGates define the rules rather than report current state.
          if (
            k === "projectCohort" || k === "sourceUrl" || k === "url"
            || k === "scoring" || k === "gradeTriggers" || k === "stageGates"
          ) continue;
          walkStrings(v, path ? `${path}.${k}` : k, out);
        }
      }
    };
    const strings = [];
    walkStrings(d, "", strings);
    for (const [path, text] of strings) {
      for (const shape of CLAIM_SHAPES) {
        shape.re.lastIndex = 0;
        for (const m of text.matchAll(shape.re)) {
          const raw = m[1].toLowerCase();
          const value = /^\d+$/.test(raw) ? Number(raw) : WORDS[raw];
          if (value === undefined) continue;
          const expected = shape.expect();
          if (value !== expected) {
            const around = text.slice(Math.max(0, m.index - 35), m.index + 65).replace(/\s+/g, " ");
            err(
              name,
              `${path} states "${m[0].trim()}" but the cohort has ${expected} ${shape.what}. `
              + `Context: "...${around}...". Update the prose when the cohort changes.`,
            );
          }
        }
      }
    }

    const ids = d.projectCohort.projects.map((p) => p?.id).filter(Boolean);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    if (dupes.length) {
      err(name, `projectCohort has duplicate project ids: ${[...new Set(dupes)].join(", ")}`);
    }
  }

  if (Array.isArray(d.metrics)) {
    d.metrics.forEach((m) => {
      if (Array.isArray(m?.sourceRefs)) {
        m.sourceRefs.forEach((sourceRef) => addCanonicalUrl(canonicalUrls, sourceRef?.url));
      }
    });
  }
  for (const side of ["up", "down"]) {
    const arr = d.gradeTriggers?.[side] || [];
    arr.forEach((trigger) => {
      addCanonicalUrl(canonicalUrls, trigger?.sourceUrl);
      if (Array.isArray(trigger?.additionalSources)) {
        trigger.additionalSources.forEach((source) => addCanonicalUrl(canonicalUrls, source?.url));
      }
    });
  }
  if (isPlainObject(d.latestEvidenceReview)) {
    for (const field of ["evidenceEarningCredit", "evidenceLimitingCredit"]) {
      if (Array.isArray(d.latestEvidenceReview[field])) {
        d.latestEvidenceReview[field].forEach((item) => addCanonicalUrl(canonicalUrls, item?.sourceUrl));
      }
    }
    if (Array.isArray(d.latestEvidenceReview.pagesChecked)) {
      d.latestEvidenceReview.pagesChecked.forEach((page) => addCanonicalUrl(canonicalUrls, page?.url));
    }
  }
  canonicalUrlsByDimension.set(d.id, canonicalUrls);
}

// ─── Grade-change link and current-cycle evidence-loop shape ───────────────

const currentChangelogEntry = changelog[0];
if (!currentChangelogEntry || typeof currentChangelogEntry !== "object") {
  err("[changelog]", "entries[0] must exist");
} else {
  if (currentChangelogEntry.date !== meta.lastUpdated) {
    err("[changelog]", `entries[0].date (${currentChangelogEntry.date}) must equal meta.lastUpdated (${meta.lastUpdated})`);
  }
  if (currentChangelogEntry.version !== meta.version) {
    err("[changelog]", `entries[0].version (${currentChangelogEntry.version}) must equal meta.version (${meta.version})`);
  }
}

function validateGradeItem(item, entryIndex, itemIndex, currentCycle = false) {
  const prefix = `entries[${entryIndex}].items[${itemIndex}]`;
  if (!item.dimensionId) {
    err("[changelog]", `${prefix} grade item is missing dimensionId`);
    return;
  }

  const dim = dimensionsById.get(item.dimensionId);
  if (!dim) {
    err("[changelog]", `${prefix} references unknown dimensionId "${item.dimensionId}"`);
    return;
  }

  if (dim.excludeFromGPA) {
    err("[changelog]", `${prefix} references tracker dimension "${item.dimensionId}"`);
  }

  const href = item.link?.href;
  if (!hasText(href)) {
    err("[changelog]", `${prefix} grade item is missing link.href`);
    return;
  }

  if (!isMethodologyLink(href)) {
    const dimUrls = canonicalUrlsByDimension.get(item.dimensionId);
    const canonical = canonicalUrl(href);
    if (!canonical || !dimUrls?.has(canonical)) {
      err("[changelog]", `${prefix} grade link does not resolve to a source/metric/trigger URL for ${item.dimensionId}`);
    }
  }

  if (!currentCycle) return;

  for (const field of ["dimensionName", "from", "to", "deltaLabel", "headline", "body"]) {
    if (!hasText(item[field])) {
      err("[changelog]", `${prefix}.${field} must be a non-empty string for current-cycle grade moves`);
    }
  }

  if (item.dimensionName !== dim.name) {
    err("[changelog]", `${prefix}.dimensionName (${item.dimensionName}) must match dimension name (${dim.name})`);
  }
  if (item.from !== dim.previousGrade) {
    err("[changelog]", `${prefix}.from (${item.from}) must match dimension.previousGrade (${dim.previousGrade || "missing"})`);
  }
  if (item.to !== dim.grade) {
    err("[changelog]", `${prefix}.to (${item.to}) must match current dimension grade (${dim.grade})`);
  }
  if (item.from === item.to) {
    err("[changelog]", `${prefix} must move between two different grades`);
  }
  if (!Array.isArray(item.drivers) || item.drivers.length === 0 || item.drivers.some((driver) => !hasText(driver))) {
    err("[changelog]", `${prefix}.drivers must be a non-empty list of strings for current-cycle grade moves`);
  }
  if (!hasText(item.link?.label)) {
    err("[changelog]", `${prefix}.link.label must be a non-empty string for current-cycle grade moves`);
  }
}

changelog.forEach((entry, entryIndex) => {
  (entry.items || []).forEach((item, itemIndex) => {
    if (item?.type !== "grade") return;
    validateGradeItem(item, entryIndex, itemIndex, entryIndex === 0);
  });
});

// ─── Output ─────────────────────────────────────────────────────────────────

console.log(`Validated ${totalCount} dimensions (${gradedCount} graded, ${trackerCount} tracker)`);

if (warnings.length > 0) {
  console.log(`\n${warnings.length} warning${warnings.length === 1 ? "" : "s"}:`);
  warnings.forEach((w) => console.log("  " + w));
}

if (errors.length > 0) {
  console.error(`\n${errors.length} error${errors.length === 1 ? "" : "s"}:`);
  errors.forEach((e) => console.error("  " + e));
  console.error("\nFAILED. Fix the errors above before building.");
  process.exit(1);
}

console.log("\nOK. All shape invariants pass.");

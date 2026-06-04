// Validates the shape of src/data/dimensions.json against the invariants
// documented in CLAUDE.md. Hard-fails (exit 1) on real shape errors that
// would break the UI or scoring math. Soft-warns (logged, exit 0) on
// advisory issues like source-band drift.
//
// Wired into the prebuild step so it runs before every `npm run build`.
// Run directly with `node scripts/validate-dimensions.mjs`.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { POCKETBOOK_DIMS } from "../src/constants.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = resolve(__dirname, "../src/data/dimensions.json");
const dimensions = JSON.parse(readFileSync(dataPath, "utf-8"));

const VALID_GRADES = new Set([
  "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F",
]);
const VALID_TRENDS = new Set(["up", "stable", "down"]);
// Single source of truth for pocketbook dimension names: src/constants.js
// POCKETBOOK_DIMS. The validator imports directly so the validator and the
// live GPA calculation cannot drift apart. Closes the drift risk Comet
// Round 2 flagged in section 6.
const POCKETBOOK_NAMES = new Set(POCKETBOOK_DIMS);

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

function warnMissingFields(dimName, path, item, fields) {
  for (const field of fields) {
    if (!hasText(item?.[field])) {
      warn(dimName, `${path} is missing "${field}"`);
    }
  }
}

// ─── Top-level shape ────────────────────────────────────────────────────────

if (!Array.isArray(dimensions)) {
  console.error("FATAL: dimensions.json is not an array");
  process.exit(1);
}

const totalCount = dimensions.length;
const trackerCount = dimensions.filter((d) => d.excludeFromGPA).length;
const gradedCount = totalCount - trackerCount;

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
  }

  // Tracker required fields
  if (isTracker) {
    if (!d.informationalGrade) {
      err(name, `tracker is missing "informationalGrade"`);
    }
    if (d.grade) {
      err(name, `tracker should not have "grade" field — use "informationalGrade"`);
    }
  }

  // ─── Trigger shape ────────────────────────────────────────────────────────
  const triggers = d.gradeTriggers || {};
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

  // ─── Metric source-ref shape ──────────────────────────────────────────────
  if (d.metrics !== undefined) {
    if (!Array.isArray(d.metrics)) {
      warn(name, `"metrics" is present but not an array`);
    } else {
      d.metrics.forEach((m, i) => {
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

  // ─── Optional grade-basis operationalization shape ───────────────────────
  const gradeBasis = d.gradeBasis || {};
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
  if (sources.length < 3) {
    err(name, `source count ${sources.length} is below floor of 3`);
  }
  if (sources.length < 5 || sources.length > 10) {
    warn(name, `source count ${sources.length} is outside the 5-10 band (floor 5, ceiling 10)`);
  }
  sources.forEach((s, i) => {
    if (!s.label) err(name, `sources[${i}] is missing "label"`);
    if (!s.url) err(name, `sources[${i}] is missing "url"`);
    else if (!s.url.startsWith("http")) err(name, `sources[${i}].url is not a valid http(s) URL`);
  });
}

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

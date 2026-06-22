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
import {
  TARGET_OPERATORS,
  RELATIONS,
  formatValue,
  deriveRelation,
} from "../src/dimensionTargets.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = resolve(__dirname, "../src/data/dimensions.json");
const changelogPath = resolve(__dirname, "../src/data/changelog.json");
const dimensions = JSON.parse(readFileSync(dataPath, "utf-8"));
const changelog = JSON.parse(readFileSync(changelogPath, "utf-8"));

const VALID_GRADES = new Set([
  "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F",
]);
const VALID_TRENDS = new Set(["up", "stable", "down"]);
const VALID_SOURCE_DATE_KINDS = new Set(["published", "updated", "as-of"]);
const TARGET_OPERATOR_SET = new Set(TARGET_OPERATORS);
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
  canonicalUrlsByDimension.set(d.id, canonicalUrls);
}

// ─── Grade-change link shape ───────────────────────────────────────────────

changelog.forEach((entry, entryIndex) => {
  (entry.items || []).forEach((item, itemIndex) => {
    if (item?.type !== "grade") return;
    if (!item.dimensionId) {
      err("[changelog]", `entries[${entryIndex}].items[${itemIndex}] grade item is missing dimensionId`);
      return;
    }
    const href = item.link?.href;
    if (!hasText(href)) {
      err("[changelog]", `entries[${entryIndex}].items[${itemIndex}] grade item is missing link.href`);
      return;
    }
    if (isMethodologyLink(href)) return;
    const dimUrls = canonicalUrlsByDimension.get(item.dimensionId);
    if (!dimUrls) {
      err("[changelog]", `entries[${entryIndex}].items[${itemIndex}] references unknown dimensionId "${item.dimensionId}"`);
      return;
    }
    const canonical = canonicalUrl(href);
    if (!canonical || !dimUrls.has(canonical)) {
      err("[changelog]", `entries[${entryIndex}].items[${itemIndex}] grade link does not resolve to a source/metric/trigger URL for ${item.dimensionId}`);
    }
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

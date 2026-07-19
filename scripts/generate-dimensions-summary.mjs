import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import {
  calculateOverallGPA,
  calculatePocketbookGPA,
  countPromises,
} from "../src/utils.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dimensionsPath = path.join(repoRoot, "src", "data", "dimensions.json");
const summaryPath = path.join(repoRoot, "src", "data", "dimensions-summary.json");
const checkOnly = process.argv.includes("--check");

const SUMMARY_FIELDS = [
  "id",
  "name",
  "whatThisGrades",
  "verdictLine",
  "status",
  "nextTrigger",
  "lastUpdated",
  "trend",
  "previousGrade",
  "grade",
  "gpaValue",
  "excludeFromGPA",
  "informationalGrade",
];
const DETAIL_ONLY_FIELDS = [
  "construct",
  "gradeBasis",
  "gradeTriggers",
  "inherited",
  "judgmentCall",
  "judgmentDetail",
  "metrics",
  "perspectives",
  "projectCohort",
  "promises",
  "rationale",
  "scope",
  "scoring",
  "sources",
  "subScores",
  "surfaceTags",
  "tags",
];

function fail(message) {
  console.error(`dimensions summary: ${message}`);
  process.exit(1);
}

function projectDimension(dimension) {
  return Object.fromEntries(
    SUMMARY_FIELDS
      .filter((field) => dimension[field] !== undefined)
      .map((field) => [field, dimension[field]]),
  );
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

const dimensions = JSON.parse(fs.readFileSync(dimensionsPath, "utf8"));
if (!Array.isArray(dimensions) || dimensions.length === 0) {
  fail("canonical dimensions data must be a non-empty array");
}

const ids = new Set();
for (const dimension of dimensions) {
  if (!dimension || typeof dimension !== "object") fail("each canonical dimension must be an object");
  if (typeof dimension.id !== "string" || !dimension.id) fail("each canonical dimension must have an id");
  if (ids.has(dimension.id)) fail(`duplicate canonical dimension id: ${dimension.id}`);
  ids.add(dimension.id);
  for (const field of ["name", "whatThisGrades", "status", "nextTrigger", "lastUpdated", "trend"]) {
    if (typeof dimension[field] !== "string" || !dimension[field]) {
      fail(`${dimension.id} is missing first-paint field ${field}`);
    }
  }
  if (dimension.excludeFromGPA) {
    if (!dimension.informationalGrade) fail(`${dimension.id} tracker is missing informationalGrade`);
  } else if (!dimension.grade || !("previousGrade" in dimension)) {
    fail(`${dimension.id} graded dimension is missing grade-move fields`);
  }
}

const projectedDimensions = dimensions.map(projectDimension);
const promiseSummary = countPromises(dimensions);
const promiseCounts = Object.fromEntries(
  Object.entries(promiseSummary.counts).sort(([left], [right]) => left.localeCompare(right)),
);
const summary = {
  dimensions: projectedDimensions,
  promiseCounts,
  totalPromises: promiseSummary.total,
};

for (let index = 0; index < projectedDimensions.length; index += 1) {
  const canonical = dimensions[index];
  const projected = projectedDimensions[index];
  const unexpected = Object.keys(projected).filter((field) => !SUMMARY_FIELDS.includes(field));
  const detailFields = DETAIL_ONLY_FIELDS.filter((field) => Object.hasOwn(projected, field));
  if (unexpected.length > 0 || detailFields.length > 0) {
    fail(`${canonical.id} summary contains detail-only or unexpected fields`);
  }
  for (const field of Object.keys(projected)) {
    if (!sameJson(projected[field], canonical[field])) {
      fail(`${canonical.id}.${field} does not match canonical data`);
    }
  }
}

if (projectedDimensions.length !== dimensions.length || promiseSummary.all.length !== summary.totalPromises) {
  fail("dimension or promise totals do not match canonical data");
}
if (!sameJson(promiseCounts, Object.fromEntries(
  Object.entries(promiseSummary.counts).sort(([left], [right]) => left.localeCompare(right)),
))) {
  fail("promise status counts do not match canonical data");
}
if (calculateOverallGPA(projectedDimensions) !== calculateOverallGPA(dimensions)
  || calculatePocketbookGPA(projectedDimensions) !== calculatePocketbookGPA(dimensions)) {
  fail("GPA results do not match canonical data");
}

const output = `${JSON.stringify(summary, null, 2)}\n`;

if (checkOnly) {
  const current = fs.existsSync(summaryPath) ? fs.readFileSync(summaryPath, "utf8") : "";
  if (current !== output) {
    fail("stale - run node scripts/generate-dimensions-summary.mjs");
  }
  console.log(
    `dimensions summary: OK (${projectedDimensions.length} dimensions, ${summary.totalPromises} promises)`,
  );
  process.exit(0);
}

fs.writeFileSync(summaryPath, output);
console.log(
  `Wrote ${summaryPath} (${projectedDimensions.length} dimensions, ${summary.totalPromises} promises)`,
);

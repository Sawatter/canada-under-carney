#!/usr/bin/env node
// Validates approval-poll aggregation invariants. The Approval Signal is
// ungraded, but it is public, so the aggregate must stay inside its inputs.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { computeApprovalSignal } from "../src/approvalAggregation.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = resolve(__dirname, "../src/data/approval-polls.json");
const data = JSON.parse(readFileSync(dataPath, "utf8"));
const result = computeApprovalSignal(data);

const errors = [];
const EPSILON = 1e-9;

function err(msg) {
  errors.push(`✗ Approval Signal: ${msg}`);
}

function checkField(field, value) {
  const polls = result.recent.filter((poll) => typeof poll[field] === "number");
  if (polls.length === 0) {
    err(`no recent polls with numeric "${field}" values`);
    return;
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    err(`computed ${field} aggregate is not numeric`);
    return;
  }

  const values = polls.map((poll) => poll[field]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const displayed = Math.round(value);

  if (value < min - EPSILON || value > max + EPSILON) {
    err(
      `raw ${field} aggregate ${value.toFixed(2)} is outside input range ${min}-${max}`
    );
  }

  if (displayed < min || displayed > max) {
    err(
      `displayed ${field} aggregate ${displayed}% is outside input range ${min}-${max}`
    );
  }
}

if (!data.asOf || Number.isNaN(new Date(data.asOf).getTime())) {
  err(`asOf is missing or not a valid date`);
}

if (!Number.isFinite(data.rollingWindowDays) || data.rollingWindowDays <= 0) {
  err(`rollingWindowDays must be a positive number`);
}

if (!Array.isArray(data.polls) || data.polls.length === 0) {
  err(`polls must be a non-empty array`);
}

if (result.recent.length === 0) {
  err(`no polls fall inside the ${data.rollingWindowDays}-day window ending ${data.asOf}`);
}

checkField("approve", result.approveNow);
checkField("disapprove", result.disapproveNow);

console.log(
  `Validated Approval Signal aggregate (${result.recent.length} polls, ${result.windowDays}-day window)`
);

if (errors.length > 0) {
  console.error(`\n${errors.length} error${errors.length === 1 ? "" : "s"}:`);
  errors.forEach((e) => console.error("  " + e));
  console.error("\nFAILED. Fix approval-poll aggregation before building.");
  process.exit(1);
}

console.log("\nOK. Approval Signal invariants pass.");

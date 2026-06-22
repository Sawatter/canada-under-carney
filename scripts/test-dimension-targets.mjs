// Unit tests for the headline-commitment display helpers (src/dimensionTargets.js).
// Wired into test:data AND prebuild so a build cannot ship a drifted formatter
// or a wrong comparison. Plain asserts, no framework. Exit 1 on any failure.

import {
  TARGET_OPERATORS,
  RELATIONS,
  toleranceFor,
  formatValue,
  formatTarget,
  formatPeriod,
  deriveRelation,
} from "../src/dimensionTargets.js";

const failures = [];
function eq(actual, expected, label) {
  if (actual !== expected) {
    failures.push(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}
function throws(fn, label) {
  try {
    fn();
    failures.push(`${label}: expected a throw, got none`);
  } catch {
    /* expected */
  }
}

// ── toleranceFor ─────────────────────────────────────────────────────────────
eq(toleranceFor(2), 0.005, "toleranceFor(2)");
eq(toleranceFor(1), 0.05, "toleranceFor(1)");
eq(toleranceFor(0), 0.5, "toleranceFor(0)");

// ── formatValue (must equal the source figure exactly) ───────────────────────
eq(formatValue(2.01, "% of GDP", 2), "2.01% of GDP", "formatValue NATO actual");
eq(formatValue(2, "% of GDP", 2), "2.00% of GDP", "formatValue forces precision");
eq(formatValue(2.1, "% of GDP", 1), "2.1% of GDP", "formatValue precision 1");
eq(formatValue(500000, " homes", 0), "500000  homes", "formatValue non-% unit keeps its own spacing");

// ── formatTarget (operator-prefixed, no forced decimals) ─────────────────────
eq(formatTarget(">=", 2, "% of GDP"), "≥ 2% of GDP", "formatTarget meet");
eq(formatTarget(">", 2, "% of GDP"), "> 2% of GDP", "formatTarget exceed");
eq(formatTarget("<=", 40, "% of GDP"), "≤ 40% of GDP", "formatTarget ceiling");
eq(formatTarget("=", 100, "% target"), "100% target", "formatTarget exact has no prefix");

// ── formatPeriod ─────────────────────────────────────────────────────────────
eq(formatPeriod("2025", "estimate"), "2025 estimate", "formatPeriod with qualifier");
eq(formatPeriod("2025", ""), "2025", "formatPeriod no qualifier");
eq(formatPeriod("FY2025-26", undefined), "FY2025-26", "formatPeriod undefined qualifier");

// ── deriveRelation — floor (>=, >) ───────────────────────────────────────────
eq(deriveRelation(2.01, 2.0, ">=", 2), "Met", "floor >= reached (launch case)");
eq(deriveRelation(2.0, 2.0, ">=", 2), "Met", "floor >= exactly at target");
eq(deriveRelation(1.99, 2.0, ">=", 2), "Below target", "floor >= just under");
eq(deriveRelation(2.004, 2.0, ">=", 2), "Met", "floor >= within tolerance counts as met");
eq(deriveRelation(2.01, 2.0, ">", 2), "Met", "floor > strictly exceeds beyond tolerance");
eq(deriveRelation(2.0, 2.0, ">", 2), "Below target", "floor > exactly at target is not exceed");

// ── deriveRelation — ceiling (<=, <) ─────────────────────────────────────────
eq(deriveRelation(38, 40, "<=", 0), "Met", "ceiling <= under");
eq(deriveRelation(41, 40, "<=", 0), "Above target", "ceiling <= over");
eq(deriveRelation(40, 40, "<=", 0), "Met", "ceiling <= at target");
eq(deriveRelation(40, 40, "<", 0), "Above target", "ceiling < at target is not under");

// ── deriveRelation — exact (=) ───────────────────────────────────────────────
eq(deriveRelation(100, 100, "=", 0), "Met", "exact at target");
eq(deriveRelation(101, 100, "=", 0), "Above target", "exact over");
eq(deriveRelation(99, 100, "=", 0), "Below target", "exact under");

// ── deriveRelation — every operator returns a known relation; bad op throws ──
for (const op of TARGET_OPERATORS) {
  const r = deriveRelation(2.01, 2.0, op, 2);
  if (!RELATIONS.includes(r)) failures.push(`operator ${op} returned unknown relation "${r}"`);
}
throws(() => deriveRelation(1, 1, "≥", 2), "deriveRelation rejects unknown operator");

// ── report ───────────────────────────────────────────────────────────────────
if (failures.length > 0) {
  console.error(`\n${failures.length} dimensionTargets test failure(s):`);
  failures.forEach((f) => console.error("  ✗ " + f));
  process.exit(1);
}
console.log("OK. dimensionTargets helpers pass (formatValue, formatTarget, formatPeriod, deriveRelation).");

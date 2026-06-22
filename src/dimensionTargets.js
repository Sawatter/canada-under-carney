// Pure, display-only helpers for the "headline commitment" element — a stated
// commitment TARGET vs the externally-reported ACTUAL, shown as the featured
// first row of a dimension's Evidence Snapshot.
//
// This is NOT a scoring path. Nothing here is read by GPA/grade math
// (src/utils.js, src/constants.js). It only formats display strings and
// derives a factual comparison word.
//
// Imported by BOTH the data validator (scripts/validate-dimensions.mjs) and
// the renderer (src/components/DimensionCard.jsx) so the displayed comparison
// cannot drift between the build-time check and the UI. Unit-tested by
// scripts/test-dimension-targets.mjs, which is wired into test:data + prebuild.

export const TARGET_OPERATORS = [">=", ">", "<=", "<", "="];
export const RELATIONS = ["Met", "Below target", "Above target"];

// Rounding tolerance derived from the metric's published precision: a value
// reported to N decimals is only meaningful to ±0.5 of the last place, so a
// comparison must not be decided by sub-precision noise.
export function toleranceFor(precision) {
  return 0.5 * Math.pow(10, -precision);
}

function unitSeparator(unit) {
  // "% of GDP" attaches with no leading space ("2.01% of GDP"); other units
  // ("homes", "$B") read better with one.
  return typeof unit === "string" && unit.startsWith("%") ? "" : " ";
}

// Canonical actual display, formatted to the metric's stored precision so it
// matches the source figure exactly (and so the validator can assert the
// metric's existing `value` string agrees with its numeric form).
export function formatValue(numericValue, unit, precision) {
  const n = Number(numericValue).toFixed(precision);
  return `${n}${unitSeparator(unit)}${unit}`;
}

const OPERATOR_PREFIX = { ">=": "≥ ", ">": "> ", "<=": "≤ ", "<": "< ", "=": "" };

// Target display keeps the committed figure as written (no forced decimals)
// and carries the operator so meet / exceed / stay-below are distinguishable:
// formatTarget(">=", 2, "% of GDP") -> "≥ 2% of GDP".
export function formatTarget(operator, targetNumeric, unit) {
  const prefix = OPERATOR_PREFIX[operator] ?? "";
  return `${prefix}${Number(targetNumeric)}${unitSeparator(unit)}${unit}`;
}

// "2025" + "estimate" -> "2025 estimate"; "2025" + "" -> "2025".
export function formatPeriod(period, qualifier) {
  return qualifier ? `${period} ${qualifier}` : period;
}

// Factual comparison of the externally-reported actual against the committed
// target. DERIVED here (never editor-typed) so it cannot misstate the data.
// The operator expresses the commitment direction:
//   floor   (>=, >) -> "Met" when the actual reaches/exceeds the target, else "Below target"
//   ceiling (<=, <) -> "Met" when the actual stays at/under the target, else "Above target"
//   exact   (=)     -> "Met" within tolerance, else "Above target"/"Below target"
// Tolerance comes from the metric's published precision.
export function deriveRelation(actualNumeric, targetNumeric, operator, precision) {
  const a = Number(actualNumeric);
  const t = Number(targetNumeric);
  const tol = toleranceFor(precision);
  switch (operator) {
    case ">=":
      return a >= t - tol ? "Met" : "Below target";
    case ">":
      return a > t + tol ? "Met" : "Below target";
    case "<=":
      return a <= t + tol ? "Met" : "Above target";
    case "<":
      return a < t - tol ? "Met" : "Above target";
    case "=":
      if (Math.abs(a - t) <= tol) return "Met";
      return a > t ? "Above target" : "Below target";
    default:
      throw new Error(`deriveRelation: unknown operator "${operator}"`);
  }
}

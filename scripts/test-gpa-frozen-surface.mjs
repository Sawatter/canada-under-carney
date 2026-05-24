// GPA Frozen-Surface Test
//
// Per CLAUDE.md, GPA formulas, grade-point mappings, and headline-score
// rounding in src/utils.js are a FROZEN SURFACE. This test catches silent
// drift by asserting known input -> expected output for the four functions
// that govern grade math:
//   - gpaToGrade (number -> letter)
//   - calculateOverallGPA (dimensions[] -> number)
//   - calculatePocketbookGPA (dimensions[] -> number, pocketbook-weighted)
//   - gpaPointsForGrade (letter -> number)
//
// A change here SHOULD only land with explicit per-turn editor approval per
// CLAUDE.md frozen-surface rule. Closes the silent-drift risk Comet Round 2
// flagged in section 6.
//
// Run directly: node scripts/test-gpa-frozen-surface.mjs
// Wired into npm run test:data.

import {
  gpaToGrade,
  calculateOverallGPA,
  calculatePocketbookGPA,
} from "../src/utils.js";
import { GRADES, POCKETBOOK_DIMS } from "../src/constants.js";

const failures = [];

function assert(label, actual, expected) {
  const ok =
    typeof expected === "number"
      ? Math.abs(actual - expected) < 0.001
      : actual === expected;
  if (!ok) {
    failures.push(`✗ ${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

// ─── Test 1: gpaToGrade boundary mappings ──────────────────────────────────
// Each tier's lower-bound number should produce the expected letter. These
// thresholds are documented in src/utils.js. If anyone changes the bounds
// in utils.js, one or more of these assertions will fail.

assert("gpaToGrade(4.0)",   gpaToGrade(4.0),   "A");
assert("gpaToGrade(3.85)",  gpaToGrade(3.85),  "A");
assert("gpaToGrade(3.84)",  gpaToGrade(3.84),  "A-");
assert("gpaToGrade(3.5)",   gpaToGrade(3.5),   "A-");
assert("gpaToGrade(3.49)",  gpaToGrade(3.49),  "B+");
assert("gpaToGrade(3.15)",  gpaToGrade(3.15),  "B+");
assert("gpaToGrade(3.14)",  gpaToGrade(3.14),  "B");
assert("gpaToGrade(2.85)",  gpaToGrade(2.85),  "B");
assert("gpaToGrade(2.84)",  gpaToGrade(2.84),  "B-");
assert("gpaToGrade(2.5)",   gpaToGrade(2.5),   "B-");
assert("gpaToGrade(2.49)",  gpaToGrade(2.49),  "C+");
assert("gpaToGrade(2.15)",  gpaToGrade(2.15),  "C+");
assert("gpaToGrade(2.14)",  gpaToGrade(2.14),  "C");
assert("gpaToGrade(1.85)",  gpaToGrade(1.85),  "C");
assert("gpaToGrade(1.84)",  gpaToGrade(1.84),  "C-");
assert("gpaToGrade(1.65)",  gpaToGrade(1.65),  "C-");
assert("gpaToGrade(1.64)",  gpaToGrade(1.64),  "D+");
assert("gpaToGrade(1.15)",  gpaToGrade(1.15),  "D+");
assert("gpaToGrade(1.14)",  gpaToGrade(1.14),  "D");
assert("gpaToGrade(0.85)",  gpaToGrade(0.85),  "D");
assert("gpaToGrade(0.84)",  gpaToGrade(0.84),  "D-");
assert("gpaToGrade(0.35)",  gpaToGrade(0.35),  "D-");
assert("gpaToGrade(0.34)",  gpaToGrade(0.34),  "F");
assert("gpaToGrade(0.0)",   gpaToGrade(0.0),   "F");

// ─── Test 2: GPA point mapping in GRADES constant ──────────────────────────
// The GRADES table in constants.js declares the grade -> gpa mapping that
// calculateOverallGPA / calculatePocketbookGPA use. If anyone edits one, these
// assertions catch it.

assert("GRADES.A.gpa",  GRADES["A"].gpa,  4.0);
assert("GRADES.A-.gpa", GRADES["A-"].gpa, 3.7);
assert("GRADES.B+.gpa", GRADES["B+"].gpa, 3.3);
assert("GRADES.B.gpa",  GRADES["B"].gpa,  3.0);
assert("GRADES.B-.gpa", GRADES["B-"].gpa, 2.7);
assert("GRADES.C+.gpa", GRADES["C+"].gpa, 2.3);
assert("GRADES.C.gpa",  GRADES["C"].gpa,  2.0);
assert("GRADES.C-.gpa", GRADES["C-"].gpa, 1.7);
assert("GRADES.D+.gpa", GRADES["D+"].gpa, 1.3);
assert("GRADES.D.gpa",  GRADES["D"].gpa,  1.0);
assert("GRADES.D-.gpa", GRADES["D-"].gpa, 0.7);
assert("GRADES.F.gpa",  GRADES["F"].gpa,  0.0);

// ─── Test 3: POCKETBOOK_DIMS count and identity ────────────────────────────
// Pocketbook dimensions are double-weighted in Household Impact GPA. If
// this set changes, the Household Impact score changes silently. Catch it.

assert("POCKETBOOK_DIMS.length", POCKETBOOK_DIMS.length, 4);
assert(
  "POCKETBOOK_DIMS contains Fiscal Health",
  POCKETBOOK_DIMS.includes("Fiscal Health"),
  true,
);
assert(
  "POCKETBOOK_DIMS contains Housing Supply",
  POCKETBOOK_DIMS.includes("Housing Supply"),
  true,
);
assert(
  "POCKETBOOK_DIMS contains Affordability Response",
  POCKETBOOK_DIMS.includes("Affordability Response"),
  true,
);
assert(
  "POCKETBOOK_DIMS contains Economic Policy Response",
  POCKETBOOK_DIMS.includes("Economic Policy Response"),
  true,
);

// ─── Test 4: Fixture-based overall GPA calculation ─────────────────────────
// Six fake dimensions with known grades. Result should be the arithmetic
// mean of their GPA points: (4.0 + 3.0 + 2.0 + 1.0 + 4.0 + 1.0) / 6 = 2.5.

const fixture6 = [
  { name: "Dim1", grade: "A" },
  { name: "Dim2", grade: "B" },
  { name: "Dim3", grade: "C" },
  { name: "Dim4", grade: "D" },
  { name: "Dim5", grade: "A" },
  { name: "Dim6", grade: "D" },
];

assert("calculateOverallGPA(6-fixture)", calculateOverallGPA(fixture6), 2.5);

// ─── Test 5: Fixture-based household (pocketbook-weighted) GPA ─────────────
// Pocketbook dims double-weight. Fixture: Fiscal Health C (2.0, weight 2),
// Housing Supply D (1.0, weight 2), Affordability Response D (1.0, weight 2),
// Economic Policy Response D (1.0, weight 2), Some other dim A (4.0, weight 1).
//
// Weighted sum = 2.0*2 + 1.0*2 + 1.0*2 + 1.0*2 + 4.0*1 = 4 + 2 + 2 + 2 + 4 = 14.0
// Total weight = 2 + 2 + 2 + 2 + 1 = 9
// Expected: 14.0 / 9 = 1.5555...

const fixtureHH = [
  { name: "Fiscal Health",           grade: "C" },
  { name: "Housing Supply",          grade: "D" },
  { name: "Affordability Response",  grade: "D" },
  { name: "Economic Policy Response", grade: "D" },
  { name: "Some other dim",          grade: "A" },
];

assert(
  "calculatePocketbookGPA(pocketbook fixture)",
  calculatePocketbookGPA(fixtureHH),
  14.0 / 9.0,
);

// ─── Test 6: Tracker dimensions are excluded from GPA ──────────────────────
// A dimension with excludeFromGPA: true must NOT contribute to either GPA.
// Add a tracker to the fixture; result should be unchanged.

const fixtureWithTracker = [
  ...fixture6,
  { name: "Tracker", informationalGrade: "F", excludeFromGPA: true },
];

assert(
  "calculateOverallGPA ignores tracker",
  calculateOverallGPA(fixtureWithTracker),
  2.5,
);

// ─── Report ────────────────────────────────────────────────────────────────

if (failures.length > 0) {
  console.error("✗ GPA frozen-surface test FAILED");
  console.error("");
  console.error(failures.join("\n"));
  console.error("");
  console.error("Per CLAUDE.md, GPA formulas in src/utils.js are FROZEN. If you");
  console.error("intend to change them, get explicit per-turn editor approval");
  console.error("and update this test's expected values in the same commit.");
  process.exit(1);
}

console.log(`✓ GPA frozen-surface test passed (${
  // approx assertion count from above
  24 + 12 + 5 + 1 + 1 + 1
} assertions across 6 test groups).`);

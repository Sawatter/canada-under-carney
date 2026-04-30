import { GRADES, POCKETBOOK_DIMS } from "./constants";

// Convert a numeric GPA to a letter grade
export function gpaToGrade(g) {
  if (g >= 3.85) return "A";
  if (g >= 3.5)  return "A-";
  if (g >= 3.15) return "B+";
  if (g >= 2.85) return "B";
  if (g >= 2.5)  return "B-";
  if (g >= 2.15) return "C+";
  if (g >= 1.85) return "C";
  if (g >= 1.65) return "C-";
  if (g >= 1.15) return "D+";
  if (g >= 0.85) return "D";
  if (g >= 0.35) return "D-";
  return "F";
}

// Filter to only graded dimensions (excludes Promise Delivery tracker)
function gradedOnly(dimensions) {
  return dimensions.filter((d) => !d.excludeFromGPA);
}

// Get the GPA value for a dimension — uses gpaValue override if present,
// otherwise falls back to the grade's standard GPA.
function dimGPA(d) {
  return d.gpaValue != null ? d.gpaValue : GRADES[d.grade].gpa;
}

// Build a per-dimension breakdown of how a weighted score is computed.
// `weightFn(dim)` returns the integer weight for each dimension (1 or 2).
// Returned object exposes the per-dim contributions, the weighted sum,
// the total weight, and the resulting score + letter grade — enough for
// a UI to render the full math behind a headline score.
function buildDerivation(dimensions, weightFn) {
  const graded = gradedOnly(dimensions);
  const items = graded.map((d) => {
    const gpa = dimGPA(d);
    const weight = weightFn(d);
    return {
      name: d.name,
      grade: d.grade,
      gpa,
      weight,
      contribution: gpa * weight,
    };
  });
  const weightedSum = items.reduce((a, b) => a + b.contribution, 0);
  const totalWeight = items.reduce((a, b) => a + b.weight, 0);
  const finalScore = weightedSum / totalWeight;
  return {
    dimensions: items,
    weightedSum,
    totalWeight,
    finalScore,
    finalGrade: gpaToGrade(finalScore),
  };
}

// Per-dim breakdown for the unweighted Full Policy Audit score.
export function getOverallDerivation(dimensions) {
  return buildDerivation(dimensions, () => 1);
}

// Per-dim breakdown for the household-weighted Household Impact score.
// Pocketbook dims double-count via POCKETBOOK_DIMS (constants.js).
export function getPocketbookDerivation(dimensions) {
  return buildDerivation(dimensions, (d) =>
    POCKETBOOK_DIMS.includes(d.name) ? 2 : 1
  );
}

// Calculate unweighted GPA across graded dimensions only
export function calculateOverallGPA(dimensions) {
  return getOverallDerivation(dimensions).finalScore;
}

// Calculate pocketbook-weighted GPA (double-weights household-impact dimensions)
export function calculatePocketbookGPA(dimensions) {
  return getPocketbookDerivation(dimensions).finalScore;
}

// Count promises by status across all dimensions (including ungraded tracker)
export function countPromises(dimensions) {
  const all = dimensions.flatMap((d) =>
    d.promises.map((p) => ({ ...p, dimension: d.name }))
  );
  const counts = {};
  for (const p of all) {
    counts[p.status] = (counts[p.status] || 0) + 1;
  }
  return { all, counts, total: all.length };
}

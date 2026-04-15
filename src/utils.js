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
// This allows display grades (e.g., "C" for whole-letter) to differ from
// scoring values (e.g., 1.7 for evidence-based C-) without a free upgrade.
function dimGPA(d) {
  return d.gpaValue != null ? d.gpaValue : GRADES[d.grade].gpa;
}

// Calculate unweighted GPA across graded dimensions only
export function calculateOverallGPA(dimensions) {
  const graded = gradedOnly(dimensions);
  const gpas = graded.map((d) => dimGPA(d));
  return gpas.reduce((a, b) => a + b, 0) / gpas.length;
}

// Calculate pocketbook-weighted GPA (double-weights household-impact dimensions)
export function calculatePocketbookGPA(dimensions) {
  const graded = gradedOnly(dimensions);
  const weighted = graded.map((d) => ({
    gpa: dimGPA(d),
    weight: POCKETBOOK_DIMS.includes(d.name) ? 2 : 1,
  }));
  const totalWeightedGPA = weighted.reduce((a, b) => a + b.gpa * b.weight, 0);
  const totalWeight = weighted.reduce((a, b) => a + b.weight, 0);
  return totalWeightedGPA / totalWeight;
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

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
  if (g >= 1.5)  return "C-";
  if (g >= 1.15) return "D+";
  if (g >= 0.85) return "D";
  if (g >= 0.35) return "D-";
  return "F";
}

// Calculate unweighted GPA across all dimensions
export function calculateOverallGPA(dimensions) {
  const gpas = dimensions.map((d) => GRADES[d.grade].gpa);
  return gpas.reduce((a, b) => a + b, 0) / gpas.length;
}

// Calculate pocketbook-weighted GPA (double-weights household-impact dimensions)
export function calculatePocketbookGPA(dimensions) {
  const weighted = dimensions.map((d) => ({
    gpa: GRADES[d.grade].gpa,
    weight: POCKETBOOK_DIMS.includes(d.name) ? 2 : 1,
  }));
  const totalWeightedGPA = weighted.reduce((a, b) => a + b.gpa * b.weight, 0);
  const totalWeight = weighted.reduce((a, b) => a + b.weight, 0);
  return totalWeightedGPA / totalWeight;
}

// Count promises by status across all dimensions
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

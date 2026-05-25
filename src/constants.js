// Grade definitions: color, background, and GPA value.
// Foreground colors were darkened in v5.41 to meet WCAG 2.1 AA
// normal-text contrast (4.5:1) against their respective backgrounds.
// GPA values are unchanged (grade math is a frozen surface). All ratios
// verified at 4.5:1 minimum; lowest is A- at 4.56:1.
export const GRADES = {
  "A":  { color: "#1a7a3a", bg: "#e8f5e9", gpa: 4.0 }, // 4.80:1
  "A-": { color: "#2e7d32", bg: "#e8f5e9", gpa: 3.7 }, // 4.56:1
  "B+": { color: "#3f6e24", bg: "#f1f8e9", gpa: 3.3 }, // 5.58:1
  "B":  { color: "#3a6822", bg: "#f1f8e9", gpa: 3.0 }, // 6.08:1
  "B-": { color: "#33621e", bg: "#f1f8e9", gpa: 2.7 }, // 6.66:1
  "C+": { color: "#9a6300", bg: "#fff8e1", gpa: 2.3 }, // 4.75:1
  "C":  { color: "#8d5a00", bg: "#fff8e1", gpa: 2.0 }, // 5.50:1
  "C-": { color: "#9a4d00", bg: "#fff3e0", gpa: 1.7 }, // 5.57:1
  "D+": { color: "#a52c0c", bg: "#fbe9e7", gpa: 1.3 }, // 6.04:1
  "D":  { color: "#c62828", bg: "#ffebee", gpa: 1.0 }, // 4.92:1
  "D-": { color: "#b71c1c", bg: "#ffebee", gpa: 0.7 }, // 5.75:1
  "F":  { color: "#880e0e", bg: "#ffcdd2", gpa: 0.0 }, // 7.05:1
};

// Trend arrow symbols and colors
export const TREND = { up: "\u25B2", stable: "\u25AC", down: "\u25BC" };
export const TREND_COLOR = { up: "#2e7d32", stable: "#757575", down: "#c62828" };

// Promise status styling
export const STATUS_COLORS = {
  "Delivered":   { bg: "#e8f5e9", color: "#1b5e20", label: "\u2713 Delivered" },
  "In Progress": { bg: "#e3f2fd", color: "#0d47a1", label: "\u25D1 In Progress" },
  "Stalled":     { bg: "#fff3e0", color: "#c43d00", label: "\u2298 Stalled" },
  "Abandoned":   { bg: "#ffebee", color: "#b71c1c", label: "\u2715 Abandoned" },
  "Thwarted":    { bg: "#fce4ec", color: "#880e4f", label: "\u26A0 Thwarted" },
  "Unclear":     { bg: "#efebe9", color: "#4e342e", label: "? Unclear" },
  "Too Early":   { bg: "#f3e5f5", color: "#6a1b9a", label: "\u25CC Too Early" },
};

// Dimensions that get double-weighted in the pocketbook calculation
export const POCKETBOOK_DIMS = [
  "Fiscal Health",
  "Housing Supply",
  "Affordability Response",
  "Economic Policy Response",
];

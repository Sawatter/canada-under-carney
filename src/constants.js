// Grade definitions: color, background, and GPA value
export const GRADES = {
  "A":  { color: "#1a7a3a", bg: "#e8f5e9", gpa: 4.0 },
  "A-": { color: "#2e7d32", bg: "#e8f5e9", gpa: 3.7 },
  "B+": { color: "#558b2f", bg: "#f1f8e9", gpa: 3.3 },
  "B":  { color: "#689f38", bg: "#f1f8e9", gpa: 3.0 },
  "B-": { color: "#7cb342", bg: "#f1f8e9", gpa: 2.7 },
  "C+": { color: "#c67c00", bg: "#fff8e1", gpa: 2.3 },
  "C":  { color: "#e68a00", bg: "#fff8e1", gpa: 2.0 },
  "C-": { color: "#ef6c00", bg: "#fff3e0", gpa: 1.7 },
  "D+": { color: "#d84315", bg: "#fbe9e7", gpa: 1.3 },
  "D":  { color: "#c62828", bg: "#ffebee", gpa: 1.0 },
  "D-": { color: "#b71c1c", bg: "#ffebee", gpa: 0.7 },
  "F":  { color: "#880e0e", bg: "#ffcdd2", gpa: 0.0 },
};

// Trend arrow symbols and colors
export const TREND = { up: "\u25B2", stable: "\u25AC", down: "\u25BC" };
export const TREND_COLOR = { up: "#2e7d32", stable: "#757575", down: "#c62828" };

// Promise status styling
export const STATUS_COLORS = {
  "Delivered":   { bg: "#e8f5e9", color: "#1b5e20", label: "\u2713 Delivered" },
  "In Progress": { bg: "#e3f2fd", color: "#0d47a1", label: "\u25D1 In Progress" },
  "Stalled":     { bg: "#fff3e0", color: "#e65100", label: "\u2298 Stalled" },
  "Abandoned":   { bg: "#ffebee", color: "#b71c1c", label: "\u2715 Abandoned" },
  "Thwarted":    { bg: "#fce4ec", color: "#880e4f", label: "\u26A0 Thwarted" },
  "Too Early":   { bg: "#f3e5f5", color: "#6a1b9a", label: "\u25CC Too Early" },
};

// Dimensions that get double-weighted in the pocketbook calculation
export const POCKETBOOK_DIMS = [
  "Fiscal Health",
  "Housing Supply",
  "Grocery Prices",
  "GDP & Productivity",
];

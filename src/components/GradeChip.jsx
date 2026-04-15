import { GRADES } from "../constants";

export default function GradeChip({ grade, size = "md" }) {
  const g = GRADES[grade];
  const sz =
    size === "lg"
      ? { font: "36px", pad: "12px 20px" }
      : size === "sm"
      ? { font: "13px", pad: "3px 8px" }
      : { font: "18px", pad: "6px 12px" };

  return (
    <span
      style={{
        background: g.bg,
        color: g.color,
        fontWeight: 800,
        fontSize: sz.font,
        padding: sz.pad,
        borderRadius: "6px",
        border: `2px solid ${g.color}`,
        fontFamily: "'DM Mono', monospace",
        letterSpacing: "-0.5px",
        display: "inline-block",
        lineHeight: 1.2,
      }}
    >
      {grade}
    </span>
  );
}

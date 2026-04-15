import { STATUS_COLORS } from "../constants";

export default function PromiseTag({ status }) {
  const s = STATUS_COLORS[status];
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        fontSize: "11px",
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: "4px",
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
}

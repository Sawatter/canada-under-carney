import { TREND, TREND_COLOR } from "../constants";

const TREND_LABEL = {
  up: "Improving",
  stable: "Stable",
  down: "Declining",
};

export default function TrendArrow({ trend }) {
  const label = TREND_LABEL[trend] || "Trend";
  return (
    <span
      role="img"
      aria-label={`Trend: ${label}`}
      title={label}
      style={{
        color: TREND_COLOR[trend],
        fontWeight: 700,
        fontSize: "15px",
        marginLeft: "6px",
      }}
    >
      {TREND[trend]}
    </span>
  );
}

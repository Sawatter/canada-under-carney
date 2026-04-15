import { TREND, TREND_COLOR } from "../constants";

export default function TrendArrow({ trend }) {
  return (
    <span
      style={{
        color: TREND_COLOR[trend],
        fontWeight: 700,
        fontSize: "14px",
        marginLeft: "6px",
      }}
    >
      {TREND[trend]}
    </span>
  );
}

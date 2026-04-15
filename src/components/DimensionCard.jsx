import { GRADES } from "../constants";
import GradeChip from "./GradeChip";
import TrendArrow from "./TrendArrow";
import PromiseTag from "./PromiseTag";

export default function DimensionCard({ dim, isExpanded, onClick }) {
  const g = GRADES[dim.grade];

  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff",
        border: `1px solid ${isExpanded ? g.color : "#e0e0e0"}`,
        borderRadius: "8px",
        padding: "16px",
        cursor: "pointer",
        transition: "all 0.2s",
        boxShadow: isExpanded
          ? `0 2px 12px ${g.color}22`
          : "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header row: name + grade */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "12px",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: "14px",
              color: "#1a1a1a",
              fontFamily: "'DM Sans', sans-serif",
              marginBottom: "4px",
            }}
          >
            {dim.name}
            <TrendArrow trend={dim.trend} />
          </div>
          <div style={{ fontSize: "12px", color: "#666", lineHeight: 1.4 }}>
            {dim.status}
          </div>
        </div>
        <GradeChip grade={dim.grade} />
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div
          style={{
            marginTop: "16px",
            borderTop: "1px solid #eee",
            paddingTop: "12px",
          }}
        >
          {/* Key Metrics */}
          <div style={{ marginBottom: "12px" }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#999",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "6px",
              }}
            >
              Key Metrics
            </div>
            {dim.metrics.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: "12px",
                  color: "#444",
                  padding: "2px 0",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {m.label}: {m.value}
              </div>
            ))}
          </div>

          {/* Promise Tracker */}
          <div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#999",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "6px",
              }}
            >
              Promise Tracker
            </div>
            {dim.promises.map((p, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "4px 0",
                  gap: "8px",
                }}
              >
                <span style={{ fontSize: "12px", color: "#444", flex: 1 }}>
                  {p.text}
                </span>
                <PromiseTag status={p.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

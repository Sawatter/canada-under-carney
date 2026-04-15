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
            {dim.previousGrade && (
              <span
                style={{
                  fontSize: "10px",
                  color: "#c62828",
                  marginLeft: "6px",
                  fontWeight: 600,
                }}
              >
                was {dim.previousGrade}
              </span>
            )}
          </div>
          <div style={{ fontSize: "12px", color: "#666", lineHeight: 1.4 }}>
            {dim.status}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
          <GradeChip grade={dim.grade} />
          {/* Expand hint */}
          <span
            style={{
              fontSize: "10px",
              color: "#bbb",
              transition: "transform 0.2s",
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            {isExpanded ? "\u25B2" : "\u25BC detail"}
          </span>
        </div>
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
          {/* Grade Rationale */}
          {dim.rationale && (
            <div style={{ marginBottom: "14px" }}>
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
                Why This Grade
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#444",
                  lineHeight: 1.5,
                  background: "#fafafa",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  borderLeft: `3px solid ${g.color}`,
                }}
              >
                {dim.rationale}
              </div>
            </div>
          )}

          {/* Key Metrics */}
          <div style={{ marginBottom: "14px" }}>
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
              {dim.lastUpdated && (
                <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, marginLeft: "8px", color: "#bbb" }}>
                  Updated {dim.lastUpdated}
                </span>
              )}
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
          {dim.promises && dim.promises.length > 0 && (
            <div style={{ marginBottom: "14px" }}>
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
                    padding: "6px 0",
                    borderBottom: i < dim.promises.length - 1 ? "1px solid #f5f5f5" : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ fontSize: "12px", color: "#444", flex: 1 }}>
                      {p.text}
                    </span>
                    <PromiseTag status={p.status} />
                  </div>
                  {p.evidence && (
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#888",
                        marginTop: "3px",
                        paddingLeft: "8px",
                        borderLeft: "2px solid #eee",
                        lineHeight: 1.4,
                      }}
                    >
                      {p.evidence}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Source Links */}
          {dim.sources && dim.sources.length > 0 && (
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
                Sources
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {dim.sources.map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      fontSize: "11px",
                      color: "#1a73e8",
                      textDecoration: "none",
                      background: "#e8f0fe",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.label} &rarr;
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

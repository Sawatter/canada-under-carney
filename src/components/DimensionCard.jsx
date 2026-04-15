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
                  fontSize: "9px",
                  color: "#c62828",
                  marginLeft: "4px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  verticalAlign: "middle",
                }}
              >
                (was {dim.previousGrade})
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
              fontSize: "11px",
              color: "#555",
              fontWeight: 600,
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

          {/* Sub-Scores (Defence & Trade) */}
          {dim.subScores && (
            <div style={{ display: "flex", gap: "10px", marginBottom: "12px", flexWrap: "wrap" }}>
              {Object.values(dim.subScores).map((sub, i) => (
                <div key={i} style={{ flex: 1, minWidth: "120px", background: "#fafafa", borderRadius: "6px", padding: "8px 10px", border: "1px solid #eee" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#999", textTransform: "uppercase", marginBottom: "4px" }}>{sub.label}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <GradeChip grade={sub.grade} size="sm" />
                    <span style={{ fontSize: "11px", color: "#666", lineHeight: 1.3 }}>{sub.rationale}</span>
                  </div>
                </div>
              ))}
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

          {/* Left/Right Perspectives */}
          {dim.perspectives && (
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
                What Critics and Defenders Say
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div
                  style={{
                    fontSize: "11px",
                    lineHeight: 1.5,
                    padding: "8px 10px",
                    background: "#fff3f0",
                    borderRadius: "6px",
                    borderLeft: "3px solid #d84315",
                    color: "#333",
                  }}
                >
                  <strong style={{ color: "#d84315" }}>Critics say:</strong>{" "}
                  {dim.perspectives.critics}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    lineHeight: 1.5,
                    padding: "8px 10px",
                    background: "#f0f4ff",
                    borderRadius: "6px",
                    borderLeft: "3px solid #1565c0",
                    color: "#333",
                  }}
                >
                  <strong style={{ color: "#1565c0" }}>Defenders say:</strong>{" "}
                  {dim.perspectives.defenders}
                </div>
              </div>
            </div>
          )}

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
                      {p.durability && (
                        <span style={{ fontSize: "9px", color: "#999", marginLeft: "6px", fontStyle: "italic" }}>
                          {p.durability}
                        </span>
                      )}
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

          {/* Inherited Baseline */}
          {dim.inherited && (
            <div style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
                What Was Inherited
              </div>
              <div style={{ fontSize: "11px", color: "#666", lineHeight: 1.5, background: "#f9f9f9", padding: "8px 10px", borderRadius: "6px", borderLeft: "3px solid #9e9e9e" }}>
                {dim.inherited}
              </div>
            </div>
          )}

          {/* Next Evidence Trigger */}
          {dim.nextTrigger && (
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
                What Would Change This Grade
              </div>
              <div style={{ fontSize: "11px", color: "#666", lineHeight: 1.5, background: "#fffde7", padding: "8px 10px", borderRadius: "6px", borderLeft: "3px solid #f9a825" }}>
                {dim.nextTrigger}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

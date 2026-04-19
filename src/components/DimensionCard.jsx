import { GRADES } from "../constants";
import GradeChip from "./GradeChip";
import TrendArrow from "./TrendArrow";
import PromiseTag from "./PromiseTag";

export default function DimensionCard({ dim, isExpanded, onClick }) {
  const g = GRADES[dim.grade];
  const modifierItems = dim.gradeBasis?.activeModifiers || [];
  const metaTags = [
    { label: "Confidence", value: dim.tags?.confidence, tone: "blue" },
    { label: "Attribution", value: dim.tags?.attribution, tone: "gray" },
    { label: "Lag", value: dim.tags?.lag, tone: "amber" },
  ].filter((tag) => tag.value);
  const rationaleLabel = dim.status?.includes("Whole-letter grade only")
    ? "Within-band rationale"
    : "Plus/minus rationale";

  const renderScopeItem = (item) => {
    if (!item) return null;

    if (typeof item === "string") {
      return item;
    }

    if (item.homedIn) {
      return `${item.item} (homed in ${item.homedIn})`;
    }

    if (item.reason) {
      return `${item.item} (${item.reason})`;
    }

    return item.item;
  };

  const metaTagStyle = (tone) => {
    if (tone === "blue") {
      return {
        color: "#3551a0",
        background: "#eef3ff",
        border: "1px solid #d7defa",
      };
    }

    if (tone === "amber") {
      return {
        color: "#7a5d1b",
        background: "#fbf4e5",
        border: "1px solid #eadfbd",
      };
    }

    return {
      color: "#555",
      background: "#f5f5f5",
      border: "1px solid #e3e3e3",
    };
  };

  return (
    <div
      onClick={onClick}
      style={{
        background: dim.excludeFromGPA ? "#fcfcf7" : "#fff",
        border: `1px solid ${
          isExpanded ? g.color : dim.excludeFromGPA ? "#d9d4b8" : "#e0e0e0"
        }`,
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
          {dim.excludeFromGPA && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "10px",
                fontWeight: 700,
                color: "#7a6a28",
                background: "#f5edd0",
                border: "1px solid #e6d79b",
                borderRadius: "999px",
                padding: "3px 8px",
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.4px",
              }}
            >
              Tracker · Not in GPA
            </div>
          )}
          <div style={{ fontSize: "12px", color: "#666", lineHeight: 1.4 }}>
            {dim.status}
          </div>
          {dim.construct && (
            <div
              style={{
                fontSize: "11px",
                color: "#777",
                lineHeight: 1.4,
                marginTop: "6px",
              }}
            >
              <strong style={{ color: "#555" }}>Construct:</strong> {dim.construct}
            </div>
          )}
          {metaTags.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
                marginTop: "8px",
              }}
            >
              {metaTags.map((tag) => (
                <div
                  key={tag.label}
                  style={{
                    ...metaTagStyle(tag.tone),
                    fontSize: "10px",
                    lineHeight: 1.35,
                    borderRadius: "999px",
                    padding: "3px 8px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    maxWidth: "100%",
                  }}
                >
                  <strong style={{ fontWeight: 700 }}>{tag.label}:</strong>
                  <span>{tag.value}</span>
                </div>
              ))}
            </div>
          )}
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
          {dim.gradeBasis ? (
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
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div>
                  <strong>Band:</strong> {dim.gradeBasis.band} - {dim.gradeBasis.bandCriterion}
                </div>
                <div>
                  <strong>{rationaleLabel}:</strong> {dim.gradeBasis.plusMinusRationale}
                </div>
                {modifierItems.length > 0 && (
                  <div>
                    <strong>Modifiers:</strong>
                    <div style={{ marginTop: "4px", display: "flex", flexDirection: "column", gap: "6px" }}>
                      {modifierItems.map((modifier, i) => (
                        <div key={i}>
                          <strong>{modifier.name}</strong>: {modifier.status}. {modifier.reason}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            dim.rationale && (
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
            )
          )}

          {(dim.gradeTriggers || dim.nextTrigger) && (
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
                What Would Change This Grade
              </div>
              {dim.gradeTriggers ? (
                <div
                  style={{
                    fontSize: "11px",
                    color: "#666",
                    lineHeight: 1.5,
                    background: "#fffde7",
                    padding: "8px 10px",
                    borderRadius: "6px",
                    borderLeft: "3px solid #f9a825",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div>
                    <strong>Up one step:</strong>
                    <div style={{ marginTop: "4px", display: "flex", flexDirection: "column", gap: "4px" }}>
                      {dim.gradeTriggers.up.map((trigger, i) => (
                        <div key={i}>{trigger}</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <strong>Down one step:</strong>
                    <div style={{ marginTop: "4px", display: "flex", flexDirection: "column", gap: "4px" }}>
                      {dim.gradeTriggers.down.map((trigger, i) => (
                        <div key={i}>{trigger}</div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: "11px", color: "#666", lineHeight: 1.5, background: "#fffde7", padding: "8px 10px", borderRadius: "6px", borderLeft: "3px solid #f9a825" }}>
                  {dim.nextTrigger}
                </div>
              )}
            </div>
          )}

          {dim.scope && (
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
                Scope
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#666",
                  lineHeight: 1.5,
                  background: "#f9f9f9",
                  padding: "8px 10px",
                  borderRadius: "6px",
                  borderLeft: "3px solid #9e9e9e",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div>
                  <strong>In scope:</strong>
                  <div style={{ marginTop: "4px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    {dim.scope.inScope.map((item, i) => (
                      <div key={i}>{renderScopeItem(item)}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <strong>Out of scope:</strong>
                  <div style={{ marginTop: "4px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    {dim.scope.outOfScope.map((item, i) => (
                      <div key={i}>{renderScopeItem(item)}</div>
                    ))}
                  </div>
                </div>
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
                Interpretive Perspectives
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#777",
                  lineHeight: 1.5,
                  marginBottom: "8px",
                  fontStyle: "italic",
                }}
              >
                These are positions held by named sources. The grade is determined by the evidence above, not by which perspective is more persuasive.
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

        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { GRADES } from "../constants";
import GradeChip from "./GradeChip";
import TrendArrow from "./TrendArrow";

export default function DimensionCard({ dim, isExpanded, onClick, trackerStat }) {
  const g = GRADES[dim.grade];
  const isTracker = !!dim.excludeFromGPA;
  const modifierItems = isTracker ? [] : (dim.gradeBasis?.activeModifiers || []);
  const [scopeOpen, setScopeOpen] = useState(false);
  const [inheritedOpen, setInheritedOpen] = useState(false);
  const [triggersOpen, setTriggersOpen] = useState(false);
  const [perspectivesOpen, setPerspectivesOpen] = useState(false);

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

  return (
    <div
      onClick={onClick}
      style={{
        background: isTracker ? "#fcfcf7" : "#fff",
        border: `1px solid ${
          isExpanded
            ? (isTracker ? "#bfa86b" : g.color)
            : (isTracker ? "#d9d4b8" : "#e0e0e0")
        }`,
        borderRadius: "8px",
        padding: "16px",
        cursor: "pointer",
        transition: "all 0.2s",
        boxShadow: isExpanded
          ? (isTracker ? "0 2px 12px #bfa86b22" : `0 2px 12px ${g.color}22`)
          : "0 1px 3px rgba(0,0,0,0.06)",
        // When expanded, take the full grid row so we don't leave adjacent
        // cards stranded in whitespace. Same pattern YouTube / Material use
        // for in-grid expansions. Ignored on single-column (mobile) layouts
        // because there's nothing to span.
        gridColumn: isExpanded ? "1 / -1" : "auto",
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
              fontSize: "15px",
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
                  fontSize: "11px",
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
          {isTracker && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
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
              Tracker &middot; No letter grade
            </div>
          )}
          {dim.whatThisGrades && (
            <div
              style={{
                fontSize: "14px",
                color: "#555",
                fontStyle: "italic",
                lineHeight: 1.4,
                marginBottom: "4px",
              }}
            >
              {dim.whatThisGrades}
            </div>
          )}
          <div style={{ fontSize: "15px", color: "#333", lineHeight: 1.5 }}>
            {dim.status}
          </div>
          {dim.lastUpdated && (
            <div
              style={{
                fontSize: "13px",
                color: "#666",
                marginTop: "6px",
                fontStyle: "italic",
              }}
            >
              Last reviewed {dim.lastUpdated}
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
          {isTracker && trackerStat ? (
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                textAlign: "center",
                minWidth: "64px",
              }}
            >
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  color: "#7a6a28",
                  lineHeight: 1,
                }}
              >
                {trackerStat.delivered}
                <span style={{ fontSize: "16px", color: "#bbb", fontWeight: 600 }}>
                  /{trackerStat.total}
                </span>
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#888",
                  marginTop: "3px",
                  letterSpacing: "0.4px",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                delivered
              </div>
            </div>
          ) : (
            <GradeChip grade={dim.grade} />
          )}
          {/* Expand hint */}
          <span
            style={{
              fontSize: "14px",
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
          {!isTracker && (dim.gradeBasis ? (
            <div style={{ marginBottom: "14px" }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#1a1a1a",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "6px",
                }}
              >
                Why This Grade
              </div>
              <div
                style={{
                  fontSize: "15px",
                  color: "#333",
                  lineHeight: 1.6,
                  background: "#fafafa",
                  padding: "12px 14px",
                  borderRadius: "6px",
                  borderLeft: `3px solid ${g.color}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div>{dim.gradeBasis.plusMinusRationale}</div>
                <div style={{ fontSize: "14px", color: "#555" }}>
                  <strong>{dim.gradeBasis.band}</strong> means: {dim.gradeBasis.bandCriterion}
                </div>
                {modifierItems.length > 0 && (
                  <div style={{ fontSize: "14px", color: "#444" }}>
                    <strong>Adjustments:</strong>
                    <div style={{ marginTop: "4px", display: "flex", flexDirection: "column", gap: "4px" }}>
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
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#1a1a1a",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "6px",
                }}
              >
                Why This Grade
              </div>
              <div
                style={{
                  fontSize: "13px",
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
          ))}

          {/* Sub-Scores (Defence & Trade) */}
          {dim.subScores && (
            <div style={{ display: "flex", gap: "10px", marginBottom: "12px", flexWrap: "wrap" }}>
              {Object.values(dim.subScores).map((sub, i) => (
                <div key={i} style={{ flex: 1, minWidth: "120px", background: "#fafafa", borderRadius: "6px", padding: "8px 10px", border: "1px solid #eee" }}>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a1a", textTransform: "uppercase", marginBottom: "4px" }}>{sub.label}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <GradeChip grade={sub.grade} size="sm" />
                    <span style={{ fontSize: "14px", color: "#666", lineHeight: 1.3 }}>{sub.rationale}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Key Metrics */}
          <div style={{ marginBottom: "14px" }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#1a1a1a",
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
                  fontSize: "13px",
                  color: "#444",
                  padding: "2px 0",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {m.label}: {m.value}
              </div>
            ))}
          </div>

          {/* Promise Tracker summary — per-item detail lives on the Promises tab */}
          {dim.promises && dim.promises.length > 0 && (
            <div style={{ marginBottom: "14px" }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#1a1a1a",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "6px",
                }}
              >
                Promises
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#555",
                  lineHeight: 1.5,
                  background: "#fafafa",
                  padding: "8px 10px",
                  borderRadius: "6px",
                  borderLeft: "3px solid #9e9e9e",
                }}
              >
                {dim.promises.length} promise
                {dim.promises.length === 1 ? "" : "s"} tracked on this file. For
                per-promise status and evidence, see the{" "}
                <strong>Promises</strong> tab.
              </div>
            </div>
          )}

          {/* Source Links */}
          {dim.sources && dim.sources.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#1a1a1a",
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
                      fontSize: "14px",
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

          {/* ─── More details: collapsibles stacked below the main flow ─── */}
          {((!isTracker && (dim.gradeTriggers || dim.nextTrigger)) || dim.perspectives || dim.scope || dim.inherited) && (
            <div
              style={{
                marginTop: "18px",
                paddingTop: "12px",
                borderTop: "1px dashed #d8d8d8",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#777",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  marginBottom: "10px",
                }}
              >
                More details
              </div>

              {!isTracker && (dim.gradeTriggers || dim.nextTrigger) && (
                <div style={{ marginBottom: "12px" }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTriggersOpen((v) => !v);
                    }}
                    aria-expanded={triggersOpen}
                    aria-controls={`dim-${dim.id}-triggers`}
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#1a1a1a",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginBottom: "6px",
                      background: "none",
                      border: "none",
                      padding: "2px 0",
                      minHeight: "24px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontFamily: "inherit",
                    }}
                  >
                    <span style={{ fontSize: "11px" }}>{triggersOpen ? "\u25BE" : "\u25B8"}</span>
                    What Would Change This Grade
                  </button>
                  {triggersOpen && (
                    dim.gradeTriggers ? (
                      <div
                        id={`dim-${dim.id}-triggers`}
                        role="region"
                        style={{
                          fontSize: "14px",
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
                      <div
                        id={`dim-${dim.id}-triggers`}
                        role="region"
                        style={{ fontSize: "14px", color: "#666", lineHeight: 1.5, background: "#fffde7", padding: "8px 10px", borderRadius: "6px", borderLeft: "3px solid #f9a825" }}
                      >
                        {dim.nextTrigger}
                      </div>
                    )
                  )}
                </div>
              )}

              {dim.perspectives && (
                <div style={{ marginBottom: "12px" }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPerspectivesOpen((v) => !v);
                    }}
                    aria-expanded={perspectivesOpen}
                    aria-controls={`dim-${dim.id}-perspectives`}
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#1a1a1a",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginBottom: "6px",
                      background: "none",
                      border: "none",
                      padding: "2px 0",
                      minHeight: "24px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontFamily: "inherit",
                    }}
                  >
                    <span style={{ fontSize: "11px" }}>{perspectivesOpen ? "\u25BE" : "\u25B8"}</span>
                    Critics and defenders
                  </button>
                  {perspectivesOpen && (
                    <div
                      id={`dim-${dim.id}-perspectives`}
                      role="region"
                      style={{ display: "flex", flexDirection: "column", gap: "8px" }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
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
                          fontSize: "14px",
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
                  )}
                </div>
              )}

              {dim.scope && (
                <div style={{ marginBottom: "12px" }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setScopeOpen((v) => !v);
                    }}
                    aria-expanded={scopeOpen}
                    aria-controls={`dim-${dim.id}-scope`}
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#1a1a1a",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginBottom: "6px",
                      background: "none",
                      border: "none",
                      padding: "2px 0",
                      minHeight: "24px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontFamily: "inherit",
                    }}
                  >
                    <span style={{ fontSize: "11px" }}>{scopeOpen ? "\u25BE" : "\u25B8"}</span>
                    Scope
                  </button>
                  {scopeOpen && (
                    <div
                      id={`dim-${dim.id}-scope`}
                      role="region"
                      style={{
                        fontSize: "14px",
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
                  )}
                </div>
              )}

              {dim.inherited && (
                <div style={{ marginBottom: "0" }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setInheritedOpen((v) => !v);
                    }}
                    aria-expanded={inheritedOpen}
                    aria-controls={`dim-${dim.id}-inherited`}
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#1a1a1a",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginBottom: "6px",
                      background: "none",
                      border: "none",
                      padding: "2px 0",
                      minHeight: "24px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontFamily: "inherit",
                    }}
                  >
                    <span style={{ fontSize: "11px" }}>{inheritedOpen ? "\u25BE" : "\u25B8"}</span>
                    What Was Inherited
                  </button>
                  {inheritedOpen && (
                    <div
                      id={`dim-${dim.id}-inherited`}
                      role="region"
                      style={{ fontSize: "14px", color: "#666", lineHeight: 1.5, background: "#f9f9f9", padding: "8px 10px", borderRadius: "6px", borderLeft: "3px solid #9e9e9e" }}
                    >
                      {dim.inherited}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { GRADES } from "../constants";
import GradeChip from "./GradeChip";
import TrendArrow from "./TrendArrow";

const MODIFIER_LABELS = {
  "External Constraint": "External pressure",
  "Timing Fairness": "Early-cycle adjustment",
  "Jurisdictional limits": "Shared-control limit",
  "Credit-claiming penalty": "Credit reduced for overclaiming",
};

function normalizeTrigger(trigger) {
  if (!trigger) return null;
  if (typeof trigger === "string") return { text: trigger };
  return trigger;
}

function isEventDrivenTrigger(trigger) {
  const label = (trigger?.sourceLabel || "").toLowerCase();
  return !trigger?.sourceUrl
    && !trigger?.internalRef
    && (label.includes("event-driven") || label.includes("(see source list)"));
}

export default function DimensionCard({ dim, isExpanded, onClick, trackerStat, onInternalRef }) {
  const g = GRADES[dim.grade];
  const isTracker = !!dim.excludeFromGPA;
  const modifierItems = isTracker ? [] : (dim.gradeBasis?.activeModifiers || []);
  const metrics = dim.metrics || [];
  const scoring = dim.scoring || null;
  const showLowerTriggers = !isTracker && !scoring && (dim.gradeTriggers || dim.nextTrigger);
  const [scopeOpen, setScopeOpen] = useState(false);
  const [inheritedOpen, setInheritedOpen] = useState(false);
  const [triggersOpen, setTriggersOpen] = useState(false);
  const [perspectivesOpen, setPerspectivesOpen] = useState(false);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [cohortOpen, setCohortOpen] = useState(false);
  const cohort = dim.projectCohort || null;

  const metricGroups = (() => {
    if (!metrics.some((metric) => metric.group)) {
      return [{ title: null, items: metrics }];
    }

    return metrics.reduce((groups, metric) => {
      const title = metric.group || "Other";
      const existingGroup = groups.find((group) => group.title === title);

      if (existingGroup) {
        existingGroup.items.push(metric);
        return groups;
      }

      groups.push({ title, items: [metric] });
      return groups;
    }, []);
  })();

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

  const scoringMetadata = [];
  if (dim.tags?.confidence) scoringMetadata.push({ label: "Confidence", value: dim.tags.confidence });
  if (dim.tags?.attribution) scoringMetadata.push({ label: "Attribution", value: dim.tags.attribution });
  if (dim.tags?.lag) scoringMetadata.push({ label: "Lag", value: dim.tags.lag });

  const keyContextItems = [];
  if (scoring?.scopeNote) {
    keyContextItems.push({ label: "Scope", text: scoring.scopeNote });
  }
  if (dim.tags?.attribution) {
    keyContextItems.push({
      label: "Attribution",
      text: `Federal control is classified as ${dim.tags.attribution}.`,
    });
  }
  if (dim.tags?.lag) {
    keyContextItems.push({
      label: "Lag",
      text: `Evidence moves on a ${dim.tags.lag.toLowerCase()} timeline.`,
    });
  }
  if (modifierItems.length > 0) {
    keyContextItems.push({
      label: "Active adjustments",
      text: modifierItems.join(", "),
    });
  }
  if (dim.inherited) {
    keyContextItems.push({ label: "Inherited context", text: dim.inherited });
  }

  const handleSkepticAnchorClick = (e, beforeJump) => {
    e.stopPropagation();
    beforeJump?.();
  };

  const skepticPathLinkStyle = {
    color: "#1565c0",
    textDecoration: "underline",
    display: "inline-block",
    whiteSpace: "nowrap",
    lineHeight: 1.4,
  };

  const renderTriggerItem = (trigger, keyPrefix) => {
    const item = normalizeTrigger(trigger);
    if (!item) return null;
    const eventDriven = isEventDrivenTrigger(item);

    const handleInternalRefClick = (e) => {
      e.stopPropagation();
      if (!item.internalRef) return;

      if (item.internalRef.type === "cohort") {
        setCohortOpen(true);
        window.requestAnimationFrame(() => {
          document.getElementById(`dim-${dim.id}-cohort`)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
        return;
      }

      onInternalRef?.(item.internalRef);
    };

    return (
      <div
        key={`${keyPrefix}-${item.text}`}
        style={{ display: "flex", flexDirection: "column", gap: "2px" }}
      >
        <span>{item.text}</span>
        {item.sourceLabel && (
          item.internalRef ? (
            <button
              type="button"
              onClick={handleInternalRefClick}
              style={{
                fontSize: "12px",
                color: "#1565c0",
                textDecoration: "none",
                alignSelf: "flex-start",
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 600,
              }}
            >
              Evidence: {item.sourceLabel} &rarr;
            </button>
          ) : item.sourceUrl ? (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                fontSize: "12px",
                color: "#1565c0",
                textDecoration: "none",
                alignSelf: "flex-start",
                fontWeight: 600,
              }}
            >
              Source: {item.sourceLabel} &rarr;
            </a>
          ) : (
            <span
              style={{
                fontSize: "12px",
                color: "#6b7280",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                flexWrap: "wrap",
              }}
            >
              Source: {item.sourceLabel}
              {eventDriven && (
                <span
                  title="Event-driven trigger: the source family is known now; the specific URL is added if the event happens."
                  aria-label="Event-driven trigger. The source family is known now; the specific URL is added if the event happens."
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    minHeight: "18px",
                    padding: "1px 6px",
                    borderRadius: "999px",
                    border: "1px solid #b8c7d9",
                    background: "#eef4fb",
                    color: "#315170",
                    fontSize: "11px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.3px",
                  }}
                >
                  Event
                </span>
              )}
            </span>
          )
        )}
        {Array.isArray(trigger?.additionalSources) && trigger.additionalSources.length > 0 && (
          <details style={{ marginTop: "4px", fontSize: "12px", color: "#374151" }}>
            <summary style={{ cursor: "pointer", fontWeight: 600, color: "#1565c0" }}>
              + {trigger.additionalSources.length} independent challenge source{trigger.additionalSources.length === 1 ? "" : "s"} on this trigger
            </summary>
            <ul style={{ margin: "6px 0 0", paddingLeft: "18px", lineHeight: 1.5 }}>
              {trigger.additionalSources.map((alt, i) => (
                <li key={i} style={{ marginBottom: "4px" }}>
                  {alt.url ? (
                    <a
                      href={alt.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{ color: "#1565c0", fontWeight: 600 }}
                    >
                      {alt.label}
                    </a>
                  ) : (
                    <span style={{ fontWeight: 600 }}>{alt.label}</span>
                  )}
                  {alt.role && (
                    <span style={{ color: "#6b7280" }}> — {alt.role}</span>
                  )}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    );
  };

  const handleCardKeyDown = (e) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.(e);
    }
  };

  const handleCardClick = (e) => {
    if (e.target !== e.currentTarget && e.target.closest("a, button, input, select, textarea")) {
      return;
    }
    onClick?.(e);
  };

  return (
    <div
      id={`dim-${dim.id}`}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-label={`${isExpanded ? "Collapse" : "Expand"} ${dim.name} details`}
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
                  fontSize: "12px",
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
          {!isTracker && dim.judgmentCall && (
            <div
              style={{
                fontSize: "13px",
                color: "#444",
                lineHeight: 1.45,
                marginTop: "8px",
              }}
            >
              <strong style={{ color: "#6b4a00" }}>Judgment call:</strong>{" "}
              {dim.judgmentCall}
            </div>
          )}
          {dim.lastUpdated && (
            <div
              className="last-reviewed-pill"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                alignSelf: "flex-start",
                fontSize: "12px",
                color: "#3f4a55",
                marginTop: "8px",
                fontWeight: 700,
                background: "#f4f7fb",
                border: "1px solid #d9e2ec",
                borderRadius: "999px",
                padding: "3px 8px",
              }}
            >
              <span style={{ textTransform: "uppercase", letterSpacing: "0.35px" }}>
                Last reviewed
              </span>
              {dim.lastUpdated}
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
                <span style={{ fontSize: "16px", color: "#666", fontWeight: 600 }}>
                  /{trackerStat.total}
                </span>
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#666",
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
            }}
          >
            {isExpanded ? "\u25B2 close" : "\u25BC open"}
          </span>
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            marginTop: "16px",
            borderTop: "1px solid #eee",
            paddingTop: "12px",
          }}
        >
          {!isTracker && (
            <div
              style={{
                marginBottom: "14px",
                fontSize: "12px",
                color: "#555",
                background: "#fafafa",
                padding: "8px 12px",
                borderRadius: "6px",
                borderLeft: "3px solid #1a73e8",
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: "#1565c0" }}>Skeptic path:</strong> to
              challenge this grade, walk these five ingredients in order:{" "}
              <a
                href={`#dim-${dim.id}-scoring`}
                onClick={(e) => handleSkepticAnchorClick(e)}
                style={skepticPathLinkStyle}
              >
                (1) the rule
              </a>
              ,{" "}
              <a
                href={`#dim-${dim.id}-triggers-section`}
                onClick={(e) => handleSkepticAnchorClick(e, () => {
                  if (showLowerTriggers) setTriggersOpen(true);
                })}
                style={skepticPathLinkStyle}
              >
                (2) what would move the grade
              </a>
              ,{" "}
              <a
                href={`#dim-${dim.id}-metrics`}
                onClick={(e) => handleSkepticAnchorClick(e)}
                style={skepticPathLinkStyle}
              >
                (3) the evidence under each metric
              </a>
              ,{" "}
              <a
                href={`#dim-${dim.id}-sources`}
                onClick={(e) => handleSkepticAnchorClick(e)}
                style={skepticPathLinkStyle}
              >
                (4) the cited sources
              </a>
              , and{" "}
              <a
                href={`#dim-${dim.id}-perspectives-section`}
                onClick={(e) => handleSkepticAnchorClick(e, () => setPerspectivesOpen(true))}
                style={skepticPathLinkStyle}
              >
                (5) named critic and defender views
              </a>
              . The grade in the header is the result; this drawer is the
              derivation. Click an ingredient to jump to its section.
            </div>
          )}
          {keyContextItems.length > 0 && (
            <div
              id={`dim-${dim.id}-context`}
              style={{
                marginBottom: "14px",
                fontSize: "14px",
                color: "#333",
                lineHeight: 1.5,
                background: "#f7fbf8",
                padding: "10px 12px",
                borderRadius: "6px",
                borderLeft: "3px solid #558b2f",
              }}
            >
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
                Key trade-offs &amp; confounders
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {keyContextItems.map((item) => (
                  <div key={item.label}>
                    <strong>{item.label}:</strong> {item.text}
                  </div>
                ))}
              </div>
            </div>
          )}
          {!isTracker && (dim.construct || scoring || scoringMetadata.length > 0) && (
            <div style={{ marginBottom: "14px" }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#1a1a1a",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span style={{ fontSize: "11px" }}>{isExpanded ? "\u25BE" : "\u25B8"}</span>
                How This File Is Scored
              </div>
              <div
                id={`dim-${dim.id}-scoring`}
                role="region"
                style={{
                  scrollMarginTop: "80px",
                  fontSize: "14px",
                  color: "#333",
                  lineHeight: 1.55,
                  background: "#f7f8fa",
                  padding: "12px 14px",
                  borderRadius: "6px",
                  borderLeft: "3px solid #607d8b",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {dim.construct && (
                  <div>
                    <strong>Construct:</strong> {dim.construct}
                  </div>
                )}
                {scoringMetadata.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {scoringMetadata.map((item) => (
                        <span
                          key={item.label}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "3px 8px",
                            borderRadius: "999px",
                            background: "#fff",
                            border: "1px solid #d9dde1",
                            fontSize: "12px",
                            color: "#5f6368",
                          }}
                        >
                          <strong style={{ color: "#444" }}>{item.label}:</strong> {item.value}
                        </span>
                      ))}
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setGlossaryOpen((v) => !v);
                        }}
                        aria-expanded={glossaryOpen}
                        aria-controls={`dim-${dim.id}-glossary`}
                        style={{
                          fontSize: "13px",
                          color: "#1565c0",
                          background: "none",
                          border: "none",
                          padding: "2px 0",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          fontWeight: 600,
                        }}
                      >
                        {glossaryOpen ? "▾ Hide definitions" : "▸ What do these mean?"}
                      </button>
                      {glossaryOpen && (
                        <div
                          id={`dim-${dim.id}-glossary`}
                          role="region"
                          style={{
                            marginTop: "4px",
                            padding: "8px 10px",
                            background: "#fff",
                            border: "1px dashed #d9dde1",
                            borderRadius: "6px",
                            fontSize: "13px",
                            color: "#444",
                            lineHeight: 1.55,
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <div>
                            <strong>Confidence</strong> — how robust the editor thinks this grade is to new data. <em>High</em> = direct measurement against numeric thresholds. <em>Medium</em> = qualitative judgment with mixed evidence. <em>Low</em> = sparse evidence.
                          </div>
                          <div>
                            <strong>Attribution</strong> — what share of the outcome the federal government actually controls. <em>Direct</em> = ≥60% federal levers. <em>Mixed</em> = 30–60%. <em>Mostly inherited</em> = &lt;30%.
                          </div>
                          <div>
                            <strong>Lag</strong> — how long policy effects take to show in the metrics. <em>Short</em> = monthly / quarterly. <em>Medium</em> = 1–2 year cycles. <em>Long</em> = 5+ year structural. <em>Event-driven</em> = the file moves on discrete disclosures or rulings rather than a fixed cadence.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {scoring?.scopeNote && (
                  <div>
                    <strong>Scope note:</strong> {scoring.scopeNote}
                  </div>
                )}
                {!isTracker && dim.judgmentDetail && (
                  <div>
                    <strong>Where judgment enters:</strong> {dim.judgmentDetail}
                  </div>
                )}
                {scoring?.modifierExpiry && (
                  <div>
                    <strong>Timing rule:</strong> {scoring.modifierExpiry}
                  </div>
                )}
                {scoring?.thresholds?.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <strong>Threshold ladder</strong>
                    {scoring.thresholds.map((threshold) => (
                      <div
                        key={threshold.grade}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "36px minmax(0, 1fr)",
                          gap: "8px",
                          alignItems: "start",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontWeight: 700,
                            color: "#1a1a1a",
                          }}
                        >
                          {threshold.grade}
                        </span>
                        <span>{threshold.criteria}</span>
                      </div>
                    ))}
                  </div>
                )}
                {dim.gradeTriggers && (
                  <div
                    id={`dim-${dim.id}-triggers-section`}
                    style={{ display: "flex", flexDirection: "column", gap: "6px", scrollMarginTop: "80px" }}
                  >
                    <strong>What changes this grade</strong>
                    <div>
                      <strong>Up one step:</strong>
                      <div style={{ marginTop: "4px", display: "flex", flexDirection: "column", gap: "4px" }}>
                        {dim.gradeTriggers.up.map((trigger, i) =>
                          renderTriggerItem(trigger, `drawer-up-${i}`)
                        )}
                      </div>
                    </div>
                    <div>
                      <strong>Down one step:</strong>
                      <div style={{ marginTop: "4px", display: "flex", flexDirection: "column", gap: "4px" }}>
                        {dim.gradeTriggers.down.map((trigger, i) =>
                          renderTriggerItem(trigger, `drawer-down-${i}`)
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {scoring?.guardrails?.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <strong>Guardrails</strong>
                    {scoring.guardrails.map((rule, i) => (
                      <div key={i} style={{ color: "#444" }}>
                        {rule}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

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
                {dim.gradeBasis.leverOperationalization && (
                  <details style={{ fontSize: "13px", color: "#444", marginTop: "4px" }}>
                    <summary style={{ cursor: "pointer", fontWeight: 600, color: "#1a3c5e" }}>
                      Per-lever status criteria ({dim.gradeBasis.leverOperationalization.length} levers — click to expand)
                    </summary>
                    <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      {dim.gradeBasis.leverOperationalization.map((lever, i) => (
                        <div key={i} style={{ borderLeft: "2px solid #c7d2fe", paddingLeft: "10px" }}>
                          <div style={{ fontWeight: 600, color: "#1a1a1a" }}>{lever.name}</div>
                          <div style={{ marginTop: "4px", lineHeight: 1.45 }}>
                            <div><strong>Announced if:</strong> {lever.announced}</div>
                            <div><strong>Authorized if:</strong> {lever.authorized}</div>
                            <div><strong>Executing if:</strong> {lever.executing}</div>
                            <div style={{ marginTop: "4px", color: "#1a3c5e" }}><strong>Current:</strong> {lever.currentStatus}</div>
                          </div>
                        </div>
                      ))}
                      {dim.gradeBasis.leverScoreSummary && (
                        <div style={{ marginTop: "4px", padding: "8px 10px", background: "#f6f9fc", borderRadius: "4px", fontSize: "12px", lineHeight: 1.5 }}>
                          <strong>Score summary:</strong> {dim.gradeBasis.leverScoreSummary}
                        </div>
                      )}
                    </div>
                  </details>
                )}
                {dim.gradeBasis.componentOperationalization && (
                  <details style={{ fontSize: "13px", color: "#444", marginTop: "4px" }}>
                    <summary style={{ cursor: "pointer", fontWeight: 600, color: "#1a3c5e" }}>
                      Per-component checklist ({dim.gradeBasis.componentOperationalization.length} components — click to expand)
                    </summary>
                    <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      {dim.gradeBasis.componentOperationalization.map((component, i) => (
                        <div key={i} style={{ borderLeft: "2px solid #c7d2fe", paddingLeft: "10px" }}>
                          <div style={{ fontWeight: 600, color: "#1a1a1a" }}>{component.name}</div>
                          <div style={{ marginTop: "4px", lineHeight: 1.45 }}>
                            <div><strong>Present if:</strong> {component.presentIfX}</div>
                            <div style={{ marginTop: "4px", color: "#1a3c5e" }}><strong>Current:</strong> {component.currentStatus}</div>
                          </div>
                        </div>
                      ))}
                      {dim.gradeBasis.componentScoreSummary && (
                        <div style={{ marginTop: "4px", padding: "8px 10px", background: "#f6f9fc", borderRadius: "4px", fontSize: "12px", lineHeight: 1.5 }}>
                          <strong>Score summary:</strong> {dim.gradeBasis.componentScoreSummary}
                        </div>
                      )}
                    </div>
                  </details>
                )}
                {dim.gradeBasis.combinationRule && (
                  <details style={{ fontSize: "13px", color: "#444", marginTop: "4px" }}>
                    <summary style={{ cursor: "pointer", fontWeight: 600, color: "#1a3c5e" }}>
                      Combination Rule (click to expand the full distribution table)
                    </summary>
                    <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "10px" }}>
                      <div>
                        <div style={{ fontWeight: 600, color: "#1a1a1a", marginBottom: "4px" }}>The five flagship files</div>
                        <ul style={{ margin: 0, paddingLeft: "18px", lineHeight: 1.5 }}>
                          {dim.gradeBasis.combinationRule.flagshipFiles.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "#1a1a1a", marginBottom: "4px" }}>File status categories</div>
                        {dim.gradeBasis.combinationRule.fileStatusCategories.map((cat, i) => (
                          <div key={i} style={{ marginBottom: "3px" }}>
                            <strong>{cat.status}:</strong> {cat.definition}
                          </div>
                        ))}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "#1a1a1a", marginBottom: "4px" }}>Distribution → grade</div>
                        <table style={{ fontSize: "12px", borderCollapse: "collapse", width: "100%" }}>
                          <thead>
                            <tr style={{ background: "#f6f9fc" }}>
                              <th style={{ textAlign: "left", padding: "4px 6px", border: "1px solid #e0e0e0" }}>Distribution</th>
                              <th style={{ textAlign: "left", padding: "4px 6px", border: "1px solid #e0e0e0" }}>Grade</th>
                              <th style={{ textAlign: "left", padding: "4px 6px", border: "1px solid #e0e0e0" }}>Logic</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dim.gradeBasis.combinationRule.distributionToGrade.map((row, i) => (
                              <tr key={i}>
                                <td style={{ padding: "4px 6px", border: "1px solid #e0e0e0" }}>{row.distribution}</td>
                                <td style={{ padding: "4px 6px", border: "1px solid #e0e0e0", fontWeight: 600 }}>{row.grade}</td>
                                <td style={{ padding: "4px 6px", border: "1px solid #e0e0e0" }}>{row.logic}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "#1a1a1a", marginBottom: "4px" }}>Current snapshot</div>
                        <table style={{ fontSize: "12px", borderCollapse: "collapse", width: "100%" }}>
                          <thead>
                            <tr style={{ background: "#f6f9fc" }}>
                              <th style={{ textAlign: "left", padding: "4px 6px", border: "1px solid #e0e0e0" }}>File</th>
                              <th style={{ textAlign: "left", padding: "4px 6px", border: "1px solid #e0e0e0" }}>Status</th>
                              <th style={{ textAlign: "left", padding: "4px 6px", border: "1px solid #e0e0e0" }}>Evidence</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dim.gradeBasis.combinationRule.currentSnapshot.map((row, i) => (
                              <tr key={i}>
                                <td style={{ padding: "4px 6px", border: "1px solid #e0e0e0" }}>{row.file}</td>
                                <td style={{ padding: "4px 6px", border: "1px solid #e0e0e0", fontWeight: 600 }}>{row.status}</td>
                                <td style={{ padding: "4px 6px", border: "1px solid #e0e0e0" }}>{row.evidence}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div style={{ marginTop: "6px", fontWeight: 600, color: "#1a3c5e" }}>
                          {dim.gradeBasis.combinationRule.currentDistribution} → {dim.gradeBasis.combinationRule.currentGradeFromRule}
                        </div>
                      </div>
                    </div>
                  </details>
                )}
                {modifierItems.length > 0 && (
                  <div style={{ fontSize: "14px", color: "#444" }}>
                    <strong>Scoring adjustments:</strong>
                    <div style={{ marginTop: "4px", display: "flex", flexDirection: "column", gap: "4px" }}>
                      {modifierItems.map((modifier, i) => (
                        <div key={i}>
                          <strong>{MODIFIER_LABELS[modifier.name] || modifier.name}</strong>: {modifier.status}. {modifier.reason}
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
          <div id={`dim-${dim.id}-metrics`} style={{ marginBottom: "14px", scrollMarginTop: "80px" }}>
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
              {/* The "Last reviewed" pill on the card face is the canonical
                  freshness marker — duplicating it here was redundant. */}
            </div>
            {metricGroups.map((group, groupIndex) => (
              <div
                key={group.title || `group-${groupIndex}`}
                style={{ marginTop: group.title ? "10px" : 0 }}
              >
                {group.title && (
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#666",
                      textTransform: "uppercase",
                      letterSpacing: "0.4px",
                      marginBottom: "4px",
                    }}
                  >
                    {group.title}
                  </div>
                )}
                {group.items.map((m, i) => (
                  <div
                    key={`${group.title || "metrics"}-${i}-${m.label}`}
                    style={{
                      fontSize: "13px",
                      color: "#444",
                      padding: "2px 0",
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <div style={{ fontFamily: "'DM Mono', monospace" }}>
                      {m.label}: {m.value}
                    </div>
                    {m.sourceRefs && m.sourceRefs.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "4px 8px",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "12px",
                          lineHeight: 1.35,
                        }}
                      >
                        {m.sourceRefs.map((sourceRef) => (
                          <a
                            key={`${m.label}-${sourceRef.url}`}
                            href={sourceRef.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              color: "#1565c0",
                              textDecoration: "none",
                              fontWeight: 600,
                            }}
                          >
                            Source: {sourceRef.label} &rarr;
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Project pipeline (cohort-based dimensions only — currently Major Projects) */}
          {cohort && cohort.projects && cohort.projects.length > 0 && (
            <ProjectCohortSection
              cohort={cohort}
              isOpen={cohortOpen}
              onToggle={(e) => {
                e.stopPropagation();
                setCohortOpen((v) => !v);
              }}
              dimId={dim.id}
            />
          )}

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

          {/* Tracker trigger traceability — kept separate from grade language. */}
          {isTracker && dim.gradeTriggers && (
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
                What Changes This Tracker
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#555",
                  lineHeight: 1.5,
                  background: "#fffaf0",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  borderLeft: "3px solid #bfa86b",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div>
                  <strong>Upward trigger:</strong>
                  <div style={{ marginTop: "4px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    {dim.gradeTriggers.up.map((trigger, i) =>
                      renderTriggerItem(trigger, `tracker-up-${i}`)
                    )}
                  </div>
                </div>
                <div>
                  <strong>Downward triggers:</strong>
                  <div style={{ marginTop: "4px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    {dim.gradeTriggers.down.map((trigger, i) =>
                      renderTriggerItem(trigger, `tracker-down-${i}`)
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Source Links */}
          {dim.sources && dim.sources.length > 0 && (
            <div id={`dim-${dim.id}-sources`} style={{ scrollMarginTop: "80px" }}>
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
                      color: "#1565c0",
                      textDecoration: "none",
                      background: "#e8f0fe",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      lineHeight: 1.4,
                    }}
                  >
                    {s.label} &rarr;
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* ─── More details: collapsibles stacked below the main flow ─── */}
          {(showLowerTriggers || dim.perspectives || dim.scope || dim.inherited) && (
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

              {showLowerTriggers && (
                <div id={`dim-${dim.id}-triggers-section`} style={{ marginBottom: "12px" }}>
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
                            {dim.gradeTriggers.up.map((trigger, i) =>
                              renderTriggerItem(trigger, `lower-up-${i}`)
                            )}
                          </div>
                        </div>
                        <div>
                          <strong>Down one step:</strong>
                          <div style={{ marginTop: "4px", display: "flex", flexDirection: "column", gap: "4px" }}>
                            {dim.gradeTriggers.down.map((trigger, i) =>
                              renderTriggerItem(trigger, `lower-down-${i}`)
                            )}
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
                <div id={`dim-${dim.id}-perspectives-section`} style={{ marginBottom: "12px", scrollMarginTop: "80px" }}>
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

// Renders the MPO project cohort: a header with the count and stage breakdown,
// plus a collapsible full project list. Desktop gets a compact table; mobile
// gets stacked cards so stage dates and source links are visible without
// sideways scrolling.
// `cohort.stageGates` orders the stages from least-advanced (designated) to
// most-advanced (completed); the table sorts in reverse so advanced projects
// surface first.
function ProjectCohortSection({ cohort, isOpen, onToggle, dimId }) {
  const stageGates = cohort.stageGates || [];
  const stageOrder = stageGates.reduce((acc, gate, i) => {
    acc[gate.key] = i;
    return acc;
  }, {});
  const stageLabels = stageGates.reduce((acc, gate) => {
    acc[gate.key] = gate.label;
    return acc;
  }, {});

  const STAGE_COLORS = {
    designated: { bg: "#eceff1", color: "#37474f", border: "#cfd8dc" },
    reviewed: { bg: "#e8eaf6", color: "#283593", border: "#c5cae9" },
    approved: { bg: "#e3f2fd", color: "#0d47a1", border: "#bbdefb" },
    permitted: { bg: "#fff3e0", color: "#e65100", border: "#ffe0b2" },
    under_construction: { bg: "#e8f5e9", color: "#1b5e20", border: "#c8e6c9" },
    completed: { bg: "#dcedc8", color: "#33691e", border: "#aed581" },
  };

  const total = cohort.projects.length;
  const designatedIndex = stageOrder.designated ?? 0;
  const aboveDesignated = cohort.projects.filter(
    (p) => (stageOrder[p.stage] ?? 0) > designatedIndex
  );
  const documentedAdvanced = aboveDesignated.filter(
    (p) => p.referredDate && p.stageDate && p.stageDate > p.referredDate
  );
  const aboveDesignatedCount = aboveDesignated.length;
  const documentedAdvancedCount = documentedAdvanced.length;
  const documentedAdvancedPct =
    total > 0 ? Math.round((documentedAdvancedCount / total) * 100) : 0;

  // Stage-by-stage counts for the headline summary line.
  const stageCounts = stageGates
    .map((gate) => ({
      key: gate.key,
      label: gate.label,
      count: cohort.projects.filter((p) => p.stage === gate.key).length,
    }))
    .filter((s) => s.count > 0);

  const sortedProjects = cohort.projects
    .slice()
    .sort((a, b) => {
      const sa = stageOrder[a.stage] ?? 0;
      const sb = stageOrder[b.stage] ?? 0;
      if (sa !== sb) return sb - sa;
      return a.name.localeCompare(b.name);
    });

  const stagePill = (stage) => {
    const c = STAGE_COLORS[stage] || STAGE_COLORS.designated;
    return (
      <span
        style={{
          display: "inline-block",
          padding: "2px 8px",
          borderRadius: "999px",
          background: c.bg,
          color: c.color,
          border: `1px solid ${c.border}`,
          fontSize: "12px",
          fontWeight: 700,
          whiteSpace: "nowrap",
        }}
      >
        {stageLabels[stage] || stage}
      </span>
    );
  };

  return (
    <div id={`dim-${dimId}-cohort`} style={{ marginBottom: "14px", scrollMarginTop: "80px" }}>
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
        Project pipeline
        <span
          style={{
            fontWeight: 400,
            textTransform: "none",
            letterSpacing: 0,
            marginLeft: "8px",
            color: "#666",
          }}
        >
          As of {cohort.asOf}
        </span>
      </div>
      <div
        style={{
          fontSize: "14px",
          color: "#333",
          lineHeight: 1.5,
          background: "#fafafa",
          padding: "10px 12px",
          borderRadius: "6px",
          borderLeft: "3px solid #607d8b",
        }}
      >
        <div style={{ marginBottom: "8px" }}>
          <strong>{total} projects in MPO cohort.</strong>{" "}
          {aboveDesignatedCount} currently sit above designated status;{" "}
          {documentedAdvancedCount} of {total} ({documentedAdvancedPct}%) have
          documented post-designation advancement.
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            marginBottom: "8px",
          }}
        >
          {stageCounts.map((s) => (
            <span key={s.key} style={{ display: "inline-flex", gap: "4px" }}>
              {stagePill(s.key)}
              <span style={{ fontSize: "13px", color: "#444", fontWeight: 600 }}>
                ×{s.count}
              </span>
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`dim-${dimId}-cohort-list`}
          style={{
            fontSize: "13px",
            color: "#1565c0",
            background: "none",
            border: "none",
            padding: "2px 0",
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 700,
          }}
        >
          {isOpen ? "▾ Hide full project list" : "▸ Show full project list"}
        </button>
        {isOpen && (
          <div id={`dim-${dimId}-cohort-list`} style={{ marginTop: "8px" }}>
            <div className="cohort-mobile-projects" aria-label="Full Major Projects cohort list">
              {sortedProjects.map((p, i) => (
                <article
                  key={`${p.name}-card-${i}`}
                  className="cohort-mobile-project-card"
                >
                  <div className="cohort-mobile-project-head">
                    <div>
                      <strong>{p.name}</strong>
                      {p.location && <span>{p.location}</span>}
                    </div>
                    {stagePill(p.stage)}
                  </div>
                  <dl className="cohort-mobile-project-facts">
                    <div>
                      <dt>Tranche</dt>
                      <dd>{p.tranche}</dd>
                    </div>
                    <div>
                      <dt>Stage date</dt>
                      <dd>{p.stageDate}</dd>
                    </div>
                    {p.sourceUrl && (
                      <div>
                        <dt>Source</dt>
                        <dd>
                          <a
                            href={p.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Open source →
                          </a>
                        </dd>
                      </div>
                    )}
                  </dl>
                </article>
              ))}
            </div>
            <div
              id={`dim-${dimId}-cohort-table`}
              role="region"
              className="cohort-table-wrap"
              style={{ overflowX: "auto" }}
            >
            <table
              style={{
                width: "100%",
                minWidth: "560px",
                borderCollapse: "collapse",
                fontSize: "13px",
              }}
            >
              <thead>
                <tr style={{ color: "#777", textAlign: "left" }}>
                  <th style={{ padding: "4px 6px", fontWeight: 700 }}>Project</th>
                  <th style={{ padding: "4px 6px", fontWeight: 700 }}>Tranche</th>
                  <th style={{ padding: "4px 6px", fontWeight: 700 }}>Stage</th>
                  <th style={{ padding: "4px 6px", fontWeight: 700 }}>
                    Stage date
                  </th>
                  <th style={{ padding: "4px 6px", fontWeight: 700 }}>Source</th>
                </tr>
              </thead>
              <tbody>
                {sortedProjects.map((p, i) => (
                  <tr
                    key={`${p.name}-${i}`}
                    style={{ borderTop: "1px solid #eee", color: "#333" }}
                  >
                    <td style={{ padding: "4px 6px" }}>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      {p.location && (
                        <div style={{ fontSize: "12px", color: "#777" }}>
                          {p.location}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "4px 6px", color: "#777" }}>
                      {p.tranche}
                    </td>
                    <td style={{ padding: "4px 6px" }}>{stagePill(p.stage)}</td>
                    <td style={{ padding: "4px 6px", color: "#777" }}>
                      {p.stageDate}
                    </td>
                    <td style={{ padding: "4px 6px" }}>
                      {p.sourceUrl && (
                        <a
                          href={p.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            color: "#1565c0",
                            fontSize: "12px",
                            fontWeight: 600,
                            textDecoration: "none",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Source →
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

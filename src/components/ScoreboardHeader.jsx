import GradeChip from "./GradeChip";
import ScoreDerivation from "./ScoreDerivation";
import { ApprovalCard, ApprovalDetail } from "./ApprovalSignal";
import { STATUS_COLORS } from "../constants";

// Fixed leading order for the promise-status mini bar; any other status
// present in the data follows in its data order. Zero-count statuses are
// skipped so the bar never renders zero-width segments.
const STATUS_BAR_ORDER = ["Delivered", "In Progress", "Stalled", "Abandoned"];

// Shared card container style so the four scoreboard cards have identical
// size, spacing, and alignment. Each card is a subgrid spanning the row's
// four shared tracks (title / subtitle / stat block / footer), so the same
// slot lands at the same y-position on every card no matter how many lines
// its copy wraps to. Column counts per viewport live in index.css.
const cardBase = {
  background: "var(--surface-card)",
  border: "1px solid var(--border-subtle)",
  borderRadius: "var(--card-radius)",
  boxShadow: "var(--shadow-card)",
  padding: "20px 20px 18px",
  textAlign: "center",
  display: "grid",
  gridTemplateRows: "subgrid",
  gridRow: "span 4",
};

const cardTitle = {
  fontSize: "15px",
  fontWeight: 700,
  color: "#1a1a1a",
  textTransform: "uppercase",
  letterSpacing: "0.6px",
  marginBottom: "6px",
};

const cardSubtitle = {
  fontSize: "14px",
  color: "#444",
  fontStyle: "italic",
  lineHeight: 1.4,
  marginBottom: "12px",
};

const cardScoreCaption = {
  fontSize: "14px",
  color: "#333",
  marginTop: "10px",
  fontFamily: "'DM Mono', monospace",
  fontWeight: 600,
};

const cardScoreNote = {
  fontSize: "12px",
  color: "#666",
  marginTop: "6px",
  lineHeight: 1.35,
};

const derivationToggleBase = {
  fontSize: "13px",
  color: "#1565c0",
  fontWeight: 700,
  background: "none",
  border: "none",
  padding: "4px 6px",
  cursor: "pointer",
  fontFamily: "inherit",
  borderRadius: "4px",
  alignSelf: "center",
};

function DerivationToggle({ variant, derivationOpen, onToggle }) {
  const isOpen = derivationOpen === variant;
  return (
    <button
      type="button"
      onClick={() => onToggle(variant)}
      aria-expanded={isOpen}
      aria-controls={`score-derivation-${variant}`}
      style={derivationToggleBase}
    >
      {isOpen ? "▾ Hide score math" : "▸ How is this score built?"}
    </button>
  );
}

export default function ScoreboardHeader({
  overallGrade,
  overallGPA,
  pocketbookGrade,
  pocketbookGPA,
  promiseCounts,
  totalPromises,
  onOpenPromises,
  approvalExpanded,
  onToggleApproval,
  derivationOpen,
  onToggleDerivation,
  overallDerivation,
  pocketbookDerivation,
}) {
  const delivered = promiseCounts["Delivered"] || 0;
  const pct = totalPromises > 0 ? delivered / totalPromises : 0;
  const promiseNumColor =
    pct >= 0.6 ? "#1a7a3a" : pct >= 0.3 ? "#8d5a00" : "#c62828";

  // Statuses shown in the mini distribution bar, in fixed order first, then
  // any remaining statuses in data order. barSummary states the same counts
  // in words so the bar is never color-only.
  const barStatuses = [
    ...STATUS_BAR_ORDER,
    ...Object.keys(promiseCounts).filter((s) => !STATUS_BAR_ORDER.includes(s)),
  ].filter((s) => (promiseCounts[s] || 0) > 0);
  const barSummary = barStatuses
    .map((s) => `${promiseCounts[s]} ${s.toLowerCase()}`)
    .join(", ");

  return (
    <div style={{ marginBottom: "var(--space-5)" }}>
      <div
        className="scoreboard-card-row"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "var(--space-4)",
          marginBottom: "var(--space-3)",
        }}
      >
        {/* Household Impact */}
        <div className="scoreboard-card scoreboard-card-household" style={cardBase}>
          <div className="scoreboard-card-title" style={cardTitle}>Household Impact</div>
          <div className="scoreboard-card-subtitle" style={cardSubtitle}>
            How the government is performing on housing, cost of living, the economy, and spending.
          </div>
          <div className="scoreboard-card-main" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <GradeChip grade={pocketbookGrade} size="lg" />
            <div style={cardScoreCaption}>Score: {pocketbookGPA}</div>
            <div style={cardScoreNote}>Depends on weighting choices. Score math is below.</div>
          </div>
          {onToggleDerivation && (
            <div className="scoreboard-card-footer">
              <DerivationToggle
                variant="household"
                derivationOpen={derivationOpen}
                onToggle={onToggleDerivation}
              />
            </div>
          )}
        </div>
        {derivationOpen === "household" && pocketbookDerivation && (
          <div className="scoreboard-detail scoreboard-detail-household">
            <ScoreDerivation
              variant="household"
              derivation={pocketbookDerivation}
              displayedScore={pocketbookGPA}
            />
          </div>
        )}

        {/* Full Policy Audit */}
        <div className="scoreboard-card scoreboard-card-overall" style={cardBase}>
          <div className="scoreboard-card-title" style={cardTitle}>Full Policy Audit</div>
          <div className="scoreboard-card-subtitle" style={cardSubtitle}>
            How the Carney government is performing across all 11 policy areas.
          </div>
          <div className="scoreboard-card-main" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <GradeChip grade={overallGrade} size="lg" />
            <div style={cardScoreCaption}>Score: {overallGPA}</div>
            <div style={cardScoreNote}>Depends on weighting choices. Score math is below.</div>
          </div>
          {onToggleDerivation && (
            <div className="scoreboard-card-footer">
              <DerivationToggle
                variant="overall"
                derivationOpen={derivationOpen}
                onToggle={onToggleDerivation}
              />
            </div>
          )}
        </div>
        {derivationOpen === "overall" && overallDerivation && (
          <div className="scoreboard-detail scoreboard-detail-overall">
            <ScoreDerivation
              variant="overall"
              derivation={overallDerivation}
              displayedScore={overallGPA}
            />
          </div>
        )}

        {/* Promises Delivered - clickable: navigates to the full Promises view */}
        <button
          type="button"
          onClick={onOpenPromises}
          className="scoreboard-card scoreboard-card-promises"
          style={{
            ...cardBase,
            cursor: onOpenPromises ? "pointer" : "default",
            font: "inherit",
            color: "inherit",
            width: "100%",
          }}
        >
          <div className="scoreboard-card-title" style={cardTitle}>Promises Delivered</div>
          <div className="scoreboard-card-subtitle" style={cardSubtitle}>
            A running count of tracked government commitments across every policy area.
          </div>
          <div className="scoreboard-card-main" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "40px",
                fontWeight: 800,
                color: promiseNumColor,
                lineHeight: 1.1,
              }}
            >
              {delivered}
              <span style={{ fontSize: "20px", color: "#666" }}>/{totalPromises}</span>
            </div>
            {/* Mini status distribution bar. Lives inside the stat-block
                subgrid track, so the card still spans the same four shared
                rows. Segment colors are the existing STATUS_COLORS foreground
                values; like the .app-promise-status chips, they get no
                dark-mode override and render as-is on the dark card. Counts
                are restated in words via aria-label and title so the bar is
                not color-only. Static by design: no animation. */}
            {totalPromises > 0 && (
              <div
                aria-hidden="true"
                title={barSummary}
                style={{
                  display: "flex",
                  gap: "2px",
                  width: "100%",
                  height: "8px",
                  marginTop: "10px",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                {barStatuses.map((status) => (
                  <div
                    key={status}
                    style={{
                      flex: `${promiseCounts[status]} 0 0`,
                      background: (STATUS_COLORS[status] || STATUS_COLORS.Unclear)
                        .color,
                    }}
                  />
                ))}
              </div>
            )}
            {/* The bar itself is aria-hidden (child semantics inside a button
                are unreliably exposed); this visually-hidden text carries the
                same counts into the button's accessible name instead. */}
            {totalPromises > 0 && (
              <span
                style={{
                  position: "absolute",
                  width: "1px",
                  height: "1px",
                  padding: 0,
                  margin: "-1px",
                  overflow: "hidden",
                  clip: "rect(0, 0, 0, 0)",
                  whiteSpace: "nowrap",
                  border: 0,
                }}
              >
                {barSummary}
              </span>
            )}
            <div style={{ ...cardScoreCaption, color: "#555" }}>
              {promiseCounts["Abandoned"] || 0} abandoned &middot;{" "}
              {promiseCounts["Stalled"] || 0} stalled
            </div>
          </div>
          <div className="scoreboard-card-footer">
            <span style={derivationToggleBase}>&#9656; See all promises</span>
          </div>
        </button>

        {/* Approval Signal card (shares cardBase + title styles via props) */}
        <ApprovalCard
          expanded={!!approvalExpanded}
          onToggle={onToggleApproval}
          cardClassName="scoreboard-card-approval"
          cardStyle={cardBase}
          titleStyle={cardTitle}
          subtitleStyle={cardSubtitle}
          captionStyle={cardScoreCaption}
        />
        {approvalExpanded && (
          <div className="scoreboard-detail scoreboard-detail-approval">
            <ApprovalDetail />
          </div>
        )}
      </div>

    </div>
  );
}

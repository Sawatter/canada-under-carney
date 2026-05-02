import GradeChip from "./GradeChip";
import { ApprovalCard } from "./ApprovalSignal";

// Shared card container style so the four scoreboard cards have identical
// size, spacing, and alignment. justifyContent is flex-start so every card's
// title sits at the same y-position, regardless of how tall the main content
// area is.
const cardBase = {
  background: "#fff",
  border: "1px solid #e0e0e0",
  borderRadius: "12px",
  padding: "20px 20px 18px",
  textAlign: "center",
  flex: "1 1 220px",
  maxWidth: "280px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "stretch",
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

const derivationToggleBase = {
  fontSize: "13px",
  color: "#1a73e8",
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
  approvalExpanded,
  onToggleApproval,
  derivationOpen,
  onToggleDerivation,
}) {
  const delivered = promiseCounts["Delivered"] || 0;
  const pct = totalPromises > 0 ? delivered / totalPromises : 0;
  const promiseNumColor =
    pct >= 0.6 ? "#1a7a3a" : pct >= 0.3 ? "#e68a00" : "#c62828";

  return (
    <div style={{ marginBottom: "24px" }}>
      <div
        style={{
          display: "flex",
          gap: "16px",
          justifyContent: "center",
          alignItems: "stretch",
          flexWrap: "wrap",
          marginBottom: "12px",
        }}
      >
        {/* Household Impact */}
        <div className="scoreboard-card" style={cardBase}>
          <div className="scoreboard-card-title" style={cardTitle}>Household Impact</div>
          <div className="scoreboard-card-subtitle" style={cardSubtitle}>
            How the government is performing on housing, cost of living, the economy, and spending.
          </div>
          <div className="scoreboard-card-main" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <GradeChip grade={pocketbookGrade} size="lg" />
            <div style={cardScoreCaption}>Score: {pocketbookGPA}</div>
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

        {/* Full Policy Audit */}
        <div className="scoreboard-card" style={cardBase}>
          <div className="scoreboard-card-title" style={cardTitle}>Full Policy Audit</div>
          <div className="scoreboard-card-subtitle" style={cardSubtitle}>
            How the Carney government is performing across all 11 policy areas.
          </div>
          <div className="scoreboard-card-main" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <GradeChip grade={overallGrade} size="lg" />
            <div style={cardScoreCaption}>Score: {overallGPA}</div>
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

        {/* Promises Delivered */}
        <div className="scoreboard-card" style={cardBase}>
          <div className="scoreboard-card-title" style={cardTitle}>Promises Delivered</div>
          <div className="scoreboard-card-subtitle" style={cardSubtitle}>
            A running count of tracked government commitments across every dimension.
          </div>
          <div className="scoreboard-card-main" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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
              <span style={{ fontSize: "20px", color: "#999" }}>/{totalPromises}</span>
            </div>
            <div style={{ ...cardScoreCaption, color: "#555" }}>
              {promiseCounts["Abandoned"] || 0} abandoned &middot;{" "}
              {promiseCounts["Stalled"] || 0} stalled
            </div>
          </div>
        </div>

        {/* Approval Signal card (shares cardBase + title styles via props) */}
        <ApprovalCard
          expanded={!!approvalExpanded}
          onToggle={onToggleApproval}
          cardStyle={cardBase}
          titleStyle={cardTitle}
          subtitleStyle={cardSubtitle}
          captionStyle={cardScoreCaption}
        />
      </div>

    </div>
  );
}

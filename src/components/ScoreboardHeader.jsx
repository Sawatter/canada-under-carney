import GradeChip from "./GradeChip";

export default function ScoreboardHeader({
  overallGrade,
  overallGPA,
  pocketbookGrade,
  pocketbookGPA,
  promiseCounts,
  totalPromises,
}) {
  return (
    <div style={{ marginBottom: "24px" }}>
      {/* Grade boxes row */}
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
        <div
          style={{
            background: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: "12px",
            padding: "20px 32px",
            textAlign: "center",
            flex: "1 1 220px",
            maxWidth: "280px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#999",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "4px",
            }}
          >
            Household Impact
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "#999",
              marginBottom: "8px",
              fontStyle: "italic",
              lineHeight: 1.3,
            }}
          >
            How the government is performing on housing, cost of living, the economy, and spending.
          </div>
          <GradeChip grade={pocketbookGrade} size="lg" />
          <div
            style={{
              fontSize: "11px",
              color: "#888",
              marginTop: "8px",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            Score: {pocketbookGPA}
          </div>
        </div>

        {/* Full Policy Audit */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: "12px",
            padding: "20px 32px",
            textAlign: "center",
            flex: "1 1 220px",
            maxWidth: "280px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#999",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "4px",
            }}
          >
            Full Policy Audit
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "#999",
              marginBottom: "8px",
              fontStyle: "italic",
              lineHeight: 1.3,
            }}
          >
            How the Carney government is performing across all 11 policy areas.
          </div>
          <GradeChip grade={overallGrade} size="lg" />
          <div
            style={{
              fontSize: "11px",
              color: "#888",
              marginTop: "8px",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            Score: {overallGPA}
          </div>
        </div>

        {/* Promises Delivered */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: "12px",
            padding: "20px 32px",
            textAlign: "center",
            flex: "1 1 220px",
            maxWidth: "280px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#999",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "8px",
            }}
          >
            Promises Delivered
          </div>
          {(() => {
            const delivered = promiseCounts["Delivered"] || 0;
            const pct = totalPromises > 0 ? delivered / totalPromises : 0;
            // Color: green >60%, amber 30-60%, red <30%
            const numColor = pct >= 0.6 ? "#1a7a3a" : pct >= 0.3 ? "#e68a00" : "#c62828";
            return (
              <>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "36px",
                    fontWeight: 800,
                    color: numColor,
                    lineHeight: 1.2,
                  }}
                >
                  {delivered}
                  <span style={{ fontSize: "18px", color: "#999" }}>
                    /{totalPromises}
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "#888", marginTop: "8px" }}>
                  {promiseCounts["Abandoned"] || 0} abandoned &middot;{" "}
                  {promiseCounts["Stalled"] || 0} stalled
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

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
            minWidth: "200px",
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
            Focused on housing, cost of living, the economy, and government spending.
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
            GPA: {pocketbookGPA}
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
            minWidth: "200px",
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
            Overall grade. All 11 policy areas count equally.
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
            GPA: {overallGPA}
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
            minWidth: "180px",
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

      {/* Method note */}
      <div
        style={{
          fontSize: "13px",
          color: "#555",
          lineHeight: 1.6,
          maxWidth: "720px",
          margin: "0 auto",
          padding: "14px 20px",
          background: "#f8f8f8",
          borderRadius: "8px",
          border: "1px solid #e8e8e8",
          textAlign: "left",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: "14px",
            color: "#333",
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          Why two grades?
        </div>
        <p style={{ margin: "0 0 10px" }}>
          The government does a lot of different things. We grade it across
          11 areas — defence, immigration, climate, housing, the cost of
          living, ethics, and more.
        </p>
        <p style={{ margin: "0 0 6px" }}>
          <strong style={{ color: "#333" }}>Full Policy Audit</strong> is the
          overall grade. All 11 areas count equally.
        </p>
        <p style={{ margin: "0 0 6px" }}>
          <strong style={{ color: "#333" }}>Household Impact</strong> doubles
          the weight of the four areas you feel in your own life:
        </p>
        <ul style={{ margin: "0 0 10px", paddingLeft: "22px" }}>
          <li>
            <strong>Housing</strong> — can you afford a place to live
          </li>
          <li>
            <strong>Cost of living</strong> — are groceries and everyday bills
            under control
          </li>
          <li>
            <strong>The economy</strong> — are jobs, wages, and productivity
            going the right way
          </li>
          <li>
            <strong>Government spending</strong> — is the fiscal picture under
            control
          </li>
        </ul>
        <p style={{ margin: "0 0 10px" }}>
          The other seven areas still count — just not double.{" "}
          <strong style={{ color: "#333" }}>
            Promises Delivered is tracked separately
          </strong>{" "}
          and doesn't feed either grade.
        </p>
        <p style={{ margin: 0 }}>
          <strong style={{ color: "#333" }}>
            If the two grades don't match, that's the point.
          </strong>{" "}
          A government can do well on big-picture things like defence or
          climate and badly on the cost of your life, or the other way around.
          Showing both grades means you can see the difference.
        </p>
      </div>
    </div>
  );
}

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
              marginBottom: "8px",
            }}
          >
            Household Impact
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
              marginBottom: "8px",
            }}
          >
            Full Policy Audit
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
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "36px",
              fontWeight: 800,
              color: "#1a7a3a",
              lineHeight: 1.2,
            }}
          >
            {promiseCounts["Delivered"] || 0}
            <span style={{ fontSize: "18px", color: "#999" }}>
              /{totalPromises}
            </span>
          </div>
          <div style={{ fontSize: "12px", color: "#888", marginTop: "8px" }}>
            {promiseCounts["Abandoned"] || 0} abandoned &middot;{" "}
            {promiseCounts["Stalled"] || 0} stalled
          </div>
        </div>
      </div>

      {/* Method note */}
      <div
        style={{
          textAlign: "center",
          fontSize: "11px",
          color: "#999",
          lineHeight: 1.5,
          maxWidth: "720px",
          margin: "0 auto",
        }}
      >
        <strong style={{ color: "#777" }}>Why two grades?</strong>{" "}
        The Household Impact grade weights the issues Canadians feel most
        directly: housing, grocery prices, GDP &amp; productivity, and fiscal
        health. The Full Policy Audit weights all 12 dimensions equally,
        including defence, trade, climate, immigration, ethics, and execution.
        A government can perform better on statecraft than on affordability.
        We show both.
      </div>
    </div>
  );
}

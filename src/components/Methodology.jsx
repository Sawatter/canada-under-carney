import meta from "../data/meta.json";

export default function Methodology() {
  const ranges = [
    {
      range: "A Range (3.7\u20134.0)",
      title: "Target Met or Exceeded",
      desc: "Specific target set, funded, and independently confirmed. Credit-claiming supported by evidence.",
      color: "#1a7a3a",
    },
    {
      range: "B Range (2.7\u20133.3)",
      title: "Clear Progress, Credible Trajectory",
      desc: "Substantive response with measurable progress. Gap between commitment and result is explainable by timing or jurisdiction.",
      color: "#558b2f",
    },
    {
      range: "C Range (1.7\u20132.3)",
      title: "Response Exists, Falls Materially Short",
      desc: "Policy framework in place but delivery significantly below targets. Credit-claiming exceeds results. Some repackaging.",
      color: "#e68a00",
    },
    {
      range: "D Range (0.7\u20131.3)",
      title: "Minimal or Inadequate Response",
      desc: "Response is minimal relative to scale. Structural trajectory unchanged. Lived experience of Canadians not improved.",
      color: "#c62828",
    },
    {
      range: "F (0.0)",
      title: "No Response or Active Deterioration",
      desc: "No action on acknowledged problem or policy actively worsened inherited condition. Not used for genuine external constraints.",
      color: "#880e0e",
    },
  ];

  const modifiers = [
    {
      name: "Timing fairness",
      desc: "Grades trajectory rather than current outcomes on long-lag files. Expires after 24 months.",
      effect: "Grade reflects trajectory, not current outcomes",
      color: "#1565c0",
    },
    {
      name: "Jurisdictional limits",
      desc: "Applied where more than 50% of delivery depends on non-federal actors without a funded agreement.",
      effect: "Caps the grade at C+",
      color: "#6a1b9a",
    },
    {
      name: "External constraint",
      desc: "Applied where trade war or similar forces demonstrably limit achievable outcomes. Does not cover excess reversals.",
      effect: "+0.3 GPA",
      color: "#2e7d32",
    },
    {
      name: "Credit-claiming penalty",
      desc: "Applied where overclaiming is documented by independent sources.",
      effect: "-0.3 GPA",
      color: "#d84315",
    },
  ];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        border: "1px solid #e0e0e0",
        padding: "24px",
      }}
    >
      <h2
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "22px",
          margin: "0 0 16px",
          color: "#1a1a1a",
        }}
      >
        Scoring Rubric v{meta.rubricVersion}
      </h2>
      <div style={{ fontSize: "13px", lineHeight: 1.7, color: "#444" }}>
        <p style={{ marginBottom: "16px" }}>
          The dashboard tracks 12 policy dimensions total: 11 are graded on a
          standard 4.0 GPA scale, and Promise Delivery is presented separately as
          an ungraded accountability tracker. Grades reflect what the government
          chose to do and how well it executed, not what it inherited. The standard
          for &ldquo;adequate&rdquo; is threefold: (1) Does the response match the scale of
          the problem? (2) Is measurable progress occurring? (3) Is the direction
          likely to close the gap?
        </p>

        {ranges.map((g, i) => (
          <div
            key={i}
            style={{
              borderLeft: `3px solid ${g.color}`,
              paddingLeft: "12px",
              marginBottom: "12px",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: "13px", color: g.color }}>
              {g.range}: {g.title}
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>{g.desc}</div>
          </div>
        ))}

        <div
          style={{
            marginTop: "20px",
            marginBottom: "10px",
            fontSize: "13px",
            fontWeight: 700,
            color: "#333",
          }}
        >
          Grade adjustments
        </div>
        {modifiers.map((m, i) => (
          <div
            key={i}
            style={{
              borderLeft: `3px solid ${m.color}`,
              paddingLeft: "12px",
              marginBottom: "12px",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: "13px", color: m.color }}>
              {m.name}
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>{m.desc}</div>
            <div
              style={{
                fontSize: "11px",
                color: "#888",
                marginTop: "2px",
                fontStyle: "italic",
              }}
            >
              Effect: {m.effect}
            </div>
          </div>
        ))}

        <p style={{ marginTop: "16px", fontSize: "12px", color: "#888" }}>
          <strong>Whole-letter dimensions:</strong> Ethics &amp; Transparency
          and Flagship Delivery are graded on whole letters only (A through F,
          no plus/minus variants). Their score contribution matches the
          displayed whole letter.
        </p>
        <p style={{ fontSize: "12px", color: "#888" }}>
          <strong>Weighting:</strong> Both headline scores are built from the
          same 11 graded dimensions, with different weightings — Full Policy
          Audit treats them equally, Household Impact doubles the four
          household-facing files. See the About tab for the plain-language
          breakdown.
        </p>
        <p style={{ fontSize: "12px", color: "#888" }}>
          <strong>Commitment traceability:</strong> Commitments from campaign
          platforms, budgets, throne speeches, mandate letters, and official
          public announcements are mapped through a published{" "}
          <a
            href="https://github.com/Sawatter/canada-under-carney/blob/main/docs/Commitment-Traceability-Map.md"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1a73e8" }}
          >
            Commitment Traceability Map
          </a>
          . It shows the path from commitment source to home dimension,
          construct, indicators, source roles, deconfliction notes, and
          derivative handling without creating a separate scoring layer.
        </p>
      </div>
    </div>
  );
}

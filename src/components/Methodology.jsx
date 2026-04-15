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
        Scoring Rubric v1.0
      </h2>
      <div style={{ fontSize: "13px", lineHeight: 1.7, color: "#444" }}>
        <p style={{ marginBottom: "16px" }}>
          Each of 12 policy dimensions is graded on a standard 4.0 GPA scale.
          Grades reflect what the government chose to do and how well it
          executed, not what it inherited. The standard for &ldquo;adequate&rdquo; is
          threefold: (1) Does the response match the scale of the problem? (2) Is
          measurable progress occurring? (3) Is the direction likely to close the
          gap?
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

        <p style={{ marginTop: "16px", fontSize: "12px", color: "#888" }}>
          <strong>Modifiers:</strong> Timing fairness (13 months vs. structural),
          jurisdictional limits (shared federal-provincial), external constraint
          (trade war), credit-claiming penalty (pre-existing momentum). Grade
          changes require documented evidence and rubric citation.
        </p>
        <p style={{ fontSize: "12px", color: "#888" }}>
          <strong>Weighting:</strong> The headline grade is unweighted across all
          12 dimensions. The pocketbook-weighted grade double-weights Fiscal
          Health, Housing, Grocery Prices, and GDP &amp; Productivity. Both are
          published; the choice of weighting is an editorial judgment disclosed
          transparently.
        </p>
      </div>
    </div>
  );
}

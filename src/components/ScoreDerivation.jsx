// Renders the math behind a headline score so a reader can check how the
// numeric value is built from the per-policy-area grades. Mirrors the
// ApprovalDetail pattern: lives below the scoreboard row, visible only when
// the corresponding card's toggle is open.
//
// Two flavours via the `variant` prop:
//   - "household"  -> pocketbook-weighted (4 areas x 2 + 7 areas x 1 = 15)
//   - "overall"    -> equal-weight Full Policy Audit (11 areas x 1 = 11)

const TITLES = {
  household: "How Household Impact is built",
  overall: "How Full Policy Audit is built",
};

const FORMULAS = {
  household:
    "Household Impact starts with each policy area's grade points. Housing, cost of living, the economy, and government spending each count twice. The other seven policy areas count once. The total is divided by the total weight.",
  overall:
    "Full Policy Audit gives each of the 11 graded policy areas equal weight. Add their grade points, then divide by 11. The Promise Delivery tracker is excluded.",
};

const DETAIL_ID_PREFIX = "score-derivation-";

function fmt(n, decimals = 1) {
  return Number(n).toFixed(decimals);
}

export default function ScoreDerivation({ variant, derivation, displayedScore }) {
  const title = TITLES[variant];
  const formula = FORMULAS[variant];
  const isHousehold = variant === "household";

  const weighted = derivation.dimensions.filter((d) => d.weight === 2);
  const single = derivation.dimensions.filter((d) => d.weight === 1);
  const numWeighted = weighted.length;
  const numSingle = single.length;

  const weightedSubtotal = weighted.reduce((a, b) => a + b.contribution, 0);
  const singleSubtotal = single.reduce((a, b) => a + b.contribution, 0);

  const exactScore = derivation.finalScore;
  const finalGrade = derivation.finalGrade;

  return (
    <div
      id={`${DETAIL_ID_PREFIX}${variant}`}
      role="region"
      aria-label={title}
      style={{
        background: "#fafafa",
        border: "1px dashed #c8c8c8",
        borderRadius: "10px",
        padding: "14px 18px",
        marginTop: "-8px",
        marginBottom: "16px",
        scrollMarginTop: "16px",
        fontSize: "13px",
        color: "#444",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          flexWrap: "wrap",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#333",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: "13px", color: "#666" }}>
          Built from policy-area grades
        </div>
      </div>

      <div
        style={{
          fontSize: "14px",
          color: "#555",
          lineHeight: 1.5,
          marginBottom: "12px",
        }}
      >
        {formula}
      </div>

      {isHousehold && weighted.length > 0 && (
        <DerivationGroup
          heading={`Daily-life files (x2 each, ${numWeighted} policy area${
            numWeighted === 1 ? "" : "s"
          })`}
          rows={weighted}
          subtotalLabel={`Subtotal: ${formatRowMath(weighted, 2)} = ${fmt(
            weightedSubtotal,
            2
          )}`}
        />
      )}

      <DerivationGroup
        heading={
          isHousehold
            ? `Other policy areas (x1 each, ${numSingle} policy area${
                numSingle === 1 ? "" : "s"
              })`
            : `All graded policy areas (x1 each, ${numSingle} policy area${
                numSingle === 1 ? "" : "s"
              })`
        }
        rows={single}
        subtotalLabel={`Subtotal: ${formatRowMath(single, 1)} = ${fmt(
          singleSubtotal,
          2
        )}`}
      />

      <div
        style={{
          marginTop: "12px",
          paddingTop: "10px",
          borderTop: "1px dashed #d4d4d4",
          fontSize: "14px",
          color: "#333",
          lineHeight: 1.7,
          fontFamily: "'DM Mono', monospace",
        }}
      >
        {isHousehold ? (
          <>
            <div>
              Weighted total: {fmt(weightedSubtotal, 2)} (x2 group) +{" "}
              {fmt(singleSubtotal, 2)} (x1 group) ={" "}
              <strong>{fmt(derivation.weightedSum, 2)}</strong>
            </div>
            <div>
              Total weight: {numWeighted}x2 + {numSingle}x1 ={" "}
              <strong>{derivation.totalWeight}</strong>
            </div>
          </>
        ) : (
          <>
            <div>
              Total grade points:{" "}
              <strong>{fmt(derivation.weightedSum, 2)}</strong>
            </div>
            <div>
              Policy areas: <strong>{derivation.totalWeight}</strong>
            </div>
          </>
        )}
        <div>
          Score: {fmt(derivation.weightedSum, 2)} / {derivation.totalWeight} ={" "}
          <strong>{fmt(exactScore, 2)}</strong>, rounded to{" "}
          <strong>{fmt(exactScore, 1)}</strong>, which maps to{" "}
          <strong>{finalGrade}</strong>
        </div>
        {displayedScore && fmt(exactScore, 1) !== displayedScore && (
          <div style={{ color: "#666", fontSize: "13px", marginTop: "4px" }}>
            (Card shows {displayedScore} after one-decimal rounding.)
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: "12px",
          fontSize: "13px",
          color: "#777",
          lineHeight: 1.5,
        }}
      >
        Grade points follow the standard 4.0 scale (A = 4.0, A- = 3.7, B+ =
        3.3, down to D = 1.0 and F = 0). Letter-grade bands at the bottom of
        the calculation use the published rubric cutoffs in the Rubric tab.
      </div>
    </div>
  );
}

// One section of the score table: heading, policy-area rows, subtotal line.
function DerivationGroup({ heading, rows, subtotalLabel }) {
  if (rows.length === 0) return null;
  return (
    <div style={{ marginBottom: "10px" }}>
      <div
        style={{
          fontSize: "13px",
          fontWeight: 700,
          color: "#666",
          textTransform: "uppercase",
          letterSpacing: "0.4px",
          marginBottom: "6px",
        }}
      >
        {heading}
      </div>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          <thead>
            <tr style={{ color: "#777", textAlign: "left" }}>
              <th style={{ padding: "4px 6px", fontWeight: 700 }}>Policy area</th>
              <th style={{ padding: "4px 6px", fontWeight: 700 }}>Grade</th>
              <th style={{ padding: "4px 6px", fontWeight: 700 }}>Points</th>
              <th style={{ padding: "4px 6px", fontWeight: 700 }}>Weight</th>
              <th style={{ padding: "4px 6px", fontWeight: 700 }}>
                Contribution
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={`${r.name}-${i}`}
                style={{ borderTop: "1px solid #eee", color: "#333" }}
              >
                <td style={{ padding: "4px 6px", fontFamily: "'DM Sans', sans-serif" }}>
                  {r.name}
                </td>
                <td style={{ padding: "4px 6px", fontWeight: 700 }}>
                  {r.grade}
                </td>
                <td style={{ padding: "4px 6px" }}>{fmt(r.gpa, 1)}</td>
                <td style={{ padding: "4px 6px" }}>x{r.weight}</td>
                <td style={{ padding: "4px 6px", fontWeight: 700 }}>
                  {fmt(r.contribution, 1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        style={{
          marginTop: "4px",
          fontSize: "13px",
          color: "#666",
          fontFamily: "'DM Mono', monospace",
        }}
      >
        {subtotalLabel}
      </div>
    </div>
  );
}

// Build a "1.0 + 1.3 + 2.0" style string so the subtotal arithmetic is visible.
function formatRowMath(rows, weight) {
  const parts = rows.map((r) => fmt(r.gpa, 1));
  if (weight === 2) {
    return `(${parts.join(" + ")}) x 2`;
  }
  return parts.join(" + ");
}

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
      <div style={{ fontSize: "16px", lineHeight: 1.6, color: "#333" }}>
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
            <div style={{ fontWeight: 700, fontSize: "14px", color: g.color }}>
              {g.range}: {g.title}
            </div>
            <div style={{ fontSize: "14px", color: "#444" }}>{g.desc}</div>
          </div>
        ))}

        <div
          style={{
            marginTop: "20px",
            marginBottom: "10px",
            fontSize: "14px",
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
            <div style={{ fontWeight: 700, fontSize: "14px", color: m.color }}>
              {m.name}
            </div>
            <div style={{ fontSize: "14px", color: "#444" }}>{m.desc}</div>
            <div
              style={{
                fontSize: "14px",
                color: "#888",
                marginTop: "2px",
                fontStyle: "italic",
              }}
            >
              Effect: {m.effect}
            </div>
          </div>
        ))}

        <p style={{ marginTop: "16px", fontSize: "14px", color: "#444" }}>
          <strong>Whole-letter dimensions:</strong> Ethics &amp; Transparency
          and Flagship Delivery are graded on whole letters only (A through F,
          no plus/minus variants). Their score contribution matches the
          displayed whole letter.
        </p>
        <p style={{ fontSize: "14px", color: "#444" }}>
          <strong>Weighting:</strong> Both headline scores are built from the
          same 11 graded dimensions, with different weightings — Full Policy
          Audit treats them equally, Household Impact doubles the four
          household-facing files. See the About tab for the plain-language
          breakdown.
        </p>
        <p style={{ fontSize: "14px", color: "#444" }}>
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

        <div
          style={{
            marginTop: "20px",
            marginBottom: "8px",
            fontSize: "14px",
            fontWeight: 700,
            color: "#333",
          }}
        >
          Limits of this model
        </div>
        <ul
          style={{
            fontSize: "14px",
            color: "#444",
            paddingLeft: "20px",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          <li style={{ marginBottom: "6px" }}>
            This is a rule-governed accountability scorecard, not a
            statistically-validated measurement instrument. Grades are
            editor judgments bound by a published rubric.
          </li>
          <li style={{ marginBottom: "6px" }}>
            Aggregate scores use equal-weight averaging of ordinal letter
            grades converted to a 4.0 scale. That conversion is a disclosed
            editorial convention, not a latent-variable model.
          </li>
          <li style={{ marginBottom: "6px" }}>
            Plus/minus precision reflects editor judgment under the rubric.
            Evidence-thin files (Ethics &amp; Transparency, Flagship
            Delivery) are held to whole letters to prevent false precision.
          </li>
          <li style={{ marginBottom: "6px" }}>
            External inter-rater reliability has not been tested. The
            three-lane QA (Analyst {"→"} Red Team {"→"} Referee) is an
            internal discipline, not a substitute for independent
            replication.
          </li>
          <li style={{ marginBottom: "6px" }}>
            The model can only score what can be inspected through public
            evidence. Leadership style, symbolic politics, unmeasured public
            value, and other important but weakly evidenced qualities are
            outside the score rather than estimated by proxy.
          </li>
          <li>
            The two headline scores (Full Policy Audit and Household
            Impact) use the same 11 dimensions with different weights and
            act as a built-in sensitivity check on weighting choices.
          </li>
        </ul>

        <p style={{ marginTop: "16px", fontSize: "14px", color: "#444" }}>
          <strong>Approval Signal at the top of the dashboard:</strong> The
          public-opinion approval box above the grades is not part of the
          scoring model. It averages direct PM/government approval across
          the included pollster set (Léger, Abacus Data, Ipsos, Angus Reid
          Institute, Innovative Research Group) over a rolling 60-day
          sample-size-weighted window. It is placed visibly so readers do not
          mistake the grades for popularity, but it does not feed either
          headline score. See
          the{" "}
          <a
            href="https://github.com/Sawatter/canada-under-carney/blob/main/docs/v2-Decision-Memo-Approval-Signal.md"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1a73e8" }}
          >
            Approval Signal decision memo
          </a>{" "}
          for the full rule set.
        </p>

        <h2
          style={{
            fontSize: "22px",
            fontWeight: 700,
            marginTop: "32px",
            marginBottom: "16px",
            color: "#222",
          }}
        >
          Methodology FAQ
        </h2>
        <p style={{ fontSize: "14px", color: "#444", marginBottom: "16px" }}>
          Preempts the questions a skeptical reader most often raises. Each
          answer points at the published rule, not at editor judgment. If an
          answer feels like editor judgment, that is itself documented in
          the relevant{" "}
          <code style={{ fontFamily: "monospace", fontSize: "13px" }}>
            judgmentDetail
          </code>{" "}
          field.
        </p>

        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontWeight: 700, fontSize: "15px", color: "#222" }}>
            Why can one dimension be A-range while another is D-range?
          </div>
          <p style={{ fontSize: "14px", color: "#444", marginTop: "6px" }}>
            Because the triggers were written in advance and they are different
            per dimension. Each dimension has its own{" "}
            <code style={{ fontFamily: "monospace", fontSize: "13px" }}>
              gradeBasis.bandCriterion
            </code>{" "}
            and its own{" "}
            <code style={{ fontFamily: "monospace", fontSize: "13px" }}>
              gradeTriggers.up[]
            </code>{" "}
            /{" "}
            <code style={{ fontFamily: "monospace", fontSize: "13px" }}>
              gradeTriggers.down[]
            </code>
            . A grade reflects performance against the rule for that
            dimension, not against an absolute scale. Defence &amp; Trade is
            A- because NATO 2.01% met the published 2% threshold and trade
            diversification crossed published triggers. Affordability Response
            is D- because federal relief measures cover less than 20% of
            household cost pressure relative to its published criterion.
            Different rules, different grades.
          </p>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontWeight: 700, fontSize: "15px", color: "#222" }}>
            Why don&apos;t announcements always count as delivery?
          </div>
          <p style={{ fontSize: "14px", color: "#444", marginTop: "6px" }}>
            Because the rubric distinguishes them. An announced program
            without a Treasury Board-authorized disbursement, passed
            regulation, or completed transaction sits at C range
            (&quot;Response Exists, Falls Materially Short&quot;) at best.
            Delivered status requires actual implementation: regulation
            passed, program live, money disbursed, transaction complete.
            Build Canada Homes announced 4,000 units but construction is
            not yet underway, so the dimension grades at D not C+. The
            capital gains tax cancellation grades as Delivered because the
            regulation passed.
          </p>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontWeight: 700, fontSize: "15px", color: "#222" }}>
            What would change a grade?
          </div>
          <p style={{ fontSize: "14px", color: "#444", marginTop: "6px" }}>
            Crossing a documented{" "}
            <code style={{ fontFamily: "monospace", fontSize: "13px" }}>
              gradeTrigger
            </code>{" "}
            for that dimension. Every dimension has both up-triggers and
            down-triggers in{" "}
            <code style={{ fontFamily: "monospace", fontSize: "13px" }}>
              src/data/dimensions.json
            </code>{" "}
            with the specific evidence required. Triggers were committed in
            advance of scoring and can be inspected per dimension. The
            scorecard panel for each dimension shows them under &quot;What
            would move this grade.&quot;
          </p>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontWeight: 700, fontSize: "15px", color: "#222" }}>
            Why is the Approval Signal excluded from the GPA?
          </div>
          <p style={{ fontSize: "14px", color: "#444", marginTop: "6px" }}>
            Because the dashboard does not grade popularity. The methodology
            only grades sourceable federal actions. Approval polling is a
            context surface, not a performance grade. The Approval Signal
            panel shows polling for transparency about public perception,
            but it does not feed the headline grade math. The decision memo
            linked above documents the rule.
          </p>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontWeight: 700, fontSize: "15px", color: "#222" }}>
            What does the dashboard refuse to score?
          </div>
          <p style={{ fontSize: "14px", color: "#444", marginTop: "6px" }}>
            Leadership style, vision, symbolic politics, popularity,
            character, intentions, and forecasts. The dashboard requires
            public paper-trail evidence. Where there is no paper trail, the
            dimension does not grade. This is intentional: the credibility
            argument rests on inspectable evidence, not editor inference.
          </p>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontWeight: 700, fontSize: "15px", color: "#222" }}>
            Was the rubric adjusted after seeing results?
          </div>
          <p style={{ fontSize: "14px", color: "#444", marginTop: "6px" }}>
            No. The current rubric is v1.1, published before scoring began.
            Methodology changes get logged in the changelog as{" "}
            <code style={{ fontFamily: "monospace", fontSize: "13px" }}>
              type: &quot;method&quot;
            </code>{" "}
            entries with the version bump. The version history is in the
            scoring rubric doc on{" "}
            <a
              href="https://github.com/Sawatter/canada-under-carney/blob/main/docs/Scoring-Rubric-v1.1.md"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1a73e8" }}
            >
              GitHub
            </a>
            .
          </p>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontWeight: 700, fontSize: "15px", color: "#222" }}>
            How does source diversity affect confidence in a grade?
          </div>
          <p style={{ fontSize: "14px", color: "#444", marginTop: "6px" }}>
            A grade whose grade-moving claim rests on a single source family
            (e.g., 100% government press releases) is less defensible than
            one whose grade-moving claim is corroborated by independent
            challenge sources (PBO, Auditor General, policy institutes,
            journalism). The May 2026 bias-resistance audit (
            <a
              href="https://github.com/Sawatter/canada-under-carney/blob/main/docs/Bias-Resistance-Audit-2026-05.md"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1a73e8" }}
            >
              docs/Bias-Resistance-Audit-2026-05.md
            </a>
            ) flagged the dimensions where the chain was thin and the editor
            threaded existing challenge sources or added new ones where
            prior published views existed. The audit script (
            <code style={{ fontFamily: "monospace", fontSize: "13px" }}>
              scripts/audit-bias-resistance.mjs
            </code>
            ) re-runs each cycle.
          </p>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontWeight: 700, fontSize: "15px", color: "#222" }}>
            Could the rubric itself be biased?
          </div>
          <p style={{ fontSize: "14px", color: "#444", marginTop: "6px" }}>
            That is the question the bias-resistance audit and the
            forthcoming Phase 2 foundational audit are designed to test. The
            Phase 1 audit (operational) tests whether the methodology is
            applied consistently across dimensions. The Phase 2 audit
            (annual cadence) will examine whether the dimension set,
            household-impact weighting, and promise-selection rules
            themselves encode preferences. Findings produce fixes that ship
            as commits with named approval per the{" "}
            <a
              href="https://github.com/Sawatter/canada-under-carney/blob/main/docs/Bias-Resistance-Protocol.md"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1a73e8" }}
            >
              Bias-Resistance Protocol
            </a>
            .
          </p>
        </div>

        <p style={{ fontSize: "13px", color: "#666", marginTop: "16px" }}>
          More on how to challenge specific grades: see the{" "}
          <a
            href="https://github.com/Sawatter/canada-under-carney/blob/main/docs/Corrections-Policy.md"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1a73e8" }}
          >
            corrections policy
          </a>
          , the{" "}
          <a
            href="https://github.com/Sawatter/canada-under-carney/blob/main/docs/Right-Of-Reply.md"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1a73e8" }}
          >
            right-of-reply process
          </a>
          , and the{" "}
          <a
            href="https://github.com/Sawatter/canada-under-carney/blob/main/docs/Perceived-Bias-Survey.md"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1a73e8" }}
          >
            perceived-bias survey
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default function About() {
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
        About This Dashboard
      </h2>
      <div style={{ fontSize: "13px", lineHeight: 1.7, color: "#444" }}>
        <p style={{ marginBottom: "16px" }}>
          <strong>Canada Under Carney</strong> is a non-partisan performance
          dashboard tracking the federal government across 11 graded policy
          dimensions, plus an ungraded Promise Tracker. It is updated monthly
          using official statistics, independent policy analysis, and quality
          journalism across the political spectrum. All grading decisions are
          made by the human editor using a published scoring rubric.
        </p>
        <p style={{ marginBottom: "16px" }}>
          The dashboard publishes two headline grades because they answer two
          different questions using the same 11 graded dimensions. The{" "}
          <strong>Household Impact</strong> grade is not a separate source
          stack; it is a weighted composite that double-weights Housing Supply,
          Affordability Response, Economic Policy Response, and Fiscal Health.
          The <strong>Full Policy Audit</strong> weights all 11 graded
          dimensions equally. Promise Delivery is tracked separately as an
          ungraded accountability tool. A government can perform better on
          statecraft than on household-facing files. We show both.
        </p>

        <div
          style={{
            borderLeft: "3px solid #1a3c5e",
            paddingLeft: "12px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{ fontWeight: 700, fontSize: "13px", color: "#1a3c5e" }}
          >
            Principles
          </div>
          <ul style={{ margin: "6px 0", paddingLeft: "18px" }}>
            <li>
              Grades reflect what the government chose to do and how well it
              executed, not what it inherited
            </li>
            <li>
              Primary data from official statistics (Statistics Canada,
              PBO, CMHC, Bank of Canada, IRCC), supplemented by
              independent policy analysis and journalism
            </li>
            <li>
              Commentary sources are balanced across the political spectrum
              (see Source Balance below)
            </li>
            <li>
              Grade changes require documented evidence and rubric citation
            </li>
            <li>Every grade is a human editorial judgment supported by documented evidence and a published rubric</li>
            <li>
              External inter-rater reliability testing has not yet been
              completed. Subjectivity is reduced through: published rubric
              thresholds, canonical scoring sheets, 5-tier source hierarchy,
              QA gatekeeping with 6 blocking conditions, deconfliction
              matrix, and documented modifier rules
            </li>
          </ul>
        </div>

        <div
          style={{
            borderLeft: "3px solid #558b2f",
            paddingLeft: "12px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{ fontWeight: 700, fontSize: "13px", color: "#558b2f" }}
          >
            Source Balance
          </div>
          <div style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
            <strong>Official:</strong> Statistics Canada, PBO, CMHC, Bank of
            Canada, IRCC, ECCC, Global Affairs Canada, Office of the Ethics
            Commissioner, NATO, OECD, IMF, Fitch
            <br />
            <strong>Centre:</strong> CBC News, Globe and Mail, La Presse,
            Toronto Star
            <br />
            <strong>Right:</strong> C.D. Howe, The Hub, National Post
            <br />
            <strong>Left:</strong> CCPA, The Narwhal, National Observer
            <br />
            <strong>Independent policy:</strong> IRPP / Policy Options,
            Canadian Climate Institute, IISD, IFSD
            <br />
            <strong>Academic:</strong> The Conversation Canada, Dalhousie,
            PROOF (U of T)
            <br />
            <strong>Polling:</strong> Angus Reid, L&eacute;ger, Nanos, Abacus
          </div>
        </div>

        <div
          style={{
            borderLeft: "3px solid #e68a00",
            paddingLeft: "12px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{ fontWeight: 700, fontSize: "13px", color: "#e68a00" }}
          >
            Evaluation Period
          </div>
          <div style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
            Mark Carney was sworn in as PM on March 14, 2025. The Liberals
            secured a majority (174 seats) on April 13, 2026 via byelection
            wins. This dashboard evaluates the period from March 2025 onward,
            with monthly updates. Files with realistic one-year improvement
            potential are graded on outcomes. Structural challenges built over
            a decade are graded on direction of travel and adequacy of effort.
          </div>
        </div>

        <div
          style={{
            borderLeft: "3px solid #999",
            paddingLeft: "12px",
            marginBottom: "16px",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: "13px", color: "#666" }}>
            Built By
          </div>
          <div style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
            CJS Strategy &amp; Ops Inc. &middot; Calgary, Canada
            <br />
            Built with AI assistance (Claude Code). Methodology
            stress-tested through simulated adversarial review.
            Fact-checked against 42+ primary source claims.
            All editorial judgments made by the human editor.
            <br />
            Scoring Rubric v1.1 &middot; Open source on{" "}
            <a
              href="https://github.com/Sawatter/canada-under-carney"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1a73e8" }}
            >
              GitHub
            </a>
          </div>
        </div>

        <p style={{ fontSize: "11px", color: "#aaa", marginTop: "16px" }}>
          This dashboard is an independent analytical product. It is not
          affiliated with any political party, government agency, or advocacy
          organization. Feedback and corrections are welcome via GitHub Issues.
        </p>
      </div>
    </div>
  );
}

import { useLayoutEffect } from "react";

export default function About({ onReady }) {
  useLayoutEffect(() => {
    onReady?.();
  }, [onReady]);

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
      <div style={{ fontSize: "16px", lineHeight: 1.6, color: "#333" }}>
        <p style={{ marginBottom: "16px" }}>
          <strong>Canada Under Carney</strong> is a non-partisan performance
          dashboard tracking the federal government across 11 graded policy
          areas, plus an ungraded Promise Tracker. It is updated monthly
          using official statistics, independent policy analysis, and
          documented journalism from multiple institution types and
          perspectives. All grading decisions are made by the human editor
          using a published scoring rubric.
        </p>

        <div
          style={{
            borderLeft: "3px solid #1a3c5e",
            paddingLeft: "12px",
            marginBottom: "16px",
            background: "#f6f9fc",
            padding: "12px 14px",
          }}
        >
          <div
            style={{ fontWeight: 700, fontSize: "14px", color: "#1a3c5e" }}
          >
            Editor and Disclosures
          </div>
          <ul
            style={{
              margin: "8px 0 0",
              paddingLeft: "18px",
              fontSize: "14px",
              color: "#333",
              lineHeight: 1.55,
            }}
          >
            <li>
              <strong>Editor:</strong> An independent business and
              operations consultant. The dashboard is a personal civic
              project, not a commercial product.
            </li>
            <li>
              <strong>Political affiliation:</strong> no current or past
              financial relationship with any federal political party,
              party-aligned organization, or candidate. No registered party
              membership. No campaign donations on file in the dashboard's
              coverage period.
            </li>
            <li>
              <strong>Professional conflicts:</strong> no paid consulting
              relationship with any company or organization whose policy
              position is graded by the dashboard, and no current contract
              with a federal department. If that changes, this disclosure
              changes.
            </li>
            <li>
              <strong>Recusal policy:</strong> if a future conflict of
              interest arises (paid relationship with a graded entity, a
              federal-department contract, a board seat with a policy-
              affected organization), the affected policy area will be
              flagged in the next changelog entry with the nature of the
              conflict and the editorial response (recusal from that
              policy area's grading, transition of that policy area's grading
              to a documented external review, or both). The flag stays
              on the policy-area card until the conflict is resolved.
            </li>
            <li>
              <strong>Funding:</strong> the dashboard is unfunded. No paid
              sponsorships, no advertising, no in-kind support tied to
              editorial direction. Email distribution runs on Kit's free
              tier, and GoatCounter analytics is paid out of pocket by the editor.
            </li>
            <li>
              <strong>AI assistance:</strong> Claude, Codex, ChatGPT, and
              Perplexity-class tools are used for drafting, code changes,
              source research, and methodology reviews. Grading decisions
              are made by the human editor against the published rubric,
              not by any AI. The AI verification methodology at{" "}
              <a
                href="https://github.com/Sawatter/canada-under-carney/blob/main/docs/AI-Verification-Methodology.md"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1565c0" }}
              >
                docs/AI-Verification-Methodology.md
              </a>{" "}
              documents how AI panel reviews are integrated.
            </li>
            <li>
              <strong>Corrections and right of reply:</strong> reviewed by
              the editor per{" "}
              <a
                href="https://github.com/Sawatter/canada-under-carney/blob/main/docs/Corrections-Policy.md"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1565c0" }}
              >
                Corrections Policy
              </a>{" "}
              and{" "}
              <a
                href="https://github.com/Sawatter/canada-under-carney/blob/main/docs/Right-Of-Reply.md"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1565c0" }}
              >
                Right of Reply
              </a>
              . The editor does not solicit pre-publication input from
              graded parties. Submit a correction or right-of-reply request
              by opening a{" "}
              <a
                href="https://github.com/Sawatter/canada-under-carney/issues"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1565c0" }}
              >
                GitHub issue
              </a>
              .
            </li>
          </ul>
        </div>

        <div
          style={{
            borderLeft: "3px solid #607d8b",
            paddingLeft: "12px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{ fontWeight: 700, fontSize: "14px", color: "#455a64" }}
          >
            What This Scores and What It Does Not
          </div>
          <p style={{ margin: "6px 0 10px", fontSize: "14px", color: "#444" }}>
            The dashboard scores federal performance where there is a public
            paper trail: announced commitments, funded or authorized programs,
            official statistics, independent analysis, published thresholds,
            and observable policy outcomes. It is designed to make those
            claims inspectable, not to score every politically important
            quality.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px",
              fontSize: "14px",
              color: "#444",
            }}
          >
            <div>
              <strong>Scored:</strong>
              <ul style={{ margin: "6px 0 0", paddingLeft: "18px" }}>
                <li>federal actions with sourceable evidence</li>
                <li>documented commitments and delivery status</li>
                <li>published policy thresholds and grade-move conditions</li>
                <li>outcomes where federal levers are visible enough to assess</li>
              </ul>
            </div>
            <div>
              <strong>Not scored:</strong>
              <ul style={{ margin: "6px 0 0", paddingLeft: "18px" }}>
                <li>leadership style, charisma, or political strategy</li>
                <li>symbolic actions without durable policy records</li>
                <li>popularity, vote choice, or campaign forecasting</li>
                <li>valuable outcomes that lack enough public evidence to grade</li>
                <li>
                  standalone grades for Indigenous reconciliation, healthcare
                  transfers, public-sector bargaining, pre-designation pipeline
                  announcements, foreign policy beyond the defence / trade
                  construct, or specific defence procurement contracts
                  (fighter jets, naval vessels, Arctic surveillance) beyond
                  the NATO-spending headline
                </li>
              </ul>
            </div>
          </div>
          <p style={{ margin: "10px 0 0", fontSize: "14px", color: "#555" }}>
            This means the dashboard can understate things that matter but are
            not yet measurable, and it can over-focus attention on files where
            evidence is easiest to observe. The counterweight is disclosure:
            each card names what it grades, where judgment enters, and which
            evidence would move the grade.
          </p>
          <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#555" }}>
            Some excluded files still appear as evidence inside a home
            policy area when they have a direct paper trail: healthcare staffing
            pressure appears inside Immigration, an Indigenous loan guarantee
            appears inside Major Projects and Promise Delivery, and foreign
            policy review commitments appear inside Defence &amp; Trade. They
            are not separate headline grades in this version.
          </p>
          <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#555" }}>
            <strong>Why these are not standalone grades yet:</strong>{" "}
            Indigenous reconciliation requires source coordination across
            multiple federal departments and nation-to-nation agreements
            whose measurement frameworks are not yet ready for monthly
            updates. Healthcare federal-provincial transfers sit inside the
            Fiscal Health file because the provincial side is outside the
            dashboard's federal scope. Public-sector bargaining touches
            three current policy areas at once. It feeds Fiscal Health
            through the workforce-reduction commitment, Economic Policy
            Response through wage dynamics, and Immigration through
            workforce planning, but the labour-relations file as a whole
            does not have its own grade because Treasury Board agreement
            timing is intermittent and the cross-file footprint
            would risk double-counting. Pre-designation pipeline
            announcements are intentionally excluded by the Major Projects
            scope rule that grades documented post-designation advancement
            rather than announcement count. Defence procurement (specific
            fighter jet, naval vessel, and Arctic surveillance contracts)
            is not graded as a separate file because the current Defence
            & Trade file uses the NATO spending percentage and
            trade-diversification rate as its measurable outcomes. Specific
            procurement contracts would fit the Major Projects model
            better and may move there if the Defence & Trade tripwire
            forces that file to split. Foreign policy beyond defence
            and trade is excluded because the indicators that would
            distinguish performance from posture are not yet usable for a
            monthly rubric. A reader who wants any of these graded
            directly can{" "}
            <a
              href="https://github.com/Sawatter/canada-under-carney/issues"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1565c0" }}
            >
              open a GitHub issue
            </a>{" "}
            making the case for the indicators that would work.
          </p>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <p style={{ margin: "0 0 10px" }}>
            <strong>Why two grades?</strong> The dashboard grades 11 policy
            areas, including defence, immigration, climate, housing, the cost
            of living, ethics, major projects, and more. The two headline
            grades are different ways of summarizing all 11, because one
            average can hide important differences.
          </p>
          <p style={{ margin: "0 0 10px" }}>
            <strong>Full Policy Audit</strong> is how the Carney government is
            performing overall, across all 11 policy areas weighted equally.
            Defence counts the same as housing; ethics counts the same as cost
            of living.
          </p>
          <p style={{ margin: "0 0 6px" }}>
            <strong>Household Impact</strong> is the same kind of grade, but
            focused on the four areas that hit daily life hardest:
          </p>
          <ul style={{ margin: "0 0 10px", paddingLeft: "22px" }}>
            <li>
              <strong>Housing</strong> asks whether you can afford a place to live
            </li>
            <li>
              <strong>Cost of living</strong> asks whether groceries and everyday
              bills are under control
            </li>
            <li>
              <strong>The economy</strong> asks whether jobs, wages, and productivity
              are going the right way
            </li>
            <li>
              <strong>Government spending</strong> asks whether the fiscal picture is
              under control
            </li>
          </ul>
          <p style={{ margin: "0 0 10px" }}>
            These four areas count twice as much in Household Impact; the
            other seven still count, just not as heavily. Both grades use the
            same 11 areas, the same sources, the same rubric, and the same
            review checks. Only the weighting changes.
          </p>
          <p style={{ margin: "0 0 10px" }}>
            <strong>Promises Delivered</strong> is a running tracker of
            specific commitments (delivered, in progress, too early, stalled,
            abandoned). It's
            separate and doesn't feed either grade.
          </p>
          <p style={{ margin: 0 }}>
            <strong>If the two grades don't match, that's the point.</strong>{" "}
            A government can do well on defence or climate and still be
            failing on the cost of your life, or the other way around.
            Showing both means you can see that.
          </p>
        </div>
        <p style={{ marginBottom: "16px" }}>
          The scoring stack now also includes a published{" "}
          <a
            href="https://github.com/Sawatter/canada-under-carney/blob/main/docs/Commitment-Traceability-Map.md"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1565c0" }}
          >
            Commitment Traceability Map
          </a>{" "}
          that links each tracked commitment to its home policy area, what that
          file is scoring, evidence path, source requirements, duplicate-check notes, and how
          repeated promises are handled. It is a reference layer, not a
          separate scoring system.
        </p>

        <div
          style={{
            borderLeft: "3px solid #1a3c5e",
            paddingLeft: "12px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{ fontWeight: 700, fontSize: "14px", color: "#1a3c5e" }}
          >
            Principles
          </div>
          <ul style={{ margin: "6px 0", paddingLeft: "18px" }}>
            <li>
              Grades reflect what the government chose to do and how well it
              carried out, not what it inherited
            </li>
            <li>
              Primary data from official statistics (Statistics Canada,
              PBO, CMHC, Bank of Canada, IRCC), supplemented by
              independent policy analysis and journalism
            </li>
            <li>
              Non-official sources are drawn from multiple institution types
              and perspectives. Think tanks, policy institutes, journalism,
              and academic research are all used, but no single editorial or
              analytical family is allowed to dominate the stack (see Source
              Balance below)
            </li>
            <li>
              Grade changes require documented evidence and rubric citation
            </li>
            <li>
              Commitments are traceable from their original public source to
              their home policy area, evidence path, and repeated-promise treatment
              through the published Commitment Traceability Map
            </li>
            <li>
              Every grade is anchored to the published rubric and documented
              evidence, with the reasoning shown on every card. Any reader
              can apply the rubric to the evidence themselves and reach
              their own conclusion.
            </li>
            <li>
              Outside reviewers have not yet tested whether they would reach
              the same grades. Subjectivity is reduced through published
              rubric thresholds, standard scoring sheets, the 5-tier source
              hierarchy, review gates with 6 blocking conditions,
              duplicate-check rules, and documented grade-adjustment rules
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
            style={{ fontWeight: 700, fontSize: "14px", color: "#558b2f" }}
          >
            Source Balance
          </div>
          <div style={{ fontSize: "13px", color: "#555", marginTop: "4px" }}>
            This is a current source-type summary, not a full inventory and not
            a formal left/right scorecard. Click any expanded policy-area card
            for the exact source URLs used on that file. For the main
            per-source-family record (institution type, ownership / funding,
            editorial independence, tier, best-use boundary), see the{" "}
            <a
              href="https://github.com/Sawatter/canada-under-carney/blob/main/docs/Source-Characterization-Register.md"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1565c0" }}
            >
              Source Characterization Register
            </a>.
            <br />
            <strong>Official / administrative:</strong> Statistics Canada, PBO,
            CMHC, Bank of Canada, IRCC, ECCC, Global Affairs Canada, NRCan,
            Finance Canada / Canada.ca, Office of the Ethics Commissioner,
            LEGISinfo / parl.ca, direct PM ethics filings, NATO, OECD, IMF
            <br />
            <strong>Public broadcaster:</strong> CBC News
            <br />
            <strong>Mainstream reporting:</strong> Globe and Mail
            <br />
            <strong>Analysis / commentary:</strong> The Hub
            <br />
            <strong>Policy institutes / watchdogs:</strong> C.D. Howe, Fraser
            Institute, IRPP / Policy Options, Canadian Climate Institute, IISD,
            Democracy Watch
            <br />
            <strong>Issue-focused reporting:</strong> The Narwhal, National
            Observer
            <br />
            <strong>Academic:</strong> The Conversation Canada, Dalhousie,
            PROOF (U of T)
            <br />
            <strong>Polling / public opinion:</strong> Angus Reid; Approval
            Signal pollsters are tracked separately outside the grades (Léger,
            Abacus Data, Ipsos, Angus Reid Institute, Innovative Research Group;
            Nanos preferred-PM context)
            <br />
            <strong>Context-only official announcements:</strong> PMO or other
            government press releases may appear as context, but they do not by
            themselves move grades.
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
            style={{ fontWeight: 700, fontSize: "14px", color: "#8d5a00" }}
          >
            Evaluation Period
          </div>
          <div style={{ fontSize: "13px", color: "#555", marginTop: "4px" }}>
            Mark Carney was sworn in as PM on March 14, 2025. The Liberals
            secured a majority (174 seats) on April 13, 2026 via byelection
            wins. This dashboard evaluates the period from March 2025 onward,
            with monthly updates. Files with realistic one-year improvement
            potential are graded on outcomes. Structural challenges built over
            a decade are graded on whether the file is moving the right way and whether the response is big enough.
          </div>
        </div>

        <div
          style={{
            borderLeft: "3px solid #999",
            paddingLeft: "12px",
            marginBottom: "16px",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: "14px", color: "#666" }}>
            Built By
          </div>
          <div style={{ fontSize: "13px", color: "#555", marginTop: "4px" }}>
            Independent project
            <br />
            Built with AI assistance (Claude Code + ChatGPT) under human
            editorial direction. The rubric, evidence sources, and per-grade
            reasoning are all public so any grade can be checked against
            its evidence. Methodology stress-tested through simulated
            skeptical review.
            <br />
            Scoring Rubric v1.1 &middot; Open source on{" "}
            <a
              href="https://github.com/Sawatter/canada-under-carney"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1565c0" }}
            >
              GitHub
            </a>
          </div>
        </div>

        <div
          style={{
            borderLeft: "3px solid #999",
            paddingLeft: "12px",
            marginBottom: "16px",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: "14px", color: "#666" }}>
            Cite As
          </div>
          <div style={{ fontSize: "13px", color: "#555", marginTop: "4px" }}>
            Canada Under Carney Dashboard, Scoring Rubric v1.1,{" "}
            <a
              href="https://sawatter.github.io/canada-under-carney/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1565c0" }}
            >
              sawatter.github.io/canada-under-carney
            </a>
            , accessed [date].
            <br />
            For citing a specific policy-area grade at a specific point in time,
            include the dashboard version shown in the header (e.g., v5.59)
            and the policy-area name. Source data lives in{" "}
            <code style={{ fontFamily: "monospace", fontSize: "12px" }}>
              src/data/dimensions.json
            </code>{" "}
            in the open-source repository.
          </div>
        </div>

        <div
          style={{
            borderLeft: "3px solid #999",
            paddingLeft: "12px",
            marginBottom: "16px",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: "14px", color: "#666" }}>
            Past Versions and Snapshots
          </div>
          <div style={{ fontSize: "13px", color: "#555", marginTop: "4px" }}>
            Every monthly cycle is tagged in the public repo so a reader can
            load the dashboard as it stood at a specific past version. The{" "}
            <a
              href="https://sawatter.github.io/canada-under-carney/?tab=changelog"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1565c0" }}
            >
              Change Log
            </a>{" "}
            tab lists every grade move and methodology change with date.
            The full commit history with per-file diffs lives in the{" "}
            <a
              href="https://github.com/Sawatter/canada-under-carney/commits/main"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1565c0" }}
            >
              GitHub commit history
            </a>
            , and any cycle's full dashboard state is browseable through the{" "}
            <a
              href="https://github.com/Sawatter/canada-under-carney/tree/main/src/data"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1565c0" }}
            >
              data folder at a specific commit
            </a>
            . For a one-paragraph cycle summary, the per-cycle closure memos
            in{" "}
            <a
              href="https://github.com/Sawatter/canada-under-carney/tree/main/docs"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1565c0" }}
            >
              docs/
            </a>{" "}
            (e.g., <code style={{ fontFamily: "monospace", fontSize: "12px" }}>Bias-Resistance-Cycle-2026-05-Closure.md</code>) capture the
            arc of what changed. The{" "}
            <a
              href="https://github.com/Sawatter/canada-under-carney/blob/main/docs/Continuity-Plan.md"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1565c0" }}
            >
              continuity plan
            </a>{" "}
            explains what happens if the single-editor project stops updating.
          </div>
        </div>

        <div
          style={{
            borderLeft: "3px solid #999",
            paddingLeft: "12px",
            marginBottom: "16px",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: "14px", color: "#666" }}>
            Corrections and Right of Reply
          </div>
          <div style={{ fontSize: "13px", color: "#555", marginTop: "4px" }}>
            To contest a specific grade, start with{" "}
            <a
              href="https://github.com/Sawatter/canada-under-carney/blob/main/docs/How-To-Challenge-A-Grade.md"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1565c0" }}
            >
              How To Challenge A Grade
            </a>
            . It walks through the criteria, grade-move condition, metric, source, and
            critic / defender checks.
            <br />
            Factual errors can be reported via{" "}
            <a
              href="https://github.com/Sawatter/canada-under-carney/issues"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1565c0" }}
            >
              GitHub Issues
            </a>
            . The{" "}
            <a
              href="https://github.com/Sawatter/canada-under-carney/blob/main/docs/Corrections-Policy.md"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1565c0" }}
            >
              corrections policy
            </a>{" "}
            documents what gets corrected, how, and on what timeline.
            <br />
            Federal ministries, agencies, watchdogs, and named third-party
            analysts cited in any policy area's evidence chain can submit
            critiques via the{" "}
            <a
              href="https://github.com/Sawatter/canada-under-carney/blob/main/docs/Right-Of-Reply.md"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1565c0" }}
            >
              right-of-reply process
            </a>
            . Disagreements with editor judgment are reviewed and reflected
            transparently. Grades do not move because a party disagrees.
            <br />
            Readers who want to test whether the score-explanation surface is
            legible across political priors can participate in the{" "}
            <a
              href="https://github.com/Sawatter/canada-under-carney/blob/main/docs/Perceived-Bias-Survey.md"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1565c0" }}
            >
              perceived-bias survey
            </a>
            . The survey tests whether readers from any major party can
            describe how a grade was reached, not whether they agree with
            it.
          </div>
        </div>

        <p style={{ fontSize: "14px", color: "#666", marginTop: "16px" }}>
          This dashboard is an independent analytical product. It is not
          affiliated with any political party, government agency, or advocacy
          organization.
        </p>
      </div>
    </div>
  );
}

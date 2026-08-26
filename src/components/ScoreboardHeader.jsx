import GradeChip from "./GradeChip";
import ScoreDerivation from "./ScoreDerivation";
import { ApprovalCard, ApprovalDetail } from "./ApprovalSignal";
import ReleaseUpdate from "./ReleaseUpdate";
import { STATUS_COLORS } from "../constants";

const STATUS_BAR_ORDER = ["Delivered", "In Progress", "Stalled", "Abandoned"];

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function formatDate(value) {
  if (!value) return "Not scheduled";

  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? value : dateFormatter.format(parsed);
}

function isOrdinaryActivation(event) {
  return event.button === 0
    && !event.metaKey
    && !event.ctrlKey
    && !event.shiftKey
    && !event.altKey;
}

function DerivationToggle({ variant, derivationOpen, onToggle }) {
  const isOpen = derivationOpen === variant;
  const label = variant === "overall"
    ? "How is the audit score built?"
    : "How is Household built?";
  const openLabel = variant === "overall"
    ? "Hide audit score math"
    : "Hide Household math";

  return (
    <button
      type="button"
      className="first-look-derivation-toggle"
      onClick={() => onToggle(variant)}
      aria-expanded={isOpen}
      aria-controls={`score-derivation-${variant}`}
    >
      {isOpen ? openLabel : label}
    </button>
  );
}

function NextWatch({ nextUpdate, primaryNextCheck, primaryNextCheckTiming }) {
  const timing = primaryNextCheckTiming?.kind === "date"
    ? formatDate(primaryNextCheckTiming.value)
    : primaryNextCheckTiming?.value;
  const checkLabel = primaryNextCheck?.label || "Published watch item";

  return (
    <div className="first-look-watch">
      <div className="first-look-block-heading">Watch next</div>
      <p className="first-look-next-update">
        Next score update{" "}
        <time dateTime={nextUpdate}>{formatDate(nextUpdate)}</time>
      </p>
      {primaryNextCheck && (
        <div className="first-look-primary-check">
          <div className="first-look-check-heading">
            {primaryNextCheck.href ? (
              <>
                <a
                  className="first-look-watch-route"
                  href={primaryNextCheck.href}
                >
                  {checkLabel}
                </a>
                <span className="first-look-narrow-label">{checkLabel}</span>
              </>
            ) : (
              <span>{checkLabel}</span>
            )}
            {timing && (
              primaryNextCheckTiming.kind === "date" ? (
                <time
                  className="first-look-block-meta"
                  dateTime={primaryNextCheckTiming.value}
                >
                  {timing}
                </time>
              ) : (
                <span className="first-look-block-meta">{timing}</span>
              )
            )}
          </div>
          <p>{primaryNextCheck.status}</p>
        </div>
      )}
    </div>
  );
}

function ScoringBoundary() {
  return (
    <div className="first-look-boundary" aria-labelledby="first-look-boundary-heading">
      <h3 id="first-look-boundary-heading">What affects the grades</h3>
      <dl className="first-look-boundary-list">
        <div>
          <dt>Full Policy Audit</dt>
          <dd>Each of the 11 graded policy files counts equally.</dd>
        </div>
        <div>
          <dt>Household Impact</dt>
          <dd>
            The same 11 files, with housing, cost of living, the economy, and
            government spending counted twice.
          </dd>
        </div>
        <div>
          <dt>Context only</dt>
          <dd>Promise Delivery and Approval do not affect either grade.</dd>
        </div>
      </dl>
    </div>
  );
}

export default function ScoreboardHeader({
  overallGrade,
  overallGPA,
  overallVerdictLine,
  latestRelease,
  nextUpdate,
  primaryNextCheck,
  primaryNextCheckTiming,
  onPolicyGradesJump,
  onShowSafeguards,
  pocketbookGrade,
  pocketbookGPA,
  promiseCounts,
  totalPromises,
  onOpenPromises,
  approvalExpanded,
  onToggleApproval,
  derivationOpen,
  onToggleDerivation,
  overallDerivation,
  pocketbookDerivation,
}) {
  const delivered = promiseCounts["Delivered"] || 0;
  const deliveredShare = totalPromises > 0 ? delivered / totalPromises : 0;
  const promiseToneClass = deliveredShare >= 0.6
    ? "first-look-value-positive"
    : deliveredShare >= 0.3
      ? "first-look-value-caution"
      : "first-look-value-negative";
  const barStatuses = [
    ...STATUS_BAR_ORDER,
    ...Object.keys(promiseCounts).filter((status) => !STATUS_BAR_ORDER.includes(status)),
  ].filter((status) => (promiseCounts[status] || 0) > 0);
  const barSummary = barStatuses
    .map((status) => `${promiseCounts[status]} ${status.toLowerCase()}`)
    .join(", ");
  const householdDerivationOpen = derivationOpen === "household";
  const householdSignalContent = (
    <>
      <span id="first-look-household-heading" className="first-look-signal-title">
        Household Impact
      </span>
      <span className="first-look-signal-description">
        The same 11 policies, with four pocketbook files
        double-weighted.
      </span>
      <span className="first-look-signal-result">
        <GradeChip grade={pocketbookGrade} />
        <span className="first-look-signal-score">Score: {pocketbookGPA}</span>
      </span>
      {onToggleDerivation && (
        <span className="first-look-signal-action">
          {householdDerivationOpen ? "Hide Household math" : "How is Household built?"}
        </span>
      )}
    </>
  );

  const handleSafeguardsClick = (event) => {
    if (!onShowSafeguards || !isOrdinaryActivation(event)) return;
    event.preventDefault();
    onShowSafeguards();
  };

  return (
    <section className="first-look-briefing" aria-label="Scorecard briefing">
      <div className="first-look-primary-wrap">
        <div className="first-look-score-summary">
          <header className="first-look-primary-header">
            <p className="first-look-eyebrow">Scorecard briefing</p>
            <h2>Full Policy Audit</h2>
            <p className="first-look-primary-description">
              Performance across 11 graded policy files.
            </p>
          </header>

          <div className="first-look-primary-result">
            <GradeChip grade={overallGrade} size="lg" />
            <p className="first-look-primary-score">Score: {overallGPA}</p>
          </div>
        </div>

        <p className="first-look-overall-verdict">{overallVerdictLine}</p>

        <div className="first-look-primary-context">
          <ReleaseUpdate latestRelease={latestRelease} />
          <NextWatch
            nextUpdate={nextUpdate}
            primaryNextCheck={primaryNextCheck}
            primaryNextCheckTiming={primaryNextCheckTiming}
          />
        </div>

        <ScoringBoundary />

        <div className="first-look-actions" aria-label="Inspect the scorecard">
          <a
            className="first-look-action first-look-action-primary"
            href="#policy-grades-heading"
            onClick={onPolicyGradesJump}
          >
            Inspect the 11 policy files
          </a>
          <a
            className="first-look-action"
            href="#methodology-safeguards"
            onClick={handleSafeguardsClick}
          >
            Read the scoring method
          </a>
          <a
            className="first-look-action first-look-narrow-action"
            href="#view-changelog"
          >
            Read release details
          </a>
          {primaryNextCheck?.href && (
            <a
              className="first-look-action first-look-narrow-action first-look-watch-action"
              href={primaryNextCheck.href}
            >
              {primaryNextCheck.label || "Published watch item"}
            </a>
          )}
        </div>

        {onToggleDerivation && (
          <DerivationToggle
            variant="overall"
            derivationOpen={derivationOpen}
            onToggle={onToggleDerivation}
          />
        )}
        {derivationOpen === "overall" && overallDerivation && (
          <div className="first-look-detail first-look-detail-overall">
            <ScoreDerivation
              variant="overall"
              derivation={overallDerivation}
              displayedScore={overallGPA}
            />
          </div>
        )}
      </div>

      <div
        className="first-look-signal-group"
        role="group"
        aria-labelledby="first-look-signals-heading"
      >
        <h3 id="first-look-signals-heading">Other dashboard signals</h3>
        <div className="first-look-signal-grid">
          {onToggleDerivation ? (
            <button
              type="button"
              className="first-look-signal first-look-signal-household"
              onClick={() => onToggleDerivation("household")}
              aria-expanded={householdDerivationOpen}
              aria-controls="score-derivation-household"
              aria-label={`Household Impact. Grade ${pocketbookGrade}. Score ${pocketbookGPA}. ${
                householdDerivationOpen ? "Hide Household math" : "How is Household built?"
              }`}
            >
              {householdSignalContent}
            </button>
          ) : (
            <article
              className="first-look-signal first-look-signal-household"
              aria-labelledby="first-look-household-heading"
            >
              {householdSignalContent}
            </article>
          )}

          <button
            type="button"
            className="first-look-signal first-look-signal-promises"
            onClick={onOpenPromises}
          >
            <span className="first-look-signal-title">Promise Delivery</span>
            <span className="first-look-signal-description">
              Tracker outside the grades.
            </span>
            <span className="first-look-promise-result">
              <span
                className={`first-look-promise-number ${promiseToneClass}`}
              >
                {delivered}
                <span>/{totalPromises}</span>
              </span>
              <span>delivered</span>
            </span>
            {totalPromises > 0 && (
              <span
                className="first-look-promise-bar"
                aria-hidden="true"
                title={barSummary}
              >
                {barStatuses.map((status) => (
                  <span
                    key={status}
                    style={{
                      flex: `${promiseCounts[status]} 0 0`,
                      background: (STATUS_COLORS[status] || STATUS_COLORS.Unclear)
                        .color,
                    }}
                  />
                ))}
              </span>
            )}
            {barSummary && (
              <span className="first-look-signal-meta">{barSummary}</span>
            )}
            <span className="first-look-signal-action">
              See {totalPromises} promises
            </span>
          </button>

          <ApprovalCard
            expanded={!!approvalExpanded}
            onToggle={onToggleApproval}
          />
        </div>

        {derivationOpen === "household" && pocketbookDerivation && (
          <div className="first-look-detail first-look-detail-household">
            <ScoreDerivation
              variant="household"
              derivation={pocketbookDerivation}
              displayedScore={pocketbookGPA}
            />
          </div>
        )}
        {approvalExpanded && (
          <div className="first-look-detail first-look-detail-approval">
            <ApprovalDetail />
          </div>
        )}
      </div>
    </section>
  );
}

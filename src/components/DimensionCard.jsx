import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { GRADES } from "../constants";
import GradeChip from "./GradeChip";
import TrendArrow from "./TrendArrow";
import meta from "../data/meta.json";
import changelogSummary from "../data/changelog-summary.json";
import { formatValue, formatTarget, formatPeriod, deriveRelation } from "../dimensionTargets";
import { buildDimensionSharePayload } from "../dimensionShare";

const MODIFIER_LABELS = {
  "External Constraint": "External pressure",
  "Timing Fairness": "Early-cycle adjustment",
  "Jurisdictional limits": "Shared-control limit",
  "Credit-claiming penalty": "Credit reduced for overclaiming",
};

const GRADE_ORDER = [
  "A+", "A", "A-",
  "B+", "B", "B-",
  "C+", "C", "C-",
  "D+", "D", "D-",
  "F",
];

const WORKSPACE_PANELS = [
  { id: "briefing", label: "Briefing" },
  { id: "evidence", label: "Evidence" },
  { id: "history", label: "History" },
  { id: "method", label: "Method" },
];

function normalizeTrigger(trigger) {
  if (!trigger) return null;
  if (typeof trigger === "string") return { text: trigger };
  return trigger;
}

function isEventDrivenTrigger(trigger) {
  const label = (trigger?.sourceLabel || "").toLowerCase();
  return !trigger?.sourceUrl
    && !trigger?.internalRef
    && (label.includes("event-driven") || label.includes("(see source list)"));
}

function gradeIndex(grade) {
  return GRADE_ORDER.indexOf(grade);
}

function baseGrade(grade) {
  return (grade || "").replace(/[+-]/g, "");
}

function gradeInRange(grade, rangeLabel) {
  const match = String(rangeLabel || "").match(/\b([ABCDF][+-]?)\s+to\s+([ABCDF][+-]?)\b/);
  if (!match) return false;

  const current = gradeIndex(grade);
  const a = gradeIndex(match[1]);
  const b = gradeIndex(match[2]);
  if (current < 0 || a < 0 || b < 0) return false;

  const high = Math.min(a, b);
  const low = Math.max(a, b);
  return current >= high && current <= low;
}

function findActiveThresholdRow(thresholds, grade) {
  if (!Array.isArray(thresholds) || !grade) return null;

  const exact = thresholds.find((row) => row.grade === grade);
  if (exact) return exact;

  const range = thresholds.find((row) => gradeInRange(grade, row.grade));
  if (range) return range;

  return thresholds.find((row) => baseGrade(row.grade) === baseGrade(grade)) || null;
}

function targetBelongsToDimension(target, dimId) {
  return target === `dim-${dimId}` || target.startsWith(`dim-${dimId}-`);
}

function workspacePanelAnchor(dimId, panel) {
  return `dim-${dimId}-${panel}`;
}

function workspacePanelForTarget(target, dimId) {
  if (!targetBelongsToDimension(target, dimId)) return "briefing";

  const prefix = `dim-${dimId}`;
  const evidenceTargets = [
    `${prefix}-evidence`,
    `${prefix}-metrics`,
    `${prefix}-sources`,
    `${prefix}-promises`,
    `${prefix}-cohort`,
    `${prefix}-cohort-list`,
    `${prefix}-cohort-table`,
    `${prefix}-perspectives-section`,
    `${prefix}-latest-evidence`,
    `${prefix}-tracker-triggers`,
  ];
  if (evidenceTargets.includes(target)) return "evidence";

  const historyTargets = [
    `${prefix}-history`,
    `${prefix}-latest-review`,
    `${prefix}-latest-evidence-review`,
    `${prefix}-latest-evidence-review-title`,
  ];
  if (historyTargets.includes(target)) return "history";

  const methodTargets = [
    `${prefix}-method`,
    `${prefix}-scoring`,
    `${prefix}-lever-operationalization`,
    `${prefix}-component-operationalization`,
    `${prefix}-combination-rule`,
    `${prefix}-subscores`,
    `${prefix}-caveats`,
    `${prefix}-context`,
    `${prefix}-scope`,
    `${prefix}-inherited`,
    `${prefix}-glossary`,
  ];
  if (methodTargets.includes(target)) return "method";

  return "briefing";
}

function focusWorkspaceTarget(target, dimId, panel, shouldFocus = true) {
  const panelTarget = workspacePanelAnchor(dimId, panel);
  const scrollTarget = target === `dim-${dimId}`
    ? document.getElementById(panelTarget)
    : (document.getElementById(target) || document.getElementById(panelTarget));
  scrollTarget?.scrollIntoView({ behavior: "auto", block: "start", inline: "nearest" });

  if (shouldFocus) {
    const panelControl = target === panelTarget
      ? document.querySelector('.dimension-workspace-tab[aria-current="page"]')
      : null;
    (panelControl || scrollTarget)?.focus?.({ preventScroll: true });
  }
}

function canonicalUrl(value) {
  if (!value) return null;
  try {
    const parsed = new URL(value);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
    const path = parsed.pathname.replace(/\/+$/, "");
    return `${host}${path}`.toLowerCase();
  } catch {
    return String(value)
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "")
      .replace(/[?#].*$/, "")
      .replace(/\/+$/, "")
      .toLowerCase();
  }
}

function isMethodologyUrl(value) {
  return String(value || "").toLowerCase().includes("/docs/")
    || String(value || "").toLowerCase().includes("scoring-rubric");
}

// Pure: takes the changelog array (lazily loaded by the caller) rather than
// reading a module-level import, so the 220KB JSON stays out of this chunk.
function buildGradeMovesBySource(changelog, dimId) {
  const moves = new Map();

  changelog.forEach((entry) => {
    (entry.items || []).forEach((item) => {
      if (item?.type !== "grade" || item.dimensionId !== dimId) return;
      const label = `${item.from} → ${item.to}`;
      const href = item.link?.href || null;
      const canonical = canonicalUrl(href);
      if (!canonical || isMethodologyUrl(href)) return;
      const existing = moves.get(canonical) || [];
      existing.push({
        date: entry.date,
        label,
        title: `${entry.date}: ${item.headline || `Grade moved ${label}`}`,
      });
      moves.set(canonical, existing);
    });
  });

  return { moves };
}

function buildGradeMoveHistory(changelog, dimId) {
  return changelog.flatMap((entry) => (
    (entry.items || [])
      .filter((item) => item?.type === "grade" && item.dimensionId === dimId)
      .map((item, summaryIndex) => {
        const itemIndex = Number.isInteger(item.itemIndex) ? item.itemIndex : summaryIndex;
        return {
          ...item,
          date: entry.date,
          version: entry.version,
          anchorId: `change-${entry.date}-${dimId}-${itemIndex}`,
        };
      })
  ));
}

function buildDimensionHistory(dim, isTracker, gradeMoves) {
  const events = gradeMoves.map((move, index) => ({
    type: "grade-move",
    date: move.date,
    key: `grade-${move.date}-${index}`,
    move,
    rank: 1,
  }));

  if (dim.latestReview) {
    events.push({
      type: "review",
      date: dim.latestReview.date,
      key: `review-${dim.latestReview.date}`,
      review: dim.latestReview,
      rank: 2,
    });
  }

  if (dim.latestEvidenceReview) {
    events.push({
      type: "evidence-review",
      date: dim.latestEvidenceReview.date,
      key: `evidence-${dim.latestEvidenceReview.date}`,
      review: dim.latestEvidenceReview,
      rank: 3,
    });
  }

  if (isTracker) {
    (dim.promises || []).forEach((promise, promiseIndex) => {
      (promise.history || []).forEach((event, eventIndex) => {
        events.push({
          type: "promise",
          date: event.date,
          key: `promise-${promiseIndex}-${eventIndex}-${event.date}`,
          promise,
          event,
          rank: 0,
        });
      });
    });
  }

  return events.sort((a, b) => (
    b.date.localeCompare(a.date) || b.rank - a.rank || a.key.localeCompare(b.key)
  ));
}

function sourceDateSortValue(source) {
  if (!source?.date) return "0000-00-00";
  if (/^\d{4}-\d{2}$/.test(source.date)) return `${source.date}-01`;
  return source.date;
}

function formatSourceDate(source) {
  if (source?.needsManualDate) return "needs review";
  if (!source?.date) return "undated";

  const [year, month, day] = source.date.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day || 1));
  const formatted = day
    ? date.toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
    : date.toLocaleDateString("en-CA", { month: "short", year: "numeric", timeZone: "UTC" });

  if (source.dateKind === "as-of") return `as of ${formatted}`;
  return formatted;
}

function sourceDateKindLabel(source) {
  if (source?.needsManualDate) return "manual";
  if (source?.dateKind === "as-of") return "live";
  if (source?.dateKind === "updated") return "updated";
  return "published";
}

function sortSourcesByDate(sources = []) {
  return [...sources].sort((a, b) => {
    const byDate = sourceDateSortValue(b).localeCompare(sourceDateSortValue(a));
    if (byDate !== 0) return byDate;
    return String(a.label || "").localeCompare(String(b.label || ""));
  });
}

function countPromisesByStatus(promises = []) {
  return promises.reduce((counts, promise) => {
    const key = String(promise.status || "unknown").toLowerCase();
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

function addSourceUsage(map, url, usage) {
  const canonical = canonicalUrl(url);
  if (!canonical) return;
  const existing = map.get(canonical) || new Set();
  existing.add(usage);
  map.set(canonical, existing);
}

function buildSourceUsageByUrl(dim, metrics = []) {
  const usage = new Map();

  metrics.forEach((metric) => {
    (metric.sourceRefs || []).forEach((sourceRef) => {
      addSourceUsage(usage, sourceRef.url, "metric source");
    });
  });

  ["up", "down"].forEach((direction) => {
    (dim.gradeTriggers?.[direction] || []).forEach((trigger) => {
      const item = normalizeTrigger(trigger);
      if (!item) return;
      addSourceUsage(usage, item.sourceUrl, "trigger source");
      (item.additionalSources || []).forEach((source) => {
        addSourceUsage(usage, source.url, "trigger source");
      });
    });
  });

  return usage;
}

function PolicySwitcher({ previousPolicy, nextPolicy, onPolicyNavigate }) {
  if (!previousPolicy || !nextPolicy || !onPolicyNavigate) return null;

  const navigate = (event, policy) => {
    event.stopPropagation();
    onPolicyNavigate(policy.id);
  };

  return (
    <div className="dim-policy-switcher" aria-label="Browse policies">
      <button
        type="button"
        className="dim-policy-switcher-button"
        onClick={(event) => navigate(event, previousPolicy)}
        aria-label={`Previous policy: ${previousPolicy.name}`}
        title={`Previous: ${previousPolicy.name}`}
      >
        <span aria-hidden="true">←</span>
        <span>Previous</span>
      </button>
      <button
        type="button"
        className="dim-policy-switcher-button"
        onClick={(event) => navigate(event, nextPolicy)}
        aria-label={`Next policy: ${nextPolicy.name}`}
        title={`Next: ${nextPolicy.name}`}
      >
        <span>Next</span>
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}

function EvidenceReviewList({ title, items, variant }) {
  return (
    <article className={`dim-review-evidence dim-review-evidence-${variant}`}>
      <h4>{title}</h4>
      <ul>
        {items.map((item) => (
          <li key={`${item.sourceUrl}-${item.text}`}>
            <p>{item.text}</p>
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
            >
              {item.sourceLabel}
              <span aria-hidden="true">↗</span>
            </a>
            <span className="dim-review-source-meta">
              {item.sourceRole} · {formatSourceDate({ date: item.sourceDate })}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function LatestEvidenceReview({ review, dimId, dimName }) {
  if (!review) return null;

  const headingId = `dim-${dimId}-latest-evidence-review-title`;

  return (
    <section
      id={`dim-${dimId}-latest-evidence-review`}
      className="dim-decision-brief dim-default-block"
      aria-labelledby={headingId}
    >
      <header className="dim-decision-brief-head">
        <div>
          <span className="dim-decision-brief-label">Decision brief</span>
          <h3 id={headingId}>Latest evidence review</h3>
          <p>{review.title}</p>
        </div>
        <time dateTime={review.date}>{formatSourceDate({ date: review.date })}</time>
      </header>

      <div className="dim-review-trigger">
        <h4>Trigger under review</h4>
        <p>{review.triggerUnderReview}</p>
      </div>

      <div className="dim-review-evidence-grid">
        <EvidenceReviewList
          title="Evidence earning credit"
          items={review.evidenceEarningCredit}
          variant="credit"
        />
        <EvidenceReviewList
          title="Evidence limiting credit"
          items={review.evidenceLimitingCredit}
          variant="limit"
        />
      </div>

      <div className="dim-review-unproven">
        <h4>Still unproven</h4>
        <ul>
          {review.stillUnproven.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>

      <dl className="dim-review-readout">
        <div>
          <dt>Scorecard read</dt>
          <dd>{review.scorecardRead}</dd>
        </div>
        <div>
          <dt>Review outcome</dt>
          <dd>{review.outcome}</dd>
        </div>
        <div>
          <dt>Next check</dt>
          <dd>{review.nextCheck}</dd>
        </div>
      </dl>

      <p className="dim-review-caveat">{review.caveat}</p>

      <div className="dim-review-pages">
        <h4>Official pages checked ({review.pagesChecked.length})</h4>
        <ul aria-label={`${dimName} official pages checked`}>
          {review.pagesChecked.map((page) => (
            <li key={page.url}>
              <a
                href={page.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
              >
                {page.label}
                <span aria-hidden="true">↗</span>
              </a>
              <span>{page.role} · checked {formatSourceDate({ date: page.checkedAt })}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function DimensionCard({
  dim,
  isExpanded,
  focusedDesktop = false,
  onClick,
  trackerStat,
  onInternalRef,
  anchorNavigation,
  onHashTarget,
  gradeMoves = [],
  detailStatus = "ready",
  onRetryDetails,
  previousPolicy,
  nextPolicy,
  onPolicyNavigate,
}) {
  const isTracker = !!dim.excludeFromGPA;
  const heldReview = !isTracker && dim.latestReview?.outcome === "held"
    ? dim.latestReview
    : null;
  const reviewedDate = isTracker
    ? dim.lastUpdated
    : (dim.latestReview?.date || dim.lastUpdated);
  const collapsedReviewDescription = !isExpanded && heldReview
    ? [
      `dim-${dim.id}-latest-review`,
      reviewedDate ? `dim-${dim.id}-reviewed-date` : null,
    ].filter(Boolean).join(" ")
    : undefined;
  const g = isTracker ? null : GRADES[dim.grade];
  const modifierItems = dim.gradeBasis?.activeModifiers || [];
  const metrics = dim.metrics || [];
  const sources = dim.sources || [];
  const scoring = dim.scoring || null;
  const showTriggers = !!(dim.gradeTriggers || dim.nextTrigger);
  const triggerCount = (dim.gradeTriggers?.up?.length || 0) + (dim.gradeTriggers?.down?.length || 0);
  const triggerSummary = dim.gradeTriggers
    ? `${triggerCount} trigger${triggerCount === 1 ? "" : "s"}`
    : "next condition";
  const cohort = dim.projectCohort || null;
  const sortedSources = useMemo(() => sortSourcesByDate(sources), [sources]);
  const newestDatedSource = useMemo(
    () => sortedSources.find((source) => source.date && !source.needsManualDate) || null,
    [sortedSources]
  );
  const sourceGradeMoves = useMemo(
    () => buildGradeMovesBySource(changelogSummary, dim.id),
    [dim.id]
  );
  const gradeMoveHistory = useMemo(
    () => buildGradeMoveHistory(changelogSummary, dim.id),
    [dim.id]
  );
  const activeThresholdRow = useMemo(
    () => (isTracker ? null : findActiveThresholdRow(scoring?.thresholds, dim.grade)),
    [dim.grade, isTracker, scoring?.thresholds]
  );

  const [activeWorkspacePanel, setActiveWorkspacePanel] = useState(() => {
    const initialTarget = anchorNavigation?.target
      || (typeof window !== "undefined" ? window.location.hash.replace(/^#/, "") : null);
    return workspacePanelForTarget(initialTarget, dim.id);
  });
  const [stickyStackHeight, setStickyStackHeight] = useState(80);
  const [stickyHeadHeight, setStickyHeadHeight] = useState(52);
  const [isMobileDialog, setIsMobileDialog] = useState(() => (
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
  ));
  const isFocusedDesktop = focusedDesktop && !isMobileDialog;
  const headerButtonRef = useRef(null);
  const rootRef = useRef(null);
  const drawerRef = useRef(null);
  const stickyHeadRef = useRef(null);
  const miniNavRef = useRef(null);
  const previousFocusRef = useRef(null);
  const wasExpandedRef = useRef(false);
  const anchorTargetRef = useRef(anchorNavigation?.target || null);
  const closeCallbackRef = useRef(onClick);
  // Transient copy confirmation for the drawer's Share control.
  const [copyLinkFeedback, setCopyLinkFeedback] = useState(false);
  const copyFeedbackTimerRef = useRef(null);

  useLayoutEffect(() => {
    closeCallbackRef.current = onClick;
  }, [onClick]);

  useEffect(() => () => {
    if (copyFeedbackTimerRef.current) window.clearTimeout(copyFeedbackTimerRef.current);
  }, []);

  // Render-phase reset (the React adjust-state-on-prop-change pattern): a
  // drawer that closes and reopens within the 2s window must not show a
  // stale "Share text copied" confirmation.
  if (!isExpanded && copyLinkFeedback) {
    setCopyLinkFeedback(false);
  }

  const handleCopyLink = useCallback(async (event) => {
    event.stopPropagation();
    if (typeof window === "undefined") return;
    const url = window.location.href;
    const { shareData, clipboardText } = buildDimensionSharePayload({
      dim,
      trackerStat,
      url,
    });

    const canUseWebShare = typeof navigator !== "undefined"
      && typeof navigator.share === "function"
      && (typeof navigator.canShare !== "function" || navigator.canShare(shareData));

    if (canUseWebShare) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        // Dismissing the native share sheet is intentional. Other Web Share
        // failures fall through to the clipboard path below.
        if (error?.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(clipboardText);
    } catch {
      // Clipboard blocked by permissions: no confirmation, nothing broke.
      return;
    }
    setCopyLinkFeedback(true);
    if (copyFeedbackTimerRef.current) window.clearTimeout(copyFeedbackTimerRef.current);
    copyFeedbackTimerRef.current = window.setTimeout(() => setCopyLinkFeedback(false), 2000);
  }, [dim, trackerStat]);

  useEffect(() => {
    anchorTargetRef.current = anchorNavigation?.target || null;
  }, [anchorNavigation?.target]);

  const metricGroups = useMemo(() => {
    if (!metrics.some((metric) => metric.group)) {
      return [{ title: null, items: metrics }];
    }

    return metrics.reduce((groups, metric) => {
      const title = metric.group || "Other";
      const existingGroup = groups.find((group) => group.title === title);
      if (existingGroup) {
        existingGroup.items.push(metric);
        return groups;
      }
      groups.push({ title, items: [metric] });
      return groups;
    }, []);
  }, [metrics]);
  // Headline commitment (display-only): a durability:"Target" promise supplies
  // the stated TARGET; an existing metric (by id) supplies the externally-reported
  // ACTUAL. The comparison is derived by the shared dimensionTargets helpers so it
  // cannot drift from the validator. Never read by GPA/grade math.
  const headlineCommitment = useMemo(() => {
    if (isTracker) return null;
    const promise = (dim.promises || []).find((p) => p && p.headlineCommitment);
    if (!promise) return null;
    const hc = promise.headlineCommitment;
    const metric = metrics.find((m) => m && m.id === hc.actualMetricId);
    if (!metric) return null;
    const primaryRef = (metric.sourceRefs || []).find((ref) => ref && ref.primary === true);
    return {
      metricId: hc.actualMetricId,
      targetDisplay: formatTarget(hc.targetOperator, hc.targetNumeric, hc.unit),
      targetPeriod: hc.targetPeriod,
      targetSourceUrl: promise.originalSourceUrl,
      targetSourceLabel: promise.originalSourceLabel,
      actualDisplay: formatValue(metric.numericValue, metric.unit, metric.precision),
      actualPeriod: formatPeriod(metric.actualPeriod, metric.actualQualifier),
      actualSourceUrl: primaryRef?.url,
      actualSourceLabel: primaryRef?.label,
      relation: deriveRelation(metric.numericValue, hc.targetNumeric, hc.targetOperator, metric.precision),
      comparabilityNote: hc.comparabilityNote,
    };
  }, [dim.promises, metrics, isTracker]);
  const leadMetrics = useMemo(
    () => metrics.filter((metric) => metric.lead === true),
    [metrics]
  );
  const sourceUsageByUrl = useMemo(() => buildSourceUsageByUrl(dim, metrics), [dim, metrics]);
  const promiseStatusCounts = useMemo(() => countPromisesByStatus(dim.promises || []), [dim.promises]);

  const scoringMetadata = [];
  if (dim.tags?.confidence) scoringMetadata.push({ label: "Confidence", value: dim.tags.confidence });
  if (dim.tags?.attribution) scoringMetadata.push({ label: "Attribution", value: dim.tags.attribution });
  if (dim.tags?.lag) scoringMetadata.push({ label: "Lag", value: dim.tags.lag });

  const hasSubScores = !isTracker && !!dim.subScores;
  const hasProjects = !!(cohort && cohort.projects && cohort.projects.length > 0);
  const hasPromises = !!(dim.promises && dim.promises.length > 0);
  const hasTrackerTriggers = isTracker && !!dim.gradeTriggers;
  const triggerPresentation = dim.gradeTriggers?.presentation || {};
  const hasPerspectives = !!dim.perspectives;
  const keyContextItems = [];
  if (scoring?.scopeNote) {
    keyContextItems.push({ label: "Scope", text: scoring.scopeNote });
  }
  if (dim.tags?.attribution) {
    keyContextItems.push({
      label: "Attribution",
      text: `Federal control is classified as ${dim.tags.attribution}.`,
    });
  }
  if (dim.tags?.lag) {
    keyContextItems.push({
      label: "Lag",
      text: `This dimension moves on a ${dim.tags.lag.toLowerCase()} timeline.`,
    });
  }
  if (modifierItems.length > 0) {
    keyContextItems.push({
      label: "Active adjustments",
      text: modifierItems.map(renderModifierContext).filter(Boolean).join(" / "),
    });
  }
  const hasScopeContext = keyContextItems.length > 0 || !!dim.scope || !!dim.inherited;

  const activateWorkspaceTarget = (target, options = {}) => {
    if (!target) return;
    const panel = workspacePanelForTarget(target, dim.id);
    setActiveWorkspacePanel(panel);
    if (options.replaceHash !== false && typeof window !== "undefined") {
      window.history.replaceState(window.history.state, "", `#${target}`);
    }
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        focusWorkspaceTarget(target, dim.id, panel, options.focus !== false);
      });
    }
  };

  const handleHashLinkClick = (e, target, options = {}) => {
    e.preventDefault();
    e.stopPropagation();
    if (targetBelongsToDimension(target, dim.id)) {
      activateWorkspaceTarget(target, options);
      return;
    }
    if (onHashTarget) {
      onHashTarget(target);
      return;
    }
    if (typeof window !== "undefined") {
      window.history.replaceState(window.history.state, "", `#${target}`);
    }
  };

  const renderScopeItem = (item) => {
    if (!item) return null;
    if (typeof item === "string") return item;
    if (item.homedIn) return `${item.item} (homed in ${item.homedIn})`;
    if (item.reason) return `${item.item} (${item.reason})`;
    return item.item;
  };

  const renderTriggerItem = (trigger, keyPrefix) => {
    const item = normalizeTrigger(trigger);
    if (!item) return null;
    const eventDriven = isEventDrivenTrigger(item);

    const handleInternalRefClick = (e) => {
      e.stopPropagation();
      if (!item.internalRef) return;

      if (item.internalRef.type === "cohort") {
        activateWorkspaceTarget(`dim-${dim.id}-cohort`);
        return;
      }

      onInternalRef?.(item.internalRef);
    };

    return (
      <div
        key={`${keyPrefix}-${item.text}`}
        style={{ display: "flex", flexDirection: "column", gap: "2px" }}
      >
        <span>{item.text}</span>
        {item.setDate && (
          <time
            className="dim-trigger-setdate"
            dateTime={item.setDate}
            title={`This condition was published on ${item.setDate}, before the evidence it now judges.`}
          >
            condition set {item.setDate}
          </time>
        )}
        {item.sourceLabel && (
          item.internalRef ? (
            <button
              type="button"
              className="text-link-button"
              onClick={handleInternalRefClick}
              style={{
                fontSize: "12px",
                color: "#1565c0",
                textDecoration: "none",
                alignSelf: "flex-start",
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 600,
              }}
            >
              Evidence: {item.sourceLabel} &rarr;
            </button>
          ) : item.sourceUrl ? (
            <a
              href={item.sourceUrl}
              aria-label={item.sourceLabel}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                fontSize: "12px",
                color: "#1565c0",
                textDecoration: "none",
                alignSelf: "flex-start",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "3px",
              }}
            >
              Source: {item.sourceLabel}
              <span aria-hidden="true" style={{ fontSize: "11px", opacity: 0.7 }}>↗</span>
            </a>
          ) : (
            <span
              style={{
                fontSize: "12px",
                color: "#6b7280",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                flexWrap: "wrap",
              }}
            >
              Source: {item.sourceLabel}
              {eventDriven && (
                <span className="dim-event-chip">
                  Event
                </span>
              )}
            </span>
          )
        )}
        {Array.isArray(trigger?.additionalSources) && trigger.additionalSources.length > 0 && (
          <div className="dim-trigger-additional-sources">
            <strong>
              Independent challenge source{trigger.additionalSources.length === 1 ? "" : "s"}
            </strong>
            <ul style={{ margin: "6px 0 0", paddingLeft: "18px", lineHeight: 1.5 }}>
              {trigger.additionalSources.map((alt, i) => (
                <li key={i} style={{ marginBottom: "4px" }}>
                  {alt.url ? (
                    <a
                      href={alt.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{ color: "#1565c0", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "3px" }}
                    >
                      {alt.label}
                      <span aria-hidden="true" style={{ fontSize: "11px", opacity: 0.7 }}>↗</span>
                    </a>
                  ) : (
                    <span style={{ fontWeight: 600 }}>{alt.label}</span>
                  )}
                  {alt.role && (
                    <span style={{ color: "#6b7280" }}> - {alt.role}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobileDialog(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isExpanded) return undefined;
    if (!isMobileDialog && !isFocusedDesktop) return undefined;

    if (isMobileDialog) previousFocusRef.current = document.activeElement;
    const drawer = drawerRef.current;
    const headerButton = headerButtonRef.current;
    const anchorTarget = anchorTargetRef.current;
    const hasPendingWorkspaceTarget = anchorTarget
      && targetBelongsToDimension(anchorTarget, dim.id);
    let frame = null;

    if (!hasPendingWorkspaceTarget) {
      frame = window.requestAnimationFrame(() => {
        const initialFocus = isFocusedDesktop
          ? document.getElementById(`dim-${dim.id}-title`)
          : drawerRef.current;
        initialFocus?.focus({ preventScroll: true });
      });
    }

    const handleKeyDown = (event) => {
      const isEscape = event.key === "Escape";
      if (event.key !== "Escape" && event.key !== "Tab") return;

      if (isEscape) {
        event.preventDefault();
        closeCallbackRef.current?.(event);
        return;
      }

      if (!isMobileDialog) return;

      const currentDrawer = drawerRef.current;
      if (!currentDrawer) return;

      const tabbableElements = Array.from(currentDrawer.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]'
      )).filter((element) => {
        if ("disabled" in element && element.disabled) return false;
        if (element.tabIndex < 0 || element.getClientRects().length === 0) return false;
        if (element.closest('[hidden], [aria-hidden="true"], [inert]')) return false;
        const style = window.getComputedStyle(element);
        return style.display !== "none"
          && style.visibility !== "hidden"
          && style.visibility !== "collapse";
      });

      if (tabbableElements.length === 0) {
        event.preventDefault();
        currentDrawer.focus({ preventScroll: true });
        return;
      }

      const activeIndex = tabbableElements.indexOf(document.activeElement);
      if (activeIndex === -1) {
        event.preventDefault();
        const target = event.shiftKey
          ? tabbableElements[tabbableElements.length - 1]
          : tabbableElements[0];
        target.focus({ preventScroll: true });
        return;
      }

      const shouldWrapBackward = event.shiftKey && activeIndex === 0;
      const shouldWrapForward = !event.shiftKey && activeIndex === tabbableElements.length - 1;
      if (shouldWrapBackward || shouldWrapForward) {
        event.preventDefault();
        const target = shouldWrapBackward
          ? tabbableElements[tabbableElements.length - 1]
          : tabbableElements[0];
        target.focus({ preventScroll: true });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleKeyDown);
      if (!isMobileDialog) return;

      const previousFocus = previousFocusRef.current;
      const canRestorePreviousFocus = previousFocus
        && previousFocus.isConnected
        && previousFocus !== document.body
        && previousFocus !== document.documentElement
        && !drawer?.contains(previousFocus)
        && typeof previousFocus.focus === "function";
      if (canRestorePreviousFocus) {
        previousFocus.focus({ preventScroll: true });
      } else {
        headerButton?.focus({ preventScroll: true });
      }
    };
  }, [dim.id, isExpanded, isFocusedDesktop, isMobileDialog]);

  useEffect(() => {
    if (!isExpanded || detailStatus !== "ready") return undefined;
    if (!isMobileDialog && !isFocusedDesktop) return undefined;

    const anchorTarget = anchorTargetRef.current;
    const hasPendingWorkspaceTarget = anchorTarget
      && targetBelongsToDimension(anchorTarget, dim.id);
    if (hasPendingWorkspaceTarget) return undefined;

    const frame = window.requestAnimationFrame(() => {
      const drawer = drawerRef.current;
      if (drawer && !drawer.contains(document.activeElement)) {
        drawer.focus({ preventScroll: true });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [detailStatus, dim.id, isExpanded, isFocusedDesktop, isMobileDialog]);

  useLayoutEffect(() => {
    if (!isExpanded) return undefined;

    const measure = () => {
      const head = stickyHeadRef.current?.getBoundingClientRect().height || 0;
      const nav = miniNavRef.current?.getBoundingClientRect().height || 0;
      const stack = Math.max(64, Math.ceil(head + nav));
      setStickyHeadHeight(Math.max(48, Math.ceil(head)));
      setStickyStackHeight(stack);
    };

    measure();

    const observers = [];
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(measure);
      if (stickyHeadRef.current) observer.observe(stickyHeadRef.current);
      if (miniNavRef.current) observer.observe(miniNavRef.current);
      observers.push(observer);
    }

    window.addEventListener("resize", measure);
    return () => {
      observers.forEach((observer) => observer.disconnect());
      window.removeEventListener("resize", measure);
    };
  }, [isExpanded]);

  useLayoutEffect(() => {
    const wasExpanded = wasExpandedRef.current;
    wasExpandedRef.current = isExpanded;
    if (!isExpanded || wasExpanded || isMobileDialog) return undefined;

    rootRef.current?.scrollIntoView({
      behavior: "auto",
      block: "start",
      inline: "nearest",
    });

    return undefined;
  }, [isExpanded, isMobileDialog]);

  useEffect(() => {
    const target = anchorNavigation?.target;
    if (!isExpanded || !target || !targetBelongsToDimension(target, dim.id)) return;
    const panel = workspacePanelForTarget(target, dim.id);
    const canonicalTarget = workspacePanelAnchor(dim.id, panel);
    let focusFrame = null;
    const stateFrame = window.requestAnimationFrame(() => {
      setActiveWorkspacePanel(panel);
      if (target !== canonicalTarget) {
        window.history.replaceState(window.history.state, "", `#${canonicalTarget}`);
      }
      focusFrame = window.requestAnimationFrame(() => {
        focusWorkspaceTarget(canonicalTarget, dim.id, panel, true);
      });
    });
    return () => {
      window.cancelAnimationFrame(stateFrame);
      if (focusFrame) window.cancelAnimationFrame(focusFrame);
    };
  }, [anchorNavigation?.requestId, anchorNavigation?.target, dim.id, isExpanded]);

  useEffect(() => {
    if (isExpanded) return;
    let cancelled = false;
    const clearClosedState = () => {
      if (cancelled) return;
      setActiveWorkspacePanel("briefing");
    };
    if (typeof window !== "undefined") {
      window.setTimeout(clearClosedState, 0);
    } else {
      Promise.resolve().then(clearClosedState);
    }
    return () => {
      cancelled = true;
    };
  }, [isExpanded]);

  if (!isTracker && !g) return null;

  const borderColor = isExpanded
    ? (isTracker ? "var(--accent-tracker)" : g.color)
    : (isTracker ? "var(--border-tracker)" : "var(--border-subtle)");
  const raisedShadow = isTracker ? "0 2px 12px #bfa86b22" : `0 2px 12px ${g.color}22`;
  const rootBackground = isFocusedDesktop ? "transparent" : (isTracker ? "var(--surface-card-tracker)" : "var(--surface-card)");
  const rootBorder = isFocusedDesktop ? "0" : `1px solid ${borderColor}`;
  const rootPadding = isFocusedDesktop ? 0 : "16px";
  const rootRadius = isFocusedDesktop ? 0 : "var(--card-radius)";
  const rootShadow = isFocusedDesktop
    ? "none"
    : (isExpanded ? raisedShadow : "var(--shadow-card)");
  const subScoreSummary = hasSubScores
    ? Object.values(dim.subScores).map((sub) => `${sub.label}: ${sub.grade}`).join(" / ")
    : null;
  const promiseStatusSummary = hasPromises
    ? Object.entries(promiseStatusCounts)
      .map(([status, count]) => `${count} ${status}`)
      .join(" / ")
    : null;
  const latestGradeMove = Array.isArray(gradeMoves) && gradeMoves.length > 0
    ? gradeMoves[0]
    : null;
  const historyEvents = buildDimensionHistory(dim, isTracker, gradeMoveHistory);
  const sourceDownloadPayload = {
    id: dim.id,
    name: dim.name,
    ...(isTracker ? { informationalGrade: dim.informationalGrade } : { grade: dim.grade }),
    sources,
    metrics,
    lastUpdated: dim.lastUpdated,
    ...(dim.latestReview ? { latestReview: dim.latestReview } : {}),
  };

  return (
    <div
      id={`dim-${dim.id}`}
      ref={rootRef}
      className={`dimension-card-root${isFocusedDesktop ? " dim-focused-detail-root" : ""}`}
      data-grade-moved-this-release={latestGradeMove ? "true" : "false"}
      style={{
        background: rootBackground,
        border: rootBorder,
        borderRadius: rootRadius,
        padding: rootPadding,
        transition: "border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
        boxShadow: rootShadow,
        gridColumn: isExpanded ? "1 / -1" : "auto",
      }}
    >
      {!isFocusedDesktop && (
        <button
          id={`dim-${dim.id}-header`}
          ref={headerButtonRef}
          type="button"
          className="dim-card-header-button"
          onClick={onClick}
          aria-expanded={isExpanded}
          aria-controls={`dim-${dim.id}-drawer`}
          aria-labelledby={`dim-${dim.id}-title`}
          aria-describedby={collapsedReviewDescription}
        >
          <div className="dim-card-header-content">
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2
                id={`dim-${dim.id}-title`}
                style={{
                  fontWeight: 700,
                  fontSize: "15px",
                  color: "#1a1a1a",
                  fontFamily: "'DM Sans', sans-serif",
                  margin: "0 0 4px",
                  lineHeight: 1.3,
                }}
              >
                {dim.name}
                <TrendArrow trend={dim.trend} />
                {dim.previousGrade && (
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#c62828",
                      marginLeft: "4px",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      verticalAlign: "middle",
                    }}
                  >
                    (was {dim.previousGrade})
                  </span>
                )}
              </h2>
              {isTracker && (
                <div className="dim-tracker-pill">
                  Tracker &middot; No letter grade
                </div>
              )}
              {dim.whatThisGrades && (
                <div
                  style={{
                    fontSize: "14px",
                    color: "#555",
                    fontStyle: "italic",
                    lineHeight: 1.4,
                    marginBottom: "4px",
                  }}
                >
                  {dim.whatThisGrades}
                </div>
              )}
              <div
                className="dim-verdict-line"
                style={{ fontSize: "15px", color: "#333", lineHeight: 1.5 }}
              >
                {dim.verdictLine || dim.status}
              </div>
              {!isExpanded && heldReview && (
                <div
                  id={`dim-${dim.id}-latest-review`}
                  className="dim-latest-review dim-latest-review-collapsed"
                  data-review-outcome="held"
                >
                  <span className="dim-latest-review-meta">
                    <span className="dim-latest-review-label">This review</span>
                    <span className="dim-latest-review-separator" aria-hidden="true">&#183;</span>
                    <strong>Grade held</strong>
                  </span>
                  <span className="dim-latest-review-copy" title={heldReview.summary}>
                    {heldReview.summary}
                  </span>
                </div>
              )}
              {!isTracker && dim.nextTrigger && (
                <div
                  className="dim-next-check-line"
                  title={dim.nextTrigger}
                  style={{
                    fontSize: "12px",
                    color: "#767676",
                    lineHeight: 1.4,
                    marginTop: "4px",
                  }}
                >
                  Next check: {(() => {
                    // Verbatim first sentence of the editor-authored nextTrigger.
                    const first = String(dim.nextTrigger).split(". ")[0];
                    return first.endsWith(".") ? first : `${first}.`;
                  })()}
                </div>
              )}
              {reviewedDate && (
                <div
                  id={!isExpanded && heldReview ? `dim-${dim.id}-reviewed-date` : undefined}
                  className="last-reviewed-pill dim-last-reviewed-pill"
                >
                  <span style={{ textTransform: "uppercase", letterSpacing: "0.35px" }}>
                    Reviewed
                  </span>
                  <time dateTime={reviewedDate}>{reviewedDate}</time>
                  {meta.nextUpdate && (
                    <>
                      <span style={{ color: "#bbb", fontWeight: 400 }}>&#183;</span>
                      <span style={{ textTransform: "uppercase", letterSpacing: "0.35px", color: "#5a7a9b" }}>
                        Next
                      </span>
                      <span style={{ color: "#5a7a9b" }}>{meta.nextUpdate}</span>
                    </>
                  )}
                </div>
              )}
              {latestGradeMove && (
                <span className="dim-current-grade-move-marker">
                  Grade moved this release
                </span>
              )}
            </div>
            <div className="dim-card-grade-stack">
              {isTracker ? (
                trackerStat ? (
                  <div className="dim-tracker-count">
                    <div className="dim-tracker-count-number">
                      {trackerStat.delivered}
                      <span>/{trackerStat.total}</span>
                    </div>
                    <div className="dim-tracker-count-label">delivered</div>
                  </div>
                ) : (
                  <span className="dim-info-grade-pill">
                    {dim.informationalGrade} tracker, outside GPA
                  </span>
                )
              ) : (
                <GradeChip grade={dim.grade} />
              )}
              <span className="dim-open-hint">
                {isExpanded ? "\u25B2 close" : "\u25BC open"}
              </span>
            </div>
          </div>
        </button>
      )}

      {isExpanded && detailStatus !== "ready" ? (
        <div
          id={`dim-${dim.id}-drawer`}
          ref={drawerRef}
          tabIndex={-1}
          role={isMobileDialog ? "dialog" : undefined}
          aria-modal={isMobileDialog ? "true" : undefined}
          aria-labelledby={`dim-${dim.id}-title`}
          onClick={(e) => e.stopPropagation()}
          className="dim-drawer"
          style={{
            "--dim-sticky-head": `${stickyHeadHeight}px`,
            "--dim-sticky-stack": `${stickyStackHeight}px`,
            ...(isMobileDialog || isFocusedDesktop ? {} : {
              marginTop: "16px",
              borderTop: "1px solid #eee",
            }),
            paddingTop: "0",
          }}
        >
          <div ref={stickyHeadRef} className="dim-drawer-sticky-head">
            <span
              id={isFocusedDesktop ? `dim-${dim.id}-title` : undefined}
              className="dim-drawer-title"
              tabIndex={isFocusedDesktop ? -1 : undefined}
            >
              {dim.name}
            </span>
            {isFocusedDesktop && (
              <PolicySwitcher
                previousPolicy={previousPolicy}
                nextPolicy={nextPolicy}
                onPolicyNavigate={onPolicyNavigate}
              />
            )}
            <button
              type="button"
              className="dim-drawer-close"
              onClick={(event) => {
                event.stopPropagation();
                onClick?.(event);
              }}
              aria-label="Close"
            >
              <span className="dim-drawer-close-label">Close</span>
            </button>
          </div>
          {detailStatus === "error" ? (
            <div className="route-load-error" role="alert">
              <strong>Policy details did not load.</strong>
              <span>The scorecard is still available.</span>
              <button type="button" onClick={onRetryDetails}>Try again</button>
            </div>
          ) : (
            <div className="route-loading" role="status" aria-live="polite">
              Loading policy details...
            </div>
          )}
        </div>
      ) : isExpanded && (
        <div
          id={`dim-${dim.id}-drawer`}
          ref={drawerRef}
          tabIndex={-1}
          role={isMobileDialog ? "dialog" : undefined}
          aria-modal={isMobileDialog ? "true" : undefined}
          aria-labelledby={`dim-${dim.id}-title`}
          onClick={(e) => e.stopPropagation()}
          className="dim-drawer"
          style={{
            "--dim-sticky-head": `${stickyHeadHeight}px`,
            "--dim-sticky-stack": `${stickyStackHeight}px`,
            "--dim-anchor-offset": `calc(${stickyStackHeight}px + 12px)`,
            ...(isMobileDialog || isFocusedDesktop ? {} : {
              marginTop: "16px",
              borderTop: "1px solid #eee",
            }),
            paddingTop: "0",
          }}
        >
          <div
            ref={stickyHeadRef}
            className="dim-drawer-sticky-head"
          >
            <span
              id={isFocusedDesktop ? `dim-${dim.id}-title` : undefined}
              className="dim-drawer-title"
              tabIndex={isFocusedDesktop ? -1 : undefined}
            >
              {dim.name}
            </span>
            {isTracker && (
              <span className="dim-drawer-info-grade">
                Tracker
              </span>
            )}
            <span className="dim-drawer-copy-feedback" aria-live="polite">
              {copyLinkFeedback ? "Share text copied" : ""}
            </span>
            {isFocusedDesktop && (
              <PolicySwitcher
                previousPolicy={previousPolicy}
                nextPolicy={nextPolicy}
                onPolicyNavigate={onPolicyNavigate}
              />
            )}
            <button
              type="button"
              className="dim-drawer-copy-link"
              onClick={handleCopyLink}
              aria-label="Share this card"
            >
              <svg
                className="dim-drawer-copy-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span className="dim-drawer-copy-link-label">Share</span>
            </button>
            <button
              type="button"
              className="dim-drawer-close"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.(e);
              }}
              aria-label="Close"
            >
              <svg
                className="dim-drawer-close-icon"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M4 4 L12 12 M12 4 L4 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="dim-drawer-close-label">Close</span>
            </button>
          </div>

          <nav
            ref={miniNavRef}
            className="dimension-workspace-nav"
            aria-label="Policy detail sections"
          >
            {WORKSPACE_PANELS.map((panel) => {
              const isCurrent = activeWorkspacePanel === panel.id;
              return (
                <button
                  key={panel.id}
                  type="button"
                  className="dimension-workspace-tab"
                  aria-current={isCurrent ? "page" : undefined}
                  onClick={(event) => {
                    event.stopPropagation();
                    activateWorkspaceTarget(workspacePanelAnchor(dim.id, panel.id), { focus: false });
                  }}
                >
                  {panel.label}
                </button>
              );
            })}
          </nav>

          <div className="dimension-workspace">
            {activeWorkspacePanel === "briefing" && (
              <section
                id={workspacePanelAnchor(dim.id, "briefing")}
                className="dimension-workspace-panel dimension-briefing"
                tabIndex={-1}
                aria-label={`${dim.name} briefing`}
              >
                <div
                  id={`dim-${dim.id}-summary`}
                  className="dimension-briefing-section"
                  tabIndex={-1}
                >
                  <section className="dim-verdict-hero dim-default-block">
                    <div className="dim-verdict-copy">
                      <div className="dim-default-block-head">
                        <span>{isTracker ? "Tracker snapshot" : "Verdict"}</span>
                      </div>
                      {dim.whatThisGrades && <p className="dim-verdict-kicker">{dim.whatThisGrades}</p>}
                      <p className="dim-verdict-status">{dim.verdictLine || dim.status}</p>
                      {dim.verdictLine && dim.status !== dim.verdictLine && <p>{dim.status}</p>}
                      {dim.latestReview && (
                        <div
                          id={`dim-${dim.id}-latest-review`}
                          className="dim-latest-review dim-latest-review-expanded"
                          data-review-outcome={dim.latestReview.outcome}
                          tabIndex={-1}
                        >
                          <span className="dim-latest-review-meta">
                            <span className="dim-latest-review-label">This review</span>
                            <span className="dim-latest-review-separator" aria-hidden="true">&#183;</span>
                            <strong>{dim.latestReview.outcome === "held" ? "Grade held" : "Review updated"}</strong>
                            <time dateTime={dim.latestReview.date}>{dim.latestReview.date}</time>
                          </span>
                          <p className="dim-latest-review-copy">{dim.latestReview.summary}</p>
                        </div>
                      )}
                      {isTracker && (
                        <p className="dim-verdict-note">
                          This informational tracker is outside the GPA and is not included in headline scores.
                        </p>
                      )}
                      {isTracker && (
                        <p className="dim-info-grade-pill">{dim.informationalGrade}</p>
                      )}
                      {activeThresholdRow && (
                        <div className="dim-live-threshold-row">
                          <span>{activeThresholdRow.grade}</span>
                          <p>{activeThresholdRow.criteria}</p>
                        </div>
                      )}
                      {!isTracker && dim.gradeBasis?.whyNotHigher && (
                        <div className="dim-why-not">
                          <strong>Why not higher:</strong> {dim.gradeBasis.whyNotHigher}
                        </div>
                      )}
                      {!isTracker && dim.gradeBasis?.whyNotLower && (
                        <div className="dim-why-not">
                          <strong>Why not lower:</strong> {dim.gradeBasis.whyNotLower}
                        </div>
                      )}
                      {reviewedDate && (
                        <div className="last-reviewed-pill dim-last-reviewed-pill">
                          <span>Reviewed</span>
                          <time dateTime={reviewedDate}>{reviewedDate}</time>
                          {meta.nextUpdate && <span>Next {meta.nextUpdate}</span>}
                        </div>
                      )}
                      {latestGradeMove && (
                        <div className="dim-change-card dim-current-grade-move-callout">
                          <div className="dim-change-card-title">Grade moved this release</div>
                          <p>{latestGradeMove.headline || `${dim.name} moved ${latestGradeMove.from} to ${latestGradeMove.to}`}.</p>
                          <a
                            href={`#${latestGradeMove.anchorId}`}
                            onClick={(event) => handleHashLinkClick(event, latestGradeMove.anchorId)}
                          >
                            Open the change note
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="dim-verdict-mark">
                      {isTracker ? (
                        trackerStat ? (
                          <div className="dim-tracker-count dim-tracker-count-large">
                            <div className="dim-tracker-count-number">
                              {trackerStat.delivered}<span>/{trackerStat.total}</span>
                            </div>
                            <div className="dim-tracker-count-label">delivered</div>
                          </div>
                        ) : (
                          <span className="dim-info-grade-pill">{dim.informationalGrade} tracker</span>
                        )
                      ) : (
                        <>
                          <GradeChip grade={dim.grade} />
                          <TrendArrow trend={dim.trend} />
                          {dim.previousGrade && <span className="dim-previous-grade-note">was {dim.previousGrade}</span>}
                        </>
                      )}
                    </div>
                  </section>
                </div>

                {(leadMetrics.length > 0 || headlineCommitment) && (
                  <section className="dimension-briefing-section" aria-label={`${dim.name} lead evidence`}>
                    <div className="dim-default-block-head">
                      <span>Lead evidence</span>
                      <span className="dim-evidence-note">Display selection only. These are not weighted inputs.</span>
                    </div>
                    {headlineCommitment && (
                      <article className="dim-headline-commitment" id={`dim-${dim.id}-headline-title`}>
                        <h3>Headline commitment</h3>
                        <dl className="dim-headline-commitment-pairs">
                          <div><dt>Target</dt><dd><strong>{headlineCommitment.targetDisplay}</strong> {headlineCommitment.targetPeriod}</dd></div>
                          <div><dt>Result</dt><dd><strong>{headlineCommitment.actualDisplay}</strong> {headlineCommitment.actualPeriod}</dd></div>
                        </dl>
                        <p>Comparison: <strong>{headlineCommitment.relation}</strong></p>
                        {headlineCommitment.comparabilityNote && <p>{headlineCommitment.comparabilityNote}</p>}
                      </article>
                    )}
                    <div className="dim-top-metrics">
                      {leadMetrics.map((metric) => (
                        <article key={`${metric.label}-${metric.value}`} className="dim-evidence-item dim-evidence-metric">
                          <span>{metric.label}</span>
                          <strong>{metric.value}</strong>
                        </article>
                      ))}
                    </div>
                  </section>
                )}

                {showTriggers && (
                  <section
                    id={`dim-${dim.id}-triggers-section`}
                    className="dimension-briefing-section"
                    tabIndex={-1}
                  >
                    <div className="dim-default-block-head">
                      <span>{hasTrackerTriggers ? "What changes this tracker" : (triggerPresentation.title || "What would change this grade")}</span>
                      <span className="dim-evidence-note">{triggerSummary}</span>
                    </div>
                    {dim.gradeTriggers ? (
                      <div className="dimension-trigger-band">
                        <div className="dimension-trigger-column">
                          <h3>{hasTrackerTriggers ? "Upward trigger" : (triggerPresentation.upLabel || "Up one step")}</h3>
                          <div className="dim-trigger-list">
                            {dim.gradeTriggers.up.map((trigger, index) => renderTriggerItem(trigger, `briefing-up-${index}`))}
                          </div>
                        </div>
                        <div className="dimension-trigger-column">
                          <h3>{hasTrackerTriggers ? "Downward triggers" : (triggerPresentation.downLabel || "Down one step")}</h3>
                          <div className="dim-trigger-list">
                            {dim.gradeTriggers.down.map((trigger, index) => renderTriggerItem(trigger, `briefing-down-${index}`))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p>{dim.nextTrigger}</p>
                    )}
                  </section>
                )}

                {!isTracker && (dim.judgmentCall || dim.judgmentDetail || dim.rationale) && (
                  <section
                    id={`dim-${dim.id}-why`}
                    className="dimension-briefing-section dim-score-body"
                    tabIndex={-1}
                  >
                    <h3>How the judgment was made</h3>
                    {dim.judgmentCall && <p><strong>Judgment call:</strong> {dim.judgmentCall}</p>}
                    {dim.judgmentDetail && <p><strong>Where editor judgment enters:</strong> {dim.judgmentDetail}</p>}
                    {dim.rationale && <p>{dim.rationale}</p>}
                    {dim.gradeBasis?.plusMinusRationale && <p>{dim.gradeBasis.plusMinusRationale}</p>}
                  </section>
                )}

                {isTracker && trackerStat && (
                  <section className="dimension-briefing-section">
                    <h3>Current delivery pattern</h3>
                    <p>
                      <strong>{trackerStat.delivered} of {trackerStat.total}</strong> tracked commitments are delivered.
                      {promiseStatusSummary ? ` Current pattern: ${promiseStatusSummary}.` : ""}
                    </p>
                    <button
                      type="button"
                      className="dim-summary-open-button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onInternalRef?.({ type: "view", target: "promises" });
                      }}
                    >
                      Open the Promises tab →
                    </button>
                  </section>
                )}
              </section>
            )}

            {activeWorkspacePanel === "evidence" && (
              <section
                id={workspacePanelAnchor(dim.id, "evidence")}
                className="dimension-workspace-panel dim-fold-stack"
                tabIndex={-1}
                aria-label={`${dim.name} evidence`}
              >
                <header className="dimension-briefing-section">
                  <h2>Evidence record</h2>
                  <p>Metrics, promises, cited sources, projects, and competing interpretations used in this file.</p>
                </header>

                {metrics.length > 0 && (
                  <section id={`dim-${dim.id}-metrics`} className="dimension-briefing-section" tabIndex={-1}>
                    <h3>Metrics</h3>
                    <MetricsList metricGroups={metricGroups} />
                  </section>
                )}

                {showTriggers && (
                  <section
                    id={`dim-${dim.id}-tracker-triggers`}
                    className="dimension-briefing-section"
                    tabIndex={-1}
                  >
                    <h3>{hasTrackerTriggers ? "Tracker movement conditions" : "Grade movement conditions"}</h3>
                    {dim.gradeTriggers ? (
                      <TriggerColumns
                        up={dim.gradeTriggers.up}
                        down={dim.gradeTriggers.down}
                        renderTriggerItem={renderTriggerItem}
                        keyPrefix="evidence"
                        upLabel={hasTrackerTriggers ? "Upward trigger" : (triggerPresentation.upLabel || "Up one step")}
                        downLabel={hasTrackerTriggers ? "Downward triggers" : (triggerPresentation.downLabel || "Down one step")}
                      />
                    ) : <p>{dim.nextTrigger}</p>}
                  </section>
                )}

                {hasPromises && (
                  <section id={`dim-${dim.id}-promises`} className="dimension-briefing-section" tabIndex={-1}>
                    <h3>Promises</h3>
                    <p>{dim.promises.length} tracked. {promiseStatusSummary ? `Current pattern: ${promiseStatusSummary}.` : ""}</p>
                    <div className="dim-stack">
                      {dim.promises.map((promise, index) => (
                        <article key={`${promise.text}-${index}`} className="dim-nested-rule-card">
                          <div className="dim-nested-rule-title">{promise.text}</div>
                          <p><strong>Status:</strong> {promise.status}</p>
                          {promise.evidence && <p>{promise.evidence}</p>}
                          <div className="dim-metric-source-list">
                            {promise.originalSourceUrl && (
                              <a href={promise.originalSourceUrl} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()}>
                                {promise.originalSourceLabel}
                              </a>
                            )}
                            {promise.statusSourceUrl && (
                              <a href={promise.statusSourceUrl} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()}>
                                {promise.statusSourceLabel}
                              </a>
                            )}
                          </div>
                        </article>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="dim-summary-open-button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onInternalRef?.({ type: "view", target: "promises", dimension: dim.name });
                      }}
                    >
                      Open the Promises tab →
                    </button>
                  </section>
                )}

                {hasProjects && (
                  <section id={`dim-${dim.id}-cohort`} className="dimension-briefing-section" tabIndex={-1}>
                    <h3>Project pipeline</h3>
                    <ProjectCohortSection cohort={cohort} dimId={dim.id} />
                  </section>
                )}

                {sources.length > 0 && (
                  <section id={`dim-${dim.id}-sources`} className="dimension-briefing-section" tabIndex={-1}>
                    <h3>Sources</h3>
                    <div className="dim-source-overview" aria-label={`${dim.name} source freshness`}>
                      <span><strong>{sources.length}</strong> cited source{sources.length === 1 ? "" : "s"}</span>
                      {newestDatedSource && <span>Newest dated source: <strong>{formatSourceDate(newestDatedSource)}</strong></span>}
                      <span>Newest first.</span>
                    </div>
                    <SourceStackTable
                      sources={sortedSources}
                      gradeMovesBySource={sourceGradeMoves.moves}
                      usageBySource={sourceUsageByUrl}
                    />
                    <a
                      href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(sourceDownloadPayload, null, 2))}`}
                      download={`${dim.id}-sources.json`}
                      onClick={(event) => event.stopPropagation()}
                      className="dim-download-link"
                    >
                      ⤓ Download sources as JSON
                    </a>
                  </section>
                )}

                {hasPerspectives && (
                  <section id={`dim-${dim.id}-perspectives-section`} className="dimension-briefing-section" tabIndex={-1}>
                    <h3>Perspectives</h3>
                    <div className="dim-perspective-card dim-perspective-critics"><strong>Critics say:</strong> {dim.perspectives.critics}</div>
                    <div className="dim-perspective-card dim-perspective-defenders"><strong>Defenders say:</strong> {dim.perspectives.defenders}</div>
                  </section>
                )}
              </section>
            )}

            {activeWorkspacePanel === "history" && (
              <section
                id={workspacePanelAnchor(dim.id, "history")}
                className="dimension-workspace-panel"
                tabIndex={-1}
                aria-label={`${dim.name} history`}
              >
                <header className="dimension-briefing-section">
                  <h2>History</h2>
                  <p>Dated grade, review, and tracker events in one sequence.</p>
                </header>
                {historyEvents.length === 0 ? (
                  <p className="dimension-briefing-section">No dated events are recorded for this file yet.</p>
                ) : (
                  <div className="dim-stack" aria-label={`${dim.name} dated history`}>
                    {historyEvents.map((historyEvent) => {
                      if (historyEvent.type === "evidence-review") {
                        return (
                          <LatestEvidenceReview
                            key={historyEvent.key}
                            review={historyEvent.review}
                            dimId={dim.id}
                            dimName={dim.name}
                          />
                        );
                      }
                      if (historyEvent.type === "review") {
                        return (
                          <article
                            key={historyEvent.key}
                            id={`dim-${dim.id}-latest-review`}
                            className="dimension-briefing-section dim-latest-review"
                          >
                            <time dateTime={historyEvent.date}>{historyEvent.date}</time>
                            <h3>{historyEvent.review.outcome === "held" ? "Grade held" : "Review updated"}</h3>
                            <p>{historyEvent.review.summary}</p>
                          </article>
                        );
                      }
                      if (historyEvent.type === "grade-move") {
                        return (
                          <article key={historyEvent.key} className="dimension-briefing-section">
                            <time dateTime={historyEvent.date}>{historyEvent.date}</time>
                            <h3>{historyEvent.move.headline || `Grade moved ${historyEvent.move.from} to ${historyEvent.move.to}`}</h3>
                            {historyEvent.move.body && <p>{historyEvent.move.body}</p>}
                            <a href={`#${historyEvent.move.anchorId}`} onClick={(event) => handleHashLinkClick(event, historyEvent.move.anchorId)}>
                              Open the change note
                            </a>
                          </article>
                        );
                      }
                      return (
                        <article key={historyEvent.key} className="dimension-briefing-section">
                          <time dateTime={historyEvent.date}>{historyEvent.date}</time>
                          <h3>{historyEvent.promise.text}</h3>
                          <p><strong>{historyEvent.event.status}</strong>{historyEvent.event.note ? `: ${historyEvent.event.note}` : ""}</p>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {activeWorkspacePanel === "method" && (
              <section
                id={workspacePanelAnchor(dim.id, "method")}
                className="dimension-workspace-panel dim-fold-stack"
                tabIndex={-1}
                aria-label={`${dim.name} method`}
              >
                <header className="dimension-briefing-section">
                  <h2>{isTracker ? "How this tracker is built" : "How this grade is built"}</h2>
                  {dim.construct && <p><strong>Construct:</strong> {dim.construct}</p>}
                  {dim.gradeBasis?.band && <p><strong>{dim.gradeBasis.band} band:</strong> {dim.gradeBasis.bandCriterion}</p>}
                  {dim.gradeBasis?.plusMinusRationale && <p>{dim.gradeBasis.plusMinusRationale}</p>}
                </header>

                <section id={`dim-${dim.id}-scoring`} className="dimension-briefing-section" tabIndex={-1}>
                  <h3>Criteria and guardrails</h3>
                  {scoringMetadata.length > 0 && (
                    <div className="dim-meta-chip-row">
                      {scoringMetadata.map((item) => <span key={item.label} className="dim-meta-chip"><strong>{item.label}:</strong> {item.value}</span>)}
                    </div>
                  )}
                  {scoring?.scopeNote && <p><strong>What this covers:</strong> {scoring.scopeNote}</p>}
                  {scoring?.modifierExpiry && <p><strong>Timing note:</strong> {scoring.modifierExpiry}</p>}
                  {scoring?.thresholds?.length > 0 && (
                    <div className="dim-stack">
                      <h4>Grade thresholds</h4>
                      {scoring.thresholds.map((threshold) => (
                        <div key={threshold.grade} className={`dim-threshold-row ${threshold === activeThresholdRow ? "dim-threshold-row-active" : ""}`}>
                          <span>{threshold.grade}</span><p>{threshold.criteria}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {scoring?.guardrails?.length > 0 && (
                    <div className="dim-stack">
                      <h4>Rules that limit the result</h4>
                      <ul>{scoring.guardrails.map((rule) => <li key={rule}>{rule}</li>)}</ul>
                    </div>
                  )}
                  {modifierItems.length > 0 && (
                    <div className="dim-stack">
                      <h4>Scoring adjustments</h4>
                      {modifierItems.map((modifier, index) => (
                        <p key={`${modifier.name}-${index}`}><strong>{MODIFIER_LABELS[modifier.name] || modifier.name}:</strong> {modifier.status}. {modifier.reason}</p>
                      ))}
                    </div>
                  )}
                </section>

                {hasSubScores && (
                  <section id={`dim-${dim.id}-subscores`} className="dimension-briefing-section" tabIndex={-1}>
                    <h3>Sub-scores</h3>
                    {subScoreSummary && <p>{subScoreSummary}</p>}
                    {scoring?.subScoreRule && (
                      <div className="dim-note-box dim-subscore-rule">
                        <p><strong>Evaluation order:</strong> {scoring.subScoreRule.evaluationOrder}</p>
                        <p><strong>Headline calculation:</strong> {scoring.subScoreRule.combination}</p>
                        <p><strong>Current:</strong> {scoring.subScoreRule.currentCalculation}</p>
                      </div>
                    )}
                    <div className="dimension-subscore-grid">
                      {Object.values(dim.subScores).map((sub) => (
                        <article key={sub.label} className="dim-subscore-card">
                          <h4 className="dim-subscore-card-title">{sub.label}</h4>
                          <div className="dim-subscore-current"><GradeChip grade={sub.grade} size="sm" /><span>{sub.rationale}</span></div>
                          {sub.thresholds?.map((threshold) => (
                            <div key={threshold.grade} className={`dim-threshold-row ${threshold.grade === sub.grade ? "dim-threshold-row-active" : ""}`}>
                              <span>{threshold.grade}</span><p>{threshold.criteria}</p>
                            </div>
                          ))}
                        </article>
                      ))}
                    </div>
                  </section>
                )}

                {dim.gradeBasis?.leverOperationalization && (
                  <section id={`dim-${dim.id}-lever-operationalization`} className="dimension-briefing-section" tabIndex={-1}>
                    <h3>Status checks for each lever</h3>
                    <div className="dim-stack">
                      {dim.gradeBasis.leverOperationalization.map((lever) => (
                        <article key={lever.name} className="dim-nested-rule-card">
                          <h4>{lever.name}</h4>
                          <p><strong>Announced if:</strong> {lever.announced}</p>
                          <p><strong>Authorized if:</strong> {lever.authorized}</p>
                          <p><strong>Executing if:</strong> {lever.executing}</p>
                          <p><strong>Current:</strong> {lever.currentStatus}</p>
                        </article>
                      ))}
                    </div>
                    {dim.gradeBasis.leverScoreSummary && <p><strong>Score summary:</strong> {dim.gradeBasis.leverScoreSummary}</p>}
                  </section>
                )}

                {dim.gradeBasis?.componentOperationalization && (
                  <section id={`dim-${dim.id}-component-operationalization`} className="dimension-briefing-section" tabIndex={-1}>
                    <h3>Per-component checklist</h3>
                    <div className="dim-stack">
                      {dim.gradeBasis.componentOperationalization.map((component) => (
                        <article key={component.name} className="dim-nested-rule-card">
                          <h4>{component.name}</h4>
                          <p><strong>Present if:</strong> {component.presentIfX}</p>
                          <p><strong>Current:</strong> {component.currentStatus}</p>
                        </article>
                      ))}
                    </div>
                    {dim.gradeBasis.componentScoreSummary && <p><strong>Score summary:</strong> {dim.gradeBasis.componentScoreSummary}</p>}
                  </section>
                )}

                {dim.gradeBasis?.combinationRule && (
                  <section id={`dim-${dim.id}-combination-rule`} className="dimension-briefing-section" tabIndex={-1}>
                    <h3>Combination Rule</h3>
                    <CombinationRule rule={dim.gradeBasis.combinationRule} />
                  </section>
                )}

                {hasScopeContext && (
                  <section id={`dim-${dim.id}-caveats`} className="dimension-briefing-section" tabIndex={-1}>
                    <h3>Scope and context</h3>
                    {keyContextItems.length > 0 && (
                      <div id={`dim-${dim.id}-context`} className="dim-stack" tabIndex={-1}>
                        {keyContextItems.map((item) => <p key={item.label}><strong>{item.label}:</strong> {item.text}</p>)}
                      </div>
                    )}
                    {dim.scope && (
                      <div id={`dim-${dim.id}-scope`} className="dim-stack" tabIndex={-1}>
                        <h4>In scope</h4>
                        <ul>{dim.scope.inScope.map((item, index) => <li key={index}>{renderScopeItem(item)}</li>)}</ul>
                        <h4>Out of scope</h4>
                        <ul>{dim.scope.outOfScope.map((item, index) => <li key={index}>{renderScopeItem(item)}</li>)}</ul>
                      </div>
                    )}
                    {dim.inherited && <p id={`dim-${dim.id}-inherited`} tabIndex={-1}><strong>What was inherited:</strong> {dim.inherited}</p>}
                  </section>
                )}

                {scoringMetadata.length > 0 && (
                  <section id={`dim-${dim.id}-glossary`} className="dimension-briefing-section" tabIndex={-1}>
                    <h3>Glossary</h3>
                    <div className="dim-stack">
                      <div>
                        <strong>Confidence</strong> - how resistant the grade is to new data. <em>High</em> = direct measurement against numeric thresholds. <em>Medium</em> = qualitative judgment with mixed evidence. <em>Low</em> = sparse evidence.
                      </div>
                      <div>
                        <strong>Attribution</strong> - what share of the outcome the federal government actually controls. <em>Direct</em> = at least 60% federal levers. <em>Mixed</em> = 30 to 60%. <em>Mostly inherited</em> = less than 30%.
                      </div>
                      <div>
                        <strong>Lag</strong> - how long policy effects take to show in the metrics. <em>Short</em> = monthly / quarterly. <em>Medium</em> = 1 to 2 year cycles. <em>Long</em> = 5+ year structural. <em>Event-driven</em> = this area moves on specific disclosures or rulings rather than a fixed schedule.
                      </div>
                    </div>
                  </section>
                )}
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function renderModifierContext(modifier) {
  if (!modifier) return null;
  if (typeof modifier === "string") return modifier;

  const label = MODIFIER_LABELS[modifier.name] || modifier.name || "Adjustment";
  const status = modifier.status ? `: ${modifier.status}` : "";
  const reason = modifier.reason ? ` (${modifier.reason})` : "";

  return `${label}${status}${reason}`;
}

function TriggerColumns({ up, down, renderTriggerItem, keyPrefix, upLabel, downLabel }) {
  return (
    <div className="dim-trigger-columns">
      <div>
        <strong>{upLabel}:</strong>
        <div className="dim-trigger-list">
          {up.map((trigger, i) => renderTriggerItem(trigger, `${keyPrefix}-up-${i}`))}
        </div>
      </div>
      <div>
        <strong>{downLabel}:</strong>
        <div className="dim-trigger-list">
          {down.map((trigger, i) => renderTriggerItem(trigger, `${keyPrefix}-down-${i}`))}
        </div>
      </div>
    </div>
  );
}

function SourceUseBadge({ label, moved = false }) {
  return (
    <span className={`dim-source-effect ${moved ? "dim-source-effect-moved" : "dim-source-effect-none"}`}>
      {label}
    </span>
  );
}

function sourceUsageLabels(source, gradeMovesBySource, usageBySource) {
  const canonical = canonicalUrl(source.url);
  const moves = canonical ? gradeMovesBySource.get(canonical) || [] : [];
  const labels = [];
  if (moves.length > 0) labels.push({ label: "grade move", moved: true, title: moves.map((move) => move.title).join(" / ") });
  if (canonical) {
    const usage = usageBySource.get(canonical);
    if (usage) {
      usage.forEach((label) => labels.push({ label, moved: false }));
    }
  }
  if (labels.length === 0) labels.push({ label: "citation", moved: false });
  return labels;
}

function SourceStackTable({ sources, gradeMovesBySource, usageBySource }) {
  return (
    <div className="dim-source-stack">
      <div className="dim-source-mobile-cards">
        {sources.map((source, i) => {
          const usageLabels = sourceUsageLabels(source, gradeMovesBySource, usageBySource);
          return (
            <article
              key={`${source.url}-card-${i}`}
              className="dim-source-mobile-card"
              data-source-needs-review={source.needsManualDate ? "true" : undefined}
            >
              <div className="dim-source-mobile-head">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="dim-source-table-link"
                >
                  {source.label}
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
              <div className="dim-source-usage-row">
                {usageLabels.map((usage) => (
                  <SourceUseBadge key={`${source.url}-${usage.label}`} label={usage.label} moved={usage.moved} />
                ))}
              </div>
              <div className="dim-source-date-cell">
                <span className="dim-source-date">{formatSourceDate(source)}</span>
                <span className={`dim-source-date-kind dim-source-date-kind-${sourceDateKindLabel(source)}`}>
                  {sourceDateKindLabel(source)}
                </span>
              </div>
            </article>
          );
        })}
      </div>
      <div className="dim-table-wrap">
        <table className="dim-source-table">
          <thead>
            <tr>
              <th>Source</th>
              <th>Used for</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((source, i) => {
              const usageLabels = sourceUsageLabels(source, gradeMovesBySource, usageBySource);

              return (
                <tr key={`${source.url}-${i}`} data-source-needs-review={source.needsManualDate ? "true" : undefined}>
                  <td>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="dim-source-table-link"
                    >
                      {source.label}
                      <span aria-hidden="true">↗</span>
                    </a>
                  </td>
                  <td>
                    <span className="dim-source-usage-row">
                      {usageLabels.map((usage) => (
                        <span key={`${source.url}-${usage.label}`} title={usage.title}>
                          <SourceUseBadge label={usage.label} moved={usage.moved} />
                        </span>
                      ))}
                    </span>
                  </td>
                  <td className="dim-source-date-cell">
                    <span className="dim-source-date">{formatSourceDate(source)}</span>
                    <span className={`dim-source-date-kind dim-source-date-kind-${sourceDateKindLabel(source)}`}>
                      {sourceDateKindLabel(source)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MetricsList({ metricGroups }) {
  return (
    <div className="dim-stack">
      {metricGroups.map((group, groupIndex) => (
        <div
          key={group.title || `group-${groupIndex}`}
          className="dim-stack"
        >
          {group.title && (
            <div className="dim-metric-group-title">
              {group.title}
            </div>
          )}
          {group.items.map((m, i) => (
            <div
              key={`${group.title || "metrics"}-${i}-${m.label}`}
              className="dim-metric-row"
            >
              <div className="dim-metric-value">
                {m.label}: {m.value}
              </div>
              {m.sourceRefs && m.sourceRefs.length > 0 && (
                <div className="dim-metric-source-list">
                  {m.sourceRefs.map((sourceRef) => (
                    <a
                      key={`${m.label}-${sourceRef.url}`}
                      href={sourceRef.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Source: {sourceRef.label}
                      <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function CombinationRule({ rule }) {
  return (
    <div className="dim-stack">
      <div>
        <div className="dim-nested-rule-title">The five flagship areas</div>
        <ul className="dim-plain-list">
          {rule.flagshipFiles.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </div>
      <div>
        <div className="dim-nested-rule-title">File status categories</div>
        <div className="dim-stack dim-narrow-stack">
          {rule.fileStatusCategories.map((cat, i) => (
            <div key={i}>
              <strong>{cat.status}:</strong> {cat.definition}
            </div>
          ))}
        </div>
      </div>
      <RuleTable
        title="Distribution to grade"
        columns={["Distribution", "Grade", "Logic"]}
        rows={rule.distributionToGrade.map((row) => [row.distribution, row.grade, row.logic])}
      />
      <RuleTable
        title="Current snapshot"
        columns={["File", "Status", "Evidence"]}
        rows={rule.currentSnapshot.map((row) => [row.file, row.status, row.evidence])}
      />
      <div className="dim-note-box">
        <strong>{rule.currentDistribution} → {rule.currentGradeFromRule}</strong>
      </div>
      {rule.moveRules && (
        <div className="dim-stack">
          <div className="dim-nested-rule-title">Movement rules</div>
          <p><strong>Upgrade:</strong> {rule.moveRules.upgrade}</p>
          <p><strong>Downgrade:</strong> {rule.moveRules.downgrade}</p>
          <p><strong>Multiple steps:</strong> {rule.moveRules.multiNotch}</p>
        </div>
      )}
    </div>
  );
}

function RuleTable({ title, columns, rows }) {
  return (
    <div>
      <div className="dim-nested-rule-title">{title}</div>
      <div className="dim-table-wrap">
        <table className="dim-rule-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, cellIndex) => (
                  <td key={`${i}-${cellIndex}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProjectCohortSection({ cohort, dimId }) {
  const stageGates = cohort.stageGates || [];
  const stageOrder = stageGates.reduce((acc, gate, i) => {
    acc[gate.key] = i;
    return acc;
  }, {});
  const stageLabels = stageGates.reduce((acc, gate) => {
    acc[gate.key] = gate.label;
    return acc;
  }, {});

  const stageColors = {
    designated: { bg: "#eceff1", color: "#37474f", border: "#cfd8dc" },
    reviewed: { bg: "#e8eaf6", color: "#283593", border: "#c5cae9" },
    approved: { bg: "#e3f2fd", color: "#0d47a1", border: "#bbdefb" },
    permitted: { bg: "#fff3e0", color: "#e65100", border: "#ffe0b2" },
    under_construction: { bg: "#e8f5e9", color: "#1b5e20", border: "#c8e6c9" },
    completed: { bg: "#dcedc8", color: "#33691e", border: "#aed581" },
  };

  const total = cohort.projects.length;
  const designatedIndex = stageOrder.designated ?? 0;
  const aboveDesignated = cohort.projects.filter(
    (p) => (stageOrder[p.stage] ?? 0) > designatedIndex
  );
  const documentedAdvanced = aboveDesignated.filter(
    (p) => p.referredDate && p.stageDate && p.stageDate > p.referredDate
  );
  const aboveDesignatedCount = aboveDesignated.length;
  const documentedAdvancedCount = documentedAdvanced.length;
  const documentedAdvancedPct =
    total > 0 ? Math.round((documentedAdvancedCount / total) * 100) : 0;

  const stageCounts = stageGates
    .map((gate) => ({
      key: gate.key,
      label: gate.label,
      count: cohort.projects.filter((p) => p.stage === gate.key).length,
    }))
    .filter((s) => s.count > 0);

  const sortedProjects = cohort.projects
    .slice()
    .sort((a, b) => {
      const sa = stageOrder[a.stage] ?? 0;
      const sb = stageOrder[b.stage] ?? 0;
      if (sa !== sb) return sb - sa;
      return a.name.localeCompare(b.name);
    });

  const stagePill = (stage) => {
    const c = stageColors[stage] || stageColors.designated;
    return (
      <span
        style={{
          display: "inline-block",
          padding: "2px 8px",
          borderRadius: "999px",
          background: c.bg,
          color: c.color,
          border: `1px solid ${c.border}`,
          fontSize: "12px",
          fontWeight: 700,
          whiteSpace: "nowrap",
        }}
      >
        {stageLabels[stage] || stage}
      </span>
    );
  };

  return (
    <div className="dim-stack">
      <div className="dim-cohort-summary">
        <div className="dim-cohort-asof">As of {cohort.asOf}</div>
        <div>
          <strong>{total} projects in the MPO project list.</strong>{" "}
          {aboveDesignatedCount} currently sit above designated status.{" "}
          {documentedAdvancedCount} of {total} ({documentedAdvancedPct}%) have
          documented progress after being added.
        </div>
        <div className="dim-stage-counts">
          {stageCounts.map((s) => (
            <span key={s.key} className="dim-stage-count">
              {stagePill(s.key)}
              <span>×{s.count}</span>
            </span>
          ))}
        </div>
      </div>
      <section
        id={`dim-${dimId}-cohort-list`}
        className="dim-stack"
        tabIndex={-1}
      >
        <h4>Full project list ({total})</h4>
        <div
          id={`dim-${dimId}-cohort-table`}
          className="cohort-mobile-projects"
          tabIndex={-1}
          aria-label="Full Major Projects cohort list"
        >
          {sortedProjects.map((p, i) => (
            <article
              key={`${p.name}-card-${i}`}
              className="cohort-mobile-project-card"
            >
              <div className="cohort-mobile-project-head">
                <div>
                  <strong>{p.name}</strong>
                  {p.location && <span>{p.location}</span>}
                </div>
                {stagePill(p.stage)}
              </div>
              <dl className="cohort-mobile-project-facts">
                <div>
                  <dt>Tranche</dt>
                  <dd>{p.tranche}</dd>
                </div>
                <div>
                  <dt>Stage date</dt>
                  <dd>{p.stageDate}</dd>
                </div>
                {p.sourceUrl && (
                  <div>
                    <dt>Source</dt>
                    <dd>
                      <a
                        href={p.sourceUrl}
                        aria-label={p.sourceLabel || "Project source"}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {p.sourceLabel || "Project source"}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

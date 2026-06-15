import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { GRADES } from "../constants";
import GradeChip from "./GradeChip";
import TrendArrow from "./TrendArrow";
import meta from "../data/meta.json";
import changelog from "../data/changelog.json";

// MED1: Heuristic tier classification from source URL domain.
// Tier 1 = official government / international body / central bank / auditor.
// Tier 2 = think tank / professional association / academic / credible media.
// Tier 3 = other.
const TIER1_DOMAINS = [
  "canada.ca", "gc.ca", "parl.ca", "ourcommons.ca",
  "pm.gc.ca", "budget.canada.ca", "pbo-dpb.ca",
  "statcan.gc.ca", "cmhc-schl.gc.ca", "oag-bvg.gc.ca",
  "bankofcanada.ca",
  "nato.int", "imf.org", "oecd.org", "worldbank.org", "un.org",
  "dal.ca", "utoronto.ca", "mcgill.ca", "ubc.ca", "uwaterloo.ca",
  "queensu.ca", "uottawa.ca", "yorku.ca", "sfu.ca",
  "fitchratings.com",
];

const TIER2_DOMAINS = [
  "globeandmail.com", "theglobeandmail.com", "cbc.ca", "ctvnews.ca",
  "nationalpost.com", "thestar.com", "financialpost.com",
  "nationalobserver.com", "thenarwhal.ca",
  "policyoptions.irpp.org", "fraserinstitute.org", "cdhowe.org",
  "broadbentinstitute.ca", "mli.ca", "macdonaldlaurier.ca",
  "climateinstitute.ca", "iisd.org", "csls.ca",
  "thehub.ca", "signal49.ca", "canada2020.ca", "canadacode.org",
  "theconversation.com",
  "proof.utoronto.ca",
  "chba.ca", "buildingvalue.ca", "cfib-fcei.ca", "retailcouncil.org",
  "maytree.com", "foodbankscanada.ca", "transparencycanada.ca",
  "democracywatch.ca",
  "angusreid.org",
  "scotiabank.com",
  "liberal.ca",
  "conferenceboard.ca",
];

const TIER_LABEL = { 1: "T1", 2: "T2", 3: "T3" };
const TIER_DEFINITIONS = {
  1: "T1: primary records, official data, officers of Parliament, or intergovernmental bodies.",
  2: "T2: independent analysis, research bodies, policy institutes, professional associations, or established media.",
  3: "T3: context, advocacy, commentary, or sources used mainly as challenge evidence.",
};
const TIER_STYLE = {
  1: { background: "#e3f2fd", color: "#0d47a1", border: "1px solid #90caf9" },
  2: { background: "#f3e5f5", color: "#4a148c", border: "1px solid #ce93d8" },
  3: { background: "#fafafa", color: "#555", border: "1px solid #ccc" },
};

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

const TOP_LEVEL_SECTIONS = [
  "skeptic",
  "context",
  "rule",
  "why",
  "timeline",
  "subScores",
  "triggers",
  "metrics",
  "sources",
  "projects",
  "promises",
  "trackerTriggers",
  "perspectives",
  "scope",
  "inherited",
];

const NESTED_SECTIONS = [
  "glossary",
  "leverOperationalization",
  "componentOperationalization",
  "combinationRule",
  "cohortList",
];

function getSourceTier(url) {
  if (!url) return null;
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (TIER1_DOMAINS.some((d) => host === d || host.endsWith(`.${d}`))) return 1;
    if (TIER2_DOMAINS.some((d) => host === d || host.endsWith(`.${d}`))) return 2;
    return 3;
  } catch {
    return null;
  }
}

function SourceTierBadge({ url }) {
  const tier = getSourceTier(url);
  if (!tier) return null;
  const style = TIER_STYLE[tier] || TIER_STYLE[3];
  const description = TIER_DEFINITIONS[tier] || TIER_DEFINITIONS[3];
  return (
    <span
      title={description}
      aria-label={description}
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: "10px",
        fontWeight: 800,
        padding: "1px 5px",
        borderRadius: "4px",
        marginLeft: "5px",
        verticalAlign: "middle",
        lineHeight: 1.4,
        ...style,
      }}
    >
      {TIER_LABEL[tier]}
    </span>
  );
}

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

function sectionKeysForTarget(target, dimId) {
  if (!target) return [];
  if (target === `dim-${dimId}-scoring`) return ["rule"];
  if (target === `dim-${dimId}-triggers-section`) return ["triggers"];
  if (target === `dim-${dimId}-metrics`) return ["metrics"];
  if (target === `dim-${dimId}-sources`) return ["sources"];
  if (target === `dim-${dimId}-perspectives-section`) return ["perspectives"];
  if (target === `dim-${dimId}-context`) return ["context"];
  if (target === `dim-${dimId}-scope`) return ["scope"];
  if (target === `dim-${dimId}-inherited`) return ["inherited"];
  if (target === `dim-${dimId}-skeptic-path`) return ["skeptic"];
  if (target === `dim-${dimId}-why`) return ["why"];
  if (target === `dim-${dimId}-timeline`) return ["timeline"];
  if (target === `dim-${dimId}-subscores`) return ["subScores"];
  if (target === `dim-${dimId}-promises`) return ["promises"];
  if (target === `dim-${dimId}-tracker-triggers`) return ["trackerTriggers"];
  if (
    target === `dim-${dimId}-cohort`
    || target === `dim-${dimId}-cohort-list`
    || target === `dim-${dimId}-cohort-table`
  ) {
    return ["projects", "cohortList"];
  }
  return [];
}

function targetBelongsToDimension(target, dimId) {
  return target === `dim-${dimId}` || target.startsWith(`dim-${dimId}-`);
}

function focusDisclosureButtonForTarget(target) {
  if (!target) return;
  const button = document.getElementById(`${target}-button`);
  if (button && typeof button.focus === "function") {
    button.focus({ preventScroll: true });
  }
}

function getTierCounts(sources = []) {
  return {
    t1: sources.filter((s) => getSourceTier(s.url) === 1).length,
    t2: sources.filter((s) => getSourceTier(s.url) === 2).length,
    t3: sources.filter((s) => getSourceTier(s.url) === 3).length,
  };
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

function buildGradeMovesBySource(dimId) {
  const moves = new Map();
  const timelineRows = [];

  changelog.forEach((entry) => {
    (entry.items || []).forEach((item) => {
      if (item?.type !== "grade" || item.dimensionId !== dimId) return;
      const label = `${item.from} → ${item.to}`;
      const href = item.link?.href || null;
      const source = {
        label: item.link?.label || (isMethodologyUrl(href) ? "Methodology note" : "Grade-change source"),
        url: href,
      };
      const row = {
        date: entry.date,
        source,
        what: item.headline || item.body || `Grade moved ${label}`,
        effect: isMethodologyUrl(href) ? "Methodology / rubric re-score" : `Moved ${label}`,
        gradeMoveLabel: label,
      };
      timelineRows.push(row);

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

  return { moves, timelineRows };
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

function useDisclosureVisibility(isOpen, instantOpen = false) {
  const [visible, setVisible] = useState(isOpen);
  const [animatedOpen, setAnimatedOpen] = useState(isOpen);

  useLayoutEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    if (instantOpen && isOpen) {
      let cancelled = false;
      const schedule = typeof queueMicrotask === "function"
        ? queueMicrotask
        : (callback) => Promise.resolve().then(callback);

      schedule(() => {
        if (cancelled) return;
        setVisible(true);
        setAnimatedOpen(true);
      });

      return () => {
        cancelled = true;
      };
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frameA = null;
    let frameB = null;

    frameA = window.requestAnimationFrame(() => {
      if (reduce) {
        setVisible(isOpen);
        setAnimatedOpen(isOpen);
        return;
      }

      if (isOpen) {
        setVisible(true);
        setAnimatedOpen(false);
        frameB = window.requestAnimationFrame(() => setAnimatedOpen(true));
        return;
      }

      setAnimatedOpen(false);
    });

    return () => {
      if (frameA) window.cancelAnimationFrame(frameA);
      if (frameB) window.cancelAnimationFrame(frameB);
    };
  }, [instantOpen, isOpen]);

  const handleTransitionEnd = (event) => {
    if (event.target !== event.currentTarget) return;
    if (!isOpen) {
      setVisible(false);
    }
  };

  const instantActive = isOpen && instantOpen;

  return {
    visible: instantActive || visible,
    animatedOpen: instantActive || animatedOpen,
    instantActive,
    handleTransitionEnd,
  };
}

function DisclosurePanel({
  id,
  labelledBy,
  isOpen,
  children,
  region = false,
  active = false,
  instantOpen = false,
}) {
  const {
    visible,
    animatedOpen,
    instantActive,
    handleTransitionEnd,
  } = useDisclosureVisibility(isOpen, instantOpen);
  const role = region || active ? "region" : undefined;

  return (
    <div
      id={id}
      className="dim-disclosure-panel"
      data-open={animatedOpen ? "true" : "false"}
      hidden={!visible}
      aria-hidden={!isOpen}
      aria-labelledby={labelledBy}
      role={role}
      style={instantActive ? { transition: "none" } : undefined}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="dim-disclosure-panel-inner">
        {children}
      </div>
    </div>
  );
}

function DisclosureSection({
  id,
  title,
  isOpen,
  onToggle,
  children,
  summary,
  variant = "neutral",
  region = false,
  active = false,
  anchor = true,
  instantOpen = false,
}) {
  const buttonId = `${id}-button`;
  const panelId = `${id}-panel`;

  return (
    <section
      id={anchor ? id : undefined}
      className={`dim-disclosure-section dim-disclosure-${variant}`}
      data-dim-anchor={anchor ? "true" : undefined}
    >
      <h3 className="dim-section-heading">
        <button
          type="button"
          id={buttonId}
          className="dim-section-button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          <span aria-hidden="true" className="dim-section-caret">
            {isOpen ? "\u25BE" : "\u25B8"}
          </span>
          <span>{title}</span>
          {summary && <span className="dim-section-summary">{summary}</span>}
        </button>
      </h3>
      <DisclosurePanel
        id={panelId}
        labelledBy={buttonId}
        isOpen={isOpen}
        region={region}
        active={active}
        instantOpen={instantOpen}
      >
        {children}
      </DisclosurePanel>
    </section>
  );
}

function SourceTierSummary({ counts }) {
  return (
    <span className="dim-source-tier-summary">
      {counts.t1 > 0 && (
        <span className="dim-tier-chip dim-tier-chip-1" title={TIER_DEFINITIONS[1]}>
          {counts.t1} Tier-1
        </span>
      )}
      {counts.t2 > 0 && (
        <span className="dim-tier-chip dim-tier-chip-2" title={TIER_DEFINITIONS[2]}>
          {counts.t2} Tier-2
        </span>
      )}
      {counts.t3 > 0 && (
        <span className="dim-tier-chip dim-tier-chip-3" title={TIER_DEFINITIONS[3]}>
          {counts.t3} context
        </span>
      )}
    </span>
  );
}

function normalizeDateForSort(date) {
  if (!date) return "0000-00-00";
  const match = String(date).match(/\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : String(date);
}

function sourceFromMetric(metric) {
  const sourceRef = metric?.sourceRefs?.[0];
  if (sourceRef) {
    return {
      label: sourceRef.label,
      url: sourceRef.url,
    };
  }
  if (metric?.source && metric.source !== "manual" && metric.source !== "editorial") {
    return {
      label: metric.source,
      url: null,
    };
  }
  return {
    label: metric?.source === "editorial" ? "Editorial tally" : "Dashboard metric",
    url: null,
  };
}

function sourceFromTrigger(trigger) {
  const item = normalizeTrigger(trigger);
  if (!item) return null;
  return {
    label: item.sourceLabel || "Trigger condition",
    url: item.sourceUrl || null,
  };
}

function latestPromiseDate(promise, fallback) {
  if (promise?.since) return promise.since;
  if (Array.isArray(promise?.history) && promise.history.length > 0) {
    return promise.history
      .map((event) => event.date)
      .filter(Boolean)
      .sort()
      .at(-1);
  }
  return fallback;
}

function buildEvidenceTimeline(dim, metrics, isTracker, gradeMoveRows = []) {
  const rows = [...gradeMoveRows];
  const reviewedDate = dim.lastUpdated || meta.lastUpdated;

  if (!isTracker && dim.grade) {
    rows.push({
      date: reviewedDate,
      source: { label: "Current grade read", url: null },
      what: `${dim.grade} grade: ${dim.gradeBasis?.bandCriterion || dim.status}`,
      effect: "Current grade",
    });
  }

  metrics.forEach((metric) => {
    rows.push({
      date: metric.asOf || reviewedDate,
      source: sourceFromMetric(metric),
      what: `${metric.label}: ${metric.value}`,
      effect: metric.automatable === false ? "Context / editorial metric" : "Metric evidence",
    });
  });

  ["up", "down"].forEach((direction) => {
    const triggers = dim.gradeTriggers?.[direction] || [];
    triggers.forEach((trigger) => {
      const item = normalizeTrigger(trigger);
      if (!item) return;
      rows.push({
        date: item.setDate || reviewedDate,
        source: sourceFromTrigger(item),
        what: item.text,
        effect: direction === "up" ? "Up-trigger watch" : "Down-trigger watch",
      });
    });
  });

  (dim.promises || []).forEach((promise) => {
    rows.push({
      date: latestPromiseDate(promise, reviewedDate),
      source: {
        label: promise.statusSourceLabel || promise.originalSourceLabel || "Promise evidence",
        url: promise.statusSourceUrl || promise.originalSourceUrl || null,
      },
      what: `${promise.text}: ${promise.status}${promise.evidence ? ` - ${promise.evidence}` : ""}`,
      effect: "Promise tracker evidence",
    });
  });

  return rows
    .filter((row) => row.what)
    .sort((a, b) => normalizeDateForSort(b.date).localeCompare(normalizeDateForSort(a.date)));
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
}) {
  const isTracker = !!dim.excludeFromGPA;
  const g = isTracker ? null : GRADES[dim.grade];
  const modifierItems = isTracker ? [] : (dim.gradeBasis?.activeModifiers || []);
  const metrics = dim.metrics || [];
  const sources = dim.sources || [];
  const scoring = dim.scoring || null;
  const showTriggers = !!(dim.gradeTriggers || dim.nextTrigger);
  const cohort = dim.projectCohort || null;
  const sourceCounts = useMemo(() => getTierCounts(sources), [sources]);
  const sortedSources = useMemo(() => sortSourcesByDate(sources), [sources]);
  const sourceGradeMoves = useMemo(() => buildGradeMovesBySource(dim.id), [dim.id]);
  const activeThresholdRow = useMemo(
    () => (isTracker ? null : findActiveThresholdRow(scoring?.thresholds, dim.grade)),
    [dim.grade, isTracker, scoring?.thresholds]
  );

  const [openSections, setOpenSections] = useState({});
  const [instantOpenSections, setInstantOpenSections] = useState({});
  const [scrollIntent, setScrollIntent] = useState(null);
  const [activeAnchorTarget, setActiveAnchorTarget] = useState(null);
  const [activeNavAnchor, setActiveNavAnchor] = useState(null);
  const [stickyStackHeight, setStickyStackHeight] = useState(80);
  const [stickyHeadHeight, setStickyHeadHeight] = useState(52);
  const [isMobileDialog, setIsMobileDialog] = useState(() => (
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
  ));
  const isFocusedDesktop = focusedDesktop && !isMobileDialog;
  const openSectionsRef = useRef({});
  const pendingInstantClearRef = useRef(null);
  const localScrollRequestIdRef = useRef(0);
  const headerButtonRef = useRef(null);
  const rootRef = useRef(null);
  const drawerRef = useRef(null);
  const stickyHeadRef = useRef(null);
  const miniNavRef = useRef(null);
  const previousFocusRef = useRef(null);
  const wasExpandedRef = useRef(false);
  const anchorTargetRef = useRef(anchorNavigation?.target || null);

  useEffect(() => {
    openSectionsRef.current = openSections;
  }, [openSections]);

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
  const evidenceTimelineRows = useMemo(
    () => buildEvidenceTimeline(dim, metrics, isTracker, sourceGradeMoves.timelineRows),
    [dim, isTracker, metrics, sourceGradeMoves.timelineRows]
  );

  const scoringMetadata = [];
  if (dim.tags?.confidence) scoringMetadata.push({ label: "Confidence", value: dim.tags.confidence });
  if (dim.tags?.attribution) scoringMetadata.push({ label: "Attribution", value: dim.tags.attribution });
  if (dim.tags?.lag) scoringMetadata.push({ label: "Lag", value: dim.tags.lag });

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
      text: `Evidence moves on a ${dim.tags.lag.toLowerCase()} timeline.`,
    });
  }
  if (modifierItems.length > 0) {
    keyContextItems.push({
      label: "Active adjustments",
      text: modifierItems.map(renderModifierContext).filter(Boolean).join(" / "),
    });
  }
  if (dim.inherited) {
    keyContextItems.push({ label: "Inherited context", text: dim.inherited });
  }

  const hasRuleSection = !isTracker && (dim.construct || scoring || scoringMetadata.length > 0);
  const hasWhySection = !isTracker && !!(dim.gradeBasis || dim.rationale || dim.judgmentDetail || modifierItems.length > 0);
  const hasEvidenceTimeline = evidenceTimelineRows.length > 0;
  const hasSubScores = !isTracker && !!dim.subScores;
  const hasProjects = !!(cohort && cohort.projects && cohort.projects.length > 0);
  const hasPromises = !!(dim.promises && dim.promises.length > 0);
  const hasTrackerTriggers = isTracker && !!dim.gradeTriggers;

  const availableSections = useMemo(() => {
    const sections = [];
    if (!isTracker) sections.push("skeptic");
    if (keyContextItems.length > 0) sections.push("context");
    if (hasRuleSection) sections.push("rule");
    if (hasWhySection) sections.push("why");
    if (hasEvidenceTimeline) sections.push("timeline");
    if (hasSubScores) sections.push("subScores");
    if (showTriggers && !hasTrackerTriggers) sections.push("triggers");
    if (metrics.length > 0) sections.push("metrics");
    if (sources.length > 0) sections.push("sources");
    if (hasProjects) sections.push("projects");
    if (hasPromises) sections.push("promises");
    if (hasTrackerTriggers) sections.push("trackerTriggers");
    if (dim.perspectives) sections.push("perspectives");
    if (dim.scope) sections.push("scope");
    if (dim.inherited) sections.push("inherited");
    if (scoringMetadata.length > 0) sections.push("glossary");
    if (dim.gradeBasis?.leverOperationalization) sections.push("leverOperationalization");
    if (dim.gradeBasis?.componentOperationalization) sections.push("componentOperationalization");
    if (dim.gradeBasis?.combinationRule) sections.push("combinationRule");
    if (hasProjects) sections.push("cohortList");
    return sections;
  }, [
    dim.gradeBasis?.combinationRule,
    dim.gradeBasis?.componentOperationalization,
    dim.gradeBasis?.leverOperationalization,
    dim.inherited,
    dim.perspectives,
    dim.scope,
    hasProjects,
    hasPromises,
    hasEvidenceTimeline,
    hasRuleSection,
    hasSubScores,
    hasTrackerTriggers,
    hasWhySection,
    isTracker,
    keyContextItems.length,
    metrics.length,
    scoringMetadata.length,
    showTriggers,
    sources.length,
  ]);

  const jumpItems = useMemo(() => {
    if (isTracker) {
      return [
        metrics.length > 0 && { label: "Metrics", anchor: `dim-${dim.id}-metrics`, keys: ["metrics"] },
        hasEvidenceTimeline && { label: "Timeline", anchor: `dim-${dim.id}-timeline`, keys: ["timeline"] },
        sources.length > 0 && { label: "Sources", anchor: `dim-${dim.id}-sources`, keys: ["sources"] },
        hasPromises && { label: "Promises", anchor: `dim-${dim.id}-promises`, keys: ["promises"] },
        hasTrackerTriggers && { label: "Moves", anchor: `dim-${dim.id}-tracker-triggers`, keys: ["trackerTriggers"] },
      ].filter(Boolean);
    }

    return [
      hasRuleSection && { label: "Rule", anchor: `dim-${dim.id}-scoring`, keys: ["rule"] },
      showTriggers && { label: "Triggers", anchor: `dim-${dim.id}-triggers-section`, keys: ["triggers"] },
      hasEvidenceTimeline && { label: "Timeline", anchor: `dim-${dim.id}-timeline`, keys: ["timeline"] },
      metrics.length > 0 && { label: "Evidence", anchor: `dim-${dim.id}-metrics`, keys: ["metrics"] },
      sources.length > 0 && { label: "Sources", anchor: `dim-${dim.id}-sources`, keys: ["sources"] },
      hasProjects && { label: "Projects", anchor: `dim-${dim.id}-cohort`, keys: ["projects", "cohortList"] },
      dim.perspectives && { label: "Views", anchor: `dim-${dim.id}-perspectives-section`, keys: ["perspectives"] },
    ].filter(Boolean);
  }, [
    dim.id,
    dim.perspectives,
    hasProjects,
    hasPromises,
    hasEvidenceTimeline,
    hasRuleSection,
    hasTrackerTriggers,
    isTracker,
    metrics.length,
    showTriggers,
    sources.length,
  ]);

  const sectionNavItems = useMemo(() => ([
    { label: "Summary", anchor: `dim-${dim.id}-summary`, keys: [], desktopOnly: true },
    ...jumpItems,
  ]), [dim.id, jumpItems]);

  const toggleSection = (section) => {
    setOpenSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  };

  const openSectionKeys = useCallback((sections) => {
    setOpenSections((current) => {
      const next = { ...current };
      sections.forEach((section) => {
        next[section] = true;
      });
      return next;
    });
  }, []);

  const markInstantOpenSections = useCallback((sections, requestId) => {
    if (sections.length === 0) return;
    setInstantOpenSections((current) => {
      const next = { ...current };
      sections.forEach((section) => {
        next[section] = requestId;
      });
      return next;
    });
  }, []);

  const openAllSections = () => {
    const next = {};
    availableSections.forEach((section) => {
      if (TOP_LEVEL_SECTIONS.includes(section) || NESTED_SECTIONS.includes(section)) {
        next[section] = true;
      }
    });
    setOpenSections(next);
  };

  const queueAnchorScroll = useCallback((target, sections = sectionKeysForTarget(target, dim.id)) => {
    if (!target) return;
    const keys = sections.length > 0 ? sections : sectionKeysForTarget(target, dim.id);
    const currentOpenSections = openSectionsRef.current;
    const instantSections = keys.filter((section) => !currentOpenSections[section]);
    const requestId = anchorNavigation?.target === target
      ? anchorNavigation.requestId
      : (localScrollRequestIdRef.current += 1);
    markInstantOpenSections(instantSections, requestId);
    if (keys.length > 0) openSectionKeys(keys);
    setActiveAnchorTarget(target);
    setActiveNavAnchor(target);
    setScrollIntent({
      target,
      sections: keys,
      instantSections,
      requestId,
    });
  }, [
    anchorNavigation?.requestId,
    anchorNavigation?.target,
    dim.id,
    markInstantOpenSections,
    openSectionKeys,
  ]);

  const handleHashLinkClick = (e, target, sections) => {
    e.preventDefault();
    e.stopPropagation();
    if (targetBelongsToDimension(target, dim.id)) {
      if (typeof window !== "undefined") {
        window.history.replaceState(window.history.state, "", `#${target}`);
      }
      queueAnchorScroll(target, sections);
      return;
    }
    if (onHashTarget) {
      onHashTarget(target);
      return;
    }
    if (typeof window !== "undefined") {
      window.history.replaceState(window.history.state, "", `#${target}`);
    }
    queueAnchorScroll(target, sections);
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
        queueAnchorScroll(`dim-${dim.id}-cohort`, ["projects", "cohortList"]);
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
              <SourceTierBadge url={item.sourceUrl} />
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
          <details style={{ marginTop: "4px", fontSize: "12px", color: "#374151" }}>
            <summary style={{ cursor: "pointer", fontWeight: 600, color: "#1565c0" }}>
              + {trigger.additionalSources.length} independent challenge source{trigger.additionalSources.length === 1 ? "" : "s"} on this trigger
            </summary>
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
                      <SourceTierBadge url={alt.url} />
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
          </details>
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
    if (!isMobileDialog) return undefined;

    previousFocusRef.current = document.activeElement;
    const anchorTarget = anchorTargetRef.current;
    const hasPendingSectionTarget = anchorTarget
      && targetBelongsToDimension(anchorTarget, dim.id)
      && sectionKeysForTarget(anchorTarget, dim.id).length > 0;
    let frame = null;

    if (!hasPendingSectionTarget) {
      frame = window.requestAnimationFrame(() => {
        drawerRef.current?.focus({ preventScroll: true });
      });
    }

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onClick?.(event);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleKeyDown);
      const previousFocus = previousFocusRef.current;
      if (previousFocus && typeof previousFocus.focus === "function") {
        previousFocus.focus({ preventScroll: true });
      } else {
        headerButtonRef.current?.focus({ preventScroll: true });
      }
    };
  }, [dim.id, isExpanded, isMobileDialog, onClick]);

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
  }, [isExpanded, jumpItems.length]);

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
    queueAnchorScroll(target);
  }, [anchorNavigation, dim.id, isExpanded, queueAnchorScroll]);

  useLayoutEffect(() => {
    const targetId = scrollIntent?.target;
    if (!isExpanded || !targetId) return undefined;
    if (typeof window === "undefined") return undefined;

    const sections = scrollIntent.sections?.length
      ? scrollIntent.sections
      : sectionKeysForTarget(targetId, dim.id);
    const sectionsOpen = sections.every((section) => openSections[section]);
    if (!sectionsOpen) return undefined;

    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: "auto",
        block: "start",
        inline: "nearest",
      });
      focusDisclosureButtonForTarget(targetId);
    }

    if (scrollIntent.instantSections?.length > 0) {
      pendingInstantClearRef.current = {
        requestId: scrollIntent.requestId,
        sections: scrollIntent.instantSections,
      };
    }
    setScrollIntent(null);
    return undefined;
  }, [dim.id, isExpanded, openSections, scrollIntent]);

  useEffect(() => {
    if (scrollIntent) return;
    const pending = pendingInstantClearRef.current;
    if (!pending) return;

    pendingInstantClearRef.current = null;
    setInstantOpenSections((current) => {
      let changed = false;
      const next = { ...current };
      pending.sections.forEach((section) => {
        if (next[section] === pending.requestId) {
          delete next[section];
          changed = true;
        }
      });
      return changed ? next : current;
    });
  }, [scrollIntent]);

  useEffect(() => {
    if (!isExpanded || !drawerRef.current || jumpItems.length === 0) return undefined;
    if (typeof IntersectionObserver === "undefined") return undefined;

    const media = window.matchMedia("(max-width: 767px)");
    const root = media.matches ? drawerRef.current : null;
    const anchors = sectionNavItems
      .filter((item) => !(media.matches && item.desktopOnly))
      .map((item) => document.getElementById(item.anchor))
      .filter(Boolean);
    const updateActiveAnchor = () => {
      const anchorTop = stickyStackHeight + 8;
      const hashTarget = window.location.hash.replace(/^#/, "");
      const hashAnchor = anchors.find((anchor) => anchor.id === hashTarget);

      if (hashAnchor) {
        const hashRect = hashAnchor.getBoundingClientRect();
        if (hashRect.bottom > anchorTop && hashRect.top < anchorTop + 160) {
          setActiveNavAnchor(hashAnchor.id);
          return;
        }
      }

      const visible = anchors
        .map((anchor) => {
          const rect = anchor.getBoundingClientRect();
          return {
            id: anchor.id,
            top: rect.top,
            bottom: rect.bottom,
          };
        })
        .filter((anchor) => anchor.bottom > anchorTop)
        .sort((a, b) => (
          Math.abs(a.top - anchorTop) - Math.abs(b.top - anchorTop)
        ))[0];

      if (visible?.id) setActiveNavAnchor(visible.id);
    };

    const observer = new IntersectionObserver(
      updateActiveAnchor,
      {
        root,
        rootMargin: `-${stickyStackHeight + 8}px 0px -60% 0px`,
        threshold: [0.05, 0.25, 0.5],
      }
    );

    anchors.forEach((anchor) => observer.observe(anchor));
    updateActiveAnchor();
    return () => observer.disconnect();
  }, [isExpanded, jumpItems.length, sectionNavItems, stickyStackHeight]);

  useEffect(() => {
    if (isExpanded) return;
    setActiveAnchorTarget(null);
    setActiveNavAnchor(null);
    setScrollIntent(null);
  }, [isExpanded]);

  if (!isTracker && !g) return null;

  const borderColor = isExpanded
    ? (isTracker ? "#bfa86b" : g.color)
    : (isTracker ? "#d9d4b8" : "#e0e0e0");
  const raisedShadow = isTracker ? "0 2px 12px #bfa86b22" : `0 2px 12px ${g.color}22`;
  const rootBackground = isFocusedDesktop ? "transparent" : (isTracker ? "#fcfcf7" : "#fff");
  const rootBorder = isFocusedDesktop ? "0" : `1px solid ${borderColor}`;
  const rootPadding = isFocusedDesktop ? 0 : "16px";
  const rootRadius = isFocusedDesktop ? 0 : "8px";
  const rootShadow = isFocusedDesktop
    ? "none"
    : (isExpanded ? raisedShadow : "0 1px 3px rgba(0,0,0,0.06)");
  const subScoreSummary = hasSubScores
    ? Object.values(dim.subScores).map((sub) => `${sub.label}: ${sub.grade}`).join(" / ")
    : null;
  const sourceSummary = `${sources.length} source${sources.length === 1 ? "" : "s"} · ${sourceCounts.t1} Tier-1 → open`;
  const metricsSummary = `${metrics.length} metric${metrics.length === 1 ? "" : "s"} tracked → open`;
  const activeSectionKeys = sectionKeysForTarget(activeAnchorTarget, dim.id);
  const isInstantOpenSection = (section) => !!instantOpenSections[section];

  return (
    <div
      id={`dim-${dim.id}`}
      ref={rootRef}
      className={`dimension-card-root${isFocusedDesktop ? " dim-focused-detail-root" : ""}`}
      style={{
        background: rootBackground,
        border: rootBorder,
        borderRadius: rootRadius,
        padding: rootPadding,
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxShadow: rootShadow,
        gridColumn: isExpanded ? "1 / -1" : "auto",
      }}
    >
      {!isFocusedDesktop && (
        <button
          ref={headerButtonRef}
          type="button"
          className="dim-card-header-button"
          onClick={onClick}
          aria-expanded={isExpanded}
          aria-controls={`dim-${dim.id}-drawer`}
          aria-labelledby={`dim-${dim.id}-title`}
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
              <div style={{ fontSize: "15px", color: "#333", lineHeight: 1.5 }}>
                {dim.status}
              </div>
              {dim.lastUpdated && (
                <div className="last-reviewed-pill dim-last-reviewed-pill">
                  <span style={{ textTransform: "uppercase", letterSpacing: "0.35px" }}>
                    Reviewed
                  </span>
                  {dim.lastUpdated}
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
                    {dim.informationalGrade} informational
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

      {isExpanded && (
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
            >
              {dim.name}
            </span>
            {!isTracker && (
              <GradeChip grade={dim.grade} />
            )}
            {isTracker && (
              <span className="dim-drawer-info-grade">
                {dim.informationalGrade} informational
              </span>
            )}
            <button
              type="button"
              className="dim-drawer-close"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.(e);
              }}
              aria-label="Close details"
            >
              × Close
            </button>
          </div>

          {jumpItems.length > 0 && (
            <nav
              ref={miniNavRef}
              className="dim-mini-nav"
              aria-label={`${dim.name} section navigation`}
            >
              <span className="dim-mini-nav-label dim-mini-nav-label-mobile">Jump:</span>
              <span className="dim-mini-nav-label dim-mini-nav-label-desktop">Sections:</span>
              {sectionNavItems.map((item) => {
                const isActive = activeNavAnchor === item.anchor
                  || (!activeNavAnchor && item.anchor === `dim-${dim.id}-summary`)
                  || (activeNavAnchor === `dim-${dim.id}` && item.anchor === `dim-${dim.id}-summary`);

                return (
                  <a
                    key={item.anchor}
                    href={`#${item.anchor}`}
                    className={item.desktopOnly ? "dim-desktop-only-nav-item" : undefined}
                    aria-current={isActive ? "true" : undefined}
                    onClick={(e) => handleHashLinkClick(e, item.anchor, item.keys)}
                  >
                    {item.label}
                  </a>
                );
              })}
              <button
                type="button"
                className="text-link-button dim-show-all-button"
                onClick={(e) => {
                  e.stopPropagation();
                  openAllSections();
                }}
              >
                Show all sections
              </button>
            </nav>
          )}

          <div
            id={`dim-${dim.id}-summary`}
            className="dim-default-blocks"
            aria-label={`${dim.name} score summary`}
          >
            <section className="dim-score-block dim-default-block">
              <div className="dim-default-block-head">
                <span>Score</span>
                {isTracker ? (
                  <span className="dim-info-grade-pill">
                    {dim.informationalGrade} informational
                  </span>
                ) : (
                  <GradeChip grade={dim.grade} />
                )}
              </div>
              {isTracker ? (
                <div className="dim-score-body">
                  {trackerStat && (
                    <div className="dim-tracker-score-line">
                      <strong>{trackerStat.delivered} of {trackerStat.total}</strong> promises delivered.
                    </div>
                  )}
                  {dim.whatThisGrades && <p>{dim.whatThisGrades}</p>}
                  <p>{dim.status}</p>
                  {dim.rationale && <p>{dim.rationale}</p>}
                </div>
              ) : (
                <div className="dim-score-body">
                  {dim.whatThisGrades && <p>{dim.whatThisGrades}</p>}
                  <p>{dim.status}</p>
                  {dim.judgmentCall && (
                    <p>
                      <strong>Judgment call:</strong> {dim.judgmentCall}
                    </p>
                  )}
                  {dim.gradeBasis?.plusMinusRationale && (
                    <p>{dim.gradeBasis.plusMinusRationale}</p>
                  )}
                  {dim.gradeBasis?.band && (
                    <p>
                      <strong>{dim.gradeBasis.band}</strong> means: {dim.gradeBasis.bandCriterion}
                    </p>
                  )}
                  {activeThresholdRow && (
                    <div className="dim-live-threshold-row">
                      <span>{activeThresholdRow.grade}</span>
                      <p>{activeThresholdRow.criteria}</p>
                    </div>
                  )}
                  {subScoreSummary && (
                    <p className="dim-subscore-summary">
                      <strong>Sub-scores:</strong> {subScoreSummary}
                    </p>
                  )}
                </div>
              )}
            </section>

            {sources.length > 0 && (
              <section className="dim-default-block dim-summary-block">
                <div className="dim-default-block-head">
                  <span>Sources</span>
                  <SourceTierSummary counts={sourceCounts} />
                </div>
                <button
                  type="button"
                  className="dim-summary-open-button"
                  aria-expanded={!!openSections.sources}
                  aria-controls={`dim-${dim.id}-sources-panel`}
                  onClick={(e) => {
                    e.stopPropagation();
                    queueAnchorScroll(`dim-${dim.id}-sources`, ["sources"]);
                  }}
                >
                  {sourceSummary}
                </button>
              </section>
            )}

            {metrics.length > 0 && (
              <section className="dim-default-block dim-summary-block">
                <div className="dim-default-block-head">
                  <span>Metrics</span>
                </div>
                <button
                  type="button"
                  className="dim-summary-open-button"
                  aria-expanded={!!openSections.metrics}
                  aria-controls={`dim-${dim.id}-metrics-panel`}
                  onClick={(e) => {
                    e.stopPropagation();
                    queueAnchorScroll(`dim-${dim.id}-metrics`, ["metrics"]);
                  }}
                >
                  {metricsSummary}
                </button>
              </section>
            )}
          </div>

          <div className="dim-fold-stack">
            {!isTracker && (
              <DisclosureSection
                id={`dim-${dim.id}-skeptic-path`}
                title="Skeptic path"
                summary="walk the grade ingredients"
                isOpen={!!openSections.skeptic}
                onToggle={() => toggleSection("skeptic")}
                active={activeSectionKeys.includes("skeptic")}
                variant="blue"
                instantOpen={isInstantOpenSection("skeptic")}
              >
                <p>
                  To challenge this grade, walk the ingredients in order:{" "}
                  {jumpItems.map((item, index) => (
                    <span key={item.anchor}>
                      <a
                        href={`#${item.anchor}`}
                        onClick={(e) => handleHashLinkClick(e, item.anchor, item.keys)}
                        className="dim-inline-link"
                      >
                        {item.label.toLowerCase()}
                      </a>
                      {index < jumpItems.length - 1 ? ", " : "."}
                    </span>
                  ))}
                </p>
              </DisclosureSection>
            )}

            {keyContextItems.length > 0 && (
              <DisclosureSection
                id={`dim-${dim.id}-context`}
                title="Key trade-offs and confounders"
                summary={`${keyContextItems.length} notes`}
                isOpen={!!openSections.context}
                onToggle={() => toggleSection("context")}
                active={activeSectionKeys.includes("context")}
                variant="green"
                instantOpen={isInstantOpenSection("context")}
              >
                <div className="dim-stack">
                  {keyContextItems.map((item) => (
                    <div key={item.label}>
                      <strong>{item.label}:</strong> {item.text}
                    </div>
                  ))}
                </div>
              </DisclosureSection>
            )}

            {hasRuleSection && (
              <DisclosureSection
                id={`dim-${dim.id}-scoring`}
                title="How this file is scored"
                summary="rule and thresholds"
                isOpen={!!openSections.rule}
                onToggle={() => toggleSection("rule")}
                region
                active={activeSectionKeys.includes("rule")}
                variant="rule"
                instantOpen={isInstantOpenSection("rule")}
              >
                <div className="dim-stack">
                  {dim.construct && (
                    <div>
                      <strong>Construct:</strong> {dim.construct}
                    </div>
                  )}
                  {scoringMetadata.length > 0 && (
                    <div className="dim-stack">
                      <div className="dim-meta-chip-row">
                        {scoringMetadata.map((item) => (
                          <span key={item.label} className="dim-meta-chip">
                            <strong>{item.label}:</strong> {item.value}
                          </span>
                        ))}
                      </div>
                      <DisclosureSection
                        id={`dim-${dim.id}-glossary`}
                        title="What do these mean?"
                        isOpen={!!openSections.glossary}
                        onToggle={() => toggleSection("glossary")}
                        active={activeSectionKeys.includes("glossary")}
                        anchor={false}
                        instantOpen={isInstantOpenSection("glossary")}
                      >
                        <div className="dim-stack">
                          <div>
                            <strong>Confidence</strong> - how resistant the grade is to new data. <em>High</em> = direct measurement against numeric thresholds. <em>Medium</em> = qualitative judgment with mixed evidence. <em>Low</em> = sparse evidence.
                          </div>
                          <div>
                            <strong>Attribution</strong> - what share of the outcome the federal government actually controls. <em>Direct</em> = at least 60% federal levers. <em>Mixed</em> = 30 to 60%. <em>Mostly inherited</em> = less than 30%.
                          </div>
                          <div>
                            <strong>Lag</strong> - how long policy effects take to show in the metrics. <em>Short</em> = monthly / quarterly. <em>Medium</em> = 1 to 2 year cycles. <em>Long</em> = 5+ year structural. <em>Event-driven</em> = the file moves on discrete disclosures or rulings rather than a fixed cadence.
                          </div>
                        </div>
                      </DisclosureSection>
                    </div>
                  )}
                  {scoring?.scopeNote && (
                    <div>
                      <strong>Scope note:</strong> {scoring.scopeNote}
                    </div>
                  )}
                  {scoring?.modifierExpiry && (
                    <div>
                      <strong>Timing rule:</strong> {scoring.modifierExpiry}
                    </div>
                  )}
                  {scoring?.thresholds?.length > 0 && (
                    <div className="dim-stack">
                      <strong>Threshold ladder</strong>
                      {scoring.thresholds.map((threshold) => (
                        <div
                          key={threshold.grade}
                          className={`dim-threshold-row ${threshold === activeThresholdRow ? "dim-threshold-row-active" : ""}`}
                        >
                          <span>{threshold.grade}</span>
                          <p>{threshold.criteria}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {scoring?.guardrails?.length > 0 && (
                    <div className="dim-stack">
                      <strong>Guardrails</strong>
                      {scoring.guardrails.map((rule, i) => (
                        <div key={i} style={{ color: "#444" }}>
                          {rule}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </DisclosureSection>
            )}

            {hasWhySection && (
              <DisclosureSection
                id={`dim-${dim.id}-why`}
                title="Why this grade"
                summary="rationale and judgment"
                isOpen={!!openSections.why}
                onToggle={() => toggleSection("why")}
                region
                active={activeSectionKeys.includes("why")}
                variant="why"
                instantOpen={isInstantOpenSection("why")}
              >
                <div className="dim-stack">
                  {dim.judgmentDetail && (
                    <div>
                      <strong>Where judgment enters:</strong> {dim.judgmentDetail}
                    </div>
                  )}
                  {dim.rationale && <div>{dim.rationale}</div>}
                  {modifierItems.length > 0 && (
                    <div className="dim-stack">
                      <strong>Scoring adjustments</strong>
                      {modifierItems.map((modifier, i) => (
                        <div key={i}>
                          <strong>{MODIFIER_LABELS[modifier.name] || modifier.name}</strong>: {modifier.status}. {modifier.reason}
                        </div>
                      ))}
                    </div>
                  )}
                  {dim.gradeBasis?.leverOperationalization && (
                    <DisclosureSection
                      id={`dim-${dim.id}-lever-operationalization`}
                      title={`Per-lever status criteria (${dim.gradeBasis.leverOperationalization.length} levers)`}
                      isOpen={!!openSections.leverOperationalization}
                      onToggle={() => toggleSection("leverOperationalization")}
                      active={activeSectionKeys.includes("leverOperationalization")}
                      anchor={false}
                      instantOpen={isInstantOpenSection("leverOperationalization")}
                    >
                      <div className="dim-stack">
                        {dim.gradeBasis.leverOperationalization.map((lever, i) => (
                          <div key={i} className="dim-nested-rule-card">
                            <div className="dim-nested-rule-title">{lever.name}</div>
                            <div><strong>Announced if:</strong> {lever.announced}</div>
                            <div><strong>Authorized if:</strong> {lever.authorized}</div>
                            <div><strong>Executing if:</strong> {lever.executing}</div>
                            <div><strong>Current:</strong> {lever.currentStatus}</div>
                          </div>
                        ))}
                        {dim.gradeBasis.leverScoreSummary && (
                          <div className="dim-note-box">
                            <strong>Score summary:</strong> {dim.gradeBasis.leverScoreSummary}
                          </div>
                        )}
                      </div>
                    </DisclosureSection>
                  )}
                  {dim.gradeBasis?.componentOperationalization && (
                    <DisclosureSection
                      id={`dim-${dim.id}-component-operationalization`}
                      title={`Per-component checklist (${dim.gradeBasis.componentOperationalization.length} components)`}
                      isOpen={!!openSections.componentOperationalization}
                      onToggle={() => toggleSection("componentOperationalization")}
                      active={activeSectionKeys.includes("componentOperationalization")}
                      anchor={false}
                      instantOpen={isInstantOpenSection("componentOperationalization")}
                    >
                      <div className="dim-stack">
                        {dim.gradeBasis.componentOperationalization.map((component, i) => (
                          <div key={i} className="dim-nested-rule-card">
                            <div className="dim-nested-rule-title">{component.name}</div>
                            <div><strong>Present if:</strong> {component.presentIfX}</div>
                            <div><strong>Current:</strong> {component.currentStatus}</div>
                          </div>
                        ))}
                        {dim.gradeBasis.componentScoreSummary && (
                          <div className="dim-note-box">
                            <strong>Score summary:</strong> {dim.gradeBasis.componentScoreSummary}
                          </div>
                        )}
                      </div>
                    </DisclosureSection>
                  )}
                  {dim.gradeBasis?.combinationRule && (
                    <DisclosureSection
                      id={`dim-${dim.id}-combination-rule`}
                      title="Combination rule"
                      isOpen={!!openSections.combinationRule}
                      onToggle={() => toggleSection("combinationRule")}
                      active={activeSectionKeys.includes("combinationRule")}
                      anchor={false}
                      instantOpen={isInstantOpenSection("combinationRule")}
                    >
                      <CombinationRule rule={dim.gradeBasis.combinationRule} />
                    </DisclosureSection>
                  )}
                </div>
              </DisclosureSection>
            )}

            {hasSubScores && (
              <DisclosureSection
                id={`dim-${dim.id}-subscores`}
                title="Sub-scores"
                summary={subScoreSummary}
                isOpen={!!openSections.subScores}
                onToggle={() => toggleSection("subScores")}
                active={activeSectionKeys.includes("subScores")}
                variant="neutral"
                instantOpen={isInstantOpenSection("subScores")}
              >
                <div className="dim-subscore-cards">
                  {Object.values(dim.subScores).map((sub, i) => (
                    <div key={i} className="dim-subscore-card">
                      <div className="dim-subscore-card-title">{sub.label}</div>
                      <div className="dim-subscore-card-body">
                        <GradeChip grade={sub.grade} size="sm" />
                        <span>{sub.rationale}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </DisclosureSection>
            )}

            {hasEvidenceTimeline && (
              <DisclosureSection
                id={`dim-${dim.id}-timeline`}
                title="Evidence timeline"
                summary={`${evidenceTimelineRows.length} rows`}
                isOpen={!!openSections.timeline}
                onToggle={() => toggleSection("timeline")}
                region
                active={activeSectionKeys.includes("timeline")}
                variant="green"
                instantOpen={isInstantOpenSection("timeline")}
              >
                <EvidenceTimeline rows={evidenceTimelineRows} />
              </DisclosureSection>
            )}

            {showTriggers && !hasTrackerTriggers && (
              <DisclosureSection
                id={`dim-${dim.id}-triggers-section`}
                title="What would change this grade"
                summary={dim.gradeTriggers ? "up and down triggers" : "next trigger"}
                isOpen={!!openSections.triggers}
                onToggle={() => toggleSection("triggers")}
                region
                active={activeSectionKeys.includes("triggers")}
                variant="yellow"
                instantOpen={isInstantOpenSection("triggers")}
              >
                {dim.gradeTriggers ? (
                  <TriggerColumns
                    up={dim.gradeTriggers.up}
                    down={dim.gradeTriggers.down}
                    renderTriggerItem={renderTriggerItem}
                    keyPrefix="grade"
                    upLabel="Up one step"
                    downLabel="Down one step"
                  />
                ) : (
                  <div>{dim.nextTrigger}</div>
                )}
              </DisclosureSection>
            )}

            {metrics.length > 0 && (
              <DisclosureSection
                id={`dim-${dim.id}-metrics`}
                title="Key metrics"
                summary={`${metrics.length} tracked`}
                isOpen={!!openSections.metrics}
                onToggle={() => toggleSection("metrics")}
                region
                active={activeSectionKeys.includes("metrics")}
                variant="neutral"
                instantOpen={isInstantOpenSection("metrics")}
              >
                <MetricsList metricGroups={metricGroups} />
              </DisclosureSection>
            )}

            {hasProjects && (
              <DisclosureSection
                id={`dim-${dim.id}-cohort`}
                title="Project pipeline"
                summary={`${cohort.projects.length} projects`}
                isOpen={!!openSections.projects}
                onToggle={() => toggleSection("projects")}
                region
                active={activeSectionKeys.includes("projects")}
                variant="rule"
                instantOpen={isInstantOpenSection("projects")}
              >
                <ProjectCohortSection
                  cohort={cohort}
                  isOpen={!!openSections.cohortList}
                  onToggle={() => toggleSection("cohortList")}
                  dimId={dim.id}
                  active={activeSectionKeys.includes("cohortList")}
                  instantOpen={isInstantOpenSection("cohortList")}
                />
              </DisclosureSection>
            )}

            {hasPromises && (
              <DisclosureSection
                id={`dim-${dim.id}-promises`}
                title="Promises"
                summary={`${dim.promises.length} tracked`}
                isOpen={!!openSections.promises}
                onToggle={() => toggleSection("promises")}
                region
                active={activeSectionKeys.includes("promises")}
                variant="neutral"
                instantOpen={isInstantOpenSection("promises")}
              >
                <div>
                  {dim.promises.length} promise{dim.promises.length === 1 ? "" : "s"} tracked on this file. For per-promise status and evidence, see the <strong>Promises</strong> tab.
                </div>
              </DisclosureSection>
            )}

            {hasTrackerTriggers && (
              <DisclosureSection
                id={`dim-${dim.id}-tracker-triggers`}
                title="What changes this tracker"
                summary="tracker movement rules"
                isOpen={!!openSections.trackerTriggers}
                onToggle={() => toggleSection("trackerTriggers")}
                region
                active={activeSectionKeys.includes("trackerTriggers")}
                variant="yellow"
                instantOpen={isInstantOpenSection("trackerTriggers")}
              >
                <TriggerColumns
                  up={dim.gradeTriggers.up}
                  down={dim.gradeTriggers.down}
                  renderTriggerItem={renderTriggerItem}
                  keyPrefix="tracker"
                  upLabel="Upward trigger"
                  downLabel="Downward triggers"
                />
              </DisclosureSection>
            )}

            {sources.length > 0 && (
              <DisclosureSection
                id={`dim-${dim.id}-sources`}
                title="Sources"
                summary={`${sources.length} total`}
                isOpen={!!openSections.sources}
                onToggle={() => toggleSection("sources")}
                region
                active={activeSectionKeys.includes("sources")}
                variant="blue"
                instantOpen={isInstantOpenSection("sources")}
              >
                <div className="dim-stack">
                  <SourceTierSummary counts={sourceCounts} />
                  <SourceStackTable
                    sources={sortedSources}
                    gradeMovesBySource={sourceGradeMoves.moves}
                  />
                  <a
                    href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify({ id: dim.id, name: dim.name, ...(isTracker ? { informationalGrade: dim.informationalGrade } : { grade: dim.grade }), sources, metrics, lastUpdated: dim.lastUpdated }, null, 2))}`}
                    download={`${dim.id}-sources.json`}
                    onClick={(e) => e.stopPropagation()}
                    className="dim-download-link"
                  >
                    ⤓ Download sources as JSON
                  </a>
                </div>
              </DisclosureSection>
            )}

            {dim.perspectives && (
              <DisclosureSection
                id={`dim-${dim.id}-perspectives-section`}
                title="Critics and defenders"
                summary="named views"
                isOpen={!!openSections.perspectives}
                onToggle={() => toggleSection("perspectives")}
                region
                active={activeSectionKeys.includes("perspectives")}
                variant="blue"
                instantOpen={isInstantOpenSection("perspectives")}
              >
                <div className="dim-stack">
                  <div className="dim-perspective-card dim-perspective-critics">
                    <strong>Critics say:</strong> {dim.perspectives.critics}
                  </div>
                  <div className="dim-perspective-card dim-perspective-defenders">
                    <strong>Defenders say:</strong> {dim.perspectives.defenders}
                  </div>
                </div>
              </DisclosureSection>
            )}

            {dim.scope && (
              <DisclosureSection
                id={`dim-${dim.id}-scope`}
                title="Scope"
                summary="in and out"
                isOpen={!!openSections.scope}
                onToggle={() => toggleSection("scope")}
                active={activeSectionKeys.includes("scope")}
                instantOpen={isInstantOpenSection("scope")}
              >
                <div className="dim-stack">
                  <div>
                    <strong>In scope:</strong>
                    <div className="dim-stack dim-narrow-stack">
                      {dim.scope.inScope.map((item, i) => (
                        <div key={i}>{renderScopeItem(item)}</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <strong>Out of scope:</strong>
                    <div className="dim-stack dim-narrow-stack">
                      {dim.scope.outOfScope.map((item, i) => (
                        <div key={i}>{renderScopeItem(item)}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </DisclosureSection>
            )}

            {dim.inherited && (
              <DisclosureSection
                id={`dim-${dim.id}-inherited`}
                title="What was inherited"
                summary="starting context"
                isOpen={!!openSections.inherited}
                onToggle={() => toggleSection("inherited")}
                active={activeSectionKeys.includes("inherited")}
                instantOpen={isInstantOpenSection("inherited")}
              >
                <div>{dim.inherited}</div>
              </DisclosureSection>
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

function EvidenceTimeline({ rows }) {
  return (
    <div className="dim-stack">
      <div className="dim-note-box">
        This is the evidence trail the grade reads against. It is not a
        weighted formula.
      </div>
      <div className="dim-table-wrap">
        <table className="dim-evidence-timeline-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Source</th>
              <th>What it showed</th>
              <th>Used as</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={`${row.date || "undated"}-${row.effect}-${i}`}>
                <td className="dim-evidence-date">{row.date || "Undated"}</td>
                <td>
                  {row.source?.url ? (
                    <a
                      href={row.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="dim-evidence-source-link"
                    >
                      {row.source.label}
                      <SourceTierBadge url={row.source.url} />
                      <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <span className="dim-evidence-source-label">
                      {row.source?.label || "Dashboard evidence"}
                    </span>
                  )}
                </td>
                <td>{row.what}</td>
                <td>
                  <span className="dim-evidence-effect">
                    {row.effect}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SourceStackTable({ sources, gradeMovesBySource }) {
  return (
    <div className="dim-source-stack">
      <div className="dim-source-stack-legend">
        <span title={TIER_DEFINITIONS[1]}><strong>T1</strong> primary records / official data</span>
        <span title={TIER_DEFINITIONS[2]}><strong>T2</strong> independent analysis / established media</span>
        <span title={TIER_DEFINITIONS[3]}><strong>T3</strong> context / challenge evidence</span>
      </div>
      <div className="dim-table-wrap">
        <table className="dim-source-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Source</th>
              <th>Tier</th>
              <th>Effect on grade</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((source, i) => {
              const canonical = canonicalUrl(source.url);
              const moves = canonical ? gradeMovesBySource.get(canonical) || [] : [];
              const moved = moves.length > 0;
              const effectTitle = moved
                ? moves.map((move) => move.title).join(" / ")
                : "This source is cited as evidence but is not linked to a recorded grade move.";

              return (
                <tr key={`${source.url}-${i}`} data-source-needs-review={source.needsManualDate ? "true" : undefined}>
                  <td className="dim-source-date-cell">
                    <span className="dim-source-date">{formatSourceDate(source)}</span>
                    <span className={`dim-source-date-kind dim-source-date-kind-${sourceDateKindLabel(source)}`}>
                      {sourceDateKindLabel(source)}
                    </span>
                  </td>
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
                    <SourceTierBadge url={source.url} />
                  </td>
                  <td>
                    <span
                      className={`dim-source-effect ${moved ? "dim-source-effect-moved" : "dim-source-effect-none"}`}
                      title={effectTitle}
                    >
                      {moved ? moves.map((move) => `moved ${move.label}`).join(" / ") : "no change"}
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
                      <SourceTierBadge url={sourceRef.url} />
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
        <div className="dim-nested-rule-title">The five flagship files</div>
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

function ProjectCohortSection({ cohort, isOpen, onToggle, dimId, active, instantOpen = false }) {
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
          <strong>{total} projects in MPO cohort.</strong>{" "}
          {aboveDesignatedCount} currently sit above designated status;{" "}
          {documentedAdvancedCount} of {total} ({documentedAdvancedPct}%) have
          documented post-designation advancement.
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
      <DisclosureSection
        id={`dim-${dimId}-cohort-list`}
        title="Full project list"
        summary={`${total} rows`}
        isOpen={isOpen}
        onToggle={onToggle}
        active={active}
        instantOpen={instantOpen}
        anchor
      >
        <div className="cohort-mobile-projects" aria-label="Full Major Projects cohort list">
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
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Open source →
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </article>
          ))}
        </div>
        <div
          id={`dim-${dimId}-cohort-table`}
          role={active ? "region" : undefined}
          aria-labelledby={`dim-${dimId}-cohort-list-button`}
          className="cohort-table-wrap"
        >
          <table className="dim-cohort-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Tranche</th>
                <th>Stage</th>
                <th>Stage date</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {sortedProjects.map((p, i) => (
                <tr key={`${p.name}-${i}`}>
                  <td>
                    <div className="dim-cohort-project-name">{p.name}</div>
                    {p.location && (
                      <div className="dim-cohort-location">
                        {p.location}
                      </div>
                    )}
                  </td>
                  <td>{p.tranche}</td>
                  <td>{stagePill(p.stage)}</td>
                  <td>{p.stageDate}</td>
                  <td>
                    {p.sourceUrl && (
                      <a
                        href={p.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="dim-inline-link"
                      >
                        Source →
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DisclosureSection>
    </div>
  );
}

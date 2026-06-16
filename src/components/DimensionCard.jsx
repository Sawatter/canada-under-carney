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

function sectionKeysForTargetFromDefinitions(target, sectionDefinitions) {
  if (!target) return [];
  const match = sectionDefinitions.find((section) => section.targets.includes(target));
  return match ? match.keys : [];
}

function targetBelongsToDimension(target, dimId) {
  return target === `dim-${dimId}` || target.startsWith(`dim-${dimId}-`);
}

function focusDisclosureButtonForTarget(target) {
  if (!target) return;
  const button = document.getElementById(`${target}-button`);
  if (button && typeof button.focus === "function") {
    button.focus({ preventScroll: true });
    return;
  }
  const targetElement = document.getElementById(target);
  if (targetElement && typeof targetElement.focus === "function") {
    targetElement.focus({ preventScroll: true });
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

function isContextMetric(metric) {
  const text = `${metric?.group || ""} ${metric?.label || ""}`.toLowerCase();
  return text.includes("inherited")
    || text.includes("context only")
    || text.includes("baseline");
}

function pickTopMetrics(metrics = [], limit = 4) {
  const picked = [];
  const pickedIndexes = new Set();
  const seenGroups = new Set();

  metrics.forEach((metric, index) => {
    if (picked.length >= limit) return;
    if (isContextMetric(metric)) return;
    const group = metric.group || `metric-${index}`;
    if (seenGroups.has(group)) return;
    seenGroups.add(group);
    picked.push(metric);
    pickedIndexes.add(index);
  });

  metrics.forEach((metric, index) => {
    if (picked.length >= limit || pickedIndexes.has(index)) return;
    picked.push(metric);
  });

  return picked;
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
  const topMetrics = useMemo(() => pickTopMetrics(metrics), [metrics]);
  const sourceUsageByUrl = useMemo(() => buildSourceUsageByUrl(dim, metrics), [dim, metrics]);
  const promiseStatusCounts = useMemo(() => countPromisesByStatus(dim.promises || []), [dim.promises]);

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
      text: `This file moves on a ${dim.tags.lag.toLowerCase()} timeline.`,
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

  const hasRuleSection = !!(dim.construct || scoring || scoringMetadata.length > 0);
  const hasWhySection = !!(dim.gradeBasis || dim.rationale || dim.judgmentDetail || modifierItems.length > 0 || isTracker);
  const hasSubScores = !isTracker && !!dim.subScores;
  const hasProjects = !!(cohort && cohort.projects && cohort.projects.length > 0);
  const hasPromises = !!(dim.promises && dim.promises.length > 0);
  const hasTrackerTriggers = isTracker && !!dim.gradeTriggers;
  const hasCaveats = keyContextItems.length > 0 || !!dim.perspectives || !!dim.scope || !!dim.inherited;

  const sectionDefinitions = useMemo(() => [
    {
      id: "summary",
      label: "Verdict",
      anchor: `dim-${dim.id}-summary`,
      keys: [],
      available: true,
      targets: [`dim-${dim.id}`, `dim-${dim.id}-summary`],
      nav: true,
      desktopOnly: true,
    },
    {
      id: "why",
      label: "Why",
      anchor: `dim-${dim.id}-why`,
      keys: ["why"],
      available: hasWhySection,
      targets: [`dim-${dim.id}-why`],
      nav: true,
      desktopOnly: true,
    },
    {
      id: "subScores",
      label: "Sub-scores",
      anchor: `dim-${dim.id}-subscores`,
      keys: ["subScores"],
      available: hasSubScores,
      targets: [`dim-${dim.id}-subscores`],
    },
    {
      id: "triggers",
      label: "Triggers",
      anchor: `dim-${dim.id}-triggers-section`,
      keys: ["triggers"],
      available: showTriggers && !hasTrackerTriggers,
      targets: [`dim-${dim.id}-triggers-section`],
      nav: !isTracker,
    },
    {
      id: "metrics",
      label: "Metrics",
      anchor: `dim-${dim.id}-metrics`,
      keys: ["metrics"],
      available: metrics.length > 0,
      targets: [`dim-${dim.id}-metrics`],
    },
    {
      id: "sources",
      label: "Sources",
      anchor: `dim-${dim.id}-sources`,
      keys: ["sources"],
      available: sources.length > 0,
      targets: [`dim-${dim.id}-sources`],
      nav: true,
    },
    {
      id: "rule",
      label: "Rule",
      anchor: `dim-${dim.id}-scoring`,
      keys: ["rule"],
      available: hasRuleSection,
      targets: [`dim-${dim.id}-scoring`],
      nav: true,
    },
    {
      id: "projects",
      label: "Projects",
      anchor: `dim-${dim.id}-cohort`,
      keys: ["projects", "cohortList"],
      available: hasProjects,
      targets: [`dim-${dim.id}-cohort`, `dim-${dim.id}-cohort-list`, `dim-${dim.id}-cohort-table`],
    },
    {
      id: "promises",
      label: "Promises",
      anchor: `dim-${dim.id}-promises`,
      keys: ["promises"],
      available: hasPromises,
      targets: [`dim-${dim.id}-promises`],
    },
    {
      id: "trackerTriggers",
      label: "Moves",
      anchor: `dim-${dim.id}-tracker-triggers`,
      keys: ["trackerTriggers"],
      available: hasTrackerTriggers,
      targets: [`dim-${dim.id}-tracker-triggers`],
      nav: isTracker,
    },
    {
      id: "caveats",
      label: "Caveats",
      anchor: `dim-${dim.id}-caveats`,
      keys: ["caveats"],
      available: hasCaveats,
      targets: [
        `dim-${dim.id}-caveats`,
        `dim-${dim.id}-context`,
        `dim-${dim.id}-perspectives-section`,
        `dim-${dim.id}-scope`,
        `dim-${dim.id}-inherited`,
      ],
    },
    {
      id: "glossary",
      label: "Glossary",
      anchor: `dim-${dim.id}-glossary`,
      keys: ["glossary"],
      available: scoringMetadata.length > 0,
      targets: [`dim-${dim.id}-glossary`],
    },
    {
      id: "leverOperationalization",
      label: "Lever criteria",
      anchor: `dim-${dim.id}-lever-operationalization`,
      keys: ["leverOperationalization"],
      available: !!dim.gradeBasis?.leverOperationalization,
      targets: [`dim-${dim.id}-lever-operationalization`],
    },
    {
      id: "componentOperationalization",
      label: "Component checklist",
      anchor: `dim-${dim.id}-component-operationalization`,
      keys: ["componentOperationalization"],
      available: !!dim.gradeBasis?.componentOperationalization,
      targets: [`dim-${dim.id}-component-operationalization`],
    },
    {
      id: "combinationRule",
      label: "Combination rule",
      anchor: `dim-${dim.id}-combination-rule`,
      keys: ["combinationRule"],
      available: !!dim.gradeBasis?.combinationRule,
      targets: [`dim-${dim.id}-combination-rule`],
    },
  ], [
    dim.gradeBasis?.combinationRule,
    dim.gradeBasis?.componentOperationalization,
    dim.gradeBasis?.leverOperationalization,
    dim.id,
    dim.inherited,
    dim.perspectives,
    dim.scope,
    hasProjects,
    hasPromises,
    hasCaveats,
    hasRuleSection,
    hasSubScores,
    hasTrackerTriggers,
    hasWhySection,
    isTracker,
    metrics.length,
    scoringMetadata.length,
    showTriggers,
    sources.length,
  ]);

  const availableSections = useMemo(() => (
    Array.from(new Set(
      sectionDefinitions
        .filter((section) => section.available)
        .flatMap((section) => section.keys)
    ))
  ), [sectionDefinitions]);

  const jumpItems = useMemo(() => (
    sectionDefinitions
      .filter((section) => (
        section.available
        && ["rule", isTracker ? "trackerTriggers" : "triggers", "sources"].includes(section.id)
      ))
      .sort((a, b) => {
        const order = isTracker ? ["rule", "trackerTriggers", "sources"] : ["rule", "triggers", "sources"];
        return order.indexOf(a.id) - order.indexOf(b.id);
      })
      .map(({ label, anchor, keys }) => ({ label, anchor, keys }))
  ), [isTracker, sectionDefinitions]);

  const sectionNavItems = useMemo(() => (
    sectionDefinitions
      .filter((section) => section.available && (section.nav || section.jump))
      .sort((a, b) => {
        const order = isTracker
          ? ["summary", "why", "trackerTriggers", "sources", "rule"]
          : ["summary", "why", "triggers", "sources", "rule"];
        return order.indexOf(a.id) - order.indexOf(b.id);
      })
      .map(({ label, anchor, keys, desktopOnly }) => ({ label, anchor, keys, desktopOnly }))
  ), [isTracker, sectionDefinitions]);

  const getSectionKeysForTarget = useCallback((target) => (
    sectionKeysForTargetFromDefinitions(target, sectionDefinitions)
  ), [sectionDefinitions]);

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
  }, [setOpenSections]);

  const markInstantOpenSections = useCallback((sections, requestId) => {
    if (sections.length === 0) return;
    setInstantOpenSections((current) => {
      const next = { ...current };
      sections.forEach((section) => {
        next[section] = requestId;
      });
      return next;
    });
  }, [setInstantOpenSections]);

  const openAllSections = () => {
    const next = {};
    availableSections.forEach((section) => {
      next[section] = true;
    });
    setOpenSections(next);
  };

  const queueAnchorScroll = useCallback((target, sections) => {
    if (!target) return;
    const keys = Array.isArray(sections) ? sections : getSectionKeysForTarget(target);
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
    anchorNavigation,
    getSectionKeysForTarget,
    markInstantOpenSections,
    openSectionKeys,
    setActiveAnchorTarget,
    setActiveNavAnchor,
    setScrollIntent,
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
      && getSectionKeysForTarget(anchorTarget).length > 0;
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
  }, [dim.id, getSectionKeysForTarget, isExpanded, isMobileDialog, onClick]);

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
      : getSectionKeysForTarget(targetId);
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
    let cancelled = false;
    const clearIntent = () => {
      if (!cancelled) setScrollIntent(null);
    };
    if (typeof queueMicrotask === "function") {
      queueMicrotask(clearIntent);
    } else {
      window.setTimeout(clearIntent, 0);
    }
    return () => {
      cancelled = true;
    };
  }, [getSectionKeysForTarget, isExpanded, openSections, scrollIntent, setScrollIntent]);

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
    let cancelled = false;
    const clearClosedState = () => {
      if (cancelled) return;
      setActiveAnchorTarget(null);
      setActiveNavAnchor(null);
      setScrollIntent(null);
    };
    if (typeof window !== "undefined") {
      window.setTimeout(clearClosedState, 0);
    } else {
      Promise.resolve().then(clearClosedState);
    }
    return () => {
      cancelled = true;
    };
  }, [isExpanded, setActiveAnchorTarget, setActiveNavAnchor, setScrollIntent]);

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
  const activeSectionKeys = getSectionKeysForTarget(activeAnchorTarget);
  const isInstantOpenSection = (section) => !!instantOpenSections[section];
  const promiseSummaryLine = hasPromises
    ? `${dim.promises.length} promise${dim.promises.length === 1 ? "" : "s"} tracked`
    : null;
  const promiseStatusSummary = hasPromises
    ? Object.entries(promiseStatusCounts)
      .map(([status, count]) => `${count} ${status}`)
      .join(" / ")
    : null;

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
            className="dim-default-blocks dim-detail-overview"
            aria-label={`${dim.name} verdict summary`}
          >
            <section className="dim-verdict-hero dim-default-block">
              <div className="dim-verdict-copy">
                <div className="dim-default-block-head">
                  <span>{isTracker ? "Tracker snapshot" : "Verdict"}</span>
                  {isTracker ? (
                    <span className="dim-info-grade-pill">
                      {dim.informationalGrade} informational
                    </span>
                  ) : (
                    <GradeChip grade={dim.grade} />
                  )}
                </div>
                {dim.whatThisGrades && (
                  <p className="dim-verdict-kicker">{dim.whatThisGrades}</p>
                )}
                <p className="dim-verdict-status">{dim.status}</p>
                {isTracker && (
                  <p className="dim-verdict-note">
                    Promise Delivery is tracked outside the GPA. It counts commitments across all files rather than grading a policy outcome.
                  </p>
                )}
                {!isTracker && dim.judgmentCall && (
                  <p className="dim-verdict-note">
                    <strong>Judgment call:</strong> {dim.judgmentCall}
                  </p>
                )}
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
              <div className="dim-verdict-mark">
                {isTracker ? (
                  trackerStat ? (
                    <div className="dim-tracker-count dim-tracker-count-large">
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
                  <>
                    <GradeChip grade={dim.grade} />
                    <TrendArrow trend={dim.trend} />
                    {dim.previousGrade && (
                      <span className="dim-previous-grade-note">was {dim.previousGrade}</span>
                    )}
                  </>
                )}
              </div>
            </section>

            <section
              id={`dim-${dim.id}-why`}
              tabIndex={-1}
              className="dim-why-panel dim-default-block"
            >
              <div className="dim-default-block-head">
                <span>{isTracker ? "Why this tracker reads this way" : "Why this grade"}</span>
              </div>
              <div className="dim-score-body">
                {dim.judgmentDetail && (
                  <p>
                    <strong>Where judgment enters:</strong> {dim.judgmentDetail}
                  </p>
                )}
                {dim.rationale && <p>{dim.rationale}</p>}
                {isTracker && trackerStat && (
                  <p>
                    <strong>{trackerStat.delivered} of {trackerStat.total}</strong> tracked commitments are delivered.
                    {promiseStatusSummary ? ` Current non-delivered pattern: ${promiseStatusSummary}.` : ""}
                  </p>
                )}
                {isTracker && (
                  <p>
                    This tracker is derivative: movement comes from the underlying promise evidence, not from the GPA rules.
                  </p>
                )}
                {!isTracker && dim.gradeBasis?.plusMinusRationale && (
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
            </section>

            <section className="dim-at-glance-panel dim-default-block">
              <div className="dim-default-block-head">
                <span>At a glance</span>
              </div>
              <div className="dim-stack">
                {showTriggers && !hasTrackerTriggers && (
                  <section
                    id={`dim-${dim.id}-triggers-section`}
                    tabIndex={-1}
                    className={`dim-change-card${activeSectionKeys.includes("triggers") ? " dim-change-card-active" : ""}`}
                  >
                    <div className="dim-change-card-title">What would change this grade</div>
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
                  </section>
                )}
                {hasTrackerTriggers && (
                  <section
                    id={`dim-${dim.id}-tracker-triggers`}
                    tabIndex={-1}
                    className={`dim-change-card${activeSectionKeys.includes("trackerTriggers") ? " dim-change-card-active" : ""}`}
                  >
                    <div className="dim-change-card-title">What changes this tracker</div>
                    <TriggerColumns
                      up={dim.gradeTriggers.up}
                      down={dim.gradeTriggers.down}
                      renderTriggerItem={renderTriggerItem}
                      keyPrefix="tracker"
                      upLabel="Upward trigger"
                      downLabel="Downward triggers"
                    />
                  </section>
                )}
                {jumpItems.length > 0 && (
                  <p className="dim-challenge-cue">
                    To challenge the read, start with{" "}
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
                )}
                {topMetrics.length > 0 && (
                  <div className="dim-top-metrics">
                    <div className="dim-mini-section-title">Top metrics</div>
                    {topMetrics.map((metric) => (
                      <div key={`${metric.label}-${metric.value}`} className="dim-top-metric-row">
                        <span>{metric.label}</span>
                        <strong>{metric.value}</strong>
                      </div>
                    ))}
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
                  </div>
                )}
                {sources.length > 0 && (
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
                )}
                {hasPromises && (
                  <button
                    type="button"
                    className="dim-summary-open-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onInternalRef?.({ type: "view", target: "promises" });
                    }}
                  >
                    {promiseSummaryLine} → Promises tab
                  </button>
                )}
              </div>
            </section>
          </div>

          <div className="dim-fold-stack">
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
                <div className="dim-stack">
                  <div>
                    {dim.promises.length} promise{dim.promises.length === 1 ? "" : "s"} tracked on this file.
                    {promiseStatusSummary ? ` Current pattern: ${promiseStatusSummary}.` : ""}
                  </div>
                  <button
                    type="button"
                    className="dim-summary-open-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onInternalRef?.({ type: "view", target: "promises" });
                    }}
                  >
                    Open the Promises tab →
                  </button>
                </div>
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
                    usageBySource={sourceUsageByUrl}
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

            {hasCaveats && (
              <DisclosureSection
                id={`dim-${dim.id}-caveats`}
                title="Caveats"
                summary="trade-offs and alternate reads"
                isOpen={!!openSections.caveats}
                onToggle={() => toggleSection("caveats")}
                region
                active={activeSectionKeys.includes("caveats")}
                variant="blue"
                instantOpen={isInstantOpenSection("caveats")}
              >
                <div className="dim-stack">
                  {keyContextItems.length > 0 && (
                    <div id={`dim-${dim.id}-context`} tabIndex={-1} className="dim-stack">
                      <strong>Trade-offs and confounders</strong>
                      {keyContextItems.map((item) => (
                        <div key={item.label}>
                          <strong>{item.label}:</strong> {item.text}
                        </div>
                      ))}
                    </div>
                  )}
                  {dim.perspectives && (
                    <div id={`dim-${dim.id}-perspectives-section`} tabIndex={-1} className="dim-stack">
                      <strong>Alternate reads</strong>
                      <div className="dim-perspective-card dim-perspective-critics">
                        <strong>Critics say:</strong> {dim.perspectives.critics}
                      </div>
                      <div className="dim-perspective-card dim-perspective-defenders">
                        <strong>Defenders say:</strong> {dim.perspectives.defenders}
                      </div>
                    </div>
                  )}
                  {dim.scope && (
                    <div id={`dim-${dim.id}-scope`} tabIndex={-1} className="dim-stack">
                      <strong>Scope</strong>
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
                  )}
                  {dim.inherited && (
                    <div id={`dim-${dim.id}-inherited`} tabIndex={-1}>
                      <strong>What was inherited:</strong> {dim.inherited}
                    </div>
                  )}
                </div>
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
      <div className="dim-source-stack-legend">
        <span title={TIER_DEFINITIONS[1]}><strong>T1</strong> primary records / official data</span>
        <span title={TIER_DEFINITIONS[2]}><strong>T2</strong> independent analysis / established media</span>
        <span title={TIER_DEFINITIONS[3]}><strong>T3</strong> context / challenge evidence</span>
      </div>
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
                <SourceTierBadge url={source.url} />
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
              <th>Tier</th>
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
                    <SourceTierBadge url={source.url} />
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
          tabIndex={-1}
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

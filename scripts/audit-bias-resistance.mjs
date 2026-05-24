#!/usr/bin/env node
/**
 * Bias-Resistance Audit Script — Phase 1 (operational audit)
 *
 * Parses src/data/dimensions.json and src/data/changelog.json. Produces
 * raw audit data the editor copies into the per-cycle audit doc.
 *
 * Mechanical checks covered:
 *   1. Source-family distribution per dimension
 *   2. Trigger symmetry (mechanical view: URL presence, threshold presence,
 *      trigger count balance)
 *   3. Critics/defenders pre-check (word count, URL count, named-source count)
 *   5. Modifier inventory per dimension
 *   6. Update-cadence / attention-bias (grade movements per dimension from
 *      changelog.json)
 *
 * Not covered (human-only sections of the audit doc):
 *   4. Language audit (loaded adjectives, framing tells, trend/status
 *      consistency)
 *   7. Skeptic-path UI inventory
 *
 * Run:
 *   node scripts/audit-bias-resistance.mjs
 *
 * Output:
 *   scripts/output/bias-audit-raw-2026-05.txt
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");
const DIMENSIONS_PATH = path.join(PROJECT_ROOT, "src/data/dimensions.json");
const CHANGELOG_PATH = path.join(PROJECT_ROOT, "src/data/changelog.json");
const META_PATH = path.join(PROJECT_ROOT, "src/data/meta.json");
const OUTPUT_DIR = path.join(PROJECT_ROOT, "scripts/output");
const OUTPUT_PATH = path.join(OUTPUT_DIR, "bias-audit-raw-2026-05.txt");

// --- Source-family taxonomy ---
// Order matters: first matching rule wins. More specific patterns first.
//
// Taxonomy revised 2026-05-16 to address Q3 (procedural vs critique split)
// and the family-10 threshold-source nuance addressed in classifyForChallenge.
const FAMILY_RULES = [
  // Family 1: PMO / Carney-specific messaging + partisan-party platform
  { family: 1, name: "PMO / Carney messaging", pattern: /^https?:\/\/(www\.)?pm\.gc\.ca\//i },
  { family: 1, name: "PMO / Carney messaging", pattern: /^https?:\/\/(www\.)?liberal\.ca\//i },
  { family: 1, name: "PMO / Carney messaging", pattern: /^https?:\/\/(www\.)?conservative\.ca\//i },
  { family: 1, name: "PMO / Carney messaging", pattern: /^https?:\/\/(www\.)?ndp\.ca\//i },

  // Family 4: Independent official / watchdog (before department messaging — order matters)
  { family: 4, name: "Independent official / watchdog", pattern: /pbo-dpb\.ca/i },
  { family: 4, name: "Independent official / watchdog", pattern: /oag-bvg\.gc\.ca/i },
  { family: 4, name: "Independent official / watchdog", pattern: /ciec-ccie\.parl\.gc\.ca/i },
  { family: 4, name: "Independent official / watchdog", pattern: /prciec-rpccie\.parl\.gc\.ca/i },
  // CER (Canada Energy Regulator) is an independent federal agency with
  // arms-length status from the executive; its Energy Future projections
  // are a non-advocacy official benchmark. Added v5.65 with CER threading
  // into the Climate Emissions cap metric.
  { family: 4, name: "Independent official / watchdog", pattern: /cer-rec\.gc\.ca/i },

  // Family 5: Procedural parliamentary records (LEGISinfo bill-tracking, status pages)
  // These are neutral records of legislative status. Not critique.
  { family: 5, name: "Procedural parliamentary records", pattern: /parl\.ca\/legisinfo/i },
  { family: 5, name: "Procedural parliamentary records", pattern: /parl\.ca\/.*bill/i },

  // Family 6: Parliamentary committee / opposition critique
  // Committee reports (may be consensus or minority), critical statements.
  { family: 6, name: "Parliamentary committee / critique", pattern: /parl\.ca\/committees/i },
  { family: 6, name: "Parliamentary committee / critique", pattern: /ourcommons\.ca/i },
  { family: 6, name: "Parliamentary committee / critique", pattern: /sencanada\.ca/i },

  // Family 3: Operational govt data (before generic canada.ca rules)
  { family: 3, name: "Operational govt data", pattern: /statcan\.gc\.ca/i },
  { family: 3, name: "Operational govt data", pattern: /www150\.statcan\.gc\.ca/i },
  { family: 3, name: "Operational govt data", pattern: /ircc\.canada\.ca/i },
  { family: 3, name: "Operational govt data", pattern: /cmhc-schl\.gc\.ca/i },
  { family: 3, name: "Operational govt data", pattern: /bankofcanada\.ca/i },
  { family: 3, name: "Operational govt data", pattern: /budget\.canada\.ca/i },

  // Family 2: Department / press-release messaging (canada.ca catch-all, after family 3 ops data)
  { family: 2, name: "Department / press release", pattern: /canada\.ca\/en\/[a-z-]+\/news\//i },
  { family: 2, name: "Department / press release", pattern: /canada\.ca\/en\/department-finance/i },
  { family: 2, name: "Department / press release", pattern: /canada\.ca\/en\/innovation-science/i },
  { family: 2, name: "Department / press release", pattern: /canada\.ca\/en\/employment-social-development/i },
  { family: 2, name: "Department / press release", pattern: /canada\.ca\/en\/immigration-refugees-citizenship/i },
  { family: 2, name: "Department / press release", pattern: /canada\.ca\/en\/environment-climate-change/i },
  { family: 2, name: "Department / press release", pattern: /canada\.ca\/en\/health-canada/i },
  { family: 2, name: "Department / press release", pattern: /canada\.ca\/en\/national-defence/i },
  { family: 2, name: "Department / press release", pattern: /canada\.ca\/en\/housing-infrastructure/i },
  { family: 2, name: "Department / press release", pattern: /canada\.ca\/en\/services\/jobs/i },
  { family: 2, name: "Department / press release", pattern: /canada\.ca\/en\/privy-council/i },
  { family: 2, name: "Department / press release", pattern: /canada\.ca\/en\/treasury-board-secretariat/i },
  { family: 2, name: "Department / press release", pattern: /canada\.ca\/en\/revenue-agency/i },
  { family: 2, name: "Department / press release", pattern: /international\.canada\.ca/i },
  { family: 2, name: "Department / press release", pattern: /ised-isde\.canada\.ca/i },
  { family: 2, name: "Department / press release", pattern: /tc\.canada\.ca/i },
  { family: 2, name: "Department / press release", pattern: /eccc\.canada\.ca/i },
  // Generic canada.ca fallback
  { family: 2, name: "Department / press release", pattern: /(www\.)?canada\.ca/i },

  // Family 7: Independent policy institute / think tank
  { family: 7, name: "Policy institute", pattern: /cdhowe\.org/i },
  { family: 7, name: "Policy institute", pattern: /fraserinstitute\.org/i },
  { family: 7, name: "Policy institute", pattern: /irpp\.org/i },
  { family: 7, name: "Policy institute", pattern: /policyoptions\.irpp\.org/i },
  { family: 7, name: "Policy institute", pattern: /climateinstitute\.ca/i },
  { family: 7, name: "Policy institute", pattern: /iisd\.org/i },
  { family: 7, name: "Policy institute", pattern: /democracywatch\.ca/i },
  { family: 7, name: "Policy institute", pattern: /thehub\.ca/i },
  { family: 7, name: "Policy institute", pattern: /pembina\.org/i },
  { family: 7, name: "Policy institute", pattern: /macdonaldlaurier\.ca/i },
  { family: 7, name: "Policy institute", pattern: /ifsd\.ca/i },
  // Centrist / business-focused policy institutes and pro-immigration /
  // food-security advocacy research orgs added v5.65 after Perplexity +
  // Comet Round 2 reviews flagged gaps in cross-ideological challenge
  // sources for Affordability, Economic Policy, and Immigration.
  { family: 7, name: "Policy institute", pattern: /conferenceboard\.ca/i },
  { family: 7, name: "Policy institute", pattern: /signal49\.ca/i },
  { family: 7, name: "Policy institute", pattern: /maytree\.com/i },
  { family: 7, name: "Policy institute", pattern: /foodbankscanada\.ca/i },
  { family: 7, name: "Policy institute", pattern: /smartprosperity\.ca/i },
  { family: 7, name: "Policy institute", pattern: /thebusinesscouncil\.ca/i },

  // Family 8: Journalism
  { family: 8, name: "Journalism", pattern: /cbc\.ca/i },
  { family: 8, name: "Journalism", pattern: /theglobeandmail\.com/i },
  { family: 8, name: "Journalism", pattern: /thestar\.com/i },
  { family: 8, name: "Journalism", pattern: /nationalpost\.com/i },
  { family: 8, name: "Journalism", pattern: /thenarwhal\.ca/i },
  { family: 8, name: "Journalism", pattern: /nationalobserver\.com/i },
  { family: 8, name: "Journalism", pattern: /hilltimes\.com/i },
  { family: 8, name: "Journalism", pattern: /financialpost\.com/i },
  { family: 8, name: "Journalism", pattern: /reuters\.com/i },
  { family: 8, name: "Journalism", pattern: /bloomberg\.com/i },
  { family: 8, name: "Journalism", pattern: /globalnews\.ca/i },
  { family: 8, name: "Journalism", pattern: /ctvnews\.ca/i },
  { family: 8, name: "Journalism", pattern: /bnnbloomberg\.ca/i },
  { family: 8, name: "Journalism", pattern: /theconversation\.com/i },

  // Family 9: Academic / research / pollsters
  { family: 9, name: "Academic / research / pollsters", pattern: /proof\.utoronto\.ca/i },
  { family: 9, name: "Academic / research / pollsters", pattern: /utoronto\.ca/i },
  { family: 9, name: "Academic / research / pollsters", pattern: /mcgill\.ca/i },
  { family: 9, name: "Academic / research / pollsters", pattern: /ubc\.ca/i },
  { family: 9, name: "Academic / research / pollsters", pattern: /dal\.ca/i },
  { family: 9, name: "Academic / research / pollsters", pattern: /uwaterloo\.ca/i },
  { family: 9, name: "Academic / research / pollsters", pattern: /abacusdata\.ca/i },
  { family: 9, name: "Academic / research / pollsters", pattern: /leger360\.com/i },
  { family: 9, name: "Academic / research / pollsters", pattern: /angusreid\.org/i },
  { family: 9, name: "Academic / research / pollsters", pattern: /pollara\.com/i },
  { family: 9, name: "Academic / research / pollsters", pattern: /ipsos\.com/i },
  { family: 9, name: "Academic / research / pollsters", pattern: /innovativeresearch\.ca/i },
  { family: 9, name: "Academic / research / pollsters", pattern: /statista\.com/i },
  // Independent productivity-research body and private-sector economics
  // arms whose research is published with named authors and methodology
  // and is cited across the political spectrum. Added v5.65.
  { family: 9, name: "Academic / research / pollsters", pattern: /csls\.ca/i },
  // TODO June 2026: evaluate family 12 for financial-institution research
  // (Scotiabank Economics, National Bank Economics, Conference Board market-side research)
  // Codex review flagged these as distinct from pure policy institutes (family 7).
  { family: 9, name: "Academic / research / pollsters", pattern: /scotiabank\.com\/.*economics/i },
  { family: 9, name: "Academic / research / pollsters", pattern: /nbc\.ca\/.*economics/i },
  { family: 9, name: "Academic / research / pollsters", pattern: /nbf\.ca\/.*economics/i },

  // Family 10: International benchmark / rating agency
  { family: 10, name: "International benchmark / rating", pattern: /imf\.org/i },
  { family: 10, name: "International benchmark / rating", pattern: /oecd\.org/i },
  { family: 10, name: "International benchmark / rating", pattern: /(^|\.)nato\.int/i },
  { family: 10, name: "International benchmark / rating", pattern: /fitchratings\.com/i },
  { family: 10, name: "International benchmark / rating", pattern: /moodys\.com/i },
  { family: 10, name: "International benchmark / rating", pattern: /spglobal\.com/i },
  { family: 10, name: "International benchmark / rating", pattern: /weforum\.org/i },
  { family: 10, name: "International benchmark / rating", pattern: /unctad\.org/i },
  // Transparency International Canada is the Canadian chapter of an
  // international transparency NGO; its CPI ranking is the international
  // governance benchmark. Added v5.65.
  { family: 10, name: "International benchmark / rating", pattern: /transparencycanada\.ca/i },

  // Family 11: Industry / sector association. These can be useful challenge
  // or context sources, but are not counted as independent challenge by default.
  { family: 11, name: "Industry / sector association", pattern: /cfib-fcei\.ca/i },
  { family: 11, name: "Industry / sector association", pattern: /retailcouncil\.org/i },
  { family: 11, name: "Industry / sector association", pattern: /canadacode\.org/i },
  // CHBA is the Canadian Home Builders' Association industry body; its
  // HMI publishes builder confidence and starts data from the supply
  // side. Added v5.65 as Housing Supply ground-truth source.
  { family: 11, name: "Industry / sector association", pattern: /chba\.ca/i },
];

// Metric source-label classifier. Some dimensions cite sources by short
// label rather than URL (e.g., source: "pbo"). Maps to the same family
// numbering as the URL classifier.
const METRIC_LABEL_TO_FAMILY = {
  pmo: 1,
  liberal: 1,
  "finance-canada": 2,
  "global-affairs-canada": 2,
  "government-of-canada": 2,
  "housing-infrastructure-canada": 2,
  "treasury-board-secretariat": 2,
  eccc: 2,
  statcan: 3,
  cmhc: 3,
  ircc: 3,
  cer: 4,
  pbo: 4,
  oag: 4,
  legisinfo: 5,
  cci: 7,
  cfib: 11,
  iisd: 7,
  "policy-options": 7,
  dalhousie: 9,
  proof: 9,
  oecd: 10,
  nato: 10,
  imf: 10,
  // Editor / manual classifications — no external source
  manual: 0,
  editorial: 0,
};

const FAMILY_LABELS = {
  1: "1. PMO / Carney messaging",
  2: "2. Department / press release",
  3: "3. Operational govt data",
  4: "4. Independent official / watchdog",
  5: "5. Procedural parliamentary records",
  6: "6. Parliamentary committee / critique",
  7: "7. Policy institute",
  8: "8. Journalism",
  9: "9. Academic / research / pollsters",
  10: "10. International benchmark / rating",
  11: "11. Industry / sector association",
  0: "0. Unclassified",
};

// Threshold-defining bodies per dimension. If a family-10 source on this
// dimension matches the threshold body, it does NOT count as independent
// challenge — it's the rule the dashboard measures against.
const THRESHOLD_SOURCES = {
  "defence-trade": [/nato\.int/i, /^nato$/i], // NATO 2% target
  // Add other dimensions here if their thresholds are externally defined
  // by a family-10 body. Currently only Defence & Trade has this pattern.
};

function classifyUrl(url) {
  if (!url || typeof url !== "string") return 0;
  for (const rule of FAMILY_RULES) {
    if (rule.pattern.test(url)) return rule.family;
  }
  return 0;
}

function classifyMetricLabel(label) {
  if (!label) return 0;
  return METRIC_LABEL_TO_FAMILY[label.toLowerCase()] ?? 0;
}

// Independent challenge = families 4, 6, 7, 8 (watchdog, parliamentary
// critique, policy institute, journalism), family 9 (academic / research),
// plus family 10 EXCEPT when it's a threshold-defining body for this dimension.
function isIndependentChallenge(family, sourceIdentifier, dimensionId) {
  if (family === 4 || family === 6 || family === 7 || family === 8) return true;
  if (family === 10) {
    const thresholdPatterns = THRESHOLD_SOURCES[dimensionId] || [];
    for (const p of thresholdPatterns) {
      if (p.test(sourceIdentifier || "")) return false;
    }
    return true;
  }
  // Family 5 (procedural) and family 11 (industry / sector association) are
  // explicitly NOT independent challenge by default.
  // Family 9 (academic) — debatable. Treat as independent challenge for now.
  if (family === 9) return true;
  return false;
}

// --- Data collectors ---

function collectAllSources(dim) {
  const out = [];
  for (const s of dim.sources || []) {
    if (s.url) out.push({ url: s.url, label: s.label || "(no label)", origin: "sources" });
  }
  for (const t of dim.gradeTriggers?.up || []) {
    if (t.sourceUrl) out.push({ url: t.sourceUrl, label: t.sourceLabel || "(no label)", origin: "trigger.up" });
    // v5.64 introduced trigger.additionalSources as a structured way to
    // thread cross-ideological challenge sources into specific triggers.
    // Closed v5.66: the collector now reads them so the audit can see the
    // threading layer the dimension drawer renders to readers.
    for (const a of t.additionalSources || []) {
      if (a.url) out.push({ url: a.url, label: a.label || "(no label)", origin: "trigger.up.additionalSources" });
    }
  }
  for (const t of dim.gradeTriggers?.down || []) {
    if (t.sourceUrl) out.push({ url: t.sourceUrl, label: t.sourceLabel || "(no label)", origin: "trigger.down" });
    for (const a of t.additionalSources || []) {
      if (a.url) out.push({ url: a.url, label: a.label || "(no label)", origin: "trigger.down.additionalSources" });
    }
  }
  return out;
}

function collectGradeMovingSources(dim) {
  // Operational rule revised 2026-05-16: a source counts as grade-moving if
  // (a) its URL appears in gradeTriggers.up[].sourceUrl or
  // gradeTriggers.down[].sourceUrl, OR (b) it's attached to a metric in
  // the dimension's metrics[] array via source or sourceRefs (since metric
  // values determine which scoring.threshold band applies).
  // Extended 2026-05-24 (v5.66): also counts trigger.additionalSources[]
  // entries on either up or down, since those are rendered to readers as
  // "independent challenge sources" attached to the trigger and are
  // therefore part of the grade-moving evidence chain a reader can use
  // to challenge or defend the grade.
  const out = [];
  for (const t of dim.gradeTriggers?.up || []) {
    if (t.sourceUrl) out.push({ url: t.sourceUrl, label: t.sourceLabel || "(no label)", origin: "trigger.up", kind: "url" });
    for (const a of t.additionalSources || []) {
      if (a.url) out.push({ url: a.url, label: a.label || "(no label)", origin: `trigger.up.additionalSources: ${(t.text || "").slice(0, 50)}`, kind: "trigger-additional-source" });
    }
  }
  for (const t of dim.gradeTriggers?.down || []) {
    if (t.sourceUrl) out.push({ url: t.sourceUrl, label: t.sourceLabel || "(no label)", origin: "trigger.down", kind: "url" });
    for (const a of t.additionalSources || []) {
      if (a.url) out.push({ url: a.url, label: a.label || "(no label)", origin: `trigger.down.additionalSources: ${(t.text || "").slice(0, 50)}`, kind: "trigger-additional-source" });
    }
  }
  for (const m of dim.metrics || []) {
    if (m.source && m.source !== "manual" && m.source !== "editorial") {
      out.push({ url: null, label: m.source, origin: `metric: ${m.label}`, kind: "metric-label" });
    }
    for (const sourceRef of m.sourceRefs || []) {
      if (sourceRef.url) {
        out.push({
          url: sourceRef.url,
          label: sourceRef.label || "(no label)",
          origin: `metric source: ${m.label}`,
          kind: "metric-source-ref",
        });
      }
    }
  }
  return out;
}

function familyForSource(s) {
  // URL-based classification first; fall back to metric-label classification.
  if (s.url) return classifyUrl(s.url);
  if (s.label) return classifyMetricLabel(s.label);
  return 0;
}

function familyDistribution(sources) {
  const counts = {};
  for (const s of sources) {
    const fam = familyForSource(s);
    counts[fam] = (counts[fam] || 0) + 1;
  }
  return counts;
}

function concentrationPct(counts, total) {
  if (total === 0) return null;
  let maxFam = null;
  let maxPct = 0;
  for (const [fam, count] of Object.entries(counts)) {
    const pct = count / total;
    if (pct > maxPct) {
      maxPct = pct;
      maxFam = parseInt(fam, 10);
    }
  }
  return { family: maxFam, pct: maxPct };
}

function isPressReleaseUrl(url) {
  if (!url) return false;
  return /pm\.gc\.ca/i.test(url) || /canada\.ca\/en\/[a-z-]+\/news\//i.test(url);
}

// --- Per-section auditors ---

function auditSourceFamily(dim) {
  const all = collectAllSources(dim);
  const gradeMoving = collectGradeMovingSources(dim);

  const allCounts = familyDistribution(all);
  const gmCounts = familyDistribution(gradeMoving);

  const flags = [];

  // Concentration flag
  const conc = concentrationPct(allCounts, all.length);
  if (conc && conc.pct > 0.6) {
    flags.push(
      `>60% concentration: ${(conc.pct * 100).toFixed(0)}% of all sources in ${FAMILY_LABELS[conc.family] || `family ${conc.family}`}`,
    );
  }

  // Grade-moving claim primarily on press release (URL-based sources only)
  const gmPressReleases = gradeMoving.filter((s) => s.url && isPressReleaseUrl(s.url));
  if (gmPressReleases.length > 0) {
    flags.push(
      `${gmPressReleases.length} of ${gradeMoving.length} grade-moving sources are press releases: ${gmPressReleases.map((s) => s.url).join(", ")}`,
    );
  }

  // No independent challenge source attached to grade-moving claims.
  // Independent challenge = families 4, 6, 7, 8, 9, plus 10 except when
  // family 10 is the threshold-defining body for the dimension.
  if (gradeMoving.length > 0) {
    const hasIndependent = gradeMoving.some((s) => {
      const fam = familyForSource(s);
      const identifier = s.url || s.label || "";
      return isIndependentChallenge(fam, identifier, dim.id);
    });
    if (!hasIndependent) {
      flags.push(
        `No independent challenge source attached to grade-moving claims (no source from families 4, 6, 7, 8, 9, or 10-not-threshold)`,
      );
    }
  }

  // Unclassified URLs (data hygiene warning) — URL-based sources only
  const unclassified = all.filter((s) => s.url && classifyUrl(s.url) === 0);
  if (unclassified.length > 0) {
    flags.push(
      `${unclassified.length} URL(s) could not be classified: ${unclassified.map((s) => s.url).slice(0, 3).join(", ")}${unclassified.length > 3 ? ` ...` : ""}`,
    );
  }

  return { all, gradeMoving, allCounts, gmCounts, flags };
}

function auditTriggerSymmetry(dim) {
  const up = dim.gradeTriggers?.up || [];
  const down = dim.gradeTriggers?.down || [];

  const flags = [];

  // Count balance
  if (Math.abs(up.length - down.length) >= 2) {
    flags.push(`Trigger count imbalance: ${up.length} up vs ${down.length} down`);
  }

  // URL / internalRef / unsourced
  const triggerStats = (triggers, direction) => {
    let withUrl = 0;
    let withInternalRef = 0;
    let unsourced = 0;
    let numericThreshold = 0;
    for (const t of triggers) {
      if (t.sourceUrl) withUrl++;
      else if (t.internalRef) withInternalRef++;
      else unsourced++;
      // Heuristic: does the trigger text contain a number?
      if (/\d/.test(t.text || "")) numericThreshold++;
    }
    return { withUrl, withInternalRef, unsourced, numericThreshold, total: triggers.length };
  };

  const upStats = triggerStats(up, "up");
  const downStats = triggerStats(down, "down");

  // Sourced-vs-unsourced asymmetry
  if (upStats.unsourced > 0 && downStats.unsourced === 0) {
    flags.push(`Asymmetric sourcing: ${upStats.unsourced} of ${up.length} up triggers unsourced (no URL, no internalRef); all down triggers sourced`);
  } else if (downStats.unsourced > 0 && upStats.unsourced === 0) {
    flags.push(`Asymmetric sourcing: ${downStats.unsourced} of ${down.length} down triggers unsourced; all up triggers sourced`);
  }

  // Numeric threshold asymmetry
  if (upStats.total > 0 && downStats.total > 0) {
    const upNumPct = upStats.numericThreshold / upStats.total;
    const downNumPct = downStats.numericThreshold / downStats.total;
    if (Math.abs(upNumPct - downNumPct) >= 0.5) {
      flags.push(
        `Numeric-threshold asymmetry: ${upStats.numericThreshold}/${upStats.total} up triggers contain a number vs ${downStats.numericThreshold}/${downStats.total} down`,
      );
    }
  }

  return { up, down, upStats, downStats, flags };
}

function countWords(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function countUrls(text) {
  if (!text) return 0;
  return (text.match(/https?:\/\/\S+/g) || []).length;
}

function countNamedSources(text) {
  // Heuristic: count capitalized multi-word phrases that look like org names.
  // Examples: "PBO", "C.D. Howe", "Fraser Institute", "IMF", "CMHC"
  if (!text) return 0;
  // Match acronyms (PBO, IMF, etc.) plus Capitalized Words
  const acronyms = text.match(/\b[A-Z]{2,}\b/g) || [];
  const namePhrases =
    text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2}\b/g) || [];
  return acronyms.length + namePhrases.length;
}

function auditCriticsDefenders(dim) {
  const critics = dim.perspectives?.critics || "";
  const defenders = dim.perspectives?.defenders || "";

  const cWords = countWords(critics);
  const dWords = countWords(defenders);
  const cUrls = countUrls(critics);
  const dUrls = countUrls(defenders);
  const cNames = countNamedSources(critics);
  const dNames = countNamedSources(defenders);

  const flags = [];

  if (cWords === 0 || dWords === 0) {
    flags.push(`Missing perspective: critics=${cWords}w, defenders=${dWords}w`);
  } else {
    const ratio = Math.max(cWords, dWords) / Math.min(cWords, dWords);
    if (ratio > 2) {
      flags.push(
        `Length imbalance: critics=${cWords}w vs defenders=${dWords}w (${ratio.toFixed(1)}x)`,
      );
    }
  }

  // Source-specificity imbalance: one side cites named sources, the other doesn't
  if (cWords > 50 && dWords > 50) {
    if (cNames >= 2 && dNames === 0) {
      flags.push(`Source-specificity imbalance: critics cite ${cNames} named source(s); defenders cite none`);
    } else if (dNames >= 2 && cNames === 0) {
      flags.push(`Source-specificity imbalance: defenders cite ${dNames} named source(s); critics cite none`);
    }
  }

  return { cWords, dWords, cUrls, dUrls, cNames, dNames, flags };
}

function auditModifiers(dim) {
  const mods = dim.gradeBasis?.activeModifiers || [];
  return {
    count: mods.length,
    modifiers: mods.map((m) => ({
      name: m.name,
      status: m.status,
      reason: m.reason ? m.reason.slice(0, 120) + (m.reason.length > 120 ? "..." : "") : "",
    })),
  };
}

function auditAttentionBias(dimensions, changelog) {
  // Count real grade movements per dimension (from !== to) in the last 6 months
  // and ever.
  const cutoffSixMonths = new Date();
  cutoffSixMonths.setMonth(cutoffSixMonths.getMonth() - 6);

  const movements = {};
  for (const dim of dimensions) {
    movements[dim.id] = { last6mo: 0, ever: 0, lastDate: null };
  }

  for (const entry of changelog) {
    const date = entry.date ? new Date(entry.date) : null;
    for (const item of entry.items || []) {
      if (item.type !== "grade") continue;
      if (item.from === item.to) continue; // cosmetic re-grade — skip
      const dimId = item.dimensionId;
      if (!movements[dimId]) continue;
      movements[dimId].ever++;
      if (date && date >= cutoffSixMonths) movements[dimId].last6mo++;
      if (!movements[dimId].lastDate || (date && date > new Date(movements[dimId].lastDate))) {
        movements[dimId].lastDate = entry.date;
      }
    }
  }

  // Determine cycle date from meta.json
  let cycleDate = new Date();
  try {
    const meta = JSON.parse(fs.readFileSync(META_PATH, "utf8"));
    if (meta.lastUpdated) cycleDate = new Date(meta.lastUpdated);
  } catch (e) {
    // fall back to current date
  }

  const flags = [];
  for (const dim of dimensions) {
    const m = movements[dim.id];
    const dimLastUpdated = dim.lastUpdated ? new Date(dim.lastUpdated) : null;

    // lastUpdated 3+ months older than cycle date
    if (dimLastUpdated) {
      const monthsStale = (cycleDate - dimLastUpdated) / (1000 * 60 * 60 * 24 * 30);
      if (monthsStale >= 3) {
        flags.push(
          `[${dim.id}] lastUpdated ${dim.lastUpdated} is ${monthsStale.toFixed(1)} months older than cycle date ${cycleDate.toISOString().slice(0, 10)}`,
        );
      }
    }
  }

  // Cross-dimension: any peer has 3+ movements?
  const anyPeerActive = Object.values(movements).some((m) => m.last6mo >= 3);
  if (anyPeerActive) {
    for (const dim of dimensions) {
      const m = movements[dim.id];
      if (m.last6mo === 0) {
        flags.push(`[${dim.id}] zero grade movements in last 6 months while peer dimensions had 3+`);
      }
    }
  }

  return { movements, flags };
}

// --- Report formatting ---

function pad(s, n) {
  s = String(s);
  return s.length >= n ? s : s + " ".repeat(n - s.length);
}

function formatSection1(dim, audit) {
  const lines = [];
  lines.push(`## ${dim.name} (${dim.id})`);
  lines.push(`Total cited sources: ${audit.all.length}`);
  lines.push(`Grade-moving sources: ${audit.gradeMoving.length}`);
  lines.push("");
  lines.push("All-sources family distribution:");
  const allFams = Object.keys(audit.allCounts).map(Number).sort((a, b) => a - b);
  for (const fam of allFams) {
    const count = audit.allCounts[fam];
    const pct = ((count / audit.all.length) * 100).toFixed(0);
    lines.push(`  ${pad(FAMILY_LABELS[fam] || `family ${fam}`, 42)} ${count} (${pct}%)`);
  }
  if (audit.gradeMoving.length > 0) {
    lines.push("");
    lines.push("Grade-moving family distribution:");
    const gmFams = Object.keys(audit.gmCounts).map(Number).sort((a, b) => a - b);
    for (const fam of gmFams) {
      const count = audit.gmCounts[fam];
      const pct = ((count / audit.gradeMoving.length) * 100).toFixed(0);
      lines.push(`  ${pad(FAMILY_LABELS[fam] || `family ${fam}`, 42)} ${count} (${pct}%)`);
    }
  }
  lines.push("");
  if (audit.flags.length === 0) {
    lines.push("FLAGS: none");
  } else {
    lines.push("FLAGS:");
    for (const f of audit.flags) lines.push(`  - ${f}`);
  }
  lines.push("");
  return lines.join("\n");
}

function formatSection2(dim, audit) {
  const lines = [];
  lines.push(`## ${dim.name} (${dim.id})`);
  lines.push(
    `Up triggers: ${audit.upStats.total} (${audit.upStats.withUrl} with URL, ${audit.upStats.withInternalRef} with internalRef, ${audit.upStats.unsourced} unsourced; ${audit.upStats.numericThreshold} contain numeric)`,
  );
  lines.push(
    `Down triggers: ${audit.downStats.total} (${audit.downStats.withUrl} with URL, ${audit.downStats.withInternalRef} with internalRef, ${audit.downStats.unsourced} unsourced; ${audit.downStats.numericThreshold} contain numeric)`,
  );
  lines.push("");
  lines.push("Up triggers:");
  for (const t of audit.up) {
    lines.push(`  - ${(t.text || "(no text)").slice(0, 100)}`);
  }
  lines.push("Down triggers:");
  for (const t of audit.down) {
    lines.push(`  - ${(t.text || "(no text)").slice(0, 100)}`);
  }
  lines.push("");
  if (audit.flags.length === 0) {
    lines.push("FLAGS: none");
  } else {
    lines.push("FLAGS:");
    for (const f of audit.flags) lines.push(`  - ${f}`);
  }
  lines.push("");
  return lines.join("\n");
}

function formatSection3(dim, audit) {
  const lines = [];
  lines.push(`## ${dim.name} (${dim.id})`);
  lines.push(`Critics: ${audit.cWords} words, ${audit.cUrls} URLs, ${audit.cNames} named-source mentions`);
  lines.push(`Defenders: ${audit.dWords} words, ${audit.dUrls} URLs, ${audit.dNames} named-source mentions`);
  lines.push("");
  if (audit.flags.length === 0) {
    lines.push("FLAGS: none");
  } else {
    lines.push("FLAGS:");
    for (const f of audit.flags) lines.push(`  - ${f}`);
  }
  lines.push("");
  return lines.join("\n");
}

function formatSection5(dim, audit) {
  const lines = [];
  lines.push(`## ${dim.name} (${dim.id})`);
  if (audit.count === 0) {
    lines.push("No active modifiers.");
  } else {
    lines.push(`${audit.count} active modifier(s):`);
    for (const m of audit.modifiers) {
      lines.push(`  - ${m.name} (${m.status}): ${m.reason}`);
    }
  }
  lines.push("");
  return lines.join("\n");
}

function formatSection6(dimensions, audit) {
  const lines = [];
  lines.push("Grade-movement counts (real movements only, from != to):");
  for (const dim of dimensions) {
    const m = audit.movements[dim.id];
    const isTracker = dim.excludeFromGPA ? " [TRACKER]" : "";
    lines.push(
      `  ${pad(dim.id, 25)} last 6mo: ${m.last6mo}  ever: ${m.ever}  last: ${m.lastDate || "(never)"}${isTracker}`,
    );
  }
  lines.push("");
  if (audit.flags.length === 0) {
    lines.push("FLAGS: none");
  } else {
    lines.push("FLAGS:");
    for (const f of audit.flags) lines.push(`  - ${f}`);
  }
  lines.push("");
  return lines.join("\n");
}

// --- Main ---

function main() {
  const dimensions = JSON.parse(fs.readFileSync(DIMENSIONS_PATH, "utf8"));
  const changelog = JSON.parse(fs.readFileSync(CHANGELOG_PATH, "utf8"));

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const now = new Date().toISOString().replace("T", " ").slice(0, 16);
  const out = [];
  out.push("================================================================");
  out.push("BIAS-RESISTANCE AUDIT — RAW DATA (Phase 1, operational)");
  out.push("================================================================");
  out.push(`Generated: ${now}`);
  out.push(`Source: scripts/audit-bias-resistance.mjs`);
  out.push(`Dimensions audited: ${dimensions.length}`);
  out.push("");
  out.push("This output is mechanical. The editor copies sections into");
  out.push("docs/Bias-Resistance-Audit-2026-05.md and adds judgment.");
  out.push("");

  // Section 1
  out.push("================================================================");
  out.push("SECTION 1 — Source-family distribution per dimension");
  out.push("================================================================");
  out.push("");
  const section1Results = [];
  for (const dim of dimensions) {
    const a = auditSourceFamily(dim);
    section1Results.push({ dim, audit: a });
    out.push(formatSection1(dim, a));
  }

  // Section 2
  out.push("================================================================");
  out.push("SECTION 2 — Trigger symmetry per dimension");
  out.push("================================================================");
  out.push("");
  const section2Results = [];
  for (const dim of dimensions) {
    const a = auditTriggerSymmetry(dim);
    section2Results.push({ dim, audit: a });
    out.push(formatSection2(dim, a));
  }

  // Section 3
  out.push("================================================================");
  out.push("SECTION 3 — Critics/defenders symmetry per dimension");
  out.push("================================================================");
  out.push("");
  const section3Results = [];
  for (const dim of dimensions) {
    const a = auditCriticsDefenders(dim);
    section3Results.push({ dim, audit: a });
    out.push(formatSection3(dim, a));
  }

  // Section 5 (Modifier inventory)
  out.push("================================================================");
  out.push("SECTION 5 — Modifier inventory per dimension");
  out.push("================================================================");
  out.push("");
  for (const dim of dimensions) {
    const a = auditModifiers(dim);
    out.push(formatSection5(dim, a));
  }

  // Section 6 (Attention bias)
  out.push("================================================================");
  out.push("SECTION 6 — Update-cadence / attention-bias check");
  out.push("================================================================");
  out.push("");
  const section6Result = auditAttentionBias(dimensions, changelog);
  out.push(formatSection6(dimensions, section6Result));

  // Summary
  out.push("================================================================");
  out.push("SUMMARY — Flagged dimensions across all sections");
  out.push("================================================================");
  out.push("");
  const flaggedByDim = {};
  for (const dim of dimensions) flaggedByDim[dim.id] = [];

  for (const r of section1Results) {
    if (r.audit.flags.length > 0) flaggedByDim[r.dim.id].push(...r.audit.flags.map((f) => `[S1] ${f}`));
  }
  for (const r of section2Results) {
    if (r.audit.flags.length > 0) flaggedByDim[r.dim.id].push(...r.audit.flags.map((f) => `[S2] ${f}`));
  }
  for (const r of section3Results) {
    if (r.audit.flags.length > 0) flaggedByDim[r.dim.id].push(...r.audit.flags.map((f) => `[S3] ${f}`));
  }
  // Section 6 flags reference dimensions by id in the flag text
  for (const f of section6Result.flags) {
    const match = f.match(/^\[([a-z-]+)\]/);
    if (match && flaggedByDim[match[1]]) {
      flaggedByDim[match[1]].push(`[S6] ${f.replace(/^\[[a-z-]+\]\s*/, "")}`);
    }
  }

  for (const dim of dimensions) {
    const flags = flaggedByDim[dim.id];
    if (flags.length === 0) continue;
    out.push(`## ${dim.id}`);
    for (const f of flags) out.push(`  - ${f}`);
    out.push("");
  }

  const cleanCount = dimensions.filter((d) => flaggedByDim[d.id].length === 0).length;
  out.push(`Dimensions with no flags: ${cleanCount} / ${dimensions.length}`);
  out.push(`Dimensions with at least one flag: ${dimensions.length - cleanCount}`);
  out.push("");

  fs.writeFileSync(OUTPUT_PATH, out.join("\n"));
  console.log(`Wrote ${OUTPUT_PATH}`);
  console.log(`Dimensions audited: ${dimensions.length}`);
  console.log(`Dimensions flagged: ${dimensions.length - cleanCount}`);
}

main();

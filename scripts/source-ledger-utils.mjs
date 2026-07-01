import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export const RESULT_VALUES = new Set([
  "OK",
  "new release found",
  "updated dashboard",
  "link broken",
  "blocked",
  "no event observed",
  "not due",
  "not checked",
]);

export function normalizeUrl(url) {
  const text = String(url || "").trim();
  if (!/^https?:\/\//i.test(text)) return "";
  return text.replace(/\/+$/, "");
}

export function loadJson(repoRoot, relativePath) {
  return JSON.parse(readFileSync(resolve(repoRoot, relativePath), "utf8"));
}

function titleFromPromise(promise) {
  return promise.title || promise.promise || promise.text || promise.name || "Untitled promise";
}

function metricLabel(metric) {
  return metric.label || metric.name || metric.id || "Unnamed metric";
}

function addEntry(entries, entry) {
  if (!entry.url) return;
  entries.push({
    ...entry,
    normalizedUrl: normalizeUrl(entry.url),
  });
}

export function extractDimensionCitationEntries(dimensions) {
  const entries = [];

  for (const dim of dimensions) {
    for (const source of dim.sources || []) {
      addEntry(entries, {
        area: dim.name,
        dimensionId: dim.id,
        field: "sources[].url",
        label: `${dim.name}: ${source.label || "source"}`,
        url: source.url,
      });
    }

    for (const side of ["up", "down"]) {
      for (const trigger of dim.gradeTriggers?.[side] || []) {
        addEntry(entries, {
          area: dim.name,
          dimensionId: dim.id,
          field: `gradeTriggers.${side}[].sourceUrl`,
          label: `${dim.name}: ${side} trigger - ${trigger.sourceLabel || trigger.text}`,
          url: trigger.sourceUrl,
        });

        for (const source of trigger.additionalSources || []) {
          addEntry(entries, {
            area: dim.name,
            dimensionId: dim.id,
            field: `gradeTriggers.${side}[].additionalSources[].url`,
            label: `${dim.name}: ${side} trigger challenge - ${source.label || trigger.text}`,
            url: source.url,
          });
        }
      }
    }

    for (const metric of dim.metrics || []) {
      for (const source of metric.sourceRefs || []) {
        addEntry(entries, {
          area: dim.name,
          dimensionId: dim.id,
          field: "metrics[].sourceRefs[].url",
          label: `${dim.name}: metric - ${metricLabel(metric)} - ${source.label || "source ref"}`,
          url: source.url,
        });
      }
    }

    for (const project of dim.projectCohort?.projects || []) {
      addEntry(entries, {
        area: dim.name,
        dimensionId: dim.id,
        field: "projectCohort.projects[].sourceUrl",
        label: `${dim.name}: project - ${project.name || "project"}`,
        url: project.sourceUrl,
      });
    }

    for (const promise of dim.promises || []) {
      const title = titleFromPromise(promise);
      addEntry(entries, {
        area: dim.name,
        dimensionId: dim.id,
        field: "promises[].originalSourceUrl",
        label: `${dim.name}: promise original - ${title}`,
        url: promise.originalSourceUrl,
      });
      addEntry(entries, {
        area: dim.name,
        dimensionId: dim.id,
        field: "promises[].statusSourceUrl",
        label: `${dim.name}: promise status - ${title}`,
        url: promise.statusSourceUrl,
      });
    }
  }

  return entries.filter((entry) => entry.normalizedUrl);
}

export function extractApprovalCitationEntries(approvalPolls) {
  const entries = [];

  for (const poll of approvalPolls.polls || []) {
    addEntry(entries, {
      area: "Approval Signal",
      dimensionId: "approval-signal",
      field: "approval.polls[].sourceUrl",
      label: `Approval Signal: ${poll.pollster || "poll"} ${poll.fieldStart || ""}-${poll.fieldEnd || ""}`.trim(),
      url: poll.sourceUrl,
    });
  }

  for (const poll of approvalPolls.preferredPM?.polls || []) {
    addEntry(entries, {
      area: "Approval Signal",
      dimensionId: "approval-signal",
      field: "approval.preferredPM.polls[].sourceUrl",
      label: `Approval Signal: preferred PM - ${poll.pollster || "poll"} ${poll.fieldEnd || ""}`.trim(),
      url: poll.sourceUrl,
    });
  }

  return entries.filter((entry) => entry.normalizedUrl);
}

export function extractCitationEntries(repoRoot) {
  const dimensions = loadJson(repoRoot, "src/data/dimensions.json");
  const approvalPolls = loadJson(repoRoot, "src/data/approval-polls.json");
  return [
    ...extractDimensionCitationEntries(dimensions),
    ...extractApprovalCitationEntries(approvalPolls),
  ];
}

export function uniqueUrls(entries) {
  const seen = new Set();
  return entries.filter((entry) => {
    if (seen.has(entry.normalizedUrl)) return false;
    seen.add(entry.normalizedUrl);
    return true;
  });
}

export function extractUrlsFromMarkdownCell(cell) {
  const urls = [];
  const text = String(cell || "").replace(/\\\|/g, "|");
  const pattern = /https?:\/\/[^\s`|)]+/gi;
  for (const match of text.matchAll(pattern)) {
    urls.push(normalizeUrl(match[0]));
  }
  return urls.filter(Boolean);
}

export function parseLedgerRows(markdown) {
  const rows = [];
  const lines = markdown.split(/\r?\n/);

  for (const line of lines) {
    if (!line.startsWith("|")) continue;
    const cells = line
      .slice(1, line.endsWith("|") ? -1 : undefined)
      .split(/(?<!\\)\|/)
      .map((cell) => cell.trim());
    if (cells.length < 8) continue;
    if (cells[0] === "Source / item" || /^-+$/.test(cells[0])) continue;
    rows.push({
      source: cells[0],
      area: cells[1],
      urlCell: cells[2],
      cadence: cells[3],
      dateChecked: cells[4],
      result: cells[5],
      action: cells[6],
      notes: cells[7],
      urls: extractUrlsFromMarkdownCell(cells[2]),
    });
  }

  return rows;
}

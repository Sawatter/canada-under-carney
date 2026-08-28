import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const repoUrl = new URL("../", import.meta.url);
const dimensions = JSON.parse(
  readFileSync(new URL("src/data/dimensions.json", repoUrl), "utf8"),
);
const ledger = readFileSync(
  new URL("docs/Source-Coverage-Ledger-2026-08.md", repoUrl),
  "utf8",
);
const decisionPacket = readFileSync(
  new URL("docs/Major-Projects-Threshold-Decision-Packet-2026-08.md", repoUrl),
  "utf8",
);
const sourceAuthorityMap = readFileSync(
  new URL("docs/Source-Authority-Map.md", repoUrl),
  "utf8",
);

const countWords = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen",
  "eighteen", "nineteen", "twenty",
];
const augustSnapshot = Object.freeze({
  asOf: "2026-07-31",
  total: 18,
  count: 5,
  countWord: "five",
  percent: 28,
  projectNames: Object.freeze([
    "Contrec\u0153ur Terminal Container Project",
    "Red Chris Copper and Gold Mine",
    "North Coast Transmission Line",
    "Crawford Nickel Project",
    "Matawinie Graphite Mine",
  ]),
});

function findRow(markdown, label) {
  return markdown.split("\n").find((line) => line.startsWith(`| ${label} |`)) ?? "";
}

function validateCurrentClaims({ ledgerText, packetText, sourceMapText, datedExpected, liveExpected }) {
  const failures = [];
  const requireText = (text, fragment, label) => {
    if (!text.includes(fragment)) failures.push(`${label}: missing ${JSON.stringify(fragment)}`);
  };

  const monthlyRow = findRow(ledgerText, "Major Projects Office list");
  const touchedRow = findRow(ledgerText, "Major Projects Office national list");
  requireText(
    monthlyRow,
    `The official denominator is ${datedExpected.total}; ${datedExpected.countWord} projects show post-referral advancement`,
    "monthly Major Projects ledger row",
  );
  requireText(
    touchedRow,
    `All ${datedExpected.total} listed projects and stages reviewed; ${datedExpected.countWord} show post-referral progress`,
    "touched Major Projects ledger row",
  );

  const checklistMarker = "## Execution checklist, if the editor says yes to Option 1";
  const checklistStart = packetText.indexOf(checklistMarker);
  if (checklistStart < 0) {
    failures.push("decision packet: completed-copy section is missing");
    return failures;
  }
  const completedCopySection = packetText.slice(checklistStart);
  requireText(
    completedCopySection,
    `whyNotHigher\` now says ${datedExpected.countWord} of ${datedExpected.total}, about ${datedExpected.percent}%`,
    "decision packet whyNotHigher correction",
  );
  requireText(
    completedCopySection,
    `current C-grade status is already corrected to say that ${datedExpected.countWord} of ${datedExpected.total} show documented progress after referral`,
    "decision packet status correction",
  );
  requireText(
    completedCopySection,
    `current C-grade copy is already corrected to say that ${datedExpected.countWord} projects show documented progress after referral`,
    "decision packet verdict correction",
  );
  requireText(
    completedCopySection,
    `now use ${datedExpected.countWord} of ${datedExpected.total}, about ${datedExpected.percent}%, and name the ${datedExpected.countWord} counted projects`,
    "decision packet completed correction",
  );

  const namesClaim = completedCopySection
    .split("\n")
    .find((line) => line.includes("whyNotLower\` names")) ?? "";
  for (const projectName of datedExpected.projectNames) {
    const identifyingPrefix = projectName.split(" ").slice(0, 2).join(" ");
    requireText(namesClaim, identifyingPrefix, `decision packet counted project ${projectName}`);
  }

  const currentStateClaim = sourceMapText
    .split("\n")
    .find((line) => line.includes("live `projectCohort` field")) ?? "";
  requireText(
    currentStateClaim,
    `${liveExpected.total} projects listed by the MPO through ${liveExpected.asOf}`,
    "source authority current cohort total and date",
  );
  requireText(
    currentStateClaim,
    `current record shows ${liveExpected.aboveDesignated} projects above designated status`,
    "source authority current above-designated count",
  );
  requireText(
    currentStateClaim,
    `${liveExpected.countWord[0].toUpperCase()}${liveExpected.countWord.slice(1)} of ${liveExpected.total}, about ${liveExpected.percent}%, show documented post-referral advancement`,
    "source authority current post-referral count",
  );

  return failures;
}

const majorProjects = dimensions.find((dimension) => dimension.id === "major-projects");
assert.ok(majorProjects?.projectCohort?.projects, "major-projects cohort is missing");

const projects = majorProjects.projectCohort.projects;
const stageOrder = new Map(
  majorProjects.projectCohort.stageGates.map((stage, index) => [stage.key, index]),
);
const designatedIndex = stageOrder.get("designated");
assert.equal(designatedIndex, 0, "designated must remain the first project stage");
const laterDatedProjects = projects.filter(
  (project) => project.stageDate > project.referredDate,
);
const liveExpected = {
  asOf: majorProjects.projectCohort.asOf,
  total: projects.length,
  aboveDesignated: projects.filter(
    (project) => stageOrder.get(project.stage) > designatedIndex,
  ).length,
  count: laterDatedProjects.length,
  countWord: countWords[laterDatedProjects.length],
  percent: Math.round((laterDatedProjects.length / projects.length) * 100),
  projectNames: laterDatedProjects.map((project) => project.name),
};
assert.ok(liveExpected.countWord, `no count word for ${liveExpected.count}`);
if (liveExpected.asOf === augustSnapshot.asOf) {
  assert.deepEqual(
    {
      asOf: liveExpected.asOf,
      total: liveExpected.total,
      count: liveExpected.count,
      countWord: liveExpected.countWord,
      percent: liveExpected.percent,
      projectNames: liveExpected.projectNames,
    },
    augustSnapshot,
    "the immutable August snapshot must match the cohort at its asOf date",
  );
}

const failures = validateCurrentClaims({
  ledgerText: ledger,
  packetText: decisionPacket,
  sourceMapText: sourceAuthorityMap,
  datedExpected: augustSnapshot,
  liveExpected,
});
assert.deepEqual(failures, [], failures.join("\n"));

const staleWord = "four";
const staleLedger = ledger.replaceAll(augustSnapshot.countWord, staleWord);
const stalePacket = decisionPacket.replaceAll(augustSnapshot.countWord, staleWord);
const wrongLiveCount = liveExpected.count === 4 ? 5 : 4;
const wrongLiveCountWord = countWords[wrongLiveCount];
const staleSourceMap = sourceAuthorityMap.replaceAll(
  `${liveExpected.countWord[0].toUpperCase()}${liveExpected.countWord.slice(1)} of ${liveExpected.total}`,
  `${wrongLiveCountWord[0].toUpperCase()}${wrongLiveCountWord.slice(1)} of ${liveExpected.total}`,
);
assert.ok(
  validateCurrentClaims({
    ledgerText: staleLedger,
    packetText: decisionPacket,
    sourceMapText: sourceAuthorityMap,
    datedExpected: augustSnapshot,
    liveExpected,
  }).length > 0,
  "negative fixture: changing the ledger count from five to four must fail",
);
assert.ok(
  validateCurrentClaims({
    ledgerText: ledger,
    packetText: stalePacket,
    sourceMapText: sourceAuthorityMap,
    datedExpected: augustSnapshot,
    liveExpected,
  }).length > 0,
  "negative fixture: changing the completed-copy count from five to four must fail",
);
assert.ok(
  validateCurrentClaims({
    ledgerText: ledger,
    packetText: decisionPacket,
    sourceMapText: staleSourceMap,
    datedExpected: augustSnapshot,
    liveExpected,
  }).length > 0,
  "negative fixture: changing the source-authority count must fail",
);

const historicalRecord = "\n## Historical correction records\n\n- Historical correction: four projects was corrected to five.\n";
assert.deepEqual(
  validateCurrentClaims({
    ledgerText: ledger + historicalRecord,
    packetText: decisionPacket + historicalRecord,
    sourceMapText: sourceAuthorityMap + historicalRecord,
    datedExpected: augustSnapshot,
    liveExpected,
  }),
  [],
  "explicitly labelled historical correction records must not fail current-claim checks",
);

console.log(
  `OK. Dated August docs match the ${augustSnapshot.asOf} snapshot: ${augustSnapshot.count} of ${augustSnapshot.total}.`,
);
console.log(
  `OK. Active Source Authority Map matches live ${liveExpected.asOf} data: ${liveExpected.count} of ${liveExpected.total}.`,
);
console.log("OK. Negative four-project fixtures fail, and labelled historical records are ignored.");

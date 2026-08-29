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

const historicalCorrectionHeading = /^Historical correction record(?:\s*:\s*.+)?$/i;
const executionChecklistHeading = "Execution checklist, if the editor says yes to Option 1";
const followupsHeading = "Followups regardless of which option is chosen";

function parseHeading(line) {
  const match = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
  if (!match) return null;
  return { depth: match[1].length, text: match[2] };
}

function withoutHistoricalCorrectionSections(markdown) {
  const activeLines = [];
  let historicalDepth = null;

  for (const line of markdown.split("\n")) {
    const heading = parseHeading(line);
    if (heading) {
      if (historicalDepth !== null && heading.depth <= historicalDepth) {
        historicalDepth = null;
      }
      if (historicalDepth === null && historicalCorrectionHeading.test(heading.text)) {
        historicalDepth = heading.depth;
      }
    }

    if (historicalDepth === null) activeLines.push(line);
  }

  return activeLines.join("\n");
}

function findHeadingSections(markdown, expectedHeading) {
  const lines = markdown.split("\n");
  const sections = [];

  for (let start = 0; start < lines.length; start += 1) {
    const heading = parseHeading(lines[start]);
    if (!heading || heading.text !== expectedHeading) continue;

    let end = start + 1;
    while (end < lines.length) {
      const nextHeading = parseHeading(lines[end]);
      if (nextHeading && nextHeading.depth <= heading.depth) break;
      end += 1;
    }
    sections.push(lines.slice(start, end).join("\n"));
  }

  return sections;
}

function findRows(markdown, label) {
  return markdown.split("\n").filter((line) => line.startsWith(`| ${label} |`));
}

function validateCurrentClaims({ ledgerText, packetText, sourceMapText, datedExpected, liveExpected }) {
  const failures = [];
  const requireText = (text, fragment, label) => {
    if (!text.includes(fragment)) failures.push(`${label}: missing ${JSON.stringify(fragment)}`);
  };

  const activeLedgerText = withoutHistoricalCorrectionSections(ledgerText);
  const activePacketText = withoutHistoricalCorrectionSections(packetText);
  const activeSourceMapText = withoutHistoricalCorrectionSections(sourceMapText);
  const monthlyRows = findRows(activeLedgerText, "Major Projects Office list");
  const touchedRows = findRows(activeLedgerText, "Major Projects Office national list");
  if (monthlyRows.length !== 1) {
    failures.push(`monthly Major Projects ledger row: expected 1 active row, found ${monthlyRows.length}`);
  }
  if (touchedRows.length !== 1) {
    failures.push(`touched Major Projects ledger row: expected 1 active row, found ${touchedRows.length}`);
  }
  const monthlyRow = monthlyRows[0] ?? "";
  const touchedRow = touchedRows[0] ?? "";
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

  const completedCopySections = findHeadingSections(
    activePacketText,
    executionChecklistHeading,
  );
  if (completedCopySections.length !== 1) {
    failures.push(
      `decision packet: expected 1 active completed-copy section, found ${completedCopySections.length}`,
    );
  }
  if (completedCopySections.length === 0) {
    return failures;
  }
  const completedCopySection = completedCopySections[0];
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

  const followupSections = findHeadingSections(activePacketText, followupsHeading);
  if (followupSections.length !== 1) {
    failures.push(
      `decision packet: expected 1 active followups section, found ${followupSections.length}`,
    );
  }
  requireText(
    followupSections[0] ?? "",
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

  const currentStateClaims = activeSourceMapText
    .split("\n")
    .filter((line) => line.includes("live `projectCohort` field"));
  if (currentStateClaims.length !== 1) {
    failures.push(
      `source authority current cohort claim: expected 1 active claim, found ${currentStateClaims.length}`,
    );
  }
  const currentStateClaim = currentStateClaims[0] ?? "";
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

const boundedChecklistClaim = `whyNotHigher\` now says ${augustSnapshot.countWord} of ${augustSnapshot.total}, about ${augustSnapshot.percent}%`;
const packetWithMisplacedChecklistClaim = decisionPacket
  .replace(boundedChecklistClaim, "whyNotHigher` omits the current count in this section")
  .replace(
    "## Followups regardless of which option is chosen",
    `## Misplaced checklist claim\n\n${boundedChecklistClaim}\n\n## Followups regardless of which option is chosen`,
  );
assert.notEqual(
  packetWithMisplacedChecklistClaim,
  decisionPacket,
  "bounded-section fixture must change the decision packet",
);
const misplacedChecklistFailures = validateCurrentClaims({
  ledgerText: ledger,
  packetText: packetWithMisplacedChecklistClaim,
  sourceMapText: sourceAuthorityMap,
  datedExpected: augustSnapshot,
  liveExpected,
});
assert.ok(
  misplacedChecklistFailures.some((failure) => (
    failure.startsWith("decision packet whyNotHigher correction:")
  )),
  `a checklist claim moved into a later section must fail:\n${misplacedChecklistFailures.join("\n")}`,
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

const historicalLabel = "Historical correction record";
const currentContinuationMarker = "Current content after the correction record remains active.";
const historicalFixtures = {
  ledger: `
## ${historicalLabel}: superseded August source review

| Source / item | Dashboard area | URL / home | Cadence | Date checked | Result | Action | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Major Projects Office list | Major Projects | https://www.canada.ca/en/privy-council/major-projects-office/projects/national.html | Monthly | 2026-08-14 | updated dashboard | All project pages reviewed | The official denominator is 18; four projects show post-referral advancement, still below the 30% threshold. |
| Major Projects Office national list | Major Projects | https://www.canada.ca/en/privy-council/major-projects-office/projects/national.html | Monthly, touched | 2026-08-14 | updated dashboard | Reviewed during July evidence sweep | All 18 listed projects and stages reviewed; four show post-referral progress. |

## Current source review continuation

${currentContinuationMarker}
`,
  packet: `
## ${historicalLabel}: superseded execution checklist

### Execution checklist, if the editor says yes to Option 1

4. The prior \`whyNotHigher\` said four of 18, about 22%.
5. The prior C-grade status said that four of 18 showed documented progress after referral.
6. The prior C-grade verdict said that four projects showed documented progress after referral.
7. The prior correction note used four of 18, about 22%, and named four counted projects.

## Current decision packet continuation

${currentContinuationMarker}
`,
  sourceMap: `
## ${historicalLabel}: superseded Major Projects source note

The Major Projects entry also carries a live \`projectCohort\` field with the 18 projects listed by the MPO through 2026-07-31. The current record shows 10 projects above designated status. Four of 18, about 22%, show documented post-referral advancement in the recorded cohort data.

## Current source authority continuation

${currentContinuationMarker}
`,
};
for (const [surface, fixture] of Object.entries(historicalFixtures)) {
  assert.ok(
    withoutHistoricalCorrectionSections(fixture).includes(currentContinuationMarker),
    `${surface}: filtering must resume at the current section after a correction record`,
  );
}
assert.deepEqual(
  validateCurrentClaims({
    ledgerText: ledger + historicalFixtures.ledger,
    packetText: decisionPacket + historicalFixtures.packet,
    sourceMapText: sourceAuthorityMap + historicalFixtures.sourceMap,
    datedExpected: augustSnapshot,
    liveExpected,
  }),
  [],
  "realistic stale claims under explicitly labelled historical sections must be ignored",
);

const expectedActiveStaleFailures = [
  "monthly Major Projects ledger row: expected 1 active row, found 2",
  "touched Major Projects ledger row: expected 1 active row, found 2",
  "decision packet: expected 1 active completed-copy section, found 2",
  "source authority current cohort claim: expected 1 active claim, found 2",
];
const unlabelledFixtures = Object.fromEntries(
  Object.entries(historicalFixtures).map(([surface, fixture]) => [
    surface,
    fixture.replace(historicalLabel, "Correction record"),
  ]),
);
const unlabelledFailures = validateCurrentClaims({
  ledgerText: ledger + unlabelledFixtures.ledger,
  packetText: decisionPacket + unlabelledFixtures.packet,
  sourceMapText: sourceAuthorityMap + unlabelledFixtures.sourceMap,
  datedExpected: augustSnapshot,
  liveExpected,
});
assert.deepEqual(
  unlabelledFailures,
  expectedActiveStaleFailures,
  `the same stale claims without a historical label must fail:\n${unlabelledFailures.join("\n")}`,
);

const historicalContextFixtures = Object.fromEntries(
  Object.entries(historicalFixtures).map(([surface, fixture]) => [
    surface,
    fixture.replace(historicalLabel, "Historical context"),
  ]),
);
const historicalContextFailures = validateCurrentClaims({
  ledgerText: ledger + historicalContextFixtures.ledger,
  packetText: decisionPacket + historicalContextFixtures.packet,
  sourceMapText: sourceAuthorityMap + historicalContextFixtures.sourceMap,
  datedExpected: augustSnapshot,
  liveExpected,
});
assert.deepEqual(
  historicalContextFailures,
  expectedActiveStaleFailures,
  `a broad Historical heading must not hide active stale claims:\n${historicalContextFailures.join("\n")}`,
);

console.log(
  `OK. Dated August docs match the ${augustSnapshot.asOf} snapshot: ${augustSnapshot.count} of ${augustSnapshot.total}.`,
);
console.log(
  `OK. Active Source Authority Map matches live ${liveExpected.asOf} data: ${liveExpected.count} of ${liveExpected.total}.`,
);
console.log("OK. Stale active claims fail, while realistic labelled historical records are ignored.");

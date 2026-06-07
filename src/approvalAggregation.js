const DAY_MS = 1000 * 60 * 60 * 24;

export function weightedMean(values, weights) {
  if (values.length === 0) return null;
  let num = 0;
  let den = 0;
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    const w = weights[i];
    if (typeof v !== "number" || typeof w !== "number" || w <= 0) continue;
    num += v * w;
    den += w;
  }
  return den > 0 ? num / den : null;
}

export function recencyWeight(poll, refDate, halfLifeDays) {
  const ageDays =
    (refDate.getTime() - new Date(poll.fieldEnd).getTime()) / DAY_MS;
  if (!(ageDays >= 0)) return 1;
  return Math.pow(0.5, ageDays / halfLifeDays);
}

export function filterByWindow(polls, windowEnd, windowStart) {
  return polls.filter((p) => {
    const end = new Date(p.fieldEnd);
    return end > windowStart && end <= windowEnd;
  });
}

function formatDelta(curr, prior) {
  if (curr === null || prior === null) return null;
  const d = curr - prior;
  const rounded = Math.round(d);
  if (rounded === 0) return "no change";
  return rounded > 0 ? `+${rounded}` : `${rounded}`;
}

function weightedField(polls, field, refDate, halfLifeDays) {
  const values = polls.map((p) => p[field]);
  const weights = polls.map(
    (p) => (p.sampleSize || 0) * recencyWeight(p, refDate, halfLifeDays)
  );
  return weightedMean(values, weights);
}

export function computeApprovalSignal(data) {
  const halfLifeDays = data.halfLifeDays || 30;
  const asOf = new Date(data.asOf);
  const windowDays = data.rollingWindowDays;
  const recentStart = new Date(asOf);
  recentStart.setDate(recentStart.getDate() - windowDays);
  const priorStart = new Date(recentStart);
  priorStart.setDate(priorStart.getDate() - windowDays);

  const recent = filterByWindow(data.polls, asOf, recentStart);
  const prior = filterByWindow(data.polls, recentStart, priorStart);

  const approveNow = weightedField(recent, "approve", asOf, halfLifeDays);
  const disapproveNow = weightedField(recent, "disapprove", asOf, halfLifeDays);
  const approvePrior = weightedField(prior, "approve", recentStart, halfLifeDays);
  const disapprovePrior = weightedField(prior, "disapprove", recentStart, halfLifeDays);

  const net =
    approveNow !== null && disapproveNow !== null
      ? Math.round(approveNow - disapproveNow)
      : null;

  const approveDelta = formatDelta(approveNow, approvePrior);
  const disapproveDelta = formatDelta(disapproveNow, disapprovePrior);
  const pollstersInWindow = Array.from(new Set(recent.map((p) => p.pollster)));

  return {
    asOf: data.asOf,
    windowDays,
    halfLifeDays,
    approveNow,
    disapproveNow,
    net,
    approveDelta,
    disapproveDelta,
    recent,
    prior,
    pollstersInWindow,
  };
}

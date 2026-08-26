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

function releaseSummary(firstLook) {
  if (firstLook.mode === "grade-moves") {
    const count = firstLook.gradeMoveCount || 0;
    return `${count} grade ${count === 1 ? "move" : "moves"} in this release`;
  }

  if (firstLook.mode === "maintenance-only") {
    return "Maintenance-only release";
  }

  if (firstLook.mode === "no-grade-moves") {
    return "No grade moves in this release";
  }

  return firstLook.summary || "Latest release summary";
}

export default function ReleaseUpdate({ latestRelease }) {
  const firstLook = latestRelease?.firstLook || {};
  const featuredItems = Array.isArray(firstLook.featuredItems)
    ? firstLook.featuredItems
    : [];

  return (
    <div className="first-look-update">
      <div className="first-look-block-heading">
        <span>This release</span>
        {latestRelease?.version && (
          <span className="first-look-block-meta">
            v{latestRelease.version}
            {latestRelease.date && (
              <>
                <span aria-hidden="true"> · </span>
                <time dateTime={latestRelease.date}>
                  {formatDate(latestRelease.date)}
                </time>
              </>
            )}
          </span>
        )}
      </div>
      <p className="first-look-update-summary">{releaseSummary(firstLook)}</p>
      {featuredItems.length > 0 && (
        <ul className="first-look-update-list">
          {featuredItems.map((item, index) => (
            <li key={`${item.type || "item"}-${item.itemIndex ?? index}`}>
              {item.headline || item.body}
            </li>
          ))}
        </ul>
      )}
      <a className="first-look-inline-link" href="#view-changelog">
        Read release details
      </a>
    </div>
  );
}

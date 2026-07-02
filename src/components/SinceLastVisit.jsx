import { useEffect, useState } from "react";
import meta from "../data/meta.json";
import changelog from "../data/changelog.json";
import { countGradeItemsSince, parseVersion } from "../sinceLastVisit.js";
import "./SinceLastVisit.css";

// Re-exported so callers can import the pure helper from the component path.
// The logic itself lives in src/sinceLastVisit.js (plain .js, like
// gradeMoves.js) so node test scripts can import it without a JSX transform.
// eslint-disable-next-line react-refresh/only-export-components
export { countGradeItemsSince };

// The only localStorage key this component reads or writes. Client-side
// only: no server fields, no analytics events.
const STORAGE_KEY = "ccc-last-seen-version";

// localStorage.getItem / setItem throw SecurityError when the browser denies
// storage access (Safari private mode on older versions, storage-blocked
// contexts). Without the catch, that error would take down the whole app for
// a strictly optional notice, so the failure mode here is "no notice".
function readLastSeen() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeLastSeen(version) {
  try {
    window.localStorage.setItem(STORAGE_KEY, version);
  } catch {
    // Storage denied: the notice simply reappears next visit.
  }
}

// Decide once, before first paint, whether there is anything to say.
// Read-only: the localStorage write happens in the sync effect below.
function computeNotice() {
  const stored = readLastSeen();
  // First visit, or a stored value that no longer parses.
  if (!parseVersion(stored)) return null;
  // Up to date.
  if (stored === meta.version) return null;
  const count = countGradeItemsSince(changelog, stored, meta.version);
  // Versions moved but no grade changes landed. Also covers a stored
  // version newer than current (count is 0), which self-heals below.
  if (count === 0) return null;
  return { sinceVersion: stored, count };
}

/**
 * A quiet, dismissible one-line notice: how many grade changes landed since
 * the version the reader last saw. Renders nothing on a first visit, when
 * the reader is up to date, or when the versions in between carried no
 * grade changes. Not mounted anywhere yet.
 */
export default function SinceLastVisit({ onOpenChangelog }) {
  const [notice, setNotice] = useState(computeNotice);

  // Sync the stored marker with what the reader has now seen. Whenever no
  // notice is showing (first visit, no grade items since, or just
  // dismissed), record the current version so the line stays quiet until
  // the next grade change.
  useEffect(() => {
    if (notice !== null) return;
    if (readLastSeen() !== meta.version) writeLastSeen(meta.version);
  }, [notice]);

  if (!notice) return null;

  const dismiss = () => setNotice(null);

  const openChangelog = () => {
    setNotice(null);
    onOpenChangelog?.();
  };

  return (
    <div className="since-last-visit">
      <p className="since-last-visit-text">
        Since your last visit (v{notice.sinceVersion}): {notice.count} grade
        change{notice.count === 1 ? "" : "s"}.
      </p>
      <div className="since-last-visit-actions">
        <button
          type="button"
          className="since-last-visit-button"
          onClick={openChangelog}
        >
          See the Change Log
        </button>
        <button
          type="button"
          className="since-last-visit-button"
          onClick={dismiss}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

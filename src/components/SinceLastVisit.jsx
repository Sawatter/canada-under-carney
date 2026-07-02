import { useEffect, useState } from "react";
import meta from "../data/meta.json";
import changelog from "../data/changelog.json";
import { countGradeItemsSince, resolveNoticeState } from "../sinceLastVisit.js";
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
// Branch logic lives in resolveNoticeState (pure, unit-tested); this maps
// its "none" result to null so the render guard stays a simple falsy check.
function computeNotice() {
  const state = resolveNoticeState(readLastSeen(), meta.version, changelog);
  return state === "none" ? null : state;
}

/**
 * A quiet, dismissible one-line notice: how many grade changes landed since
 * the version the reader last saw. Renders nothing on a first visit or when
 * the reader is up to date. When the version moved but no grade changes
 * landed, renders a one-line caught-up state instead: passive reassurance,
 * no controls, shown once per version crossing.
 */
export default function SinceLastVisit({ onOpenChangelog }) {
  const [notice, setNotice] = useState(computeNotice);

  // Sync the stored marker with what the reader has now seen. Whenever no
  // grade-change notice is showing (first visit, caught-up, or just
  // dismissed), record the current version so the line stays quiet until
  // the next version crossing. The caught-up line self-heals here too:
  // it stays up for this page view (React state already holds it) and is
  // gone on the next visit.
  useEffect(() => {
    if (notice !== null && notice !== "caught-up") return;
    if (readLastSeen() !== meta.version) writeLastSeen(meta.version);
  }, [notice]);

  if (!notice) return null;

  if (notice === "caught-up") {
    return (
      <div className="since-last-visit since-last-visit-caught-up">
        <p className="since-last-visit-text">
          You&apos;re caught up. Next scheduled update: {meta.nextUpdate}.
        </p>
      </div>
    );
  }

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

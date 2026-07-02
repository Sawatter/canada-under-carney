// Quiet "Follow updates" block. Presentational only and not mounted anywhere
// yet. The integrator decides placement and styles the follow-updates-*
// classNames. Links are relative (like the feed.xml link in the Dashboard
// footer) so they resolve against the GitHub Pages base path.

export default function FollowUpdates() {
  return (
    <section className="follow-updates" aria-label="Follow updates">
      <h3 className="follow-updates-heading">Follow updates</h3>
      <ul className="follow-updates-list">
        <li className="follow-updates-item">
          <a className="follow-updates-link" href="next-update.ics">
            Add the next update to your calendar (.ics)
          </a>
        </li>
        <li className="follow-updates-item">
          <a className="follow-updates-link" href="feed.xml">
            Subscribe via RSS
          </a>
        </li>
        <li className="follow-updates-item follow-updates-email-note">
          Email updates are on this page under Get notified.
        </li>
      </ul>
    </section>
  );
}

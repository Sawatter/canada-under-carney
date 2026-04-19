import { useState } from "react";

const BUTTONDOWN_USERNAME = "sawatter";
const ACTION_URL = `https://buttondown.com/api/emails/embed-subscribe/${BUTTONDOWN_USERNAME}`;

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    if (!consent || !email) {
      e.preventDefault();
      return;
    }
    setSubmitted(true);
  };

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e0e0e0",
        borderRadius: "10px",
        padding: "16px 18px",
        marginTop: "16px",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          fontWeight: 700,
          color: "#1a3c5e",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          marginBottom: "6px",
        }}
      >
        Get notified when the dashboard updates
      </div>
      <div
        style={{
          fontSize: "12px",
          color: "#666",
          lineHeight: 1.5,
          marginBottom: "10px",
        }}
      >
        Roughly one email per month when grades change or new evidence
        lands. No marketing, no resale, no sharing.
      </div>

      <form
        action={ACTION_URL}
        method="post"
        target="popupwindow"
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "8px" }}
      >
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              flex: "1 1 240px",
              padding: "8px 10px",
              fontSize: "13px",
              border: "1px solid #d0d0d0",
              borderRadius: "6px",
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
          <button
            type="submit"
            disabled={!consent || !email}
            style={{
              padding: "8px 18px",
              fontSize: "13px",
              fontWeight: 700,
              color: "#fff",
              background: !consent || !email ? "#bbb" : "#1a3c5e",
              border: "none",
              borderRadius: "6px",
              cursor: !consent || !email ? "not-allowed" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Subscribe
          </button>
        </div>

        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
            fontSize: "11px",
            color: "#666",
            lineHeight: 1.4,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            style={{ marginTop: "2px" }}
          />
          <span>
            I consent to receive email updates from the Canada Under
            Carney dashboard. I can unsubscribe at any time via the
            link in any email. (Required by Canadian anti-spam law.)
          </span>
        </label>

        {submitted && (
          <div
            style={{
              fontSize: "12px",
              color: "#1a7a3a",
              marginTop: "4px",
            }}
          >
            Thanks &mdash; check your inbox to confirm your subscription.
          </div>
        )}

        <div style={{ fontSize: "10px", color: "#999", marginTop: "4px" }}>
          Powered by Buttondown. Prefer RSS?{" "}
          <a href="feed.xml" style={{ color: "#1a73e8" }}>
            Subscribe via RSS instead &rarr;
          </a>
        </div>
      </form>
    </div>
  );
}

import { useState } from "react";
import dimensions from "../data/dimensions.json";
import meta from "../data/meta.json";
import changelog from "../data/changelog.json";
import { gpaToGrade, calculateOverallGPA, calculatePocketbookGPA, countPromises } from "../utils";
import ScoreboardHeader from "./ScoreboardHeader";
import { ApprovalDetail } from "./ApprovalSignal";
import WhatsChanged from "./WhatsChanged";
import DimensionCard from "./DimensionCard";
import PromiseTracker from "./PromiseTracker";
import Methodology from "./Methodology";
import About from "./About";
import EmailSignup from "./EmailSignup";
import VisitorCount from "./VisitorCount";

export default function Dashboard() {
  const [expanded, setExpanded] = useState(null);
  const [view, setView] = useState("scorecard");
  const [approvalExpanded, setApprovalExpanded] = useState(false);
  const scoredDimensions = dimensions.filter((d) => !d.excludeFromGPA);
  const trackerDimensions = dimensions.filter((d) => d.excludeFromGPA);

  // Calculate grades and promises from the data
  const overallGPA = calculateOverallGPA(dimensions).toFixed(1);
  const pocketbookGPA = calculatePocketbookGPA(dimensions).toFixed(1);
  const { all: allPromises, counts: promiseCounts, total: totalPromises } = countPromises(dimensions);

  const tabs = [
    { key: "scorecard", label: "Scorecard" },
    { key: "promises", label: "Promises" },
    { key: "changelog", label: "Change Log" },
    { key: "methodology", label: "Rubric" },
    { key: "about", label: "About" },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        maxWidth: "1040px",
        margin: "0 auto",
        padding: "24px 16px",
        background: "#fafafa",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <VisitorCount />
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#c62828",
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: "8px",
          }}
        >
          Performance Dashboard
        </div>
        <h1
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(1.75rem, 1.25rem + 2vw, 2.25rem)",
            color: "#1a1a1a",
            margin: "0 0 6px",
            lineHeight: 1.15,
          }}
        >
          Canada Under Carney
        </h1>
        <div className="header-subtitle" style={{ fontSize: "15px", color: "#555" }}>
          {meta.coveragePeriod.start.slice(0, 7).replace("-", "/")} &ndash;{" "}
          {meta.coveragePeriod.end.slice(0, 7).replace("-", "/")} &middot;
          Updated {meta.lastUpdated} &middot; v{meta.version}
        </div>
        {/* Print button */}
        <button
          onClick={handlePrint}
          style={{
            marginTop: "8px",
            padding: "6px 16px",
            fontSize: "14px",
            color: "#888",
            background: "transparent",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Print / Export PDF
        </button>
      </div>

      {/* Scoreboard header: overall grades + promise count + approval signal card */}
      <ScoreboardHeader
        overallGrade={gpaToGrade(parseFloat(overallGPA))}
        overallGPA={overallGPA}
        pocketbookGrade={gpaToGrade(parseFloat(pocketbookGPA))}
        pocketbookGPA={pocketbookGPA}
        promiseCounts={promiseCounts}
        totalPromises={totalPromises}
        approvalExpanded={approvalExpanded}
        onToggleApproval={() => setApprovalExpanded((v) => !v)}
      />

      {/* Approval Signal drill-down: full polling detail, visible only when the
          card above is toggled open. Explicitly outside the GPA. */}
      {approvalExpanded && <ApprovalDetail />}

      {/* Tab Navigation — horizontally scrollable rail on narrow screens so
          longer labels like "Change Log" don't spill into their neighbours. */}
      <div
        className="dashboard-tabs"
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "20px",
          background: "#eee",
          borderRadius: "8px",
          padding: "4px",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setView(t.key)}
            style={{
              flex: "1 1 auto",
              minWidth: "fit-content",
              padding: "10px 14px",
              fontSize: "14px",
              fontWeight: 700,
              background: view === t.key ? "#fff" : "transparent",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              color: view === t.key ? "#1a1a1a" : "#444",
              transition: "all 0.2s",
              fontFamily: "'DM Sans', sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Scorecard View */}
      {view === "scorecard" && (
        <>
        {/* Combined scorecard orientation block — intro line + legend sit as
            one "how to read this" unit immediately above the grid, per NN/g's
            principle that instruction text belongs adjacent to the action. */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "16px",
            maxWidth: "720px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              color: "#1a1a1a",
              fontWeight: 700,
              lineHeight: 1.5,
              marginBottom: "8px",
            }}
          >
            11 policy areas graded A–F, updated monthly.
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "18px",
              rowGap: "6px",
              fontSize: "14px",
              color: "#444",
              fontWeight: 600,
              flexWrap: "wrap",
            }}
          >
            <span><span style={{ color: "#2e7d32", fontWeight: 700 }}>{"\u25B2"}</span> Improving</span>
            <span><span style={{ color: "#757575", fontWeight: 700 }}>{"\u25AC"}</span> Stable</span>
            <span><span style={{ color: "#c62828", fontWeight: 700 }}>{"\u25BC"}</span> Declining</span>
            <span><span style={{ color: "#c62828", fontSize: "12px", fontWeight: 600 }}>(was X)</span> Grade changed</span>
            <span style={{ color: "#666", fontWeight: 500, fontStyle: "italic" }}>
              Click any card for the reasoning.
            </span>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "12px",
          }}
        >
          {scoredDimensions.map((d) => (
            <DimensionCard
              key={d.id}
              dim={d}
              isExpanded={expanded === d.id}
              onClick={() => setExpanded(expanded === d.id ? null : d.id)}
            />
          ))}
        </div>
        {trackerDimensions.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#1a1a1a",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                marginBottom: "6px",
              }}
            >
              Accountability Tracker
            </div>
            <div
              style={{
                fontSize: "15px",
                color: "#444",
                marginBottom: "12px",
                lineHeight: 1.5,
              }}
            >
              Promise Delivery is a running count of the government&rsquo;s
              specific commitments: how many are delivered, in progress,
              stalled, or abandoned. Tracked here for accountability but
              kept separate from the 11 performance grades, because the
              same events are already scored inside those grades. The
              number beside the card is delivered / total.
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "12px",
              }}
            >
              {trackerDimensions.map((d) => (
                <DimensionCard
                  key={d.id}
                  dim={d}
                  isExpanded={expanded === d.id}
                  onClick={() => setExpanded(expanded === d.id ? null : d.id)}
                  trackerStat={{
                    delivered: promiseCounts["Delivered"] || 0,
                    total: totalPromises,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        </>
      )}

      {/* Promise Tracker View */}
      {view === "promises" && (
        <PromiseTracker
          allPromises={allPromises}
          promiseCounts={promiseCounts}
          totalPromises={totalPromises}
        />
      )}

      {/* Change Log View */}
      {view === "changelog" && <WhatsChanged changelog={changelog} />}

      {/* Methodology View */}
      {view === "methodology" && <Methodology />}

      {/* About View */}
      {view === "about" && <About />}

      {/* Email signup */}
      <EmailSignup />

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          marginTop: "32px",
          padding: "16px",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <div style={{ fontSize: "14px", color: "#555" }}>
          Canada Under Carney &middot; Data: Statistics Canada, PBO, CMHC, Bank of Canada, IRCC, ECCC, NATO, OECD, IMF, Fitch
        </div>
        <div style={{ fontSize: "14px", color: "#555", marginTop: "4px" }}>
          Monthly updates with ad-hoc revisions on major events &middot; Rubric
          v{meta.rubricVersion} &middot; Next scheduled update: {meta.nextUpdate}
        </div>
        <div style={{ fontSize: "14px", color: "#555", marginTop: "8px" }}>
          <a
            href="feed.xml"
            style={{ color: "#1a73e8", textDecoration: "none" }}
          >
            Subscribe via RSS &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}

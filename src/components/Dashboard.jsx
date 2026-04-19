import { useState } from "react";
import dimensions from "../data/dimensions.json";
import meta from "../data/meta.json";
import changelog from "../data/changelog.json";
import { gpaToGrade, calculateOverallGPA, calculatePocketbookGPA, countPromises } from "../utils";
import ScoreboardHeader from "./ScoreboardHeader";
import WhatsChanged from "./WhatsChanged";
import DimensionCard from "./DimensionCard";
import PromiseTracker from "./PromiseTracker";
import Methodology from "./Methodology";
import About from "./About";

export default function Dashboard() {
  const [expanded, setExpanded] = useState(null);
  const [view, setView] = useState("scorecard");
  const scoredDimensions = dimensions.filter((d) => !d.excludeFromGPA);
  const trackerDimensions = dimensions.filter((d) => d.excludeFromGPA);

  // Calculate grades and promises from the data
  const overallGPA = calculateOverallGPA(dimensions).toFixed(1);
  const pocketbookGPA = calculatePocketbookGPA(dimensions).toFixed(1);
  const { all: allPromises, counts: promiseCounts, total: totalPromises } = countPromises(dimensions);

  const tabs = [
    { key: "scorecard", label: "Scorecard" },
    { key: "promises", label: "Promises" },
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
        maxWidth: "960px",
        margin: "0 auto",
        padding: "24px 16px",
        background: "#fafafa",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div
          style={{
            fontSize: "11px",
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
            fontSize: "32px",
            color: "#1a1a1a",
            margin: "0 0 4px",
            lineHeight: 1.2,
          }}
        >
          Canada Under Carney
        </h1>
        <div style={{ fontSize: "13px", color: "#888" }}>
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
            fontSize: "11px",
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

      {/* Scoreboard header: overall grades + promise count */}
      <ScoreboardHeader
        overallGrade={gpaToGrade(parseFloat(overallGPA))}
        overallGPA={overallGPA}
        pocketbookGrade={gpaToGrade(parseFloat(pocketbookGPA))}
        pocketbookGPA={pocketbookGPA}
        promiseCounts={promiseCounts}
        totalPromises={totalPromises}
      />

      {/* What Changed Since Last Update */}
      <WhatsChanged changelog={changelog} />

      {/* Tab Navigation */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "20px",
          background: "#eee",
          borderRadius: "8px",
          padding: "4px",
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setView(t.key)}
            style={{
              flex: 1,
              padding: "10px 6px",
              fontSize: "13px",
              fontWeight: 700,
              background: view === t.key ? "#fff" : "transparent",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              color: view === t.key ? "#1a1a1a" : "#444",
              transition: "all 0.2s",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Scorecard View */}
      {view === "scorecard" && (
        <>
        {/* Scorecard intro */}
        <div
          style={{
            textAlign: "center",
            fontSize: "13px",
            color: "#666",
            fontStyle: "italic",
            lineHeight: 1.5,
            marginBottom: "14px",
            maxWidth: "640px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          11 policy areas graded A–F across the federal government, updated monthly. Click any card to see the reasoning behind its grade.
        </div>
        {/* Legend */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginBottom: "16px",
            fontSize: "13px",
            color: "#444",
            fontWeight: 600,
            flexWrap: "wrap",
          }}
        >
          <span><span style={{ color: "#2e7d32", fontWeight: 700 }}>{"\u25B2"}</span> Improving</span>
          <span><span style={{ color: "#757575", fontWeight: 700 }}>{"\u25AC"}</span> Stable</span>
          <span><span style={{ color: "#c62828", fontWeight: 700 }}>{"\u25BC"}</span> Declining</span>
          <span><span style={{ color: "#c62828", fontSize: "9px", fontWeight: 600 }}>(was X)</span> Grade changed</span>
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
                fontSize: "11px",
                fontWeight: 700,
                color: "#777",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                marginBottom: "6px",
              }}
            >
              Accountability Tracker
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#666",
                marginBottom: "12px",
                lineHeight: 1.5,
              }}
            >
              Promise Delivery is tracked separately as a political accountability
              tool. It is visible here, but it is not part of the 11-dimension GPA.
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

      {/* Methodology View */}
      {view === "methodology" && <Methodology />}

      {/* About View */}
      {view === "about" && <About />}

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          marginTop: "32px",
          padding: "16px",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <div style={{ fontSize: "11px", color: "#aaa" }}>
          Canada Under Carney &middot; CJS Strategy &amp; Ops Inc. &middot;
          Data: Statistics Canada, PBO, CMHC, Bank of Canada, IRCC, ECCC, NATO, OECD, IMF, Fitch
        </div>
        <div style={{ fontSize: "11px", color: "#aaa", marginTop: "4px" }}>
          Monthly updates with ad-hoc revisions on major events &middot; Rubric
          v{meta.rubricVersion} &middot; Next scheduled update: {meta.nextUpdate}
        </div>
      </div>
    </div>
  );
}

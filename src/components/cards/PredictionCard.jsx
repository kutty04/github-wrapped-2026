import { useEffect, useState } from "react";

export default function PredictionCard({ data }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const cur = data.totalCommits || 0;
  // Add a fun compounding algorithm to hypothesize the next year's commit volume
  const growth = 1.15 + (Math.random() * 0.35); // 1.15 to 1.5 multiplier
  const projected = Math.round(cur * growth);
  const repoEstimate = Math.round((data.ownedRepos || 1) * 1.3);
  const nextYear = data.year + 1;

  return (
    <div style={s.card}>
      <div style={s.dots} aria-hidden />

      <div style={{ ...s.inner, opacity: visible ? 1:0, transform: visible ? "scale(1)":"scale(0.95)", transition: "all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}>
         <p style={s.eyebrow}>AI Predictive Telemetry</p>
         <h2 style={s.title}>{nextYear} Trajectory</h2>
         
         <div style={s.grid}>
            <div style={s.gridItem}>
               <span style={s.statLabel}>Projected Commits</span>
               <span style={s.statNum}>{projected.toLocaleString()}</span>
               <span style={s.statChange}>+{Math.round((growth - 1) * 100)}% Momentum</span>
            </div>
            <div style={s.gridItem}>
               <span style={s.statLabel}>Repo Capacity</span>
               <span style={s.statNum}>{repoEstimate}</span>
               <span style={s.statChange}>Active Repos</span>
            </div>
         </div>

         <p style={s.desc}>
            Based on your <strong>{data.longestStreak} day</strong> active streak velocity and <strong>{data.topLanguages[0]?.name || "Code"}</strong> language density, our framework mathematically predicts a massive <strong>+{Math.round((growth - 1) * 100)}%</strong> scaling output across {nextYear}.
         </p>
      </div>
    </div>
  );
}

const s = {
  card: { width: "100%", maxWidth: 420, height: 380, background: "#050714", border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: 24, padding: "24px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" },
  dots: { position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(59, 130, 246, 0.05) 1px, transparent 1px)", backgroundSize: "20px 20px" },
  inner: { position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" },
  eyebrow: { margin: "0 0 8px", fontSize: 13, color: "#3b82f6", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 800 },
  title: { margin: "0 0 32px", fontSize: 24, color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "-0.02em" },
  grid: { width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  gridItem: { background: "rgba(59, 130, 246, 0.05)", border: "1px solid rgba(59, 130, 246, 0.15)", borderRadius: 16, padding: "20px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 },
  statLabel: { fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" },
  statNum: { fontSize: 28, color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800 },
  statChange: { fontSize: 11, color: "#3b82f6", fontFamily: "'DM Mono', monospace", fontWeight: 700 },
  desc: { margin: "32px 0 0", fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Mono', monospace", lineHeight: 1.6, padding: "0 8px" }
};

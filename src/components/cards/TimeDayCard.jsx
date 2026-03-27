import { useEffect, useState } from "react";

export default function TimeDayCard({ data }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 50); return () => clearTimeout(t); }, []);

  const firstCommit = data.searchStats.firstCommitDate 
    ? new Date(data.searchStats.firstCommitDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null;

  return (
    <div style={s.card}>
      <div style={s.dots} aria-hidden />
      <div style={{...s.inner, opacity: visible ? 1:0, transform: visible ? "translateY(0)":"translateY(20px)", transition: "all 0.6s ease" }}>
        <div style={s.topLabel}>
          <img src={data.profile.avatar} alt={data.profile.login} style={s.avatar} />
          <span style={s.username}>@{data.profile.login}</span><span style={s.yearBadge}>{data.year}</span>
        </div>

        <div style={s.statSection}>
          <p style={s.eyebrow}>prime time</p>
          <div style={{ ...s.bigNumber, color: "#38bdf8" }}>{data.mostActiveTime}</div>
          <p style={s.statLabel}>is your most active time of day</p>
        </div>

        <div style={s.grid}>
           <div style={s.gridBox}>
             <p style={s.gridTitle}>Best Month</p>
             <p style={{ ...s.gridValue, color: "#fb7185" }}>{data.bestMonth}</p>
           </div>
           <div style={s.gridBox}>
             <p style={s.gridTitle}>First Commit</p>
             <p style={{ ...s.gridValue, color: "#4ade80" }}>{firstCommit || "N/A"}</p>
           </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  card: { width: "100%", maxWidth: 420, aspectRatio: "9 / 16", background: "#0f1117", borderRadius: 24, position: "relative", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column" },
  dots: { position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" },
  inner: { position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", padding: "28px 28px 24px" },
  topLabel: { display: "flex", alignItems: "center", gap: 8 },
  avatar: { width: 28, height: 28, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.15)" },
  username: { fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Mono', monospace", flex: 1 },
  yearBadge: { fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace" },
  statSection: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 40 },
  eyebrow: { fontSize: 14, color: "rgba(255,255,255,0.4)", margin: "0 0 8px", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" },
  bigNumber: { fontSize: "clamp(48px, 14vw, 72px)", fontWeight: 800, lineHeight: 1, fontFamily: "'Syne', sans-serif", letterSpacing: "-0.04em", margin: "0 0 12px" },
  statLabel: { fontSize: 18, color: "rgba(255,255,255,0.5)", margin: "0 0 16px", fontFamily: "'DM Mono', monospace", paddingRight: 20 },
  grid: { display: "flex", gap: 12, marginTop: 40 },
  gridBox: { flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 16px", display: "flex", flexDirection: "column", justifyContent: "center" },
  gridTitle: { fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 8px" },
  gridValue: { fontSize: 24, fontWeight: 700, fontFamily: "'Syne', sans-serif", margin: 0 }
};

import { useEffect, useState } from "react";

function useCountUp(target, duration = 1500) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = 0;
    const timer = setInterval(() => {
      start += target / (duration / 16);
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return value;
}

export default function PRsIssuesCard({ data }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 50); return () => clearTimeout(t); }, []);

  const { searchStats } = data;
  const prsOpened = useCountUp(searchStats.prsOpened);
  const issuesOpened = useCountUp(searchStats.issuesOpened);

  return (
    <div style={s.card}>
      <div style={s.dots} aria-hidden />
      <div style={{...s.inner, opacity: visible ? 1:0, transform: visible ? "translateY(0)":"translateY(20px)", transition: "all 0.6s ease" }}>
        <div style={s.topLabel}>
          <img src={data.profile.avatar} alt={data.profile.login} style={s.avatar} />
          <span style={s.username}>@{data.profile.login}</span><span style={s.yearBadge}>{data.year}</span>
        </div>

        <div style={s.statSection}>
          <p style={s.eyebrow}>Pull Requests</p>
          <div style={{ ...s.bigNumber, color: "#a855f7" }}>{prsOpened}</div>
          <p style={s.statLabel}>opened this year</p>
          <div style={s.metricContainer}>
            <span style={s.metricIcon}>↳</span>
            <span style={s.metricValue}>{searchStats.prsMerged}</span> merged successfully
          </div>
        </div>

        <div style={s.statSectionBottom}>
          <p style={s.eyebrow}>Issues</p>
          <div style={{ ...s.bigNumber, color: "#facc15", fontSize: "clamp(48px, 12vw, 64px)" }}>{issuesOpened}</div>
          <p style={s.statLabel}>issues opened</p>
          <div style={s.metricContainer}>
            <span style={s.metricIcon}>↳</span>
            <span style={s.metricValue}>{searchStats.issuesClosed}</span> closed
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
  statSectionBottom: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: 20 },
  eyebrow: { fontSize: 14, color: "rgba(255,255,255,0.4)", margin: "0 0 8px", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" },
  bigNumber: { fontSize: "clamp(56px, 16vw, 80px)", fontWeight: 800, lineHeight: 1, fontFamily: "'Syne', sans-serif", letterSpacing: "-0.04em", margin: "0 0 12px" },
  statLabel: { fontSize: 18, color: "rgba(255,255,255,0.5)", margin: "0 0 16px", fontFamily: "'DM Mono', monospace" },
  metricContainer: { fontSize: 14, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Mono', monospace", display: "flex", alignItems: "center", gap: 8 },
  metricIcon: { color: "rgba(255,255,255,0.2)" },
  metricValue: { color: "#ffffff", fontWeight: 700 }
};

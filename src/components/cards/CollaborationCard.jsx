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

export default function CollaborationCard({ data }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 50); return () => clearTimeout(t); }, []);

  const { searchStats } = data;
  const externalCommits = useCountUp(data.externalCommits);
  const linesAdded = useCountUp(data.linesAdded);
  const linesDeleted = useCountUp(data.linesDeleted);
  const reviewComments = useCountUp(searchStats.reviewComments);

  return (
    <div style={s.card}>
      <div style={s.dots} aria-hidden />
      <div style={{...s.inner, opacity: visible ? 1:0, transform: visible ? "translateY(0)":"translateY(20px)", transition: "all 0.6s ease" }}>
        <div style={s.topLabel}>
          <img src={data.profile.avatar} alt={data.profile.login} style={s.avatar} />
          <span style={s.username}>@{data.profile.login}</span><span style={s.yearBadge}>{data.year}</span>
        </div>

        <div style={s.statSection}>
          <p style={s.eyebrow}>Team Player</p>
          <div style={{ ...s.bigNumber, color: "#facc15" }}>{externalCommits}</div>
          <p style={s.statLabel}>commits to repositories you don't own</p>
        </div>

        <div style={s.statRow}>
          <div style={s.statCol}>
            <span style={s.smallMetric}>{reviewComments}</span>
            <span style={s.smallLabel}>code reviews</span>
          </div>
          <div style={s.statCol}>
            <span style={{...s.smallMetric, color: "#4ade80"}}>+{linesAdded}</span>
            <span style={s.smallLabel}>lines added</span>
          </div>
          <div style={s.statCol}>
             <span style={{...s.smallMetric, color: "#f87171"}}>-{linesDeleted}</span>
             <span style={s.smallLabel}>lines deleted</span>
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
  bigNumber: { fontSize: "clamp(56px, 16vw, 80px)", fontWeight: 800, lineHeight: 1, fontFamily: "'Syne', sans-serif", letterSpacing: "-0.04em", margin: "0 0 12px" },
  statLabel: { fontSize: 18, color: "rgba(255,255,255,0.5)", margin: "0 0 16px", fontFamily: "'DM Mono', monospace", paddingRight: 20 },
  statRow: { display: "flex", gap: 8, marginTop: 20 },
  statCol: { flex: 1, display: "flex", flexDirection: "column", padding: "16px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)", alignItems: "center", justifyContent: "center" },
  smallMetric: { fontSize: 20, fontWeight: 700, color: "#fff", fontFamily: "'Syne', sans-serif", marginBottom: 4 },
  smallLabel: { fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace", textAlign: "center", lineHeight: 1.2 }
};

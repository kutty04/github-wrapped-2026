import { useEffect, useState } from "react";

export default function PlaybackCard({ data }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 50); return () => clearTimeout(t); }, []);

  const maxCount = Math.max(...data.monthActivity.map(m => m.count));
  
  return (
    <div style={s.card}>
      <div style={s.dots} aria-hidden />
      <div style={{...s.inner, opacity: visible ? 1:0, transform: visible ? "translateY(0)":"translateY(20px)", transition: "all 0.6s ease" }}>
        
        <div style={s.topLabel}>
          <img src={data.profile.avatar} alt={data.profile.login} style={s.avatar} />
          <span style={s.username}>@{data.profile.login}</span><span style={s.yearBadge}>{data.year}</span>
        </div>

        <div style={s.statSection}>
          <p style={s.eyebrow}>The Growth Story</p>
          <div style={s.bigNumber}>{data.year}</div>
          <p style={s.statLabel}>commit intensity timeline</p>
        </div>

        <div style={s.chartArea}>
           {data.monthActivity.map((m, i) => {
             const heightPercent = maxCount === 0 ? 0 : Math.round((m.count / maxCount) * 100);
             return (
               <div key={m.month} style={s.barWrap}>
                 <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>{m.count > 0 ? m.count : ''}</span>
                 <div style={s.barBg}>
                   <div style={{ 
                     ...s.barFill, 
                     height: `${heightPercent}%`, 
                     transitionDelay: `${i * 0.08}s`,
                     opacity: visible ? 1 : 0,
                     transform: visible ? `scaleY(1)` : `scaleY(0)`
                   }} />
                 </div>
                 <span style={s.monthLabel}>{m.month.charAt(0)}</span>
               </div>
             );
           })}
        </div>
      </div>
    </div>
  );
}

const s = {
  card: { width: "100%", maxWidth: 420, aspectRatio: "9 / 16", background: "#0f1117", borderRadius: 24, position: "relative", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column" },
  dots: { position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" },
  inner: { position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", padding: "28px 24px 24px" },
  topLabel: { display: "flex", alignItems: "center", gap: 8, marginBottom: 24, flexShrink: 0 },
  avatar: { width: 28, height: 28, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.15)" },
  username: { fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Mono', monospace" },
  yearBadge: { fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace" },
  statSection: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" },
  eyebrow: { fontSize: 14, color: "rgba(255,255,255,0.4)", margin: "0 0 8px", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" },
  bigNumber: { fontSize: "clamp(36px, 12vw, 56px)", fontWeight: 800, lineHeight: 1, fontFamily: "'Syne', sans-serif", letterSpacing: "-0.04em", margin: "0 0 8px", color: "#60a5fa" },
  statLabel: { fontSize: 14, color: "rgba(255,255,255,0.5)", margin: "0 0 24px", fontFamily: "'DM Mono', monospace" },
  chartArea: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: 180, gap: 4, width: "100%" },
  barWrap: { display: "flex", flexDirection: "column", alignItems: "center", flex: 1, height: "100%" },
  barBg: { width: "100%", maxWidth: 16, flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 12, display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden" },
  barFill: { width: "100%", background: "linear-gradient(to top, #3b82f6, #60a5fa)", borderRadius: 12, transformOrigin: "bottom", transition: "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease" },
  monthLabel: { fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace", marginTop: 8 }
};

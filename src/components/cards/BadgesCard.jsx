import { useEffect, useState } from "react";

export default function BadgesCard({ data }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 50); return () => clearTimeout(t); }, []);

  return (
    <div style={s.card}>
      <div style={s.dots} aria-hidden />
      <div style={{...s.inner, opacity: visible ? 1:0, transform: visible ? "translateY(0)":"translateY(20px)", transition: "all 0.6s ease" }}>
        
        <div style={s.topLabel}>
          <img src={data.profile.avatar} alt={data.profile.login} style={s.avatar} />
          <span style={s.username}>@{data.profile.login}</span><span style={s.yearBadge}>{data.year}</span>
        </div>

        <div style={s.statSection}>
          <p style={s.eyebrow}>Achievements unlocked</p>
          <div style={{ ...s.bigNumber, color: "#facc15" }}>{data.badges.length}</div>
          <p style={s.statLabel}>badges earned</p>
        </div>

        <div style={s.scrollArea}>
          {data.badges.map((b, i) => (
            <div key={b.id} style={{...s.badgeBox, animationDelay: `${i * 0.1}s`}}>
               <div style={s.badgeIcon}>{b.icon}</div>
               <div>
                 <p style={s.badgeTitle}>{b.title}</p>
                 <p style={s.badgeDesc}>{b.desc}</p>
               </div>
            </div>
          ))}
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
  scrollArea: { flex: 1, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto", paddingRight: 4, scrollbarWidth: "none" },
  statSection: { marginBottom: 16, flexShrink: 0 },
  eyebrow: { fontSize: 14, color: "rgba(255,255,255,0.4)", margin: "0 0 8px", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" },
  bigNumber: { fontSize: "clamp(36px, 12vw, 56px)", fontWeight: 800, lineHeight: 1, fontFamily: "'Syne', sans-serif", letterSpacing: "-0.04em", margin: "0 0 8px" },
  statLabel: { fontSize: 14, color: "rgba(255,255,255,0.5)", margin: "0 0 16px", fontFamily: "'DM Mono', monospace" },
  badgeBox: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(250,204,21,0.1)", borderRadius: 16, padding: "16px", display: "flex", gap: 16, alignItems: "center", flexShrink: 0 },
  badgeIcon: { fontSize: 32, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center", width: 48, height: 48, background: "rgba(250, 204, 21, 0.1)", borderRadius: "50%" },
  badgeTitle: { fontSize: 16, color: "#facc15", fontFamily: "system-ui, sans-serif", fontWeight: 700, margin: "0 0 4px" },
  badgeDesc: { fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: "'DM Mono', monospace", margin: 0, lineHeight: 1.4 }
};

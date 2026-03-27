import { useEffect, useState } from "react";

export default function AICard({ data }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 50); return () => clearTimeout(t); }, []);

  const ai = data.ai;

  // Safely serialize any field that Groq might return as an object/array instead of a string
  function safeText(val) {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (Array.isArray(val)) return val.map(v => typeof v === "object" ? Object.values(v).join(" — ") : String(v)).join(" · ");
    if (typeof val === "object") return Object.values(val).join(" — ");
    return String(val);
  }

  if (!ai) {
    return (
      <div style={s.card}>
        <div style={s.dots} aria-hidden />
        <div style={{...s.inner, justifyContent: "center", alignItems: "center"}}>
          <p style={s.fallback}>AI roast unavailable.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={s.card}>
      <div style={s.dots} aria-hidden />
      <div style={{...s.inner, opacity: visible ? 1:0, transform: visible ? "translateY(0)":"translateY(20px)", transition: "all 0.6s ease" }}>
        
        {/* Header Ribbon */}
        <div style={s.ribbon}>✨ AI Analysis</div>

        <div style={s.topLabel}>
          <img src={data.profile.avatar} alt={data.profile.login} style={s.avatar} />
          <span style={s.username}>@{data.profile.login}</span><span style={s.yearBadge}>{data.year}</span>
        </div>

        <div style={s.scrollArea}>
          {/* Personality Title */}
          <div style={s.personalitySection}>
            <p style={s.eyebrow}>AI Verdict</p>
            <h2 style={s.personalityTitle}>{ai.personality}</h2>
          </div>

          {/* Summary */}
          <div style={s.box}>
             <span style={s.boxIcon}>📜</span>
             <p style={s.boxText}>{ai.summary}</p>
          </div>

          {/* Roast */}
          <div style={{...s.box, background: "rgba(248, 113, 113, 0.05)", borderColor: "rgba(248, 113, 113, 0.15)"}}>
             <span style={s.boxIcon}>🔥</span>
             <p style={{...s.boxText, color: "#fca5a5"}}>{ai.roast}</p>
          </div>

          {/* Suggestions */}
          <div style={{...s.box, background: "rgba(74, 222, 128, 0.05)", borderColor: "rgba(74, 222, 128, 0.15)"}}>
             <span style={s.boxIcon}>💡</span>
             <p style={{...s.boxText, color: "#86efac"}}>{safeText(ai.suggestions)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  card: { width: "100%", maxWidth: 420, aspectRatio: "9 / 16", background: "#0f1117", borderRadius: 24, position: "relative", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column" },
  dots: { position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" },
  inner: { position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", padding: "28px 24px 24px" },
  fallback: { color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace", fontSize: 14 },
  ribbon: { position: "absolute", top: 28, right: 24, background: "linear-gradient(135deg, #a855f7, #ec4899)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 12, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "'DM Mono', monospace" },
  topLabel: { display: "flex", alignItems: "center", gap: 8, marginBottom: 24, flexShrink: 0 },
  avatar: { width: 28, height: 28, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.15)" },
  username: { fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Mono', monospace" },
  yearBadge: { fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace" },
  scrollArea: { flex: 1, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto", paddingRight: 4, scrollbarWidth: "none" },
  personalitySection: { marginBottom: 8, flexShrink: 0 },
  eyebrow: { fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "0 0 4px", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" },
  personalityTitle: { fontSize: "clamp(24px, 8vw, 28px)", fontWeight: 800, lineHeight: 1.1, fontFamily: "'Syne', sans-serif", letterSpacing: "-0.02em", margin: 0, color: "#e879f9" },
  box: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "16px", display: "flex", gap: 12, alignItems: "flex-start", flexShrink: 0 },
  boxIcon: { fontSize: 18, lineHeight: 1 },
  boxText: { fontSize: 14, color: "rgba(255,255,255,0.7)", fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: 1.5, margin: 0, fontWeight: 500 }
};

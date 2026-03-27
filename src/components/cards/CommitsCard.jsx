import { useEffect, useState } from "react";

// Animated counter hook
function useCountUp(target, duration = 1800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target || target === 0) { setValue(0); return; }
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

function getCommitPersonality(count) {
  if (count >= 1000) return { label: "Code machine", color: "#4ade80" };
  if (count >= 500)  return { label: "Power committer", color: "#facc15" };
  if (count >= 200)  return { label: "Consistent builder", color: "#60a5fa" };
  if (count >= 50)   return { label: "Getting warmed up", color: "#f472b6" };
  return               { label: "No public activity yet — your journey starts here 🚀", color: "#a78bfa" };
}

export default function CommitsCard({ data }) {
  const personality = getCommitPersonality(data.totalCommits);
  const [visible, setVisible] = useState(false);
  const [taps, setTaps] = useState(0);
  const [egg, setEgg] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  function handleTap() {
    setTaps(t => {
      const next = t + 1;
      if (next === 5) setEgg(true);
      return next;
    });
  }

  return (
    <div style={s.card}>
      {/* Subtle dot grid background */}
      <div style={s.dots} aria-hidden />

      {egg && (
        <div style={s.easterEgg}>
          <span style={{ fontSize: 48, filter: "drop-shadow(0 0 10px #4ade80)" }}>🌱</span>
          <p style={s.glitchText}>EASTER EGG UNLOCKED</p>
          <p style={s.secretMessage}>You tapped your commits 5 times furiously! Have you considered taking a walk and touching grass?</p>
          <button onClick={() => { setEgg(false); setTaps(0); }} style={s.closeGlitch}>Hide</button>
        </div>
      )}

      <div
        style={{
          ...s.inner,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        {/* Top label */}
        <div style={s.topLabel}>
          <img
            src={data.profile.avatar}
            alt={data.profile.login}
            style={s.avatar}
          />
          <span style={s.username}>@{data.profile.login}</span>
          <span style={s.yearBadge}>{data.year}</span>
        </div>

        {/* Main stat */}
        <div style={s.content}>
          <style>{`
            @keyframes popIn { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
            @keyframes pulseHint { 0%, 100% { opacity: 0.3; transform: scale(0.9); } 50% { opacity: 0.8; transform: scale(1.1); } }
          `}</style>
          <p style={s.eyebrow}>this year, you made</p>
          <div style={{ position: "relative" }}>
             <h1 onClick={handleTap} style={{...s.bigNumber, cursor: "pointer", userSelect: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 12}}>
                {data.totalCommits.toLocaleString()}
                {taps === 0 && !egg && <span style={{ fontSize: 24, animation: "pulseHint 2s infinite ease-in-out" }}>👆</span>}
             </h1>
             {taps > 0 && !egg && <span style={s.tapHint}>Tap {5 - taps} more times...</span>}
          </div>
          <p style={s.statLabel}>total commits</p>
        </div>

        {/* Personality tag */}
        <div
          style={{
            ...s.personalityTag,
            background: personality.color + "18",
            border: `1px solid ${personality.color}40`,
            color: personality.color,
          }}
        >
          {personality.label}
        </div>

        {/* Bottom bar — activity per day of week */}
        <div style={s.bars}>
          {data.dayActivity.map((d) => {
            const max = Math.max(...data.dayActivity.map((x) => x.count));
            const h = max > 0 ? Math.max(4, (d.count / max) * 52) : 4;
            return (
              <div key={d.day} style={s.barItem}>
                <div
                  style={{
                    ...s.bar,
                    height: h,
                    background:
                      d.day === data.mostActiveDay
                        ? "#4ade80"
                        : "rgba(255,255,255,0.12)",
                  }}
                />
                <span
                  style={{
                    ...s.barLabel,
                    color:
                      d.day === data.mostActiveDay
                        ? "#4ade80"
                        : "rgba(255,255,255,0.3)",
                  }}
                >
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>
        <p style={s.mostActiveNote}>
          most active on <strong style={{ color: "#4ade80" }}>{data.mostActiveDay}s</strong>
        </p>
      </div>
    </div>
  );
}

const s = {
  card: {
    width: "100%",
    maxWidth: 420,
    aspectRatio: "9 / 16",
    background: "#0f1117",
    borderRadius: 24,
    position: "relative",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.07)",
    display: "flex",
    flexDirection: "column",
  },
  dots: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
    backgroundSize: "20px 20px",
    pointerEvents: "none",
  },
  inner: {
    position: "relative",
    zIndex: 1,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "28px 28px 24px",
  },
  topLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 0,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    border: "1.5px solid rgba(255,255,255,0.15)",
  },
  username: {
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
    fontFamily: "'DM Mono', monospace",
    flex: 1,
  },
  yearBadge: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.12em",
    color: "rgba(255,255,255,0.25)",
    fontFamily: "'DM Mono', monospace",
  },
  statSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingTop: 40,
  },
  eyebrow: {
    fontSize: 14,
    color: "rgba(255,255,255,0.4)",
    margin: "0 0 8px",
    fontFamily: "'DM Mono', monospace",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  bigNumber: {
    fontSize: "clamp(64px, 18vw, 88px)",
    fontWeight: 800,
    color: "#ffffff",
    lineHeight: 1,
    fontFamily: "'Syne', 'DM Mono', monospace",
    letterSpacing: "-0.04em",
    margin: "0 0 12px",
  },
  statLabel: {
    fontSize: 20,
    color: "rgba(255,255,255,0.5)",
    margin: "0 0 32px",
    fontFamily: "'DM Mono', monospace",
  },
  personalityTag: {
    display: "inline-block",
    alignSelf: "flex-start",
    fontSize: 13,
    fontWeight: 600,
    padding: "6px 16px",
    borderRadius: 99,
    fontFamily: "'DM Mono', monospace",
    letterSpacing: "0.04em",
    marginBottom: 40,
  },
  bars: {
    display: "flex",
    alignItems: "flex-end",
    gap: 6,
    height: 60,
    marginBottom: 8,
  },
  barItem: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    justifyContent: "flex-end",
    height: "100%",
  },
  bar: {
    width: "100%",
    borderRadius: 3,
    transition: "height 0.4s ease",
  },
  barLabel: {
    fontSize: 9,
    fontFamily: "'DM Mono', monospace",
    letterSpacing: "0.04em",
  },
  mostActiveNote: {
    fontSize: 12,
    color: "rgba(255,255,255,0.3)",
    margin: 0,
    fontFamily: "'DM Mono', monospace",
  },
  tapHint: { position: "absolute", bottom: -24, left: 0, right: 0, fontSize: 11, color: "rgba(74,222,128,0.8)", fontFamily: "'DM Mono', monospace", textAlign: "center", pointerEvents: "none", fontWeight: 600, letterSpacing: "0.05em" },
  easterEgg: { position: "absolute", inset: 0, background: "rgba(5,5,5,0.85)", backdropFilter: "blur(20px)", zIndex: 50, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center", animation: "popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)" },
  glitchText: { fontSize: 13, color: "#4ade80", fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em", margin: "32px 0 16px", fontWeight: 800, textTransform: "uppercase" },
  secretMessage: { fontSize: 24, color: "#fff", fontFamily: "'Syne', sans-serif", lineHeight: 1.35, margin: "0 0 40px", fontWeight: 800, letterSpacing: "-0.02em", maxWidth: 280 },
  closeGlitch: { background: "#4ade80", color: "#000", border: "none", padding: "16px 40px", borderRadius: 99, fontFamily: "'Syne', sans-serif", fontSize: 16, cursor: "pointer", fontWeight: 800, transition: "transform 0.2s" }
};

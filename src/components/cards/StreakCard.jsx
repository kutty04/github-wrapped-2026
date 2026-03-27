import { useEffect, useState } from "react";

function useCountUp(target, duration = 1800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

function getStreakPersonality(streak) {
  if (streak >= 30) return { label: "Streak legend", color: "#f97316" };
  if (streak >= 14) return { label: "Momentum builder", color: "#facc15" };
  if (streak >= 7)  return { label: "Week warrior", color: "#4ade80" };
  if (streak >= 3)  return { label: "Getting consistent", color: "#60a5fa" };
  return               { label: "Every day counts", color: "#a78bfa" };
}

export default function StreakCard({ data }) {
  const longest = useCountUp(data.longestStreak);
  const current = useCountUp(data.currentStreak);
  const personality = getStreakPersonality(data.longestStreak);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Build mini flame bars for visual flair
  const flameHeights = [18, 28, 38, 52, 44, 36, 48, 60, 52, 40, 56, 64, 58, 70];

  return (
    <div style={s.card}>
      <div style={s.dots} aria-hidden />
      <div style={{
        ...s.inner,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}>
        {/* Top label */}
        <div style={s.topLabel}>
          <img src={data.profile.avatar} alt={data.profile.login} style={s.avatar} />
          <span style={s.username}>@{data.profile.login}</span>
          <span style={s.yearBadge}>{data.year}</span>
        </div>

        {/* Flame visual */}
        <div style={s.flameRow}>
          {flameHeights.map((h, i) => (
            <div key={i} style={{
              ...s.flamePillar,
              height: h,
              background: `rgba(249, 115, 22, ${0.15 + (h / 70) * 0.7})`,
              animationDelay: `${i * 0.08}s`,
            }} />
          ))}
        </div>

        {/* Main stat */}
        <div style={s.statSection}>
          <p style={s.eyebrow}>Longest streak</p>
          <div style={s.bigNumber}>{longest}</div>
          <p style={s.statLabel}>days in a row</p>
        </div>

        {/* Personality */}
        <div style={{
          ...s.personalityTag,
          background: personality.color + "18",
          border: `1px solid ${personality.color}40`,
          color: personality.color,
        }}>
          {personality.label}
        </div>

        {/* Current streak callout */}
        <div style={s.currentStreak}>
          <span style={s.currentLabel}>current streak</span>
          <span style={{ ...s.currentNum, color: data.currentStreak > 0 ? "#f97316" : "rgba(255,255,255,0.2)" }}>
            {current} {current === 1 ? "day" : "days"}
          </span>
        </div>
      </div>
    </div>
  );
}

const s = {
  card: {
    width: "100%", maxWidth: 420, aspectRatio: "9 / 16",
    background: "#0f1117", borderRadius: 24, position: "relative",
    overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)",
    display: "flex", flexDirection: "column",
  },
  dots: {
    position: "absolute", inset: 0,
    backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
    backgroundSize: "20px 20px", pointerEvents: "none",
  },
  inner: {
    position: "relative", zIndex: 1, flex: 1,
    display: "flex", flexDirection: "column", padding: "28px 28px 24px",
  },
  topLabel: { display: "flex", alignItems: "center", gap: 8 },
  avatar: { width: 28, height: 28, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.15)" },
  username: { fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Mono', monospace", flex: 1 },
  yearBadge: { fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace" },
  flameRow: {
    display: "flex", alignItems: "flex-end", gap: 4,
    marginTop: 32, marginBottom: 8, height: 72,
  },
  flamePillar: {
    flex: 1, borderRadius: "4px 4px 2px 2px", transition: "height 0.3s ease",
  },
  statSection: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 16 },
  eyebrow: {
    fontSize: 14, color: "rgba(255,255,255,0.4)", margin: "0 0 8px",
    fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase",
  },
  bigNumber: {
    fontSize: "clamp(64px, 18vw, 88px)", fontWeight: 800, color: "#f97316",
    lineHeight: 1, fontFamily: "'Syne', sans-serif", letterSpacing: "-0.04em", margin: "0 0 12px",
  },
  statLabel: { fontSize: 20, color: "rgba(255,255,255,0.5)", margin: "0 0 32px", fontFamily: "'DM Mono', monospace" },
  personalityTag: {
    display: "inline-block", alignSelf: "flex-start", fontSize: 13,
    fontWeight: 600, padding: "6px 16px", borderRadius: 99,
    fontFamily: "'DM Mono', monospace", letterSpacing: "0.04em", marginBottom: 32,
  },
  currentStreak: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 16px", background: "rgba(249,115,22,0.06)",
    border: "1px solid rgba(249,115,22,0.15)", borderRadius: 10,
  },
  currentLabel: { fontSize: 12, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em" },
  currentNum: { fontSize: 14, fontWeight: 600, fontFamily: "'DM Mono', monospace" },
};

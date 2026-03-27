import { useEffect, useState } from "react";

export default function SplashCard({ data }) {
  const [phase, setPhase] = useState(0);
  // phase 0 = nothing, 1 = avatar+name, 2 = tagline, 3 = year badge, 4 = subtext

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 120),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 1050),
      setTimeout(() => setPhase(4), 1500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const year = data.year;
  const login = data.profile.login;
  const name = data.profile.name || login;
  const avatar = data.profile.avatar;

  return (
    <div style={s.card}>
      {/* Animated radial glow bg */}
      <div style={{
        ...s.glow,
        opacity: phase >= 2 ? 1 : 0,
        transition: "opacity 1.2s ease",
      }} />

      {/* Dot grid */}
      <div style={s.dots} aria-hidden />

      {/* Horizontal scan line accent */}
      <div style={{
        ...s.scanLine,
        opacity: phase >= 1 ? 0.6 : 0,
        transition: "opacity 0.8s ease",
      }} />

      <div style={s.inner}>

        {/* Top: GITHUB WRAPPED label */}
        <div style={{
          ...s.topBadge,
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? "translateY(0)" : "translateY(-12px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}>
          <span style={s.topBadgeText}>GITHUB WRAPPED</span>
        </div>

        {/* Center content */}
        <div style={s.center}>
          {/* Avatar */}
          <div style={{
            ...s.avatarWrap,
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? "scale(1)" : "scale(0.7)",
            transition: "opacity 0.5s ease, transform 0.6s cubic-bezier(0.34,1.56,0.64,1)",
          }}>
            <img src={avatar} alt={login} style={s.avatar} />
            <div style={s.avatarRing} />
          </div>

          {/* Name */}
          <div style={{
            ...s.nameWrap,
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
          }}>
            <p style={s.handle}>@{login}</p>
            {data.profile.name && <p style={s.realName}>{name}</p>}
          </div>

          {/* Year pill */}
          <div style={{
            ...s.yearPill,
            opacity: phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? "scale(1)" : "scale(0.85)",
            transition: "opacity 0.4s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",
          }}>
            <span style={s.yearText}>{year}</span>
          </div>

          {/* Tagline */}
          <p style={{
            ...s.tagline,
            opacity: phase >= 4 ? 1 : 0,
            transform: phase >= 4 ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}>
            Your year in code,<br />ready to replay.
          </p>
        </div>

        {/* Bottom: swipe hint */}
        <div style={{
          ...s.swipeHint,
          opacity: phase >= 4 ? 1 : 0,
          transition: "opacity 0.6s ease 0.3s",
        }}>
          <SwipeArrow />
          <span style={s.swipeText}>swipe to begin</span>
        </div>

      </div>
    </div>
  );
}

function SwipeArrow() {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    let t = 0;
    const interval = setInterval(() => {
      t += 0.08;
      setOffset(Math.sin(t) * 4);
    }, 16);
    return () => clearInterval(interval);
  }, []);
  return (
    <span style={{ display: "inline-block", transform: `translateX(${offset}px)`, fontSize: 16 }}>
      →
    </span>
  );
}

const s = {
  card: {
    width: "100%",
    maxWidth: 420,
    aspectRatio: "9 / 16",
    background: "#0a0a0f",
    borderRadius: 24,
    position: "relative",
    overflow: "hidden",
    border: "1px solid rgba(74,222,128,0.15)",
    display: "flex",
    flexDirection: "column",
  },
  glow: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(ellipse at 50% 55%, rgba(74,222,128,0.12) 0%, rgba(99,102,241,0.06) 50%, transparent 75%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  dots: {
    position: "absolute",
    inset: 0,
    backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)",
    backgroundSize: "22px 22px",
    pointerEvents: "none",
    zIndex: 1,
  },
  scanLine: {
    position: "absolute",
    left: 0, right: 0,
    top: "42%",
    height: 1,
    background: "linear-gradient(90deg, transparent, rgba(74,222,128,0.3) 30%, rgba(74,222,128,0.3) 70%, transparent)",
    zIndex: 2,
    pointerEvents: "none",
  },
  inner: {
    position: "relative",
    zIndex: 3,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "32px 28px 28px",
  },
  topBadge: {
    alignSelf: "center",
    borderBottom: "1px solid rgba(74,222,128,0.25)",
    paddingBottom: 8,
    marginBottom: 0,
    width: "100%",
    textAlign: "center",
  },
  topBadgeText: {
    fontSize: 10,
    letterSpacing: "0.22em",
    color: "rgba(74,222,128,0.6)",
    fontFamily: "'DM Mono', monospace",
    fontWeight: 500,
  },
  center: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  avatarWrap: {
    position: "relative",
    width: 96,
    height: 96,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: "50%",
    border: "2px solid rgba(74,222,128,0.4)",
    display: "block",
  },
  avatarRing: {
    position: "absolute",
    inset: -6,
    borderRadius: "50%",
    border: "1px solid rgba(74,222,128,0.15)",
    animation: "none",
  },
  nameWrap: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  handle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.5)",
    fontFamily: "'DM Mono', monospace",
    margin: 0,
    letterSpacing: "0.04em",
  },
  realName: {
    fontSize: 28,
    fontWeight: 800,
    color: "#ffffff",
    fontFamily: "'Syne', sans-serif",
    letterSpacing: "-0.02em",
    margin: 0,
    lineHeight: 1.1,
  },
  yearPill: {
    background: "rgba(74,222,128,0.1)",
    border: "1px solid rgba(74,222,128,0.35)",
    borderRadius: 99,
    padding: "6px 22px",
  },
  yearText: {
    fontSize: 13,
    fontWeight: 600,
    color: "#4ade80",
    fontFamily: "'DM Mono', monospace",
    letterSpacing: "0.12em",
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255,255,255,0.4)",
    fontFamily: "'DM Mono', monospace",
    textAlign: "center",
    lineHeight: 1.7,
    margin: 0,
    letterSpacing: "0.02em",
  },
  swipeHint: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "rgba(255,255,255,0.2)",
  },
  swipeText: {
    fontSize: 11,
    fontFamily: "'DM Mono', monospace",
    letterSpacing: "0.1em",
  },
};

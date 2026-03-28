import { useEffect, useState, useRef } from "react";

export default function CollaborationGraphCard({ data }) {
  const [peers, setPeers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [particles, setParticles] = useState([]);
  const animRef = useRef(null);
  const tickRef = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 150);
    // Generate random star particles
    setParticles(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        r: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.5 + 0.1,
        speed: Math.random() * 0.4 + 0.1,
      }))
    );
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const cached = sessionStorage.getItem(`net_${data.profile.login}`);
    if (cached) {
      setPeers(JSON.parse(cached).slice(0, 8));
    } else {
      fetch(`https://api.github.com/users/${data.profile.login}/followers?per_page=8`)
        .then(r => r.json())
        .then(list => {
          if (!Array.isArray(list)) return;
          sessionStorage.setItem(`net_${data.profile.login}`, JSON.stringify(list));
          setPeers(list.slice(0, 8));
        })
        .catch(() => {});
    }
  }, [data.profile.login]);

  const repos = (data.topRepos || []).slice(0, 4);
  const W = 1000, H = 500;
  const cx = W / 2, cy = H / 2;
  const innerR = 150, outerR = 260;

  const repoNodes = repos.map((r, i) => {
    const angle = (i / repos.length) * Math.PI * 2 - Math.PI / 2;
    return { ...r, x: cx + Math.cos(angle) * innerR, y: cy + Math.sin(angle) * innerR };
  });

  const peerNodes = peers.map((p, i) => {
    const angle = (i / Math.max(peers.length, 1)) * Math.PI * 2 - Math.PI / 2;
    return { ...p, x: cx + Math.cos(angle) * outerR, y: cy + Math.sin(angle) * outerR };
  });

  const gradientId = "centerGrad";
  const glowId = "centerGlow";

  return (
    <div style={s.card}>
      {/* Animated dot grid */}
      <div style={s.dotGrid} />

      {/* Deep space radial glow */}
      <div style={s.spaceBg} />

      {/* Top accent line */}
      <div style={s.accentLine} />

      <div style={{ ...s.inner, opacity: visible ? 1 : 0, transform: visible ? "scale(1)" : "scale(0.97)", transition: "opacity 0.8s ease, transform 0.8s ease" }}>

        {/* Header */}
        <div style={s.header}>
          <span style={s.pill}>✦ Live Network</span>
          <div style={s.titleGroup}>
            <p style={s.eyebrow}>Social Topography</p>
            <h2 style={s.title}>The Collaboration Graph</h2>
          </div>
          <div style={s.stats}>
            <div style={s.statChip}><span style={{ color: "#a855f7" }}>◆</span> {repos.length} Repos</div>
            <div style={s.statChip}><span style={{ color: "#38bdf8" }}>◆</span> {peers.length} Peers</div>
          </div>
        </div>

        {/* SVG Canvas */}
        <div style={s.canvasWrap}>
          <svg viewBox={`0 0 ${W} ${H}`} style={s.svg} xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Center gradient */}
              <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#4ade80" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
              </radialGradient>
              {/* Glow filter */}
              <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              {/* Peer clip paths */}
              {peerNodes.map((_, i) => (
                <clipPath key={`clip-${i}`} id={`clip-${i}`}>
                  <circle cx={peerNodes[i].x} cy={peerNodes[i].y} r={19} />
                </clipPath>
              ))}
            </defs>

            {/* Star particles */}
            {particles.map(p => (
              <circle key={p.id}
                cx={`${p.x}%`} cy={`${p.y}%`}
                r={p.r} fill="white" opacity={p.opacity} />
            ))}

            {/* Outer orbital ring */}
            <circle cx={cx} cy={cy} r={outerR}
              fill="none" stroke="rgba(56,189,248,0.08)" strokeWidth="1"
              strokeDasharray="3 8" />

            {/* Inner orbital ring */}
            <circle cx={cx} cy={cy} r={innerR}
              fill="none" stroke="rgba(168,85,247,0.12)" strokeWidth="1"
              strokeDasharray="2 6" />

            {/* Outer glow rings */}
            <circle cx={cx} cy={cy} r={outerR + 2}
              fill="none" stroke="rgba(56,189,248,0.03)" strokeWidth="4" />
            <circle cx={cx} cy={cy} r={innerR + 2}
              fill="none" stroke="rgba(168,85,247,0.04)" strokeWidth="4" />

            {/* Connection lines to peers */}
            {peerNodes.map((p, i) => (
              <line key={`pl-${i}`} x1={cx} y1={cy} x2={p.x} y2={p.y}
                stroke="url(#peerLine)" strokeWidth="1"
                stroke="rgba(56,189,248,0.18)" strokeDasharray="5 6" />
            ))}

            {/* Connection lines to repos */}
            {repoNodes.map((r, i) => (
              <line key={`rl-${i}`} x1={cx} y1={cy} x2={r.x} y2={r.y}
                stroke="rgba(168,85,247,0.5)" strokeWidth="1.5" />
            ))}

            {/* Center radial glow */}
            <circle cx={cx} cy={cy} r={80} fill={`url(#${gradientId})`} />

            {/* Center ring */}
            <circle cx={cx} cy={cy} r={52}
              fill="rgba(6,9,19,0.8)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"
              filter={`url(#${glowId})`} />

            {/* Repo nodes */}
            {repoNodes.map((r, i) => (
              <g key={`rn-${i}`} filter="url(#softGlow)">
                {/* Outer glow */}
                <circle cx={r.x} cy={r.y} r={32} fill="rgba(168,85,247,0.06)" />
                {/* Node circle */}
                <circle cx={r.x} cy={r.y} r={24}
                  fill="rgba(10,8,20,0.95)" stroke="#a855f7" strokeWidth="1.5" />
                {/* Inner fill */}
                <circle cx={r.x} cy={r.y} r={18} fill="rgba(168,85,247,0.1)" />
                {/* Repo stars */}
                <text x={r.x} y={r.y + 5} textAnchor="middle" fontSize="16">⭐</text>
                {/* Label */}
                <text x={r.x} y={r.y + 44} textAnchor="middle"
                  fill="rgba(196,181,253,0.9)" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  {r.name?.length > 13 ? r.name.slice(0, 13) + "…" : r.name}
                </text>
                {r.stars > 0 && (
                  <text x={r.x} y={r.y + 57} textAnchor="middle"
                    fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace">
                    ★ {r.stars}
                  </text>
                )}
              </g>
            ))}

            {/* Peer nodes */}
            {peerNodes.map((p, i) => (
              <g key={`pn-${i}`}>
                {/* Outer glow */}
                <circle cx={p.x} cy={p.y} r={28} fill="rgba(56,189,248,0.05)" />
                {/* Border ring */}
                <circle cx={p.x} cy={p.y} r={21}
                  fill="none" stroke="rgba(56,189,248,0.4)" strokeWidth="1.5" />
                {/* Avatar */}
                <image href={p.avatar_url}
                  x={p.x - 19} y={p.y - 19} width={38} height={38}
                  clipPath={`url(#clip-${i})`} />
                {/* Username */}
                <text x={p.x} y={p.y + 36} textAnchor="middle"
                  fill="rgba(148,226,255,0.7)" fontSize="9" fontFamily="monospace">
                  @{p.login?.length > 9 ? p.login.slice(0, 9) + "…" : p.login}
                </text>
              </g>
            ))}

            {/* Empty state */}
            {peers.length === 0 && repos.length === 0 && (
              <text x={cx} y={cy + 90} textAnchor="middle"
                fill="rgba(255,255,255,0.3)" fontSize="13" fontFamily="monospace">
                No network data
              </text>
            )}
          </svg>

          {/* Center avatar overlay */}
          <div style={s.centerAvi}>
            <div style={s.centerRing}>
              <img src={data.profile.avatar} alt={data.profile.login} style={s.centerImg} />
            </div>
            <span style={s.centerLabel}>@{data.profile.login}</span>
          </div>
        </div>

        {/* Legend */}
        <div style={s.legend}>
          <div style={s.legendItem}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", display: "inline-block", boxShadow: "0 0 8px #4ade80" }} />
            You
          </div>
          <div style={s.legendSep} />
          <div style={s.legendItem}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#a855f7", display: "inline-block", boxShadow: "0 0 8px #a855f7" }} />
            Repositories
          </div>
          <div style={s.legendSep} />
          <div style={s.legendItem}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#38bdf8", display: "inline-block", boxShadow: "0 0 8px #38bdf8" }} />
            Followers
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  card: {
    width: "100%", height: 620,
    background: "linear-gradient(160deg, #05080f 0%, #060913 40%, #060c18 100%)",
    border: "1px solid rgba(56,189,248,0.15)", borderRadius: 28,
    padding: "28px 28px 20px", display: "flex", flexDirection: "column",
    position: "relative", overflow: "hidden",
  },
  dotGrid: {
    position: "absolute", inset: 0,
    backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)",
    backgroundSize: "32px 32px", pointerEvents: "none",
  },
  spaceBg: {
    position: "absolute", inset: 0,
    background: "radial-gradient(ellipse at 50% 55%, rgba(56,189,248,0.07) 0%, rgba(168,85,247,0.04) 40%, transparent 70%)",
    pointerEvents: "none",
  },
  accentLine: {
    position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
    background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.5), rgba(168,85,247,0.5), transparent)",
  },
  inner: { position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" },
  header: { display: "flex", alignItems: "center", gap: 16, marginBottom: 12, flexWrap: "wrap" },
  pill: {
    fontSize: 10, color: "#38bdf8", background: "rgba(56,189,248,0.1)",
    border: "1px solid rgba(56,189,248,0.25)", padding: "4px 10px", borderRadius: 99,
    fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", whiteSpace: "nowrap",
  },
  titleGroup: { flex: 1 },
  eyebrow: {
    margin: 0, fontSize: 11, color: "#38bdf8",
    fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 800,
  },
  title: {
    margin: 0, fontSize: 26, color: "#fff",
    fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "-0.02em",
  },
  stats: { display: "flex", gap: 8 },
  statChip: {
    fontSize: 10, color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)", padding: "4px 10px", borderRadius: 99,
    fontFamily: "'DM Mono', monospace", display: "flex", alignItems: "center", gap: 5,
  },
  canvasWrap: { flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" },
  svg: { width: "100%", height: "100%", maxHeight: 480 },
  centerAvi: {
    position: "absolute", display: "flex", flexDirection: "column",
    alignItems: "center", gap: 8, pointerEvents: "none",
  },
  centerRing: {
    width: 68, height: 68, borderRadius: "50%",
    border: "2px solid rgba(74,222,128,0.8)",
    boxShadow: "0 0 24px rgba(74,222,128,0.5), 0 0 48px rgba(74,222,128,0.15), inset 0 0 12px rgba(74,222,128,0.1)",
    overflow: "hidden",
  },
  centerImg: { width: "100%", height: "100%", objectFit: "cover" },
  centerLabel: {
    fontSize: 11, color: "#4ade80", fontFamily: "'DM Mono', monospace",
    fontWeight: 800, letterSpacing: "0.05em",
    textShadow: "0 0 12px rgba(74,222,128,0.8)",
  },
  legend: {
    display: "flex", alignItems: "center", gap: 12,
    justifyContent: "center", paddingTop: 10,
  },
  legendItem: {
    display: "flex", alignItems: "center", gap: 6,
    fontSize: 11, color: "rgba(255,255,255,0.4)",
    fontFamily: "'DM Mono', monospace",
  },
  legendSep: { width: 1, height: 12, background: "rgba(255,255,255,0.1)" },
};

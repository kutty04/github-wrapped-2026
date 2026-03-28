import { useEffect, useState } from "react";

export default function CollaborationGraphCard({ data }) {
  const [peers, setPeers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [particles] = useState(() =>
    Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: Math.random() * 1.4 + 0.3,
      opacity: Math.random() * 0.45 + 0.08,
    }))
  );

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 150);
    const check = () => setIsMobile(window.innerWidth < 700);
    check();
    window.addEventListener("resize", check);
    return () => { clearTimeout(t); window.removeEventListener("resize", check); };
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

  // Square viewBox — works perfectly on both mobile and desktop
  const SIZE = 600;
  const cx = SIZE / 2, cy = SIZE / 2;
  const innerR = isMobile ? 110 : 130;
  const outerR = isMobile ? 210 : 240;

  const repoNodes = repos.map((r, i) => {
    const angle = (i / Math.max(repos.length, 1)) * Math.PI * 2 - Math.PI / 2;
    return { ...r, x: cx + Math.cos(angle) * innerR, y: cy + Math.sin(angle) * innerR };
  });

  const peerNodes = peers.map((p, i) => {
    const angle = (i / Math.max(peers.length, 1)) * Math.PI * 2 - Math.PI / 2;
    return { ...p, x: cx + Math.cos(angle) * outerR, y: cy + Math.sin(angle) * outerR };
  });

  return (
    <div style={{
      ...s.card,
      minHeight: isMobile ? 500 : 640,
    }}>
      <div style={s.dotGrid} />
      <div style={s.spaceBg} />
      <div style={s.accentLine} />

      <div style={{ ...s.inner, opacity: visible ? 1 : 0, transform: visible ? "scale(1)" : "scale(0.97)", transition: "opacity 0.8s ease, transform 0.8s ease" }}>

        {/* Compact header for all screen sizes */}
        <div style={s.header}>
          <div>
            <p style={s.eyebrow}>Social Topography</p>
            <h2 style={{ ...s.title, fontSize: isMobile ? 20 : 26 }}>The Collaboration Graph</h2>
          </div>
          <div style={s.stats}>
            <div style={s.statChip}><span style={{ color: "#a855f7" }}>◆</span> {repos.length} Repos</div>
            <div style={s.statChip}><span style={{ color: "#38bdf8" }}>◆</span> {peers.length} Peers</div>
          </div>
        </div>

        {/* Square SVG — aspect-ratio:1 guarantees it scales as a square on any screen */}
        <div style={s.canvasWrap}>
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            style={{ width: "100%", aspectRatio: "1", display: "block", maxWidth: isMobile ? "100%" : 560 }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="cg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#4ade80" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="softGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              {peerNodes.map((p, i) => (
                <clipPath key={`cp-${i}`} id={`cp-${i}`}>
                  <circle cx={p.x} cy={p.y} r={18} />
                </clipPath>
              ))}
            </defs>

            {/* Star particles */}
            {particles.map(p => (
              <circle key={p.id} cx={`${p.x}%`} cy={`${p.y}%`} r={p.r} fill="white" opacity={p.opacity} />
            ))}

            {/* Orbital rings */}
            <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="rgba(56,189,248,0.09)" strokeWidth="1" strokeDasharray="3 9" />
            <circle cx={cx} cy={cy} r={innerR} fill="none" stroke="rgba(168,85,247,0.13)" strokeWidth="1" strokeDasharray="2 6" />

            {/* Peer connection lines */}
            {peerNodes.map((p, i) => (
              <line key={`pl-${i}`} x1={cx} y1={cy} x2={p.x} y2={p.y}
                stroke="rgba(56,189,248,0.18)" strokeWidth="1" strokeDasharray="5 7" />
            ))}
            {/* Repo connection lines */}
            {repoNodes.map((r, i) => (
              <line key={`rl-${i}`} x1={cx} y1={cy} x2={r.x} y2={r.y}
                stroke="rgba(168,85,247,0.5)" strokeWidth="1.5" />
            ))}

            {/* Center glow area */}
            <circle cx={cx} cy={cy} r={75} fill="url(#cg)" />
            <circle cx={cx} cy={cy} r={50}
              fill="rgba(6,9,19,0.85)" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5"
              filter="url(#glow)" />

            {/* Repo nodes */}
            {repoNodes.map((r, i) => (
              <g key={`rn-${i}`} filter="url(#softGlow)">
                <circle cx={r.x} cy={r.y} r={30} fill="rgba(168,85,247,0.05)" />
                <circle cx={r.x} cy={r.y} r={22}
                  fill="rgba(10,8,20,0.95)" stroke="#a855f7" strokeWidth="1.5" />
                <circle cx={r.x} cy={r.y} r={16} fill="rgba(168,85,247,0.12)" />
                <text x={r.x} y={r.y + 6} textAnchor="middle" fontSize="14">⭐</text>
                <text x={r.x} y={r.y + 40} textAnchor="middle"
                  fill="rgba(196,181,253,0.9)" fontSize={isMobile ? 9 : 10} fontFamily="monospace" fontWeight="bold">
                  {(r.name || "").length > 11 ? r.name.slice(0, 11) + "…" : r.name}
                </text>
              </g>
            ))}

            {/* Peer nodes */}
            {peerNodes.map((p, i) => (
              <g key={`pn-${i}`}>
                <circle cx={p.x} cy={p.y} r={26} fill="rgba(56,189,248,0.05)" />
                <circle cx={p.x} cy={p.y} r={20}
                  fill="none" stroke="rgba(56,189,248,0.45)" strokeWidth="1.5" />
                <image href={p.avatar_url} x={p.x - 18} y={p.y - 18} width={36} height={36}
                  clipPath={`url(#cp-${i})`} />
                <text x={p.x} y={p.y + 34} textAnchor="middle"
                  fill="rgba(148,226,255,0.65)" fontSize={isMobile ? 8 : 9} fontFamily="monospace">
                  @{(p.login || "").length > 8 ? p.login.slice(0, 8) + "…" : p.login}
                </text>
              </g>
            ))}
          </svg>

          {/* Center avatar overlay */}
          <div style={{ ...s.centerAvi, gap: isMobile ? 5 : 8 }}>
            <div style={{ ...s.centerRing, width: isMobile ? 56 : 68, height: isMobile ? 56 : 68 }}>
              <img src={data.profile.avatar} alt={data.profile.login} style={s.centerImg} />
            </div>
            <span style={{ ...s.centerLabel, fontSize: isMobile ? 10 : 11 }}>
              @{data.profile.login}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div style={s.legend}>
          <div style={s.legendItem}>
            <span style={s.dot("#4ade80")} />
            You
          </div>
          <div style={s.legendSep} />
          <div style={s.legendItem}>
            <span style={s.dot("#a855f7")} />
            Repos
          </div>
          <div style={s.legendSep} />
          <div style={s.legendItem}>
            <span style={s.dot("#38bdf8")} />
            Followers
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  card: {
    width: "100%",
    background: "linear-gradient(160deg, #05080f 0%, #060913 40%, #060c18 100%)",
    border: "1px solid rgba(56,189,248,0.15)", borderRadius: 28,
    padding: "24px 24px 18px", display: "flex", flexDirection: "column",
    position: "relative", overflow: "hidden",
  },
  dotGrid: {
    position: "absolute", inset: 0,
    backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)",
    backgroundSize: "30px 30px", pointerEvents: "none",
  },
  spaceBg: {
    position: "absolute", inset: 0,
    background: "radial-gradient(ellipse at 50% 55%, rgba(56,189,248,0.07) 0%, rgba(168,85,247,0.04) 40%, transparent 70%)",
    pointerEvents: "none",
  },
  accentLine: {
    position: "absolute", top: 0, left: "15%", right: "15%", height: 1,
    background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.5), rgba(168,85,247,0.5), transparent)",
  },
  inner: { position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" },
  header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 8 },
  eyebrow: {
    margin: 0, fontSize: 11, color: "#38bdf8",
    fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 800,
  },
  title: { margin: "2px 0 0", color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "-0.02em" },
  stats: { display: "flex", gap: 6, flexShrink: 0 },
  statChip: {
    fontSize: 10, color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)", padding: "4px 9px", borderRadius: 99,
    fontFamily: "'DM Mono', monospace", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
  },
  canvasWrap: {
    position: "relative",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "8px 0",
  },
  centerAvi: {
    position: "absolute", display: "flex", flexDirection: "column",
    alignItems: "center", pointerEvents: "none",
  },
  centerRing: {
    borderRadius: "50%", border: "2px solid rgba(74,222,128,0.85)",
    boxShadow: "0 0 20px rgba(74,222,128,0.45), 0 0 40px rgba(74,222,128,0.12)",
    overflow: "hidden",
  },
  centerImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  centerLabel: {
    color: "#4ade80", fontFamily: "'DM Mono', monospace",
    fontWeight: 800, letterSpacing: "0.05em",
    textShadow: "0 0 10px rgba(74,222,128,0.7)",
  },
  legend: {
    display: "flex", alignItems: "center", gap: 12,
    justifyContent: "center", paddingTop: 8,
  },
  legendItem: {
    display: "flex", alignItems: "center", gap: 6,
    fontSize: 11, color: "rgba(255,255,255,0.4)",
    fontFamily: "'DM Mono', monospace",
  },
  legendSep: { width: 1, height: 12, background: "rgba(255,255,255,0.1)" },
  dot: (color) => ({
    width: 7, height: 7, borderRadius: "50%",
    background: color, display: "inline-block",
    boxShadow: `0 0 6px ${color}`,
  }),
};

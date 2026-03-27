import { useEffect, useState } from "react";

export default function CollaborationGraphCard({ data }) {
  const [peers, setPeers] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
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
  const W = 900, H = 460;
  const cx = W / 2, cy = H / 2;

  // Compute repo nodes (inner ring)
  const repoNodes = repos.map((r, i) => {
    const angle = (i / repos.length) * Math.PI * 2 - Math.PI / 2;
    return { ...r, x: cx + Math.cos(angle) * 140, y: cy + Math.sin(angle) * 140, type: "repo" };
  });

  // Compute peer nodes (outer ring)
  const peerNodes = peers.map((p, i) => {
    const angle = (i / Math.max(peers.length, 1)) * Math.PI * 2 - Math.PI / 2;
    return { ...p, x: cx + Math.cos(angle) * 240, y: cy + Math.sin(angle) * 240, type: "peer" };
  });

  return (
    <div style={s.card}>
      <div style={s.dots} />
      <div style={s.radialGlow} />

      <div style={{ ...s.inner, opacity: visible ? 1 : 0, transition: "opacity 1s ease" }}>
        <p style={s.eyebrow}>Social Topography</p>
        <h2 style={s.title}>The Collaboration Graph</h2>

        <div style={s.canvasWrap}>
          <svg viewBox={`0 0 ${W} ${H}`} style={s.svg} xmlns="http://www.w3.org/2000/svg">
            {/* Orbital rings */}
            <ellipse cx={cx} cy={cy} rx={140} ry={140} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <ellipse cx={cx} cy={cy} rx={240} ry={240} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

            {/* Lines to repos */}
            {repoNodes.map((r, i) => (
              <line key={`rl-${i}`} x1={cx} y1={cy} x2={r.x} y2={r.y}
                stroke="rgba(168,85,247,0.4)" strokeWidth="1.5" />
            ))}

            {/* Lines to peers */}
            {peerNodes.map((p, i) => (
              <line key={`pl-${i}`} x1={cx} y1={cy} x2={p.x} y2={p.y}
                stroke="rgba(56,189,248,0.2)" strokeWidth="1" strokeDasharray="4 4" />
            ))}

            {/* Center glow */}
            <circle cx={cx} cy={cy} r={50} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
            <circle cx={cx} cy={cy} r={38} fill="rgba(74,222,128,0.08)" />

            {/* Repo nodes */}
            {repoNodes.map((r, i) => (
              <g key={`rn-${i}`}>
                <circle cx={r.x} cy={r.y} r={22} fill="rgba(168,85,247,0.12)" stroke="#a855f7" strokeWidth="1.5" />
                <text x={r.x} y={r.y + 4} textAnchor="middle" fill="#c4b5fd" fontSize="10" fontFamily="monospace">📂</text>
                <text x={r.x} y={r.y + 36} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9" fontFamily="monospace">
                  {r.name?.length > 12 ? r.name.slice(0, 12) + "…" : r.name}
                </text>
              </g>
            ))}

            {/* Peer nodes */}
            {peerNodes.map((p, i) => (
              <g key={`pn-${i}`}>
                <circle cx={p.x} cy={p.y} r={18} fill="#060913" stroke="rgba(56,189,248,0.5)" strokeWidth="1.5" />
                {/* Peer avatar via foreignObject */}
                <image href={p.avatar_url} x={p.x - 16} y={p.y - 16} width={32} height={32}
                  clipPath={`url(#clip-${i})`} />
                <defs>
                  <clipPath id={`clip-${i}`}>
                    <circle cx={p.x} cy={p.y} r={16} />
                  </clipPath>
                </defs>
                <text x={p.x} y={p.y + 30} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="monospace">
                  @{p.login?.length > 10 ? p.login.slice(0, 10) + "…" : p.login}
                </text>
              </g>
            ))}
          </svg>

          {/* Center avatar (overlaid via absolute) */}
          <div style={s.centerAvi}>
            <img src={data.profile.avatar} alt={data.profile.login} style={s.centerImg} />
            <span style={s.centerLabel}>@{data.profile.login}</span>
          </div>
        </div>

        <div style={s.legend}>
          <span style={s.legendItem}><span style={{ color: "#a855f7" }}>●</span> Repos</span>
          <span style={s.legendItem}><span style={{ color: "#38bdf8" }}>●</span> Followers</span>
          <span style={s.legendItem}><span style={{ color: "#4ade80" }}>●</span> You</span>
        </div>
      </div>
    </div>
  );
}

const s = {
  card: { width: "100%", height: 580, background: "#060913", border: "1px solid rgba(56,189,248,0.2)", borderRadius: 24, padding: "24px 24px 16px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" },
  dots: { position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" },
  radialGlow: { position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 60%, rgba(56,189,248,0.06) 0%, transparent 65%)", pointerEvents: "none" },
  inner: { position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" },
  eyebrow: { margin: "0 0 6px", fontSize: 12, color: "#38bdf8", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 800, textAlign: "center" },
  title: { margin: "0 0 12px", fontSize: 28, color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "-0.02em", textAlign: "center" },
  canvasWrap: { flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" },
  svg: { width: "100%", height: "100%", maxHeight: 440 },
  centerAvi: { position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, pointerEvents: "none" },
  centerImg: { width: 60, height: 60, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,0.9)", boxShadow: "0 0 32px rgba(74,222,128,0.4)" },
  centerLabel: { fontSize: 11, color: "#4ade80", fontFamily: "'DM Mono', monospace", fontWeight: 700 },
  legend: { display: "flex", gap: 20, justifyContent: "center", paddingTop: 8 },
  legendItem: { fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace", display: "flex", alignItems: "center", gap: 6 }
};

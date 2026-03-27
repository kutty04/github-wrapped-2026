import { useEffect, useState } from "react";

export default function CollaborationGraphCard({ data }) {
  const [nodes, setNodes] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // Generate initial center node
    const network = [
      { id: "center", type: "user", label: `@${data.profile.login}`, avatar: data.profile.avatar, x: 50, y: 50, size: 64, pulse: true }
    ];

    // Add top repos as inner satellite nodes
    const repos = data.topRepos.slice(0, 4);
    repos.forEach((r, i) => {
      const angle = (i / repos.length) * Math.PI * 2;
      const radius = 22; // inner ring %
      network.push({
        id: r.name, type: "repo", label: r.name, size: 36,
        x: 50 + Math.cos(angle) * (radius * 0.7), // aspect ratio correction
        y: 50 + Math.sin(angle) * radius
      });
    });

    // Attempt to pull network from Nemesis card cache or dynamically fetch real-time peers
    const storedFollowers = sessionStorage.getItem(`net_${data.profile.login}`);
    if (storedFollowers) {
      const peers = JSON.parse(storedFollowers).slice(0, 6);
      peers.forEach((p, i) => {
        const angle = (i / peers.length) * Math.PI * 2 + (Math.PI / 4);
        const radius = 40; // outer ring %
        network.push({
           id: p.login, type: "peer", label: `@${p.login}`, avatar: p.avatar_url, size: 44,
           x: 50 + Math.cos(angle) * (radius * 0.7),
           y: 50 + Math.sin(angle) * radius
        });
      });
      setNodes(network);
    } else {
      fetch(`https://api.github.com/users/${data.profile.login}/followers?per_page=6`)
        .then(r => r.json())
        .then(peers => {
           if (!Array.isArray(peers)) return;
           sessionStorage.setItem(`net_${data.profile.login}`, JSON.stringify(peers));
           const freshNetwork = [...network];
           peers.forEach((p, i) => {
              const angle = (i / peers.length) * Math.PI * 2 + (Math.PI / 4);
              const radius = 40;
              freshNetwork.push({
                 id: p.login, type: "peer", label: `@${p.login}`, avatar: p.avatar_url, size: 44,
                 x: 50 + Math.cos(angle) * (radius * 0.7),
                 y: 50 + Math.sin(angle) * radius
              });
           });
           setNodes(freshNetwork);
        }).catch(() => setNodes(network));
    }
  }, [data]);

  return (
    <div style={s.card}>
      <div style={s.dots} aria-hidden />

      <div style={{ ...s.inner, opacity: visible ? 1:0, transform: visible ? "scale(1)":"scale(0.95)", transition: "all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}>
         <div style={s.textHdr}>
           <p style={s.eyebrow}>Social Topography</p>
           <h2 style={s.title}>The Collaboration Graph</h2>
         </div>
         
         <div style={s.graphWrap}>
            {/* Physical SVG structural bindings linking the constellation network */}
            <svg style={s.svgLayer}>
               {nodes.filter(n => n.id !== "center").map(n => (
                  <line key={`line-${n.id}`} x1="50%" y1="50%" x2={`${n.x}%`} y2={`${n.y}%`} stroke={n.type === "repo" ? "rgba(168, 85, 247, 0.4)" : "rgba(56, 189, 248, 0.25)"} strokeWidth="1.5" strokeDasharray={n.type === "repo" ? "0" : "4 4"} />
               ))}
               {/* Orbital planetary rings */}
               <ellipse cx="50%" cy="50%" rx="15.4%" ry="22%" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
               <ellipse cx="50%" cy="50%" rx="28%" ry="40%" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
            </svg>

            {/* Mathematical DOM nodes calculating vector projection explicitly onto canvas block */}
            {nodes.map(n => (
               <div key={n.id} style={{ ...s.node, left: `${n.x}%`, top: `${n.y}%`, width: n.size, height: n.size, margin: -n.size/2,
                  background: n.type === "repo" ? "rgba(168, 85, 247, 0.15)" : "#000",
                  border: n.type === "center" ? "2px solid #fff" : n.type === "repo" ? "1px solid #a855f7" : "1px solid rgba(56, 189, 248, 0.5)",
                  boxShadow: n.pulse ? "0 0 24px rgba(255,255,255,0.2)" : "0 4px 12px rgba(0,0,0,0.5)"
               }}>
                  {n.avatar ? <img src={n.avatar} alt={n.id} style={s.nodeImg} /> : <span style={s.repoIcon}>📂</span>}
                  <span style={s.nodeLabel}>{n.label}</span>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}

const s = {
  card: { width: "100%", maxWidth: "100%", gridColumn: "1 / -1", height: 500, background: "#060913", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: 24, padding: "24px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" },
  dots: { position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "30px 30px" },
  inner: { position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" },
  textHdr: { pointerEvents: "none" },
  eyebrow: { margin: "0 0 8px", fontSize: 13, color: "#38bdf8", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 800 },
  title: { margin: "0 0 16px", fontSize: 32, color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "-0.02em" },
  graphWrap: { flex: 1, width: "100%", position: "relative", marginTop: "auto", overflow: "visible" },
  svgLayer: { position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" },
  node: { position: "absolute", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.4s ease", zIndex: 10, cursor: "pointer" },
  nodeImg: { width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", pointerEvents: "none" },
  repoIcon: { fontSize: 16, filter: "grayscale(1) brightness(2)" },
  nodeLabel: { position: "absolute", bottom: -28, fontSize: 11, color: "rgba(255,255,255,0.8)", fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap", background: "rgba(0,0,0,0.8)", padding: "4px 8px", borderRadius: 4, backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.1)", pointerEvents: "none" }
};

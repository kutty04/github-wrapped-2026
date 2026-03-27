import { useEffect, useState } from "react";

const LANG_COLORS = {
  JavaScript: "#f7df1e", TypeScript: "#3178c6", Python: "#3572A5",
  HTML: "#e34c26", CSS: "#563d7c", Java: "#b07219", "C++": "#f34b7d",
  C: "#555555", Go: "#00ADD8", Rust: "#dea584", Ruby: "#701516",
  Swift: "#F05138", Kotlin: "#A97BFF", PHP: "#4F5D95", Shell: "#89e051",
};

function getLangColor(lang) {
  return LANG_COLORS[lang] || "#8b949e";
}

export default function ReposCard({ data }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 50); return () => clearTimeout(t); }, []);

  const repos = data.topRepos.slice(0, 4);

  return (
    <div style={s.card}>
      <div style={s.dots} aria-hidden />
      <div style={{
        ...s.inner,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}>
        {/* Top */}
        <div style={s.topLabel}>
          <img src={data.profile.avatar} alt={data.profile.login} style={s.avatar} />
          <span style={s.username}>@{data.profile.login}</span>
          <span style={s.yearBadge}>{data.year}</span>
        </div>

        {/* Header */}
        <div style={s.statSection}>
          <p style={s.eyebrow}>Top repositories</p>
          <div style={s.bigNumber}>{data.ownedRepos}</div>
          <p style={s.statLabel}>repos built so far</p>
        </div>

        {/* Repo list */}
        <div style={s.repoList}>
          {repos.length === 0 ? (
            <div style={s.emptyState}>No public repos yet — time to build something!</div>
          ) : repos.map((repo, i) => (
            <div key={repo.name} style={{
              ...s.repoRow,
              animationDelay: `${i * 0.1}s`,
              borderColor: i === 0 ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.06)",
            }}>
              {/* Rank */}
              <div style={{
                ...s.rank,
                color: i === 0 ? "#4ade80" : "rgba(255,255,255,0.2)",
              }}>
                #{i + 1}
              </div>

              {/* Info */}
              <div style={s.repoInfo}>
                <span style={{
                  ...s.repoName,
                  color: i === 0 ? "#ffffff" : "rgba(255,255,255,0.7)",
                }}>
                  {repo.name}
                </span>
                {repo.language && (
                  <div style={s.langPill}>
                    <div style={{
                      ...s.langDot,
                      background: getLangColor(repo.language),
                    }} />
                    <span style={s.langText}>{repo.language}</span>
                  </div>
                )}
              </div>

              {/* Stars */}
              <div style={s.starBadge}>
                <span style={s.starIcon}>★</span>
                <span style={s.starCount}>{repo.stars}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Total stars */}
        <div style={s.totalStars}>
          <span style={s.totalLabel}>total stars earned</span>
          <span style={s.totalNum}>★ {data.totalStars}</span>
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
  statSection: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 16 },
  eyebrow: {
    fontSize: 14, color: "rgba(255,255,255,0.4)", margin: "0 0 8px",
    fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase",
  },
  bigNumber: {
    fontSize: "clamp(64px, 18vw, 88px)", fontWeight: 800, color: "#ffffff",
    lineHeight: 1, fontFamily: "'Syne', sans-serif", letterSpacing: "-0.04em", margin: "0 0 10px",
  },
  statLabel: { fontSize: 18, color: "rgba(255,255,255,0.5)", margin: "0 0 24px", fontFamily: "'DM Mono', monospace" },
  repoList: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 },
  repoRow: {
    display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
    background: "rgba(255,255,255,0.03)", border: "1px solid",
    borderRadius: 12,
  },
  rank: { fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", minWidth: 24 },
  repoInfo: { flex: 1, display: "flex", flexDirection: "column", gap: 4, minWidth: 0 },
  repoName: { fontSize: 13, fontWeight: 600, fontFamily: "'DM Mono', monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  langPill: { display: "flex", alignItems: "center", gap: 5 },
  langDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  langText: { fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Mono', monospace" },
  starBadge: { display: "flex", alignItems: "center", gap: 3, flexShrink: 0 },
  starIcon: { fontSize: 12, color: "#facc15" },
  starCount: { fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace" },
  totalStars: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 16px", background: "rgba(250,204,21,0.06)",
    border: "1px solid rgba(250,204,21,0.15)", borderRadius: 10,
  },
  totalLabel: { fontSize: 12, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em" },
  totalNum: { fontSize: 14, fontWeight: 600, color: "#facc15", fontFamily: "'DM Mono', monospace" },
  emptyState: { fontSize: 13, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace", textAlign: "center", padding: "20px 0" },
};

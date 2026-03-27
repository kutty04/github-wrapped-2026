import { useEffect, useState } from "react";

const LANG_COLORS = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Dart: "#00B4AB",
  Scala: "#c22d40",
  Vue: "#41b883",
  default: "#4ade80",
};

function getLangColor(name) {
  return LANG_COLORS[name] ?? LANG_COLORS.default;
}

export default function LanguagesCard({ data }) {
  const [animated, setAnimated] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 50);
    const t2 = setTimeout(() => setAnimated(true), 300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const top = data.topLanguages.slice(0, 5);

  return (
    <div style={styles.card}>
      <div style={styles.dots} aria-hidden />
      <div
        style={{
          ...styles.inner,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.eyebrow}>Your languages</span>
          <span style={styles.year}>{data.year}</span>
        </div>

        {/* Stacked color bar */}
        <div style={styles.rainbow}>
          {top.map((lang) => (
            <div
              key={lang.name}
              title={`${lang.name}: ${lang.percent}%`}
              style={{
                flex: lang.percent,
                background: getLangColor(lang.name),
                transition: "flex 1s cubic-bezier(0.34,1.56,0.64,1)",
              }}
            />
          ))}
        </div>

        {/* Language list */}
        <div style={styles.list}>
          {top.map((lang, i) => (
            <div key={lang.name} style={styles.langRow}>
              <div style={styles.langLeft}>
                <div
                  style={{
                    ...styles.dot,
                    background: getLangColor(lang.name),
                  }}
                />
                <span style={styles.langName}>{lang.name}</span>
              </div>

              <div style={styles.barWrap}>
                <div
                  style={{
                    ...styles.barFill,
                    width: animated ? `${lang.percent}%` : "0%",
                    background: getLangColor(lang.name) + "80",
                    borderRight: `2px solid ${getLangColor(lang.name)}`,
                    transitionDelay: `${i * 80}ms`,
                  }}
                />
              </div>

              <span style={styles.percent}>{lang.percent}%</span>
            </div>
          ))}
        </div>

        {/* Top language callout */}
        {top[0] && (
          <div style={styles.callout}>
            <span style={{ color: getLangColor(top[0].name), fontWeight: 700 }}>
              {top[0].name}
            </span>
            {" "}is your primary language
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    width: "100%",
    maxWidth: 420,
    aspectRatio: "9 / 16",
    background: "#0f1117",
    borderRadius: 24,
    position: "relative",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.07)",
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
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "28px 28px 28px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.35)",
    fontFamily: "'DM Mono', monospace",
  },
  year: {
    fontSize: 11,
    color: "rgba(255,255,255,0.2)",
    fontFamily: "'DM Mono', monospace",
    letterSpacing: "0.1em",
  },
  rainbow: {
    display: "flex",
    height: 8,
    borderRadius: 99,
    overflow: "hidden",
    gap: 2,
    marginBottom: 40,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    flex: 1,
  },
  langRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  langLeft: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: 110,
    flexShrink: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    flexShrink: 0,
  },
  langName: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontFamily: "'DM Mono', monospace",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  barWrap: {
    flex: 1,
    height: 6,
    background: "rgba(255,255,255,0.06)",
    borderRadius: 99,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 99,
    transition: "width 0.9s cubic-bezier(0.34,1.56,0.64,1)",
  },
  percent: {
    fontSize: 13,
    color: "rgba(255,255,255,0.35)",
    fontFamily: "'DM Mono', monospace",
    width: 36,
    textAlign: "right",
    flexShrink: 0,
  },
  callout: {
    marginTop: 32,
    fontSize: 14,
    color: "rgba(255,255,255,0.4)",
    fontFamily: "'DM Mono', monospace",
    borderTop: "1px solid rgba(255,255,255,0.07)",
    paddingTop: 20,
  },
};

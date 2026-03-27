import { useEffect, useState } from "react";

function getColor(count) {
  if (count === 0) return "rgba(255,255,255,0.05)";
  if (count <= 2)  return "rgba(74,222,128,0.25)";
  if (count <= 5)  return "rgba(74,222,128,0.5)";
  if (count <= 10) return "rgba(74,222,128,0.75)";
  return "rgba(74,222,128,1)";
}

const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_LABELS   = ["S","M","T","W","T","F","S"];

export default function HeatmapCard({ data }) {
  const [visible, setVisible] = useState(false);
  const [currentDay, setCurrentDay] = useState(0);

  useEffect(() => { 
    const t = setTimeout(() => setVisible(true), 50); 
    return () => clearTimeout(t); 
  }, []);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setCurrentDay(prev => {
        if (prev >= 364) {
          clearInterval(interval);
          return 364;
        }
        return prev + 1;
      });
    }, 15);
    return () => clearInterval(interval);
  }, [visible]);

  const flatMap = data.heatmap.flat();
  const visibleDays = flatMap.slice(0, currentDay + 1).filter(d => d.count > 0).length;
  const visibleEvents = flatMap.slice(0, currentDay + 1).reduce((s, d) => s + d.count, 0);

  // Figure out month label positions (which week each month starts)
  const monthPositions = [];
  let lastMonth = -1;
  data.heatmap.forEach((week, wi) => {
    const month = parseInt(week[0].date.split("-")[1], 10) - 1;
    if (month !== lastMonth) { monthPositions.push({ wi, label: MONTH_LABELS[month] }); lastMonth = month; }
  });

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

        {/* Title */}
        <div style={s.statSection}>
          <p style={s.eyebrow}>Contribution map</p>
          <div style={s.bigNumber}>{visibleDays}</div>
          <p style={s.statLabel}>active days this year</p>
        </div>

        {/* Heatmap grid */}
        <div style={s.heatmapWrap}>
          {/* Month labels */}
          <div style={s.monthRow}>
            {/* Day label spacer */}
            <div style={{ width: 14 }} />
            <div style={{ position: "relative", flex: 1, height: 16 }}>
              {monthPositions.slice(0, 12).map(({ wi, label }) => (
                <span key={label} style={{
                  ...s.monthLabel,
                  left: `${(wi / 52) * 100}%`,
                }}>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div style={s.gridRow}>
            {/* Day labels */}
            <div style={s.dayLabels}>
              {DAY_LABELS.map((d, i) => (
                <span key={i} style={s.dayLabel}>{i % 2 === 1 ? d : ""}</span>
              ))}
            </div>

            {/* Weeks */}
            <div style={s.weeksGrid}>
              {data.heatmap.map((week, wi) => (
                <div key={wi} style={s.weekCol}>
                  {week.map((day, di) => {
                    const localIndex = wi * 7 + di;
                    const isActive = localIndex <= currentDay;
                    const cCount = isActive ? day.count : 0;
                    return (
                      <div
                        key={di}
                        title={`${day.date}: ${day.count} events`}
                        style={{
                          ...s.cell,
                          background: getColor(cCount),
                          transition: "background 0.1s linear",
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div style={s.legend}>
            <span style={s.legendLabel}>less</span>
            {[0, 2, 5, 10, 15].map(v => (
              <div key={v} style={{ ...s.cell, width: 8, height: 8, minHeight: 8, background: getColor(v), flexShrink: 0 }} />
            ))}
            <span style={s.legendLabel}>more</span>
          </div>
        </div>

        {/* Stats row */}
        <div style={s.statsRow}>
          <div style={s.statPill}>
            <span style={s.pillNum}>{visibleEvents}</span>
            <span style={s.pillLabel}>total events</span>
          </div>
          <div style={s.statPill}>
            <span style={s.pillNum}>{data.ownedRepos}</span>
            <span style={s.pillLabel}>repos</span>
          </div>
          <div style={s.statPill}>
            <span style={s.pillNum}>{data.totalStars}</span>
            <span style={s.pillLabel}>stars</span>
          </div>
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
    display: "flex", flexDirection: "column", padding: "28px 20px 24px",
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
    fontSize: "clamp(56px, 15vw, 80px)", fontWeight: 800, color: "#4ade80",
    lineHeight: 1, fontFamily: "'Syne', sans-serif", letterSpacing: "-0.04em", margin: "0 0 10px",
  },
  statLabel: { fontSize: 18, color: "rgba(255,255,255,0.5)", margin: "0 0 24px", fontFamily: "'DM Mono', monospace" },
  heatmapWrap: { marginBottom: 20 },
  monthRow: { display: "flex", alignItems: "flex-end", marginBottom: 4 },
  monthLabel: {
    position: "absolute", fontSize: 9, color: "rgba(255,255,255,0.3)",
    fontFamily: "'DM Mono', monospace", letterSpacing: "0.04em", whiteSpace: "nowrap",
  },
  gridRow: { display: "flex", gap: 4 },
  dayLabels: { display: "flex", flexDirection: "column", gap: 2, paddingTop: 0, width: 10 },
  dayLabel: { fontSize: 8, color: "rgba(255,255,255,0.2)", fontFamily: "'DM Mono', monospace", height: 9, lineHeight: "9px", textAlign: "center" },
  weeksGrid: { display: "flex", gap: 2, flex: 1 },
  weekCol: { display: "flex", flexDirection: "column", gap: 2, flex: 1 },
  cell: { width: "100%", aspectRatio: "1 / 1", borderRadius: 2, minHeight: 7 },
  legend: { display: "flex", alignItems: "center", gap: 3, marginTop: 6, justifyContent: "flex-end" },
  legendLabel: { fontSize: 9, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace" },
  statsRow: { display: "flex", gap: 8 },
  statPill: {
    flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
    padding: "10px 8px", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10,
  },
  pillNum: { fontSize: 18, fontWeight: 700, color: "#ffffff", fontFamily: "'Syne', sans-serif" },
  pillLabel: { fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", marginTop: 2 },
};

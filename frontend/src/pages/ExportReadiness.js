import { useState } from "react";

const CHECKS = [
  { key: "iec",          label: "IEC Registration",          points: 20, detail: "Import Export Code from DGFT portal" },
  { key: "product",      label: "Product Listed on Platform", points: 15, detail: "At least one product configured" },
  { key: "apeda",        label: "APEDA / RCMC Registration",  points: 15, detail: "Required for agricultural & processed food exports" },
  { key: "quality_cert", label: "Quality Certification",      points: 20, detail: "BIS / ISO / FSSAI / WHO-GMP as applicable" },
  { key: "buyers",       label: "Buyer Contacts Identified",  points: 15, detail: "At least 3 verified international buyers" },
  { key: "bank",         label: "Export Bank Account (EEFC)", points: 15, detail: "Exchange Earners Foreign Currency account" },
];

function getLevel(score) {
  if (score >= 85) return { label: "Export Ready ✓", color: "#16a34a", bg: "#f0fdf4" };
  if (score >= 60) return { label: "Almost Ready", color: "#ca8a04", bg: "#fefce8" };
  if (score >= 30) return { label: "Getting Started", color: "#2563eb", bg: "#eff6ff" };
  return { label: "Just Beginning", color: "#dc2626", bg: "#fef2f2" };
}

function ExportReadiness() {
  const [checked, setChecked] = useState({
    iec: false, product: false, apeda: false,
    quality_cert: false, buyers: false, bank: false,
  });

  const score = CHECKS.reduce((acc, c) => acc + (checked[c.key] ? c.points : 0), 0);
  const level = getLevel(score);
  const remaining = CHECKS.filter(c => !checked[c.key]);
  const nextGain = remaining.slice(0, 3).reduce((a, c) => a + c.points, 0);

  const toggle = (key) => setChecked(prev => ({ ...prev, [key]: !prev[key] }));

  // Circle arc math
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const dash = (score / 100) * circ;

  return (
    <div style={{ background: "white", padding: "3rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(15,30,58,0.12)", border: "1px solid #e2e8f0" }}>
      <h2 style={{ color: "#0f1e3a", marginBottom: "2rem", fontSize: "1.4rem", fontWeight: "800" }}>
        📊 Export Readiness Score
      </h2>

      {/* Score circle + level */}
      <div style={{ display: "flex", alignItems: "center", gap: "2.5rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
        {/* SVG circle */}
        <div style={{ position: "relative", width: "140px", height: "140px", flexShrink: 0 }}>
          <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="70" cy="70" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="10" />
            <circle
              cx="70" cy="70" r={radius} fill="none"
              stroke={level.color} strokeWidth="10"
              strokeDasharray={`${dash} ${circ}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 0.5s ease" }}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "2rem", fontWeight: "900", color: level.color, lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "600" }}>/ 100</span>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "inline-block", background: level.bg, color: level.color, borderRadius: "20px", padding: "0.35rem 1rem", fontSize: "0.85rem", fontWeight: "800", marginBottom: "0.75rem" }}>
            {level.label}
          </div>
          <p style={{ color: "#4a5568", fontSize: "0.88rem", lineHeight: "1.6", margin: 0 }}>
            {score >= 100
              ? "Congratulations! Your business is fully export-ready."
              : `Complete ${remaining.slice(0,3).map(c=>c.label).join(", ")} to unlock +${nextGain} points and reach ${Math.min(score + nextGain, 100)}/100.`}
          </p>
        </div>
      </div>

      {/* Checklist */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {CHECKS.map(c => {
          const done = checked[c.key];
          return (
            <div
              key={c.key}
              onClick={() => toggle(c.key)}
              style={{
                display: "flex", alignItems: "center", gap: "1rem",
                padding: "1rem 1.25rem",
                background: done ? "#f0fdf4" : "#f8fafc",
                border: `1.5px solid ${done ? "#86efac" : "#e2e8f0"}`,
                borderRadius: "8px", cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {/* Checkbox */}
              <div style={{
                width: "1.4rem", height: "1.4rem", borderRadius: "50%", flexShrink: 0,
                background: done ? "#16a34a" : "white",
                border: `2px solid ${done ? "#16a34a" : "#cbd5e1"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s ease",
              }}>
                {done && <span style={{ color: "white", fontSize: "0.7rem", fontWeight: "900" }}>✓</span>}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "700", color: done ? "#15803d" : "#0f1e3a", fontSize: "0.9rem" }}>
                  {c.label}
                </div>
                <div style={{ fontSize: "0.76rem", color: "#64748b", marginTop: "0.1rem" }}>{c.detail}</div>
              </div>

              <span style={{
                background: done ? "#16a34a" : "#e2e8f0",
                color: done ? "white" : "#64748b",
                borderRadius: "12px", padding: "0.2rem 0.65rem",
                fontSize: "0.78rem", fontWeight: "700", flexShrink: 0,
                transition: "all 0.2s ease",
              }}>
                +{c.points} pts
              </span>
            </div>
          );
        })}
      </div>

      {/* Next steps banner */}
      {score < 100 && remaining.length > 0 && (
        <div style={{ marginTop: "2rem", padding: "1.25rem 1.5rem", background: "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)", borderRadius: "8px", color: "white" }}>
          <div style={{ fontWeight: "700", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
            🎯 Complete these {Math.min(remaining.length, 3)} steps to reach {Math.min(score + nextGain, 100)}/100
          </div>
          <ul style={{ margin: 0, paddingLeft: "1.25rem", opacity: 0.9 }}>
            {remaining.slice(0, 3).map(c => (
              <li key={c.key} style={{ fontSize: "0.82rem", lineHeight: "1.8" }}>
                {c.label} <span style={{ color: "#d4af37" }}>+{c.points} pts</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ExportReadiness;

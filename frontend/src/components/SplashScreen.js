import { useState, useEffect } from "react";

const STEPS = [
  { text: "Connecting Global Markets",    delay: 600 },
  { text: "Loading Compliance Database",  delay: 1200 },
  { text: "Initializing AI Trade Engine", delay: 1900 },
  { text: "AI Models Ready",              delay: 2500 },
];

function SplashScreen({ onFinish }) {
  const [done, setDone] = useState([]);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    STEPS.forEach((s, i) => {
      setTimeout(() => setDone(prev => [...prev, i]), s.delay);
    });
    setTimeout(() => setFadeOut(true), 3200);
    setTimeout(() => onFinish(), 3700);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: fadeOut ? 0 : 1, transition: "opacity 0.5s ease",
    }}>
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>🌏</div>
        <h1 style={{ color: "white", fontSize: "2.5rem", fontWeight: "900", margin: 0, letterSpacing: "-1px" }}>
          Export<span style={{ color: "#d4af37" }}>Ready</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginTop: "0.5rem" }}>
          Initializing Trade Intelligence...
        </p>
      </div>

      {/* Progress steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", minWidth: "300px" }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            opacity: done.includes(i) ? 1 : 0.25,
            transition: "opacity 0.4s ease",
          }}>
            <div style={{
              width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
              background: done.includes(i) ? "#d4af37" : "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.4s ease",
            }}>
              {done.includes(i) && <span style={{ color: "#0f1e3a", fontSize: "0.65rem", fontWeight: "900" }}>✓</span>}
            </div>
            <span style={{ color: done.includes(i) ? "white" : "rgba(255,255,255,0.4)", fontSize: "0.88rem", fontWeight: done.includes(i) ? "600" : "400", transition: "all 0.4s ease" }}>
              {s.text}
            </span>
          </div>
        ))}
      </div>

      {/* Animated bar */}
      <div style={{ marginTop: "3rem", width: "300px", height: "3px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{
          height: "100%",
          background: "linear-gradient(90deg, #d4af37, #f59e0b)",
          borderRadius: "2px",
          width: `${(done.length / STEPS.length) * 100}%`,
          transition: "width 0.4s ease",
        }} />
      </div>
    </div>
  );
}

export default SplashScreen;

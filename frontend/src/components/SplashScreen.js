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

  const progress = (done.length / STEPS.length) * 100;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#0b1628",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: fadeOut ? 0 : 1, transition: "opacity 0.5s ease",
    }}>
      {/* Subtle grid background */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: "linear-gradient(#d4af37 1px, transparent 1px), linear-gradient(90deg, #d4af37 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      {/* Glow */}
      <div style={{
        position: "absolute", width: "600px", height: "600px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Logo mark */}
        <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "18px", margin: "0 auto 1.5rem",
            background: "linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 100%)",
            border: "1.5px solid rgba(212,175,55,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 40px rgba(212,175,55,0.12)",
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
          <h1 style={{ color: "white", fontSize: "2.25rem", fontWeight: "800", margin: "0 0 6px", letterSpacing: "-1px" }}>
            Export<span style={{ color: "#d4af37" }}>Ready</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", letterSpacing: "2px", textTransform: "uppercase", fontWeight: "500", margin: 0 }}>
            Global Trade Intelligence Platform
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "320px", marginBottom: "2.5rem" }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: "12px",
              opacity: done.includes(i) ? 1 : 0.2,
              transition: "opacity 0.4s ease",
            }}>
              <div style={{
                width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
                background: done.includes(i) ? "#d4af37" : "rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.4s ease",
                boxShadow: done.includes(i) ? "0 0 10px rgba(212,175,55,0.4)" : "none",
              }}>
                {done.includes(i) && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#0f1e3a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="2 6 5 9 10 3"/>
                  </svg>
                )}
              </div>
              <span style={{ color: done.includes(i) ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)", fontSize: "0.84rem", fontWeight: done.includes(i) ? "500" : "400", transition: "all 0.4s ease" }}>
                {s.text}
              </span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ width: "320px", height: "2px", background: "rgba(255,255,255,0.07)", borderRadius: "2px", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            background: "linear-gradient(90deg, #d4af37, #f0c040)",
            borderRadius: "2px",
            width: `${progress}%`,
            transition: "width 0.4s ease",
          }} />
        </div>
        <div style={{ marginTop: "10px", fontSize: "0.72rem", color: "rgba(255,255,255,0.2)", fontWeight: "500" }}>
          {Math.round(progress)}% complete
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;

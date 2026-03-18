// ChooseRole.js
// Step 1: Role selection for signup flow
import React, { useEffect, useState } from "react";

export default function ChooseRole({ setRole, onNext }) {
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute("data-theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2.5rem", width: "100%" }}>
      <div style={{ alignSelf: "flex-end" }}>
        <button
          type="button"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          style={{
            padding: "0.4rem 0.75rem",
            borderRadius: 8,
            border: "1px solid var(--aurora-border)",
            background: "var(--aurora-surface)",
            color: "var(--aurora-text)",
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          Theme: {theme === "light" ? "Light" : "Dark"}
        </button>
      </div>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--aurora-text)", marginBottom: 0 }}>Create your ExportReady Account</h2>
      <p style={{ color: "var(--aurora-text-secondary)", marginTop: 0, marginBottom: "1.5rem" }}>I am a:</p>
      <div style={{ display: "flex", gap: "2.5rem", width: "100%", justifyContent: "center" }}>
        <div
          style={{
            flex: 1,
            minWidth: 180,
            padding: "2.2rem 1.5rem",
            border: "2px solid var(--aurora-border)",
            borderRadius: 14,
            background: "var(--aurora-card)",
            cursor: "pointer",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(15,30,58,0.04)",
            transition: "border 0.2s, box-shadow 0.2s"
          }}
          onClick={() => { setRole("exporter"); onNext(); }}
        >
          <div style={{ fontSize: "2.2rem" }}>🌍</div>
          <div style={{ fontWeight: 700, fontSize: "1.1rem", margin: "0.7rem 0 0.2rem", color: "var(--aurora-text)" }}>Exporter</div>
          <div style={{ color: "var(--aurora-text-muted)", fontSize: "0.98rem" }}>Sell products globally</div>
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 180,
            padding: "2.2rem 1.5rem",
            border: "2px solid var(--aurora-border)",
            borderRadius: 14,
            background: "var(--aurora-card)",
            cursor: "pointer",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(15,30,58,0.04)",
            transition: "border 0.2s, box-shadow 0.2s"
          }}
          onClick={() => { setRole("importer"); onNext(); }}
        >
          <div style={{ fontSize: "2.2rem" }}>🛒</div>
          <div style={{ fontWeight: 700, fontSize: "1.1rem", margin: "0.7rem 0 0.2rem", color: "var(--aurora-text)" }}>Importer</div>
          <div style={{ color: "var(--aurora-text-muted)", fontSize: "0.98rem" }}>Find suppliers worldwide</div>
        </div>
      </div>
    </div>
  );
}

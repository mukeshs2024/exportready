// ChooseRole.js
// Step 1: Role selection for signup flow
import React from "react";

export default function ChooseRole({ setRole, onNext }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2.5rem", width: "100%" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f1e3a", marginBottom: 0 }}>Create your ExportReady Account</h2>
      <p style={{ color: "#4a5568", marginTop: 0, marginBottom: "1.5rem" }}>I am a:</p>
      <div style={{ display: "flex", gap: "2.5rem", width: "100%", justifyContent: "center" }}>
        <div
          style={{
            flex: 1,
            minWidth: 180,
            padding: "2.2rem 1.5rem",
            border: "2px solid #e2e8f0",
            borderRadius: 14,
            background: "#f8fafc",
            cursor: "pointer",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(15,30,58,0.04)",
            transition: "border 0.2s, box-shadow 0.2s"
          }}
          onClick={() => { setRole("exporter"); onNext(); }}
        >
          <div style={{ fontSize: "2.2rem" }}>🌍</div>
          <div style={{ fontWeight: 700, fontSize: "1.1rem", margin: "0.7rem 0 0.2rem" }}>Exporter</div>
          <div style={{ color: "#64748b", fontSize: "0.98rem" }}>Sell products globally</div>
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 180,
            padding: "2.2rem 1.5rem",
            border: "2px solid #e2e8f0",
            borderRadius: 14,
            background: "#f8fafc",
            cursor: "pointer",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(15,30,58,0.04)",
            transition: "border 0.2s, box-shadow 0.2s"
          }}
          onClick={() => { setRole("importer"); onNext(); }}
        >
          <div style={{ fontSize: "2.2rem" }}>🛒</div>
          <div style={{ fontWeight: 700, fontSize: "1.1rem", margin: "0.7rem 0 0.2rem" }}>Importer</div>
          <div style={{ color: "#64748b", fontSize: "0.98rem" }}>Find suppliers worldwide</div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";

// ── SVG icons ────────────────────────────────────────────────────────────────────
// Section icons
function IcBell() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
}
function IcGlobe() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
}
function IcLink() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
}
function IcCreditCard() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
}
function IcSettings() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
}
function IcDownload() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
}
// Integration icons
function IcBuilding() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>;
}
function IcFile() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
}
function IcLeaf() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 19.34A1 1 0 0 0 4.82 21C7 21 14.14 19 17.42 12"/><path d="M17 8C9 8 4 16 4 16s6-4 13-4"/></svg>;
}
function IcTruck() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
}

const INIT_PREFS = {
  emailCompliance:  true,
  emailMarkets:     false,
  emailDocuments:   true,
  emailWeekly:      true,
  language:         "English",
  currency:         "INR (₹)",
  timezone:         "Asia/Kolkata (IST)",
};

const INTEGRATIONS = [
  { id: "dgft",  name: "DGFT Portal",          desc: "Import Export Code & IEC status",         connected: true,  icon: <IcBuilding /> },
  { id: "iec",   name: "IEC Certificate",       desc: "Auto-renewal reminders & status sync",    connected: true,  icon: <IcFile /> },
  { id: "gst",   name: "GSTIN Portal",          desc: "GST returns & LUT filing reminders",      connected: false, icon: <IcFile /> },
  { id: "apeda", name: "APEDA / RCMC",          desc: "Agricultural export certification",        connected: false, icon: <IcLeaf /> },
  { id: "fedex", name: "FedEx Logistics",       desc: "Shipment tracking & rate quotes",         connected: false, icon: <IcTruck /> },
];

const PLAN = {
  name:    "Pro Exporter",
  billing: "Annual",
  renewal: "March 2027",
  price:   "₹4,999 / year",
  features: [
    "Unlimited market analysis",
    "AI compliance checker",
    "Full document generation",
    "Priority support",
    "Export readiness tracking",
  ],
};

// ── Section wrapper ───────────────────────────────────────────────────────
function Section({ title, icon, desc, children }) {
  return (
    <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e8ecf0", boxShadow: "0 1px 4px rgba(15,30,58,0.05)", overflow: "hidden" }}>
      <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f1e3a", flexShrink: 0 }}>{icon}</span>
          <span style={{ fontWeight: "700", color: "#0f1e3a", fontSize: "0.9rem" }}>{title}</span>
        </div>
        {desc && <div style={{ fontSize: "0.73rem", color: "#94a3b8", marginTop: "3px", marginLeft: "26px" }}>{desc}</div>}
      </div>
      <div style={{ padding: "1.25rem" }}>{children}</div>
    </div>
  );
}

// ── Toggle switch ─────────────────────────────────────────────────────────
function Toggle({ value, onChange, label, sub }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.625rem 0", borderBottom: "1px solid #f8fafc" }}>
      <div>
        <div style={{ fontSize: "0.84rem", fontWeight: "600", color: "#1e293b" }}>{label}</div>
        {sub && <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "1px" }}>{sub}</div>}
      </div>
      <div
        onClick={onChange}
        style={{
          width: "40px", height: "22px", borderRadius: "11px", flexShrink: 0,
          background: value ? "#0f1e3a" : "#e2e8f0",
          position: "relative", cursor: "pointer", transition: "background 0.2s ease",
        }}
      >
        <div style={{
          position: "absolute", top: "3px",
          left: value ? "21px" : "3px",
          width: "16px", height: "16px", borderRadius: "50%", background: "white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "left 0.2s ease",
        }} />
      </div>
    </div>
  );
}

// ── Select field ──────────────────────────────────────────────────────────
function SelectField({ label, value, options, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.625rem 0", borderBottom: "1px solid #f8fafc" }}>
      <div style={{ fontSize: "0.84rem", fontWeight: "600", color: "#1e293b" }}>{label}</div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ padding: "0.35rem 0.75rem", border: "1.5px solid #e2e8f0", borderRadius: "7px", fontSize: "0.79rem", color: "#374151", background: "white", cursor: "pointer", outline: "none" }}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function AccountSettings() {
  const [prefs, setPrefs] = useState(INIT_PREFS);
  const [integrations, setIntegrations] = useState(INTEGRATIONS);
  const [saved, setSaved] = useState(false);

  const toggle = key => setPrefs(p => ({ ...p, [key]: !p[key] }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleIntegration = id => {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: !i.connected } : i));
  };

  const handleDataExport = () => {
    const blob = new Blob([JSON.stringify({ settings: prefs, generated: new Date().toISOString() }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "exportready-settings.json"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.3rem", fontWeight: "800", color: "#0f1e3a", display: "flex", alignItems: "center", gap: "8px" }}><IcSettings /> Account Settings</h1>
          <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "#64748b" }}>Notifications, integrations, and preferences.</p>
        </div>
        <button
          onClick={handleSave}
          style={{
            padding: "0.625rem 1.5rem",
            background: saved ? "#16a34a" : "linear-gradient(135deg, #0f1e3a, #1a2f5a)",
            color: "white", border: "none", borderRadius: "8px",
            fontSize: "0.84rem", fontWeight: "700", cursor: "pointer", transition: "all 0.2s",
          }}
        >
          {saved ? "✓ Saved" : "Save Changes"}
        </button>
      </div>

      {/* ── 2-col grid ───────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>

        {/* Notification Preferences */}
        <Section title="Notification Preferences" icon={<IcBell />} desc="Choose which email alerts matter to your export operations.">
          <Toggle
            label="Compliance Deadlines"
            sub="IEC renewal, RCMC expiry, FSSAI alerts"
            value={prefs.emailCompliance}
            onChange={() => toggle("emailCompliance")}
          />
          <Toggle
            label="Market Opportunity Alerts"
            sub="Demand spikes, tariff changes in target markets"
            value={prefs.emailMarkets}
            onChange={() => toggle("emailMarkets")}
          />
          <Toggle
            label="Document Readiness"
            sub="When generated docs are ready to download"
            value={prefs.emailDocuments}
            onChange={() => toggle("emailDocuments")}
          />
          <Toggle
            label="Weekly Digest"
            sub="Summary of your export readiness & activity"
            value={prefs.emailWeekly}
            onChange={() => toggle("emailWeekly")}
          />
        </Section>

        {/* Language & Currency */}
        <Section title="Language & Currency" icon={<IcGlobe />} desc="Display preferences for your region.">
          <SelectField
            label="Language"
            value={prefs.language}
            options={["English", "Hindi", "Gujarati", "Tamil", "Marathi"]}
            onChange={v => setPrefs(p => ({ ...p, language: v }))}
          />
          <SelectField
            label="Currency"
            value={prefs.currency}
            options={["INR (₹)", "USD ($)", "EUR (€)", "AED (د.إ)", "GBP (£)"]}
            onChange={v => setPrefs(p => ({ ...p, currency: v }))}
          />
          <SelectField
            label="Timezone"
            value={prefs.timezone}
            options={["Asia/Kolkata (IST)", "UTC", "America/New_York (EST)", "Europe/Berlin (CET)", "Asia/Dubai (GST)"]}
            onChange={v => setPrefs(p => ({ ...p, timezone: v }))}
          />

          {/* Data Export */}
          <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: "700", letterSpacing: "0.8px", textTransform: "uppercase", color: "#94a3b8", marginBottom: "0.625rem" }}>
              Data & Privacy
            </div>
            <button
              onClick={handleDataExport}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0.55rem 1rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "7px", fontSize: "0.79rem", fontWeight: "600", color: "#374151", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#0f1e3a"; e.currentTarget.style.color = "#0f1e3a"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#374151"; }}
            >
              <IcDownload /> Export My Data
              <span style={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: "400" }}>(JSON)</span>
            </button>
          </div>
        </Section>

      </div>

      {/* ── Integrations (full width) ─────────────────────────────── */}
      <Section title="Connected Integrations" icon={<IcLink />} desc="Link your government portals and logistics partners for automated sync.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0.75rem" }}>
          {integrations.map(intg => (
            <div key={intg.id} style={{
              display: "flex", alignItems: "center", gap: "0.875rem",
              padding: "0.875rem 1rem", borderRadius: "9px", border: "1.5px solid",
              borderColor: intg.connected ? "#d4af3740" : "#e8ecf0",
              background: intg.connected ? "#fffbeb" : "#f8fafc",
              transition: "all 0.2s",
            }}>
              <div style={{ width: "38px", height: "38px", display: "flex", alignItems: "center", justifyContent: "center", color: intg.connected ? "#d4af37" : "#64748b", background: intg.connected ? "rgba(212,175,55,0.1)" : "#f1f5f9", borderRadius: "8px", flexShrink: 0 }}>{intg.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: "700", fontSize: "0.84rem", color: "#0f1e3a" }}>{intg.name}</div>
                <div style={{ fontSize: "0.71rem", color: "#64748b", marginTop: "1px" }}>{intg.desc}</div>
              </div>
              <button
                onClick={() => toggleIntegration(intg.id)}
                style={{
                  padding: "0.35rem 0.75rem", borderRadius: "7px", fontSize: "0.72rem", fontWeight: "700", cursor: "pointer", flexShrink: 0, transition: "all 0.15s",
                  background: intg.connected ? "transparent" : "#0f1e3a",
                  color:      intg.connected ? "#dc2626"    : "white",
                  border:     `1px solid ${intg.connected ? "#fca5a5" : "#0f1e3a"}`,
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                {intg.connected ? "Disconnect" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Subscription Plan ─────────────────────────────────────── */}
      <Section title="Subscription Plan" icon={<IcCreditCard />} desc="Manage your ExportReady plan.">
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>

          {/* Plan card */}
          <div style={{ flex: "1 1 260px", background: "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)", borderRadius: "10px", padding: "1.25rem 1.5rem", color: "white", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-10px", right: "-10px", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(212,175,55,0.08)" }} />
            <div style={{ fontSize: "0.6rem", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: "#d4af37", marginBottom: "4px" }}>Current Plan</div>
            <div style={{ fontSize: "1.3rem", fontWeight: "900", marginBottom: "2px" }}>{PLAN.name}</div>
            <div style={{ fontSize: "0.78rem", opacity: 0.6, marginBottom: "1rem" }}>{PLAN.billing} · Renews {PLAN.renewal}</div>
            <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#d4af37" }}>{PLAN.price}</div>
          </div>

          {/* Features list */}
          <div style={{ flex: "1 1 260px" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: "700", letterSpacing: "0.8px", textTransform: "uppercase", color: "#94a3b8", marginBottom: "0.625rem" }}>Included Features</div>
            {PLAN.features.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0.45rem 0", borderBottom: i < PLAN.features.length - 1 ? "1px solid #f8fafc" : "none" }}>
                <span style={{ color: "#16a34a", fontWeight: "700", fontSize: "0.85rem" }}>✓</span>
                <span style={{ fontSize: "0.83rem", color: "#374151" }}>{f}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center" }}>
            <button style={{ padding: "0.625rem 1.25rem", background: "#d4af37", border: "none", borderRadius: "8px", fontSize: "0.79rem", fontWeight: "700", color: "#0f1e3a", cursor: "pointer", transition: "opacity 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
              Upgrade Plan
            </button>
            <button style={{ padding: "0.625rem 1.25rem", background: "transparent", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "0.79rem", fontWeight: "600", color: "#64748b", cursor: "pointer" }}>
              View Invoices
            </button>
            <button style={{ padding: "0.625rem 1.25rem", background: "transparent", border: "1px solid #fca5a5", borderRadius: "8px", fontSize: "0.79rem", fontWeight: "600", color: "#dc2626", cursor: "pointer" }}>
              Cancel Plan
            </button>
          </div>
        </div>
      </Section>

    </div>
  );
}

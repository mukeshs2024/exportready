import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Static seed data (swap with API / localStorage in production) ──────────
const INIT = {
  name:        "Rajesh Gupta",
  role:        "Pro Exporter",
  company:     "Rajesh Textiles Pvt Ltd",
  city:        "Mumbai",
  state:       "Maharashtra",
  gst:         "27AAAAA0000A1Z5",
  iec:         "0519012345",
  business:    "Manufacturer",
  experience:  "Pro",          // Beginner | Active | Pro
  since:       "2019",
  email:       "rajesh@rjtextiles.in",
  phone:       "+91 98200 12345",
  website:     "www.rjtextiles.in",
};

const PRODUCTS = [
  { name: "Premium Cotton Shirts", hs: "6205.20", markets: ["USA", "Germany", "UK"],   status: "Active" },
  { name: "Basmati Rice",          hs: "1006.30", markets: ["UAE", "Saudi Arabia"],    status: "Active" },
  { name: "Mixed Spices",          hs: "0910.91", markets: ["Japan", "Netherlands"],   status: "Draft"  },
];

const TARGETS = [
  { country: "Germany", code: "DE", demand: 94, sector: "Textiles",  since: "2023" },
  { country: "UAE",     code: "AE", demand: 88, sector: "Food",      since: "2022" },
  { country: "USA",     code: "US", demand: 82, sector: "Textiles",  since: "2021" },
  { country: "Japan",   code: "JP", demand: 71, sector: "Organic",   since: "2024" },
  { country: "UK",      code: "GB", demand: 67, sector: "Textiles",  since: "2023" },
];

const SCORE_HISTORY = [
  { month: "Oct",  score: 20 },
  { month: "Nov",  score: 35 },
  { month: "Dec",  score: 50 },
  { month: "Jan",  score: 60 },
  { month: "Feb",  score: 72 },
  { month: "Mar",  score: 80 },
];

const EXP_LEVELS = [
  { key: "Beginner", label: "Beginner",  desc: "New to exporting",                  color: "#2563eb", bg: "#eff6ff" },
  { key: "Active",   label: "Active",    desc: "1–3 shipments/year",                color: "#ca8a04", bg: "#fefce8" },
  { key: "Pro",      label: "Pro",       desc: "Regular exporter, established ops", color: "#16a34a", bg: "#f0fdf4" },
];

// ── Section SVG icons ────────────────────────────────────────────────────
function IconBuilding() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>;
}
function IconTrophy() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;
}
function IconBox() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
}
function IconGlobe() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
}
function IconChart() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
}
function IconEdit() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
}

// ── Tiny inline SVG sparkline ─────────────────────────────────────────────
function Sparkline({ data, color }) {
  const max   = Math.max(...data.map(d => d.score));
  const w     = 220;
  const h     = 50;
  const pts   = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (w - 8) + 4;
    const y = h - 6 - ((d.score / max) * (h - 12));
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <polyline fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={pts} />
      {data.map((d, i) => {
        const x = (i / (data.length - 1)) * (w - 8) + 4;
        const y = h - 6 - ((d.score / max) * (h - 12));
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="4" fill={i === data.length - 1 ? color : "white"} stroke={color} strokeWidth="2" />
            <text x={x} y={y - 8} textAnchor="middle" fontSize="9" fill={color} fontWeight="700">{d.score}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────
function Section({ title, icon, children, action }) {
  return (
    <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e8ecf0", boxShadow: "0 1px 4px rgba(15,30,58,0.05)", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f1e3a", flexShrink: 0 }}>{icon}</span>
          <span style={{ fontWeight: "700", color: "#0f1e3a", fontSize: "0.9rem" }}>{title}</span>
        </div>
        {action}
      </div>
      <div style={{ padding: "1.25rem" }}>{children}</div>
    </div>
  );
}

// ── Editable field ────────────────────────────────────────────────────────
function Field({ label, value, editing, name, onChange, mono }) {
  return (
    <div>
      <div style={{ fontSize: "0.65rem", fontWeight: "700", letterSpacing: "0.8px", textTransform: "uppercase", color: "#94a3b8", marginBottom: "3px" }}>{label}</div>
      {editing ? (
        <input
          name={name}
          value={value}
          onChange={onChange}
          style={{ width: "100%", padding: "0.45rem 0.625rem", border: "1.5px solid #cbd5e1", borderRadius: "6px", fontSize: "0.84rem", fontFamily: mono ? "monospace" : "inherit", color: "#0f1e3a", boxSizing: "border-box", outline: "none" }}
          onFocus={e => e.target.style.borderColor = "#0f1e3a"}
          onBlur={e => e.target.style.borderColor = "#cbd5e1"}
        />
      ) : (
        <div style={{ fontSize: "0.84rem", fontWeight: "600", color: "#1e293b", fontFamily: mono ? "monospace" : "inherit" }}>{value || <span style={{ color: "#cbd5e1" }}>—</span>}</div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function Profile() {
  const navigate    = useNavigate();
  const [info, setInfo]       = useState(INIT);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(INIT);

  const expLevel = EXP_LEVELS.find(e => e.key === info.experience) || EXP_LEVELS[0];
  const completion = (() => {
    const fields = [info.gst, info.iec, info.company, info.city, info.email, info.phone, info.website];
    const filled  = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  })();

  const handleChange = e => setDraft(p => ({ ...p, [e.target.name]: e.target.value }));
  const saveEdit     = () => { setInfo(draft); setEditing(false); };
  const cancelEdit   = () => { setDraft(info); setEditing(false); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* ── Passport Hero ────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)",
        borderRadius: "14px", padding: "1.75rem 2rem", color: "white",
        boxShadow: "0 4px 20px rgba(15,30,58,0.2)", border: "1px solid rgba(212,175,55,0.15)",
        position: "relative", overflow: "hidden",
      }}>
        {/* grid watermark */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "linear-gradient(#d4af37 1px, transparent 1px), linear-gradient(90deg, #d4af37 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-start", gap: "1.5rem", flexWrap: "wrap" }}>

          {/* Avatar */}
          <div style={{ width: "68px", height: "68px", borderRadius: "14px", background: "linear-gradient(135deg, #d4af37 0%, #f0c040 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", fontWeight: "900", color: "#0f1e3a", flexShrink: 0, boxShadow: "0 4px 14px rgba(212,175,55,0.4)" }}>
            RG
          </div>

          {/* Name block */}
          <div style={{ flex: 1, minWidth: "200px" }}>
            <div style={{ fontSize: "0.62rem", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: "#d4af37", marginBottom: "4px" }}>Export Passport</div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "900", margin: "0 0 2px", letterSpacing: "-0.4px" }}>{info.name}</h1>
            <div style={{ fontSize: "0.82rem", opacity: 0.6 }}>{info.company} · {info.city}</div>

            {/* Experience badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "0.75rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: "20px", padding: "4px 12px" }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: expLevel.color }} />
              <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#d4af37" }}>{expLevel.label} Exporter</span>
              <span style={{ fontSize: "0.68rem", opacity: 0.55 }}>· Since {info.since}</span>
            </div>
          </div>

          {/* Completion score */}
          <div style={{ textAlign: "center", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "0.875rem 1.25rem", flexShrink: 0 }}>
            <div style={{ fontSize: "2rem", fontWeight: "900", color: completion >= 80 ? "#4ade80" : "#d4af37", lineHeight: 1 }}>{completion}%</div>
            <div style={{ fontSize: "0.65rem", opacity: 0.55, marginTop: "3px", fontWeight: "600", letterSpacing: "0.5px", textTransform: "uppercase" }}>Profile Complete</div>
            <div style={{ marginTop: "6px", width: "80px", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ width: `${completion}%`, height: "100%", background: completion >= 80 ? "#4ade80" : "#d4af37", transition: "width 0.5s ease", borderRadius: "4px" }} />
            </div>
          </div>

        </div>

        {/* IEC + GST strip */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", gap: "1rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
          {[
            { label: "IEC", value: info.iec     || "Not set" },
            { label: "GST", value: info.gst     || "Not set" },
            { label: "Type", value: info.business },
            { label: "Exporting since", value: info.since },
          ].map(item => (
            <div key={item.label} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "0.5rem 0.875rem" }}>
              <div style={{ fontSize: "0.6rem", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "2px" }}>{item.label}</div>
              <div style={{ fontSize: "0.82rem", fontWeight: "700", fontFamily: "monospace", color: "white" }}>{item.value}</div>
            </div>
          ))}
          <button
            onClick={() => navigate("/readiness")}
            style={{ padding: "0.5rem 1.125rem", background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.4)", borderRadius: "8px", color: "#d4af37", fontSize: "0.79rem", fontWeight: "700", cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: "6px" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(212,175,55,0.25)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(212,175,55,0.15)"}
          >
            <IconChart /> View Readiness →
          </button>
        </div>
      </div>

      {/* ── 2-col grid ───────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>

        {/* Business Details */}
        <Section
          title="Business Details"
          icon={<IconBuilding />}
          action={
            editing ? (
              <div style={{ display: "flex", gap: "6px" }}>
                <button onClick={cancelEdit} style={{ padding: "0.3rem 0.75rem", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "600", cursor: "pointer", color: "#374151" }}>Cancel</button>
                <button onClick={saveEdit}   style={{ padding: "0.3rem 0.75rem", background: "#0f1e3a", border: "none", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "600", cursor: "pointer", color: "white" }}>Save</button>
              </div>
            ) : (
              <button onClick={() => setEditing(true)} style={{ padding: "0.3rem 0.875rem", background: "transparent", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "600", cursor: "pointer", color: "#374151", transition: "all 0.15s", display: "flex", alignItems: "center", gap: "5px" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#0f1e3a"; e.currentTarget.style.color = "#0f1e3a"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#374151"; }}
              ><IconEdit /> Edit</button>
            )
          }
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
            <Field label="Company" name="company" value={editing ? draft.company : info.company} editing={editing} onChange={handleChange} />
            <Field label="Business Type" name="business" value={editing ? draft.business : info.business} editing={editing} onChange={handleChange} />
            <Field label="City" name="city" value={editing ? draft.city : info.city} editing={editing} onChange={handleChange} />
            <Field label="State" name="state" value={editing ? draft.state : info.state} editing={editing} onChange={handleChange} />
            <Field label="IEC Number" name="iec" value={editing ? draft.iec : info.iec} editing={editing} onChange={handleChange} mono />
            <Field label="GST Number" name="gst" value={editing ? draft.gst : info.gst} editing={editing} onChange={handleChange} mono />
            <Field label="Email" name="email" value={editing ? draft.email : info.email} editing={editing} onChange={handleChange} />
            <Field label="Phone" name="phone" value={editing ? draft.phone : info.phone} editing={editing} onChange={handleChange} />
            <div style={{ gridColumn: "1/-1" }}>
              <Field label="Website" name="website" value={editing ? draft.website : info.website} editing={editing} onChange={handleChange} />
            </div>
          </div>
        </Section>

        {/* Export Experience */}
        <Section title="Export Experience Level" icon={<IconTrophy />}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "1.25rem" }}>
            {EXP_LEVELS.map(level => {
              const active = info.experience === level.key;
              return (
                <div
                  key={level.key}
                  onClick={() => setInfo(p => ({ ...p, experience: level.key }))}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.875rem",
                    padding: "0.75rem 1rem", borderRadius: "8px", cursor: "pointer",
                    background: active ? level.bg : "#f8fafc",
                    border: `1.5px solid ${active ? level.color + "60" : "#e8ecf0"}`,
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ width: "14px", height: "14px", borderRadius: "50%", border: `2px solid ${level.color}`, background: active ? level.color : "white", flexShrink: 0, transition: "all 0.2s" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "700", fontSize: "0.84rem", color: active ? level.color : "#374151" }}>{level.label}</div>
                    <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{level.desc}</div>
                  </div>
                  {active && <span style={{ fontSize: "0.68rem", fontWeight: "700", color: level.color, background: level.bg, border: `1px solid ${level.color}30`, borderRadius: "10px", padding: "2px 8px" }}>Current</span>}
                </div>
              );
            })}
          </div>

          <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: "700", letterSpacing: "0.8px", textTransform: "uppercase", color: "#94a3b8", marginBottom: "0.5rem" }}>Readiness Score Progress</div>
            <Sparkline data={SCORE_HISTORY} color="#d4af37" />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
              {SCORE_HISTORY.map(d => (
                <span key={d.month} style={{ fontSize: "0.65rem", color: "#94a3b8" }}>{d.month}</span>
              ))}
            </div>
          </div>
        </Section>

      </div>

      {/* ── Products (full width) ─────────────────────────────────── */}
      <Section
        title="Export Products"
        icon={<IconBox />}
        action={
          <button onClick={() => navigate("/product")} style={{ padding: "0.3rem 0.875rem", background: "#0f1e3a", border: "none", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "600", cursor: "pointer", color: "white" }}>
            + Add Product
          </button>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          {PRODUCTS.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.875rem 1rem", background: "#f8fafc", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#0f1e3a12", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f1e3a", flexShrink: 0 }}><IconBox /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "700", fontSize: "0.87rem", color: "#0f1e3a" }}>{p.name}</div>
                <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "1px" }}>HS Code: <span style={{ fontFamily: "monospace", fontWeight: "600", color: "#374151" }}>{p.hs}</span></div>
              </div>
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                {p.markets.map(m => (
                  <span key={m} style={{ background: "#eff6ff", color: "#2563eb", fontSize: "0.68rem", fontWeight: "600", padding: "2px 7px", borderRadius: "10px" }}>{m}</span>
                ))}
              </div>
              <span style={{
                fontSize: "0.68rem", fontWeight: "700", padding: "3px 10px", borderRadius: "10px",
                background: p.status === "Active" ? "#f0fdf4" : "#fefce8",
                color:      p.status === "Active" ? "#16a34a"  : "#ca8a04",
                border:     `1px solid ${p.status === "Active" ? "#86efac" : "#fde68a"}`,
                flexShrink: 0,
              }}>{p.status}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Target Countries ─────────────────────────────────────── */}
      <Section
        title="Target Countries"
        icon={<IconGlobe />}
        action={
          <button onClick={() => navigate("/market")} style={{ padding: "0.3rem 0.875rem", background: "transparent", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "600", cursor: "pointer", color: "#374151" }}>
            Explore More →
          </button>
        }
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.75rem" }}>
          {TARGETS.map(t => (
            <div key={t.country} style={{ padding: "0.875rem 1rem", background: "#f8fafc", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem" }}>
                <div style={{ width: "30px", height: "22px", background: "#0f1e3a", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.58rem", fontWeight: "800", color: "white", letterSpacing: "0.5px", flexShrink: 0 }}>{t.code}</div>
                <span style={{ fontWeight: "700", color: "#0f1e3a", fontSize: "0.87rem" }}>{t.country}</span>
              </div>
              <div style={{ fontSize: "0.7rem", color: "#64748b", marginBottom: "6px" }}>
                {t.sector} · since {t.since}
              </div>
              {/* Demand bar */}
              <div style={{ height: "5px", background: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${t.demand}%`, height: "100%", background: t.demand >= 80 ? "#16a34a" : t.demand >= 60 ? "#ca8a04" : "#2563eb", borderRadius: "3px", transition: "width 0.5s ease" }} />
              </div>
              <div style={{ fontSize: "0.66rem", color: "#94a3b8", marginTop: "3px" }}>Demand index: {t.demand}/100</div>
            </div>
          ))}
        </div>
      </Section>

    </div>
  );
}

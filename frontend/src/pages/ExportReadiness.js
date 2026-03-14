import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

// ── Step SVG icons ────────────────────────────────────────────────────────
function IcClipboard() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>;
}
function IcPackage() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
}
function IcShield() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
}
function IcGlobe() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
}
function IcTrending() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
}
function IcWarn() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
}
function IcMap() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>;
}
function IcFileCheck() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 11 17 15 13"/></svg>;
}

// ── 5-Step Export Journey ─────────────────────────────────────────────────
const JOURNEY = [
  {
    key: "iec",
    labelKey: "readiness.journey.iec.label",
    whyKey: "readiness.journey.iec.why",
    actionKey: "readiness.journey.iec.action",
    icon: <IcClipboard />,
    color: "#2563eb",
    link: null,
  },
  {
    key: "product",
    labelKey: "readiness.journey.product.label",
    whyKey: "readiness.journey.product.why",
    actionKey: "readiness.journey.product.action",
    icon: <IcPackage />,
    color: "#16a34a",
    link: "/product",
  },
  {
    key: "compliance",
    labelKey: "readiness.journey.compliance.label",
    whyKey: "readiness.journey.compliance.why",
    actionKey: "readiness.journey.compliance.action",
    icon: <IcShield />,
    color: "#7c3aed",
    link: "/compliance",
  },
  {
    key: "market",
    labelKey: "readiness.journey.market.label",
    whyKey: "readiness.journey.market.why",
    actionKey: "readiness.journey.market.action",
    icon: <IcGlobe />,
    color: "#ca8a04",
    link: "/market",
  },
  {
    key: "profit",
    labelKey: "readiness.journey.profit.label",
    whyKey: "readiness.journey.profit.why",
    actionKey: "readiness.journey.profit.action",
    icon: <IcTrending />,
    color: "#dc2626",
    link: "/profit",
  },
];

// ── Detailed compliance audit checklist ───────────────────────────────────
const CHECKS = [
  { key: "iec",          labelKey: "readiness.audit.iec.label",          points: 20, detailKey: "readiness.audit.iec.detail" },
  { key: "product",      labelKey: "readiness.audit.product.label",      points: 15, detailKey: "readiness.audit.product.detail" },
  { key: "apeda",        labelKey: "readiness.audit.apeda.label",        points: 15, detailKey: "readiness.audit.apeda.detail" },
  { key: "quality_cert", labelKey: "readiness.audit.quality.label",      points: 20, detailKey: "readiness.audit.quality.detail" },
  { key: "buyers",       labelKey: "readiness.audit.buyers.label",       points: 15, detailKey: "readiness.audit.buyers.detail" },
  { key: "bank",         labelKey: "readiness.audit.bank.label",         points: 15, detailKey: "readiness.audit.bank.detail" },
];

function getLevel(score) {
  if (score >= 85) return { labelKey: "readiness.level.exportReady", color: "#16a34a" };
  if (score >= 60) return { labelKey: "readiness.level.almostReady", color: "#ca8a04" };
  if (score >= 30) return { labelKey: "readiness.level.gettingStarted", color: "#2563eb" };
  return                    { labelKey: "readiness.level.justBeginning", color: "#dc2626" };
}

function ExportReadiness() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Journey step completion state
  const [journey, setJourney] = useState({
    iec: false, product: false, compliance: false, market: false, profit: false,
  });

  // Detailed audit checklist state
  const [checked, setChecked] = useState({
    iec: false, product: false, apeda: false,
    quality_cert: false, buyers: false, bank: false,
  });

  // Derived values
  const completedCount   = JOURNEY.filter(j => journey[j.key]).length;
  const percent          = Math.round((completedCount / JOURNEY.length) * 100);
  const currentStepIdx   = JOURNEY.findIndex(j => !journey[j.key]);
  const currentStep      = currentStepIdx >= 0 ? JOURNEY[currentStepIdx] : null;
  const stepsCompleteLabel = t("readiness.stepsComplete")
    .replace("{completed}", completedCount)
    .replace("{total}", JOURNEY.length);

  const auditScore = CHECKS.reduce((acc, c) => acc + (checked[c.key] ? c.points : 0), 0);
  const level      = getLevel(auditScore);
  const remaining  = CHECKS.filter(c => !checked[c.key]);
  const nextGain   = remaining.slice(0, 3).reduce((a, c) => a + c.points, 0);
  const readinessPercent = 80;
  const readinessNextStep = "Upload IEC";

  const toggleJourney = (key) => {
    setJourney(prev => ({ ...prev, [key]: !prev[key] }));
    // keep audit in sync for shared keys
    if (key === "iec" || key === "product") {
      setChecked(prev => ({ ...prev, [key]: !journey[key] }));
    }
  };

  const toggleAudit = (key) => setChecked(prev => ({ ...prev, [key]: !prev[key] }));

  // SVG circle math for audit score
  const R    = 28;
  const circ = 2 * Math.PI * R;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* ── Export Readiness Meter ─────────────────────────────────── */}
      <div style={{
        background: "white",
        borderRadius: "12px",
        padding: "1.5rem 1.75rem",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 12px rgba(15,30,58,0.08)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem" }}>
          <div style={{ fontSize: "0.78rem", fontWeight: "800", letterSpacing: "1px", textTransform: "uppercase", color: "#0f1e3a" }}>
            Export Readiness Meter
          </div>
          <div style={{ fontSize: "0.85rem", fontWeight: "800", color: "#0f1e3a" }}>{readinessPercent}%</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div style={{ flex: 1, height: "10px", borderRadius: "999px", background: "#f1f5f9", overflow: "hidden" }}>
            <div style={{ width: `${readinessPercent}%`, height: "100%", background: "linear-gradient(90deg, #2563eb, #16a34a)", borderRadius: "999px" }} />
          </div>
          <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace", fontSize: "0.75rem", color: "#64748b" }}>
            {"########--"}
          </div>
        </div>

        <div style={{ marginTop: "0.85rem", fontSize: "0.82rem", color: "#475569", fontWeight: "600" }}>
          Next Step: <span style={{ color: "#0f1e3a", fontWeight: "800" }}>{readinessNextStep}</span>
        </div>
      </div>

      {/* ── Row 1: Profile card + Next-step card ───────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>

        {/* Profile + progress */}
        <div style={{
          background: "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)",
          borderRadius: "12px", padding: "1.75rem", color: "white",
          boxShadow: "0 4px 20px rgba(15,30,58,0.2)",
          border: "1px solid rgba(212,175,55,0.15)",
        }}>
          {/* Avatar + name */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "12px", flexShrink: 0,
              background: "linear-gradient(135deg, #d4af37 0%, #f0c040 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.4rem", fontWeight: "900", color: "#0f1e3a",
            }}>R</div>
            <div>
              <div style={{ fontWeight: "800", fontSize: "1.1rem", letterSpacing: "-0.3px" }}>Rajesh Gupta</div>
              <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", marginTop: "2px" }}>{t("nav.proExporter")}</div>
            </div>
          </div>

          {/* Section title */}
          <div style={{ fontSize: "0.7rem", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.6rem" }}>
            {t("readiness.title")}
          </div>

          {/* Segmented progress bar */}
          <div style={{ display: "flex", gap: "5px", marginBottom: "0.5rem" }}>
            {JOURNEY.map((s) => (
              <div key={s.key} style={{
                flex: 1, height: "9px", borderRadius: "5px",
                background: journey[s.key] ? "#d4af37" : "rgba(255,255,255,0.13)",
                transition: "background 0.35s ease",
              }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)" }}>
              {stepsCompleteLabel}
            </span>
            <span style={{ fontSize: "1rem", fontWeight: "900", color: "#d4af37" }}>{percent}% {t("readiness.ready")}</span>
          </div>

          {/* Level badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "7px",
            background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.3)",
            borderRadius: "20px", padding: "0.35rem 0.875rem",
          }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: level.color, flexShrink: 0 }} />
            <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "#d4af37" }}>{t(level.labelKey)}</span>
          </div>
        </div>

        {/* Next Required Step */}
        {currentStep ? (
          <div style={{
            background: "white", borderRadius: "12px", padding: "1.75rem",
            boxShadow: "0 4px 16px rgba(15,30,58,0.08)", border: "1px solid #e2e8f0",
            position: "relative", overflow: "hidden",
          }}>
            {/* Accent top bar */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${currentStep.color}, transparent)` }} />

            <div style={{ fontSize: "0.63rem", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: "#ca8a04", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "5px" }}>
              <IcWarn /> {t("readiness.nextStep")}
            </div>

            <div style={{ fontSize: "1rem", fontWeight: "800", color: "#0f1e3a", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", color: currentStep.color, flexShrink: 0 }}>{currentStep.icon}</span>
              {t("readiness.step")} {currentStepIdx + 1}: {t(currentStep.labelKey)}
            </div>

            <div style={{
              fontSize: "0.79rem", color: "#4a5568", lineHeight: "1.6",
              padding: "0.75rem", background: "#f8fafc", borderRadius: "6px",
              borderLeft: `3px solid ${currentStep.color}`, marginBottom: "1.25rem",
            }}>
              <strong>{t("readiness.whyMatters")}</strong><br />{t(currentStep.whyKey)}
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => currentStep.link ? navigate(currentStep.link) : toggleJourney(currentStep.key)}
                style={{
                  flex: 1, padding: "0.75rem", background: currentStep.color, color: "white",
                  border: "none", borderRadius: "8px", fontSize: "0.84rem", fontWeight: "700",
                  cursor: "pointer", transition: "opacity 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                {t(currentStep.actionKey)}
              </button>
              <button
                onClick={() => toggleJourney(currentStep.key)}
                style={{
                  padding: "0.75rem 1rem", background: "#f1f5f9", color: "#374151",
                  border: "1px solid #e2e8f0", borderRadius: "8px",
                  fontSize: "0.79rem", fontWeight: "600", cursor: "pointer",
                }}
              >
                {t("readiness.markDone")}
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
            borderRadius: "12px", padding: "1.75rem",
            border: "1px solid #86efac",
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", textAlign: "center",
          }}>
            <div style={{ marginBottom: "0.75rem", color: "#16a34a" }}><svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
            <div style={{ fontWeight: "800", color: "#15803d", fontSize: "1.1rem" }}>{t("readiness.allComplete")}</div>
            <div style={{ fontSize: "0.82rem", color: "#16a34a", marginTop: "0.4rem" }}>{t("readiness.allCompleteDesc")}</div>
          </div>
        )}
      </div>

      {/* ── Row 2: 5-Step Journey Tracker ──────────────────────────────── */}
      <div style={{
        background: "white", borderRadius: "12px", padding: "1.75rem",
        boxShadow: "0 2px 8px rgba(15,30,58,0.06)", border: "1px solid #e8ecf0",
      }}>
        <h2 style={{ color: "#0f1e3a", marginBottom: "1.5rem", fontSize: "1rem", fontWeight: "800", margin: "0 0 1.5rem", display: "flex", alignItems: "center", gap: "8px" }}>
          <IcMap /> {t("readiness.journeyTitle")}
        </h2>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {JOURNEY.map((step, idx) => {
            const done      = journey[step.key];
            const isCurrent = idx === currentStepIdx;

            return (
              <div key={step.key} style={{ display: "flex", gap: "1rem", position: "relative" }}>
                {/* Vertical connector line */}
                {idx < JOURNEY.length - 1 && (
                  <div style={{
                    position: "absolute", left: "19px", top: "44px",
                    width: "2px", height: "calc(100% - 14px)",
                    background: done ? "#d4af37" : "#e2e8f0",
                    transition: "background 0.35s ease", zIndex: 0,
                  }} />
                )}

                {/* Step circle (click to toggle) */}
                <div style={{ position: "relative", zIndex: 1, flexShrink: 0 }}>
                  <div
                    onClick={() => toggleJourney(step.key)}
                    title={done ? t("readiness.markIncomplete") : t("readiness.markComplete")}
                    style={{
                      width: "40px", height: "40px", borderRadius: "50%",
                      background: done ? "#d4af37" : isCurrent ? step.color : "#f1f5f9",
                      border: `2.5px solid ${done ? "#d4af37" : isCurrent ? step.color : "#e2e8f0"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: isCurrent && !done ? `0 0 0 4px ${step.color}22` : "none",
                      transition: "all 0.3s ease",
                      color: done ? "white" : isCurrent ? "white" : "#94a3b8",
                      fontSize: done ? "1rem" : "0.82rem", fontWeight: "900",
                    }}
                  >
                    {done ? "✓" : idx + 1}
                  </div>
                </div>

                {/* Step card */}
                <div style={{ flex: 1, paddingBottom: "1.25rem" }}>
                  <div style={{
                    background: done ? "#fefce8" : isCurrent ? `${step.color}08` : "#fafafa",
                    border: `1.5px solid ${done ? "#fde68a" : isCurrent ? `${step.color}40` : "#f1f5f9"}`,
                    borderRadius: "10px", padding: "0.875rem 1.125rem",
                    transition: "all 0.3s ease",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <span style={{ width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", color: done ? "#854d0e" : isCurrent ? step.color : "#94a3b8", flexShrink: 0 }}>{step.icon}</span>
                        <span style={{
                          fontWeight: "700", fontSize: "0.88rem",
                          color: done ? "#854d0e" : isCurrent ? step.color : "#94a3b8",
                          transition: "color 0.3s ease",
                        }}>
                          {t(step.labelKey)}
                        </span>
                        {isCurrent && !done && (
                          <span style={{
                            background: step.color, color: "white",
                            fontSize: "0.58rem", fontWeight: "700",
                            padding: "2px 8px", borderRadius: "20px", letterSpacing: "0.5px", textTransform: "uppercase",
                          }}>{t("profile.current")}</span>
                        )}
                        {done && (
                          <span style={{
                            background: "#fde68a", color: "#854d0e",
                            fontSize: "0.58rem", fontWeight: "700",
                            padding: "2px 8px", borderRadius: "20px", letterSpacing: "0.5px", textTransform: "uppercase",
                          }}>{t("readiness.completed")}</span>
                        )}
                      </div>
                      {(isCurrent || done) && (
                        <button
                          onClick={() => done ? toggleJourney(step.key) : (step.link ? navigate(step.link) : toggleJourney(step.key))}
                          style={{
                            padding: "0.35rem 0.875rem", fontSize: "0.74rem", fontWeight: "600",
                            background: done ? "transparent" : step.color,
                            color: done ? "#854d0e" : "white",
                            border: `1px solid ${done ? "#fcd34d" : step.color}`,
                            borderRadius: "6px", cursor: "pointer", flexShrink: 0,
                            transition: "opacity 0.2s",
                          }}
                          onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                        >
                          {done ? t("readiness.undo") : t(step.actionKey)}
                        </button>
                      )}
                    </div>
                    {isCurrent && !done && (
                      <div style={{ fontSize: "0.77rem", color: "#4a5568", marginTop: "0.5rem", lineHeight: "1.55" }}>
                        {t(step.whyKey)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Row 3: Detailed Compliance Audit ───────────────────────────── */}
      <div style={{
        background: "white", borderRadius: "12px", padding: "1.75rem",
        boxShadow: "0 2px 8px rgba(15,30,58,0.06)", border: "1px solid #e8ecf0",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <h2 style={{ color: "#0f1e3a", fontSize: "1rem", fontWeight: "800", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
            <IcFileCheck /> {t("readiness.auditTitle")}
          </h2>
          {/* Mini score circle */}
          <div style={{ position: "relative", width: "72px", height: "72px", flexShrink: 0 }}>
            <svg width="72" height="72" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="36" cy="36" r={R} fill="none" stroke="#e2e8f0" strokeWidth="7" />
              <circle cx="36" cy="36" r={R} fill="none" stroke={level.color} strokeWidth="7"
                strokeDasharray={`${(auditScore / 100) * circ} ${circ}`}
                strokeLinecap="round" style={{ transition: "stroke-dasharray 0.5s ease" }}
              />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "1.1rem", fontWeight: "900", color: level.color, lineHeight: 1 }}>{auditScore}</span>
              <span style={{ fontSize: "0.55rem", color: "#94a3b8" }}>/ 100</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          {CHECKS.map(c => {
            const done = checked[c.key];
            return (
              <div
                key={c.key}
                onClick={() => toggleAudit(c.key)}
                style={{
                  display: "flex", alignItems: "center", gap: "1rem",
                  padding: "0.875rem 1rem",
                  background: done ? "#f0fdf4" : "#f8fafc",
                  border: `1.5px solid ${done ? "#86efac" : "#e2e8f0"}`,
                  borderRadius: "8px", cursor: "pointer", transition: "all 0.2s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = done ? "#4ade80" : "#cbd5e1"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = done ? "#86efac" : "#e2e8f0"; }}
              >
                <div style={{
                  width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
                  background: done ? "#16a34a" : "white",
                  border: `2px solid ${done ? "#16a34a" : "#cbd5e1"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s ease",
                }}>
                  {done && <span style={{ color: "white", fontSize: "0.65rem", fontWeight: "900" }}>✓</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "700", color: done ? "#15803d" : "#0f1e3a", fontSize: "0.87rem" }}>{t(c.labelKey)}</div>
                  <div style={{ fontSize: "0.73rem", color: "#64748b", marginTop: "1px" }}>{t(c.detailKey)}</div>
                </div>
                <span style={{
                  background: done ? "#16a34a" : "#e2e8f0",
                  color: done ? "white" : "#64748b",
                  borderRadius: "12px", padding: "0.2rem 0.6rem",
                  fontSize: "0.75rem", fontWeight: "700", flexShrink: 0,
                  transition: "all 0.2s ease",
                }}>
                  +{c.points} {t("readiness.points")}
                </span>
              </div>
            );
          })}
        </div>

        {auditScore < 100 && remaining.length > 0 && (
          <div style={{ marginTop: "1.25rem", padding: "1rem 1.25rem", background: "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)", borderRadius: "8px", color: "white" }}>
            <div style={{ fontWeight: "700", fontSize: "0.85rem", marginBottom: "0.4rem" }}>
              {t("readiness.completeTo")} {Math.min(auditScore + nextGain, 100)}/100
            </div>
            <ul style={{ margin: 0, paddingLeft: "1.25rem", opacity: 0.85 }}>
              {remaining.slice(0, 3).map(c => (
                <li key={c.key} style={{ fontSize: "0.8rem", lineHeight: "1.8" }}>
                  {t(c.labelKey)} <span style={{ color: "#d4af37" }}>+{c.points} {t("readiness.points")}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

    </div>
  );
}

export default ExportReadiness;

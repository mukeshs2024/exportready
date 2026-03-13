import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

// SVG icon components
const GlobeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f1e3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const HelpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const NOTIFICATIONS = [
  { id: 1, color: "#2563eb", text: "Germany market demand up +12% for Cotton Shirts", time: "2m ago", isNew: true },
  { id: 2, color: "#16a34a", text: "Compliance check completed for HS Code 6205.20", time: "1h ago", isNew: true },
  { id: 3, color: "#0f1e3a", text: "Commercial Invoice template ready to download", time: "3h ago", isNew: false },
  { id: 4, color: "#ca8a04", text: "IEC Certificate expires in 30 days — renew now", time: "1d ago", isNew: false },
];

const MenuIcons = {
  profile: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  progress: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  docs: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  settings: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  logout: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

const PROFILE_MENU = [
  { icon: MenuIcons.profile,  label: "View Profile",     path: "/profile" },
  { icon: MenuIcons.progress, label: "Export Progress",  path: "/readiness" },
  { icon: MenuIcons.docs,     label: "My Documents",     path: "/docs" },
  { icon: MenuIcons.settings, label: "Account Settings", path: "/settings" },
];

function Navbar() {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen]     = useState(false);
  const profileRef = useRef(null);
  const notifRef   = useRef(null);
  const newCount   = NOTIFICATIONS.filter(n => n.isNew).length;

  useEffect(() => {
    function handleOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "#0f1e3a",
      padding: "0 2rem 0 2rem",
      height: "64px",
      boxShadow: "0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.3)",
      borderBottom: "1px solid rgba(212,175,55,0.25)",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      width: "100%",
      zIndex: 999,
      boxSizing: "border-box",
    }}>
      {/* Brand */}
      <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "8px",
          background: "linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 100%)",
          border: "1px solid rgba(212,175,55,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <GlobeIcon />
        </div>
        <div>
          <div style={{ fontSize: "1.15rem", fontWeight: "800", color: "white", letterSpacing: "-0.3px", lineHeight: 1 }}>
            Export<span style={{ color: "#d4af37" }}>Ready</span>
          </div>
          <div style={{ fontSize: "0.58rem", color: "rgba(212,175,55,0.7)", letterSpacing: "2px", textTransform: "uppercase", fontWeight: "600", marginTop: "2px" }}>
            Global Trade Intelligence
          </div>
        </div>
      </Link>

      {/* Center — status pill */}
      <div style={{
        display: "flex", alignItems: "center", gap: "6px",
        background: "rgba(22,163,74,0.12)", border: "1px solid rgba(22,163,74,0.25)",
        borderRadius: "20px", padding: "4px 12px",
      }}>
        <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px rgba(34,197,94,0.6)" }} />
        <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.75)", fontWeight: "600", letterSpacing: "0.5px" }}>
          All Systems Operational
        </span>
      </div>

      {/* Right actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>

        {/* ── Notification Bell ─────────────────────────────────── */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <button
            onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
            style={{ background: notifOpen ? "rgba(255,255,255,0.08)" : "none", border: "none", cursor: "pointer", padding: "8px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            onMouseLeave={e => { if (!notifOpen) e.currentTarget.style.background = "none"; }}
          >
            <BellIcon />
            {newCount > 0 && (
              <span style={{ position: "absolute", top: "5px", right: "5px", minWidth: "16px", height: "16px", background: "#d4af37", borderRadius: "8px", border: "1.5px solid #0f1e3a", fontSize: "0.52rem", fontWeight: "900", color: "#0f1e3a", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px" }}>
                {newCount}
              </span>
            )}
          </button>

          {/* Notifications panel */}
          {notifOpen && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: "320px", background: "white", borderRadius: "12px", boxShadow: "0 8px 32px rgba(15,30,58,0.18)", border: "1px solid #e8ecf0", zIndex: 9999, overflow: "hidden" }}>
              <div style={{ padding: "0.875rem 1rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "700", fontSize: "0.85rem", color: "#0f1e3a" }}>Notifications</span>
                <span style={{ fontSize: "0.72rem", color: "#2563eb", cursor: "pointer", fontWeight: "600" }}>Mark all read</span>
              </div>
              {NOTIFICATIONS.map(n => (
                <div key={n.id} style={{ padding: "0.75rem 1rem", display: "flex", gap: "0.75rem", alignItems: "flex-start", background: n.isNew ? "#f8faff" : "white", borderBottom: "1px solid #f8fafc", cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
                  onMouseLeave={e => e.currentTarget.style.background = n.isNew ? "#f8faff" : "white"}
                >
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: n.color, flexShrink: 0, marginTop: "5px" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.79rem", color: "#1e293b", lineHeight: "1.45", fontWeight: n.isNew ? "600" : "400" }}>{n.text}</div>
                    <div style={{ fontSize: "0.69rem", color: "#94a3b8", marginTop: "2px" }}>{n.time}</div>
                  </div>
                  {n.isNew && <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#d4af37", flexShrink: 0, marginTop: "5px" }} />}
                </div>
              ))}
              <div style={{ padding: "0.625rem 1rem", textAlign: "center", borderTop: "1px solid #f1f5f9", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                onMouseLeave={e => e.currentTarget.style.background = "white"}
              >
                <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "500" }}>View all notifications</span>
              </div>
            </div>
          )}
        </div>

        {/* Help */}
        <button style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}>
          <HelpIcon />
        </button>

        {/* Divider */}
        <div style={{ width: "1px", height: "32px", background: "rgba(255,255,255,0.1)", margin: "0 8px" }} />

        {/* ── Profile dropdown ──────────────────────────────────── */}
        <div ref={profileRef} style={{ position: "relative" }}>
          {/* Trigger */}
          <div
            onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 10px 6px 6px", borderRadius: "8px", cursor: "pointer", transition: "background 0.15s", background: profileOpen ? "rgba(255,255,255,0.08)" : "transparent", userSelect: "none" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            onMouseLeave={e => { if (!profileOpen) e.currentTarget.style.background = "transparent"; }}
          >
            {/* RG initials avatar */}
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #d4af37 0%, #f0c040 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(212,175,55,0.4)", flexShrink: 0, fontSize: "0.72rem", fontWeight: "900", color: "#0f1e3a", letterSpacing: "0.5px" }}>
              RG
            </div>
            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: "700", color: "white", lineHeight: 1 }}>Rajesh Gupta</div>
              <div style={{ fontSize: "0.62rem", color: "#d4af37", fontWeight: "500", marginTop: "2px" }}>Pro Exporter</div>
            </div>
            {/* Chevron */}
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ transition: "transform 0.2s", transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {/* Dropdown panel */}
          {profileOpen && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: "230px", background: "white", borderRadius: "12px", boxShadow: "0 8px 32px rgba(15,30,58,0.18)", border: "1px solid #e8ecf0", zIndex: 9999, overflow: "hidden" }}>
              {/* Header with larger avatar */}
              <div style={{ padding: "1rem", borderBottom: "1px solid #f1f5f9", display: "flex", gap: "0.75rem", alignItems: "center", background: "#fafafa" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "linear-gradient(135deg, #d4af37 0%, #f0c040 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: "900", color: "#0f1e3a", flexShrink: 0 }}>
                  RG
                </div>
                <div>
                  <div style={{ fontWeight: "700", color: "#0f1e3a", fontSize: "0.87rem" }}>Rajesh Gupta</div>
                  <div style={{ fontSize: "0.7rem", color: "#d4af37", fontWeight: "600", marginTop: "1px" }}>Pro Exporter</div>
                </div>
              </div>

              {/* Menu items */}
              {PROFILE_MENU.map(item => (
                <div
                  key={item.label}
                  onClick={() => { setProfileOpen(false); if (item.path) navigate(item.path); }}
                  style={{ padding: "0.7rem 1rem", display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", fontSize: "0.83rem", color: "#374151", fontWeight: "500", transition: "background 0.15s", borderBottom: "1px solid #f8fafc" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
                  onMouseLeave={e => e.currentTarget.style.background = "white"}
                >
                  <span style={{ width: "20px", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", flexShrink: 0 }}>{item.icon}</span>
                  {item.label}
                </div>
              ))}

              {/* Logout */}
              <div
                onClick={() => { setProfileOpen(false); alert("Logging out…"); }}
                style={{ padding: "0.7rem 1rem", display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", fontSize: "0.83rem", color: "#dc2626", fontWeight: "600", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                onMouseLeave={e => e.currentTarget.style.background = "white"}
              >
                <span style={{ width: "20px", display: "flex", alignItems: "center", justifyContent: "center", color: "#dc2626", flexShrink: 0 }}>{MenuIcons.logout}</span>
                Logout
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Navbar;


import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

// â”€â”€ SVG Icon components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  product: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  market: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  profit: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  products: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  ),
  exportPlan: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  compliance: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  ),
  readiness: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  reports: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  docs: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
      <polyline points="13 2 13 9 20 9"/>
    </svg>
  ),
  chatbot: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      <circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="12" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="10" r="1" fill="currentColor"/>
    </svg>
  ),
  settings: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  logout: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

function Sidebar({ isCollapsed, toggleSidebar }) {
  const location = useLocation();
  const [hoveredPath, setHoveredPath] = useState(null);

  const navItems = [
    { path: "/",            label: "Dashboard",       icon: icons.dashboard   },
    { path: "/product",     label: "Add Product",     icon: icons.product     },
    { path: "/market",      label: "Market Analysis", icon: icons.market      },
    { path: "/profit",      label: "Profit Simulator",icon: icons.profit      },
    { path: "/products",    label: "Marketplace",     icon: icons.products    },
    { path: "/export-plan", label: "Export Plan",     icon: icons.exportPlan  },
    { path: "/compliance",  label: "Compliance",      icon: icons.compliance  },
    { path: "/readiness",   label: "Readiness Score", icon: icons.readiness   },
    { path: "/reports",     label: "Reports",         icon: icons.reports     },
    { path: "/docs",        label: "Documents",       icon: icons.docs        },
    { path: "/chatbot",     label: "AI Advisor",      icon: icons.chatbot     },
  ];

  const handleLogout = () => alert("Logging out...");

  return (
    <div style={{
      width: isCollapsed ? "64px" : "216px",
      height: "calc(100vh - 64px)",
      background: "#0f1e3a",
      position: "fixed",
      left: 0,
      top: "64px",
      display: "flex",
      flexDirection: "column",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      boxShadow: "1px 0 0 rgba(255,255,255,0.04)",
      transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      zIndex: 100,
      overflowY: "auto",
      overflowX: "hidden",
    }}>
      {/* Navigation */}
      <nav style={{ flex: 1, padding: "1rem 0.625rem", display: "flex", flexDirection: "column", gap: "2px" }}>

        {/* Section label */}
        {!isCollapsed && (
          <div style={{ fontSize: "0.62rem", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", padding: "0 0.5rem", marginBottom: "6px" }}>
            Navigation
          </div>
        )}

        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isHovered = hoveredPath === item.path;
          return (
            <div key={item.path} style={{ position: "relative" }}>
              {/* Tooltip on collapsed */}
              {isHovered && isCollapsed && (
                <div style={{
                  position: "absolute", left: "calc(100% + 10px)", top: "50%",
                  transform: "translateY(-50%)",
                  background: "#1e3a5f", border: "1px solid rgba(212,175,55,0.2)",
                  padding: "6px 12px", borderRadius: "6px", whiteSpace: "nowrap",
                  fontWeight: "600", color: "white", fontSize: "0.82rem",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                  zIndex: 1001, pointerEvents: "none",
                }}>
                  {item.label}
                  <div style={{ position: "absolute", right: "100%", top: "50%", transform: "translateY(-50%)", width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderRight: "5px solid #1e3a5f" }} />
                </div>
              )}
              <Link
                to={item.path}
                onClick={toggleSidebar}
                onMouseEnter={() => setHoveredPath(item.path)}
                onMouseLeave={() => setHoveredPath(null)}
                style={{
                  display: "flex", alignItems: "center",
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  gap: "10px",
                  padding: isCollapsed ? "10px" : "9px 10px",
                  background: isActive ? "rgba(212,175,55,0.12)" : isHovered ? "rgba(255,255,255,0.05)" : "transparent",
                  borderRadius: "8px",
                  color: isActive ? "#d4af37" : isHovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)",
                  fontSize: "0.83rem", fontWeight: isActive ? "600" : "400",
                  textDecoration: "none", cursor: "pointer",
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap", overflow: "hidden",
                  borderLeft: isActive ? "2px solid #d4af37" : "2px solid transparent",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>{item.icon}</span>
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "0.625rem" }}>
        <button
          onClick={() => alert("Settings coming soon")}
          style={{
            display: "flex", alignItems: "center",
            justifyContent: isCollapsed ? "center" : "flex-start",
            gap: "10px", width: "100%",
            padding: isCollapsed ? "10px" : "9px 10px",
            background: "transparent", border: "none", borderRadius: "8px",
            color: "rgba(255,255,255,0.45)", fontSize: "0.83rem",
            cursor: "pointer", transition: "all 0.15s ease",
            whiteSpace: "nowrap", overflow: "hidden",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
        >
          <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>{icons.settings}</span>
          {!isCollapsed && <span>Settings</span>}
        </button>
      </div>

      {/* User profile */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: isCollapsed ? "0.75rem 0.5rem" : "0.875rem 0.75rem",
        display: "flex", alignItems: "center",
        justifyContent: isCollapsed ? "center" : "space-between",
        gap: "10px",
      }}>
        {!isCollapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
            <div style={{
              width: "34px", height: "34px", borderRadius: "8px", flexShrink: 0,
              background: "linear-gradient(135deg, #d4af37 0%, #f0c040 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.9rem", fontWeight: "800", color: "#0f1e3a",
            }}>
              R
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "0.82rem", fontWeight: "600", color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                Rajesh Gupta
              </div>
              <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)", marginTop: "1px" }}>Pro Exporter</div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          title="Sign out"
          style={{
            width: "32px", height: "32px", borderRadius: "6px", flexShrink: 0,
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.4)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(220,38,38,0.15)"; e.currentTarget.style.color = "#f87171"; e.currentTarget.style.borderColor = "rgba(220,38,38,0.3)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
        >
          {icons.logout}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;

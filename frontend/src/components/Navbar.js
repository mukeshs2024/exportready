import React, { useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";

const IconSun = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const IconMoon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const IconSearch = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconBell = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const IconSettings = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const TITLE_MAP = {
  "/": "Command Center",
  "/market": "Market Intelligence",
  "/profit": "Profit Simulator",
  "/product": "Product Setup",
  "/export-plan": "Export Plan",
  "/compliance": "Compliance Control",
  "/readiness": "Readiness Score",
  "/reports": "Reports",
  "/docs": "Documents",
};

function Navbar() {
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // Apply theme on mount
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const title = TITLE_MAP[location.pathname] || "ExportReady";
  const dateLabel = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  }, []);

  return (
    <div className="aurora-topbar">
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div className="aurora-topbar-title">
          {title}
        </div>
        <span className="aurora-dot" />
        <div className="aurora-topbar-meta">{dateLabel}</div>
        <div className="aurora-status-pill">
          <span className="aurora-pulse" />
          All Systems Operational
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <button className="aurora-icon-btn" title="Search">
          {IconSearch}
        </button>
        <button className="aurora-icon-btn" title="Notifications" style={{ position: "relative" }}>
          {IconBell}
          <span style={{ position: "absolute", top: "6px", right: "6px", width: "6px", height: "6px", borderRadius: "50%", background: "#F5A623", boxShadow: "0 0 6px rgba(245,166,35,0.5)" }} />
        </button>
        <button className="aurora-icon-btn" title="Settings">
          {IconSettings}
        </button>
        <button 
          className="aurora-icon-btn" 
          title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          onClick={handleThemeToggle}
        >
          {theme === "light" ? IconMoon : IconSun}
        </button>
        {location.pathname !== "/login" && (
          <Link to="/login" style={{
            fontWeight: 700,
            color: "var(--aurora-text)",
            background: "var(--aurora-hover)",
            padding: "0.55rem 1.2rem",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "1rem",
            boxShadow: "0 2px 8px rgba(15,30,58,0.06)",
            transition: "background 0.2s",
            marginLeft: "1.2rem"
          }}>
            Sign In
          </Link>
        )}
        {location.pathname !== "/signup" && (
          <Link to="/signup" style={{
            fontWeight: 700,
            color: "#fff",
            background: "var(--aurora-blue)",
            padding: "0.55rem 1.2rem",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "1rem",
            boxShadow: "0 2px 8px rgba(15,30,58,0.10)",
            transition: "background 0.2s",
            marginLeft: "0.5rem"
          }}>
            Sign Up
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;

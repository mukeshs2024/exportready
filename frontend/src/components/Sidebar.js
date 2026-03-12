import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Sidebar({ isCollapsed, toggleSidebar }) {
  const location = useLocation();
  const [hoveredPath, setHoveredPath] = useState(null);

  const navItems = [
    { path: "/", label: "Dashboard", emoji: "⌂" },
    { path: "/product", label: "Add Product", emoji: "+" },
    { path: "/market", label: "Market Analysis", emoji: "◌" },
    { path: "/profit", label: "Profit Simulator", emoji: "₹" },
    { path: "/export-plan", label: "Export Plan", emoji: "⇄" },
    { path: "/compliance", label: "Compliance Check", emoji: "✓" },
    { path: "/reports", label: "Reports", emoji: "≡" },
  ];

  const handleLogout = () => {
    alert("Logging out...");
  };

  return (
    <div
      style={{
        width: isCollapsed ? "70px" : "220px",
        height: "calc(100vh - 75px)",
        background: "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)",
        position: "fixed",
        left: 0,
        top: "75px",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid rgba(212, 175, 55, 0.1)",
        boxShadow: "4px 0 16px rgba(15, 30, 58, 0.3)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        zIndex: 100,
        overflowY: "auto",
      }}
    >
      {/* Navigation Menu */}
      <nav
        style={{
          flex: 1,
          padding: "1.2rem 0.6rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
          transition: "padding 0.3s ease",
        }}
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const currentPageName = navItems.find(nav => nav.path === location.pathname)?.label || "ExportReady";
          const isHovered = hoveredPath === item.path;
          return (
          <div key={item.path} style={{ position: "relative" }}>
            {/* Hover Tooltip Button */}
            {isHovered && isCollapsed && (
              <div
                style={{
                  position: "absolute",
                  left: "100%",
                  top: "50%",
                  transform: "translateY(-50%)",
                  marginLeft: "1rem",
                  background: "linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)",
                  padding: "1.75rem 2.25rem",
                  borderRadius: "12px",
                  whiteSpace: "nowrap",
                  fontWeight: "700",
                  color: "#0f1e3a",
                  fontSize: "1rem",
                  boxShadow: "0 8px 32px rgba(15, 30, 58, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  zIndex: 1001,
                  animation: "slideIn 0.2s ease forwards",
                  border: "2px solid rgba(15, 30, 58, 0.1)",
                }}
              >
                <span style={{ fontSize: "2rem", display: "flex", alignItems: "center" }}>{item.emoji}</span>
                <span style={{ lineHeight: "1.3" }}>{item.label}</span>
              </div>
            )}
            <style>{`
              @keyframes slideIn {
                from {
                  opacity: 0;
                  transform: translateY(-50%) translateX(-10px);
                }
                to {
                  opacity: 1;
                  transform: translateY(-50%) translateX(0);
                }
              }
            `}</style>
          <Link
            key={item.path}
            to={item.path}
            onClick={toggleSidebar}
            title={isCollapsed ? (isActive ? currentPageName : item.label) : item.label}
            onMouseEnter={() => setHoveredPath(item.path)}
            onMouseLeave={() => setHoveredPath(null)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: isCollapsed ? "center" : "flex-start",
              gap: isCollapsed ? 0 : "1rem",
              padding: isCollapsed ? "0.75rem 0.5rem" : "0.75rem 1rem",
              background: isActive
                ? "linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%)"
                : isHovered ? "rgba(212, 175, 55, 0.08)" : "transparent",
              border: isActive
                ? "1.5px solid #d4af37"
                : "1.5px solid transparent",
              borderRadius: "10px",
              color: isActive ? "#d4af37" : isHovered ? "#d4af37" : "#cbd5e1",
              fontSize: "0.88rem",
              fontWeight: isActive ? "700" : "500",
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
              position: "relative",
            }}
          >
            <span style={{ fontSize: "1.3rem", display: "flex", alignItems: "center" }}>
              {item.emoji}
            </span>
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
          </div>
          );
        })}
      </nav>

      {/* Settings Section with Divider */}
      <div
        style={{
          borderTop: "1px solid rgba(212, 175, 55, 0.1)",
          padding: "0.75rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <button
          onClick={() => alert("Settings coming soon")}
          title="Settings"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "flex-start",
            gap: isCollapsed ? 0 : "0.875rem",
            padding: isCollapsed ? "0.75rem" : "0.875rem 1rem",
            background: "transparent",
            border: "1.5px solid transparent",
            borderRadius: "10px",
            color: "#cbd5e1",
            fontSize: "0.95rem",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s ease",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(212, 175, 55, 0.08)";
            e.currentTarget.style.color = "#d4af37";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#cbd5e1";
          }}
        >
          {!isCollapsed && <span>Settings</span>}
        </button>
      </div>

      {/* User Profile Section */}
      <div
        style={{
          borderTop: "1px solid rgba(212, 175, 55, 0.15)",
          padding: isCollapsed ? "1rem 0.75rem" : "1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          gap: isCollapsed ? 0 : "0.875rem",
        }}
      >
        {!isCollapsed && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.875rem",
              flex: 1,
              minWidth: 0,
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.3rem",
                fontWeight: "800",
                color: "#0f1e3a",
                flexShrink: 0,
              }}
            >
              U
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: "0.9rem",
                  fontWeight: "700",
                  color: "white",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                User
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#cbd5e1",
                  whiteSpace: "nowrap",
                }}
              >
                Trader
              </div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          title="Logout"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            background: "rgba(212, 175, 55, 0.1)",
            border: "1px solid rgba(212, 175, 55, 0.2)",
            color: "#cbd5e1",
            cursor: "pointer",
            fontSize: "1.1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(212, 175, 55, 0.2)";
            e.currentTarget.style.color = "#d4af37";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(212, 175, 55, 0.1)";
            e.currentTarget.style.color = "#cbd5e1";
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Sidebar;

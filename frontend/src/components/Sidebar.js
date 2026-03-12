import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { path: "/", label: "Dashboard", icon: "" },
    { path: "/product", label: "Add Product", icon: "" },
    { path: "/market", label: "Market Analysis", icon: "" },
    { path: "/profit", label: "Profit Simulator", icon: "" },
    { path: "/export-plan", label: "Export Plan", icon: "" },
    { path: "/compliance", label: "Compliance Check", icon: "" },
    { path: "/reports", label: "Reports", icon: "" },
  ];

  const handleLogout = () => {
    alert("Logging out...");
  };

  return (
    <div
      style={{
        width: isCollapsed ? "90px" : "260px",
        height: "100vh",
        background: "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)",
        position: "fixed",
        left: 0,
        top: 0,
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid rgba(212, 175, 55, 0.1)",
        boxShadow: "4px 0 16px rgba(15, 30, 58, 0.3)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        zIndex: 1000,
        overflowY: "auto",
      }}
    >
      {/* Logo Section */}
      <div
        style={{
          padding: "1.75rem",
          borderBottom: "1px solid rgba(212, 175, 55, 0.15)",
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "flex-start",
            gap: "0.75rem",
          }}
        >
          {!isCollapsed && (
            <div>
              <div
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "800",
                  color: "white",
                  letterSpacing: "0.5px",
                  transition: "font-size 0.3s ease",
                }}
              >
                ExportReady
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav
        style={{
          flex: 1,
          padding: "1.5rem 0.75rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          transition: "padding 0.3s ease",
        }}
      >
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            title={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: isCollapsed ? "center" : "flex-start",
              gap: isCollapsed ? 0 : "0.875rem",
              padding: "0.875rem 1rem",
              background: location.pathname === item.path
                ? "linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%)"
                : "transparent",
              border: location.pathname === item.path
                ? "1.5px solid #d4af37"
                : "1.5px solid transparent",
              borderRadius: "10px",
              color: location.pathname === item.path ? "#d4af37" : "#cbd5e1",
              fontSize: "0.95rem",
              fontWeight: location.pathname === item.path ? "700" : "500",
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== item.path) {
                e.currentTarget.style.background = "rgba(212, 175, 55, 0.08)";
                e.currentTarget.style.color = "#d4af37";
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== item.path) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#cbd5e1";
              }
            }}
          >
            {item.label}
          </Link>
        ))}
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

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? "Expand" : "Collapse"}
        style={{
          position: "absolute",
          bottom: isCollapsed ? "100px" : "20px",
          right: "-12px",
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)",
          border: "2px solid #0f1e3a",
          color: "#0f1e3a",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.85rem",
          fontWeight: "800",
          transition: "all 0.2s ease",
          boxShadow: "0 2px 8px rgba(15, 30, 58, 0.3)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {isCollapsed ? "→" : "←"}
      </button>
    </div>
  );
}

export default Sidebar;

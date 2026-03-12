import { Link, useLocation } from "react-router-dom";

const linkStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "8px",
  padding: "12px 15px",
  textDecoration: "none",
  color: "#0D1B4C",
  fontWeight: "600",
  borderRadius: "8px",
  transition: "all 0.2s"
};

function Sidebar() {

  const location = useLocation();

  const getLinkStyle = (path) => ({
    ...linkStyle,
    background: location.pathname === path ? "#e0e7ff" : "transparent",
    color: location.pathname === path ? "#0D1B4C" : "#4b5563",
    borderLeft: location.pathname === path ? "4px solid #0D1B4C" : "4px solid transparent"
  });

  return (
    <div style={{
      width: "260px",
      background: "#f8fafc",
      minHeight: "100vh",
      padding: "20px 15px",
      borderRight: "2px solid #e2e8f0",
      boxShadow: "1px 0 4px rgba(0,0,0,0.05)",
      overflowY: "auto"
    }}>
      
      <div style={{marginBottom: "30px", paddingBottom: "15px", borderBottom: "2px solid #e2e8f0"}}>
        <h3 style={{color: "#0D1B4C", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px"}}>Menu</h3>
      </div>

      <Link style={getLinkStyle("/")} to="/">
        <span>🏠</span> Dashboard
      </Link>

      <Link style={getLinkStyle("/product")} to="/product">
        <span>📦</span> Add Product
      </Link>

      <Link style={getLinkStyle("/market")} to="/market">
        <span>🌍</span> Market Analysis
      </Link>

      <Link style={getLinkStyle("/profit")} to="/profit">
        <span>💰</span> Profit Simulator
      </Link>

      <Link style={getLinkStyle("/export-plan")} to="/export-plan">
        <span>📋</span> Export Plan
      </Link>

    </div>
  );
}

export default Sidebar;

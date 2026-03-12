import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)",
      padding: "0 2.5rem 0 3rem",
      height: "75px",
      boxShadow: "0 8px 24px rgba(15, 30, 58, 0.15)",
      borderBottom: "2px solid #d4af37",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      width: "100%",
      zIndex: 999
    }}>
      <Link to="/" style={{textDecoration: "none", display: "flex", alignItems: "center", gap: "8px"}}>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
          <h2 style={{
            margin: 0,
            fontSize: "1.3rem",
            fontWeight: "800",
            color: "white",
            letterSpacing: "0.5px",
            whiteSpace: "nowrap",
            minWidth: "200px",
            textAlign: "center"
          }}>
            Export<span style={{color: "#d4af37"}}>Ready</span>
          </h2>
          <p style={{
            margin: "2px 0 0 0",
            fontSize: "0.6rem",
            color: "#d4af37",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            fontWeight: "600",
            textAlign: "center"
          }}>
            Global Trade Intelligence
          </p>
        </div>
      </Link>
      <div style={{flexGrow: 1}}></div>
      
      {/* User Profile Section */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.5rem 1rem",
        background: "rgba(255, 255, 255, 0.08)",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 0.2s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
        e.currentTarget.style.transform = "translateY(0)";
      }}>
        {/* User Avatar/Icon */}
        <div style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
          fontWeight: "700",
          color: "#0f1e3a",
          boxShadow: "0 2px 8px rgba(212, 175, 55, 0.3)"
        }}>
          👤
        </div>
        
        {/* Username Text */}
        <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
          <p style={{
            margin: 0,
            fontSize: "0.85rem",
            fontWeight: "700",
            color: "white",
            lineHeight: "1.2"
          }}>
            Exporter
          </p>
          <p style={{
            margin: "2px 0 0 0",
            fontSize: "0.65rem",
            color: "#d4af37",
            fontWeight: "500"
          }}>
            Premium Account
          </p>
        </div>
      </div>
    </div>
  );
}

export default Navbar;


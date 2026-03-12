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
    </div>
  );
}

export default Navbar;


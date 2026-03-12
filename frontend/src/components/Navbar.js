import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)",
      padding: "0 2.5rem",
      height: "75px",
      boxShadow: "0 8px 24px rgba(15, 30, 58, 0.15)",
      borderBottom: "2px solid #d4af37"
    }}>
      <Link to="/" style={{textDecoration: "none", display: "flex", alignItems: "center", gap: "8px"}}>
        <div>
          <h2 style={{
            margin: 0,
            fontSize: "1.7rem",
            fontWeight: "800",
            color: "white",
            letterSpacing: "0.5px"
          }}>
            Export<span style={{color: "#d4af37"}}>Ready</span>
          </h2>
          <p style={{
            margin: "2px 0 0 0",
            fontSize: "0.7rem",
            color: "#d4af37",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            fontWeight: "600"
          }}>
            Global Trade Intelligence
          </p>
        </div>
      </Link>
      <div style={{flexGrow: 1}}></div>
      <div style={{
        fontSize: "0.75rem",
        color: "rgba(255, 255, 255, 0.8)",
        letterSpacing: "1px",
        textTransform: "uppercase",
        fontWeight: "500"
      }}>
        Professional Import/Export Platform
      </div>
    </div>
  );
}

export default Navbar;


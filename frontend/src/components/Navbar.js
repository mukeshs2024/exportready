import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div style={{
      background: "linear-gradient(90deg, #0D1B4C 0%, #1a2a5e 100%)",
      color: "white",
      padding: "15px 30px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
        <Link to="/" style={{textDecoration: "none"}}>
          <h2 style={{margin: 0, fontSize: "1.6rem", fontWeight: "700", color: "white"}}>
            📊 ExportReady
          </h2>
        </Link>
        <p style={{margin: 0, opacity: 0.9, fontSize: "0.95rem"}}>Your Export Intelligence Platform</p>
      </div>
    </div>
  );
}

export default Navbar;
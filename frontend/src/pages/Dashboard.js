import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();

  const cardStyle = (color) => ({
    background: color,
    padding: "30px",
    borderRadius: "12px",
    width: "100%",
    minHeight: "200px",
    color: "white",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    border: "none"
  });

  return (
    <div style={{padding: "0"}}>
      
      <div style={{background: "linear-gradient(135deg, #0D1B4C 0%, #1a2a5e 100%)", color: "white", padding: "40px 30px", borderRadius: "0", marginBottom: "40px"}}>
        <h1 style={{fontSize: "2.5rem", marginBottom: "10px"}}>Welcome to ExportReady</h1>
        <p style={{fontSize: "1.1rem", opacity: 0.9}}>Analyze global markets and maximize your export profit potential</p>
      </div>

      <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "25px", marginBottom: "40px"}}>
        
        <div
          onClick={() => navigate("/product")}
          style={cardStyle("#10b981")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px)";
            e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
          }}
        >
          <h3 style={{fontSize: "1.4rem", marginBottom: "10px"}}>📦 Add Product</h3>
          <p style={{fontSize: "0.95rem", opacity: 0.95}}>Register a new product for export analysis</p>
        </div>

        <div
          onClick={() => navigate("/market")}
          style={cardStyle("#F5A623")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px)";
            e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
          }}
        >
          <h3 style={{fontSize: "1.4rem", marginBottom: "10px"}}>🌍 Market Analysis</h3>
          <p style={{fontSize: "0.95rem", opacity: 0.95}}>Discover top export countries and opportunities</p>
        </div>

        <div
          onClick={() => navigate("/profit")}
          style={cardStyle("#0D1B4C")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px)";
            e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
          }}
        >
          <h3 style={{fontSize: "1.4rem", marginBottom: "10px"}}>💰 Profit Simulator</h3>
          <p style={{fontSize: "0.95rem", opacity: 0.95}}>Calculate estimated export profitability</p>
        </div>

        <div
          onClick={() => navigate("/export-plan")}
          style={cardStyle("#7c3aed")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px)";
            e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
          }}
        >
          <h3 style={{fontSize: "1.4rem", marginBottom: "10px"}}>📋 Compliance Guide</h3>
          <p style={{fontSize: "0.95rem", opacity: 0.95}}>Understand export rules and regulations</p>
        </div>

      </div>

      <div style={{background: "#f3f4f6", padding: "25px", borderRadius: "12px", marginTop: "40px"}}>
        <h3 style={{color: "#0D1B4C", marginBottom: "10px"}}>ℹ️ Getting Started</h3>
        <ul style={{color: "#4b5563", lineHeight: "1.8", marginLeft: "20px"}}>
          <li>Start by clicking "Add Product" to register your export products</li>
          <li>Use "Market Analysis" to research potential export destinations</li>
          <li>Run the "Profit Simulator" to forecast your returns</li>
          <li>Check the "Compliance Guide" for regulatory requirements</li>
        </ul>
      </div>

    </div>
  );
}

export default Dashboard;

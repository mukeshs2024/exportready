import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      icon: "",
      title: "Add Product",
      description: "Register and manage your export products",
      path: "/product",
      color: "#16a34a"
    },
    {
      icon: "",
      title: "Market Analysis",
      description: "Discover global markets for your products",
      path: "/market",
      color: "#ca8a04"
    },
    {
      icon: "",
      title: "Profit Simulator",
      description: "Calculate export profitability scenarios",
      path: "/profit",
      color: "#2563eb"
    },
    {
      icon: "",
      title: "Export Plan",
      description: "Compliance checklist and export roadmap",
      path: "/export-plan",
      color: "#8b5cf6"
    }
  ];

  return (
    <div style={{paddingLeft: "0"}}>
      <div style={{
        background: "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)",
        color: "white",
        padding: "2rem 3rem",
        paddingLeft: "0",
        borderRadius: "12px",
        marginBottom: "2.5rem",
        boxShadow: "0 4px 12px rgba(15, 30, 58, 0.12)",
        border: "1px solid rgba(212, 175, 55, 0.2)"
      }}>
        <h1 style={{fontSize: "1.9rem", fontWeight: "800", marginBottom: "0.5rem", letterSpacing: "-1px"}}>
          <span style={{marginRight: "0.75rem"}}>⌂</span>Welcome to ExportReady
        </h1>
        <p style={{fontSize: "0.9rem", opacity: 0.95, maxWidth: "600px", lineHeight: "1.7"}}>
          Your comprehensive platform for international trade intelligence. Analyze global markets, 
          simulate profits, and ensure compliance with <span style={{color: "#d4af37", fontWeight: "700"}}>professional expertise</span>.
        </p>
      </div>

      <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem", margin: "2.5rem 0"}}>
        {cards.map((card) => (
          <div
            key={card.path}
            onClick={() => navigate(card.path)}
            style={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "1.5rem",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 1px 3px rgba(15, 30, 58, 0.1)",
              minHeight: "180px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(15, 30, 58, 0.15)";
              e.currentTarget.style.borderTop = "4px solid #d4af37";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(15, 30, 58, 0.1)";
              e.currentTarget.style.borderTop = "none";
            }}
          >
            <div>
              <div style={{fontSize: "2rem", marginBottom: "0.5rem", display: "block"}}>{card.icon}</div>
              <h3 style={{fontSize: "0.95rem", fontWeight: "700", color: "#0f1e3a", marginBottom: "0.5rem"}}>
                {card.title}
              </h3>
              <p style={{fontSize: "0.7rem", color: "#4a5568", lineHeight: "1.5"}}>
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div style={{background: "#f7f8fc", padding: "2.5rem", borderRadius: "12px", marginTop: "3rem", border: "1px solid #e2e8f0"}}>
        <h3 style={{color: "#0f1e3a", marginBottom: "1.2rem", fontSize: "1rem", fontWeight: "700"}}>
          Quick Start Guide
        </h3>
        <ul style={{color: "#4a5568", lineHeight: "1.9", marginLeft: "1.5rem", fontSize: "0.82rem"}}>
          <li style={{marginBottom: "0.5rem"}}><strong>Step 1:</strong> Register your export products with detailed specifications</li>
          <li style={{marginBottom: "0.5rem"}}><strong>Step 2:</strong> Analyze target markets to identify best opportunities</li>
          <li style={{marginBottom: "0.5rem"}}><strong>Step 3:</strong> Run profit simulations for different scenarios</li>
          <li style={{marginBottom: "0.5rem"}}><strong>Step 4:</strong> Review compliance requirements for your markets</li>
        </ul>
      </div>

      <div style={{background: "#0f1e3a", color: "white", padding: "1.5rem", borderRadius: "8px", marginTop: "2rem", textAlign: "center"}}>
        <p style={{fontSize: "0.82rem", opacity: 0.9}}>
          Enterprise-Grade Security | Global Compliance | Real-Time Analytics
        </p>
      </div>
    </div>
  );
}

export default Dashboard;

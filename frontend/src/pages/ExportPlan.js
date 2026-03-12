import { useState } from "react";
import API from "../services/api";

function ExportPlan() {

  const [productName, setProductName] = useState("");
  const [targetCountry, setTargetCountry] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generatePlan = async () => {
    if (!productName.trim() || !targetCountry.trim()) {
      alert("Please enter both product name and target country");
      return;
    }

    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await API.get("/export-action-plan", {
        params: {
          product_name: productName,
          target_country: targetCountry
        }
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{background: "white", padding: "2.5rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(15, 30, 58, 0.12)", maxWidth: "900px", margin: "0 auto", border: "1px solid #e2e8f0"}}>
      <h2 style={{color: "#0f1e3a", marginBottom: "2.5rem", fontSize: "1.8rem", fontWeight: "800"}}>Export Action Plan</h2>

      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem"}}>
        <div>
          <label style={{display: "block", fontWeight: "600", color: "#1a202c", marginBottom: "0.5rem", fontSize: "0.95rem"}}>
            Product Name
          </label>
          <input
            placeholder="e.g., Cotton Shirts"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            style={{
              width: "100%",
              padding: "0.875rem 1rem",
              border: "1.5px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "1rem",
              fontFamily: "inherit",
              transition: "all 0.2s ease"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#0f1e3a";
              e.target.style.boxShadow = "0 0 0 3px rgba(15, 30, 58, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        <div>
          <label style={{display: "block", fontWeight: "600", color: "#1a202c", marginBottom: "0.5rem", fontSize: "0.95rem"}}>
            Target Country
          </label>
          <input
            placeholder="e.g., USA, Germany"
            value={targetCountry}
            onChange={(e) => setTargetCountry(e.target.value)}
            style={{
              width: "100%",
              padding: "0.875rem 1rem",
              border: "1.5px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "1rem",
              fontFamily: "inherit",
              transition: "all 0.2s ease"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#0f1e3a";
              e.target.style.boxShadow = "0 0 0 3px rgba(15, 30, 58, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      </div>

      <button 
        onClick={generatePlan} 
        disabled={loading} 
        style={{
          width: "100%",
          padding: "0.875rem 1.5rem",
          background: loading ? "#e2e8f0" : "linear-gradient(135deg, #ca8a04 0%, #a16207 100%)",
          color: loading ? "#4a5568" : "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "1rem",
          fontWeight: "600",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          boxShadow: "0 1px 3px rgba(15, 30, 58, 0.1)"
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(15, 30, 58, 0.12)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 1px 3px rgba(15, 30, 58, 0.1)";
        }}
      >
        {loading ? "Generating Plan..." : "Generate Export Plan"}
      </button>

      {error && <p style={{color:"#dc2626",marginTop:"1.5rem",padding:"1rem",background:"#fee2e2",borderRadius:"6px",borderLeft:"3px solid #dc2626"}}>{error}</p>}

      {result && (
        <div style={{marginTop:"2.5rem"}}>
          <div style={{marginTop:"1.5rem",padding:"1.75rem",background:"#f0fdf4",borderRadius:"8px",border:"1px solid #d1fae5",borderLeft:"4px solid #16a34a"}}>
            <h3 style={{color: "#0f1e3a", marginBottom: "1.25rem", fontSize: "1.1rem", fontWeight: "700", display:"flex",alignItems:"center"}}>
              ✓ Compliance Checklist
            </h3>
            <ul style={{margin:"0",paddingLeft:"1.5rem"}}>
              {result.compliance_checklist.map((item, i) => (
                <li key={i} style={{margin:"0.75rem 0",color:"#1a202c",fontWeight:"500",lineHeight:"1.5"}}>{item}</li>
              ))}
            </ul>
          </div>

          <div style={{marginTop:"1.5rem",padding:"1.75rem",background:"#dbeafe",borderRadius:"8px",border:"1px solid #bfdbfe",borderLeft:"4px solid #0369a1"}}>
            <h3 style={{color: "#0f1e3a", marginBottom: "1.25rem", fontSize: "1.1rem", fontWeight: "700", display:"flex",alignItems:"center"}}>
              Required Documents
            </h3>
            <ul style={{margin:"0",paddingLeft:"1.5rem"}}>
              {result.required_documents.map((doc, i) => (
                <li key={i} style={{margin:"0.75rem 0",color:"#1a202c",fontWeight:"500",lineHeight:"1.5"}}>{doc}</li>
              ))}
            </ul>
          </div>

          <div style={{marginTop:"1.5rem",padding:"1.75rem",background:"#fef3c7",borderRadius:"8px",border:"1px solid #fde68a",borderLeft:"4px solid #ca8a04"}}>
            <h3 style={{color: "#0f1e3a", marginBottom: "1.25rem", fontSize: "1.1rem", fontWeight: "700", display:"flex",alignItems:"center"}}>
              Export Steps Roadmap
            </h3>
            <ol style={{margin:"0",paddingLeft:"1.5rem"}}>
              {result.export_steps.map((step, i) => (
                <li key={i} style={{margin:"0.75rem 0",color:"#1a202c",fontWeight:"500",lineHeight:"1.6"}}>
                  <span style={{color:"#92400e",fontWeight:"700"}}>{i+1}.</span> {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExportPlan;

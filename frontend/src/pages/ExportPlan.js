import { useState } from "react";
import API from "../services/api";

function ExportPlan() {

  const [productName, setProductName] = useState("");
  const [targetCountry, setTargetCountry] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generatePlan = async () => {
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

  const containerStyle = {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "30px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    border: "2px solid #ddd",
    borderRadius: "8px",
    fontSize: "1rem",
    fontFamily: "inherit"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
    color: "#1a1a2e",
    fontSize: "0.95rem"
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    background: loading ? "#9ca3af" : "#7c3aed",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: loading ? "not-allowed" : "pointer",
    marginTop: "10px"
  };

  const sectionStyle = {
    marginTop: "25px",
    padding: "20px",
    background: "#f8fafc",
    borderRadius: "8px",
    borderLeft: "4px solid #7c3aed"
  };

  return (
    <div style={containerStyle}>
      <h2 style={{color: "#0D1B4C", marginBottom: "25px"}}>📋 Export Action Plan</h2>

      <label style={labelStyle}>Product Name</label>
      <input
        placeholder="Enter product name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Target Country</label>
      <input
        placeholder="Enter target country (e.g., USA, Germany)"
        value={targetCountry}
        onChange={(e) => setTargetCountry(e.target.value)}
        style={inputStyle}
      />

      <button onClick={generatePlan} disabled={loading} style={buttonStyle}>
        {loading ? "Generating..." : "Generate Export Plan"}
      </button>

      {error && <p style={{color:"#ef4444",marginTop:"15px",padding:"12px",background:"#fee2e2",borderRadius:"6px"}}>{error}</p>}

      {result && (
        <div>
          <div style={sectionStyle}>
            <h3 style={{color: "#0D1B4C", marginBottom: "15px"}}>✓ Compliance Checklist</h3>
            <ul style={{margin:"0",paddingLeft:"20px"}}>
              {result.compliance_checklist.map((item, i) => (
                <li key={i} style={{margin:"8px 0",color:"#4b5563"}}>{item}</li>
              ))}
            </ul>
          </div>

          <div style={sectionStyle}>
            <h3 style={{color: "#0D1B4C", marginBottom: "15px"}}>📄 Required Documents</h3>
            <ul style={{margin:"0",paddingLeft:"20px"}}>
              {result.required_documents.map((doc, i) => (
                <li key={i} style={{margin:"8px 0",color:"#4b5563"}}>{doc}</li>
              ))}
            </ul>
          </div>

          <div style={sectionStyle}>
            <h3 style={{color: "#0D1B4C", marginBottom: "15px"}}>🗺️ Export Steps Roadmap</h3>
            <ol style={{margin:"0",paddingLeft:"20px"}}>
              {result.export_steps.map((step, i) => (
                <li key={i} style={{margin:"10px 0",color:"#4b5563",fontWeight:"500"}}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      )}

    </div>
  );
}

export default ExportPlan;

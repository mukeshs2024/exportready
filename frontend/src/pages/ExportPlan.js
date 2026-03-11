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

  return (
    <div>

      <h2>Export Action Plan</h2>

      <input
        placeholder="Product Name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
      <br/><br/>

      <input
        placeholder="Target Country (e.g., USA)"
        value={targetCountry}
        onChange={(e) => setTargetCountry(e.target.value)}
      />
      <br/><br/>

      <button onClick={generatePlan} disabled={loading}>
        {loading ? "Generating..." : "Generate Export Plan"}
      </button>

      {error && <p style={{color:"red",marginTop:"10px"}}>{error}</p>}

      {result && (
        <div style={{marginTop:"20px"}}>

          <h3>Compliance Checklist</h3>
          <ul>
            {result.compliance_checklist.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <h3>Required Documents</h3>
          <ul>
            {result.required_documents.map((doc, i) => (
              <li key={i}>{doc}</li>
            ))}
          </ul>

          <h3>Export Steps Roadmap</h3>
          <ol>
            {result.export_steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>

        </div>
      )}

    </div>
  );
}

export default ExportPlan;

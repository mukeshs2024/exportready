import { useState } from "react";
import API from "../services/api";
import Toast from "../components/Toast";

function ExporterRegister() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    country: "",
    email: "",
    phone: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const setField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const submit = async () => {
    setError("");
    setSuccess("");
    if (!form.name || !form.company || !form.country || !form.email || !form.phone || !form.password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await API.post("/auth/signup", {
        name: form.name.trim(),
        company_name: form.company.trim(),
        country: form.country.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        role: "exporter"
      });
      setSuccess("Exporter account created.");
      setForm({ name: "", company: "", country: "", email: "", phone: "", password: "" });
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to register exporter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", background: "white", padding: "2.5rem", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 10px 22px rgba(15, 30, 58, 0.08)" }}>
      <h2 style={{ margin: 0, fontSize: "1.6rem", color: "#0f1e3a", fontWeight: 800 }}>Exporter Registration</h2>
      <p style={{ color: "#4a5568", marginTop: "0.5rem" }}>
        Register as an exporter to list products and manage negotiations.
      </p>

      {error && <Toast message={error} type="error" onClose={() => setError("")} />}
      {success && <Toast message={success} type="success" onClose={() => setSuccess("")} />}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1.5rem" }}>
        <div>
          <label style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1a202c" }}>Name</label>
          <input value={form.name} onChange={setField("name")} placeholder="Your name" style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0" }} />
        </div>
        <div>
          <label style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1a202c" }}>Company Name</label>
          <input value={form.company} onChange={setField("company")} placeholder="Company" style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0" }} />
        </div>
        <div>
          <label style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1a202c" }}>Country</label>
          <input value={form.country} onChange={setField("country")} placeholder="Country" style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0" }} />
        </div>
        <div>
          <label style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1a202c" }}>Email</label>
          <input value={form.email} onChange={setField("email")} placeholder="Email" type="email" style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0" }} />
        </div>
        <div>
          <label style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1a202c" }}>Phone</label>
          <input value={form.phone} onChange={setField("phone")} placeholder="Phone" style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0" }} />
        </div>
        <div>
          <label style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1a202c" }}>Password</label>
          <input value={form.password} onChange={setField("password")} placeholder="Password" type="password" style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0" }} />
        </div>
      </div>

      <button
        onClick={submit}
        disabled={loading}
        style={{
          marginTop: "1.5rem",
          width: "100%",
          padding: "0.95rem 1.2rem",
          borderRadius: "12px",
          border: "none",
          background: "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)",
          color: "white",
          fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Creating Account..." : "Register as Exporter"}
      </button>
    </div>
  );
}

export default ExporterRegister;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Toast from "../components/Toast";
import AuthLayout from "../layouts/AuthLayout";
import ChooseRole from "../components/ChooseRole";


function Signup() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
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
  const navigate = useNavigate();

  const setField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleRole = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const submit = async (e) => {
    e.preventDefault();
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
        role: role
      });
      setSuccess("Account created! Redirecting...");
      setTimeout(() => {
        if (role === "exporter") {
          navigate("/dashboard");
        } else {
          navigate("/marketplace");
        }
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.detail || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div style={{ maxWidth: 480, background: "white", padding: "2.5rem", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 10px 22px rgba(15, 30, 58, 0.08)" }}>
        {step === 1 && (
          <ChooseRole setRole={handleRole} onNext={() => setStep(2)} />
        )}
        {step === 2 && (
          <>
            <h2 style={{ margin: 0, fontSize: "1.6rem", color: "#0f1e3a", fontWeight: 800 }}>Create your ExportReady Account</h2>
            <p style={{ color: "#4a5568", marginTop: "0.5rem" }}>
              {role === "exporter"
                ? "Find export markets, AI export insights, connect with buyers."
                : role === "importer"
                ? "Discover suppliers, browse products, negotiate orders."
                : "Sign up to access export intelligence and marketplace features."}
            </p>
            {error && <Toast message={error} type="error" onClose={() => setError("")} />}
            {success && <Toast message={success} type="success" onClose={() => setSuccess("")} />}
            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem", marginTop: "1.5rem" }}>
              <div>
                <label style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1a202c" }}>Full Name</label>
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
                <input value={form.email} onChange={setField("email")} type="email" placeholder="Email" style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0" }} />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1a202c" }}>Phone</label>
                <input value={form.phone} onChange={setField("phone")} placeholder="Phone" style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0" }} />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1a202c" }}>Password</label>
                <input value={form.password} onChange={setField("password")} type="password" placeholder="Password" style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0" }} />
              </div>
              <button type="submit" disabled={loading} style={{ width: "100%", padding: "0.95rem 1.2rem", borderRadius: "12px", background: loading ? "#cbd5e1" : "#0f1e3a", color: "white", fontWeight: 700, fontSize: "1rem", border: "none", cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>
            <div style={{ marginTop: "1.2rem", fontSize: "0.95rem", color: "#475569" }}>
              Already have an account? <a href="/login" style={{ color: "#0f1e3a", fontWeight: 700 }}>Sign In</a>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
}

export default Signup;

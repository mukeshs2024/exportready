
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Toast from "../components/Toast";
import AuthLayout from "../layouts/AuthLayout";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const setField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }
    setLoading(true);
    try {
      const response = await API.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });
      const user = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      if (user.role === "exporter") {
        navigate("/exporter/dashboard");
      } else {
        navigate("/marketplace");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div style={{ maxWidth: 400, background: "white", padding: "2.5rem", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 10px 22px rgba(15, 30, 58, 0.08)" }}>
        <h2 style={{ margin: 0, fontSize: "1.6rem", color: "#0f1e3a", fontWeight: 800 }}>Sign In to ExportReady</h2>
        <p style={{ color: "#4a5568", marginTop: "0.5rem" }}>Welcome back! Please sign in to your account.</p>
        {error && <Toast message={error} type="error" onClose={() => setError("")} />}
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem", marginTop: "1.5rem" }}>
          <div>
            <label style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1a202c" }}>Email</label>
            <input value={form.email} onChange={setField("email")} type="email" placeholder="Email" style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0" }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1a202c" }}>Password</label>
            <input value={form.password} onChange={setField("password")} type="password" placeholder="Password" style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0" }} />
          </div>
          <button type="submit" disabled={loading} style={{ width: "100%", padding: "0.95rem 1.2rem", borderRadius: "12px", background: loading ? "#cbd5e1" : "#0f1e3a", color: "white", fontWeight: 700, fontSize: "1rem", border: "none", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div style={{ marginTop: "1.2rem", fontSize: "0.95rem", color: "#475569" }}>
          Don't have an account? <a href="/signup" style={{ color: "#0f1e3a", fontWeight: 700 }}>Sign Up</a>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Login;

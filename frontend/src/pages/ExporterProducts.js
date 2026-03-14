import { useEffect, useState } from "react";
import API from "../services/api";
import Toast from "../components/Toast";

const emptyForm = {
  product_name: "",
  category: "",
  hs_code: "",
  price: "",
  min_order: "",
  country: "",
  description: "",
  image_url: ""
};

function ExporterProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const exporterId = Number(localStorage.getItem("exporter_id") || 0) || 1;

  const loadProducts = async () => {
    setError("");
    try {
      const response = await API.get("/exporter/products", { params: { exporter_id: exporterId } });
      setProducts(response.data || []);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load products");
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const submit = async () => {
    setError("");
    setSuccess("");

    if (!form.product_name.trim() || !form.category.trim() || !form.hs_code.trim() || !form.country.trim()) {
      setError("Product name, category, HS code, and country are required");
      return;
    }

    const price = Number(form.price || 0);
    const minOrder = Number(form.min_order || 0);
    if (price <= 0) {
      setError("Price must be greater than 0");
      return;
    }
    if (minOrder <= 0) {
      setError("Minimum order must be greater than 0");
      return;
    }

    const payload = {
      exporter_id: exporterId,
      product_name: form.product_name.trim(),
      category: form.category.trim(),
      hs_code: form.hs_code.trim(),
      price,
      min_order: minOrder,
      country: form.country.trim(),
      description: form.description.trim(),
      image_url: form.image_url.trim()
    };

    try {
      if (editingId) {
        await API.put(`/exporter/products/${editingId}`, null, { params: payload });
        setSuccess("Product updated successfully");
      } else {
        await API.post("/exporter/products", null, { params: payload });
        setSuccess("Product added successfully");
      }
      resetForm();
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save product");
    }
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setForm({
      product_name: product.product_name || "",
      category: product.category || "",
      hs_code: product.hs_code || "",
      price: product.price || "",
      min_order: product.min_order || "",
      country: product.country || "",
      description: product.description || "",
      image_url: product.image_url || ""
    });
  };

  const removeProduct = async (productId) => {
    setError("");
    setSuccess("");
    try {
      await API.delete(`/exporter/products/${productId}`, { params: { exporter_id: exporterId } });
      setSuccess("Product deleted");
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete product");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ margin: 0, color: "#0f1e3a", fontWeight: 800 }}>Product Management</h2>
        <p style={{ marginTop: "0.4rem", color: "#64748b" }}>Add, edit, or remove your export listings.</p>
      </div>

      {error && <Toast message={error} type="error" onClose={() => setError("")} />}
      {success && <Toast message={success} type="success" onClose={() => setSuccess("")} />}

      <div style={{ background: "white", borderRadius: "14px", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 8px 16px rgba(15, 30, 58, 0.06)" }}>
        <h3 style={{ marginTop: 0, color: "#0f1e3a" }}>{editingId ? "Edit Product" : "Add Product"}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          <input value={form.product_name} onChange={setField("product_name")} placeholder="Product Name" style={{ padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0" }} />
          <input value={form.category} onChange={setField("category")} placeholder="Category" style={{ padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0" }} />
          <input value={form.hs_code} onChange={setField("hs_code")} placeholder="HS Code" style={{ padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0" }} />
          <input type="number" value={form.price} onChange={setField("price")} placeholder="Price per unit" style={{ padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0" }} />
          <input type="number" value={form.min_order} onChange={setField("min_order")} placeholder="Minimum Order Quantity" style={{ padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0" }} />
          <input value={form.country} onChange={setField("country")} placeholder="Country of Origin" style={{ padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0" }} />
          <input value={form.image_url} onChange={setField("image_url")} placeholder="Image URL" style={{ padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0" }} />
          <textarea value={form.description} onChange={setField("description")} placeholder="Product Description" rows={3} style={{ padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0", gridColumn: "1 / -1" }} />
        </div>
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
          <button
            onClick={submit}
            style={{ padding: "0.85rem 1.2rem", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)", color: "white", fontWeight: 700, cursor: "pointer" }}
          >
            {editingId ? "Update Product" : "Add Product"}
          </button>
          {editingId && (
            <button
              onClick={resetForm}
              style={{ padding: "0.85rem 1.2rem", borderRadius: "10px", border: "1px solid #e2e8f0", background: "white", color: "#0f1e3a", fontWeight: 700, cursor: "pointer" }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div style={{ marginTop: "2rem", display: "grid", gap: "1rem" }}>
        {products.map((product) => (
          <div key={product.id} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", border: "1px solid #e2e8f0", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
            <div>
              <h3 style={{ margin: 0, color: "#0f1e3a" }}>{product.product_name}</h3>
              <p style={{ margin: "0.4rem 0", color: "#64748b" }}>{product.category} | HS {product.hs_code}</p>
              <p style={{ margin: 0, color: "#64748b" }}>Price: ${Number(product.price || 0).toFixed(2)} | MOQ: {product.min_order}</p>
              <p style={{ marginTop: "0.4rem", color: "#94a3b8" }}>{product.country}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", alignItems: "flex-end", justifyContent: "center" }}>
              <button
                onClick={() => startEdit(product)}
                style={{ padding: "0.7rem 1rem", borderRadius: "10px", border: "1px solid #e2e8f0", background: "white", color: "#0f1e3a", fontWeight: 700, cursor: "pointer" }}
              >
                Edit
              </button>
              <button
                onClick={() => removeProduct(product.id)}
                style={{ padding: "0.7rem 1rem", borderRadius: "10px", border: "none", background: "#ef4444", color: "white", fontWeight: 700, cursor: "pointer" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExporterProducts;
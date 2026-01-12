import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.get(`/products/${id}`)
        .then(res => {
          const p = res.data;
          setForm({
            name: p.name,
            description: p.description || "",
            price: p.price,
            stock: p.stock || 0
          });
        })
        .catch(() => setError("Failed to fetch product"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    if (!form.name || !form.price) {
      setError("Name and Price are required");
      return;
    }

    try {
      setLoading(true);
      if (id) {
        await api.put(`/products/${id}`, form);
      } else {
        await api.post("/products", form);
      }
      navigate("/products");
    } catch (err) {
      setError("Failed to save product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="spinner-border text-primary border-3" role="status"></div>
    </div>
  );

  return (
    <div className="container p-4">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-8">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-header bg-white border-0 pt-4 px-4">
              <div className="d-flex align-items-center">
                <div className={`p-2 rounded-3 me-3 ${id ? "bg-warning-subtle text-warning" : "bg-primary-subtle text-primary"}`}>
                  <i className={`bi ${id ? "bi-pencil-square" : "bi-plus-square"} fs-4`}></i>
                </div>
                <div>
                  <h4 className="fw-bold mb-0 text-dark">{id ? "Edit Product" : "New Inventory Item"}</h4>
                  <p className="text-muted small mb-0">Fill in the information below to update your catalog.</p>
                </div>
              </div>
            </div>

            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger border-0 shadow-sm small d-flex align-items-center mb-4">
                  <i className="bi bi-exclamation-octagon-fill me-2"></i> {error}
                </div>
              )}

              <div className="row g-4">
                <div className="col-12">
                  <label className="form-label fw-bold text-dark small">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control form-control-lg bg-light border-0"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Professional Camera Tripod"
                    style={{ fontSize: "0.95rem" }}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold text-dark small">Unit Price ($)</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0 text-muted">$</span>
                    <input
                      type="number"
                      name="price"
                      className="form-control form-control-lg bg-light border-0"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      style={{ fontSize: "0.95rem" }}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold text-dark small">Quantity in Stock</label>
                  <input
                    type="number"
                    name="stock"
                    className="form-control form-control-lg bg-light border-0"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="0"
                    style={{ fontSize: "0.95rem" }}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-bold text-dark small">Description</label>
                  <textarea
                    name="description"
                    className="form-control bg-light border-0"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Provide details about the product's features and specifications..."
                    rows={5}
                    style={{ fontSize: "0.95rem" }}
                  />
                </div>
              </div>
            </div>

            <div className="card-footer bg-light border-0 p-4 rounded-bottom-4 d-flex justify-content-end gap-2">
              <button className="btn btn-white border px-4 fw-semibold" onClick={() => navigate("/products")}>
                Cancel
              </button>
              <button className="btn btn-primary px-4 fw-semibold shadow-sm" onClick={save}>
                <i className={`bi ${id ? "bi-arrow-repeat" : "bi-check-lg"} me-2`}></i>
                {id ? "Update Details" : "Publish Product"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
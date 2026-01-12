import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try { await api.delete(`/products/${id}`); fetchProducts(); }
    catch (err) { console.error(err); }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Inventory</h3>
          <p className="text-muted small mb-0">Track and manage your product stock levels.</p>
        </div>
        <Link to="/products/create" className="btn btn-primary px-4 shadow-sm fw-semibold">
          <i className="bi bi-plus-lg me-2"></i> Add Product
        </Link>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary border-3" role="status"></div>
            <p className="text-muted mt-2 small">Loading catalog...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4 py-3 text-muted fw-bold small text-uppercase" style={{ width: "80px" }}>ID</th>
                  <th className="py-3 text-muted fw-bold small text-uppercase">Product Details</th>
                  <th className="py-3 text-muted fw-bold small text-uppercase">Price</th>
                  <th className="py-3 text-muted fw-bold small text-uppercase">Availability</th>
                  <th className="py-3 text-muted fw-bold small text-uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="border-top-0">
                {products.length > 0 ? products.map(p => (
                  <tr key={p.id}>
                    <td className="ps-4 text-muted small">#{p.id}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="p-2 bg-light rounded-3 me-3 text-primary">
                          <i className="bi bi-box fs-5"></i>
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{p.name}</div>
                          <div className="text-muted x-small text-truncate" style={{ maxWidth: "250px" }}>
                            {p.description || "No description provided"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="fw-bold text-dark">${Number(p.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </td>
                    <td>
                      <span className={`badge rounded-pill px-3 py-2 ${p.stock > 10 ? "bg-success-subtle text-success" :
                          p.stock > 0 ? "bg-warning-subtle text-warning" :
                            "bg-danger-subtle text-danger"
                        }`}>
                        <i className={`bi bi-circle-fill me-1 small`}></i>
                        {p.stock > 0 ? `${p.stock} Units` : "Out of Stock"}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <Link to={`/products/${p.id}/edit`} className="btn btn-white btn-sm border shadow-sm px-2">
                          <i className="bi bi-pencil text-primary"></i>
                        </Link>
                        <button onClick={() => handleDelete(p.id)} className="btn btn-white btn-sm border shadow-sm px-2">
                          <i className="bi bi-trash3 text-danger"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <p className="text-muted mb-0 small">No products available in the catalog.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
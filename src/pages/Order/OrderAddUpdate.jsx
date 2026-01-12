import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../auth/AuthContext";

export default function OrderForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const user = auth?.user;
  const isEdit = Boolean(id);

  const [username, setUserName] = useState(user?.name || "");
  const [status, setStatus] = useState("pending");
  const [items, setItems] = useState([{ product_id: "", quantity: 1, price: 0 }]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { if (user?.name) setUserName(user.name); }, [user]);

  useEffect(() => {
    api.get("/products").then(res => setProducts(res.data)).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      api.get(`/orders/${id}`)
        .then(res => {
          const o = res.data;
          setStatus(o.status || "pending");
          setItems(o.items?.map(i => ({
            product_id: i.product_id,
            quantity: i.quantity,
            price: Number(i.price)
          })) || [{ product_id: "", quantity: 1, price: 0 }]);
        })
        .catch(() => setError("Failed to fetch order"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    if (field === "product_id") {
      const productId = Number(value);
      newItems[index].product_id = productId;
      const selected = products.find(p => p.id === productId);
      if (selected) newItems[index].price = Number(selected.price);
    } else {
      newItems[index][field] = value;
    }
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { product_id: "", quantity: 1, price: 0 }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));
  const handleSave = async () => {
    try {
      for (const i of items) {
        if (!i.product_id) throw new Error("Select product for all items");
        if (i.quantity <= 0) throw new Error("Quantity must be > 0");
      }

      const payload = { status, items };

      if (isEdit) {
        await api.put(`/orders/${id}`, payload);
      } else {
        await api.post("/orders", payload);
      }

      navigate("/orders");
    } catch (err) {
      alert("Save failed! " + err.message);
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary border-3"></div></div>;

  return (
    <div className="container p-4">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-9">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-header bg-white border-0 pt-4 px-4">
              <div className="d-flex align-items-center">
                <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-3 me-3">
                  <i className={`bi ${isEdit ? "bi-receipt-cutoff" : "bi-cart-plus"} fs-4`}></i>
                </div>
                <div>
                  <h4 className="fw-bold mb-0 text-dark">{isEdit ? "Update Order" : "New Sales Order"}</h4>
                  <p className="text-muted small mb-0">Record customer transaction details and line items.</p>
                </div>
              </div>
            </div>

            <div className="card-body p-4">
              {error && <div className="alert alert-danger border-0 small shadow-sm mb-4">{error}</div>}

              {/* Order Meta Data */}
              <div className="row g-3 mb-4 p-3 bg-light rounded-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold text-dark small">Account Manager / Customer</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-0"><i className="bi bi-person text-muted"></i></span>
                    <input className="form-control border-0 bg-white shadow-none" value={username} readOnly />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold text-dark small">Fulfillment Status</label>
                  <select
                    className="form-select border-0 bg-white shadow-none"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                  >
                    <option value="pending">🟡 Pending Payment</option>
                    <option value="processing">🔵 In Processing</option>
                    <option value="completed">🟢 Fulfillment Complete</option>
                    <option value="cancelled">🔴 Voided / Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="mb-3 d-flex justify-content-between align-items-center">
                <h6 className="fw-bold text-dark mb-0">Order Items</h6>
                <button className="btn btn-sm btn-outline-primary fw-bold" onClick={addItem}>
                  <i className="bi bi-plus-lg me-1"></i> Add Item
                </button>
              </div>

              <div className="table-responsive mb-4">
                <table className="table table-borderless align-middle">
                  <thead>
                    <tr className="small text-muted text-uppercase">
                      <th style={{ width: "50%" }}>Product Selection</th>
                      <th style={{ width: "15%" }}>Quantity</th>
                      <th style={{ width: "20%" }}>Unit Price</th>
                      <th className="text-end" style={{ width: "15%" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr key={i} className="border-bottom border-light">
                        <td className="ps-0">
                          <select
                            className="form-select bg-light border-0 shadow-none"
                            value={item.product_id}
                            onChange={e => handleItemChange(i, "product_id", e.target.value)}
                          >
                            <option value="">Choose a product...</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control bg-light border-0 shadow-none text-center"
                            value={item.quantity}
                            onChange={e => handleItemChange(i, "quantity", Number(e.target.value))}
                          />
                        </td>
                        <td>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-0 text-muted small">$</span>
                            <input className="form-control bg-light border-0 shadow-none" value={item.price.toFixed(2)} readOnly />
                          </div>
                        </td>
                        <td className="text-end pe-0">
                          <button className="btn btn-outline-danger btn-sm border-0" onClick={() => removeItem(i)}>
                            <i className="bi bi-x-circle fs-5"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card-footer bg-light border-0 p-4 rounded-bottom-4 d-flex justify-content-end gap-2">
              <button className="btn btn-white border px-4 fw-semibold" onClick={() => navigate("/orders")}>
                Discard
              </button>
              <button
                className="btn btn-primary px-4 fw-bold shadow-sm"
                onClick={handleSave}
              >
                {isEdit ? "Apply Changes" : "Confirm & Create Order"}
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await api.delete(`/orders/${id}`);
      fetchOrders();
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'bg-success-subtle text-success border-success';
      case 'processing': return 'bg-primary-subtle text-primary border-primary';
      case 'pending': return 'bg-warning-subtle text-warning border-warning';
      case 'cancelled': return 'bg-danger-subtle text-danger border-danger';
      default: return 'bg-secondary-subtle text-secondary border-secondary';
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Order Registry</h3>
          <p className="text-muted small mb-0">Monitor transactions and fulfillment status.</p>
        </div>
        <Link to="/orders/create" className="btn btn-primary px-4 shadow-sm fw-semibold">
          <i className="bi bi-plus-lg me-2"></i> Create Order
        </Link>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary border-3" role="status"></div>
            <p className="text-muted mt-2 small">Syncing orders...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4 py-3 text-muted fw-bold small text-uppercase" style={{ width: "100px" }}>Order ID</th>
                  <th className="py-3 text-muted fw-bold small text-uppercase">Customer Name</th>
                  <th className="py-3 text-muted fw-bold small text-uppercase">Total Amount</th>
                  <th className="py-3 text-muted fw-bold small text-uppercase">Status</th>
                  <th className="py-3 text-muted fw-bold small text-uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="border-top-0">
                {orders.length > 0 ? orders.map(o => (
                  <tr key={o.id}>
                    <td className="ps-4">
                      <span className="fw-mono text-muted small">ORD-{o.id.toString().padStart(4, '0')}</span>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{o.user_name}</div>
                    </td>
                    <td>
                      <span className="text-dark fw-bold">${Number(o.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </td>
                    <td>
                      <span className={`badge rounded-pill px-3 py-2 border ${getStatusClass(o.status)}`}>
                        <i className="bi bi-dot me-1"></i>
                        {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <Link to={`/orders/${o.id}/edit`} className="btn btn-white btn-sm border shadow-sm px-2">
                          <i className="bi bi-pencil-square text-primary"></i>
                        </Link>
                        <button onClick={() => handleDelete(o.id)} className="btn btn-white btn-sm border shadow-sm px-2">
                          <i className="bi bi-trash3 text-danger"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted small">No active orders found in the database.</td>
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
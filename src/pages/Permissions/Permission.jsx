import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function Permissions() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPermissions = async () => {
    try {
      const res = await api.get("/permissions");
      setPermissions(res.data);
    } catch (err) {
      console.error("Error fetching permissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPermissions(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this permission?")) return;
    try {
      await api.delete(`/permissions/${id}`);
      fetchPermissions();
    } catch (err) {
      console.error("Error deleting permission:", err);
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">System Permissions</h3>
          <p className="text-muted small mb-0">Manage granular access keys used across the application.</p>
        </div>
        <Link to="/permissions/create" className="btn btn-primary px-4 shadow-sm fw-semibold">
          <i className="bi bi-plus-lg me-2"></i> Create Permission
        </Link>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary border-3" role="status"></div>
              <p className="text-muted mt-2 small">Loading security keys...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-4 py-3 text-muted fw-bold small text-uppercase" style={{ width: "100px" }}>ID</th>
                    <th className="py-3 text-muted fw-bold small text-uppercase">Permission Identifier</th>
                    <th className="py-3 text-muted fw-bold small text-uppercase text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="border-top-0">
                  {permissions.length > 0 ? (
                    permissions.map((p) => (
                      <tr key={p.id}>
                        <td className="ps-4">
                          <span className="badge bg-light text-dark border fw-medium px-2 py-1">#{p.id}</span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="p-2 bg-info bg-opacity-10 rounded-3 me-3 text-info">
                              <i className="bi bi-key"></i>
                            </div>
                            <code className="fw-bold text-dark">{p.name}</code>
                          </div>
                        </td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-2">
                            <Link
                              to={`/permissions/${p.id}/edit`}
                              className="btn btn-white btn-sm border shadow-sm px-2"
                              title="Edit Permission"
                            >
                              <i className="bi bi-pencil-square text-primary"></i>
                            </Link>
                            <button
                              className="btn btn-white btn-sm border shadow-sm px-2"
                              onClick={() => handleDelete(p.id)}
                              title="Delete Permission"
                            >
                              <i className="bi bi-trash3 text-danger"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-5">
                        <p className="text-muted mb-0 small">No permissions defined yet.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
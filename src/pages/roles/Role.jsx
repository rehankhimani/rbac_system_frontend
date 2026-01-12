import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function RoleList() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await api.get("/roles");
      setRoles(res.data);
    } catch (err) {
      console.error("Error fetching roles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRoles(); }, []);

  const deleteRole = async (id) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;
    try {
      await api.delete(`/roles/${id}`);
      fetchRoles();
    } catch (err) {
      console.error("Error deleting role:", err);
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Access Control Roles</h3>
          <p className="text-muted small mb-0">Define and manage security roles for your organization.</p>
        </div>
        <Link to="/roles/create" className="btn btn-primary px-4 shadow-sm fw-semibold">
          <i className="bi bi-plus-lg me-2"></i> Create New Role
        </Link>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary border-3" role="status"></div>
              <p className="text-muted mt-2 small">Loading security profiles...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-4 py-3 text-muted fw-bold small text-uppercase" style={{ width: "100px" }}>ID</th>
                    <th className="py-3 text-muted fw-bold small text-uppercase">Role Name</th>
                    <th className="py-3 text-muted fw-bold small text-uppercase text-center">Permissions & Actions</th>
                  </tr>
                </thead>
                <tbody className="border-top-0">
                  {roles.length > 0 ? (
                    roles.map((role) => (
                      <tr key={role.id}>
                        <td className="ps-4">
                          <span className="badge bg-light text-dark border fw-medium px-2 py-1">#{role.id}</span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="p-2 bg-primary bg-opacity-10 rounded-3 me-3 text-primary">
                              <i className="bi bi-shield-check"></i>
                            </div>
                            <span className="fw-bold text-dark">{role.name}</span>
                          </div>
                        </td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-2">
                            <Link to={`/roles/${role.id}/edit`} className="btn btn-white btn-sm border shadow-sm px-2" title="Edit Name">
                              <i className="bi bi-pencil-square text-primary"></i>
                            </Link>
                            <Link to={`/roles/${role.id}/permissions`} className="btn btn-white btn-sm border shadow-sm px-2" title="Manage Permissions">
                              <i className="bi bi-key-fill text-info"></i>
                            </Link>
                            <button className="btn btn-white btn-sm border shadow-sm px-2" onClick={() => deleteRole(role.id)} title="Delete Role">
                              <i className="bi bi-trash3 text-danger"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-5">
                        <p className="text-muted mb-0 small">No roles defined in the system.</p>
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
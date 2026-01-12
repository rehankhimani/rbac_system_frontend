import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const UserRoles = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesRes, userRolesRes] = await Promise.all([
          api.get("/roles"),
          api.get(`/users/${id}/roles`)
        ]);
        setRoles(rolesRes.data);
        setSelected(userRolesRes.data.map(r => r.id));
      } catch { console.error("Error loading roles"); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [id]);

  const toggle = (roleId) => setSelected(prev => prev.includes(roleId) ? prev.filter(i => i !== roleId) : [...prev, roleId]);

  const save = async () => {
    try { await api.post(`/users/${id}/roles`, { roles: selected }); navigate("/user"); }
    catch { alert("Failed to save roles"); }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container p-4">
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-header bg-white border-0 pt-4 px-4">
          <h4 className="fw-bold mb-1">Access Control</h4>
          <p className="text-muted small">Select the functional roles to associate with this account.</p>
        </div>

        <div className="card-body p-4">
          <div className="row g-3">
            {roles.map(role => {
              const isActive = selected.includes(role.id);
              return (
                <div key={role.id} className="col-md-6 col-xl-4">
                  <div
                    onClick={() => toggle(role.id)}
                    className={`p-3 rounded-4 border-2 transition cursor-pointer h-100 d-flex align-items-center justify-content-between ${isActive ? "border-primary bg-primary bg-opacity-5" : "border-light hover-bg-light"
                      }`}
                    style={{ borderStyle: "solid" }}
                  >
                    <div className="d-flex align-items-center">
                      <div className={`p-2 rounded-circle me-3 ${isActive ? "bg-primary text-white" : "bg-light text-muted"}`}>
                        <i className={`bi ${isActive ? "bi-check-circle-fill" : "bi-shield"}`}></i>
                      </div>
                      <div>
                        <div className={`fw-bold mb-0 ${isActive ? "text-black" : "text-dark"}`}>{role.name}</div>
                        <small className="text-white x-small uppercase fw-semibold">ID: {role.id}</small>
                      </div>
                    </div>
                    <div className={`form-check form-switch m-0`}>
                      <input
                        className="form-check-input shadow-none pointer-none"
                        type="checkbox"
                        checked={isActive}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card-footer bg-light border-0 p-4 d-flex justify-content-end gap-2 rounded-bottom-4">
          <button className="btn btn-white border px-4 fw-semibold" onClick={() => navigate("/user")}>Back to List</button>
          <button className="btn btn-primary px-4 fw-semibold shadow-sm" onClick={save}>
            <i className="bi bi-cloud-arrow-up me-2"></i> Update Permissions
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserRoles;
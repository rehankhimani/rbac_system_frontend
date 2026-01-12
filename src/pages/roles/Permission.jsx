import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const RolePermissions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [allPermissions, setAllPermissions] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    api.get(`/roles/${id}`).then(res => {
      setRole(res.data.role);
      setSelected(res.data.permissions.map(p => p.id));
    });
    api.get("/permissions").then(res => setAllPermissions(res.data));
  }, [id]);

  const toggle = (pid) => {
    setSelected(prev => prev.includes(pid) ? prev.filter(x => x !== pid) : [...prev, pid]);
  };

  const savePermissions = async () => {
    await api.post(`/roles/${id}/permissions`, { permissions: selected });
    navigate("/roles");
  };

  if (!role) return <div className="text-center py-5"><div className="spinner-border text-primary border-3"></div></div>;

  return (
    <div className="container p-4">
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-end">
          <div>
            <span className="badge bg-primary bg-opacity-10 text-primary mb-2">Policy Configuration</span>
            <h4 className="fw-bold mb-0">Permissions for: <span className="text-primary">{role.name}</span></h4>
          </div>
          <div className="text-muted small fw-medium">
            {selected.length} of {allPermissions.length} Active
          </div>
        </div>

        <div className="card-body p-4">
          <div className="row g-3">
            {allPermissions.map(p => {
              const isActive = selected.includes(p.id);
              return (
                <div key={p.id} className="col-md-6 col-lg-4">
                  <label
                    className={`d-flex align-items-center p-3 rounded-3 border-2 transition cursor-pointer ${isActive ? "border-primary  bg-opacity-5" : "border-light bg-light bg-opacity-50"
                      }`}
                    style={{ borderStyle: "solid", transition: "0.2s" }}
                    htmlFor={`perm-${p.id}`}
                  >
                    <div className="form-check m-0">
                      <input
                        type="checkbox"
                        className="form-check-input shadow-none"
                        id={`perm-${p.id}`}
                        checked={isActive}
                        onChange={() => toggle(p.id)}
                      />
                    </div>
                    <div className="ms-3">
                      <div className={`fw-bold small mb-0 ${isActive ? "text-primary" : "text-dark"}`}>{p.name}</div>
                      <code className="text-muted x-small" style={{ fontSize: "0.7rem" }}>PERM_ID_{p.id}</code>
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card-footer bg-light border-0 p-4 rounded-bottom-4 d-flex justify-content-end gap-2">
          <button className="btn btn-white border px-4 fw-semibold shadow-sm" onClick={() => navigate("/roles")}>Discard Changes</button>
          <button className="btn btn-primary px-4 fw-bold shadow-sm" onClick={savePermissions}>
            <i className="bi bi-shield-lock-fill me-2"></i> Save Permissions Policy
          </button>
        </div>
      </div>
    </div>
  );
};

export default RolePermissions;
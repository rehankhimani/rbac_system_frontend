import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const RoleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      api.get(`/roles/${id}`)
        .then(res => {
          const role = res.data.role || res.data;
          setForm({ name: role.name });
        })
        .catch(() => setError("Failed to fetch role data"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    if (!form.name) return setError("Role name is required");
    try {
      setLoading(true);
      if (isEdit) await api.put(`/roles/${id}`, form);
      else await api.post("/roles", form);
      navigate("/roles");
    } catch (err) {
      setError("Failed to save role");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container p-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-header bg-white border-0 pt-4 px-4 text-center">
              <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex p-3 mb-3">
                <i className={`bi ${isEdit ? "bi-pencil-square" : "bi-shield-plus"} fs-3`}></i>
              </div>
              <h4 className="fw-bold mb-1">{isEdit ? "Modify Role" : "Create New Role"}</h4>
              <p className="text-muted small">Access levels allow you to group permissions.</p>
            </div>

            <div className="card-body px-4 pb-4">
              {error && <div className="alert alert-danger border-0 small">{error}</div>}
              <div className="mb-4">
                <label className="form-label fw-bold text-dark small">Role Identity Label</label>
                <input
                  type="text"
                  name="name"
                  className="form-control form-control-lg bg-light border-0 shadow-none"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Finance Auditor"
                  style={{ fontSize: "1rem" }}
                />
              </div>

              <div className="d-grid gap-2">
                <button className="btn btn-primary fw-bold py-2" onClick={save}>
                  {isEdit ? "Save Profile Changes" : "Confirm Role Creation"}
                </button>
                <button className="btn btn-link text-muted text-decoration-none small fw-semibold" onClick={() => navigate("/roles")}>
                  Cancel and Return
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleForm;
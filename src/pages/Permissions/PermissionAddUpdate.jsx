import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const PermissionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      api.get(`/permissions/${id}`)
        .then(res => setForm({ name: res.data.name }))
        .catch(() => setError("Failed to fetch permission"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    if (!form.name.trim()) return setError("Permission name is required");
    try {
      setLoading(true);
      if (isEdit) await api.put(`/permissions/${id}`, form);
      else await api.post("/permissions", form);
      navigate("/permissions");
    } catch (err) {
      setError("Save failed! " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container p-4">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-header bg-white border-0 pt-4 px-4 text-center">
              <div className="bg-info bg-opacity-10 text-info rounded-circle d-inline-flex p-3 mb-3">
                <i className={`bi ${isEdit ? "bi-pencil-square" : "bi-key-fill"} fs-3`}></i>
              </div>
              <h4 className="fw-bold mb-1">{isEdit ? "Edit Key" : "New Permission"}</h4>
              <p className="text-muted small">Identifiers should be unique and descriptive.</p>
            </div>

            <div className="card-body px-4 pb-4">
              {error && <div className="alert alert-danger border-0 small mb-3">{error}</div>}

              <div className="mb-4">
                <label className="form-label fw-bold text-dark small">Permission Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control form-control-lg bg-light border-0 shadow-none fw-mono"
                  placeholder="e.g., users.create"
                  value={form.name}
                  onChange={handleChange}
                  required
                  style={{ fontSize: "0.95rem" }}
                />
              </div>

              <div className="d-grid gap-2">
                <button className="btn btn-primary fw-bold py-2 shadow-sm" onClick={save}>
                  {isEdit ? "Update Identifier" : "Create Permission"}
                </button>
                <button className="btn btn-link text-muted text-decoration-none small fw-semibold" onClick={() => navigate("/permissions")}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionForm;
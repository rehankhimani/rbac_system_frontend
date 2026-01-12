import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const UserFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      api.get(`/users/${id}`)
        .then(res => setForm({ name: res.data.name, email: res.data.email, password: "" }))
        .catch(() => setError("Failed to fetch user data"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return setError("Name and Email required");
    try {
      setLoading(true);
      if (isEdit) await api.put(`/users/${id}/edit`, form);
      else await api.post("/users/create", form);
      navigate("/user");
    } catch { setError("Failed to save user"); }
    finally { setLoading(false); }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="spinner-grow text-primary" role="status"></div>
    </div>
  );

  return (
    <div className="container p-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-header bg-white border-0 pt-4 px-4">
              <div className="d-flex align-items-center">
                <div className="p-2 bg-primary bg-opacity-10 rounded-3 me-3">
                  <i className="bi bi-person-gear fs-4 text-primary"></i>
                </div>
                <div>
                  <h4 className="fw-bold mb-0">{isEdit ? "Update Profile" : "New Account"}</h4>
                  <p className="text-muted small mb-0">Configuration details for system access</p>
                </div>
              </div>
            </div>

            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger border-0 shadow-sm d-flex align-items-center" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label fw-bold text-dark small">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control form-control-lg bg-light border-0 shadow-none"
                      placeholder="e.g. Alex Johnson"
                      value={form.name}
                      onChange={handleChange}
                      required
                      style={{ fontSize: "0.9rem" }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold text-dark small">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control form-control-lg bg-light border-0 shadow-none"
                      placeholder="alex@company.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      style={{ fontSize: "0.9rem" }}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-bold text-dark small">Security Password</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="form-control form-control-lg bg-light border-0 shadow-none"
                        placeholder={isEdit ? "Leave blank to keep current" : "Choose a strong password"}
                        value={form.password}
                        onChange={handleChange}
                        required={!isEdit}
                        style={{ fontSize: "0.9rem" }}
                      />
                      <button
                        className="btn btn-light border-0 px-3 text-muted bg-light"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-5">
                  <button type="button" className="btn btn-light px-4 fw-semibold" onClick={() => navigate("/user")}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4 fw-semibold shadow-sm">
                    {isEdit ? "Save Changes" : "Create Account"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFormPage;
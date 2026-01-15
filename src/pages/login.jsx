import { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/login", { email, password });
      login(res.data.token);
      navigate("/dashboard");
    } catch {
      alert("Invalid email or password");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundColor: "#f8fafc",
        backgroundImage: "radial-gradient(circle at 2px 2px, #e2e8f0 1px, transparent 0)",
        backgroundSize: "40px 40px"
      }}
    >
      <div className="card border-0 shadow-lg" style={{ width: "400px", borderRadius: "1.25rem" }}>
        <div
          className="text-center text-white py-5 px-4"
          style={{
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            borderTopLeftRadius: "1.25rem",
            borderTopRightRadius: "1.25rem"
          }}
        >
          <div className="bg-white bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "60px", height: "60px" }}>
            <i className="bi bi-shield-lock text-white fs-2"></i>
          </div>
          <h3 className="fw-bold mb-1 tracking-tight">System Login</h3>
          <p className="text-white-50 small mb-0">Secure access to your RBAC dashboard</p>
        </div>

        <div className="card-body p-4 p-md-5">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold text-dark small">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control bg-light border-start-0 ps-0"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ fontSize: "0.95rem", height: "45px" }}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between">
                <label className="form-label fw-semibold text-dark small">Password</label>
                <a href="#" className="text-primary text-decoration-none small fw-medium">Forgot?</a>
              </div>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type="password"
                  className="form-control bg-light border-start-0 ps-0"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ fontSize: "0.95rem", height: "45px" }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 fw-bold shadow-sm mb-3"
              style={{ height: "45px", backgroundColor: "#2563eb", border: "none" }}
            >
              Sign In to Account
            </button>

            <div className="form-check small text-muted">
              <input className="form-check-input" type="checkbox" id="remember" />
              <label className="form-check-label" htmlFor="remember">
                Keep me logged in
              </label>
            </div>
          </form>
        </div>

        <div className="card-footer bg-transparent border-0 text-center pb-4">
          <p className="text-muted x-small mb-0">
            &copy; {new Date().getFullYear()} CORE ADMIN • All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
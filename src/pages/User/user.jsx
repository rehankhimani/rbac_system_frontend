import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try { await api.delete(`/users/${id}`); fetchUsers(); }
    catch (err) { console.error(err); }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h3 className="fw-bold text-dark mb-1">Users Management</h3>
          <p className="text-muted small mb-0">Overview of all registered accounts and their access levels.</p>
        </div>
        <Link to="/user/create" className="btn btn-primary px-4 shadow-sm fw-semibold">
          <i className="bi bi-plus-lg me-2"></i> Create New User
        </Link>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary border-3" role="status"></div>
            <p className="text-muted mt-2 small">Syncing records...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4 py-3 text-muted fw-bold small text-uppercase" style={{ width: "80px" }}>ID</th>
                  <th className="py-3 text-muted fw-bold small text-uppercase">Member Info</th>
                  <th className="py-3 text-muted fw-bold small text-uppercase">Email Address</th>
                  <th className="py-3 text-muted fw-bold small text-uppercase text-center">Security & Actions</th>
                </tr>
              </thead>
              <tbody className="border-top-0">
                {users.length > 0 ? users.map(user => (
                  <tr key={user.id}>
                    <td className="ps-4">
                      <span className="text-dark fw-medium">#{user.id}</span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="avatar me-3 bg-primary bg-opacity-10 text-primary fw-bold rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                          {user.name[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{user.name}</div>
                          <div className="text-muted x-small">Member Since 2024</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-secondary">{user.email}</span>
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <Link to={`/user/${user.id}/edit`} className="btn btn-white btn-sm border shadow-sm px-2" title="Edit Profile">
                          <i className="bi bi-pencil-square text-primary"></i>
                        </Link>
                        <Link to={`/user/${user.id}/roles`} className="btn btn-white btn-sm border shadow-sm px-2" title="Manage Permissions">
                          <i className="bi bi-shield-check text-success"></i>
                        </Link>
                        <button onClick={() => handleDelete(user.id)} className="btn btn-white btn-sm border shadow-sm px-2" title="Delete User">
                          <i className="bi bi-trash3 text-danger"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="text-center py-5">
                      <i className="bi bi-inbox fs-1 text-muted opacity-25 d-block mb-2"></i>
                      <p className="text-muted mb-0">No users found in the database</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
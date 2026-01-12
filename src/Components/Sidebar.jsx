import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

const Sidebar = () => {
  const { auth, logout } = useContext(AuthContext);
  const hasPermission = (perm) => auth?.user?.permissions?.includes(perm);

  const navLinkClass = ({ isActive }) =>
    `nav-link d-flex align-items-center px-3 py-2.5 rounded-3 mb-1 transition-all ${isActive ? "bg-primary text-white shadow" : "text-light-muted hover-bg-soft"
    }`;

  return (
    <div className="sidebar vh-100 d-flex flex-column shadow" style={{ width: "260px", backgroundColor: "#051229" }}>
      <div className="px-4 py-4 mb-2 d-flex align-items-center">
        <div className="bg-primary rounded-3 p-2 me-2">
          <i className="bi bi-shield-lock-fill text-white fs-5"></i>
        </div>
        <h5 className="fw-bold mb-0 text-white tracking-tight">RBAC ADMIN</h5>
      </div>

      <div className="flex-grow-1 overflow-auto px-3">
        <nav className="nav nav-pills flex-column">
          <small className=" fw-bold x-small text-uppercase mb-3 px-3 text-white">General</small>

          <NavLink to="/dashboard" className={navLinkClass}>
            <i className="bi bi-grid-1x2-fill me-3"></i> Dashboard
          </NavLink>

          <div className="mt-4">
            <small className="text-white fw-bold x-small text-uppercase mb-3 px-3">Resources</small>

            {hasPermission("user.view") && (
              <SidebarCollapse id="userMenu" icon="bi-people-fill" title="User Management">
                <NavLink to="/user" className="nav-link py-1 ps-5 text-light-muted small">All Users</NavLink>
                {hasPermission("user.create") && (
                  <NavLink to="/user/create" className="nav-link py-1 ps-5 text-light-muted small">Add New User</NavLink>
                )}
              </SidebarCollapse>
            )}

            {hasPermission("product.view") && (
              <SidebarCollapse id="productMenu" icon="bi-box-seam-fill" title="Inventory">
                <NavLink to="/products" className="nav-link py-1 ps-5 text-light-muted small">Catalog</NavLink>
                {hasPermission("product.create") && (
                  <NavLink to="/products/create" className="nav-link py-1 ps-5 text-light-muted small">New Product</NavLink>
                )}
              </SidebarCollapse>
            )}

            {hasPermission("order.view") && (
              <SidebarCollapse id="orderMenu" icon="bi-receipt" title="Sales">
                <NavLink to="/orders" className="nav-link py-1 ps-5 text-light-muted small">Orders List</NavLink>
                {hasPermission("order.create") && (
                  <NavLink to="/orders/create" className="nav-link py-1 ps-5 text-light-muted small">Create Order</NavLink>
                )}
              </SidebarCollapse>
            )}

            {(hasPermission("role.view") || hasPermission("permission.view")) && (
              <div className="mt-4">
                <small className="text-white fw-bold x-small text-uppercase mb-3 px-3">Security</small>
                {hasPermission("role.view") && (
                  <SidebarCollapse id="roleMenu" icon="bi-safe2-fill" title="Roles">
                    <NavLink to="/roles" className="nav-link py-1 ps-5 text-light-muted small">Manage Roles</NavLink>
                  </SidebarCollapse>
                )}
                {hasPermission("permission.view") && (
                  <SidebarCollapse id="permissionMenu" icon="bi-key-fill" title="Permissions">
                    <NavLink to="/permissions" className="nav-link py-1 ps-5 text-light-muted small">Policy Matrix</NavLink>
                  </SidebarCollapse>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className="p-3 bg-black bg-opacity-10">
        <div className="d-flex align-items-center mb-3 px-2">
          <div className="bg-primary rounded-circle me-3 flex-shrink-0" style={{ width: "38px", height: "38px" }}>
            <div className="w-100 h-100 d-flex align-items-center justify-content-center text-white fw-bold">
              {auth?.user?.name?.charAt(0) || "A"}
            </div>
          </div>
          <div className="overflow-hidden">
            <p className="text-white small fw-bold mb-0 text-truncate">{auth?.user?.name || "Administrator"}</p>
            <p className="text-white x-small mb-0 text-truncate">Active Session</p>
          </div>
        </div>
        <button className="btn btn-danger btn-sm w-100 rounded-3 shadow-sm py-2" onClick={logout}>
          <i className="bi bi-box-arrow-right me-2"></i> Logout
        </button>
      </div>
    </div>
  );
};

const SidebarCollapse = ({ id, icon, title, children }) => (
  <>
    <div
      className="nav-link d-flex justify-content-between align-items-center px-3 py-2.5 rounded-3 mb-1 text-light-muted cursor-pointer hover-bg-soft transition-all"
      data-bs-toggle="collapse"
      data-bs-target={`#${id}`}
    >
      <span><i className={`bi ${icon} me-3`}></i> {title}</span>
      <i className="bi bi-chevron-right x-small opacity-50"></i>
    </div>
    <div className="collapse" id={id}>
      <div className="nav flex-column mb-2">{children}</div>
    </div>
  </>
);

export default Sidebar;
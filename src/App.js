import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import MainLayout from "./layout/MainLayout";
import AuthLayout from "./layout/AuthLayout";
import Login from "./pages/login";
import Dashboard from "./Components/Dashboard";
import Users from "./pages/User/user";
import UserRole from "./pages/User/UserRole";
import UserCreate from "./pages/User/UserForm";
import Products from "./pages/Product/Products";
import ProductAddUpdate from "./pages/Product/ProductAddUpdate";
import Unauthorized from "./pages/Unauthorized";
import Roles from "./pages/roles/Role";
import RoleCreate from "./pages/roles/RoleAddUpdate";
import RoleEdit from "./pages/roles/Permission";
import Permissions from "./pages/Permissions/Permission";
import PermissionCreate from "./pages/Permissions/PermissionAddUpdate";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/Sidebar.css";
import OrderForm from "./pages/Order/OrderAddUpdate";
import Orders from "./pages/Order/Order";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
          >
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/user" element={
              <ProtectedRoute permission="user.view">
                <Users />
              </ProtectedRoute>
            }
            />
            <Route path="/user/create" element={
              <ProtectedRoute permission="user.create">
                <UserCreate />
              </ProtectedRoute>
            }
            />
            <Route path="/user/:id/edit" element={
              <ProtectedRoute permission="user.edit">
                <UserCreate />
              </ProtectedRoute>
            }
            />

            <Route path="/products" element={
              <ProtectedRoute permission="product.view">
                <Products />
              </ProtectedRoute>
            }
            />
            <Route
              path="/products/create"
              element={
                <ProtectedRoute permission="product.create">
                  <ProductAddUpdate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/:id/edit"
              element={
                <ProtectedRoute permission="product.edit">
                  <ProductAddUpdate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute permission="order.view">
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/create"
              element={
                <ProtectedRoute permission="order.create">
                  <OrderForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id/edit"
              element={
                <ProtectedRoute permission="order.edit">
                  <OrderForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roles"
              element={
                <ProtectedRoute permission="role.view">
                  <Roles />
                </ProtectedRoute>
              }
            />

            <Route
              path="/roles/create"
              element={
                <ProtectedRoute permission="role.create">
                  <RoleCreate />
                </ProtectedRoute>
              }
            />

            <Route
              path="/roles/:id/edit"
              element={
                <ProtectedRoute permission="role.edit">
                  <RoleCreate />
                </ProtectedRoute>
              }
            />

            <Route
              path="/roles/:id/permissions"
              element={
                <ProtectedRoute permission="role.edit">
                  <RoleEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/permissions"
              element={
                <ProtectedRoute permission="permission.view">
                  <Permissions />
                </ProtectedRoute>
              }
            />

            <Route
              path="/permissions/create"
              element={
                <ProtectedRoute permission="permission.create">
                  <PermissionCreate />
                </ProtectedRoute>
              }
            />

            <Route
              path="/permissions/:id/edit"
              element={
                <ProtectedRoute permission="permission.edit">
                  <PermissionCreate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/:id/roles"
              element={
                <ProtectedRoute permission="user.role.assign">
                  <UserRole />
                </ProtectedRoute>
              }
            />

          </Route>

          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

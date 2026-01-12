import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
      <Outlet />
    </div>
  );
};

export default AuthLayout;

import Sidebar from "../Components/Sidebar";

import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="d-flex">
      <Sidebar />

      <div
        className="flex-grow-1"
        style={{ marginLeft: "250px", padding: "30px", background: "#f1f3f5" }}
      >

        
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;

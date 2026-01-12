import { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

const Dashboard = () => {
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const lineChartInstance = useRef(null);
  const barChartInstance = useRef(null);

  useEffect(() => {
    lineChartInstance.current?.destroy();
    barChartInstance.current?.destroy();

    lineChartInstance.current = new Chart(lineChartRef.current, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May"],
        datasets: [{
          label: "Sales",
          data: [12, 19, 3, 5, 8],
          borderColor: "#0d6efd",
          backgroundColor: "rgba(13,110,253,0.05)",
          borderWidth: 2,
          pointBackgroundColor: "#fff",
          pointBorderColor: "#0d6efd",
          pointBorderWidth: 2,
          pointRadius: 4,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: "#94a3b8" } },
          y: { grid: { borderDash: [5, 5], color: "rgba(0,0,0,0.05)" }, ticks: { color: "#94a3b8" } },
        }
      }
    });

    barChartInstance.current = new Chart(barChartRef.current, {
      type: "bar",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        datasets: [{
          label: "Orders",
          data: [5, 9, 3, 7, 2],
          backgroundColor: "#10b981",
          borderRadius: 4,
          barThickness: 20,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: "#94a3b8" } },
          y: { grid: { borderDash: [5, 5], color: "rgba(0,0,0,0.05)" }, ticks: { color: "#94a3b8" } },
        }
      }
    });

    return () => {
      lineChartInstance.current?.destroy();
      barChartInstance.current?.destroy();
    };
  }, []);

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-0">Dashboard</h3>
          <p className="text-muted small mb-0">Welcome back! Here is what's happening today.</p>
        </div>

      </div>

      <div className="row g-4 mb-4">
        <DashboardCard title="Total Revenue" value="$12,840" color="primary" icon="bi-currency-dollar" trend="+12%" />
        <DashboardCard title="Active Orders" value="320" color="success" icon="bi-cart-check" trend="+5%" />
        <DashboardCard title="Total Customers" value="1,250" color="info" icon="bi-people" trend="+18%" />
        <DashboardCard title="Stock Items" value="842" color="warning" icon="bi-box-seam" trend="Stable" />
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between">
              <h6 className="fw-bold mb-0 text-dark">Revenue Analytics</h6>
              <span className="badge bg-primary-soft text-primary">Monthly</span>
            </div>
            <div className="card-body px-4 pb-4" style={{ height: "300px" }}>
              <canvas ref={lineChartRef}></canvas>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-0 pt-4 px-4">
              <h6 className="fw-bold mb-0 text-dark">Order Distribution</h6>
            </div>
            <div className="card-body px-4 pb-4" style={{ height: "300px" }}>
              <canvas ref={barChartRef}></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, icon, color, trend }) => (
  <div className="col-md-6 col-xl-3">
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className={`p-2 rounded-3 bg-${color} bg-opacity-10 text-${color}`}>
            <i className={`bi ${icon} fs-4`}></i>
          </div>
          <span className="text-success small fw-bold">{trend}</span>
        </div>
        <h6 className="text-muted small fw-semibold text-uppercase mb-1">{title}</h6>
        <h3 className="fw-bold mb-0 text-dark">{value}</h3>
      </div>
    </div>
  </div>
);

export default Dashboard;
import { Routes, Route, Navigate } from "react-router-dom";

import HomeAdmin from "../pages/HomeAdmin";
import TurnosChart from "../pages/TurnosChart";
import DashboardMetrics from "../pages/DashboardMetrics";
import FaqsAdmin from "../pages/FaqsAdmin";

const RoutesApp = () => {
  console.log("[admin-debug][RoutesApp] render", {
    path: window.location.pathname,
  });
  return (
    <Routes>
      <Route index element={<Navigate to="homeAdmin" replace />} />
      <Route path="homeAdmin" element={<HomeAdmin />} />
      <Route path="reportes" element={<TurnosChart />} />
      <Route path="dashboard" element={<DashboardMetrics />} />
      <Route path="faqs" element={<FaqsAdmin />} />
      <Route path="*" element={<Navigate to="homeAdmin" replace />} />
    </Routes>
  );
};

export default RoutesApp;

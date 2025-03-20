import { Routes, Route } from "react-router-dom";
import React from "react";

import HomeAdmin from "../pages/HomeAdmin";
//import ReportesScreen from "../pages/ReportesScreen";
import TurnosChart from "../pages/TurnosChart";

const RoutesApp = () => {
  return (
    <Routes>
      <Route path="/homeAdmin" element={<HomeAdmin />} />
      <Route path="/reportes" element={<TurnosChart />} />
    </Routes>
  );
};

export default RoutesApp;

import React from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { useAppContext } from "../context/hooks/useAppContext";
import MarketerDashboard from "../pages/marketer/Dashboard";

const MarketerLayout: React.FC = () => {
  const { state } = useAppContext();
  const { user } = state;

  // Protect marketer routes
  if (!user || user.role !== "marketer") {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div>
      {/* TODO: Add marketer sidebar/header components */}
      <Routes>
        <Route path="dashboard" element={<MarketerDashboard />} />
        <Route
          path="sales"
          element={<div>Sales Interface (coming soon)</div>}
        />
        <Route
          path="stock"
          element={<div>Stock Management (coming soon)</div>}
        />
        <Route path="network" element={<div>Network View (coming soon)</div>} />
        <Route
          path="commissions"
          element={<div>Commission History (coming soon)</div>}
        />
      </Routes>
    </div>
  );
};

export default MarketerLayout;

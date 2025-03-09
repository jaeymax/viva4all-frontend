import React from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { useAppContext } from "../context/hooks/useAppContext";

const DistributorLayout: React.FC = () => {
  const { state } = useAppContext();
  const { user } = state;

  // Protect distributor routes
  if (!user || user.role !== "distributor") {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div>
      {/* TODO: Add distributor sidebar/header components */}
      <Routes>
        <Route
          path="dashboard"
          element={<div>Distributor Dashboard (coming soon)</div>}
        />
        <Route
          path="stock"
          element={<div>Stock Management (coming soon)</div>}
        />
        <Route
          path="transfers"
          element={<div>Transfer History (coming soon)</div>}
        />
        <Route
          path="marketers"
          element={<div>Marketer Management (coming soon)</div>}
        />
      </Routes>
    </div>
  );
};

export default DistributorLayout;

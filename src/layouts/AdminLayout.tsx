import React from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { useAppContext } from "../context/hooks/useAppContext";

const AdminLayout: React.FC = () => {
  const { state } = useAppContext();
  const { user } = state;

  // Protect admin routes
  if (!user || user.role !== "admin") {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div>
      {/* TODO: Add admin sidebar/header components */}
      <Routes>
        <Route
          path="dashboard"
          element={<div>Admin Dashboard (coming soon)</div>}
        />
        <Route
          path="users"
          element={<div>User Management (coming soon)</div>}
        />
        <Route
          path="products"
          element={<div>Product Management (coming soon)</div>}
        />
        <Route
          path="commissions"
          element={<div>Commission Management (coming soon)</div>}
        />
        <Route path="reports" element={<div>Reports (coming soon)</div>} />
      </Routes>
    </div>
  );
};

export default AdminLayout;

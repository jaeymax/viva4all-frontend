import { useState } from "react";
import "./App.css";
import { AppProvider } from "./context/AppContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import MarketerDashboard from "./pages/marketer/Dashboard";
import AdminLayout from "./layouts/AdminLayout";
import DistributorLayout from "./layouts/DistributorLayout";
import MarketerLayout from "./layouts/MarketerLayout";

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Root route will handle role-based routing */}

          {/* Auth routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="/marketer/*" element={<MarketerLayout />} />
          <Route path="/distributor/*" element={<DistributorLayout />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminOrders from "./pages/AdminOrders";
import AdminProtectedRoute from "./pages/AdminProtectedRoute";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/admin/login" replace />}
      />

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      <Route
        path="/admin/orders"
        element={
          <AdminProtectedRoute>
            <AdminOrders />
          </AdminProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
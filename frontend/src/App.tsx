// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import SalesPage from "./pages/SalesPage";
import CustomersPage from "./pages/CustomersPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* FIRST SCREEN = LOGIN */}
        <Route path="/" element={<LoginPage />} />

        {/* AFTER LOGIN */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/customers" element={<CustomersPage />} />
      </Routes>
    </Router>
  );
}

export default App;

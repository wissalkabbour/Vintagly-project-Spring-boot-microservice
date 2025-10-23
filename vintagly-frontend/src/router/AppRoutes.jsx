import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "../pages/Register";
import Catalogue from "../pages/Catalogue";
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔹 Route d'inscription */}
        <Route path="/register" element={<Register />} />

        {/* 🔹 Route vers le catalogue */}
        <Route path="/catalogue" element={<Catalogue />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "../pages/Register";
import Catalogue from "../pages/Catalogue";
import ProductPage from "../pages/ProductPage";

import Panier from "../components/panier/panier";
import { Component as Demande } from "../components/demande";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔹 Route d'inscription */}
        <Route path="/register" element={<Register />} />

        {/* 🔹 Route vers le catalogue */}
        <Route path="/catalogue" element={<Catalogue />} />

        {/* 🔹 Autres routes */}
        <Route path="/panier" element={<Panier />} />
        <Route path="/demande" element={<Demande />} />
        <Route path="/produit/:id" element={<ProductPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

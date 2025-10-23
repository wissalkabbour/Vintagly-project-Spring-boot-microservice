import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "../pages/Register";
<<<<<<< HEAD
import Catalogue from "../pages/Catalogue";
=======
import ProductPage from "../pages/ProductPage";

import Panier from "../components/panier/panier";
import { Component as Demande } from "../components/demande";

>>>>>>> 739a3a0a0b42809b199eb151e5d7cbfbe9118e5f
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔹 Route d'inscription */}
        <Route path="/register" element={<Register />} />
<<<<<<< HEAD

        {/* 🔹 Route vers le catalogue */}
        <Route path="/catalogue" element={<Catalogue />} />
=======
        <Route path="/panier" element={<Panier />} />
        <Route path="/demande" element={<Demande />} />
        <Route path="/produit/:id" element={<ProductPage />} />

>>>>>>> 739a3a0a0b42809b199eb151e5d7cbfbe9118e5f
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

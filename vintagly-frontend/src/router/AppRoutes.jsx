import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "../pages/Register";
import Catalogue from "../pages/Catalogue";
import ProductPage from "../pages/ProductPage";

import Panier from "../components/panier/panier";
import { Component as Demande } from "../components/demande";
import Login from "../pages/login";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
<<<<<<< HEAD
=======
        <Route path="/login" element={<Login />} />
>>>>>>> 3f58726ed05e83f0595486b25e83a10484f68d9f

        <Route path="/catalogue" element={<Catalogue />} />
<<<<<<< HEAD

        {/* 🔹 Autres routes */}
        <Route path="/panier" element={<Panier />} />
        <Route path="/demande" element={<Demande />} />
        <Route path="/produit/:id" element={<ProductPage />} />
=======
        <Route path="/panier" element={<Panier />} />
        <Route path="/demande" element={<Demande />} />
        <Route path="/produit/:id" element={<ProductPage />} />

>>>>>>> 3f58726ed05e83f0595486b25e83a10484f68d9f
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

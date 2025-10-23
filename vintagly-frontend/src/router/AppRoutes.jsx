import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "../pages/Register";

import Panier from "../components/panier/panier";
import { Component as Demande } from "../components/demande";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/panier" element={<Panier />} />
        <Route path="/demande" element={<Demande />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

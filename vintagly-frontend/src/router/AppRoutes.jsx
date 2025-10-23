import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "../pages/Register";
import Panier from "../components/panier/panier";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/panier" element={<Panier />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "../pages/Register";
import ProductPage from "../pages/ProductPage";


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/produit/:id" element={<ProductPage />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

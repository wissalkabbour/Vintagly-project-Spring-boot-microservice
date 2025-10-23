import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "../pages/Register";
import { Component as Demande } from "../components/demande";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/demande" element={<Demande />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "../pages/Register";
import Catalogue from "../components/Catalogue";
import ProductPage from "../pages/ProductPage";
import AddArticleForm from "../components/ADDArticleForm";
import Panier from "../components/panier/panier";
import Demande from "../components/demande";
import AllDemandes from "../components/AllDemandes";

import Login from "../pages/login";
import CategoryList from "../components/CategoryList";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Catalogue />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />


        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/AddArticle" element={<AddArticleForm />} />
        <Route path="/panier" element={<Panier />} />
        <Route path="/demande" element={<Demande />} />
        <Route path="/produit/:id" element={<ProductPage />} />
        <Route path="/AllDemandes" element={<AllDemandes />} />
        <Route path="/categories" element={<CategoryList />} />


      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

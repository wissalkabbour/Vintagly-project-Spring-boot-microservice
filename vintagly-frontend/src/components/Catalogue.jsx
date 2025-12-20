import React, { useRef, useState, useEffect } from "react";
import "./Catalogue.css";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ShoppingCart,
} from "lucide-react";
import { articleService } from "../services/articleService";
import NavbarCatalogue from "./catalog/NavbarCatalogue";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { panierService } from "../services/panierService";

const Catalogue = () => {
  const scrollRefs = useRef([]);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  /* 👉 Redirection vers la page produit */
  const handleProductClick = (id) => {
    navigate(`/produit/${id}`);
  };

  /* 🛒 Ajouter au panier */
  const handleAddClick = async (e, id) => {
    e.stopPropagation(); // ⛔ empêche la redirection vers /produit

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      await panierService.addArticle(id);
      navigate("/panier");
    } catch (err) {
      console.error(err);
      alert("Impossible d’ajouter au panier");
    }
  };

  /* 📦 Charger catégories + articles */
  useEffect(() => {
    const fetchData = async () => {
      const data = await articleService.getCategories();
      setCategories(data);
    };
    fetchData();
  }, []);

  /* ⬅️➡️ Scroll carrousel */
  const scroll = (index, direction) => {
    const container = scrollRefs.current[index];
    if (container) {
      container.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  /* 🔍 Recherche */
  const allArticles = categories.flatMap((cat) =>
    cat.articles.map((a) => ({ ...a, categoryName: cat.nom }))
  );

  const searchedArticles =
    search.trim().length > 0
      ? allArticles.filter((article) =>
          article.nom.toLowerCase().includes(search.toLowerCase())
        )
      : null;

  const filteredCategories = selectedCategory
    ? categories.filter((cat) => cat.id === selectedCategory)
    : categories;

  /* 🖼️ Image */
  const getImageUrl = (path) => {
    if (!path) return "";
    const fileName = path.split("/uploads/")[1];
    const encoded = encodeURIComponent(fileName);
    return `http://localhost:8195/uploads/${encoded}`;
  };

  return (
    <>
      <NavbarCatalogue />
      <br />
      <br />

      <div className="catalogue-container">
        {/* 🔍 Barre de recherche */}
        <div className="search-bar">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher un article..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* 🟤 Boutons catégories */}
        {search.length === 0 && (
          <div className="flex flex-wrap gap-3 justify-center my-6">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-5 py-2 rounded-full border shadow-sm transition-all
              ${
                !selectedCategory
                  ? "bg-[#8c5d36] text-white border-[#8c5d36] shadow-md scale-105"
                  : "bg-white text-gray-700 border-[#b47b4e] hover:bg-[#b47b4e] hover:text-white"
              }`}
            >
              Toutes
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2 rounded-full border shadow-sm transition-all
                ${
                  selectedCategory === cat.id
                    ? "bg-[#8c5d36] text-white border-[#8c5d36] shadow-md scale-105"
                    : "bg-white text-gray-700 border-[#b47b4e] hover:bg-[#b47b4e] hover:text-white"
                }`}
              >
                {cat.nom}
              </button>
            ))}
          </div>
        )}

        {/* 🔎 Résultats recherche */}
        {searchedArticles && (
          <>
            <h2 className="text-center text-xl font-bold my-4 text-[#8c5d36]">
              {searchedArticles.length} article(s) trouvé(s)
            </h2>

            <div className="product-grid">
              {searchedArticles.map((product) => {
                const url = getImageUrl(product.images[0]?.path);

                return (
                  <div
                    key={product.id}
                    className="product-card"
                    onClick={() => handleProductClick(product.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <button
                      className="add-cart-btn"
                      onClick={(e) => handleAddClick(e, product.id)}
                    >
                      <ShoppingCart size={20} />
                    </button>

                    <img
                      src={url}
                      alt={product.nom}
                      className="product-image"
                    />

                    <div className="product-info">
                      <p className="product-name">{product.nom}</p>
                      <p className="product-price">{product.prix} €</p>
                      <p className="text-xs text-gray-500">
                        {product.categoryName}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* 🎡 Carrousels */}
        {search.length === 0 &&
          (selectedCategory ? (
            <div className="product-grid">
              {filteredCategories[0].articles.map((product) => {
                const url = getImageUrl(product.images[0]?.path);

                return (
                  <div
                    key={product.id}
                    className="product-card"
                    onClick={() => handleProductClick(product.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <button
                      className="add-cart-btn"
                      onClick={(e) => handleAddClick(e, product.id)}
                    >
                      <ShoppingCart size={20} />
                    </button>

                    <img
                      src={url}
                      alt={product.nom}
                      className="product-image"
                    />

                    <div className="product-info">
                      <p className="product-name">{product.nom}</p>
                      <p className="product-price">{product.prix} €</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            filteredCategories.map((cat, index) => (
              <div key={cat.id} className="category-section">
                {cat.articles.length > 0 && (
                  <>
                    <h2 className="category-title">{cat.nom}</h2>

                    <div className="carousel-wrapper">
                      <button
                        className="scroll-btn left"
                        onClick={() => scroll(index, "left")}
                      >
                        <ChevronLeft />
                      </button>

                      <div
                        className="carousel"
                        ref={(el) => (scrollRefs.current[index] = el)}
                      >
                        {cat.articles.map((product) => {
                          const url = getImageUrl(
                            product.images[0]?.path
                          );

                          return (
                            <div
                              key={product.id}
                              className="product-card"
                              onClick={() =>
                                handleProductClick(product.id)
                              }
                              style={{ cursor: "pointer" }}
                            >
                              <button
                                className="add-cart-btn"
                                onClick={(e) =>
                                  handleAddClick(e, product.id)
                                }
                              >
                                <ShoppingCart size={20} />
                              </button>

                              <img
                                src={url}
                                alt={product.nom}
                                className="product-image"
                              />

                              <div className="product-info">
                                <p className="product-name">
                                  {product.nom}
                                </p>
                                <p className="product-price">
                                  {product.prix} €
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        className="scroll-btn right"
                        onClick={() => scroll(index, "right")}
                      >
                        <ChevronRight />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          ))}
      </div>
    </>
  );
};

export default Catalogue;
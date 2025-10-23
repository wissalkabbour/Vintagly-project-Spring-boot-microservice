import React, { useRef, useState, useEffect } from "react";
import "./Catalogue.css";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { getCategories } from "../services/CatalogueService"; // ✅ importer le service

const Catalogue = () => {
  const scrollRefs = useRef([]);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]); // ✅ state pour les données

  // 🔹 Charger les catégories depuis le service
  useEffect(() => {
    const fetchData = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    fetchData();
  }, []);

  // 🔹 Fonction de défilement horizontal
  const scroll = (index, direction) => {
    const container = scrollRefs.current[index];
    if (container) {
      container.scrollBy({ left: direction === "left" ? -300 : 300, behavior: "smooth" });
    }
  };

  // 🔹 Filtrage selon la recherche
  const filteredCategories = categories.map((cat) => ({
    ...cat,
    products: cat.products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    ),
  }));

  return (
    <div className="catalogue-container">
      <div className="search-bar">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="Rechercher un article..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredCategories.map((cat, index) => (
        <div key={index} className="category-section">
          {cat.products.length > 0 && (
            <>
              <h2 className="category-title">{cat.name}</h2>
              <div className="carousel-wrapper">
                <button className="scroll-btn left" onClick={() => scroll(index, "left")}>
                  <ChevronLeft />
                </button>
                <div className="carousel" ref={(el) => (scrollRefs.current[index] = el)}>
                  {cat.products.map((product) => (
                    <div key={product.id} className="product-card">
                      <img src={product.image} alt={product.name} />
                      <div className="product-info">
                        <p className="product-name">{product.name}</p>
                        <p className="product-price">{product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="scroll-btn right" onClick={() => scroll(index, "right")}>
                  <ChevronRight />
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Catalogue;

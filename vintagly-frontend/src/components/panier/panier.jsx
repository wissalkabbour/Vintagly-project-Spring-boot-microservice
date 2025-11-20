import React, { useEffect, useState } from "react";
import { panierService } from "../../services/panierService";
import { Trash2 } from "lucide-react";
import NavbarCatalogue from "../catalog/NavbarCatalogue";

const Panier = () => {
  const [panier, setPanier] = useState(null);

  const groupArticles = (articles) => {
    const grouped = {};
    articles.forEach(a => {
      if (!grouped[a.id]) grouped[a.id] = { ...a, quantite: 1 };
      else grouped[a.id].quantite++;
    });
    return Object.values(grouped);
  };

  useEffect(() => {
    const fetchPanier = async () => {
      try {
        const data = await panierService.getPanier();
        setPanier(data);
      } catch (err) {
        console.error(err);
        setPanier({ articles: [] });
      }
    };
    fetchPanier();
  }, []);

  if (!panier) return <p>Chargement...</p>;

  const cartItems = groupArticles(panier.articles || []);
  const total = cartItems.reduce((sum, item) => sum + item.prix * item.quantite, 0);

  const removeItem = async (id) => {
    try {
      await panierService.removeArticle(id);
      setPanier((prev) => ({
        ...prev,
        articles: prev.articles.filter(a => a.id !== id)
      }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
      <>

    <NavbarCatalogue />
     <br /><br />

    <div className="min-h-screen py-8 px-4 md:px-8 lg:px-12 bg-[#f7f3eb]">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10 border-2 border-dashed border-[#c8a87a] p-5 rounded-xl bg-white">
          <h1 className="text-3xl font-bold text-[#2D2D2D]">Mon Panier</h1>
          <span className="bg-[#D4A574] text-white px-4 py-1 rounded-full text-sm font-semibold shadow">
            {cartItems.length} Article(s)
          </span>
        </div>

        {/* EMPTY */}
        {cartItems.length === 0 ? (
          <h2 className="text-center text-xl mt-10 text-[#2D2D2D] opacity-80">
            Votre panier est vide
          </h2>
        ) : (
          <div className="space-y-6">

            {/* CART ITEMS */}
            {cartItems.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md p-5 flex items-center gap-6 hover:shadow-lg transition-shadow"
              >
                {/* IMAGE */}
                <img
                  src={`http://localhost:8195${item.image}`}
                  alt={item.nom}
                  className="w-28 h-28 object-cover rounded-xl border"
                />

                {/* INFO */}
                <div className="flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-[#2D2D2D]">{item.nom}</h3>
                  <p className="text-[#704828] font-semibold">{item.prix} €</p>

                  <div className="mt-2">
                    <span className="bg-[#3B5F5C] text-white px-3 py-1 rounded-full text-sm">
                      Quantité : {item.quantite}
                    </span>
                  </div>
                </div>

                {/* DELETE ICON */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-3 rounded-full hover:bg-red-100 text-red-600 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={22} />
                </button>
              </div>
            ))}

            {/* TOTAL CARD */}
            <div className="bg-white shadow-md p-6 rounded-xl flex justify-between text-2xl font-bold border-t-4 border-[#c8a87a]">
              <span>Total :</span>
              <span>{total} €</span>
            </div>

            {/* VALIDATE */}
            <button
              className="w-full mt-4 bg-[#8c5d36] text-white py-4 rounded-xl text-lg font-semibold shadow hover:bg-[#704828] transition-colors"
              onClick={() => alert("Redirection vers la page de paiement...")}
            >
              Valider le panier
            </button>

          </div>
        )}
      </div>
    </div>
      </>

  );
};

export default Panier;

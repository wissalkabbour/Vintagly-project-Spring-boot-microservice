import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogIn, FileText, Plus, List } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const NavbarCatalogue = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userInfo, isAdmin } = useAuthStore();

  const goPanier = () => {
    if (!isAuthenticated) navigate("/login");
    else navigate("/panier");
  };

  const goDemande = () => {
    if (!isAuthenticated) navigate("/login");
    else navigate("/demande");
  };

  const goAddArticle = () => {
    navigate("/AddArticle");
  };

  const goAllDemandes = () => {
    navigate("/AllDemandes");
  };

  const  goAddCat = () => {
    navigate("/categories");
  };

  return (
    <nav className="w-full fixed top-0 left-0 bg-[#8c5d36] text-white shadow-lg z-50 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6">

        {/* LOGO */}
        <h1 className="text-2xl font-bold tracking-wide cursor-pointer"
            onClick={() => navigate("/catalogue")}>
          Vintagly Store
        </h1>

        {/* LINKS */}
        <div className="flex items-center gap-6 text-lg">

          {/* NOT AUTHENTICATED */}
          {!isAuthenticated && (
            <>
              <Link to="/login" className="hover:underline flex items-center gap-1">
                <LogIn size={20} /> Login
              </Link>

              <Link to="/register" className="hover:underline flex items-center gap-1">
                <User size={20} /> Register
              </Link>
            </>
          )}

          {/* AUTHENTICATED - ADMIN */}
          {isAuthenticated && isAdmin() && (
            <>
              <span className="font-semibold text-yellow-300">
                Hello, Admin {userInfo?.name}
              </span>

              {/* ADD ARTICLE BUTTON */}
              <button
                className="flex items-center gap-2 hover:opacity-80 transition bg-[#b47b4e] px-4 py-2 rounded-lg"
                onClick={goAddArticle}
                title="Ajouter un article"
              >
                <Plus size={20} />
                <span className="hidden md:inline">Ajouter Article</span>
              </button>

               <button
                className="flex items-center gap-2 hover:opacity-80 transition bg-[#b47b4e] px-4 py-2 rounded-lg"
                onClick={goAddCat}
                title="Ajouter un article"
              >
                <Plus size={20} />
                <span className="hidden md:inline">Ajouter Catégotie </span>
              </button>

              {/* ALL DEMANDS BUTTON */}
              <button
                className="flex items-center gap-2 hover:opacity-80 transition bg-[#6b4423] px-4 py-2 rounded-lg"
                onClick={goAllDemandes}
                title="Voir toutes les demandes"
              >
                <List size={20} />
                <span className="hidden md:inline">Demandes</span>
              </button>
            </>
          )}

          {/* AUTHENTICATED - CUSTOMER */}
          {isAuthenticated && !isAdmin() && (
            <>
              <span className="font-semibold">
                Hello,Customer {userInfo?.name}
              </span>

              {/* DEMANDE BUTTON */}
              <button
                className="flex items-center gap-2 hover:opacity-80 transition bg-[#b47b4e] px-4 py-2 rounded-lg"
                onClick={goDemande}
                title="Faire une demande"
              >
                <FileText size={20} />
                <span className="hidden sm:inline">Demande</span>
              </button>

              {/* PANIER ICON */}
              <button
                className="relative hover:opacity-80 transition"
                onClick={goPanier}
                title="Mon panier"
              >
                <ShoppingCart size={26} />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavbarCatalogue;
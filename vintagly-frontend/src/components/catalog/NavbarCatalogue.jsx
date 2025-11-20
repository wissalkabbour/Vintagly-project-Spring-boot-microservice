import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogIn } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const NavbarCatalogue = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userInfo } = useAuthStore();

  const goPanier = () => {
    if (!isAuthenticated) navigate("/login");
    else navigate("/panier");
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

          {isAuthenticated && (
            <span className="font-semibold">
              Hello, {userInfo?.name}
            </span>
          )}

          {/* PANIER ICON */}
          <button
            className="relative hover:opacity-80 transition"
            onClick={goPanier}
          >
            <ShoppingCart size={26} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavbarCatalogue;

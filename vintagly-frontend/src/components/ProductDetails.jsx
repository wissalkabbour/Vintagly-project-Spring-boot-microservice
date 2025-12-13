import React, { useState } from "react";

export default function ProductDetails({ product }) {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (change) => {
    const newQty = quantity + change;
    if (newQty >= 1 && newQty <= 99) {
      setQuantity(newQty);
    }
  };

  const totalPrice = (product.prix * quantity).toFixed(2);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white border-4 border-amber-900/20 rounded-lg shadow-lg p-8 space-y-6">
      {/* En-tête avec titre et prix */}
      <div className="border-b-2 border-amber-900/10 pb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-serif text-amber-900 mb-2">
              {product.nom}
            </h1>
            <p className="text-amber-700 text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Publié le {formatDate(product.dateDePub)}
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-amber-900">
              {product.prix.toFixed(2)}€
            </div>
            <div className="text-sm text-gray-500 mt-1">Prix TTC</div>
          </div>
        </div>

        {/* Badge disponibilité */}
        <div className="flex items-center gap-2 mt-4">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-green-700 font-medium">
            Disponible
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-3">
        <h2 className="text-xl font-serif text-amber-900 border-l-4 border-amber-500 pl-3">
          Description
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {product.description}
        </p>
      </div>

      {product.historique && (
        <div className="space-y-3 bg-amber-50/50 border-2 border-amber-200/50 rounded-lg p-4">
          <h2 className="text-lg font-serif text-amber-900 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Historique
          </h2>
          <p className="text-gray-700 leading-relaxed italic text-sm">
            {product.historique}
          </p>
        </div>
      )}

      {/* Quantité et ajout au panier */}
      <div className="space-y-4 pt-4 border-t-2 border-amber-900/10">
        <div className="flex items-center gap-4">
          <div className="space-y-1">
            <label className="text-sm font-serif text-amber-900">Quantité</label>
            <div className="flex items-center border-2 border-amber-300 rounded-lg overflow-hidden">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  if (val >= 1 && val <= 99) {
                    setQuantity(val);
                  }
                }}
                className="w-16 text-center py-2 border-x-2 border-amber-300 focus:outline-none"
              />
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 99}
                className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex-1 text-right">
            <div className="text-sm text-gray-600 font-serif">Total</div>
            <div className="text-3xl font-bold text-amber-900">{totalPrice}€</div>
          </div>
        </div>

        <button
          onClick={() => alert(`Ajouté au panier: ${quantity} × ${product.nom}`)}
          className="w-full bg-[#386860] hover:bg-amber-800 text-white font-serif text-lg py-4 rounded-lg shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]"
        >
          Ajouter au panier
        </button>

        <button 
          onClick={() => alert('Ajouté aux favoris!')}
          className="w-full border-2 border-[#386860] text-[#386860] hover:bg-amber-50 font-serif text-lg py-4 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Ajouter aux favoris
        </button>
      </div>

      {/* Informations supplémentaires */}
      <div className="space-y-3 pt-4 border-t-2 border-amber-900/10">
        <h3 className="text-lg font-serif text-[#386860]">Informations produit</h3>
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <div>
              <span className="text-amber-900 font-medium">Référence: </span>
              <span className="text-gray-700">#{product.id}</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span className="text-amber-900 font-medium">État: </span>
              <span className="text-gray-700">Authentique et vérifié</span>
            </div>
          </div>
        </div>
      </div>

      {/* Garanties */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t-2 border-amber-900/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <div className="text-xs text-amber-700 font-medium">Authenticité</div>
            <div className="text-xs text-gray-600">Garantie 100%</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <div className="text-xs text-amber-700 font-medium">Livraison</div>
            <div className="text-xs text-gray-600">Sécurisée</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </div>
          <div>
            <div className="text-xs text-amber-700 font-medium">Retour</div>
            <div className="text-xs text-gray-600">Satisfait ou remboursé</div>
          </div>
        </div>
      </div>
    </div>
  );
}

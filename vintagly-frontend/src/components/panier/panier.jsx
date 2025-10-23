import React, { useState } from 'react';

const Panier = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Vélo Vintage Touring',
      category: 'Cyclisme',
      price: 1299.00,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1470&auto=format&fit=crop',
      available: true
    },
    {
      id: 2,
      name: 'Casque de Protection Premium',
      category: 'Accessoires',
      price: 189.90,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=1476&auto=format&fit=crop',
      available: true
    },
    {
      id: 3,
      name: 'Éclairage LED Avant et Arrière',
      category: 'Sécurité',
      price: 49.95,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1523740856324-f2ce89135981?q=80&w=1512&auto=format&fit=crop',
      available: false
    }
  ]);

  const updateQuantity = (id, delta) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = 12.99;
  const taxRate = 0.20;
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen py-8 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 border-2 border-dashed border-[#c8a87a] p-4 rounded-lg bg-white">
          <div className="flex items-center gap-3">
            <div className="bg-[#D4A574] text-white px-2 py-1 rounded text-xs font-bold">DIY</div>
            <h1 className="text-[#2D2D2D] text-2xl md:text-3xl font-bold">Mon Panier</h1>
            <span className="bg-[#D4A574] text-white px-3 py-1 rounded-full text-sm font-medium">
              {cartItems.length} Articles
            </span>
          </div>
          <a href="/" className="text-[#666] flex items-center gap-2 hover:text-[#2D2D2D] transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>Continuer mes achats</span>
          </a>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          {/* Cart Items List - 70% */}
          <div className="lg:col-span-7 space-y-6">
            {cartItems.length > 0 ? (
              cartItems.map(item => (
                <div key={item.id} className="bg-[#D9C4B8] rounded-2xl p-6 shadow-md flex flex-col md:flex-row gap-6 transition-all hover:shadow-lg duration-300">
                  <div className="shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-[130px] h-[130px] object-cover rounded-xl" 
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-[#2D2D2D] font-semibold text-lg mb-1">{item.name}</h3>
                          <p className="text-[#666] text-sm mb-2">
                            Catégorie: <span className="text-[#2D2D2D]">{item.category}</span>
                          </p>
                          <p className="text-[#2D2D2D] font-bold text-lg">{item.price.toFixed(2).replace('.', ',')} €</p>
                        </div>
                        <button 
                          className="text-[#A8B9B4] hover:text-[#D4A574] transition-colors"
                          onClick={() => removeItem(item.id)}
                          aria-label="Supprimer l'article"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center rounded-lg overflow-hidden bg-[#3B5F5C]">
                        <button 
                          className="w-9 h-9 bg-[#3B5F5C] text-white flex items-center justify-center hover:bg-[#2D4644] transition-colors text-xl font-bold"
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label="Diminuer la quantité"
                        >
                          −
                        </button>
                        <input 
                          type="text" 
                          value={item.quantity} 
                          className="w-12 h-9 text-center bg-white border-none text-[#2D2D2D] font-medium" 
                          readOnly 
                        />
                        <button 
                          className="w-9 h-9 bg-[#3B5F5C] text-white flex items-center justify-center hover:bg-[#2D4644] transition-colors text-xl font-bold"
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label="Augmenter la quantité"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm text-[#2D2D2D] font-medium">
                        Disponible: <span className={item.available ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                          {item.available ? 'En stock' : 'Rupture de stock'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg p-8 shadow-sm text-center">
                <div className="flex justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#A8B9B4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-[#2D2D2D] text-xl font-medium mb-2">Votre panier est vide</h3>
                <p className="text-[#2D2D2D] opacity-70 mb-6">Découvrez notre sélection de produits et commencez votre shopping</p>
                <a href="/" className="inline-block bg-[#3B5F5C] text-white px-6 py-2 rounded-lg hover:bg-[#D4A574] transition-colors">
                  Commencer vos achats
                </a>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar - 30% */}
          <div className="lg:col-span-3">
            <div className="bg-[#A8B9B4] rounded-2xl p-6 shadow-md sticky top-4">
              <h2 className="text-[#2D2D2D] text-xl font-bold mb-6">Récapitulatif</h2>
              
              {/* Status Indicator */}
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <p className="text-[#2D2D2D] text-sm font-medium">Panier actif</p>
              </div>
              
              {/* Date Validation */}
              <div className="bg-white bg-opacity-70 rounded-xl p-4 mb-6">
                <p className="text-[#666] text-sm mb-1">Date de validation</p>
                <div className="flex items-center justify-between">
                  <p className="text-[#2D2D2D] font-semibold">{new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#3B5F5C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              
              {/* Price Calculations */}
              <div className="space-y-3 border-b border-[#8FA39F] pb-4 mb-4">
                <div className="flex justify-between">
                  <p className="text-[#2D2D2D] text-sm">Sous-total</p>
                  <p className="text-[#2D2D2D] font-semibold">{subtotal.toFixed(2).replace('.', ',')} €</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#2D2D2D] text-sm">Frais de livraison</p>
                  <p className="text-[#2D2D2D] font-semibold">{shipping.toFixed(2).replace('.', ',')} €</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#2D2D2D] text-sm">TVA (20%)</p>
                  <p className="text-[#2D2D2D] font-semibold">{tax.toFixed(2).replace('.', ',')} €</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <p className="text-[#2D2D2D] font-bold text-lg">Total</p>
                <p className="text-[#2D2D2D] font-bold text-xl">{total.toFixed(2).replace('.', ',')} €</p>
              </div>
              
              <button className="w-full bg-[#3B5F5C] text-white py-3 rounded-xl font-semibold hover:bg-[#2D4644] transition-colors flex items-center justify-center gap-2 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Valider la commande
              </button>
              
              <div className="text-center">
                <a href="#" className="text-[#2D2D2D] text-sm hover:text-[#3B5F5C] transition-colors inline-flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Paiement sécurisé
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Panier;
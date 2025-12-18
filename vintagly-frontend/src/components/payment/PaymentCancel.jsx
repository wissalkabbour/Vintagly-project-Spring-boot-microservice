// src/components/payment/PaymentCancel.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import NavbarCatalogue from '../catalog/NavbarCatalogue';

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <>
      <NavbarCatalogue />
      <div className="min-h-screen py-8 px-4 md:px-8 lg:px-12 bg-[#f7f3eb]">
        <div className="max-w-2xl mx-auto">
          
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <XCircle className="mx-auto mb-4 text-red-500" size={64} />
            <h1 className="text-3xl font-bold text-[#2D2D2D] mb-2">
              Paiement annulé
            </h1>
            <p className="text-gray-600 mb-6">
              Votre paiement a été annulé. Vous pouvez réessayer quand vous voulez.
            </p>

            <button
              onClick={() => navigate('/panier')}
              className="w-full bg-[#8c5d36] text-white py-3 rounded-xl font-semibold hover:bg-[#704828] transition-colors mb-4"
            >
              Retour au panier
            </button>

            <button
              onClick={() => navigate('/catalogue')}
              className="w-full bg-[#D4A574] text-white py-3 rounded-xl font-semibold hover:bg-[#c8a87a] transition-colors"
            >
              Continuer mes achats
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default PaymentCancel;
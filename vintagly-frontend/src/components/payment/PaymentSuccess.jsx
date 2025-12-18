// src/components/payment/PaymentSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { paymentService } from '../../services/paymentService';
import { factureService } from '../../services/factureService';
import { CheckCircle, Download, Loader2, AlertCircle, XCircle } from 'lucide-react';
import NavbarCatalogue from '../catalog/NavbarCatalogue';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [facture, setFacture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("=== PAGE SUCCESS CHARGÉE ===");
    
    const sessionId = searchParams.get('session_id');
    console.log("Session ID:", sessionId);
    
    if (!sessionId) {
      console.error("❌ Pas de session_id dans l'URL");
      navigate('/panier');
      return;
    }

    const confirmPayment = async () => {
      try {
        console.log("📦 ÉTAPE 1: Confirmation du paiement...");
        const paymentData = await paymentService.confirmerPaymentStripe(sessionId);
        console.log("✅ Payment confirmé:", paymentData);
        setPayment(paymentData);

        console.log("📄 ÉTAPE 2: Génération de la facture...");
        try {
          const factureData = await factureService.genererFacture(paymentData.idCommande);
          console.log("✅ Facture générée:", factureData);
          setFacture(factureData);
        } catch (factureError) {
          console.warn("⚠️ Erreur génération facture (non bloquant):", factureError);
          // Ne pas bloquer si la facture échoue
        }

      } catch (error) {
        console.error("❌ ERREUR:", error);
        console.error("Type:", error.name);
        console.error("Message:", error.message);
        console.error("Response:", error.response);
        
        let errorMsg = "Une erreur est survenue lors de la confirmation du paiement. ";
        
        if (error.response) {
          errorMsg += `Erreur ${error.response.status}: ${error.response.data?.message || error.response.statusText}`;
        } else if (error.request) {
          errorMsg += "Impossible de contacter le serveur.";
        } else {
          errorMsg += error.message;
        }
        
        setError(errorMsg);
      } finally {
        console.log("🏁 Chargement terminé");
        setLoading(false);
      }
    };

    confirmPayment();
  }, [searchParams, navigate]);

  const handleDownloadPDF = async () => {
    if (facture) {
      try {
        console.log("📥 Téléchargement PDF pour facture:", facture.id);
        await factureService.telechargerPDF(facture.id);
      } catch (error) {
        console.error('❌ Erreur téléchargement PDF:', error);
        alert('Erreur lors du téléchargement de la facture');
      }
    }
  };

  // ÉTAT DE CHARGEMENT
  if (loading) {
    return (
      <>
        <NavbarCatalogue />
        <div className="min-h-screen flex items-center justify-center bg-[#f7f3eb]">
          <div className="text-center">
            <Loader2 className="animate-spin mx-auto mb-4 text-[#8c5d36]" size={48} />
            <p className="text-xl text-[#2D2D2D]">Confirmation du paiement...</p>
            <p className="text-sm text-gray-500 mt-2">Veuillez patienter</p>
          </div>
        </div>
      </>
    );
  }

  // ÉTAT D'ERREUR
  if (error) {
    return (
      <>
        <NavbarCatalogue />
        <div className="min-h-screen py-8 px-4 md:px-8 lg:px-12 bg-[#f7f3eb]">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <XCircle className="mx-auto mb-4 text-red-500" size={64} />
              <h1 className="text-3xl font-bold text-[#2D2D2D] mb-2">
                Erreur
              </h1>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-left">
                <p className="text-red-800">{error}</p>
              </div>
              <button
                onClick={() => navigate('/panier')}
                className="w-full bg-[#8c5d36] text-white py-3 rounded-xl font-semibold hover:bg-[#704828] transition-colors"
              >
                Retour au panier
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ÉTAT DE SUCCÈS
  return (
    <>
      <NavbarCatalogue />
      <div className="min-h-screen py-8 px-4 md:px-8 lg:px-12 bg-[#f7f3eb]">
        <div className="max-w-2xl mx-auto">
          
          {/* SUCCESS CARD */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <CheckCircle className="mx-auto mb-4 text-green-500" size={64} />
            <h1 className="text-3xl font-bold text-[#2D2D2D] mb-2">
              Paiement réussi !
            </h1>
            <p className="text-gray-600 mb-6">
              Votre commande a été confirmée avec succès
            </p>

            {payment ? (
              <div className="bg-[#f7f3eb] rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>ID Paiement :</strong> {payment.id}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>ID Commande :</strong> {payment.idCommande}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Montant :</strong> {payment.montant ? payment.montant.toFixed(2) : '0.00'} €
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Statut :</strong> 
                  <span className="text-green-600 font-semibold ml-2">
                    {payment.statut || 'CONFIRMÉ'}
                  </span>
                </p>
              </div>
            ) : (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 text-left">
                <div className="flex items-start">
                  <AlertCircle className="text-yellow-600 mr-2 flex-shrink-0" size={20} />
                  <p className="text-yellow-800 text-sm">
                    Paiement confirmé mais les détails n'ont pas pu être récupérés.
                  </p>
                </div>
              </div>
            )}

            {facture && (
              <button
                onClick={handleDownloadPDF}
                className="w-full bg-[#8c5d36] text-white py-3 rounded-xl font-semibold hover:bg-[#704828] transition-colors flex items-center justify-center gap-2 mb-4"
              >
                <Download size={20} />
                Télécharger la facture
              </button>
            )}

            <button
              onClick={() => navigate('/catalogue')}
              className="w-full bg-[#D4A574] text-white py-3 rounded-xl font-semibold hover:bg-[#c8a87a] transition-colors"
            >
              Retour au catalogue
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;
// src/services/paymentService.js
import axios from 'axios';

const API_URL = 'http://localhost:8195/api/payments';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const paymentService = {
  // Initier un paiement
  initierPayment: async (idCommande, methodePayment = 'CARTE_CREDIT') => {
    try {
      const response = await axios.post(
        `${API_URL}/initiate`,
        null,
        {
          params: { idCommande, methodePayment },
          headers: getAuthHeader()
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur initiation paiement:', error);
      throw error;
    }
  },

  // Créer une session Stripe
  creerSessionStripe: async (idCommande) => {
    try {
      const response = await axios.post(
        `${API_URL}/stripe/create-checkout-session`,
        null,
        {
          params: { idCommande },
          headers: getAuthHeader()
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur création session Stripe:', error);
      throw error;
    }
  },

  // Vérifier le statut d'un paiement
  verifierStatut: async (paymentId) => {
    try {
      const response = await axios.get(
        `${API_URL}/${paymentId}`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur vérification statut:', error);
      throw error;
    }
  },

  // Confirmer le paiement Stripe
  confirmerPaymentStripe: async (sessionId) => {
    try {
      const response = await axios.get(
        `${API_URL}/stripe/confirm/${sessionId}`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur confirmation paiement:', error);
      throw error;
    }
  }
};
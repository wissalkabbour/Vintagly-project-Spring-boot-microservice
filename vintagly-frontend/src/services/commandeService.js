// src/services/commandeService.js
import axios from 'axios';

const API_URL = 'http://localhost:8195/api/commandes';

// Récupérer le token depuis localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const commandeService = {
  // Créer une commande depuis le panier
  creerCommande: async () => {
    try {
      const response = await axios.post(
        `${API_URL}/create`,
        {},
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur création commande:', error);
      throw error;
    }
  },

  // Valider une commande
  validerCommande: async (idCommande) => {
    try {
      const response = await axios.put(
        `${API_URL}/${idCommande}/valider`,
        {},
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur validation commande:', error);
      throw error;
    }
  },

  // Récupérer une commande
  getCommande: async (idCommande) => {
    try {
      const response = await axios.get(
        `${API_URL}/${idCommande}`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur récupération commande:', error);
      throw error;
    }
  }
};
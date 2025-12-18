// src/services/factureService.js
import axios from 'axios';

const API_URL = 'http://localhost:8195/api/factures';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const factureService = {
  // Générer une facture
  genererFacture: async (idCommande) => {
    try {
      const response = await axios.post(
        API_URL,
        null,
        {
          params: { idCommande },
          headers: getAuthHeader()
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur génération facture:', error);
      throw error;
    }
  },

  // Récupérer une facture
  getFacture: async (idFacture) => {
    try {
      const response = await axios.get(
        `${API_URL}/${idFacture}`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur récupération facture:', error);
      throw error;
    }
  },

  // Télécharger le PDF
  telechargerPDF: async (idFacture) => {
    try {
      const response = await axios.get(
        `${API_URL}/${idFacture}/pdf`,
        {
          headers: getAuthHeader(),
          responseType: 'blob' // Important pour les fichiers
        }
      );
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `facture_${idFacture}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return response.data;
    } catch (error) {
      console.error('Erreur téléchargement PDF:', error);
      throw error;
    }
  }
};
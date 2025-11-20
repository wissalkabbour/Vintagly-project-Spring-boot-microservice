// src/services/panierService.js
const API_URL = "http://localhost:8195/api/paniers";

// Helper to get token + call fetch with Authorization
const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Utilisateur non authentifié (token manquant)");
  }

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  const res = await fetch(url, { ...options, headers });
  return res;
};

export const panierService = {
  // 1. Créer le panier pour l'utilisateur connecté (idempotent)
  async createPanierIfNeeded() {
    const res = await authFetch(`${API_URL}/create`, {
      method: "POST",
    });

    // Si ton backend renvoie 200/201 quand il crée
    // et 200 quand il trouve déjà, on accepte tout 2xx.
    if (!res.ok) {
      throw new Error("Impossible d'initialiser le panier");
    }

    return await res.json();
  },

  // 2. Ajouter un article
  async addArticle(articleId) {
    // s'assurer que le panier existe pour cet utilisateur
    await this.createPanierIfNeeded();

    const res = await authFetch(`${API_URL}/articles/${articleId}`, {
      method: "POST",
    });

    if (!res.ok) {
      throw new Error("Erreur ajout panier");
    }
    return await res.json();
  },

  // 3. Récupérer le panier
  async getPanier() {
    const res = await authFetch(API_URL);
    if (!res.ok) {
      throw new Error("Erreur panier");
    }
    return await res.json();
  },

  // 4. Supprimer un article (utilisé dans Panier.jsx)
  async removeArticle(articleId) {
    const res = await authFetch(`${API_URL}/articles/${articleId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Erreur suppression article du panier");
    }
    return await res.json();
  },
};

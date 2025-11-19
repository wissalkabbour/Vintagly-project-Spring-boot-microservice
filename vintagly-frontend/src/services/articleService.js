const API_BASE_URL = "http://localhost:8195/api/catalogue";

// Fonction utilitaire pour récupérer le token
const getAuthToken = () => {
  return localStorage.getItem("token"); // Assure-toi que tu stockes bien "token"
};

export const articleService = {

  // ➕ Ajouter un article
  addArticle: async (formData) => {
    console.log("Contenu du FormData :");
    for (let pair of formData.entries()) {
      console.log(pair[0], ":", pair[1]);
    }

    try {
      const token = getAuthToken();

      const response = await fetch(`${API_BASE_URL}/articles`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erreur lors de l'ajout de l'article");
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur dans addArticle:", error);
      throw error;
    }
  },

  // 📌 Charger toutes les catégories
  getCategories: async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("resssssssss", response);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Erreur lors du chargement des catégories");
    }

    const data = await response.json();
    console.log("categories", data);

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Erreur dans getCategories:", error);
    return [];
  }
},

};

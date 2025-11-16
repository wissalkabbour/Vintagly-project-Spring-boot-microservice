const API_BASE_URL = "http://localhost:8888/api/catalogue";

export const articleService = {
  // Ajouter un article
  addArticle: async (formData) => {
    console.log("Contenu du FormData :");
    for (let pair of formData.entries()) {
      console.log(pair[0], ":", pair[1]);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/articles`, {
        method: "POST",
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

  // Charger toutes les catégories
  getCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erreur lors du chargement des catégories");
      }
      const data = await response.json();
      console.log("articles",data)
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Erreur dans getCategories:", error);
      return [];
    }
  },
};
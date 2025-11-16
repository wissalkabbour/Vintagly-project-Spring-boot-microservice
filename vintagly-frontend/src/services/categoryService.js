import axios from "axios";

const API_URL = "http://localhost:8888/api/catalogue/categories";

// 📌 Récupérer toutes les catégories
export const getCategories = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors du fetch des catégories :", error);
    return [];
  }
};

// 📌 Ajouter une nouvelle catégorie
export const addCategory = async (categorie) => {
  try {
    const response = await axios.post(API_URL, categorie);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout de la catégorie :", error);
    throw error;
  }
};

// 📌 Supprimer une catégorie
export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors de la suppression :", error);
    throw error;
  }
};

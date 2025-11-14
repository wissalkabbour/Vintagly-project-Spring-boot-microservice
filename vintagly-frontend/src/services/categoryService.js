import axios from "axios";

const API_URL = "http://localhost:8195/api/catalogue/categories"; 

export const getCategories = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // retourne la liste des catégories
  } catch (error) {
    console.error("Erreur lors du fetch des catégories :", error);
    return [];
  }
};

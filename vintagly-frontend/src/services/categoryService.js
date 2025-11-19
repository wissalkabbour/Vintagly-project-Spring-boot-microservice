import axios from "axios";

const API_URL = "http://localhost:8195/api/catalogue/categories";

// 🔐 Récupération du token depuis localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// 📌 Instance Axios avec token automatique
const axiosInstance = axios.create();

// ➕ Ajouter automatiquement le token pour chaque requête
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 📌 Récupérer toutes les catégories
export const getCategories = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors du fetch des catégories :", error);
    return [];
  }
};

// 📌 Ajouter une catégorie
export const addCategory = async (categorie) => {
  try {
    const response = await axiosInstance.post(API_URL, categorie);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout de la catégorie :", error);
    throw error;
  }
};

// 📌 Supprimer une catégorie
export const deleteCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors de la suppression :", error);
    throw error;
  }
};

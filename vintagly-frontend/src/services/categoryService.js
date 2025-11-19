import axios from "axios";

const API_URL = "http://localhost:8195/api/catalogue/categories";

// 🔐 Récupération du token depuis localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// 📌 Instance Axios AVEC token (pour POST, DELETE…)
const axiosAuth = axios.create();

axiosAuth.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 📌 Instance Axios SANS token (pour GET public)
const axiosPublic = axios.create();


// =============================
// ✅ GET CATEGORIES — PUBLIC
// =============================
export const getCategories = async () => {
  try {
    const response = await axiosPublic.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors du fetch des catégories :", error);
    return [];
  }
};

// =============================
// 🔐 ADD CATEGORY — ADMIN
// =============================
export const addCategory = async (categorie) => {
  try {
    const response = await axiosAuth.post(API_URL, categorie);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout de la catégorie :", error);
    throw error;
  }
};

// =============================
// 🔐 DELETE CATEGORY — ADMIN
// =============================
export const deleteCategory = async (id) => {
  try {
    const response = await axiosAuth.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors de la suppression :", error);
    throw error;
  }
};

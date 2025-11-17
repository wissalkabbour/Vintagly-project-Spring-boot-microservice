// src/components/AddArticleForm.jsx
import React, { useState, useEffect } from "react";
import { Upload, X, Plus, CheckCircle, AlertCircle } from "lucide-react";
import { articleService } from "../services/articleService";

export default function AddArticleForm() {
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    historique: "",
    prix: "",
    productLifecycle: "",
    categorieId: "",
  });

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [certificat, setCertificat] = useState(null);
  const [certificatPreview, setCertificatPreview] = useState(null);

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await articleService.getCategories();
      setCategories(data);
    } catch {
      setMessage({ type: "error", text: "Erreur lors du chargement des catégories" });
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 🔥 Certificat obligatoirement PDF
  const handleCertificatChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type !== "application/pdf") {
      setMessage({ type: "error", text: "Le certificat doit être un fichier PDF uniquement." });
      return;
    }

    if (file) {
      setCertificat(file);
      setCertificatPreview(file.name);
      setMessage({ type: "", text: "" });
    }
  };

  const removeCertificat = () => {
    setCertificat(null);
    setCertificatPreview(null);
  };

  // 🔥 Images obligatoires
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    setImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, { url: reader.result, name: file.name }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Vérification obligatoire de tous les champs + pdf + ≥1 image
    if (
      !formData.nom ||
      !formData.description ||
      !formData.historique ||
      !formData.prix ||
      !formData.productLifecycle ||
      !formData.categorieId ||
      !certificat ||
      images.length === 0
    ) {
      setMessage({
        type: "error",
        text: "Veuillez remplir tous les champs, ajouter un certificat PDF et au moins une image.",
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    data.append("certificat", certificat);
    images.forEach((img) => data.append("images", img));

    try {
      const response = await articleService.addArticle(data);
      setMessage({ type: "success", text: response.message });

      // Reset
      setFormData({
        nom: "",
        description: "",
        historique: "",
        prix: "",
        productLifecycle: "",
        categorieId: "",
      });
      setCertificat(null);
      setCertificatPreview(null);
      setImages([]);
      setImagePreviews([]);
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Erreur lors de l'ajout" });
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Activation du bouton
  const isFormValid =
    formData.nom &&
    formData.description &&
    formData.historique &&
    formData.prix &&
    formData.productLifecycle &&
    formData.categorieId &&
    certificat &&
    images.length > 0;

  return (
    <div
      className="min-h-screen flex justify-center items-center px-4 py-8"
      style={{ backgroundColor: "#f3e7db" }}
    >
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl font-bold text-center mb-6" style={{ color: "#8c5d36" }}>
          Ajouter un Article
        </h1>

        {/* Message */}
        {message.text && (
          <div
            className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Nom + Prix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleInputChange}
              placeholder="Nom"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#8c5d36]"
            />

            <input
              type="number"
              name="prix"
              value={formData.prix}
              onChange={handleInputChange}
              placeholder="Prix (€)"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#8c5d36]"
            />
          </div>

          {/* Description */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#8c5d36]"
          />

          {/* Historique */}
          <textarea
            name="historique"
            value={formData.historique}
            onChange={handleInputChange}
            placeholder="Historique"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#8c5d36]"
          />

          {/* Cycle de vie + Catégorie */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="productLifecycle"
              value={formData.productLifecycle}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#8c5d36]"
            >
              <option value="">Cycle de vie</option>
              <option value="NOUVEAU">Nouveau</option>
              <option value="ANCIEN">Ancien</option>
              <option value="VINTAGE">Vintage</option>
              <option value="RESTAURE">Restauré</option>
            </select>

            <select
              name="categorieId"
              value={formData.categorieId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#8c5d36]"
            >
              <option value="">Catégorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Certificat (PDF obligatoire) */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#8c5d36" }}>
              Certificat (PDF obligatoire)
            </label>

            <label className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#8c5d36] transition">
                <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                <span className="text-sm text-gray-600">Ajouter un certificat (PDF)</span>
                <input type="file" accept="application/pdf" onChange={handleCertificatChange} className="hidden" />
              </div>
            </label>

            {certificatPreview && (
              <div className="mt-2 flex items-center justify-between bg-[#f3e7db] p-2 rounded-lg">
                <span className="text-sm">{certificatPreview}</span>
                <button onClick={removeCertificat} className="text-red-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Images obligatoires */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#8c5d36" }}>
              Images (obligatoires)
            </label>

            <label className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#8c5d36] transition">
                <Plus className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                <span className="text-sm text-gray-600">Ajouter des images</span>
                <input type="file" accept="image/*" multiple onChange={handleImagesChange} className="hidden" />
              </div>
            </label>

            {imagePreviews.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative w-full h-28 rounded-lg overflow-hidden bg-gray-100">
                    <img src={preview.url} alt={preview.name} className="object-contain w-full h-full" />

                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bouton Ajouter */}
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || loading || loadingCategories}
            className="w-full py-3 rounded-lg font-semibold text-white shadow-md mt-4"
            style={{
              backgroundColor: "#8c5d36",
              opacity: !isFormValid || loading ? 0.5 : 1,
              cursor: !isFormValid ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Ajout en cours..." : "Ajouter l'article"}
          </button>
        </div>
      </div>
    </div>
  );
}

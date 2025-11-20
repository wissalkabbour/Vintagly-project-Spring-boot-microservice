import React, { useEffect, useState } from "react";
import { Trash, Plus, Inbox } from "lucide-react";
import { getCategories, addCategory, deleteCategory } from "../services/categoryService";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette catégorie ?")) return;
    try {
      await deleteCategory(id);
      loadCategories();
    } catch (error) {
      console.error("Erreur suppression :", error);
    }
  };

  const handleAdd = async () => {
    if (!newCategoryName.trim()) return;
    try {
      await addCategory({ nom: newCategoryName });
      setNewCategoryName("");
      setShowModal(false);
      loadCategories();
    } catch (error) {
      console.error("Erreur ajout catégorie :", error);
    }
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="w-[700px]">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-[#8c5d36]">
            Liste des Catégories
          </h2>

          <button
            className="flex items-center gap-2 bg-[#8c5d36] hover:bg-[#b47b4e] 
                       text-white px-4 py-2 rounded-lg shadow-md transition"
            onClick={() => setShowModal(true)}
          >
            <Plus size={20} />
            Ajouter
          </button>
        </div>

        {/* TABLE */}
        <div className="rounded-lg border border-[#b47b4e]/40 shadow overflow-hidden">
          <table className="w-full bg-white text-base">
            <thead className="bg-[#b47b4e]/20 border-b border-[#b47b4e]/40">
              <tr>
                <th className="px-4 py-3 text-left text-[#8c5d36] font-semibold">#</th>
                <th className="px-4 py-3 text-left text-[#8c5d36] font-semibold">Nom</th>
                <th className="px-4 py-3 text-center text-[#8c5d36] font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {/* Aucune catégorie */}
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-10">
                    <div className="flex flex-col items-center text-[#8c5d36]">
                      <Inbox size={40} className="mb-2 opacity-70" />
                      <p className="text-lg font-medium">
                        Aucune catégorie disponible
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                categories.map((cat, index) => (
                  <tr
                    key={cat.id}
                    className="border-b border-[#b47b4e]/30 hover:bg-[#b47b4e]/10 transition"
                  >
                    {/* Numéro statique */}
                    <td className="px-4 py-3 text-[#8c5d36] font-semibold">
                      {index + 1}
                    </td>

                    <td className="px-4 py-3 text-[#8c5d36]">{cat.nom}</td>

                    <td className="px-4 py-3 text-center">
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(cat.id)}
                      >
                        <Trash size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
          <div className="bg-white w-80 p-6 rounded-xl shadow-xl border border-[#b47b4e]/40">
            <h3 className="text-xl font-semibold text-[#8c5d36] mb-4">
              Nouvelle catégorie
            </h3>

            <input
              type="text"
              className="w-full border border-[#b47b4e]/40 rounded-lg px-3 py-2 mb-4 
                         focus:ring-2 focus:ring-[#b47b4e] outline-none"
              placeholder="Nom de la catégorie"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                Annuler
              </button>

              <button
                className="px-4 py-2 rounded-lg text-white bg-[#8c5d36] hover:bg-[#b47b4e]"
                onClick={handleAdd}
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;

export async function getProductById(id) {
  return {
    id,
    nom: "Montre de collection",
    date_de_pub: "2025-10-01",
    description: "Montre vintage des années 60 avec boîtier doré et bracelet en cuir véritable.",
    historique: "A appartenu à un collectionneur privé en Suisse avant d’être restaurée en 2023.",
    prix: 1299.99,
    images: [
      { id: 1, path: "/images/m1.webp" },
      { id: 2, path: "/images/m2.webp" },
            { id: 3, path: "/images/m3.webp" },

    ],
  };
}

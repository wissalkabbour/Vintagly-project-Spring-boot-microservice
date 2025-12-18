import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // 👈 importer useParams
import { getProductById } from "../services/apiProduct";
import ProductGallery from "../components/ProductGallery";
import ProductDetails from "../components/ProductDetails";
import Loader from "../components/Loader";

export default function ProductPage() {
  const { id } = useParams(); // 👈 récupérer l'id depuis l'URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("Erreur récupération produit :", error);
      }
    }
    fetchProduct();
  }, [id]);

  if (!product) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-10">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Galerie sticky fixée à gauche */}
          <div className="md:w-1/2 md:sticky md:top-10 self-start">
            <ProductGallery images={product.images} />
          </div>

          {/* Détails */}
          <div className="md:w-1/2">
            <ProductDetails product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";

const BASE_URL = "http://localhost:8195";

export default function ProductGallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(0);

  const imageUrls =
    images?.map(img => `${BASE_URL}${img.path}`) || [];

  if (imageUrls.length === 0) {
    return (
      <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-12 text-center">
        <p className="text-amber-800 font-serif">Aucune image disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative bg-white border-4 border-amber-900/20 rounded-lg overflow-hidden shadow-lg">
        <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
          <img
            src={imageUrls[selectedImage]}
            alt={`Vue produit ${selectedImage + 1}`}
            className="w-full h-full object-contain p-8"
          />
        </div>
        
        {/* Badge vintage */}
        <div className="absolute top-4 left-4 bg-amber-900 text-amber-50 px-4 py-2 rounded-full shadow-lg">
          <span className="text-xs font-serif tracking-wider uppercase">Vintage</span>
        </div>

        {/* Navigation arrows si plusieurs images */}
        {imageUrls.length > 1 && (
          <>
            <button
              onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : imageUrls.length - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-2 border-amber-900/30 rounded-full p-3 shadow-lg transition-all hover:scale-110"
              aria-label="Image précédente"
            >
              <svg className="w-5 h-5 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setSelectedImage((prev) => (prev < imageUrls.length - 1 ? prev + 1 : 0))}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-2 border-amber-900/30 rounded-full p-3 shadow-lg transition-all hover:scale-110"
              aria-label="Image suivante"
            >
              <svg className="w-5 h-5 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {imageUrls.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {imageUrls.map((url, index) => (
            <button
              key={images[index].id}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-3 transition-all ${
                selectedImage === index
                  ? "border-amber-900 ring-2 ring-amber-500 scale-105"
                  : "border-amber-200 hover:border-amber-500"
              }`}
            >
              <img
                src={url}
                alt={`Miniature ${index + 1}`}
                className="w-full h-full object-cover bg-amber-50"
              />
            </button>
          ))}
        </div>
      )}

      {/* Indicateur d'image */}
      {imageUrls.length > 1 && (
        <div className="flex justify-center gap-2">
          {imageUrls.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`h-2 rounded-full transition-all ${
                selectedImage === index
                  ? "w-8 bg-amber-900"
                  : "w-2 bg-amber-300 hover:bg-amber-500"
              }`}
              aria-label={`Aller à l'image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
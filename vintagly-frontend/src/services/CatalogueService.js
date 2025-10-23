// src/services/CatalogueService.js

// Données statiques pour le moment
const categories = [
  {
    name: "Vêtements Vintage",
    products: [
      { id: 1, name: "Robe rétro", price: "350 MAD", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" },
      { id: 2, name: "Chemise années 80", price: "220 MAD", image: "https://images.unsplash.com/photo-1554568218-0f1715e72254" },
      { id: 4, name: "Jupe à carreaux", price: "290 MAD", image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb" },
      { id: 5, name: "Pantalon flare", price: "310 MAD", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c" },
         { id: 4, name: "Jupe à carreaux", price: "290 MAD", image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb" },
      { id: 5, name: "Pantalon flare", price: "310 MAD", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c" },
      { id: 4, name: "Jupe à carreaux", price: "290 MAD", image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb" },
      { id: 5, name: "Pantalon flare", price: "310 MAD", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c" },
         { id: 4, name: "Jupe à carreaux", price: "290 MAD", image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb" },
      { id: 5, name: "Pantalon flare", price: "310 MAD", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c" },
    
    ],
  },
  {
    name: "Accessoires",
    products: [
       { id: 1, name: "Robe rétro", price: "350 MAD", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" },
      { id: 2, name: "Chemise années 80", price: "220 MAD", image: "https://images.unsplash.com/photo-1554568218-0f1715e72254" },
      { id: 4, name: "Jupe à carreaux", price: "290 MAD", image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb" },
      { id: 5, name: "Pantalon flare", price: "310 MAD", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c" },
      { id: 9, name: "Montre classique", price: "600 MAD", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30" },
       { id: 1, name: "Robe rétro", price: "350 MAD", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" },
      { id: 2, name: "Chemise années 80", price: "220 MAD", image: "https://images.unsplash.com/photo-1554568218-0f1715e72254" },
     
    ],
  },
  {
    name: "Décoration",
    products: [
      { id: 11, name: "Lampe rétro", price: "450 MAD", image: "https://images.unsplash.com/photo-1503602642458-232111445657" },
      { id: 12, name: "Horloge murale", price: "380 MAD", image: "https://images.unsplash.com/photo-1521540216272-a50305cd4421" },
      { id: 13, name: "Tableau abstrait", price: "520 MAD", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97" },
       { id: 1, name: "Robe rétro", price: "350 MAD", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" },
      { id: 2, name: "Chemise années 80", price: "220 MAD", image: "https://images.unsplash.com/photo-1554568218-0f1715e72254" },
        { id: 13, name: "Tableau abstrait", price: "520 MAD", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97" },
       { id: 1, name: "Robe rétro", price: "350 MAD", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" },
      { id: 2, name: "Chemise années 80", price: "220 MAD", image: "https://images.unsplash.com/photo-1554568218-0f1715e72254" },
     
    ],
  },
  {
    name: "Chaussures",
    products: [
            { id: 13, name: "Tableau abstrait", price: "520 MAD", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97" },
       { id: 1, name: "Robe rétro", price: "350 MAD", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" },
      { id: 2, name: "Chemise années 80", price: "220 MAD", image: "https://images.unsplash.com/photo-1554568218-0f1715e72254" },
     
      { id: 14, name: "Bottes cuir", price: "480 MAD", image: "https://images.unsplash.com/photo-1519741497674-611481863552" },
      { id: 15, name: "Sandales rétro", price: "230 MAD", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a" },
             { id: 14, name: "Bottes cuir", price: "480 MAD", image: "https://images.unsplash.com/photo-1519741497674-611481863552" },
      { id: 15, name: "Sandales rétro", price: "230 MAD", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a" },
  
    ],
  },
];

// Simule un appel API (pour l’instant local)
export const getCategories = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(categories);
    }, 300); // petit délai pour simuler le chargement
  });
};

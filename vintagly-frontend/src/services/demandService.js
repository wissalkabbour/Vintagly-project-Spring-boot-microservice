export const addDemande = async (formData) => {
    const data = new FormData();
    data.append("nom", formData.businessName);
    data.append("description", formData.description);
    data.append("historique", formData.historique); 
    data.append("prix", formData.price);
    data.append("idUtilisateur", 1); 
    data.append("era", formData.selectedEra);
    data.append("phone", formData.phone);
    data.append("categorie", formData.categories[0]);

    if (formData.businessLicense) {
        data.append("certificat", formData.businessLicense);
    }

    formData.photos.forEach((photo) => {
        data.append("images", photo);
    });

    // 📌 Récupération du token depuis le localStorage
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:8195/api/demandes/add", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}` // ✅ Ajout du token ici
        },
        body: data
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Erreur backend :", errorText);
        throw new Error("Erreur lors de l'envoi de la demande");
    }

    return response.json();
};

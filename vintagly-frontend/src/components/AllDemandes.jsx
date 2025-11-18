import React, { useState, useEffect } from "react";
import { BarChart3, Clock, CheckCircle, XCircle, RefreshCw, Search, Eye, FileText, Image } from "lucide-react";

const getDemandes = async () => {
  try {
    const response = await fetch("http://localhost:8191/api/demandes"); 
    if (!response.ok) throw new Error("Erreur réseau");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes :", error);
    return [];
  }
};

export default function AdminDemandes() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  const mapCategorie = (id) => {
    switch(id) {
      case 1: return "Vêtements";
      case 2: return "Musique";
      case 3: return "Meubles";
      default: return "Autre";
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, []);

  const fetchDemandes = async () => {
    setLoading(true);
    try {
      const data = await getDemandes();
      const mapped = await Promise.all(data.map(async d => {
        // Récupérer les images depuis le microservice images
        const imagesRes = await fetch(`http://localhost:8195/api/catalogue/images/demande/${d.id}`);
        const images = await imagesRes.json();

        return {
          id: d.id,
          businessName: d.nom,
          email: d.email || "inconnu@example.com",
          phone: d.phone || "N/A",
          price: d.prix,
          description: d.description,
          historique: d.historique,
          category: mapCategorie(d.categorieId),
          era: d.eras,
          status: d.etat,
          createdAt: d.createdAt || new Date().toISOString(),
          photos: images.length,
          hasBusinessLicense: d.certificat != null,
          certificat: d.certificat,
          images: images.map(img => `http://localhost:8195${img.path}`)
        };
      }));

      setDemandes(mapped);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatEra = (era) => {
    return era
      .replace('PRE_', 'Pre-')
      .replace('ERA_', '')
      .replace(/_/g, '-');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      EN_ATTENTE: "bg-yellow-100 text-yellow-800 border-yellow-300",
      ACCEPTEE: "bg-green-100 text-green-800 border-green-300",
      REFUSEE: "bg-red-100 text-red-800 border-red-300"
    };
    
    const labels = {
      EN_ATTENTE: "En attente",
      ACCEPTEE: "Approuvée",
      REFUSEE: "Rejetée"
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };


  const openModal = (demande) => {
    setSelectedDemande(demande);
    setEditedData({
      nom: demande.businessName,
      description: demande.description,
      historique: demande.historique,
      prix: demande.price,
      era: demande.era
    });
    setShowModal(true);
    setIsEditing(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDemande(null);
    setIsEditing(false);
  };

  const handleEditChange = (field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const handleApprove = () => {
    setIsEditing(true);
  };

  const handleValidateApproval = async () => {
    try {
      console.log('editedData avant envoi au backend:', editedData);
      const response = await fetch(`http://localhost:8191/api/demandes/valider/${selectedDemande.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData)
      });

      if (response.ok) {
        alert('✅ Demande validée et article créé avec succès !');
        closeModal();
        fetchDemandes();
      } else {
        const errorText = await response.text();
        alert('❌ Erreur lors de la validation : ' + errorText);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur lors de la validation : ' + error.message);
    }
  };

  const handleRefuse = async () => {
    try {
      const response = await fetch(`http://localhost:8191/api/demandes/refuser/${selectedDemande.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        
        closeModal();
        fetchDemandes();
      } else {
        const errorText = await response.text();
        alert(' Erreur lors du rejet : ' + errorText);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert(' Erreur lors du rejet : ' + error.message);
    }
  };

  const filteredDemandes = demandes
    .filter(d => filter === "ALL" || d.status === filter)
    .filter(d => 
      d.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const stats = {
    total: demandes.length,
    pending: demandes.filter(d => d.status === "EN_ATTENTE").length,
    approved: demandes.filter(d => d.status === "ACCEPTEE").length,
    rejected: demandes.filter(d => d.status === "REFUSEE").length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#4a6660] mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des demandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-serif">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-[#4a6660]">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#3d3734] italic">Vintagely Admin</h1>
              <p className="text-gray-600 mt-1">Gestion des demandes vendeurs</p>
            </div>
            <button 
              onClick={fetchDemandes}
              className="bg-[#4a6660] text-white px-4 py-2 rounded hover:bg-[#3d5750] transition duration-200 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Approuvées</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Rejetées</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded px-10 py-2 focus:border-[#4a6660] focus:ring-1 focus:ring-[#4a6660]"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {["ALL", "EN_ATTENTE", "ACCEPTEE", "REFUSEE"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded transition duration-200 ${
                    filter === status
                      ? "bg-[#4a6660] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {status === "ALL" ? "Tous" : 
                   status === "EN_ATTENTE" ? "En attente" :
                   status === "ACCEPTEE" ? "Approuvées" : "Rejetées"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Demandes List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredDemandes.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucune demande trouvée</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#3d3734] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">ID</th>
                    <th className="px-6 py-4 text-left">Business</th>
                    <th className="px-6 py-4 text-left">Contact</th>
                    <th className="px-6 py-4 text-left">Prix</th>
                    <th className="px-6 py-4 text-left">Catégorie</th>
                    <th className="px-6 py-4 text-left">Ère</th>
                    <th className="px-6 py-4 text-left">Statut</th>
                    <th className="px-6 py-4 text-left">Date</th>
                    <th className="px-6 py-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDemandes.map((demande) => (
                    <tr key={demande.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-gray-600">#{demande.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">{demande.businessName}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <Image className="w-3 h-3" />
                          <span>{demande.photos} photos</span>
                          {demande.hasBusinessLicense && (
                            <>
                              <span>•</span>
                              <FileText className="w-3 h-3" />
                              <span>Certifié</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{demande.email}</div>
                        <div className="text-sm text-gray-500">{demande.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-[#4a6660]">{demande.price.toFixed(2)} DH</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-[#d4b5a6] bg-opacity-30 rounded text-sm">
                          {demande.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatEra(demande.era)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(demande.status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(demande.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openModal(demande)}
                          className="text-[#4a6660] hover:text-[#3d5750] font-semibold text-sm underline flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          Voir détails
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Details */}
        {showModal && selectedDemande && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-[#3d3734] text-white p-6 flex items-center justify-between sticky top-0">
                <h2 className="text-2xl font-bold">
                  Détails de la demande #{selectedDemande.id}
                  {isEditing && <span className="ml-3 text-sm bg-blue-600 px-3 py-1 rounded">Mode édition</span>}
                </h2>
                <button 
                  onClick={closeModal}
                  className="text-white hover:text-gray-300 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6">
                {/* Infos Business */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-[#4a6660] mb-2">Informations Business</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Nom:</strong>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedData.nom}
                            onChange={(e) => handleEditChange('nom', e.target.value)}
                            className="ml-2 border border-gray-300 rounded px-2 py-1 w-full mt-1"
                          />
                        ) : (
                          <span className="ml-2">{selectedDemande.businessName}</span>
                        )}
                      </div>
                      <p><strong>Email:</strong> {selectedDemande.email}</p>
                      <p><strong>Téléphone:</strong> {selectedDemande.phone}</p>
                      <div>
                        <strong>Prix:</strong>
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            value={editedData.prix}
                            onChange={(e) => handleEditChange('prix', parseFloat(e.target.value))}
                            className="ml-2 border border-gray-300 rounded px-2 py-1 w-full mt-1"
                          />
                        ) : (
                          <span className="ml-2">{selectedDemande.price.toFixed(2)} DH</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-[#4a6660] mb-2">Détails Produit</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Catégorie:</strong> {selectedDemande.category}</p>
                      <div>
                        <strong>Ère:</strong>
                        {isEditing ? (
                          <select
                            value={editedData.era}
                            onChange={(e) => handleEditChange('era', e.target.value)}
                            className="ml-2 border border-gray-300 rounded px-2 py-1 w-full mt-1"
                          >
                            <option value="PRE_1920S">PRE_1920S</option>
                            <option value="ERA_1920S_1940S">ERA_1920S_1940S</option>
                            <option value="ERA_1950S_1960S">ERA_1950S_1960S</option>
                            <option value="ERA_1970S_1980S">ERA_1970S_1980S</option>
                            <option value="ERA_1990S">ERA_1990S</option>
                          </select>
                        ) : (
                          <span className="ml-2">{formatEra(selectedDemande.era)}</span>
                        )}
                      </div>
                      <p className="flex items-center gap-2">
                        <strong>Photos:</strong> 
                        <Image className="w-4 h-4 inline" />
                        {selectedDemande.photos}
                      </p>
                      <p className="flex items-center gap-2">
                        <strong>Certification:</strong> 
                        {selectedDemande.hasBusinessLicense ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-4 h-4" /> Oui
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-600">
                            <XCircle className="w-4 h-4" /> Non
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description & Historique */}
                <div className="mb-6">
                  <h3 className="font-semibold text-[#4a6660] mb-2">Description</h3>
                  {isEditing ? (
                    <textarea
                      value={editedData.description}
                      onChange={(e) => handleEditChange('description', e.target.value)}
                      className="w-full text-sm border border-gray-300 rounded p-3 min-h-[80px]"
                      rows="3"
                    />
                  ) : (
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      {selectedDemande.description}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-[#4a6660] mb-2">Histoire du produit</h3>
                  {isEditing ? (
                    <textarea
                      value={editedData.historique}
                      onChange={(e) => handleEditChange('historique', e.target.value)}
                      className="w-full text-sm border border-gray-300 rounded p-3 min-h-[80px]"
                      rows="3"
                    />
                  ) : (
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      {selectedDemande.historique}
                    </p>
                  )}
                </div>

                {/* Photos */}
                <div className="mb-6">
                  <h3 className="font-semibold text-[#4a6660] mb-2">Photos</h3>
                  {selectedDemande.images.length === 0 ? (
                    <p className="text-sm text-gray-600">Aucune image disponible</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedDemande.images.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`photo-${index}`}
                          className="w-full h-32 object-cover rounded shadow-sm"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Certificat */}
                {selectedDemande.certificat && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-[#4a6660] mb-2">Certificat</h3>
                    <a 
                      href={`http://localhost:8195${selectedDemande.certificat}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Voir le certificat
                    </a>
                  </div>
                )}

                {/* Statut */}
                <div className="mb-6">
                  <h3 className="font-semibold text-[#4a6660] mb-2">Statut actuel</h3>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(selectedDemande.status)}
                    <span className="text-sm text-gray-500">
                      Soumis le {formatDate(selectedDemande.createdAt)}
                    </span>
                  </div>
                </div>

                {selectedDemande.status === "EN_ATTENTE" && (
                  <div className="flex gap-4">
                    {!isEditing ? (
                      <>
                        <button
                          onClick={handleApprove}
                          className="flex-1 bg-green-600 text-white py-3 px-6 rounded hover:bg-green-700 transition duration-200 font-semibold flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Approuver
                        </button>
                        <button
                          onClick={() => {
                          handleRefuse() ,
                          closeModal();
                          }}
                          className="flex-1 bg-red-600 text-white py-3 px-6 rounded hover:bg-red-700 transition duration-200 font-semibold flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-5 h-5" />
                          Rejeter
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleValidateApproval}
                          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded hover:bg-blue-700 transition duration-200 font-semibold flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Valider l'approbation
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="flex-1 bg-gray-600 text-white py-3 px-6 rounded hover:bg-gray-700 transition duration-200 font-semibold"
                        >
                          Annuler
                        </button>
                      </>
                    )}
                  </div>
                )}

                {selectedDemande.status !== "EN_ATTENTE" && (
                  <button
                    onClick={closeModal}
                    className="w-full bg-gray-600 text-white py-3 px-6 rounded hover:bg-gray-700 transition duration-200"
                  >
                    Fermer
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
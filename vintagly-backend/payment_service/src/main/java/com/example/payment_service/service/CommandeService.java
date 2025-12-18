package com.example.payment_service.service;

import com.example.payment_service.entity.Commande;

public interface CommandeService {
    // valider une commande existante (id = idCommande) pour l'utilisateur connecté
    Commande validerCommande(Long idCommande, String userId);
    Commande creerCommandeDepuisPanier(String userId);
    Commande getCommandeById(Long id, String userId);


}

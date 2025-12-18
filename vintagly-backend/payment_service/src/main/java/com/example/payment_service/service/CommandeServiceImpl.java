package com.example.payment_service.service;

import com.example.payment_service.DTOs.PanierResponseDTO;
import com.example.payment_service.clients.PanierClient;
import com.example.payment_service.entity.Commande;
import com.example.payment_service.entity.StatutCommande;
import com.example.payment_service.repository.CommandeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CommandeServiceImpl implements CommandeService {

    private final CommandeRepository commandeRepository;
    private final PanierClient panierClient;

    @Override
    public Commande creerCommandeDepuisPanier(String userId) {

        // ✅ Récupérer le panier de l'utilisateur via Feign
        PanierResponseDTO panier = panierClient.getPanierUtilisateurConnecte();

        if (panier == null || Boolean.FALSE.equals(panier.getEtat())) {
            throw new RuntimeException("Panier introuvable ou invalide");
        }

        if (!panier.getIdUtilisateur().equals(userId)) {
            throw new RuntimeException("Ce panier ne vous appartient pas");
        }

        if (panier.getArticles() == null || panier.getArticles().isEmpty()) {
            throw new RuntimeException("Le panier est vide");
        }

        // ✅ MODIFICATION : Vérifier si une commande existe déjà
        Optional<Commande> commandeExistante = commandeRepository.findByIdPanier(panier.getId());

        if (commandeExistante.isPresent()) {
            Commande existing = commandeExistante.get();

            // Si la commande existe et est déjà payée/validée, on refuse
            if (existing.getStatut() == StatutCommande.PAYEE ||
                    existing.getStatut() == StatutCommande.VALIDEE) {
                throw new IllegalStateException(
                        "Ce panier a déjà été commandé et payé. Veuillez créer un nouveau panier."
                );
            }

            // Si la commande existe mais est EN_ATTENTE, on la retourne (permet de réessayer le paiement)
            System.out.println("Commande en attente trouvée, réutilisation : " + existing.getId());
            return existing;
        }

        // ✅ Calculer le montant total
        double montantTotal = panier.getArticles().stream()
                .mapToDouble(article -> article.getPrix())
                .sum();

        // ✅ Créer une nouvelle commande
        Commande commande = Commande.builder()
                .idPanier(panier.getId())
                .idUtilisateur(userId)
                .montantTotal(montantTotal)
                .statut(StatutCommande.EN_ATTENTE)
                .dateCreation(LocalDateTime.now())
                .build();

        return commandeRepository.save(commande);
    }

    @Override
    public Commande validerCommande(Long idCommande, String userId) {

        Commande existing = commandeRepository.findById(idCommande)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        if (!Objects.equals(existing.getIdUtilisateur(), userId)) {
            throw new RuntimeException("Vous n'êtes pas autorisé à valider cette commande");
        }

        if (existing.getStatut() == StatutCommande.VALIDEE ||
                existing.getStatut() == StatutCommande.PAYEE) {
            throw new RuntimeException("Commande déjà validée ou payée");
        }

        // ✅ Récupérer à nouveau le panier pour vérifier
        PanierResponseDTO panier = panierClient.getPanierUtilisateurConnecte();

        if (panier == null || Boolean.FALSE.equals(panier.getEtat())) {
            throw new RuntimeException("Panier introuvable ou invalide");
        }

        // ✅ Recalculer le montant total
        double montantTotal = panier.getArticles().stream()
                .mapToDouble(article -> article.getPrix())
                .sum();

        existing.setMontantTotal(montantTotal);
        existing.setStatut(StatutCommande.VALIDEE);
        existing.setDateValidation(LocalDateTime.now());

        return commandeRepository.save(existing);
    }

    @Override
    public Commande getCommandeById(Long id, String userId) {

        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        if (!Objects.equals(commande.getIdUtilisateur(), userId)) {
            throw new RuntimeException("Non autorisé");
        }

        return commande;
    }
}
package com.example.panier_service.service;

import com.example.panier_service.entity.Panier;
import com.example.panier_service.entity.PanierItem;
import com.example.panier_service.repository.PanierRepository;
import com.example.panier_service.repository.PanierItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class PanierServiceImpl implements PanierService {

    private final PanierRepository panierRepository;
    private final PanierItemRepository panierItemRepository;

    public PanierServiceImpl(PanierRepository panierRepository, PanierItemRepository panierItemRepository) {
        this.panierRepository = panierRepository;
        this.panierItemRepository = panierItemRepository;
    }

    @Override
    public Panier createPanier(Long userId) {
        // Check if user already has an active panier
        return panierRepository.findByIdUtilisateurAndEtat(userId, true)
                .orElseGet(() -> {
                    Panier panier = Panier.builder()
                            .idUtilisateur(userId)
                            .dateValidation(LocalDate.now())
                            .etat(true)
                            .build();
                    return panierRepository.save(panier);
                });
    }

    @Override
    public Panier addArticle(Long panierId, Long articleId) {
        Panier panier = panierRepository.findById(panierId)
                .orElseThrow(() -> new RuntimeException("Panier not found"));

        PanierItem item = PanierItem.builder()
                .articleId(articleId)
                .panier(panier)
                .build();
        panierItemRepository.save(item);

        return panier;
    }

    @Override
    public Panier removeArticle(Long panierId, Long articleId) {
        List<PanierItem> items = panierItemRepository.findByPanierId(panierId);
        items.stream()
                .filter(i -> i.getArticleId().equals(articleId))
                .findFirst()
                .ifPresent(panierItemRepository::delete);

        return panierRepository.findById(panierId)
                .orElseThrow(() -> new RuntimeException("Panier not found"));
    }

    @Override
    public Panier getPanier(Long panierId) {
        return panierRepository.findById(panierId)
                .orElseThrow(() -> new RuntimeException("Panier not found"));
    }
}

package com.example.panier_service.service;

import com.example.panier_service.dto.ArticleDTO;
import com.example.panier_service.dto.CatalogueArticleResponse;
import com.example.panier_service.dto.PanierResponseDTO;
import com.example.panier_service.entity.Panier;
import com.example.panier_service.entity.PanierItem;
import com.example.panier_service.repository.PanierRepository;
import com.example.panier_service.repository.PanierItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.panier_service.clients.ArticleClient;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class PanierServiceImpl implements PanierService {

    private final PanierRepository panierRepository;
    private final PanierItemRepository panierItemRepository;
    private final ArticleClient articleClient;

    public PanierServiceImpl(PanierRepository panierRepository,
                             PanierItemRepository panierItemRepository,
                             ArticleClient articleClient) {
        this.panierRepository = panierRepository;
        this.panierItemRepository = panierItemRepository;
        this.articleClient = articleClient;
    }

    @Override
    public Panier createPanier(Long userId) {
        return panierRepository.findByIdUtilisateurAndEtat(userId, true)
                .orElseGet(() -> {
                    Panier panier = Panier.builder()
                            .idUtilisateur(userId)
                            .etat(true)
                            .dateValidation(LocalDate.now())
                            .build();
                    return panierRepository.save(panier);
                });
    }

    @Override
    public Panier addArticle(Long panierId, Long articleId) {
        Panier panier = panierRepository.findById(panierId)
                .orElseThrow(() -> new RuntimeException("Panier introuvable"));

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
                .orElseThrow(() -> new RuntimeException("Panier introuvable"));
    }

    @Override
    public PanierResponseDTO getPanier(Long panierId) {
        Panier panier = panierRepository.findById(panierId)
                .orElseThrow(() -> new RuntimeException("Panier introuvable"));

        // Convert to DTO
        PanierResponseDTO dto = new PanierResponseDTO();
        dto.setId(panier.getId());
        dto.setIdUtilisateur(panier.getIdUtilisateur());
        dto.setEtat(panier.getEtat());

        List<ArticleDTO> articleDTOs = panier.getItems().stream().map(item -> {
            CatalogueArticleResponse response = articleClient.getArticleById(item.getArticleId());

            ArticleDTO a = new ArticleDTO();
            a.setId(response.getId());
            a.setNom(response.getNom());
            a.setPrix(response.getPrix());

            // keep only first image
            if (response.getImages() != null && !response.getImages().isEmpty()) {
                a.setImage(response.getImages().get(0).getPath());
            }

            return a;
        }).toList();

        dto.setArticles(articleDTOs);
        return dto;
    }
}

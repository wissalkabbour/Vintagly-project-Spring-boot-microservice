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
    public Panier createPanier(String userId) {
        return panierRepository.findByIdUtilisateurAndEtat(userId, true)
                .orElseGet(() -> panierRepository.save(
                        Panier.builder()
                                .idUtilisateur(userId)
                                .etat(true)
                                .dateValidation(LocalDate.now())
                                .build()
                ));
    }

    @Override
    public Panier addArticle(String userId, Long articleId) {

        // get or create user's active panier
        Panier panier = createPanier(userId);

        PanierItem item = PanierItem.builder()
                .articleId(articleId)
                .panier(panier)
                .build();

        panierItemRepository.save(item);
        return panier;
    }

    @Override
    public Panier removeArticle(String userId, Long articleId) {

        Panier panier = panierRepository.findByIdUtilisateurAndEtat(userId, true)
                .orElseThrow(() -> new RuntimeException("Panier introuvable"));

        panierItemRepository.findByPanierId(panier.getId())
                .stream()
                .filter(item -> item.getArticleId().equals(articleId))
                .findFirst()
                .ifPresent(panierItemRepository::delete);

        // reload from DB
        return panierRepository.findById(panier.getId())
                .orElseThrow(() -> new RuntimeException("Panier introuvable"));
    }

    @Override
    public PanierResponseDTO getPanier(String userId) {

        Panier panier = panierRepository.findByIdUtilisateurAndEtat(userId, true)
                .orElseThrow(() -> new RuntimeException("Panier introuvable"));

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
            if (response.getImages() != null && !response.getImages().isEmpty()) {
                a.setImage(response.getImages().get(0).getPath());
            }
            return a;
        }).toList();

        dto.setArticles(articleDTOs);
        return dto;
    }
}

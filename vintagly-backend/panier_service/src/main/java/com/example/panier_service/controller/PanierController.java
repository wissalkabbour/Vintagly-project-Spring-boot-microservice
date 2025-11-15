package com.example.panier_service.controller;

import com.example.panier_service.dto.PanierResponseDTO;
import com.example.panier_service.entity.Panier;
import com.example.panier_service.service.PanierService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/paniers")
public class PanierController {

    private final PanierService panierService;

    public PanierController(PanierService panierService) {
        this.panierService = panierService;
    }

    @PostMapping("/{userId}")
    public Panier createPanier(@PathVariable Long userId) {
        return panierService.createPanier(userId);
    }

    @PostMapping("/{panierId}/articles/{articleId}")
    public Panier addArticle(@PathVariable Long panierId, @PathVariable Long articleId) {
        return panierService.addArticle(panierId, articleId);
    }

    @DeleteMapping("/{panierId}/articles/{articleId}")
    public Panier removeArticle(@PathVariable Long panierId, @PathVariable Long articleId) {
        return panierService.removeArticle(panierId, articleId);
    }

    @GetMapping("/{panierId}")
    public PanierResponseDTO getPanier(@PathVariable Long panierId) {
        return panierService.getPanier(panierId);
    }

}

package com.example.panier_service.controller;

import com.example.panier_service.dto.PanierResponseDTO;
import com.example.panier_service.entity.Panier;
import com.example.panier_service.security.SecurityUtils;
import com.example.panier_service.service.PanierService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/paniers")
@PreAuthorize("hasRole('customer')")
public class PanierController {

    private final PanierService panierService;

    public PanierController(PanierService panierService) {
        this.panierService = panierService;
    }

    // 🔐 crée un panier pour l'utilisateur connecté (PAS de userId dans l'URL)
    @PostMapping("/create")
    public Panier createPanier() {
        String userId = SecurityUtils.getUserIdFromToken();
        return panierService.createPanier(userId);
    }

    // 🔐 ajoute un article au panier de l'utilisateur connecté
    @PostMapping("/articles/{articleId}")
    public Panier addArticle(@PathVariable Long articleId) {
        String userId = SecurityUtils.getUserIdFromToken();
        return panierService.addArticle(userId, articleId);
    }

    // 🔐 supprime un article du panier de l'utilisateur connecté
    @DeleteMapping("/articles/{articleId}")
    public Panier removeArticle(@PathVariable Long articleId) {
        String userId = SecurityUtils.getUserIdFromToken();
        return panierService.removeArticle(userId, articleId);
    }

    // 🔐 récupère le panier de l'utilisateur connecté
    @GetMapping
    public PanierResponseDTO getPanier() {
        String userId = SecurityUtils.getUserIdFromToken();
        return panierService.getPanier(userId);
    }
}

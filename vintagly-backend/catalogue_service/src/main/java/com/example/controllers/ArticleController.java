package com.example.controllers;

import com.example.entities.Article;
import com.example.services.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/catalogue/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;

    /**
     * ➕ Ajouter un article (ADMIN seulement)
     */
    @PreAuthorize("hasAuthority('admin')")
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Map<String, String>> addArticle(
            @RequestParam("nom") String nom,
            @RequestParam("description") String description,
            @RequestParam("historique") String historique,
            @RequestParam("prix") Double prix,
            @RequestParam("productLifecycle") String productLifecycle,
            @RequestParam(value = "idVendeur", required = false) Long idVendeur,
            @RequestParam("categorieId") Long categorieId,
            @RequestParam(value = "certificat", required = false) MultipartFile certificatFile,
            @RequestParam("images") List<MultipartFile> images
    ) {
        Map<String, String> response = new HashMap<>();

        try {
            Article article = new Article();
            article.setNom(nom);
            article.setDescription(description);
            article.setHistorique(historique);
            article.setPrix(prix);
            article.setProductLifecycle(productLifecycle);
            article.setIdVendeur(idVendeur);
            articleService.addArticle(article, categorieId, certificatFile, images);

            response.put("message", "✅ Article ajouté avec succès !");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IOException e) {
            response.put("message", "❌ Erreur lors de l'ajout : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 📜 Lister tous les articles (ADMIN + CUSTOMER)
     */
    @GetMapping
    public ResponseEntity<List<Article>> getAllArticles() {
        return ResponseEntity.ok(articleService.getAllArticles());
    }

    /**
     * 🔍 Afficher un article par ID (ADMIN + CUSTOMER)
     */
    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable Long id) {
        return ResponseEntity.ok(articleService.getArticleById(id));
    }

    /**
     * ✏️ Modifier un article (ADMIN seulement)
     */
    @PreAuthorize("hasAuthority('admin')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateArticle(
            @PathVariable Long id,
            @RequestBody Article updatedArticle
    ) {
        articleService.updateArticle(id, updatedArticle);
        return ResponseEntity.ok(Map.of("message", "✅ Article mis à jour avec succès !"));
    }

    /**
     * ❌ Supprimer un article (ADMIN seulement)
     */
    @PreAuthorize("hasAuthority('admin')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteArticle(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();

        try {
            articleService.deleteArticle(id);
            response.put("message", "🗑️ Article supprimé avec succès !");
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            response.put("message", "❌ Erreur : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}

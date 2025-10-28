package com.example.controllers;

import com.example.entities.Article;
import com.example.repositories.ArticleRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/articles")
@CrossOrigin(origins = "*")
public class ArticleDemandeController {

    private final ArticleRepository articleRepository;

    public ArticleDemandeController(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    @PostMapping
    public ResponseEntity<Article> addArticleDemande(@RequestBody Article article) {
        Article saved = articleRepository.save(article);
        return ResponseEntity.ok(saved);
    }

    // 🔹 Récupérer un article par ID (optionnel mais pratique)
    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticle(@PathVariable Long id) {
        return articleRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

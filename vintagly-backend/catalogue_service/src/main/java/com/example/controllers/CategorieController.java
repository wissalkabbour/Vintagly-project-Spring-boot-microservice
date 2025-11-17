package com.example.controllers;

import com.example.entities.Categorie;
import com.example.services.CategorieService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/catalogue/categories")
@RequiredArgsConstructor
public class CategorieController {

    private final CategorieService categorieService;

    /**
     * ➕ Ajouter une catégorie (ADMIN seulement)
     */
    @PreAuthorize("hasAuthority('admin')")
    @PostMapping
    public ResponseEntity<Categorie> addCategorie(@RequestBody Categorie categorie) {
        return ResponseEntity.ok(categorieService.addCategorie(categorie));
    }

    /**
     * 📜 Lister les catégories (ADMIN + CUSTOMER)
     */
    @PreAuthorize("hasAnyAuthority('admin', 'customer')")
    @GetMapping
    public ResponseEntity<List<Categorie>> getAllCategories() {
        return ResponseEntity.ok(categorieService.getAllCategories());
    }

    /**
     * ❌ Supprimer une catégorie (ADMIN seulement)
     */
    @PreAuthorize("hasAuthority('admin')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteCategorie(@PathVariable Long id) {

        Map<String, String> response = new HashMap<>();

        try {
            categorieService.deleteCategorie(id);
            response.put("message", "🗑️ Catégorie supprimée avec succès !");
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            response.put("message", "❌ Erreur : " + e.getMessage());
            return ResponseEntity.status(404).body(response);
        }
    }
}

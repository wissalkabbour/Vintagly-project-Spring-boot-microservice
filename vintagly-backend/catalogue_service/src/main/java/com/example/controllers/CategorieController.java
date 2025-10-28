package com.example.controllers;

import com.example.entities.Categorie;
import com.example.services.CategorieService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/catalogue/categories")
@RequiredArgsConstructor
@CrossOrigin("*")
public class CategorieController {

    private final CategorieService categorieService;

    @PostMapping
    public ResponseEntity<Categorie> addCategorie(@RequestBody Categorie categorie) {
        return ResponseEntity.ok(categorieService.addCategorie(categorie));
    }

    @GetMapping
    public ResponseEntity<List<Categorie>> getAllCategories() {
        return ResponseEntity.ok(categorieService.getAllCategories());
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteCategorie(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();
        try {
            categorieService.deleteCategorie(id);
            response.put("message", "🗑️ Catégorie supprimée avec succès !");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("message", "❌ Erreur : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}

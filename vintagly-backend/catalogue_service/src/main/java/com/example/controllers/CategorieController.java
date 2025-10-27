package com.example.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.entities.Categorie;
import com.example.repositories.CategorieRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // autorise ton frontend
public class CategorieController {

    private final CategorieRepository categorieRepository; // final + constructor automatique

    @GetMapping
    public List<Categorie> getCategories() {
        return categorieRepository.findAll();
    }

    // @GetMapping("/names")
    // public List<String> getCategoryNames() {
    //     return categorieRepository.findAll()
    //             .stream()
    //             .map(Categorie::getNom)
    //             .toList();
    // }
}

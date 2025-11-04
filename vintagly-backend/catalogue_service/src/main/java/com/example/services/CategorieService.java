package com.example.services;

import com.example.entities.Categorie;
import com.example.repositories.CategorieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategorieService {

    private final CategorieRepository categorieRepository;

    public Categorie addCategorie(Categorie categorie) {
        return categorieRepository.save(categorie);
    }

    public List<Categorie> getAllCategories() {
        return categorieRepository.findAll();
    }


    public void deleteCategorie(Long id) {
    if (!categorieRepository.existsById(id)) {
        throw new RuntimeException("Catégorie introuvable");
    }
    categorieRepository.deleteById(id);
}

}

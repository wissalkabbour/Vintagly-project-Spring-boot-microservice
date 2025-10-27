package com.example.repositories;


import com.example.entities.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {

    // Optionnel : retrouver toutes les images liées à une demande
    List<Image> findByDemandeId(Long demandeId);

    // Optionnel : retrouver toutes les images liées à un article
    List<Image> findByArticleId(Long articleId);
}

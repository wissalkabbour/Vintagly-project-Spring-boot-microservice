package com.example.services;

import com.example.entities.Article;
import com.example.entities.Categorie;
import com.example.entities.Image;
import com.example.repositories.ArticleRepository;
import com.example.repositories.CategorieRepository;
import com.example.repositories.ImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final ImageRepository imageRepository;
    private final CategorieRepository categorieRepository;

@Value("${upload.dir}")
private String uploadDir;

public Article addArticle(Article article, Long categorieId,
                          MultipartFile certificatFile,
                          List<MultipartFile> imageFiles) throws IOException {

    // 1️⃣ Récupération de la catégorie
    Categorie categorie = categorieRepository.findById(categorieId)
            .orElseThrow(() -> new RuntimeException("Catégorie introuvable"));
    article.setCategorie(categorie);

    // 2️⃣ Date de publication
    article.setDateDePub(LocalDate.now());

    // 3️⃣ Trouver le chemin du microservice et le décoder proprement
    String rawPath = ArticleService.class
            .getProtectionDomain()
            .getCodeSource()
            .getLocation()
            .getPath();

    // 🔧 Décoder les caractères spéciaux (%20 → espace)
    String decodedPath = URLDecoder.decode(rawPath, StandardCharsets.UTF_8);

    // Remonter jusqu’à la racine du microservice
    String basePath = new File(decodedPath)
            .getParentFile()  // target/classes
            .getParentFile()  // racine du microservice
            .getAbsolutePath();

    // Créer le chemin final "uploads"
    File uploadPath = new File(basePath, uploadDir);
    if (!uploadPath.exists() && !uploadPath.mkdirs()) {
        throw new IOException("Impossible de créer le dossier d'upload : " + uploadPath.getAbsolutePath());
    }

    // 4️⃣ Sauvegarde du certificat
    if (certificatFile != null && !certificatFile.isEmpty()) {
        String certFileName = System.currentTimeMillis() + "_" + certificatFile.getOriginalFilename();
        File certDest = new File(uploadPath, certFileName);
        certificatFile.transferTo(certDest);
        article.setCertificat("/uploads/" + certFileName);
    }

    // 5️⃣ Sauvegarde de l’article
    Article savedArticle = articleRepository.save(article);

    // 6️⃣ Sauvegarde des images
    if (imageFiles != null && !imageFiles.isEmpty()) {
        List<Image> images = new ArrayList<>();
        for (MultipartFile file : imageFiles) {
            if (!file.isEmpty()) {
                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                File destFile = new File(uploadPath, fileName);
                file.transferTo(destFile);

                Image image = new Image();
                image.setPath("/uploads/" + fileName);
                image.setArticle(savedArticle);
                images.add(image);
            }
        }
        imageRepository.saveAll(images);
        savedArticle.setImages(images);
    }

    return savedArticle;
}

    // 🔹 Récupérer tous les articles
    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    // 🔹 Récupérer un article par ID
    public Article getArticleById(Long id) {
        return articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article introuvable"));
    }

    // 🔹 Modifier un article
    public Article updateArticle(Long id, Article updatedArticle) {
    // 🔹 Récupérer l’article existant
    Article existing = articleRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Article introuvable"));

    // 🔹 Mettre à jour les champs simples
    existing.setNom(updatedArticle.getNom());
    existing.setDescription(updatedArticle.getDescription());
    existing.setHistorique(updatedArticle.getHistorique());
    existing.setPrix(updatedArticle.getPrix());
    existing.setProductLifecycle(updatedArticle.getProductLifecycle());
    existing.setIdVendeur(updatedArticle.getIdVendeur());

    // 🔹 Mettre à jour la catégorie (sans vérification)
    if (updatedArticle.getCategorie() != null) {
        existing.setCategorie(updatedArticle.getCategorie());
    }

    // 🔹 Sauvegarder et retourner l’article mis à jour
    return articleRepository.save(existing);
}


    // 🔹 Supprimer un article
    public void deleteArticle(Long id) {
        if (!articleRepository.existsById(id)) {
            throw new RuntimeException("Article introuvable");
        }
        articleRepository.deleteById(id);
    }
}

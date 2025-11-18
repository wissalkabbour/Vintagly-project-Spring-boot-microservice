package com.example.controllers;

import com.example.entities.Article;
import com.example.entities.Image;
import com.example.repositories.ArticleRepository;
import com.example.repositories.ImageRepository;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/catalogue/images")
@CrossOrigin(origins = "http://localhost:5173") 

public class ImageController {

    private final ImageRepository imageRepository;
    private final ArticleRepository articleRepository; // 🔹 ajouté

    public ImageController(ImageRepository imageRepository, ArticleRepository articleRepository) {
        this.imageRepository = imageRepository;
        this.articleRepository = articleRepository;
    }

   @PostMapping("/upload")
public ResponseEntity<Image> uploadImage(
        @RequestParam("file") MultipartFile file,
        @RequestParam("demandeId") Long demandeId
) throws IOException {

    if (file != null && !file.isEmpty()) {
        // Récupération du chemin du microservice
        String decodedPath = URLDecoder.decode(
                this.getClass().getProtectionDomain().getCodeSource().getLocation().getPath(),
                StandardCharsets.UTF_8
        );

        String basePath = new File(decodedPath)
                .getParentFile()  // target
                .getParentFile()  // racine du microservice
                .getAbsolutePath();

        // Dossier uploads dans resources
        File uploadPath = new File(basePath, "src/main/resources/static/uploads");
        if (!uploadPath.exists() && !uploadPath.mkdirs()) {
            throw new IOException("Impossible de créer le dossier d'upload : " + uploadPath.getAbsolutePath());
        }

        // Nettoyage et génération du nom de fichier
        String cleanFileName = file.getOriginalFilename().replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
        String finalFileName = System.currentTimeMillis() + "_" + cleanFileName;

        // Sauvegarde physique du fichier
        File dest = new File(uploadPath, finalFileName);
        file.transferTo(dest);

        // Sauvegarde en base
        Image image = new Image();
        image.setPath("/uploads/" + finalFileName); // chemin HTTP
        image.setDemandeId(demandeId);
        imageRepository.save(image);

        return ResponseEntity.ok(image);
    } else {
        return ResponseEntity.badRequest().build();
    }
}



    @PutMapping("/updateByDemande/{demandeId}/{articleId}")
    public ResponseEntity<String> updateImagesByDemande(
            @PathVariable Long demandeId,
            @PathVariable Long articleId) {

        List<Image> images = imageRepository.findByDemandeId(demandeId);
        if (images.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Article article = articleRepository.findById(articleId).orElse(null);
        if (article == null) {
            return ResponseEntity.badRequest().body("Article introuvable avec l'ID : " + articleId);
        }

        for (Image img : images) {
            img.setArticle(article);
            imageRepository.save(img);
        }

        return ResponseEntity.ok("Images mises à jour avec l'articleId: " + articleId);
    }

   @GetMapping("/demande/{demandeId}")
public ResponseEntity<List<Image>> getImagesByDemande(@PathVariable Long demandeId) {
    List<Image> images = imageRepository.findByDemandeId(demandeId);
    return ResponseEntity.ok(images);
}

}
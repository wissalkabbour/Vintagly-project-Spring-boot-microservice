package com.example.controllers;

import com.example.entities.Article;
import com.example.entities.Image;
import com.example.repositories.ArticleRepository;
import com.example.repositories.ImageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
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
        Path uploadDir = Paths.get(System.getProperty("user.dir"), "src", "main", "resources", "uploads");
        Files.createDirectories(uploadDir);

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadDir.resolve(fileName);
        file.transferTo(filePath.toFile());

        Image image = new Image();
        image.setPath("/uploads/" + fileName);
        image.setDemandeId(demandeId);
        image.setArticle(null);

        Image saved = imageRepository.save(image);
        System.out.println(" Image enregistrée pour demande " + demandeId);
        return ResponseEntity.ok(saved);
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
package com.example.controllers;

import com.example.entities.Image;
import com.example.repositories.ImageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    private final ImageRepository imageRepository;

    public ImageController(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
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

        System.out.println("✅ Image enregistrée pour demande " + demandeId);
        return ResponseEntity.ok(saved);
    }
}

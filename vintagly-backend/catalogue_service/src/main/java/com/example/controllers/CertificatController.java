package com.example.controllers;
import com.example.entities.Article;
import com.example.entities.Image;
import com.example.repositories.ArticleRepository;
import com.example.repositories.ImageRepository;
import com.example.service.CertificatService;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;


@RestController
@RequestMapping("/api/catalogue/certificats")
public class CertificatController {

    @Autowired
    private CertificatService certificatService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadCertificat(
            @RequestParam("file") MultipartFile file,
            @RequestParam("demandeId") Long demandeId
    ) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Fichier vide");
        }

        try {
            String storedPath = certificatService.storeCertificat(file, demandeId);
            return ResponseEntity.ok(storedPath);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'upload du certificat");
        }
    }
}

package com.example.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@Service
public class CertificatService {

    public String storeCertificat(MultipartFile file, Long demandeId) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IOException("Fichier vide");
        }

        // Chemin du microservice
        String decodedPath = URLDecoder.decode(
                this.getClass().getProtectionDomain().getCodeSource().getLocation().getPath(),
                StandardCharsets.UTF_8
        );

        String basePath = new File(decodedPath)
                .getParentFile()  
                .getParentFile()  
                .getAbsolutePath();

        // Dossier uploads/certificats dans resources
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

        System.out.println("Certificat enregistré : " + dest.getAbsolutePath());
        return "/uploads/" + finalFileName;
    }
}

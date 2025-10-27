package com.example.demande_service.controller;

import com.example.demande_service.entity.Demande;
import com.example.demande_service.entity.EtatDemande;
import com.example.demande_service.service.DemandeService;

import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

@RestController
@RequestMapping("/api/demandes")
public class DemandeController {

    private final DemandeService service;

    public DemandeController(DemandeService service) {
        this.service = service;
    }

    // @PostMapping("/add")
    // public ResponseEntity<Demande> addDemande(
    //         @RequestParam String nom,
    //         @RequestParam String description,
    //         @RequestParam String historique,
    //         @RequestParam(required = false) Double prix,
    //         @RequestParam Long idUtilisateur,
    //         @RequestParam("certificat") MultipartFile certificatFile
    // ) throws IOException {

    //     Demande demande = new Demande();
    //     demande.setNom(nom);
    //     demande.setDescription(description);
    //     demande.setHistorique(historique);
    //     demande.setPrix(prix);
    //     demande.setIdUtilisateur(idUtilisateur);
    //     demande.setEtat(EtatDemande.EN_ATTENTE);

    //     // 📍 Déterminer dynamiquement la racine du microservice
    //     String decodedPath = URLDecoder.decode(
    //             this.getClass().getProtectionDomain().getCodeSource().getLocation().getPath(),
    //             StandardCharsets.UTF_8
    //     );

    //     // Remonter jusqu’à la racine du microservice (ex: demande-service)
    //     String basePath = new File(decodedPath)
    //             .getParentFile()  // target
    //             .getParentFile()  // racine du microservice
    //             .getAbsolutePath();

    //     // 📁 Dossier d’upload
    //     File uploadPath = new File(basePath, "src/main/resources/uploads");
    //     if (!uploadPath.exists() && !uploadPath.mkdirs()) {
    //         throw new IOException("❌ Impossible de créer le dossier d'upload : " + uploadPath.getAbsolutePath());
    //     }

    //     // 📄 Sauvegarder le certificat
    //     if (certificatFile != null && !certificatFile.isEmpty()) {
    //         String cleanFileName = certificatFile.getOriginalFilename().replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
    //         String finalFileName = System.currentTimeMillis() + "_" + cleanFileName;
    //         File certDest = new File(uploadPath, finalFileName);

    //         certificatFile.transferTo(certDest);

    //         // chemin relatif pour l'API
    //         demande.setCertificat("/uploads/" + finalFileName);

    //         System.out.println("✅ Fichier enregistré ici : " + certDest.getAbsolutePath());
    //     }

    //     // Sauvegarde en base
    //     Demande saved = service.addDemande(demande);
    //     return ResponseEntity.ok(saved);
    // }
    @PostMapping("/add")
public ResponseEntity<Demande> addDemande(
        @RequestParam String nom,
        @RequestParam String description,
        @RequestParam String historique,
        @RequestParam(required = false) Double prix,
        @RequestParam Long idUtilisateur,
        @RequestParam("certificat") MultipartFile certificatFile,
        @RequestParam(value = "images", required = false) MultipartFile[] imageFiles
) throws IOException {

    // 🔹 1. Créer la demande
    Demande demande = new Demande();
    demande.setNom(nom);
    demande.setDescription(description);
    demande.setHistorique(historique);
    demande.setPrix(prix);
    demande.setIdUtilisateur(idUtilisateur);
    demande.setEtat(EtatDemande.EN_ATTENTE);

    // 🔹 2. Stocker le certificat localement
    if (certificatFile != null && !certificatFile.isEmpty()) {
        String decodedPath = URLDecoder.decode(
                this.getClass().getProtectionDomain().getCodeSource().getLocation().getPath(),
                StandardCharsets.UTF_8
        );

        String basePath = new File(decodedPath)
                .getParentFile()  // target
                .getParentFile()  // racine du microservice
                .getAbsolutePath();

        File uploadPath = new File(basePath, "src/main/resources/uploads");
        if (!uploadPath.exists() && !uploadPath.mkdirs()) {
            throw new IOException("Impossible de créer le dossier d'upload : " + uploadPath.getAbsolutePath());
        }

        String cleanFileName = certificatFile.getOriginalFilename().replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
        String finalFileName = System.currentTimeMillis() + "_" + cleanFileName;
        File certDest = new File(uploadPath, finalFileName);
        certificatFile.transferTo(certDest);

        demande.setCertificat("/uploads/" + finalFileName);
        System.out.println("✅ Certificat enregistré ici : " + certDest.getAbsolutePath());
    }

    // 🔹 3. Sauvegarder la demande
    Demande savedDemande = service.addDemande(demande);

    // 🔹 4. Envoyer les images au catalogue-service
    if (imageFiles != null && imageFiles.length > 0) {
        RestTemplate restTemplate = new RestTemplate();
        for (MultipartFile imageFile : imageFiles) {
            String url = "http://localhost:8081/api/images/upload";

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new org.springframework.core.io.ByteArrayResource(imageFile.getBytes()) {
                @Override
                public String getFilename() {
                    return imageFile.getOriginalFilename();
                }
            });
            body.add("demandeId", savedDemande.getId());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            restTemplate.postForEntity(url, requestEntity, String.class);
        }
    }

    return ResponseEntity.ok(savedDemande);
}

}

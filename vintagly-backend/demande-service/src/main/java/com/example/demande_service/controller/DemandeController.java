package com.example.demande_service.controller;

import com.example.demande_service.entity.Demande;
import com.example.demande_service.entity.Era;
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
import java.util.HashMap;
import java.util.Map;

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

    //     //  Déterminer dynamiquement la racine du microservice
    //     String decodedPath = URLDecoder.decode(
    //             this.getClass().getProtectionDomain().getCodeSource().getLocation().getPath(),
    //             StandardCharsets.UTF_8
    //     );

    //     // Remonter jusqu’à la racine du microservice (ex: demande-service)
    //     String basePath = new File(decodedPath)
    //             .getParentFile()  // target
    //             .getParentFile()  // racine du microservice
    //             .getAbsolutePath();

    //     
    //     File uploadPath = new File(basePath, "src/main/resources/uploads");
    //     if (!uploadPath.exists() && !uploadPath.mkdirs()) {
    //         throw new IOException(" Impossible de créer le dossier d'upload : " + uploadPath.getAbsolutePath());
    //     }

    //     
    //     if (certificatFile != null && !certificatFile.isEmpty()) {
    //         String cleanFileName = certificatFile.getOriginalFilename().replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
    //         String finalFileName = System.currentTimeMillis() + "_" + cleanFileName;
    //         File certDest = new File(uploadPath, finalFileName);

    //         certificatFile.transferTo(certDest);

    //         // chemin relatif pour l'API
    //         demande.setCertificat("/uploads/" + finalFileName);

    //         System.out.println(" Fichier enregistré ici : " + certDest.getAbsolutePath());
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
        @RequestParam(value = "images", required = false) MultipartFile[] imageFiles,
 @RequestParam(value = "era", required = false) String era // nom unique Era
) throws IOException {

    Demande demande = new Demande();
    demande.setNom(nom);
    demande.setDescription(description);
    demande.setHistorique(historique);
    demande.setPrix(prix);
    demande.setIdUtilisateur(idUtilisateur);
    demande.setEtat(EtatDemande.EN_ATTENTE);
    if (era!= null && !era.isEmpty()) {
        try {
            demande.setEras(Era.valueOf(era));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null); // valeur invalide
        }
    }


    //  Stocker le certificat localement
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
        System.out.println(" Certificat enregistré ici : " + certDest.getAbsolutePath());
    }

    //  Sauvegarder la demande
    Demande savedDemande = service.addDemande(demande);

    //  Envoyer les images au catalogue-service
    if (imageFiles != null && imageFiles.length > 0) {
        RestTemplate restTemplate = new RestTemplate();
        for (MultipartFile imageFile : imageFiles) {
            String url = "http://localhost:8084/api/images/upload";

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

@PutMapping("/valider/{id}")
public ResponseEntity<String> validerDemande(
        @PathVariable Long id,
        @RequestBody Map<String, Object> updatedFields) {

    //  Récupérer la demande originale
    Demande demande = service.getDemandeById(id);
    if (demande == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Demande non trouvée avec l'ID : " + id);
    }

    // 🔹 2. Préparer les valeurs pour l'article (sans modifier la demande en DB)
    String articleNom = updatedFields.containsKey("nom") ? (String) updatedFields.get("nom") : demande.getNom();
    String articleDescription = updatedFields.containsKey("description") ? (String) updatedFields.get("description") : demande.getDescription();
    String articleHistorique = updatedFields.containsKey("historique") ? (String) updatedFields.get("historique") : demande.getHistorique();
    Double articlePrix = updatedFields.containsKey("prix") ? ((Number) updatedFields.get("prix")).doubleValue() : demande.getPrix();
    Era articleEra = null;
    if (updatedFields.containsKey("era")) {
        try {
            articleEra = Era.valueOf((String) updatedFields.get("era"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Valeur de era invalide : " + updatedFields.get("eras"));
        }
    }

    // 🔹 3. Mettre la demande à l'état ACCEPTÉE
    demande.setEtat(EtatDemande.ACCEPTEE);
    service.updateDemande(demande);

    try {
        RestTemplate restTemplate = new RestTemplate();

        // 🔹 4. Créer l'article dans le catalogue-service avec les nouvelles valeurs + certificat
        String urlArticle = "http://localhost:8084/api/articles";

        Map<String, Object> articleData = new HashMap<>();
        articleData.put("nom", articleNom);
        articleData.put("description", articleDescription);
        articleData.put("prix", articlePrix);
        articleData.put("demandeId", demande.getId());
        articleData.put("certificat", demande.getCertificat());
        if (articleEra != null) {
            articleData.put("eras", articleEra.name());
        }
        articleData.put("historique", articleHistorique);

        ResponseEntity<Map> response = restTemplate.postForEntity(urlArticle, articleData, Map.class);

        // 🔹 5. Mettre à jour les images liées si l'article est créé
        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            Long articleId = Long.valueOf(response.getBody().get("id").toString());

            String urlUpdateImages = "http://localhost:8084/api/images/updateByDemande/"
                    + demande.getId() + "/" + articleId;

            restTemplate.put(urlUpdateImages, null);
        }

        return ResponseEntity.ok(" Demande validée et article créé avec succès (avec nouvelles valeurs)");

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(" Erreur lors de la validation : " + e.getMessage());
    }
}


@GetMapping
public ResponseEntity<?> getAllDemandes() {
    return ResponseEntity.ok(service.getAllDemandes());
}

@GetMapping("/{id}")
public ResponseEntity<Demande> getDemandeById(@PathVariable Long id) {
    Demande demande = service.getDemandeById(id);
    if (demande == null) {
        return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(demande);
}

}
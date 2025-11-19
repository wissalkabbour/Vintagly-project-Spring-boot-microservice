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
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

@RestController
@RequestMapping("/api/demandes")
// @CrossOrigin(origins = "*")

public class DemandeController {

    private final DemandeService service;

    public DemandeController(DemandeService service) {
        this.service = service;
    }

   @PostMapping("/add")
public ResponseEntity<Demande> addDemande(
        @RequestParam String nom,
        @RequestParam String description,
        @RequestParam String historique,
        @RequestParam String phone,
        @RequestParam Long categorie,
        @RequestParam(required = false) Double prix,
        @RequestParam Long idUtilisateur,
        @RequestParam("certificat") MultipartFile certificatFile,
        @RequestParam(value = "images", required = false) MultipartFile[] imageFiles,
        @RequestParam(value = "era", required = false) String era
) throws IOException {

    Demande demande = new Demande();
    demande.setNom(nom);
    demande.setDescription(description);
    demande.setHistorique(historique);
    demande.setPhone(phone);
    demande.setPrix(prix);
    demande.setIdUtilisateur(idUtilisateur);
    demande.setCategorieId(categorie);
    demande.setEtat(EtatDemande.EN_ATTENTE);

    if (era != null && !era.isEmpty()) {
        try {
            demande.setEras(Era.valueOf(era));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null); // valeur invalide
        }
    }

    // 1️⃣ Sauvegarder la demande d'abord
Demande savedDemande = service.addDemande(demande);

RestTemplate restTemplate = new RestTemplate();

// 2️⃣ Envoyer le certificat au catalogue-service et récupérer le path
if (certificatFile != null && !certificatFile.isEmpty()) {
    String urlCertificat = "http://localhost:8195/api/catalogue/certificats/upload";

    MultiValueMap<String, Object> bodyCert = new LinkedMultiValueMap<>();
    bodyCert.add("file", new org.springframework.core.io.ByteArrayResource(certificatFile.getBytes()) {
        @Override
        public String getFilename() {
            return certificatFile.getOriginalFilename();
        }
    });
    bodyCert.add("demandeId", savedDemande.getId());

    HttpHeaders headersCert = new HttpHeaders();
    headersCert.setContentType(MediaType.MULTIPART_FORM_DATA);

    HttpEntity<MultiValueMap<String, Object>> requestEntityCert =
            new HttpEntity<>(bodyCert, headersCert);

    // ⭐ Récupération du path retourné par l’API catalogue
    ResponseEntity<String> responseCert = restTemplate.postForEntity(
            urlCertificat,
            requestEntityCert,
            String.class
    );

    String certificatPath = responseCert.getBody();

    // ⭐ Mise à jour de la demande avec le path du certificat
    savedDemande.setCertificat(certificatPath);
    service.updateDemande(savedDemande);
}


    //  Envoyer les images au catalogue-service
    if (imageFiles != null && imageFiles.length > 0) {
        String urlImages = "http://localhost:8195/api/catalogue/images/upload";
        for (MultipartFile imageFile : imageFiles) {
            MultiValueMap<String, Object> bodyImg = new LinkedMultiValueMap<>();
            bodyImg.add("file", new org.springframework.core.io.ByteArrayResource(imageFile.getBytes()) {
                @Override
                public String getFilename() {
                    return imageFile.getOriginalFilename();
                }
            });
            bodyImg.add("demandeId", savedDemande.getId());

            HttpHeaders headersImg = new HttpHeaders();
            headersImg.setContentType(MediaType.MULTIPART_FORM_DATA);

            HttpEntity<MultiValueMap<String, Object>> requestEntityImg = new HttpEntity<>(bodyImg, headersImg);
            restTemplate.postForEntity(urlImages, requestEntityImg, String.class);
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

    //  Préparer les valeurs pour l'article (sans modifier la demande en DB)
    String articleNom = updatedFields.containsKey("nom") ? (String) updatedFields.get("nom") : demande.getNom();
    String articleDescription = updatedFields.containsKey("description") ? (String) updatedFields.get("description") : demande.getDescription();
    String articleHistorique = updatedFields.containsKey("historique") ? (String) updatedFields.get("historique") : demande.getHistorique();
    Double articlePrix = updatedFields.containsKey("prix") ? ((Number) updatedFields.get("prix")).doubleValue() : demande.getPrix();
    
    Era articleEra = null  ;
    if (updatedFields.containsKey("era")) {
        try {
            articleEra = Era.valueOf((String) updatedFields.get("era"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Valeur de era invalide : " + updatedFields.get("eras"));
        }
    }

    //  Mettre la demande à l'état ACCEPTÉE
    demande.setEtat(EtatDemande.ACCEPTEE);
    service.updateDemande(demande);

    try {
        RestTemplate restTemplate = new RestTemplate();

        //  Créer l'article dans le catalogue-service avec les nouvelles valeurs + certificat
        String urlArticle = "http://localhost:8195/api/catalogue/articlesD";

        Map<String, Object> articleData = new HashMap<>();
        articleData.put("nom", articleNom);
        articleData.put("description", articleDescription);
        articleData.put("prix", articlePrix);
        articleData.put("demandeId", demande.getId());
        articleData.put("certificat", demande.getCertificat());
        Map<String, Object> categorieObject = new HashMap<>();
        // La clé attendue est "id", qui sera utilisée par le catalogue-service pour lier la Categorie
        categorieObject.put("id", demande.getCategorieId());

        articleData.put("categorie", categorieObject);      
  articleData.put("idVendeur", demande.getIdUtilisateur());
        articleData.put("dateDePub", LocalDate.now());
        if (articleEra != null) {
            articleData.put("eras", articleEra.name());
        }
        articleData.put("historique", articleHistorique);

        ResponseEntity<Map> response = restTemplate.postForEntity(urlArticle, articleData, Map.class);

        //Mettre à jour les images liées si l'article est créé
        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            Long articleId = Long.valueOf(response.getBody().get("id").toString());

            String urlUpdateImages = "http://localhost:8195/api/catalogue/images/updateByDemande/"
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
@PutMapping("/refuser/{id}")
public ResponseEntity<String> RejeterDemande(
        @PathVariable Long id
        ) {

    //  Récupérer la demande originale
    Demande demande = service.getDemandeById(id);
    if (demande == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Demande non trouvée avec l'ID : " + id);
    }
        demande.setEtat(EtatDemande.REFUSEE);
        service.updateDemande(demande);
        return ResponseEntity.ok(" Demande rejetée avec succès");

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
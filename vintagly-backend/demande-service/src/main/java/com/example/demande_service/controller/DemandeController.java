package com.example.demande_service.controller;

import com.example.demande_service.entity.Demande;
import com.example.demande_service.entity.Era;
import com.example.demande_service.entity.EtatDemande;
import com.example.demande_service.service.DemandeService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/demandes")
public class DemandeController {

    private final DemandeService service;
    private final RestTemplate restTemplate = new RestTemplate();

    public DemandeController(DemandeService service) {
        this.service = service;
    }

    //  Méthode utilitaire pour récupérer le token
    private HttpHeaders authHeaders(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);
        return headers;
    }

    //  Méthode utilitaire pour upload fichier
    private String uploadFile(String url, MultipartFile file, Long demandeId, String token) throws IOException {

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new org.springframework.core.io.ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        });

        body.add("demandeId", demandeId);

        HttpHeaders headers = authHeaders(token);
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<MultiValueMap<String, Object>> requestEntity =
                new HttpEntity<>(body, headers);

        ResponseEntity<String> response =
                restTemplate.postForEntity(url, requestEntity, String.class);

        return response.getBody();
    }

    // -------------------------------------------------------------------------
    //  Ajouter une demande + upload certificat + images
    // -------------------------------------------------------------------------

    @PostMapping("/add")
    public ResponseEntity<Demande> addDemande(
            HttpServletRequest request,
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

        String token = request.getHeader("Authorization");

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
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(null);
            }
        }

        // Sauvegarder demande
        Demande savedDemande = service.addDemande(demande);

        //  Upload certificat
        if (certificatFile != null && !certificatFile.isEmpty()) {

            String url = "http://localhost:8195/api/catalogue/certificats/upload";
            String certificatPath = uploadFile(url, certificatFile, savedDemande.getId(), token);

            savedDemande.setCertificat(certificatPath);
            service.updateDemande(savedDemande);
        }

        // 3️⃣ Upload images
        if (imageFiles != null) {
            for (MultipartFile img : imageFiles) {
                if (!img.isEmpty()) {
                    String url = "http://localhost:8195/api/catalogue/images/upload";
                    uploadFile(url, img, savedDemande.getId(), token);
                }
            }
        }

        return ResponseEntity.ok(savedDemande);
    }

    // -------------------------------------------------------------------------
    //  Valider demande → créer article dans catalogue-service
    // -------------------------------------------------------------------------

    @PutMapping("/valider/{id}")
    public ResponseEntity<String> validerDemande(
            HttpServletRequest request,
            @PathVariable Long id,
            @RequestBody Map<String, Object> updatedFields
    ) {

        String token = request.getHeader("Authorization");

        Demande demande = service.getDemandeById(id);
        if (demande == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Demande non trouvée : " + id);
        }

        // valeurs mises à jour
        String articleNom = (String) updatedFields.getOrDefault("nom", demande.getNom());
        String articleDescription = (String) updatedFields.getOrDefault("description", demande.getDescription());
        String articleHistorique = (String) updatedFields.getOrDefault("historique", demande.getHistorique());
        Double articlePrix = updatedFields.get("prix") != null
                ? ((Number) updatedFields.get("prix")).doubleValue()
                : demande.getPrix();

        Era articleEra = null;
        if (updatedFields.containsKey("era")) {
            try {
                articleEra = Era.valueOf((String) updatedFields.get("era"));
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Valeur era invalide");
            }
        }

        // mettre état ACCEPTÉE
        demande.setEtat(EtatDemande.ACCEPTEE);
        service.updateDemande(demande);

        try {
            String url = "http://localhost:8195/api/catalogue/articlesD";

            Map<String, Object> articleData = new HashMap<>();
            articleData.put("nom", articleNom);
            articleData.put("description", articleDescription);
            articleData.put("prix", articlePrix);
            articleData.put("historique", articleHistorique);
            articleData.put("dateDePub", LocalDate.now());
            articleData.put("demandeId", demande.getId());
            articleData.put("certificat", demande.getCertificat());
            articleData.put("idVendeur", demande.getIdUtilisateur());

            Map<String, Object> cat = new HashMap<>();
            cat.put("id", demande.getCategorieId());
            articleData.put("categorie", cat);

            if (articleEra != null)
                articleData.put("eras", articleEra.name());

            // envoyer
            HttpHeaders headers = authHeaders(token);
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity =
                    new HttpEntity<>(articleData, headers);

            ResponseEntity<Map> response =
                    restTemplate.postForEntity(url, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                Long articleId = Long.valueOf(response.getBody().get("id").toString());

                // Update des images
                String urlImg = "http://localhost:8195/api/catalogue/images/updateByDemande/"
                        + demande.getId() + "/" + articleId;

                HttpEntity<Void> imgEntity = new HttpEntity<>(headers);
                restTemplate.exchange(urlImg, HttpMethod.PUT, imgEntity, Void.class);
            }

            return ResponseEntity.ok("Demande validée et article créé.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("Erreur validation : " + e.getMessage());
        }
    }

    // -------------------------------------------------------------------------
    // Refuser une demande
    // -------------------------------------------------------------------------

    @PutMapping("/refuser/{id}")
    public ResponseEntity<String> refuser(@PathVariable Long id) {

        Demande demande = service.getDemandeById(id);
        if (demande == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Demande non trouvée : " + id);
        }

        demande.setEtat(EtatDemande.REFUSEE);
        service.updateDemande(demande);

        return ResponseEntity.ok("Demande refusée !");
    }

    // -------------------------------------------------------------------------

    @GetMapping
    public ResponseEntity<?> getAllDemandes() {
        return ResponseEntity.ok(service.getAllDemandes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Demande> getDemandeById(@PathVariable Long id) {
        Demande demande = service.getDemandeById(id);
        return demande != null ? ResponseEntity.ok(demande)
                : ResponseEntity.notFound().build();
    }
}

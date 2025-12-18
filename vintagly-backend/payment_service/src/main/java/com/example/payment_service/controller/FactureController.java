package com.example.payment_service.controller;

import com.example.payment_service.entity.Facture;
import com.example.payment_service.security.SecurityUtils;
import com.example.payment_service.service.FactureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/factures")
@RequiredArgsConstructor
@PreAuthorize("hasRole('customer')")
public class FactureController {

    private final FactureService factureService;

    // 🔐 Génération sécurisée d'une facture
    @PostMapping
    public ResponseEntity<Facture> genererFacture(@RequestParam Long idCommande) {
        try {
            String userId = SecurityUtils.getUserIdFromToken();
            Facture facture = factureService.genererFacture(idCommande, userId);
            facture.setPdfContent(null);
            return ResponseEntity.status(HttpStatus.CREATED).body(facture);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Facture> getFacture(@PathVariable Long id) {
        try {
            String userId = SecurityUtils.getUserIdFromToken();
            Facture facture = factureService.getFactureById(id, userId);
            facture.setPdfContent(null);
            return ResponseEntity.ok(facture);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> telechargerPDF(@PathVariable Long id) {
        try {
            String userId = SecurityUtils.getUserIdFromToken();
            byte[] pdf = factureService.getPdfContent(id, userId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("filename", "facture_" + id + ".pdf");

            return ResponseEntity.ok().headers(headers).body(pdf);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}

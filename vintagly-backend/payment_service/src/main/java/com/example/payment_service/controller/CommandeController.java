package com.example.payment_service.controller;

import com.example.payment_service.entity.Commande;
import com.example.payment_service.security.SecurityUtils;
import com.example.payment_service.service.CommandeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/commandes")
@RequiredArgsConstructor
@PreAuthorize("hasRole('customer')")
public class CommandeController {

    private final CommandeService commandeService;

    @PostMapping("/create")
    public ResponseEntity<Commande> creerCommande() {
        String userId = SecurityUtils.getUserIdFromToken();
        Commande commande = commandeService.creerCommandeDepuisPanier(userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(commande);
    }

    @PutMapping("/{id}/valider")
    public ResponseEntity<Commande> validerCommande(@PathVariable Long id) {
        String userId = SecurityUtils.getUserIdFromToken();
        Commande commande = commandeService.validerCommande(id, userId);
        return ResponseEntity.ok(commande);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Commande> getCommande(@PathVariable Long id) {
        String userId = SecurityUtils.getUserIdFromToken();
        Commande commande = commandeService.getCommandeById(id, userId);
        return ResponseEntity.ok(commande);
    }
}

package com.example.payment_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "commande")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Commande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long idPanier;

    private String idUtilisateur;  // ✅ CHANGÉ de Long à String

    private Double montantTotal;

    @Enumerated(EnumType.STRING)
    private StatutCommande statut;

    private LocalDateTime dateCreation;

    private LocalDateTime dateValidation;

    private Long idFacture;

    private Long idPayment;
}
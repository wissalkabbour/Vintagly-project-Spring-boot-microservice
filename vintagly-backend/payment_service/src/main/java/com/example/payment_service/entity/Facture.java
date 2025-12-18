package com.example.payment_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "facture")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Facture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double total;

    private String status;

    private LocalDate dateCreation;

    private String idUtilisateur;  // ✅ CHANGÉ de Long à String

    private Long idPanier;

    private Long idCommande;

    @Lob
    private byte[] pdfContent;

    private String numeroFacture;
}
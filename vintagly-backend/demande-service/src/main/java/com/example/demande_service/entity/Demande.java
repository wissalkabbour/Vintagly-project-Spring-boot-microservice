package com.example.demande_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "demande")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Demande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    private String description;

    private String certificat;

    private String historique;

    private Double prix;

    private String etat;

    private Long idUtilisateur; // référence vers utilisateur (auth service)
}

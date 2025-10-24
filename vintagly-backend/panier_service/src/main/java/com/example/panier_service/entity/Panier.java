package com.example.panier_service.entity;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "panier")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Panier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dateValidation;

    private String etat;

    private Long idUtilisateur; // référence à un utilisateur du service d’authentification
}

package com.example.authentification_service.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "utilisateur")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;
    private String mail;
    private String password;
    private String role;
}

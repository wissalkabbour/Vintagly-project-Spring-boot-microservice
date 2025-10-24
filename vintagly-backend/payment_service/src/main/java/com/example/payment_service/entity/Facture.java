package com.example.payment_service.entity;


import jakarta.persistence.*;
import lombok.*;
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

    private Long idUtilisateur;

    private Long idPanier;
}


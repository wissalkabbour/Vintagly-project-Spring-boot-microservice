package com.example.payment_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long idCommande;
    
    private Long idFacture;
    
    private Double montant;
    
    @Enumerated(EnumType.STRING)
    private StatutPayment statut;
    
    private String methodePayment; //CARTE_CREDIT, paypal, virement
    
    private LocalDateTime dateInitiation;
    
    private LocalDateTime dateCompletion;
    
    private String transactionId; //Identifiant unique de la transaction
    
    private String messageErreur; //si le aiement echoue
}
package com.example.demande_service.dto;


import com.example.demande_service.entity.Era;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DemandeRequest {
    private String nom;
    private String description;
    private String historique;
    private Double prix;
    private Long idUtilisateur;
    private String eras; // ou Era
}

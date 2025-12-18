package com.example.payment_service.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PanierResponseDTO {
    private Long id;
    private String idUtilisateur;
    private Boolean etat;
    private List<ArticleDTO> articles;  // ✅ Le service panier retourne "articles"
}
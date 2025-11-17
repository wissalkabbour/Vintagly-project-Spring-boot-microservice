package com.example.panier_service.dto;

import lombok.Data;
import java.util.List;

@Data
public class PanierResponseDTO {

    private Long id;
    private String idUtilisateur;
    private Boolean etat;

    private List<ArticleDTO> articles;
}

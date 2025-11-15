package com.example.panier_service.dto;

import lombok.Data;
import java.util.List;

@Data
public class CatalogueArticleResponse {
    private Long id;
    private String nom;
    private Double prix;
    private List<ImageDTO> images;

    @Data
    public static class ImageDTO {
        private Long id;
        private String path;
        private Long demandeId;
    }
}

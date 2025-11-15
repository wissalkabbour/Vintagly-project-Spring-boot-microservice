package com.example.panier_service.dto;

import lombok.Data;

@Data
public class ArticleDTO {
    private Long id;
    private String nom;
    private Double prix;
    private String image;
}

// payment-service/src/main/java/com/example/payment_service/DTOs/ArticleDTO.java
package com.example.payment_service.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArticleDTO {
    private Long id;
    private String nom;
    private Double prix;
    private String image;
}
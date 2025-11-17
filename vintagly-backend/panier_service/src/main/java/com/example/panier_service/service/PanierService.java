package com.example.panier_service.service;

import com.example.panier_service.dto.PanierResponseDTO;
import com.example.panier_service.entity.Panier;
import com.example.panier_service.entity.PanierItem;

import java.util.List;

public interface PanierService {

    Panier createPanier(String userId);

    Panier addArticle(String userId, Long articleId);

    Panier removeArticle(String userId, Long articleId);

    PanierResponseDTO getPanier(String userId);
}

package com.example.panier_service.service;

import com.example.panier_service.entity.Panier;
import com.example.panier_service.entity.PanierItem;

import java.util.List;

public interface PanierService {
    Panier createPanier(Long userId);
    Panier addArticle(Long panierId, Long articleId);
    Panier removeArticle(Long panierId, Long articleId);
    Panier getPanier(Long panierId);
}

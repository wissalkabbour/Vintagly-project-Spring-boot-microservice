package com.example.payment_service.clients;

import com.example.payment_service.config.FeignClientConfig;
import com.example.payment_service.DTOs.PanierResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(
        name = "panier-service",
        url = "${panier.service.url:http://localhost:8082}",
        configuration = FeignClientConfig.class
)
public interface PanierClient {

    @GetMapping("/api/paniers")
    PanierResponseDTO getPanierUtilisateurConnecte();
}
package com.example.panier_service.clients;

import com.example.panier_service.config.FeignClientConfig;
import com.example.panier_service.dto.CatalogueArticleResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "catalogue-service",
        configuration = FeignClientConfig.class
)
public interface ArticleClient {

    @GetMapping("/api/catalogue/articles/{id}")
    CatalogueArticleResponse getArticleById(@PathVariable("id") Long id);
}

package com.example.demande_service;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
   @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // 1. Soyez précis sur l'origine (pas d'étoile *)
                .allowedOrigins("http://localhost:5173") 
                // 2. Listez explicitement le PUT et OPTIONS
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                // 3. Mettez ceci à true pour permettre un dialogue complet
                .allowCredentials(true); 
    }
}

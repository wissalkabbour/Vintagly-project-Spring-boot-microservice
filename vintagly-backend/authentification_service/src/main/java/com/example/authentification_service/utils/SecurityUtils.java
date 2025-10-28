package com.example.authentification_service.utils;



import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

public class SecurityUtils {

    /**
     * Récupère l'ID Keycloak (sub) de l'utilisateur connecté.
     */
    public static String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
            throw new IllegalStateException("Utilisateur non authentifié ou token invalide");
        }

        return jwt.getSubject(); // le "sub" du token Keycloak
    }

    /**
     * Récupère un claim spécifique du token JWT (par exemple email, preferred_username…)
     */
    public static String getClaim(String claimName) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
            throw new IllegalStateException("Utilisateur non authentifié ou token invalide");
        }

        Object value = jwt.getClaims().get(claimName);
        return value != null ? value.toString() : null;
    }
}

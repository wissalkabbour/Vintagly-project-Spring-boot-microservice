package com.example.panier_service.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

public class SecurityUtils {

    public static String getUserIdFromToken() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !(auth.getPrincipal() instanceof Jwt jwt)) {
            throw new IllegalStateException("Utilisateur non authentifié");
        }

        // Keycloak user ID (the "sub" claim)
        return jwt.getSubject();
        // same as: return jwt.getClaim("sub");
    }
}

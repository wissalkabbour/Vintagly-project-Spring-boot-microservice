package com.example.authentification_service.service;

import com.example.authentification_service.entity.NewUserRecord;

public interface KeycloakAdminService {
    /**
     * Create user in Keycloak and return Keycloak user id
     */
    String createUserInKeycloak(NewUserRecord record);

    /**
     * Assign a realm role to a Keycloak user
     */
    void assignRole(String userId, String roleName);

    /**
     * Send verification email (Keycloak) to user
     */
    void sendVerificationEmail(String userId);

    /**
     * Enable or disable user in Keycloak
     */
    void enableUser(String userId, boolean enabled);
}
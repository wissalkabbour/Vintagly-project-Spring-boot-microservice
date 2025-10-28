package com.example.authentification_service.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.authentification_service.entity.NewUserRecord;
import com.example.authentification_service.service.KeycloakAdminService;
import com.example.authentification_service.service.UserService;

import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final KeycloakAdminService keycloakAdminService;
    private final Keycloak keycloak;

    @Value("${app.keycloak.realm}")
    private String realm;

    @Override
    public void registerUser(NewUserRecord newUserRecord) {
        // 1. Create Keycloak user
        String keycloakUserId = keycloakAdminService.createUserInKeycloak(newUserRecord);
        log.info("Keycloak user created with id: {}", keycloakUserId);

        // 2. Assign role
        keycloakAdminService.assignRole(keycloakUserId, newUserRecord.role());
        log.info("Assigned role {} to user {}", newUserRecord.role(), keycloakUserId);


            
             // 4. Send verification email
        keycloakAdminService.sendVerificationEmail(keycloakUserId);
        }



    @Override
    public void sendVerificationEmail(String userId) {
        keycloakAdminService.sendVerificationEmail(userId);
    }

    @Override
    public void deleteUser(String userId) {
        getUsersResource().delete(userId);
    }

    @Override
    public void forgotPassword(String username) {
        UsersResource usersResource = getUsersResource();
        List<UserRepresentation> users = usersResource.searchByUsername(username, true);
        if (users.isEmpty()) {
            throw new RuntimeException("User not found: " + username);
        }
        UserRepresentation user = users.get(0);
        UserResource userResource = usersResource.get(user.getId());
        userResource.executeActionsEmail(List.of("UPDATE_PASSWORD"));
    }

    private UsersResource getUsersResource() {
        return keycloak.realm(realm).users();
    }
}
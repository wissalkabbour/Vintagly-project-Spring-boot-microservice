package com.example.authentification_service.service.impl;

import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.authentification_service.entity.NewUserRecord;
import com.example.authentification_service.service.KeycloakAdminService;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class KeycloakAdminServiceImpl implements KeycloakAdminService {

    private final Keycloak keycloak;

    @Value("${app.keycloak.realm}")
    private String realm;

    @Override
    public String createUserInKeycloak(NewUserRecord record) {
        UserRepresentation user = new UserRepresentation();
        user.setEnabled(true);
        user.setFirstName(record.firstName());
        user.setLastName(record.lastName());
        user.setUsername(record.username());
        user.setEmail(record.username());
        user.setEmailVerified(false);

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(record.password());
        credential.setTemporary(false);
        user.setCredentials(List.of(credential));

        UsersResource users = getUsersResource();
        Response response = users.create(user);

        log.info("Keycloak create user status: {}", response.getStatus());
        if (!Objects.equals(201, response.getStatus())) {
            throw new RuntimeException("Keycloak user creation failed with status: " + response.getStatus());
        }

        List<UserRepresentation> found = users.searchByUsername(record.username(), true);
        if (found.isEmpty()) {
            throw new RuntimeException("User created but not found in Keycloak search");
        }

        return found.get(0).getId();
    }

    @Override
    public void assignRole(String userId, String roleName) {
        RealmResource realmResource = keycloak.realm(realm);
        RoleRepresentation role = realmResource.roles()
                .list()
                .stream()
                .filter(r -> r.getName().equalsIgnoreCase(roleName))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        realmResource.users().get(userId).roles().realmLevel().add(List.of(role));
    }

    @Override
    public void sendVerificationEmail(String userId) {
        try {
            getUsersResource().get(userId).sendVerifyEmail();
        } catch (Exception e) {
            log.warn("Failed to send verification email for user {}: {}", userId, e.getMessage());
        }
    }

    @Override
    public void enableUser(String userId, boolean enabled) {
        UserResource userResource = getUsersResource().get(userId);
        var rep = userResource.toRepresentation();
        rep.setEnabled(enabled);
        userResource.update(rep);
    }

    private UsersResource getUsersResource() {
        return keycloak.realm(realm).users();
    }
}
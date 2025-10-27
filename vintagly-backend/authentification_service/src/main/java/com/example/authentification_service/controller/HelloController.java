package com.example.authentification_service.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.security.oauth2.jwt.Jwt;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

@RestController
public class HelloController {

    @GetMapping("/public/hello")
    public String publicHello() {
        return "Hello from public endpoint!";
    }

    @GetMapping("/user/hello")
    public String userHello() {
        return "Hello USER!";
    }

    @GetMapping("/admin/hello")
    public String adminHello() {
        return "Hello ADMIN!";
    }

    @GetMapping("/user/debug")
    public Map<String, Object> debugAuth() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> debug = new HashMap<>();
        
        debug.put("authenticated", auth.isAuthenticated());
        debug.put("authorities", auth.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toList()));
        
        if (auth.getPrincipal() instanceof Jwt jwt) {
            debug.put("subject", jwt.getSubject());
            debug.put("realmAccess", jwt.getClaim("realm_access"));
            debug.put("resourceAccess", jwt.getClaim("resource_access"));
            debug.put("allClaims", jwt.getClaims());
        }
        
        return debug;
    }
}

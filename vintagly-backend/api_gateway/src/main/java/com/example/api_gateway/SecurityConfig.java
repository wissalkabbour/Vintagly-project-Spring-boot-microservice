package com.example.api_gateway;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {

        http
                .csrf(csrf -> csrf.disable())
                .authorizeExchange(auth -> auth
                        .pathMatchers("/auth/**").permitAll()        // Public
                        .pathMatchers("/uploads/**").permitAll()     // Public images
                        .anyExchange().authenticated()               // Tout le reste nécessite JWT
                )
                .oauth2ResourceServer(oauth -> oauth.jwt());     // Validation Keycloak automatique

        return http.build();
    }
}
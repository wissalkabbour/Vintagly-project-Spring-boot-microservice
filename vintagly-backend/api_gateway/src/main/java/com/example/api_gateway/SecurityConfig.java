package com.example.api_gateway;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {

        http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .cors(cors -> {}) // utilise ta config YAML
                .authorizeExchange(auth -> auth

                        // 👉 OPTIONS always allowed (important pour CORS)
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 👉 AUTH service public
                        .pathMatchers("/public/auth/**").permitAll()

                        // 👉 uploads public
                        .pathMatchers("/uploads/**").permitAll()

                        // 👉 🔓 Public GET endpoints
                        .pathMatchers(HttpMethod.GET, "/api/catalogue/articles/**").permitAll()
                        .pathMatchers(HttpMethod.POST, "/public/auth/register").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/catalogue/categories/**").permitAll()


                        // 👉 any other request must be authenticated
                        .anyExchange().authenticated()
                )
                .oauth2ResourceServer(oauth -> oauth.jwt());

        return http.build();
    }
}
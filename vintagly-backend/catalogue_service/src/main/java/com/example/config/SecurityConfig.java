package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {}) // utilise CorsConfig si tu en as un
                .authorizeHttpRequests(auth -> auth

                        // 👉 GET = public (admin + customer + anonymous)
                        .requestMatchers(HttpMethod.GET, "/api/catalogue/articles/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/catalogue/categories/**").permitAll()

                        // 👉 POST, PUT, DELETE = admin uniquement
                        .requestMatchers(HttpMethod.POST, "/api/catalogue/articles/**").hasAuthority("admin")
                        .requestMatchers(HttpMethod.PUT, "/api/catalogue/articles/**").hasAuthority("admin")
                        .requestMatchers(HttpMethod.DELETE, "/api/catalogue/articles/**").hasAuthority("admin")

                        .requestMatchers(HttpMethod.POST, "/api/catalogue/categories/**").hasAuthority("admin")
                        .requestMatchers(HttpMethod.DELETE, "/api/catalogue/categories/**").hasAuthority("admin")

                        // 👉 accès libre aux images uploadées
                        .requestMatchers("/uploads/**").permitAll()

                        // 👉 tout le reste nécessite token
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth -> oauth
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
                );

        return http.build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(new KeycloakRoleConverter());
        return converter;
    }
}

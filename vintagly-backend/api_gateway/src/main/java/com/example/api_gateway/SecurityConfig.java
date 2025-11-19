package com.example.api_gateway;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;



import org.springframework.http.HttpMethod;


@Configuration
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})   // utilise la config YAML
                .authorizeExchange(auth -> auth
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()  // 🔥 indispensable
                        .pathMatchers("/auth/**").permitAll()
                        .pathMatchers("/uploads/**").permitAll()
                        .anyExchange().authenticated()
                )
                .oauth2ResourceServer(oauth -> oauth.jwt());

        return http.build();
    }
}

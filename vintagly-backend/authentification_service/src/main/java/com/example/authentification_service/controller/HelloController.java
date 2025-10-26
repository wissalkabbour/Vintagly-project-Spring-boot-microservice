package com.example.authentification_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

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
}

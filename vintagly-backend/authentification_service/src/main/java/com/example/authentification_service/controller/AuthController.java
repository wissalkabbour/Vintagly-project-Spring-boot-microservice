package com.example.authentification_service.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.authentification_service.entity.NewUserRecord;
import com.example.authentification_service.service.UserService;

@RestController
@RequestMapping("/public/auth")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:5173")
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody NewUserRecord record) {
        userService.registerUser(record);
        return ResponseEntity.ok("User registered successfully. Check your email for verification.");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String username) {
        userService.forgotPassword(username);
        return ResponseEntity.ok("Password reset email sent if the user exists.");
    }
}
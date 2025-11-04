package com.example.authentification_service.service;

import com.example.authentification_service.entity.NewUserRecord;

public interface UserService {
    void registerUser(NewUserRecord newUserRecord);
    void sendVerificationEmail(String userId);
    void deleteUser(String userId);
    void forgotPassword(String username);
}
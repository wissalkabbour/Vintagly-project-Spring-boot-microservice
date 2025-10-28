package com.example.authentification_service.entity;

public record NewUserRecord(
        String username,String password,String firstName, String lastName,String role)
{
}
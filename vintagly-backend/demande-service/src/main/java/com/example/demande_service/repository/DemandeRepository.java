package com.example.demande_service.repository;

import com.example.demande_service.entity.Demande;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DemandeRepository extends JpaRepository<Demande, Long> {
        List<Demande> findByIdUtilisateur(Long idUtilisateur);

}

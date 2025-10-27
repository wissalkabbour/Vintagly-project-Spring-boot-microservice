package com.example.panier_service.repository;

import com.example.panier_service.entity.Panier;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PanierRepository extends JpaRepository<Panier, Long> {
    Optional<Panier> findByIdUtilisateurAndEtat(Long idUtilisateur, Boolean etat);
}

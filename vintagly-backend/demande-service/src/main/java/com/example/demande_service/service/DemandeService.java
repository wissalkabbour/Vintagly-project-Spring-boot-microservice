package com.example.demande_service.service;

import com.example.demande_service.entity.Demande;
import com.example.demande_service.repository.DemandeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DemandeService {

    private final DemandeRepository repository;

    public DemandeService(DemandeRepository repository) {
        this.repository = repository;
    }

    public Demande addDemande(Demande demande) {
        return repository.save(demande);
    }

    public List<Demande> getDemandesByUser(Long idUtilisateur) {
        return repository.findByIdUtilisateur(idUtilisateur);
    }
}

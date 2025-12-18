package com.example.payment_service.service;

import com.example.payment_service.entity.Facture;

public interface FactureService {

    Facture genererFacture(Long idCommande, String userId);

    Facture getFactureById(Long id, String userId);

    byte[] getPdfContent(Long id, String userId);
}

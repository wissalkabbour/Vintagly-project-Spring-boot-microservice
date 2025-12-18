package com.example.payment_service.service;

import com.example.payment_service.entity.Commande;
import com.example.payment_service.entity.Facture;
import com.example.payment_service.entity.Payment;
import com.example.payment_service.entity.StatutPayment;
import com.example.payment_service.repository.CommandeRepository;
import com.example.payment_service.repository.FactureRepository;
import com.example.payment_service.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class FactureServiceImpl implements FactureService {

    private final FactureRepository factureRepository;
    private final PaymentRepository paymentRepository;
    private final CommandeRepository commandeRepository;

    @Override
    public Facture genererFacture(Long idCommande, String userId) {

        Commande commande = commandeRepository.findById(idCommande)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        // ✅ Comparaison String
        if (!commande.getIdUtilisateur().equals(userId)) {
            throw new RuntimeException("Non autorisé");
        }

        Payment payment = paymentRepository.findByIdCommande(idCommande)
                .orElseThrow(() -> new RuntimeException("Paiement introuvable"));

        if (payment.getStatut() != StatutPayment.REUSSI) {
            throw new RuntimeException("Paiement non réussi");
        }

        if (payment.getIdFacture() != null) {
            throw new RuntimeException("Facture déjà générée");
        }

        Facture facture = Facture.builder()
                .idCommande(idCommande)
                .idUtilisateur(userId)  // ✅ String
                .idPanier(commande.getIdPanier())
                .total(payment.getMontant())
                .status("GENEREE")
                .dateCreation(LocalDate.now())
                .numeroFacture("FAC-" + System.currentTimeMillis())
                .pdfContent(genererPDF(payment))
                .build();

        facture = factureRepository.save(facture);

        payment.setIdFacture(facture.getId());
        paymentRepository.save(payment);

        return facture;
    }

    @Override
    public Facture getFactureById(Long idFacture, String userId) {

        Facture facture = factureRepository.findById(idFacture)
                .orElseThrow(() -> new RuntimeException("Facture introuvable"));

        // ✅ Comparaison String
        if (!facture.getIdUtilisateur().equals(userId)) {
            throw new RuntimeException("Non autorisé");
        }

        return facture;
    }

    @Override
    public byte[] getPdfContent(Long idFacture, String userId) {
        Facture facture = getFactureById(idFacture, userId);
        return facture.getPdfContent();
    }

    private byte[] genererPDF(Payment payment) {
        return ("FACTURE PAYEMENT ID: " + payment.getId()).getBytes();
    }
}
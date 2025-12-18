package com.example.payment_service.service;

import com.example.payment_service.DTOs.StripePaymentResponse;
import com.example.payment_service.entity.Commande;
import com.example.payment_service.entity.Payment;
import com.example.payment_service.entity.StatutPayment;
import com.example.payment_service.repository.CommandeRepository;
import com.example.payment_service.repository.PaymentRepository;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final CommandeRepository commandeRepository;

    @Value("${stripe.webhook.secret}")
    private String stripeWebhookSecret;

    @Override
    public Payment initierPayment(Long idCommande, String methodePayment, String userId) {

        Commande commande = commandeRepository.findById(idCommande)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        // ✅ Comparaison String
        if (!commande.getIdUtilisateur().equals(userId)) {
            throw new RuntimeException("Non autorisé");
        }

        Payment payment = Payment.builder()
                .idCommande(idCommande)
                .montant(commande.getMontantTotal())
                .methodePayment(methodePayment)
                .statut(StatutPayment.INITIE)
                .dateInitiation(LocalDateTime.now())
                .build();

        return paymentRepository.save(payment);
    }

    @Override
    public Payment verifierStatut(Long paymentId, String userId) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment introuvable"));

        Commande commande = commandeRepository.findById(payment.getIdCommande())
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        // ✅ Comparaison String
        if (!commande.getIdUtilisateur().equals(userId)) {
            throw new RuntimeException("Non autorisé");
        }

        return payment;
    }

    @Override
    public StripePaymentResponse creerStripeCheckoutSession(Long idCommande, String userId) {

        Commande commande = commandeRepository.findById(idCommande)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        // ✅ Comparaison String
        if (!commande.getIdUtilisateur().equals(userId)) {
            throw new RuntimeException("Non autorisé");
        }

        Payment payment = paymentRepository.findByIdCommande(idCommande)
                .orElseThrow(() -> new RuntimeException("Payment introuvable"));

        try {
            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl("http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}")
                    .setCancelUrl("http://localhost:5137/cancel")
                    .addLineItem(SessionCreateParams.LineItem.builder()
                            .setQuantity(1L)
                            .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency("eur")
                                    .setUnitAmount(Math.round(commande.getMontantTotal() * 100))
                                    .setProductData(
                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                    .setName("Commande #" + commande.getId())
                                                    .build()
                                    )
                                    .build())
                            .build())
                    .build();

            Session session = Session.create(params);

            payment.setTransactionId(session.getId());
            payment.setStatut(StatutPayment.EN_COURS);
            paymentRepository.save(payment);

            return StripePaymentResponse.builder()
                    .sessionId(session.getId())
                    .checkoutUrl(session.getUrl())
                    .paymentId(payment.getId())
                    .transactionId(session.getId())
                    .status("EN_COURS")
                    .build();

        } catch (StripeException e) {
            throw new RuntimeException("Erreur Stripe : " + e.getMessage());
        }
    }

    @Override
    public void traiterStripeWebhook(String payload, String signatureHeader) {

        Event event;

        try {
            event = Webhook.constructEvent(payload, signatureHeader, stripeWebhookSecret);
        } catch (SignatureVerificationException e) {
            throw new RuntimeException("Signature Stripe invalide");
        }

        if ("checkout.session.completed".equals(event.getType())) {

            Session session = (Session) event.getDataObjectDeserializer()
                    .getObject()
                    .orElseThrow();

            String sessionId = session.getId();

            Payment payment = paymentRepository.findByTransactionId(sessionId)
                    .orElseThrow(() -> new RuntimeException("Payment introuvable"));

            payment.setStatut(StatutPayment.REUSSI);
            payment.setDateCompletion(LocalDateTime.now());
            paymentRepository.save(payment);
        }
    }

    @Override
    public Payment confirmerPaymentStripe(String sessionId, String userId) {

        Payment payment = paymentRepository.findByTransactionId(sessionId)
                .orElseThrow(() -> new RuntimeException("Session introuvable"));

        Commande commande = commandeRepository.findById(payment.getIdCommande())
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        // ✅ Comparaison String
        if (!commande.getIdUtilisateur().equals(userId)) {
            throw new RuntimeException("Non autorisé");
        }

        return payment;
    }
}
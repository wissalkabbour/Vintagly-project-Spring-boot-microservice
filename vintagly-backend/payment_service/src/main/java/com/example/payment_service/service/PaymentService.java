package com.example.payment_service.service;

import com.example.payment_service.DTOs.StripePaymentResponse;
import com.example.payment_service.entity.Payment;

public interface PaymentService {

    Payment initierPayment(Long idCommande, String methodePayment, String userId);

    Payment verifierStatut(Long paymentId, String userId);

    StripePaymentResponse creerStripeCheckoutSession(Long idCommande, String userId);

    void traiterStripeWebhook(String payload, String signatureHeader);

    Payment confirmerPaymentStripe(String sessionId, String userId);
}

// payment-service/src/main/java/com/example/payment_service/controller/PaymentController.java
package com.example.payment_service.controller;

import com.example.payment_service.DTOs.StripePaymentResponse;
import com.example.payment_service.entity.Payment;
import com.example.payment_service.security.SecurityUtils;
import com.example.payment_service.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('customer')")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/initiate")
    public ResponseEntity<Payment> initierPayment(
            @RequestParam Long idCommande,
            @RequestParam(defaultValue = "CARTE_CREDIT") String methodePayment) {
        try {
            String userId = SecurityUtils.getUserIdFromToken();
            Payment payment = paymentService.initierPayment(idCommande, methodePayment, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{payment_id}")
    public ResponseEntity<Payment> verifierStatut(@PathVariable Long payment_id) {
        try {
            String userId = SecurityUtils.getUserIdFromToken();
            Payment payment = paymentService.verifierStatut(payment_id, userId);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/stripe/create-checkout-session")
    public ResponseEntity<?> creerSessionStripe(@RequestParam Long idCommande) {
        try {
            String userId = SecurityUtils.getUserIdFromToken();
            StripePaymentResponse response = paymentService.creerStripeCheckoutSession(idCommande, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/stripe/webhook")
    @PreAuthorize("permitAll()")
    public ResponseEntity<String> stripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            paymentService.traiterStripeWebhook(payload, sigHeader);
            return ResponseEntity.ok("Webhook traité");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

    @GetMapping("/stripe/confirm/{sessionId}")
    public ResponseEntity<Payment> confirmerPaymentStripe(@PathVariable String sessionId) {
        try {
            String userId = SecurityUtils.getUserIdFromToken();
            Payment payment = paymentService.confirmerPaymentStripe(sessionId, userId);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
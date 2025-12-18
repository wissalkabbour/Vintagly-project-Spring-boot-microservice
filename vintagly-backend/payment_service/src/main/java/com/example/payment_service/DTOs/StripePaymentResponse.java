package com.example.payment_service.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StripePaymentResponse {
    private String sessionId;
    private String checkoutUrl;
    private Long paymentId;
    private String transactionId;
    private String status;
}
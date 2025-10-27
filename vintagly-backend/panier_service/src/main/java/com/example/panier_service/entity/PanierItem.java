package com.example.panier_service.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "panier_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PanierItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "panier_id")
    @JsonBackReference
    private Panier panier;   // link to the panier it belongs to

    private Long articleId;  // reference to article in Catalogue service

}

package com.example.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private LocalDate dateDePub;
    private String description;
    private String certificat;
    private String historique;
    private Double prix;
    private String productLifecycle;
    private Long idVendeur; 

    @ManyToOne

    @JoinColumn(name = "id_categorie")
    @JsonBackReference
    private Categorie categorie;

    @OneToMany(mappedBy = "article", cascade = CascadeType.ALL)
    private java.util.List<Image> images;
    
}

package com.example.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

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

    private Long idVendeur; 

    @ManyToOne
    @JoinColumn(name = "id_categorie")
    private Categorie categorie;

    @OneToMany(mappedBy = "article", cascade = CascadeType.ALL)
    private java.util.List<Image> images;
}

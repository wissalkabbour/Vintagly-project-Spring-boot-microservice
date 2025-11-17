package com.example.panier_service.entity;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "panier")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Panier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dateValidation;

    private Boolean etat; //changed type to boolean

    private String idUtilisateur; // référence à un utilisateur du service d’authentification

    @OneToMany(mappedBy = "panier", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<PanierItem> items = new ArrayList<>();

}

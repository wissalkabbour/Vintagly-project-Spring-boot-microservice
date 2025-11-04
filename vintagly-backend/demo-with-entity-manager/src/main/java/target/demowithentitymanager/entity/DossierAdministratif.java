package target.demowithentitymanager.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;

@Entity
@Table(name = "dossier_administratif")
public class DossierAdministratif {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "dossier_administratif_id_gen")
    @SequenceGenerator(name = "dossier_administratif_id_gen", sequenceName = "dossier_administratif_id_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ColumnDefault("CURRENT_DATE")
    @Column(name = "date_creation", nullable = false)
    private LocalDate dateCreation;

    @OneToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "eleve_id")
    private Eleve eleve;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public LocalDate getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDate dateCreation) {
        this.dateCreation = dateCreation;
    }

    public Eleve getEleve() {
        return eleve;
    }

    public void setEleve(Eleve eleve) {
        this.eleve = eleve;
    }

}
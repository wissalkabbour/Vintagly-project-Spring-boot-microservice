package target.demowithentitymanager.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "eleve_cours")
public class EleveCour {
    @SequenceGenerator(name = "eleve_cours_id_gen", sequenceName = "dossier_administratif_id_seq", allocationSize = 1)
    @EmbeddedId
    private EleveCourId id;

    @MapsId("eleveId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "eleve_id", nullable = false)
    private Eleve eleve;

    @MapsId("coursId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "cours_id", nullable = false)
    private Cour cours;

    public EleveCourId getId() {
        return id;
    }

    public void setId(EleveCourId id) {
        this.id = id;
    }

    public Eleve getEleve() {
        return eleve;
    }

    public void setEleve(Eleve eleve) {
        this.eleve = eleve;
    }

    public Cour getCours() {
        return cours;
    }

    public void setCours(Cour cours) {
        this.cours = cours;
    }

}
package target.demowithentitymanager.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "filiere_cours")
public class FiliereCour {
    @SequenceGenerator(name = "filiere_cours_id_gen", sequenceName = "dossier_administratif_id_seq", allocationSize = 1)
    @EmbeddedId
    private FiliereCourId id;

    @MapsId("filiereId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "filiere_id", nullable = false)
    private Filiere filiere;

    @MapsId("coursId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "cours_id", nullable = false)
    private Cour cours;

    public FiliereCourId getId() {
        return id;
    }

    public void setId(FiliereCourId id) {
        this.id = id;
    }

    public Filiere getFiliere() {
        return filiere;
    }

    public void setFiliere(Filiere filiere) {
        this.filiere = filiere;
    }

    public Cour getCours() {
        return cours;
    }

    public void setCours(Cour cours) {
        this.cours = cours;
    }

}
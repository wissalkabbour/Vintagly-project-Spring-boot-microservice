package target.demowithentitymanager.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class FiliereCourId implements Serializable {
    private static final long serialVersionUID = -3475485767902009985L;
    @Column(name = "filiere_id", nullable = false)
    private Integer filiereId;

    @Column(name = "cours_id", nullable = false)
    private Integer coursId;

    public Integer getFiliereId() {
        return filiereId;
    }

    public void setFiliereId(Integer filiereId) {
        this.filiereId = filiereId;
    }

    public Integer getCoursId() {
        return coursId;
    }

    public void setCoursId(Integer coursId) {
        this.coursId = coursId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        FiliereCourId entity = (FiliereCourId) o;
        return Objects.equals(this.filiereId, entity.filiereId) &&
                Objects.equals(this.coursId, entity.coursId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(filiereId, coursId);
    }

}
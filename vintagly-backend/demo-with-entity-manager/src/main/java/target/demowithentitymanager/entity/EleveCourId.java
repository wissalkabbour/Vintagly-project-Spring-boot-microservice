package target.demowithentitymanager.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class EleveCourId implements Serializable {
    private static final long serialVersionUID = -2318268544783574246L;
    @Column(name = "eleve_id", nullable = false)
    private Integer eleveId;

    @Column(name = "cours_id", nullable = false)
    private Integer coursId;

    public Integer getEleveId() {
        return eleveId;
    }

    public void setEleveId(Integer eleveId) {
        this.eleveId = eleveId;
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
        EleveCourId entity = (EleveCourId) o;
        return Objects.equals(this.coursId, entity.coursId) &&
                Objects.equals(this.eleveId, entity.eleveId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(coursId, eleveId);
    }

}
package target.demowithentitymanager.dao;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import target.demowithentitymanager.entity.Eleve;

import java.util.List;

public class EleveDAO implements IDao<Eleve, Long> {

    @PersistenceContext
    private EntityManager em;

    @Override
    public List<Eleve> findAll() {
        return em.createQuery("SELECT e FROM Eleve e", Eleve.class)
                .getResultList();
    }

    @Override
    public Eleve findById(Long id) {
        return em.find(Eleve.class, id);
    }

    @Override
    public boolean create(Eleve entity) {
        try {
            em.persist(entity);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean update(Eleve entity) {
        try {
            em.merge(entity);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean delete(String matricule) {
        try {
            TypedQuery<Eleve> query = em.createQuery(
                    "SELECT e FROM Eleve e WHERE e.matricule = :matricule", Eleve.class);
            query.setParameter("matricule", matricule);
            Eleve e = query.getSingleResult();
            if (e != null) {
                em.remove(e);
                return true;
            }
            return false;
        } catch (Exception ex) {
            return false;
        }
    }
}

package target.demowithentitymanager.dao;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import target.demowithentitymanager.entity.Filiere;

import java.util.List;

public class FiliereDAO implements IDao<Filiere, Long> {

    @PersistenceContext
    private EntityManager em;

    @Override
    public List<Filiere> findAll() {
        return em.createQuery("SELECT f FROM Filiere f", Filiere.class)
                .getResultList();
    }

    @Override
    public Filiere findById(Long id) {
        return em.find(Filiere.class, id);
    }

    @Override
    public boolean create(Filiere entity) {
        try {
            em.persist(entity);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean update(Filiere entity) {
        try {
            em.merge(entity);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean delete(String code) {
        try {
            TypedQuery<Filiere> query = em.createQuery(
                    "SELECT f FROM Filiere f WHERE f.code = :code", Filiere.class);
            query.setParameter("code", code);
            Filiere f = query.getSingleResult();
            if (f != null) {
                em.remove(f);
                return true;
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }
}

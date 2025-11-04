package target.demowithentitymanager.dao;

import java.util.List;

public interface IDao<T,Pk> {
    List<T> findAll();
    T findById(Pk Id);
    boolean create(T entity);
    boolean update(T entity);
    boolean delete(String code);
}

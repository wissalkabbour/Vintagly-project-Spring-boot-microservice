package com.example.repositories;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.entities.Categorie;

@Repository
public interface CategorieRepository extends JpaRepository<Categorie, Long>{

}

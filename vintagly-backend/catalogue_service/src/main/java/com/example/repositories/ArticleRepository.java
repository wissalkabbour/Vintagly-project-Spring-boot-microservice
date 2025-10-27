package com.example.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.entities.Article;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
}

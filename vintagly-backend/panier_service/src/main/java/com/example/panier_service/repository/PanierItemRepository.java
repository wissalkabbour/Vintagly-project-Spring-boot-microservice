package com.example.panier_service.repository;

import com.example.panier_service.entity.PanierItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PanierItemRepository extends JpaRepository<PanierItem, Long> {
    List<PanierItem> findByPanierId(Long panierId);
}

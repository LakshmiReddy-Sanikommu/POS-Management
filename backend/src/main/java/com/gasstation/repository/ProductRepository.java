package com.gasstation.repository;

import com.gasstation.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    Optional<Product> findByBarcode(String barcode);
    
    List<Product> findByActiveTrue();
    
    List<Product> findByCategoryId(Long categoryId);
    
    @Query("SELECT p FROM Product p WHERE p.currentStock <= p.reorderThreshold AND p.active = true")
    List<Product> findLowStockProducts();
    
    Boolean existsByBarcode(String barcode);
    
    @Query("SELECT p FROM Product p WHERE p.name LIKE %:name% AND p.active = true")
    List<Product> findByNameContaining(String name);
} 
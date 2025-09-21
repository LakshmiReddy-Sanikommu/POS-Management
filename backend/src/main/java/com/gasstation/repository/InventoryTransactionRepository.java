package com.gasstation.repository;

import com.gasstation.entity.InventoryTransaction;
import com.gasstation.entity.InventoryTransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {
    
    List<InventoryTransaction> findByProductId(Long productId);
    
    List<InventoryTransaction> findByTransactionType(InventoryTransactionType transactionType);
    
    List<InventoryTransaction> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT it FROM InventoryTransaction it WHERE it.product.id = :productId ORDER BY it.createdAt DESC")
    List<InventoryTransaction> findByProductIdOrderByCreatedAtDesc(@Param("productId") Long productId);
} 
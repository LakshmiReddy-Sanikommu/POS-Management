package com.gasstation.repository;

import com.gasstation.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findByTransactionDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Transaction> findByCashierId(Long cashierId);
    
    @Query("SELECT SUM(t.totalAmount) FROM Transaction t WHERE t.transactionDate >= :startDate")
    BigDecimal getTotalSalesFromDate(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT t FROM Transaction t WHERE t.transactionDate >= :startOfDay AND t.transactionDate < :endOfDay")
    List<Transaction> findByTransactionDate(@Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);
    
    @Query("SELECT COALESCE(SUM(t.totalAmount), 0) FROM Transaction t WHERE t.transactionDate >= CURRENT_DATE")
    BigDecimal getTodaysTotalSales();

    @Query("SELECT DISTINCT t FROM Transaction t " +
           "LEFT JOIN FETCH t.items ti " +
           "LEFT JOIN FETCH ti.product p " +
           "LEFT JOIN FETCH p.category " +
           "LEFT JOIN FETCH t.cashier")
    List<Transaction> findAllWithItemsAndProducts();

    @Query("SELECT DISTINCT t FROM Transaction t " +
           "LEFT JOIN FETCH t.items ti " +
           "LEFT JOIN FETCH ti.product p " +
           "LEFT JOIN FETCH p.category " +
           "LEFT JOIN FETCH t.cashier " +
           "WHERE t.id = :id")
    Optional<Transaction> findByIdWithItemsAndProducts(@Param("id") Long id);
} 
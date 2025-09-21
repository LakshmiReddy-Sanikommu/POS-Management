package com.gasstation.repository;

import com.gasstation.entity.LotteryGame;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LotteryGameRepository extends JpaRepository<LotteryGame, Long> {
    
    Optional<LotteryGame> findByBarcode(String barcode);
    
    List<LotteryGame> findByActiveTrue();
    
    Boolean existsByBarcode(String barcode);
} 
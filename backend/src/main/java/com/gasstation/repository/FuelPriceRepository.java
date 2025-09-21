package com.gasstation.repository;

import com.gasstation.entity.FuelPrice;
import com.gasstation.entity.FuelType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FuelPriceRepository extends JpaRepository<FuelPrice, Long> {
    
    List<FuelPrice> findByFuelType(FuelType fuelType);
    
    @Query("SELECT fp FROM FuelPrice fp WHERE fp.fuelType = :fuelType AND fp.active = true ORDER BY fp.effectiveDate DESC")
    Optional<FuelPrice> findCurrentPriceByFuelType(@Param("fuelType") FuelType fuelType);
    
    List<FuelPrice> findByActiveTrue();
} 
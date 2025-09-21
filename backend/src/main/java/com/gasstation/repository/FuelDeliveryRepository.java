package com.gasstation.repository;

import com.gasstation.entity.FuelDelivery;
import com.gasstation.entity.FuelType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FuelDeliveryRepository extends JpaRepository<FuelDelivery, Long> {
    
    List<FuelDelivery> findByFuelType(FuelType fuelType);
    
    List<FuelDelivery> findByDeliveryDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<FuelDelivery> findBySupplierName(String supplierName);
} 
package com.gasstation.repository;

import com.gasstation.entity.ServiceLog;
import com.gasstation.entity.ServiceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ServiceLogRepository extends JpaRepository<ServiceLog, Long> {
    
    List<ServiceLog> findByServiceType(ServiceType serviceType);
    
    List<ServiceLog> findByServiceDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<ServiceLog> findByHandledById(Long handledById);
    
    @Query("SELECT SUM(sl.amount) FROM ServiceLog sl WHERE sl.serviceDate >= :startDate")
    BigDecimal getTotalServiceAmountFromDate(@Param("startDate") LocalDateTime startDate);
} 
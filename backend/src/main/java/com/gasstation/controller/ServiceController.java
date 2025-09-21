package com.gasstation.controller;

import com.gasstation.entity.ServiceLog;
import com.gasstation.repository.ServiceLogRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ServiceController {

    @Autowired
    private ServiceLogRepository serviceLogRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CASHIER')")
    public ResponseEntity<List<ServiceLog>> getAllServiceLogs() {
        try {
            List<ServiceLog> serviceLogs = serviceLogRepository.findAll();
            return ResponseEntity.ok(serviceLogs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CASHIER')")
    public ResponseEntity<ServiceLog> getServiceLogById(@PathVariable Long id) {
        Optional<ServiceLog> serviceLog = serviceLogRepository.findById(id);
        return serviceLog.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CASHIER')")
    public ServiceLog createServiceLog(@Valid @RequestBody ServiceLog serviceLog) {
        return serviceLogRepository.save(serviceLog);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ServiceLog> updateServiceLog(@PathVariable Long id, @Valid @RequestBody ServiceLog serviceLogDetails) {
        Optional<ServiceLog> serviceLogOptional = serviceLogRepository.findById(id);
        
        if (serviceLogOptional.isPresent()) {
            ServiceLog serviceLog = serviceLogOptional.get();
            serviceLog.setServiceType(serviceLogDetails.getServiceType());
            serviceLog.setAmount(serviceLogDetails.getAmount());
            serviceLog.setCustomerReference(serviceLogDetails.getCustomerReference());
            serviceLog.setNotes(serviceLogDetails.getNotes());
            return ResponseEntity.ok(serviceLogRepository.save(serviceLog));
        }
        
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<?> deleteServiceLog(@PathVariable Long id) {
        if (serviceLogRepository.existsById(id)) {
            serviceLogRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
} 
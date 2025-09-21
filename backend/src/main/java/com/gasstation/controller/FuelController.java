package com.gasstation.controller;

import com.gasstation.entity.FuelDelivery;
import com.gasstation.entity.FuelPrice;
import com.gasstation.repository.FuelDeliveryRepository;
import com.gasstation.repository.FuelPriceRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/fuel")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FuelController {

    @Autowired
    private FuelDeliveryRepository fuelDeliveryRepository;

    @Autowired
    private FuelPriceRepository fuelPriceRepository;

    // Fuel Deliveries
    @GetMapping("/deliveries")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<FuelDelivery>> getAllFuelDeliveries() {
        try {
            List<FuelDelivery> deliveries = fuelDeliveryRepository.findAll();
            return ResponseEntity.ok(deliveries);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/deliveries/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<FuelDelivery> getFuelDeliveryById(@PathVariable Long id) {
        Optional<FuelDelivery> delivery = fuelDeliveryRepository.findById(id);
        return delivery.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/deliveries")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public FuelDelivery createFuelDelivery(@Valid @RequestBody FuelDelivery delivery) {
        return fuelDeliveryRepository.save(delivery);
    }

    @PutMapping("/deliveries/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<FuelDelivery> updateFuelDelivery(@PathVariable Long id, @Valid @RequestBody FuelDelivery deliveryDetails) {
        Optional<FuelDelivery> deliveryOptional = fuelDeliveryRepository.findById(id);
        
        if (deliveryOptional.isPresent()) {
            FuelDelivery delivery = deliveryOptional.get();
            delivery.setFuelType(deliveryDetails.getFuelType());
            delivery.setGallons(deliveryDetails.getGallons());
            delivery.setDeliveryDate(deliveryDetails.getDeliveryDate());
            delivery.setCostPerGallon(deliveryDetails.getCostPerGallon());
            delivery.setSupplierName(deliveryDetails.getSupplierName());
            delivery.setDeliveryTicketNumber(deliveryDetails.getDeliveryTicketNumber());
            return ResponseEntity.ok(fuelDeliveryRepository.save(delivery));
        }
        
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/deliveries/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<?> deleteFuelDelivery(@PathVariable Long id) {
        if (fuelDeliveryRepository.existsById(id)) {
            fuelDeliveryRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Fuel Prices
    @GetMapping("/prices")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CASHIER')")
    public ResponseEntity<List<FuelPrice>> getAllFuelPrices() {
        try {
            List<FuelPrice> prices = fuelPriceRepository.findAll();
            return ResponseEntity.ok(prices);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/prices/current")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CASHIER')")
    public List<FuelPrice> getCurrentFuelPrices() {
        return fuelPriceRepository.findAll();
    }

    @PostMapping("/prices")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public FuelPrice createFuelPrice(@Valid @RequestBody FuelPrice price) {
        return fuelPriceRepository.save(price);
    }

    @PutMapping("/prices/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<FuelPrice> updateFuelPrice(@PathVariable Long id, @Valid @RequestBody FuelPrice priceDetails) {
        Optional<FuelPrice> priceOptional = fuelPriceRepository.findById(id);
        
        if (priceOptional.isPresent()) {
            FuelPrice price = priceOptional.get();
            price.setFuelType(priceDetails.getFuelType());
            price.setPricePerGallon(priceDetails.getPricePerGallon());
            price.setEffectiveDate(priceDetails.getEffectiveDate());
            return ResponseEntity.ok(fuelPriceRepository.save(price));
        }
        
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/prices/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<?> deleteFuelPrice(@PathVariable Long id) {
        if (fuelPriceRepository.existsById(id)) {
            fuelPriceRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
} 
package com.gasstation.controller;

import com.gasstation.entity.Promotion;
import com.gasstation.repository.PromotionRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/promotions")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PromotionController {

    @Autowired
    private PromotionRepository promotionRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public List<Promotion> getAllPromotions() {
        return promotionRepository.findAll();
    }

    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CASHIER')")
    public List<Promotion> getActivePromotions() {
        return promotionRepository.findActivePromotions(LocalDateTime.now());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Promotion> getPromotionById(@PathVariable Long id) {
        Optional<Promotion> promotion = promotionRepository.findById(id);
        return promotion.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public Promotion createPromotion(@Valid @RequestBody Promotion promotion) {
        return promotionRepository.save(promotion);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Promotion> updatePromotion(@PathVariable Long id, @Valid @RequestBody Promotion promotionDetails) {
        Optional<Promotion> promotionOptional = promotionRepository.findById(id);
        
        if (promotionOptional.isPresent()) {
            Promotion promotion = promotionOptional.get();
            promotion.setName(promotionDetails.getName());
            promotion.setDescription(promotionDetails.getDescription());
            promotion.setPromotionType(promotionDetails.getPromotionType());
            promotion.setDiscountValue(promotionDetails.getDiscountValue());
            promotion.setStartDate(promotionDetails.getStartDate());
            promotion.setEndDate(promotionDetails.getEndDate());
            promotion.setActive(promotionDetails.getActive());
            promotion.setMinPurchaseAmount(promotionDetails.getMinPurchaseAmount());
            return ResponseEntity.ok(promotionRepository.save(promotion));
        }
        
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<?> deletePromotion(@PathVariable Long id) {
        if (promotionRepository.existsById(id)) {
            promotionRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
} 
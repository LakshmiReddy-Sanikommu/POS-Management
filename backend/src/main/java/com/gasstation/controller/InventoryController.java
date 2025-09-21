package com.gasstation.controller;

import com.gasstation.entity.InventoryTransaction;
import com.gasstation.repository.InventoryTransactionRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*", maxAge = 3600)
public class InventoryController {

    @Autowired
    private InventoryTransactionRepository inventoryTransactionRepository;

    @GetMapping("/transactions")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public List<InventoryTransaction> getAllInventoryTransactions() {
        return inventoryTransactionRepository.findAll();
    }

    @GetMapping("/transactions/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<InventoryTransaction> getInventoryTransactionById(@PathVariable Long id) {
        Optional<InventoryTransaction> transaction = inventoryTransactionRepository.findById(id);
        return transaction.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/transactions")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public InventoryTransaction createInventoryTransaction(@Valid @RequestBody InventoryTransaction transaction) {
        return inventoryTransactionRepository.save(transaction);
    }

    @PutMapping("/transactions/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<InventoryTransaction> updateInventoryTransaction(@PathVariable Long id, @Valid @RequestBody InventoryTransaction transactionDetails) {
        Optional<InventoryTransaction> transactionOptional = inventoryTransactionRepository.findById(id);
        
        if (transactionOptional.isPresent()) {
            InventoryTransaction transaction = transactionOptional.get();
            transaction.setProduct(transactionDetails.getProduct());
            transaction.setTransactionType(transactionDetails.getTransactionType());
            transaction.setQuantity(transactionDetails.getQuantity());

            transaction.setNotes(transactionDetails.getNotes());
            return ResponseEntity.ok(inventoryTransactionRepository.save(transaction));
        }
        
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/transactions/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<?> deleteInventoryTransaction(@PathVariable Long id) {
        if (inventoryTransactionRepository.existsById(id)) {
            inventoryTransactionRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
} 
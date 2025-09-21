package com.gasstation.controller;

import com.gasstation.entity.Transaction;
import com.gasstation.entity.TransactionItem;
import com.gasstation.entity.User;
import com.gasstation.repository.TransactionRepository;
import com.gasstation.repository.ProductRepository;
import com.gasstation.repository.UserRepository;
import com.gasstation.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pos")
@CrossOrigin(origins = "*", maxAge = 3600)
public class POSController {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/transactions")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CASHIER')")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        try {
            List<Transaction> transactions = transactionRepository.findAllWithItemsAndProducts();
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/transactions/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CASHIER')")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        Optional<Transaction> transaction = transactionRepository.findByIdWithItemsAndProducts(id);
        return transaction.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/transactions")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CASHIER')")
    public Transaction createTransaction(@Valid @RequestBody Transaction transaction) {
        // Get current authenticated user and set as cashier
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User currentUser = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Current user not found"));
        transaction.setCashier(currentUser);
        
        // Generate transaction number if not provided
        if (transaction.getTransactionNumber() == null || transaction.getTransactionNumber().isEmpty()) {
            String transactionNumber = generateTransactionNumber();
            transaction.setTransactionNumber(transactionNumber);
        }
        
        // Calculate totals
        calculateTransactionTotals(transaction);
        return transactionRepository.save(transaction);
    }

    @PutMapping("/transactions/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CASHIER')")
    public ResponseEntity<Transaction> updateTransaction(@PathVariable Long id, @Valid @RequestBody Transaction transactionDetails) {
        Optional<Transaction> transactionOptional = transactionRepository.findById(id);
        
        if (transactionOptional.isPresent()) {
            Transaction transaction = transactionOptional.get();
            transaction.setItems(transactionDetails.getItems());
            transaction.setPaymentMethod(transactionDetails.getPaymentMethod());
            transaction.setStatus(transactionDetails.getStatus());
            calculateTransactionTotals(transaction);
            return ResponseEntity.ok(transactionRepository.save(transaction));
        }
        
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/transactions/{id}/complete")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CASHIER')")
    public ResponseEntity<Transaction> completeTransaction(@PathVariable Long id) {
        Optional<Transaction> transactionOptional = transactionRepository.findById(id);
        
        if (transactionOptional.isPresent()) {
            Transaction transaction = transactionOptional.get();
            transaction.setStatus(com.gasstation.entity.TransactionStatus.COMPLETED);
            return ResponseEntity.ok(transactionRepository.save(transaction));
        }
        
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/transactions/{id}/void")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Transaction> voidTransaction(@PathVariable Long id) {
        Optional<Transaction> transactionOptional = transactionRepository.findById(id);
        
        if (transactionOptional.isPresent()) {
            Transaction transaction = transactionOptional.get();
            transaction.setStatus(com.gasstation.entity.TransactionStatus.CANCELLED);
            return ResponseEntity.ok(transactionRepository.save(transaction));
        }
        
        return ResponseEntity.notFound().build();
    }



    private void calculateTransactionTotals(Transaction transaction) {
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal taxAmount = BigDecimal.ZERO;
        
        for (TransactionItem item : transaction.getItems()) {
            BigDecimal itemTotal = item.getUnitPrice().multiply(new BigDecimal(item.getQuantity()));
            subtotal = subtotal.add(itemTotal);
            
            // Calculate tax if product has tax rate
            if (item.getProduct() != null && item.getProduct().getCategory() != null) {
                BigDecimal taxRate = item.getProduct().getCategory().getTaxRate();
                if (taxRate != null) {
                    BigDecimal itemTax = itemTotal.multiply(taxRate.divide(new BigDecimal("100")));
                    taxAmount = taxAmount.add(itemTax);
                }
            }
        }
        
        transaction.setSubtotal(subtotal);
        transaction.setTaxAmount(taxAmount);
        transaction.setTotalAmount(subtotal.add(taxAmount));
    }

    private String generateTransactionNumber() {
        // Generate a unique transaction number based on current timestamp
        long timestamp = System.currentTimeMillis();
        return "TXN-" + String.valueOf(timestamp).substring(6); // Use last 7 digits for shorter number
    }
} 
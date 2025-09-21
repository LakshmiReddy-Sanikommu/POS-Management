package com.gasstation.controller;

import com.gasstation.entity.Product;
import com.gasstation.repository.ProductRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CASHIER')")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CASHIER')")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productRepository.findById(id);
        return product.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/barcode/{barcode}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CASHIER')")
    public ResponseEntity<Product> getProductByBarcode(@PathVariable String barcode) {
        Optional<Product> product = productRepository.findByBarcode(barcode);
        return product.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public List<Product> getLowStockProducts() {
        return productRepository.findLowStockProducts();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public Product createProduct(@Valid @RequestBody Product product) {
        return productRepository.save(product);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @Valid @RequestBody Product productDetails) {
        Optional<Product> productOptional = productRepository.findById(id);
        
        if (productOptional.isPresent()) {
            Product product = productOptional.get();
            product.setName(productDetails.getName());
            product.setBarcode(productDetails.getBarcode());
            product.setPrice(productDetails.getPrice());
            product.setCost(productDetails.getCost());
            product.setCurrentStock(productDetails.getCurrentStock());
            product.setReorderThreshold(productDetails.getReorderThreshold());
            product.setCategory(productDetails.getCategory());
            product.setActive(productDetails.getActive());
            return ResponseEntity.ok(productRepository.save(product));
        }
        
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
} 
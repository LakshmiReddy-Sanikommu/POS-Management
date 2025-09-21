package com.gasstation.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categories")
public class Category extends BaseEntity {

    @NotBlank
    @Size(max = 100)
    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @DecimalMin(value = "0.0", inclusive = true)
    @Column(name = "tax_rate", nullable = false, precision = 6, scale = 2)
    private BigDecimal taxRate = BigDecimal.ZERO;

    @Column(name = "description")
    private String description;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Product> products = new ArrayList<>();

    // Constructors
    public Category() {}

    public Category(String name, BigDecimal taxRate) {
        this.name = name;
        this.taxRate = taxRate;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getTaxRate() {
        return taxRate;
    }

    public void setTaxRate(BigDecimal taxRate) {
        this.taxRate = taxRate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }
} 
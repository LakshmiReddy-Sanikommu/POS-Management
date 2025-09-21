package com.gasstation.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product extends BaseEntity {

    @NotBlank
    @Size(max = 100)
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "barcode", unique = true)
    private String barcode;

    @DecimalMin(value = "0.0", inclusive = true)
    @Column(name = "cost", nullable = false, precision = 10, scale = 2)
    private BigDecimal cost = BigDecimal.ZERO;

    @DecimalMin(value = "0.0", inclusive = true)
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price = BigDecimal.ZERO;

    @Min(0)
    @Column(name = "current_stock", nullable = false)
    private Integer currentStock = 0;

    @Min(0)
    @Column(name = "reorder_threshold", nullable = false)
    private Integer reorderThreshold = 0;

    @Column(name = "food_stamp_eligible", nullable = false)
    private Boolean foodStampEligible = false;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @Column(name = "description")
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<InventoryTransaction> inventoryTransactions = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<TransactionItem> transactionItems = new ArrayList<>();

    // Constructors
    public Product() {}

    public Product(String name, String barcode, BigDecimal cost, BigDecimal price, Category category) {
        this.name = name;
        this.barcode = barcode;
        this.cost = cost;
        this.price = price;
        this.category = category;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public BigDecimal getCost() {
        return cost;
    }

    public void setCost(BigDecimal cost) {
        this.cost = cost;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getCurrentStock() {
        return currentStock;
    }

    public void setCurrentStock(Integer currentStock) {
        this.currentStock = currentStock;
    }

    public Integer getReorderThreshold() {
        return reorderThreshold;
    }

    public void setReorderThreshold(Integer reorderThreshold) {
        this.reorderThreshold = reorderThreshold;
    }

    public Boolean getFoodStampEligible() {
        return foodStampEligible;
    }

    public void setFoodStampEligible(Boolean foodStampEligible) {
        this.foodStampEligible = foodStampEligible;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public List<InventoryTransaction> getInventoryTransactions() {
        return inventoryTransactions;
    }

    public void setInventoryTransactions(List<InventoryTransaction> inventoryTransactions) {
        this.inventoryTransactions = inventoryTransactions;
    }

    public List<TransactionItem> getTransactionItems() {
        return transactionItems;
    }

    public void setTransactionItems(List<TransactionItem> transactionItems) {
        this.transactionItems = transactionItems;
    }

    // Business Methods
    public BigDecimal getMargin() {
        if (cost.equals(BigDecimal.ZERO)) {
            return BigDecimal.ZERO;
        }
        return price.subtract(cost);
    }

    public BigDecimal getMarginPercentage() {
        if (cost.equals(BigDecimal.ZERO)) {
            return BigDecimal.ZERO;
        }
        return getMargin().divide(cost, 4, BigDecimal.ROUND_HALF_UP).multiply(new BigDecimal("100"));
    }

    public boolean isLowStock() {
        return currentStock <= reorderThreshold;
    }
} 
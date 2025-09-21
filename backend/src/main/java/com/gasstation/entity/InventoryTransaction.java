package com.gasstation.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "inventory_transactions")
public class InventoryTransaction extends BaseEntity {

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false)
    private InventoryTransactionType transactionType;

    @Min(0)
    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "notes")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Constructors
    public InventoryTransaction() {}

    public InventoryTransaction(InventoryTransactionType transactionType, Integer quantity, Product product, User user) {
        this.transactionType = transactionType;
        this.quantity = quantity;
        this.product = product;
        this.user = user;
    }

    // Getters and Setters
    public InventoryTransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(InventoryTransactionType transactionType) {
        this.transactionType = transactionType;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
} 
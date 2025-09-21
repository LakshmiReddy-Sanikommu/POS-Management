package com.gasstation.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "fuel_deliveries")
public class FuelDelivery extends BaseEntity {

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "fuel_type", nullable = false)
    private FuelType fuelType;

    @DecimalMin(value = "0.0", inclusive = true)
    @Column(name = "gallons", nullable = false, precision = 10, scale = 3)
    private BigDecimal gallons;

    @DecimalMin(value = "0.0", inclusive = true)
    @Column(name = "cost_per_gallon", nullable = false, precision = 10, scale = 4)
    private BigDecimal costPerGallon;

    @DecimalMin(value = "0.0", inclusive = true)
    @Column(name = "total_cost", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalCost;

    @NotNull
    @Column(name = "delivery_date", nullable = false)
    private LocalDateTime deliveryDate;

    @Size(max = 100)
    @Column(name = "supplier_name")
    private String supplierName;

    @Size(max = 50)
    @Column(name = "delivery_ticket_number")
    private String deliveryTicketNumber;

    @Column(name = "notes")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "received_by", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User receivedBy;

    // Constructors
    public FuelDelivery() {
        this.deliveryDate = LocalDateTime.now();
    }

    public FuelDelivery(FuelType fuelType, BigDecimal gallons, BigDecimal costPerGallon, User receivedBy) {
        this();
        this.fuelType = fuelType;
        this.gallons = gallons;
        this.costPerGallon = costPerGallon;
        this.receivedBy = receivedBy;
        this.totalCost = gallons.multiply(costPerGallon);
    }

    // Getters and Setters
    public FuelType getFuelType() {
        return fuelType;
    }

    public void setFuelType(FuelType fuelType) {
        this.fuelType = fuelType;
    }

    public BigDecimal getGallons() {
        return gallons;
    }

    public void setGallons(BigDecimal gallons) {
        this.gallons = gallons;
    }

    public BigDecimal getCostPerGallon() {
        return costPerGallon;
    }

    public void setCostPerGallon(BigDecimal costPerGallon) {
        this.costPerGallon = costPerGallon;
    }

    public BigDecimal getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
    }

    public LocalDateTime getDeliveryDate() {
        return deliveryDate;
    }

    public void setDeliveryDate(LocalDateTime deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public String getDeliveryTicketNumber() {
        return deliveryTicketNumber;
    }

    public void setDeliveryTicketNumber(String deliveryTicketNumber) {
        this.deliveryTicketNumber = deliveryTicketNumber;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public User getReceivedBy() {
        return receivedBy;
    }

    public void setReceivedBy(User receivedBy) {
        this.receivedBy = receivedBy;
    }

    // Business Methods
    public void calculateTotalCost() {
        this.totalCost = gallons.multiply(costPerGallon);
    }
} 
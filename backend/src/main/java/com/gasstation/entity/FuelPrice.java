package com.gasstation.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "fuel_prices")
public class FuelPrice extends BaseEntity {

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "fuel_type", nullable = false)
    private FuelType fuelType;

    @DecimalMin(value = "0.0", inclusive = true)
    @Column(name = "price_per_gallon", nullable = false, precision = 10, scale = 4)
    private BigDecimal pricePerGallon;

    @NotNull
    @Column(name = "effective_date", nullable = false)
    private LocalDateTime effectiveDate;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User updatedBy;

    // Constructors
    public FuelPrice() {
        this.effectiveDate = LocalDateTime.now();
    }

    public FuelPrice(FuelType fuelType, BigDecimal pricePerGallon, User updatedBy) {
        this();
        this.fuelType = fuelType;
        this.pricePerGallon = pricePerGallon;
        this.updatedBy = updatedBy;
    }

    // Getters and Setters
    public FuelType getFuelType() {
        return fuelType;
    }

    public void setFuelType(FuelType fuelType) {
        this.fuelType = fuelType;
    }

    public BigDecimal getPricePerGallon() {
        return pricePerGallon;
    }

    public void setPricePerGallon(BigDecimal pricePerGallon) {
        this.pricePerGallon = pricePerGallon;
    }

    public LocalDateTime getEffectiveDate() {
        return effectiveDate;
    }

    public void setEffectiveDate(LocalDateTime effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public User getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(User updatedBy) {
        this.updatedBy = updatedBy;
    }
} 
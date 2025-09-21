package com.gasstation.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_logs")
public class ServiceLog extends BaseEntity {

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "service_type", nullable = false)
    private ServiceType serviceType;

    @DecimalMin(value = "0.0", inclusive = true)
    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Size(max = 100)
    @Column(name = "customer_reference")
    private String customerReference;

    @Column(name = "notes")
    private String notes;

    @NotNull
    @Column(name = "service_date", nullable = false)
    private LocalDateTime serviceDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "handled_by", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User handledBy;

    // Constructors
    public ServiceLog() {
        this.serviceDate = LocalDateTime.now();
    }

    public ServiceLog(ServiceType serviceType, BigDecimal amount, User handledBy) {
        this();
        this.serviceType = serviceType;
        this.amount = amount;
        this.handledBy = handledBy;
    }

    // Getters and Setters
    public ServiceType getServiceType() {
        return serviceType;
    }

    public void setServiceType(ServiceType serviceType) {
        this.serviceType = serviceType;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCustomerReference() {
        return customerReference;
    }

    public void setCustomerReference(String customerReference) {
        this.customerReference = customerReference;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getServiceDate() {
        return serviceDate;
    }

    public void setServiceDate(LocalDateTime serviceDate) {
        this.serviceDate = serviceDate;
    }

    public User getHandledBy() {
        return handledBy;
    }

    public void setHandledBy(User handledBy) {
        this.handledBy = handledBy;
    }
} 
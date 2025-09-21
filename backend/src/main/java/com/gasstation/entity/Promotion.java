package com.gasstation.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "promotions")
public class Promotion extends BaseEntity {

    @NotBlank
    @Size(max = 100)
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "promotion_type", nullable = false)
    private PromotionType promotionType;

    @DecimalMin(value = "0.0", inclusive = true)
    @Column(name = "discount_value", nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue = BigDecimal.ZERO;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @NotNull
    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @Column(name = "min_purchase_amount", precision = 10, scale = 2)
    private BigDecimal minPurchaseAmount;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "eligible_product_ids", columnDefinition = "json")
    private List<Long> eligibleProductIds = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "eligible_category_ids", columnDefinition = "json")
    private List<Long> eligibleCategoryIds = new ArrayList<>();

    // Constructors
    public Promotion() {}

    public Promotion(String name, PromotionType promotionType, BigDecimal discountValue, 
                    LocalDateTime startDate, LocalDateTime endDate) {
        this.name = name;
        this.promotionType = promotionType;
        this.discountValue = discountValue;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public PromotionType getPromotionType() {
        return promotionType;
    }

    public void setPromotionType(PromotionType promotionType) {
        this.promotionType = promotionType;
    }

    public BigDecimal getDiscountValue() {
        return discountValue;
    }

    public void setDiscountValue(BigDecimal discountValue) {
        this.discountValue = discountValue;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public BigDecimal getMinPurchaseAmount() {
        return minPurchaseAmount;
    }

    public void setMinPurchaseAmount(BigDecimal minPurchaseAmount) {
        this.minPurchaseAmount = minPurchaseAmount;
    }

    public List<Long> getEligibleProductIds() {
        return eligibleProductIds;
    }

    public void setEligibleProductIds(List<Long> eligibleProductIds) {
        this.eligibleProductIds = eligibleProductIds;
    }

    public List<Long> getEligibleCategoryIds() {
        return eligibleCategoryIds;
    }

    public void setEligibleCategoryIds(List<Long> eligibleCategoryIds) {
        this.eligibleCategoryIds = eligibleCategoryIds;
    }

    // Business Methods
    public boolean isActive() {
        LocalDateTime now = LocalDateTime.now();
        return active && now.isAfter(startDate) && now.isBefore(endDate);
    }

    public BigDecimal calculateDiscount(BigDecimal amount) {
        if (!isActive()) {
            return BigDecimal.ZERO;
        }
        
        if (minPurchaseAmount != null && amount.compareTo(minPurchaseAmount) < 0) {
            return BigDecimal.ZERO;
        }
        
        if (promotionType == PromotionType.PERCENTAGE) {
            return amount.multiply(discountValue.divide(new BigDecimal("100")));
        } else {
            return discountValue;
        }
    }
} 
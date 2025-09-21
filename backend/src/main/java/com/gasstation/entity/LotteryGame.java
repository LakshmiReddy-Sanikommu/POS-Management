package com.gasstation.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

@Entity
@Table(name = "lottery_games")
public class LotteryGame extends BaseEntity {

    @NotBlank
    @Size(max = 100)
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "barcode", unique = true)
    private String barcode;

    @Min(1)
    @Column(name = "pack_count", nullable = false)
    private Integer packCount;

    @DecimalMin(value = "0.0", inclusive = true)
    @Column(name = "ticket_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal ticketPrice;

    @DecimalMin(value = "0.0", inclusive = true)
    @Column(name = "pack_cost", nullable = false, precision = 10, scale = 2)
    private BigDecimal packCost;

    @Min(0)
    @Column(name = "current_stock", nullable = false)
    private Integer currentStock = 0;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @Column(name = "description")
    private String description;

    // Constructors
    public LotteryGame() {}

    public LotteryGame(String name, String barcode, Integer packCount, BigDecimal ticketPrice, BigDecimal packCost) {
        this.name = name;
        this.barcode = barcode;
        this.packCount = packCount;
        this.ticketPrice = ticketPrice;
        this.packCost = packCost;
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

    public Integer getPackCount() {
        return packCount;
    }

    public void setPackCount(Integer packCount) {
        this.packCount = packCount;
    }

    public BigDecimal getTicketPrice() {
        return ticketPrice;
    }

    public void setTicketPrice(BigDecimal ticketPrice) {
        this.ticketPrice = ticketPrice;
    }

    public BigDecimal getPackCost() {
        return packCost;
    }

    public void setPackCost(BigDecimal packCost) {
        this.packCost = packCost;
    }

    public Integer getCurrentStock() {
        return currentStock;
    }

    public void setCurrentStock(Integer currentStock) {
        this.currentStock = currentStock;
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

    // Business Methods
    public BigDecimal getPackValue() {
        return ticketPrice.multiply(new BigDecimal(packCount));
    }

    public BigDecimal getPackProfit() {
        return getPackValue().subtract(packCost);
    }
} 
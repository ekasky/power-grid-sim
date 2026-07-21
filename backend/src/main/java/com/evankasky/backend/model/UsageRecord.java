package com.evankasky.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Entity
@Table(
        name = "usage_record",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_usage_record_customer_cycle",
                columnNames = {"customer_id", "billing_cycle_id"}
        )
)
public class UsageRecord {

    @Id
    @GeneratedValue
    @UuidGenerator(style = UuidGenerator.Style.VERSION_7)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "kwh_used", nullable = false, precision = 12, scale = 4)
    private BigDecimal kwhUsed;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "billing_cycle_id", nullable = false, updatable = false)
    private BillingCycle billingCycle;

    @Column(name = "billing_rate", nullable = false, precision = 12, scale = 4)
    private BigDecimal billingRate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    /* *****************************************************************************************************************
     *                                                  Constructors
     ***************************************************************************************************************** */

    protected UsageRecord() { }

    public UsageRecord(
            BillingCycle billingCycle,
            BigDecimal billingRate,
            BigDecimal kwhUsed,
            Customer customer
    ) {
        this.billingCycle = billingCycle;
        this.billingRate = billingRate;
        this.kwhUsed = kwhUsed;
        this.customer = customer;
    }

    /* *****************************************************************************************************************
     *                                            Usage Record Methods
     ***************************************************************************************************************** */



    /* *****************************************************************************************************************
     *                                               Getters and Setters
     * *****************************************************************************************************************/

    public UUID getId() {
        return id;
    }

    public void setBillingCycle(BillingCycle billingCycle) {
        this.billingCycle = billingCycle;
    }

    public BillingCycle getBillingCycle() {
        return billingCycle;
    }

    public void setBillingRate(BigDecimal billingRate) {
        this.billingRate = billingRate;
    }

    public BigDecimal getBillingRate() {
        return billingRate;
    }

    public void setKwhUsed(BigDecimal kwhUsed) {
        this.kwhUsed = kwhUsed;
    }

    public BigDecimal getKwhUsed() {
        return kwhUsed;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }
}

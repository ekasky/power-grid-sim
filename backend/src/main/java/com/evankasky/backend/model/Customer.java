package com.evankasky.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(
        name = "customers",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_customer_company_account_number",
                columnNames = "account_number"
        )
)
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(
        name = "customer_type",
        discriminatorType = DiscriminatorType.STRING,
        length = 20
)
public abstract class Customer {

    @Id
    @GeneratedValue
    @UuidGenerator(style = UuidGenerator.Style.VERSION_7)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "account_number", nullable = false, length = 100)
    private String accountNumber;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "billing_rate", nullable = false, precision = 19, scale = 4)
    private BigDecimal billingRate;

    @Embedded
    private Location location;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "transformer_id", nullable = false)
    private Transformer transformer;

    /* *****************************************************************************************************************
     *                                                  Constructors
     ***************************************************************************************************************** */

    protected Customer() { }

    protected Customer(
            String accountNumber,
            String name,
            BigDecimal billingRate,
            Location location
    ) {
        this.accountNumber = accountNumber;
        this.name = name;
        this.billingRate = billingRate;
        this.location = location;
    }

    /* *****************************************************************************************************************
     *                                             Customer Transients
     ***************************************************************************************************************** */

    @Transient
    public abstract CustomerType getCustomerType();

    @Transient
    public PowerCompany getPowerCompany() {

        if(transformer == null) {
            return null;
        }

        return transformer.getPowerSubstation().getPowerPlant().getCompany();

    }

    /* *****************************************************************************************************************
     *                                            Customer Methods
     ***************************************************************************************************************** */



    /* *****************************************************************************************************************
     *                                               Getters and Setters
     * *****************************************************************************************************************/

    public UUID getId() {
        return id;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setBillingRate(BigDecimal billingRate) {
        this.billingRate = billingRate;
    }

    public BigDecimal getBillingRate() {
        return billingRate;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Location getLocation() {
        return location;
    }

    public Transformer getTransformer() {
        return transformer;
    }

    public void setTransformer(Transformer transformer) {
        this.transformer = transformer;
    }
}

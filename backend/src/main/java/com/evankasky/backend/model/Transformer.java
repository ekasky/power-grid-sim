package com.evankasky.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(
        name = "transformers",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_transformer_substation_transformer_id",
                columnNames = {"power_substation_id", "transformer_id"}
        )
)
public class Transformer {

    @Id
    @GeneratedValue
    @UuidGenerator(style = UuidGenerator.Style.VERSION_7)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "transformer_id", nullable = false)
    private String transformerId;

    @Column(name = "initial_installation_cost", nullable = false, precision = 19, scale = 4)
    private BigDecimal initialInstallationCost;

    @Column(name = "recurring_maintenance_cost", nullable = false, precision = 19, scale = 4)
    private BigDecimal recurringMaintenanceCost;

    @Embedded
    private Location location;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "power_substation_id", nullable = false)
    private PowerSubstation powerSubstation;

    /* *****************************************************************************************************************
     *                                                  Constructors
     ***************************************************************************************************************** */

    protected Transformer() { }

    public Transformer(
            String transformerId,
            BigDecimal initialInstallationCost,
            BigDecimal recurringMaintenanceCost,
            Location location
    ) {
        this.transformerId = transformerId;
        this.initialInstallationCost = initialInstallationCost;
        this.recurringMaintenanceCost = recurringMaintenanceCost;
        this.location = location;
    }

    /* *****************************************************************************************************************
     *                                             Transformer Methods
     ***************************************************************************************************************** */



    /* *****************************************************************************************************************
     *                                               Getters and Setters
     * *****************************************************************************************************************/

    public UUID getId() {
        return id;
    }

    public void setTransformerId(String transformerId) {
        this.transformerId = transformerId;
    }

    public String getTransformerId() {
        return transformerId;
    }

    public void setInitialInstallationCost(BigDecimal initialInstallationCost) {
        this.initialInstallationCost = initialInstallationCost;
    }

    public BigDecimal getInitialInstallationCost() {
        return initialInstallationCost;
    }

    public void setRecurringMaintenanceCost(BigDecimal recurringMaintenanceCost) {
        this.recurringMaintenanceCost = recurringMaintenanceCost;
    }

    public BigDecimal getRecurringMaintenanceCost() {
        return recurringMaintenanceCost;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Location getLocation() {
        return location;
    }

    public PowerSubstation getPowerSubstation() {
        return powerSubstation;
    }

    public void setPowerSubstation(PowerSubstation powerSubstation) {
        this.powerSubstation = powerSubstation;
    }
}

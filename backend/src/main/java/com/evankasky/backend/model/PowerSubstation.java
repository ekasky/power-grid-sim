package com.evankasky.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(
        name = "power_substations",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_substation_plant_substation_id",
                columnNames = {"power_plant_id", "substation_id"}
        )
)
public class PowerSubstation {

    @Id
    @GeneratedValue
    @UuidGenerator(style = UuidGenerator.Style.VERSION_7)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "substation_id", nullable = false)
    private String substationId;

    @Column(name = "initial_installation_cost", nullable = false, precision = 19, scale = 4)
    private BigDecimal initialInstallationCost;

    @Column(name = "recurring_maintenance_cost", nullable = false, precision = 19, scale = 4)
    private BigDecimal recurringMaintenanceCost;

    @Embedded
    private Location location;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "power_plant_id", nullable = false)
    private PowerPlant powerPlant;

    @OneToMany(mappedBy = "powerSubstation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transformer> transformers = new ArrayList<>();

    /* *****************************************************************************************************************
     *                                                  Constructors
     ***************************************************************************************************************** */

    protected PowerSubstation() { }

    public PowerSubstation(
            String substationId,
            BigDecimal initialBuildCost,
            BigDecimal recurringMaintenanceCost,
            Location location
    ) {
        this.substationId = substationId;
        this.initialInstallationCost = initialBuildCost;
        this.recurringMaintenanceCost = recurringMaintenanceCost;
        this.location = location;
    }

    /* *****************************************************************************************************************
     *                                             Power Substation Methods
     ***************************************************************************************************************** */

    public void addTransformer(Transformer transformer) {
        transformers.add(transformer);
        transformer.setPowerSubstation(this);
    }

    public void deleteTransformer(Transformer transformer) {
        transformers.remove(transformer);
        transformer.setPowerSubstation(null);
    }

    public List<Transformer> getTransformers() {
        return List.copyOf(transformers);
    }

    /* *****************************************************************************************************************
     *                                               Getters and Setters
     * *****************************************************************************************************************/

    public UUID getId() {
        return id;
    }

    public void setSubstationId(String substationId) {
        this.substationId = substationId;
    }

    public String getSubstationId() {
        return substationId;
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

    public void setPowerPlant(PowerPlant powerPlant) {
        this.powerPlant = powerPlant;
    }

    public PowerPlant getPowerPlant() {
        return powerPlant;
    }
}

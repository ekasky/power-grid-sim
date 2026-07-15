package com.evankasky.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(
        name = "power_plants",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_power_plant_company_plant_id",
                columnNames = {"company_id", "plant_id"}
        )
)
public class PowerPlant {

    @Id
    @GeneratedValue
    @UuidGenerator(style = UuidGenerator.Style.VERSION_7)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "plant_id", nullable = false)
    private String plantId;

    @Column(name = "initial_build_cost", nullable = false, precision = 19, scale = 4)
    private BigDecimal initialBuildCost;

    @Column(name = "recurring_generation_cost", nullable = false, precision = 19, scale = 4)
    private BigDecimal recurringGenerationCost;

    @Column(name = "power_produced", nullable = false, precision = 19, scale = 4)
    private BigDecimal powerProduced = BigDecimal.ZERO;

    @Embedded
    private Location location;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_id", nullable = false)
    private PowerCompany company;

    @OneToMany(mappedBy = "powerPlant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PowerSubstation> powerSubstations = new ArrayList<>();

    /* *****************************************************************************************************************
     *                                                  Constructors
     ***************************************************************************************************************** */

    protected PowerPlant() { }

    public PowerPlant(String plantId, BigDecimal initialBuildCost, BigDecimal recurringGenerationCost, Location location) {
        this.plantId = plantId;
        this.initialBuildCost = initialBuildCost;
        this.recurringGenerationCost = recurringGenerationCost;
        this.location = location;
    }

    /* *****************************************************************************************************************
     *                                            Power Plant Methods
     ***************************************************************************************************************** */

    public void addPowerSubstation(PowerSubstation powerSubstation) {
        powerSubstations.add(powerSubstation);
        powerSubstation.setPowerPlant(this);
    }

    public void deletePowerSubstation(PowerSubstation powerSubstation) {
        powerSubstations.remove(powerSubstation);
        powerSubstation.setPowerPlant(null);
    }

    public List<PowerSubstation> getPowerSubstations() {
        return List.copyOf(powerSubstations);
    }

    /* *****************************************************************************************************************
     *                                               Getters and Setters
     * *****************************************************************************************************************/

    public UUID getId() {
        return id;
    }

    public void setPlantId(String plantId) {
        this.plantId = plantId;
    }

    public String getPlantId() {
        return plantId;
    }

    public void setInitialBuildCost(BigDecimal initialBuildCost) {
        this.initialBuildCost = initialBuildCost;
    }

    public BigDecimal getInitialBuildCost() {
        return initialBuildCost;
    }

    public void setRecurringGenerationCost(BigDecimal recurringGenerationCost) {
        this.recurringGenerationCost = recurringGenerationCost;
    }

    public BigDecimal getRecurringGenerationCost() {
        return recurringGenerationCost;
    }

    public BigDecimal getPowerProduced() {
        return powerProduced;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Location getLocation() {
        return location;
    }

    public void setCompany(PowerCompany company) {
        this.company = company;
    }

    public PowerCompany getCompany() {
        return company;
    }
}

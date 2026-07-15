package com.evankasky.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "power_companies")
public class PowerCompany {

    @Id
    @GeneratedValue
    @UuidGenerator(style = UuidGenerator.Style.VERSION_7)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "long_name", nullable = false)
    private String longName;

    @Column(name = "short_name", nullable = false, unique = true)
    private String shortName;

    @Column(name = "standard_rate", nullable = false, precision = 19, scale = 4)
    private BigDecimal standardRate;

    @Column(name = "total_revenue", nullable = false, precision = 19, scale = 2)
    private BigDecimal totalRevenue = BigDecimal.ZERO;

    @Column(name = "total_costs", nullable = false, precision = 19, scale = 2)
    private BigDecimal totalCosts = BigDecimal.ZERO;

    @Embedded
    private Location location;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PowerPlant> powerPlants = new ArrayList<>();

    /* *****************************************************************************************************************
     *                                                  Constructors
     ***************************************************************************************************************** */

    protected PowerCompany() { }

    public PowerCompany(String shortName, String longName, BigDecimal standardRate, Location location) {
        this.shortName = shortName;
        this.longName = longName;
        this.standardRate = standardRate;
        this.location = location;
    }

    /* *****************************************************************************************************************
     *                                             Power Company Methods
     ***************************************************************************************************************** */

    public void addPowerPlant(PowerPlant powerPlant) {
        powerPlants.add(powerPlant);
        powerPlant.setCompany(this);
    }

    public void deletePowerPlant(PowerPlant powerPlant) {
        powerPlants.remove(powerPlant);
        powerPlant.setCompany(null);
    }

    /* *****************************************************************************************************************
    *                                               Getters and Setters
    * *****************************************************************************************************************/

    public UUID getId() {
        return id;
    }

    public void setLongName(String longName) {
        this.longName = longName;
    }

    public String getLongName() {
        return longName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    public String getShortName() {
        return shortName;
    }

    public void setStandardRate(BigDecimal standardRate) {
        this.standardRate = standardRate;
    }

    public BigDecimal getStandardRate() {
        return standardRate;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public BigDecimal getTotalCosts() {
        return totalCosts;
    }

    public void setTotalCosts(BigDecimal totalCosts) {
        this.totalCosts = totalCosts;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Location getLocation() {
        return location;
    }

    public List<PowerPlant> getPowerPlants() {
        return powerPlants;
    }
}

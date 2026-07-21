package com.evankasky.backend.model;

import com.evankasky.backend.exception.PowerGridSimulationLogicalException;
import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "billing_cycles",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_billing_cycle_number",
                columnNames = "cycle_number"
        )
)
public class BillingCycle {

    @Id
    @GeneratedValue
    @UuidGenerator(style = UuidGenerator.Style.VERSION_7)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "cycle_number", nullable = false, updatable = false)
    private int cycleNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private BillingCycleStatus status;

    @Column(name = "started_at", nullable = false, updatable = false)
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    /* *****************************************************************************************************************
     *                                                  Constructors
     ***************************************************************************************************************** */

    protected BillingCycle() { }

    public BillingCycle(int cycleNumber) {
        if(cycleNumber < 1) {
            throw new PowerGridSimulationLogicalException("Billing cycle must be greater than 0");
        }

        this.cycleNumber = cycleNumber;
        this.status = BillingCycleStatus.OPEN;
        this.startedAt = LocalDateTime.now();
    }

    /* *****************************************************************************************************************
     *                                            Usage Record Methods
     ***************************************************************************************************************** */

    public void complete() {

        if(status != BillingCycleStatus.OPEN) {
            throw new PowerGridSimulationLogicalException("Only open billing cycles can be completed");
        }

        status = BillingCycleStatus.COMPLETED;
        completedAt = LocalDateTime.now();

    }

    /* *****************************************************************************************************************
     *                                               Getters and Setters
     * *****************************************************************************************************************/

    public UUID getId() {
        return id;
    }

    public int getCycleNumber() {
        return cycleNumber;
    }

    public BillingCycleStatus getStatus() {
        return status;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
}

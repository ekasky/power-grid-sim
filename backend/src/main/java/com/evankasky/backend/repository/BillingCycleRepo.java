package com.evankasky.backend.repository;

import com.evankasky.backend.model.BillingCycle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface BillingCycleRepo extends JpaRepository<BillingCycle, UUID> {
    boolean existsByCycleNumber(int cycleNumber);
    Optional<BillingCycle> findByCycleNumber(int cycleNumber);
    Optional<BillingCycle> findTopByOrderByCycleNumberDesc();
}

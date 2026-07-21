package com.evankasky.backend.repository;

import com.evankasky.backend.model.UsageRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UsageRecordRepo extends JpaRepository<UsageRecord, UUID> {

    boolean existsByCustomer_IdAndBillingCycle(UUID customerId, int billingCycle);
    List<UsageRecord> findAllByBillingCycle(int billingCycle);
    List<UsageRecord> findAllByCustomer_IdOrderByBillingCycleAsc(UUID customerId);

}

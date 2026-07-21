package com.evankasky.backend.repository;

import com.evankasky.backend.model.UsageRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UsageRecordRepo extends JpaRepository<UsageRecord, UUID> {

    boolean existsByCustomer_IdAndBillingCycle_Id(UUID customerId, UUID billingCycleId);
    List<UsageRecord> findAllByBillingCycle_Id(UUID billingCycleId);
    List<UsageRecord> findAllByCustomer_IdOrderByBillingCycle_CycleNumberAsc(UUID customerId);

}

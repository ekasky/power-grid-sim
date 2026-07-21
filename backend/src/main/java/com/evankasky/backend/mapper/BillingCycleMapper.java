package com.evankasky.backend.mapper;

import com.evankasky.backend.dto.billingcycle.BillingCycleResponse;
import com.evankasky.backend.model.BillingCycle;
import org.springframework.stereotype.Component;

@Component
public class BillingCycleMapper {

    public BillingCycleResponse toResponse(BillingCycle billingCycle) {
        return new BillingCycleResponse(
                billingCycle.getId(),
                billingCycle.getCycleNumber(),
                billingCycle.getStatus(),
                billingCycle.getStartedAt(),
                billingCycle.getCompletedAt()
        );
    }

}

package com.evankasky.backend.dto.billingcycle;

import com.evankasky.backend.model.BillingCycleStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record BillingCycleResponse(
    UUID id,
    int cycleNumber,
    BillingCycleStatus status,
    LocalDateTime startedAt,
    LocalDateTime completedAt
) { }

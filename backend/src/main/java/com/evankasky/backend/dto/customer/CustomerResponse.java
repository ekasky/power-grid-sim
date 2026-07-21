package com.evankasky.backend.dto.customer;

import com.evankasky.backend.dto.location.LocationResponse;
import com.evankasky.backend.model.CustomerType;

import java.math.BigDecimal;
import java.util.UUID;

public record CustomerResponse(
        UUID id,
        String accountNumber,
        String name,
        CustomerType customerType,
        BigDecimal customBillingRate,
        BigDecimal standardBillingRate,
        BigDecimal effectiveBillingRate,
        LocationResponse location
) { }

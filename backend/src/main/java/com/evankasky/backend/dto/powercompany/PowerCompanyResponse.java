package com.evankasky.backend.dto.powercompany;

import com.evankasky.backend.dto.location.LocationResponse;

import java.math.BigDecimal;
import java.util.UUID;

public record PowerCompanyResponse(

        UUID id,
        String shortName,
        String longName,
        BigDecimal standardRate,
        BigDecimal totalRevenue,
        BigDecimal totalCosts,
        LocationResponse location

) { }

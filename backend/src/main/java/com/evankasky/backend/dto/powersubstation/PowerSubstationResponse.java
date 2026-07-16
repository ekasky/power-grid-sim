package com.evankasky.backend.dto.powersubstation;

import com.evankasky.backend.dto.location.LocationResponse;

import java.math.BigDecimal;
import java.util.UUID;

public record PowerSubstationResponse(

        UUID id,
        String substationId,
        BigDecimal initialInstallationCost,
        BigDecimal recurringMaintenanceCost,
        LocationResponse location

) { }

package com.evankasky.backend.dto.powerplant;

import com.evankasky.backend.dto.location.LocationResponse;

import java.math.BigDecimal;
import java.util.UUID;

public record PowerPlantResponse(

        UUID id,
        String plantId,
        BigDecimal initialBuildCost,
        BigDecimal recurringGenerationCost,
        BigDecimal powerProduced,
        LocationResponse location

) { }

package com.evankasky.backend.dto.transformer;

import com.evankasky.backend.dto.location.LocationResponse;

import java.math.BigDecimal;
import java.util.UUID;

public record TransformerResponse(

        UUID id,
        String transformerId,
        UUID powerCompanyId,
        String powerCompanyShortName,
        UUID powerPlantId,
        String plantId,
        UUID powerSubstationId,
        String substationId,
        BigDecimal initialInstallationCost,
        BigDecimal recurringMaintenanceCost,
        LocationResponse location

) { }

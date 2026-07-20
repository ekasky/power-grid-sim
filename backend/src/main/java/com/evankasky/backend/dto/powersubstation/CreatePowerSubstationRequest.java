package com.evankasky.backend.dto.powersubstation;

import com.evankasky.backend.dto.location.LocationRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CreatePowerSubstationRequest(

        @NotBlank(message = "Substation ID is required")
        @Size(max = 20, message = "Substation cannot exceed 20 characters")
        String substationId,

        @NotNull(message = "Initial build cost is required")
        @DecimalMin(value = "0.0", inclusive = true, message = "Initial build cost cannot be negative")
        BigDecimal initialBuildCost,

        @NotNull(message = "Recurring generation cost is required")
        @DecimalMin(value = "0.0", inclusive = true, message = "Recurring maintenance cost cannot be negative")
        BigDecimal recurringMaintenanceCost,

        @NotNull(message = "Location is required")
        @Valid
        LocationRequest location

) { }

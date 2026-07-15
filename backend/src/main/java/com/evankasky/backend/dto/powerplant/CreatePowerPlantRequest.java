package com.evankasky.backend.dto.powerplant;

import com.evankasky.backend.dto.location.LocationRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CreatePowerPlantRequest(

        @NotBlank(message = "Power plant ID is required")
        @Size(max = 20, message = "Short name cannot exceed 20 characters")
        String plantId,

        @NotNull(message = "Initial build cost is required")
        @DecimalMin(value = "0.0", inclusive = true, message = "Initial build cost cannot be negative")
        BigDecimal initialBuildCost,

        @NotNull(message = "Recurring generation cost is required")
        @DecimalMin(value = "0.0", inclusive = true, message = "Recurring generation cost cannot be negative")
        BigDecimal recurringGenerationCost,

        @NotNull(message = "Location is required")
        @Valid
        LocationRequest location

) { }

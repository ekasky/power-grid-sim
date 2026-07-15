package com.evankasky.backend.dto.powerplant;

import com.evankasky.backend.dto.location.LocationRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record UpdatePowerPlantRequest(

        @Pattern(regexp = ".*\\S.*", message = "Plant ID cannot be empty")
        @Size(max = 20, message = "Plant ID cannot exceed 20 characters")
        String plantId,

        @DecimalMin(value = "0.0", inclusive = true, message = "Initial build cost cannot be negative")
        BigDecimal initialBuildCost,

        @DecimalMin(value = "0.0", inclusive = true, message = "Recurring generation cost cannot be negative")
        BigDecimal recurringGenerationCost,

        @Valid
        LocationRequest location

) { }

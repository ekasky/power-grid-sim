package com.evankasky.backend.dto.powersubstation;

import com.evankasky.backend.dto.location.LocationRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record UpdatePowerSubstationRequest(

        @Pattern(regexp = ".*\\S.*", message = "Substation ID cannot be empty")
        @Size(max = 20, message = "Substation ID cannot exceed 20 characters")
        String substationId,

        @DecimalMin(value = "0.0", inclusive = true, message = "Initial build cost cannot be negative")
        BigDecimal initialBuildCost,

        @DecimalMin(value = "0.0", inclusive = true, message = "Recurring Maintenance cost cannot be negative")
        BigDecimal recurringMaintenanceCost,

        @Valid
        LocationRequest location

) { }

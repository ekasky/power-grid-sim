package com.evankasky.backend.dto.transformer;

import com.evankasky.backend.dto.location.LocationRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record UpdateTransformerRequest(

        @Pattern(regexp = ".*\\S.*", message = "Transformer ID cannot be empty")
        @Size(max = 20, message = "Transformer ID cannot exceed 20 characters")
        String transformerId,

        @DecimalMin(value = "0.0", inclusive = true, message = "Initial installation cost cannot be negative")
        BigDecimal initialInstallationCost,

        @DecimalMin(value = "0.0", inclusive = true, message = "Recurring maintenance cost cannot be negative")
        BigDecimal recurringMaintenanceCost,

        @Valid
        LocationRequest location

) { }

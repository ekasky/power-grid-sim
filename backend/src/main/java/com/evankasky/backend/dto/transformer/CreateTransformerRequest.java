package com.evankasky.backend.dto.transformer;

import com.evankasky.backend.dto.location.LocationRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CreateTransformerRequest(

        @NotBlank(message = "Transformer ID is required")
        @Size(max = 20, message = "Transformer ID cannot exceed 20 characters")
        String transformerId,

        @NotNull(message = "Initial installation cost is required")
        @DecimalMin(value = "0.0", inclusive = true, message = "Initial installation cost cannot be negative")
        BigDecimal initialInstallationCost,

        @NotNull(message = "Recurring generation cost is required")
        @DecimalMin(value = "0.0", inclusive = true, message = "Recurring generation cost cannot be negative")
        BigDecimal recurringGenerationCost,

        @NotNull(message = "Location is required")
        @Valid
        LocationRequest location

) { }

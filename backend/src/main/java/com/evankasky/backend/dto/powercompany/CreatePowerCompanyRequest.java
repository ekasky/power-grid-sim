package com.evankasky.backend.dto.powercompany;

import com.evankasky.backend.dto.location.LocationRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CreatePowerCompanyRequest(

        @NotBlank(message = "Short name is required")
        @Size(max = 20, message = "Short name cannot exceed 20 characters")
        String shortName,

        @NotBlank(message = "Long name is required")
        @Size(max = 255, message = "Long name cannot exceed 255 characters")
        String longName,

        @NotNull(message = "Standard rate is required")
        @DecimalMin(value = "0.0", inclusive = true, message = "Standard rate cannot be negative")
        BigDecimal standardRate,

        @NotNull(message = "Location is required")
        @Valid
        LocationRequest location

) { }

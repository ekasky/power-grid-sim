package com.evankasky.backend.dto.powercompany;

import com.evankasky.backend.dto.location.LocationRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record UpdatePowerCompanyRequest(

        @Pattern(regexp = ".*\\S.*", message = "Short name cannot be empty")
        @Size(max = 20, message = "Short name cannot exceed 20 characters")
        String shortName,

        @Pattern(regexp = ".*\\S.*", message = "Long name cannot be empty")
        @Size(max = 255, message = "Long name cannot exceed 255 characters")
        String longName,

        @DecimalMin(value = "0.0", inclusive = true, message = "Standard rate cannot be negative")
        BigDecimal standardRate,

        @Valid
        LocationRequest location

) { }

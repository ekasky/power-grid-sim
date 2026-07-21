package com.evankasky.backend.dto.customer;

import com.evankasky.backend.dto.location.LocationRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record UpdateCustomerRequest(

        @Pattern(regexp = ".*\\S.*", message = "Account Number cannot be empty")
        @Size(max = 20, message = "Account cannot exceed 20 characters")
        String accountNumber,

        @Pattern(regexp = ".*\\S.*", message = "Name cannot be empty")
        @Size(max = 120, message = "Name cannot exceed 120 characters")
        String name,

        Boolean useStandardBillingRate,

        @DecimalMin(value = "0.0", inclusive = true, message = "Custom billing rate cannot be negative")
        BigDecimal customBillingRate,

        @Valid
        LocationRequest location
) { }

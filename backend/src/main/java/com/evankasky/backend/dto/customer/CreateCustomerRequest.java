package com.evankasky.backend.dto.customer;

import com.evankasky.backend.dto.location.LocationRequest;
import com.evankasky.backend.model.CustomerType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateCustomerRequest(

        @NotBlank(message = "Account number is required")
        @Size(max = 20, message = "Account number cannot exceed 20 characters")
        String accountNumber,

        @NotBlank(message = "Name is required")
        @Size(max = 120, message = "Name cannot exceed 120 characters")
        String name,

        @NotNull(message = "Customer type is required")
        CustomerType customerType,

        @NotNull(message = "Location is required")
        @Valid
        LocationRequest location
) { }

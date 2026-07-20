package com.evankasky.backend.dto.customer;

import com.evankasky.backend.dto.location.LocationResponse;

import java.util.UUID;

public record CustomerResponse(
        UUID id,
        String accountNumber,
        String name,
        LocationResponse location
) { }

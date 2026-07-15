package com.evankasky.backend.dto.location;

import jakarta.validation.constraints.NotNull;

public record LocationRequest(

        @NotNull(message = "Location x is required")
        Integer x,

        @NotNull(message = "Location y is required")
        Integer y

) { }

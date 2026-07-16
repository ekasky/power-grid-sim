package com.evankasky.backend.mapper;

import com.evankasky.backend.dto.location.LocationResponse;
import com.evankasky.backend.dto.transformer.TransformerResponse;
import com.evankasky.backend.model.Location;
import com.evankasky.backend.model.Transformer;

public class TransformerMapper {

    public TransformerResponse toResponse(Transformer transformer) {

        Location location = transformer.getLocation();
        LocationResponse locationResponse = new LocationResponse(location.getX(), location.getY());

        return new TransformerResponse(
                transformer.getId(),
                transformer.getTransformerId(),
                transformer.getInitialInstallationCost(),
                transformer.getRecurringMaintenanceCost(),
                locationResponse
        );

    }

}

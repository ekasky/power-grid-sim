package com.evankasky.backend.mapper;

import com.evankasky.backend.dto.location.LocationResponse;
import com.evankasky.backend.dto.powerplant.PowerPlantResponse;
import com.evankasky.backend.model.Location;
import com.evankasky.backend.model.PowerPlant;
import org.springframework.stereotype.Component;

@Component
public class PowerPlantMapper {

    public PowerPlantResponse toResponse(PowerPlant powerPlant) {

        Location location = powerPlant.getLocation();
        LocationResponse locationResponse = new LocationResponse(location.getX(), location.getY());

        return new PowerPlantResponse(
                powerPlant.getId(),
                powerPlant.getPlantId(),
                powerPlant.getInitialBuildCost(),
                powerPlant.getRecurringGenerationCost(),
                powerPlant.getPowerProduced(),
                locationResponse
        );

    }

}

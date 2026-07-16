package com.evankasky.backend.mapper;

import com.evankasky.backend.dto.location.LocationResponse;
import com.evankasky.backend.dto.powersubstation.PowerSubstationResponse;
import com.evankasky.backend.model.Location;
import com.evankasky.backend.model.PowerSubstation;
import org.springframework.stereotype.Component;

@Component
public class PowerSubstationMapper {

    public PowerSubstationResponse toResponse(PowerSubstation powerSubstation) {

        Location location = powerSubstation.getLocation();
        LocationResponse locationResponse = new LocationResponse(location.getX(), location.getY());

        return new PowerSubstationResponse(
                powerSubstation.getId(),
                powerSubstation.getSubstationId(),
                powerSubstation.getInitialInstallationCost(),
                powerSubstation.getRecurringMaintenanceCost(),
                locationResponse
        );

    }

}

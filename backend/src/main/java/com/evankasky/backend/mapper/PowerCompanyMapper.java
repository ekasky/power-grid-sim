package com.evankasky.backend.mapper;

import com.evankasky.backend.dto.location.LocationResponse;
import com.evankasky.backend.dto.powercompany.PowerCompanyResponse;
import com.evankasky.backend.model.Location;
import com.evankasky.backend.model.PowerCompany;
import org.springframework.stereotype.Component;

@Component
public class PowerCompanyMapper {

    public PowerCompanyResponse toResponse(PowerCompany powerCompany) {

        Location location = powerCompany.getLocation();
        LocationResponse locationResponse = new LocationResponse(location.getX(), location.getY());

        return new PowerCompanyResponse(
                powerCompany.getId(),
                powerCompany.getLongName(),
                powerCompany.getShortName(),
                powerCompany.getStandardRate(),
                powerCompany.getTotalRevenue(),
                powerCompany.getTotalCosts(),
                locationResponse
        );

    }

}

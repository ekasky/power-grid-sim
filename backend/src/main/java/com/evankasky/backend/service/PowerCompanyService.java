package com.evankasky.backend.service;

import com.evankasky.backend.dto.powercompany.CreatePowerCompanyRequest;
import com.evankasky.backend.exception.powercompany.PowerCompanyExistsException;
import com.evankasky.backend.model.Location;
import com.evankasky.backend.model.PowerCompany;
import com.evankasky.backend.repository.PowerCompanyRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PowerCompanyService {

    private final PowerCompanyRepo powerCompanyRepo;

    /* *****************************************************************************************************************
     *                                              Constructors
     ***************************************************************************************************************** */

    public  PowerCompanyService(PowerCompanyRepo powerCompanyRepo) {
        this.powerCompanyRepo = powerCompanyRepo;
    }

    /* *****************************************************************************************************************
     *                                        Power Company Service Methods
     ***************************************************************************************************************** */

    @Transactional(readOnly = true)
    public List<PowerCompany> getAllPowerCompanies() {
        return powerCompanyRepo.findAll();
    }

    @Transactional
    public PowerCompany createPowerCompany(CreatePowerCompanyRequest request) {

        if(powerCompanyRepo.existsByShortName(request.shortName().trim())) {
            throw new PowerCompanyExistsException(
                    "A power company with short name '" +
                            request.shortName() +
                            "' already exists"
            );
        }

        Location location = new Location(
                request.location().x(),
                request.location().y()
        );

        PowerCompany powerCompany = new PowerCompany(
                request.shortName(),
                request.longName(),
                request.standardRate(),
                location
        );

        return powerCompanyRepo.save(powerCompany);

    }

}

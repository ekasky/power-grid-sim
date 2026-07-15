package com.evankasky.backend.service;

import com.evankasky.backend.dto.powercompany.CreatePowerCompanyRequest;
import com.evankasky.backend.exception.powercompany.PowerCompanyExistsException;
import com.evankasky.backend.model.PowerCompany;
import com.evankasky.backend.repository.PowerCompanyRepo;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

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

    @Transactional
    public PowerCompany createPowerCompany(CreatePowerCompanyRequest request) {

        if(powerCompanyRepo.existsByShortName(request.shortName().trim())) {
            throw new PowerCompanyExistsException(
                    "A power company with short name '" +
                            request.shortName() +
                            "' already exists"
            );
        }

        PowerCompany powerCompany = new PowerCompany(request.shortName(), request.longName(), request.standardRate());

        return powerCompanyRepo.save(powerCompany);

    }

}

package com.evankasky.backend.service;

import com.evankasky.backend.exception.powercompany.PowerCompanyNotFoundException;
import com.evankasky.backend.model.PowerPlant;
import com.evankasky.backend.repository.PowerCompanyRepo;
import com.evankasky.backend.repository.PowerPlantRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class PowerPlantService {

    private final PowerCompanyRepo powerCompanyRepo;
    private final PowerPlantRepo powerPlantRepo;

    /* *****************************************************************************************************************
     *                                              Constructors
     ***************************************************************************************************************** */

    public PowerPlantService(PowerCompanyRepo powerCompanyRepo, PowerPlantRepo powerPlantRepo) {
        this.powerCompanyRepo = powerCompanyRepo;
        this.powerPlantRepo = powerPlantRepo;
    }

    /* *****************************************************************************************************************
     *                                        Power Plant Service Methods
     ***************************************************************************************************************** */

    @Transactional
    public List<PowerPlant> getAllPowerPlants() {
        return powerPlantRepo.findAll();
    }

    @Transactional(readOnly = true)
    public List<PowerPlant> getAllCompaniesPowerPlants(UUID companyId) {

        if(!powerCompanyRepo.existsById(companyId)) {
            throw new PowerCompanyNotFoundException("Power company not found: " + companyId);
        }

        return powerPlantRepo.findAllByCompany_Id(companyId);

    }



    /* *****************************************************************************************************************
     *                                              Helper Methods
     ***************************************************************************************************************** */

}

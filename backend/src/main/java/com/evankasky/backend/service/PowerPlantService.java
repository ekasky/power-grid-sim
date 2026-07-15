package com.evankasky.backend.service;

import com.evankasky.backend.dto.powerplant.CreatePowerPlantRequest;
import com.evankasky.backend.dto.powerplant.UpdatePowerPlantRequest;
import com.evankasky.backend.exception.powercompany.PowerCompanyNotFoundException;
import com.evankasky.backend.exception.powerplant.PowerPlantExistsException;
import com.evankasky.backend.exception.powerplant.PowerPlantNotFoundException;
import com.evankasky.backend.model.Location;
import com.evankasky.backend.model.PowerCompany;
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

    @Transactional
    public PowerPlant createPowerPlant(
            UUID companyId,
            CreatePowerPlantRequest request
    ) {

        PowerCompany powerCompany = powerCompanyRepo.findById(companyId)
                .orElseThrow(() -> new PowerCompanyNotFoundException("Power company not found: " + companyId)
        );

        String plantId = request.plantId().trim();

        if(powerPlantRepo.existsByCompany_IdAndPlantId(companyId, plantId)) {
            throw new PowerPlantExistsException(
                    "Power plant '" + plantId +
                            "' already exists for company '" +
                            companyId + "'."
            );
        }

        Location location = new Location(request.location().x(), request.location().y());

        PowerPlant powerPlant = new PowerPlant(
                plantId,
                request.initialBuildCost(),
                request.recurringGenerationCost(),
                location
        );

        powerCompany.addPowerPlant(powerPlant);
        return powerPlantRepo.save(powerPlant);

    }

    @Transactional
    public PowerPlant updatePowerPlant(
            UUID companyId,
            UUID powerPlantId,
            UpdatePowerPlantRequest request
    ) {

        PowerPlant powerPlant = powerPlantRepo.findByCompany_IdAndId(companyId, powerPlantId)
                .orElseThrow(() -> new PowerPlantNotFoundException(
                        "Power plant '" + powerPlantId + "' was not found for company '" + companyId + "'."
        ));

        if(request.plantId() != null) {

           String plantId = request.plantId().trim();

           if(powerPlantRepo.existsByCompany_IdAndPlantIdAndIdNot(companyId, plantId, powerPlantId)) {
               throw new PowerPlantExistsException(
                       "Power plant ID '" + plantId + "' is already used by another plant in this company"
               );
           }

           powerPlant.setPlantId(plantId);

        }

        if(request.initialBuildCost() != null) {
            powerPlant.setInitialBuildCost(request.initialBuildCost());
        }

        if(request.recurringGenerationCost() != null) {
            powerPlant.setRecurringGenerationCost(request.recurringGenerationCost());
        }

        if(request.location() != null) {

            Location location = new Location(request.location().x(), request.location().y());
            powerPlant.setLocation(location);

        }

        return powerPlant;

    }

    /* *****************************************************************************************************************
     *                                              Helper Methods
     ***************************************************************************************************************** */

}

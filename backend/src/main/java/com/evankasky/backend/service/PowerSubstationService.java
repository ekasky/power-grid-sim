package com.evankasky.backend.service;

import com.evankasky.backend.dto.powersubstation.CreatePowerSubstationRequest;
import com.evankasky.backend.dto.powersubstation.UpdatePowerSubstationRequest;
import com.evankasky.backend.exception.powercompany.PowerCompanyNotFoundException;
import com.evankasky.backend.exception.powerplant.PowerPlantNotFoundException;
import com.evankasky.backend.exception.powersubstation.PowerSubstationExistsException;
import com.evankasky.backend.exception.powersubstation.PowerSubstationNotFoundException;
import com.evankasky.backend.model.Location;
import com.evankasky.backend.model.PowerPlant;
import com.evankasky.backend.model.PowerSubstation;
import com.evankasky.backend.repository.PowerCompanyRepo;
import com.evankasky.backend.repository.PowerPlantRepo;
import com.evankasky.backend.repository.PowerSubstationRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class PowerSubstationService {

    private final PowerCompanyRepo powerCompanyRepo;
    private final PowerPlantRepo powerPlantRepo;
    private final PowerSubstationRepo powerSubstationRepo;

    /* *****************************************************************************************************************
     *                                              Constructors
     ***************************************************************************************************************** */

    public PowerSubstationService(
            PowerCompanyRepo powerCompanyRepo,
            PowerPlantRepo powerPlantRepo,
            PowerSubstationRepo powerSubstationRepo
    ) {
        this.powerCompanyRepo = powerCompanyRepo;
        this.powerPlantRepo = powerPlantRepo;
        this.powerSubstationRepo = powerSubstationRepo;
    }

    /* *****************************************************************************************************************
     *                                        Power Substation Service Methods
     ***************************************************************************************************************** */

    @Transactional(readOnly = true)
    public List<PowerSubstation> getAllSubstations() {
        return powerSubstationRepo.findAll();
    }

    @Transactional(readOnly = true)
    public long getPowerSubstationCount() {
        return powerSubstationRepo.count();
    }

    @Transactional(readOnly = true)
    public List<PowerSubstation> getAllPowerCompaniesSubstations(UUID companyId) {

        if(!powerCompanyRepo.existsById(companyId)) {
            throw new PowerCompanyNotFoundException("Power company not found: " + companyId);
        }

        return powerSubstationRepo.findAllByPowerPlant_Company_Id(companyId);

    }

    @Transactional(readOnly = true)
    public List<PowerSubstation> getAllPowerPlantsSubstations(UUID powerPlantId) {

        powerPlantRepo.findById(powerPlantId)
                .orElseThrow(() -> new PowerPlantNotFoundException(
                    "Power plant '" + powerPlantId + "' not found"
                )
        );

        return powerSubstationRepo.findAllByPowerPlant_Id(powerPlantId);

    }

    @Transactional
    public PowerSubstation createSubstation(
            UUID powerPlantId,
            CreatePowerSubstationRequest request
    ) {

        PowerPlant powerPlant = powerPlantRepo.findById(powerPlantId)
                .orElseThrow(() -> new PowerPlantNotFoundException(
                    "Power plant '" + powerPlantId + "' not found"
                )
        );

        String substationId = request.substationId().trim();

        if(powerSubstationRepo.existsByPowerPlant_IdAndSubstationId(powerPlantId, substationId)) {
            throw new PowerSubstationExistsException(
                    "Substation '" + substationId + "' already exists for power plant '" +
                            powerPlant.getPlantId() + "'"
            );
        }

        Location location = new Location(
                request.location().x(),
                request.location().y()
        );

        PowerSubstation powerSubstation = new PowerSubstation(
                substationId,
                request.initialBuildCost(),
                request.recurringMaintenanceCost(),
                location
        );

        powerPlant.addPowerSubstation(powerSubstation);
        return powerSubstationRepo.save(powerSubstation);

    }

    @Transactional
    public PowerSubstation updatePowerSubstation(
            UUID powerSubstationId,
            UpdatePowerSubstationRequest request
    ) {

        PowerSubstation powerSubstation = powerSubstationRepo.findById(powerSubstationId)
                .orElseThrow(() -> new PowerSubstationNotFoundException(
                        "Power substation '" + powerSubstationId + "' not found"
                )
        );

        UUID powerPlantId = powerSubstation.getPowerPlant().getId();

        if(request.substationId() != null) {

            String substationId = request.substationId().trim();

            if(powerSubstationRepo.existsByPowerPlant_IdAndSubstationIdAndIdNot(powerPlantId, substationId, powerSubstationId)) {
                throw new PowerSubstationExistsException(
                        "Power substation ID '" +
                                powerSubstationId + "' is already used by another substation for this power plant"
                );
            }

            powerSubstation.setSubstationId(substationId);

        }

        if(request.initialBuildCost() != null) {
            powerSubstation.setInitialBuildCost(request.initialBuildCost());
        }

        if(request.recurringMaintenanceCost() != null) {
            powerSubstation.setRecurringMaintenanceCost(request.recurringMaintenanceCost());
        }

        if(request.location() != null) {

            Location location = new Location(request.location().x(), request.location().y());
            powerSubstation.setLocation(location);

        }

        return powerSubstation;

    }

    @Transactional
    public void deletePowerSubstation(
            UUID powerSubstationId
    ) {

        PowerSubstation powerSubstation = powerSubstationRepo.findById(powerSubstationId)
                .orElseThrow(() -> new PowerSubstationNotFoundException(
                        "Power substation '" + powerSubstationId + "' not found"
        ));

        powerSubstationRepo.delete(powerSubstation);

    }

    /* *****************************************************************************************************************
     *                                              Helper Methods
     ***************************************************************************************************************** */

}

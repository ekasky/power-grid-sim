package com.evankasky.backend.service;

import com.evankasky.backend.dto.transformer.CreateTransformerRequest;
import com.evankasky.backend.exception.powercompany.PowerCompanyNotFoundException;
import com.evankasky.backend.exception.powerplant.PowerPlantNotFoundException;
import com.evankasky.backend.exception.powersubstation.PowerSubstationNotFoundException;
import com.evankasky.backend.exception.transformer.TransformerExistsException;
import com.evankasky.backend.exception.transformer.TransformerNotFoundException;
import com.evankasky.backend.model.Location;
import com.evankasky.backend.model.PowerSubstation;
import com.evankasky.backend.model.Transformer;
import com.evankasky.backend.repository.PowerCompanyRepo;
import com.evankasky.backend.repository.PowerPlantRepo;
import com.evankasky.backend.repository.PowerSubstationRepo;
import com.evankasky.backend.repository.TransformerRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class TransformerService {

    private final PowerCompanyRepo powerCompanyRepo;
    private final PowerPlantRepo powerPlantRepo;
    private final PowerSubstationRepo powerSubstationRepo;
    private final TransformerRepo transformerRepo;

    /* *****************************************************************************************************************
     *                                              Constructors
     ***************************************************************************************************************** */

    public TransformerService(
            PowerCompanyRepo powerCompanyRepo,
            PowerPlantRepo powerPlantRepo,
            PowerSubstationRepo powerSubstationRepo,
            TransformerRepo transformerRepo
    ) {
        this.powerCompanyRepo = powerCompanyRepo;
        this.powerPlantRepo = powerPlantRepo;
        this.powerSubstationRepo = powerSubstationRepo;
        this.transformerRepo = transformerRepo;
    }

    /* *****************************************************************************************************************
     *                                       Transformer Service Methods
     ***************************************************************************************************************** */

    @Transactional(readOnly = true)
    public List<Transformer> getAllTransformers() {
        return transformerRepo.findAll();
    }

    @Transactional(readOnly = true)
    public List<Transformer> getAllPowerCompaniesTransformers(UUID companyId) {

        if(!powerCompanyRepo.existsById(companyId)) {
            throw new PowerCompanyNotFoundException("Power company not found: " + companyId);
        }

        return transformerRepo.findAllByPowerSubstation_PowerPlant_Company_Id(companyId);

    }

    @Transactional(readOnly = true)
    public List<Transformer> getAllPowerPlantsTransformers(
            UUID companyId,
            UUID powerPlantId
    ) {

        powerPlantRepo.findByCompany_IdAndId(companyId, powerPlantId)
                .orElseThrow(()-> new PowerPlantNotFoundException(
                        "Power plant '" + powerPlantId + "' not found for company '" +
                                companyId + "'"
        ));

        return transformerRepo.findAllByPowerSubstation_PowerPlant_Id(powerPlantId);

    }

    @Transactional(readOnly = true)
    public List<Transformer> getAllPowerSubstationTransformers(
            UUID companyId,
            UUID powerPlantId,
            UUID powerSubstationId
    ) {

        powerPlantRepo.findByCompany_IdAndId(companyId, powerPlantId)
                .orElseThrow(()-> new PowerPlantNotFoundException(
                        "Power plant '" + powerPlantId + "' not found for company '" +
                                companyId + "'"
        ));

        powerSubstationRepo.findByIdAndPowerPlant_Id(powerSubstationId, powerPlantId)
                .orElseThrow(() -> new PowerSubstationNotFoundException(
                        "Power substation '" + powerSubstationId + "' not found for power plant '" +
                                powerPlantId + "'"
        ));

        return transformerRepo.findAllByPowerSubstation_Id(powerSubstationId);

    }

    @Transactional(readOnly = true)
    public Transformer getTransformerByTransformerId(
            UUID companyId,
            UUID powerPlantId,
            UUID powerSubstationId,
            String transformerId
    ) {

        powerPlantRepo.findByCompany_IdAndId(companyId, powerPlantId)
                .orElseThrow(() -> new PowerPlantNotFoundException("Power plant '" + powerPlantId +
                        "' was not found for company '" + companyId + "'.")
        );

        powerSubstationRepo.findByIdAndPowerPlant_Id(powerSubstationId, powerPlantId)
                .orElseThrow(() -> new PowerSubstationNotFoundException("Power substation '" + powerSubstationId +
                        "' was not found for power plant '" + powerPlantId + "'.")
        );

        return transformerRepo.findByPowerSubstation_IdAndTransformerId(powerSubstationId, transformerId.trim())
                .orElseThrow(() -> new TransformerNotFoundException("Transformer '" + transformerId +
                        "' was not found for substation '" + powerSubstationId + "'.")
        );

    }

    @Transactional
    public Transformer createTransformer(
            UUID companyId,
            UUID powerPlantId,
            UUID powerSubstationId,
            CreateTransformerRequest request
    ) {

        powerPlantRepo.findByCompany_IdAndId(companyId, powerPlantId)
                .orElseThrow(() -> new PowerPlantNotFoundException(
                        "Power plant '" + powerPlantId + "' not found for company '" +
                                companyId + "'"
                )
        );

        PowerSubstation powerSubstation = powerSubstationRepo.findByIdAndPowerPlant_Id(powerSubstationId, powerPlantId)
                .orElseThrow(() -> new PowerSubstationNotFoundException(
                        "Power substation '" + powerSubstationId + "' not found for power plant '" +
                                powerPlantId + "'"
                )
        );

        String transformerId = request.transformerId().trim();

        if(transformerRepo.existsByPowerSubstation_IdAndTransformerId(powerSubstationId, transformerId)) {
            throw new TransformerExistsException(
                    "Transformer '" + transformerId + "' already exists for power substation '" +
                            powerSubstationId + "'"
            );
        }

        Location location = new Location(
                request.location().x(),
                request.location().y()
        );

        Transformer transformer = new Transformer(
                transformerId,
                request.initialInstallationCost(),
                request.recurringMaintenanceCost(),
                location
        );

        powerSubstation.addTransformer(transformer);
        return transformerRepo.save(transformer);

    }

    /* *****************************************************************************************************************
     *                                              Helper Methods
     ***************************************************************************************************************** */

}

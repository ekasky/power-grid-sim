package com.evankasky.backend.service;

import com.evankasky.backend.dto.transformer.CreateTransformerRequest;
import com.evankasky.backend.dto.transformer.UpdateTransformerRequest;
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
    public long getTransformerCount() {
        return transformerRepo.count();
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
            UUID powerPlantId
    ) {

        powerPlantRepo.findById(powerPlantId)
                .orElseThrow(()-> new PowerPlantNotFoundException(
                        "Power plant '" + powerPlantId + "' not found"
        ));

        return transformerRepo.findAllByPowerSubstation_PowerPlant_Id(powerPlantId);

    }

    @Transactional(readOnly = true)
    public List<Transformer> getAllPowerSubstationTransformers(
            UUID powerSubstationId
    ) {

        powerSubstationRepo.findById(powerSubstationId)
                .orElseThrow(() -> new PowerSubstationNotFoundException(
                    "Substation '" + powerSubstationId + "' not found"
                )
        );

        return transformerRepo.findAllByPowerSubstation_Id(powerSubstationId);

    }

    @Transactional
    public Transformer createTransformer(
            UUID powerSubstationId,
            CreateTransformerRequest request
    ) {

        PowerSubstation powerSubstation = powerSubstationRepo.findById(powerSubstationId)
                .orElseThrow(() -> new PowerSubstationNotFoundException(
                        "Power substation '" + powerSubstationId + "' not found"
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

    @Transactional
    public Transformer updateTransformer(
            UUID transformerId,
            UpdateTransformerRequest request
    ) {

        Transformer transformer = transformerRepo.findById(transformerId)
                .orElseThrow(() -> new TransformerNotFoundException(
                        "Transformer '" + transformerId + "' not found ")
        );

        PowerSubstation powerSubstation = transformer.getPowerSubstation();

        if (request.transformerId() != null) {
            String newTransformerId = request.transformerId().trim();

            boolean transformerIdExists = transformerRepo.existsByPowerSubstation_IdAndTransformerIdAndIdNot(
                    powerSubstation.getId(),
                    newTransformerId,
                    transformerId
            );

            if (transformerIdExists) {
                throw new TransformerExistsException(
                        "Transformer ID '" + newTransformerId + "' is already used by another transformer " +
                                "in power substation '" + powerSubstation.getSubstationId() + "'"
                );
            }

            transformer.setTransformerId(newTransformerId);
        }

        if (request.initialInstallationCost() != null) {
            transformer.setInitialInstallationCost(
                    request.initialInstallationCost()
            );
        }

        if (request.recurringMaintenanceCost() != null) {
            transformer.setRecurringMaintenanceCost(
                    request.recurringMaintenanceCost()
            );
        }

        if (request.location() != null) {
            transformer.setLocation(
                    new Location(request.location().x(), request.location().y())
            );
        }

        return transformer;
    }

    @Transactional
    public void deleteTransformer(
            UUID transformerId
    ) {

        Transformer transformer = transformerRepo.findById(transformerId)
                .orElseThrow(() -> new TransformerNotFoundException("Transformer '" + transformerId + "' not found")
        );

        transformerRepo.delete(transformer);
    }

    /* *****************************************************************************************************************
     *                                              Helper Methods
     ***************************************************************************************************************** */

}

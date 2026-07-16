package com.evankasky.backend.service;

import com.evankasky.backend.exception.powercompany.PowerCompanyNotFoundException;
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

    @Transactional
    public List<Transformer> getAllPowerCompaniesTransformers(UUID companyId) {

        if(!powerCompanyRepo.existsById(companyId)) {
            throw new PowerCompanyNotFoundException("Power company not found: " + companyId);
        }

        return transformerRepo.findAllByPowerSubstation_PowerPlant_Company_Id(companyId);

    }

    /* *****************************************************************************************************************
     *                                              Helper Methods
     ***************************************************************************************************************** */

}

package com.evankasky.backend.service;

import com.evankasky.backend.dto.powercompany.CreatePowerCompanyRequest;
import com.evankasky.backend.dto.powercompany.UpdatePowerCompanyRequest;
import com.evankasky.backend.exception.PowerGridSimulationLogicalException;
import com.evankasky.backend.exception.powercompany.PowerCompanyExistsException;
import com.evankasky.backend.exception.powercompany.PowerCompanyNotFoundException;
import com.evankasky.backend.model.Location;
import com.evankasky.backend.model.PowerCompany;
import com.evankasky.backend.repository.PowerCompanyRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

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

    @Transactional(readOnly = true)
    public long getPowerCompanyCount() {
        return powerCompanyRepo.count();
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

    @Transactional(readOnly = true)
    public PowerCompany findPowerCompanyById(UUID companyId) {

        return powerCompanyRepo.findById(companyId)
                .orElseThrow(() -> new PowerCompanyNotFoundException(
                        "Power company not found: " + companyId
        ));

    }

    @Transactional(readOnly = true)
    public PowerCompany findPowerCompanyByShortName(String shortName) {

        return powerCompanyRepo.findByShortName(shortName)
                .orElseThrow(() -> new PowerCompanyNotFoundException(
                   "Power company not found: " + shortName
                ));

    }

    @Transactional
    public PowerCompany updatePowerCompany(UUID companyId, UpdatePowerCompanyRequest request) {

        PowerCompany powerCompany = powerCompanyRepo.findById(companyId)
                .orElseThrow(() -> new PowerCompanyNotFoundException(
                        "Power company not found: " + companyId
        ));

        if(request.shortName() != null) {

            String shortName = request.shortName().trim();

            if(powerCompanyRepo.existsByShortNameAndIdNot(shortName, companyId)) {
                throw new PowerCompanyExistsException(
                        "A power company with short name '" +
                                shortName +
                                "' already exists."
                );
            }

            powerCompany.setShortName(shortName);

        }

        if(request.longName() != null) {
            String longName = request.longName().trim();
            powerCompany.setLongName(longName);
        }

        if(request.standardRate() != null) {
            validateStandardRate(request.standardRate());
            powerCompany.setStandardRate(request.standardRate());
        }

        if(request.location() != null) {

            Location location = new Location(request.location().x(), request.location().y());
            powerCompany.setLocation(location);

        }

        return powerCompany;

    }

    @Transactional
    public void deletePowerCompanyById(UUID companyId) {
        PowerCompany powerCompany = powerCompanyRepo.findById(companyId)
                .orElseThrow(() -> new PowerCompanyNotFoundException("Power company not found: " + companyId));

        if(powerCompany.getPowerPlantCount() > 0) {
            throw new PowerGridSimulationLogicalException("Cannot delete a power company that owns power plants.");
        }

        powerCompanyRepo.delete(powerCompany);

    }

    /* *****************************************************************************************************************
     *                                              Helper Methods
     ***************************************************************************************************************** */

    private void validateStandardRate(BigDecimal standardRate) {

        if(standardRate == null) {
            throw new IllegalArgumentException("Standard rate is required");
        }

        if(standardRate.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Standard rate cannot be negative");
        }

    }

}

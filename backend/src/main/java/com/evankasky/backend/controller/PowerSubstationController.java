package com.evankasky.backend.controller;

import com.evankasky.backend.dto.powersubstation.CreatePowerSubstationRequest;
import com.evankasky.backend.dto.powersubstation.PowerSubstationResponse;
import com.evankasky.backend.dto.powersubstation.UpdatePowerSubstationRequest;
import com.evankasky.backend.mapper.PowerSubstationMapper;
import com.evankasky.backend.model.PowerSubstation;
import com.evankasky.backend.service.PowerSubstationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class PowerSubstationController {

    private final PowerSubstationService powerSubstationService;
    private final PowerSubstationMapper powerSubstationMapper;

    /* *****************************************************************************************************************
     *                                              Constructors
     ***************************************************************************************************************** */

    public PowerSubstationController(PowerSubstationService powerSubstationService, PowerSubstationMapper powerSubstationMapper) {
        this.powerSubstationService = powerSubstationService;
        this.powerSubstationMapper = powerSubstationMapper;
    }

    /* *****************************************************************************************************************
     *                                      Power Substation Controller Methods
     ***************************************************************************************************************** */

    @GetMapping("/substations")
    public List<PowerSubstationResponse> getAllPowerSubstations() {
        return powerSubstationService.getAllSubstations()
                .stream()
                .map(powerSubstationMapper::toResponse)
                .toList();
    }

    @GetMapping("/companies/{companyId}/substations")
    public List<PowerSubstationResponse> getAllCompaniesSubstations(
            @PathVariable UUID companyId
    ) {

        return powerSubstationService.getAllPowerCompaniesSubstations(companyId)
                .stream()
                .map(powerSubstationMapper::toResponse)
                .toList();

    }

    @GetMapping("/companies/{companyId}/plants/{powerPlantId}/substations")
    public List<PowerSubstationResponse> getAllPowerPlantSubstations(
            @PathVariable UUID companyId,
            @PathVariable UUID powerPlantId
    ) {

        return  powerSubstationService.getAllPowerPlantsSubstations(companyId, powerPlantId)
                .stream()
                .map(powerSubstationMapper::toResponse)
                .toList();

    }

    @PostMapping("/companies/{companyId}/plants/{powerPlantId}/substations")
    @ResponseStatus(HttpStatus.CREATED)
    public PowerSubstationResponse createPowerSubstation(
            @PathVariable UUID companyId,
            @PathVariable UUID powerPlantId,
            @Valid @RequestBody CreatePowerSubstationRequest request
    ) {
        PowerSubstation powerSubstation = powerSubstationService.createSubstation(companyId, powerPlantId, request);
        return powerSubstationMapper.toResponse(powerSubstation);
    }

    @PatchMapping("/companies/{companyId}/plants/{powerPlantId}/substations/{powerSubstationId}")
    public PowerSubstationResponse updatePowerSubstation(
            @PathVariable UUID companyId,
            @PathVariable UUID powerPlantId,
            @PathVariable UUID powerSubstationId,
            @Valid @RequestBody UpdatePowerSubstationRequest request
    ) {

        PowerSubstation powerSubstation = powerSubstationService.updatePowerSubstation(
                companyId,
                powerPlantId,
                powerSubstationId,
                request
        );

        return powerSubstationMapper.toResponse(powerSubstation);

    }

    @DeleteMapping("/companies/{companyId}/plants/{powerPlantId}/substations/{powerSubstationId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePowerSubstation(
            @PathVariable UUID companyId,
            @PathVariable UUID powerPlantId,
            @PathVariable UUID powerSubstationId
    ) {

        powerSubstationService.deletePowerSubstation(companyId, powerPlantId, powerSubstationId);
    }

}

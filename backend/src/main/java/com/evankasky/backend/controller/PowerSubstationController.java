package com.evankasky.backend.controller;

import com.evankasky.backend.dto.powersubstation.PowerSubstationResponse;
import com.evankasky.backend.mapper.PowerSubstationMapper;
import com.evankasky.backend.service.PowerSubstationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping("/companies/{companyId}")
    public List<PowerSubstationResponse> getAllCompaniesSubstations(
            @PathVariable UUID companyId
    ) {

        return powerSubstationService.getAllPowerCompaniesSubstations(companyId)
                .stream()
                .map(powerSubstationMapper::toResponse)
                .toList();

    }

    @GetMapping("/companies/{companyId}/plants/{plantId}")
    public List<PowerSubstationResponse> getAllPowerPlantSubstations(
            @PathVariable UUID companyId,
            @PathVariable UUID powerPlantId
    ) {

        return  powerSubstationService.getAllPowerPlantsSubstations(companyId, powerPlantId)
                .stream()
                .map(powerSubstationMapper::toResponse)
                .toList();

    }


}

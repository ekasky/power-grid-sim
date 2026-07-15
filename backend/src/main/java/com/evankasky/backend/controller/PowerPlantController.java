package com.evankasky.backend.controller;

import com.evankasky.backend.dto.powerplant.CreatePowerPlantRequest;
import com.evankasky.backend.dto.powerplant.PowerPlantResponse;
import com.evankasky.backend.mapper.PowerPlantMapper;
import com.evankasky.backend.model.PowerPlant;
import com.evankasky.backend.service.PowerPlantService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class PowerPlantController {

    private final PowerPlantService powerPlantService;
    private final PowerPlantMapper powerPlantMapper;

    /* *****************************************************************************************************************
     *                                              Constructors
     ***************************************************************************************************************** */

    public PowerPlantController(PowerPlantService powerPlantService, PowerPlantMapper powerPlantMapper) {
        this.powerPlantService = powerPlantService;
        this.powerPlantMapper = powerPlantMapper;
    }

    /* *****************************************************************************************************************
     *                                      Power Plant Controller Methods
     ***************************************************************************************************************** */

    @GetMapping("/plants")
    public List<PowerPlantResponse> getAllPowerPlants() {
        return powerPlantService.getAllPowerPlants()
                .stream()
                .map(powerPlantMapper::toResponse)
                .toList();
    }

    @GetMapping("/companies/{companyId}/plants")
    public List<PowerPlantResponse> getAllCompaniesPowerPlants(
            @PathVariable UUID companyId
    ) {

        return powerPlantService.getAllCompaniesPowerPlants(companyId)
                .stream()
                .map(powerPlantMapper::toResponse)
                .toList();

    }

    @PostMapping("/companies/{companyId}/plants")
    public PowerPlantResponse createNewPowerPlant(
            @PathVariable UUID companyId,
            @Valid @RequestBody CreatePowerPlantRequest request
    ) {

        PowerPlant powerPlant = powerPlantService.createPowerPlant(companyId, request);
        return powerPlantMapper.toResponse(powerPlant);

    }

}

package com.evankasky.backend.controller;

import com.evankasky.backend.dto.CountResponse;
import com.evankasky.backend.dto.powerplant.CreatePowerPlantRequest;
import com.evankasky.backend.dto.powerplant.PowerPlantResponse;
import com.evankasky.backend.dto.powerplant.UpdatePowerPlantRequest;
import com.evankasky.backend.mapper.PowerPlantMapper;
import com.evankasky.backend.model.PowerPlant;
import com.evankasky.backend.service.PowerPlantService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
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

    @GetMapping("/plants/count")
    public CountResponse getPowerPlantCount() {
        long count = powerPlantService.getPowerPlantCount();
        return new CountResponse(count);
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

    @PatchMapping("/plants/{powerPlantId}")
    public PowerPlantResponse updatePowerPlant(
            @PathVariable UUID powerPlantId,
            @Valid @RequestBody UpdatePowerPlantRequest request
    ) {

        PowerPlant powerPlant = powerPlantService.updatePowerPlant(powerPlantId, request);
        return powerPlantMapper.toResponse(powerPlant);

    }

    @DeleteMapping("/plants/{powerPlantId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePowerPlant(
            @PathVariable UUID powerPlantId
    ) {
        powerPlantService.deletePowerPlant(powerPlantId);
    }

}

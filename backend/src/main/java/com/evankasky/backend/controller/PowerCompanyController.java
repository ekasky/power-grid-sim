package com.evankasky.backend.controller;

import com.evankasky.backend.dto.powercompany.CreatePowerCompanyRequest;
import com.evankasky.backend.dto.powercompany.PowerCompanyResponse;
import com.evankasky.backend.dto.powercompany.UpdatePowerCompanyRequest;
import com.evankasky.backend.mapper.PowerCompanyMapper;
import com.evankasky.backend.model.PowerCompany;
import com.evankasky.backend.service.PowerCompanyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/companies")
public class PowerCompanyController {

    private final PowerCompanyService powerCompanyService;
    private final PowerCompanyMapper powerCompanyMapper;

    /* *****************************************************************************************************************
     *                                              Constructors
     ***************************************************************************************************************** */

    public PowerCompanyController(PowerCompanyService powerCompanyService, PowerCompanyMapper powerCompanyMapper) {
        this.powerCompanyService = powerCompanyService;
        this.powerCompanyMapper = powerCompanyMapper;
    }

    /* *****************************************************************************************************************
     *                                      Power Company Controller Methods
     ***************************************************************************************************************** */

    @GetMapping
    public List<PowerCompanyResponse> getAllPowerCompanies() {
        return powerCompanyService
                .getAllPowerCompanies()
                .stream()
                .map(powerCompanyMapper::toResponse)
                .toList();

    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PowerCompanyResponse createPowerCompany(
            @Valid @RequestBody CreatePowerCompanyRequest request
    ) {
        PowerCompany powerCompany = powerCompanyService.createPowerCompany(request);
        return powerCompanyMapper.toResponse(powerCompany);
    }

    @GetMapping("/{companyId}")
    public PowerCompanyResponse getPowerCompanyById(
            @PathVariable UUID companyId
    ) {
        PowerCompany powerCompany = powerCompanyService.findPowerCompanyById(companyId);
        return powerCompanyMapper.toResponse(powerCompany);
    }

    @GetMapping(params = "shortName")
    public PowerCompanyResponse getPowerCompanyByShortName(
            @RequestParam String shortName
    ) {
        PowerCompany powerCompany = powerCompanyService.findPowerCompanyByShortName(shortName);
        return powerCompanyMapper.toResponse(powerCompany);
    }

    @PatchMapping("/{companyId}")
    public PowerCompanyResponse updatePowerCompany(
            @PathVariable UUID companyId,
            @Valid @RequestBody UpdatePowerCompanyRequest request
    ) {
        PowerCompany powerCompany = powerCompanyService.updatePowerCompany(companyId, request);
        return powerCompanyMapper.toResponse(powerCompany);
    }

    @DeleteMapping("/{companyId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePowerCompanyById(
            @PathVariable UUID companyId
    ) {
        powerCompanyService.deletePowerCompanyById(companyId);
    }

}

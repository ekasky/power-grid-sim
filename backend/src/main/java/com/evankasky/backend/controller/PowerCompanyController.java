package com.evankasky.backend.controller;

import com.evankasky.backend.dto.powercompany.CreatePowerCompanyRequest;
import com.evankasky.backend.dto.powercompany.PowerCompanyResponse;
import com.evankasky.backend.mapper.PowerCompanyMapper;
import com.evankasky.backend.model.PowerCompany;
import com.evankasky.backend.service.PowerCompanyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PowerCompanyResponse createPowerCompany(
            @Valid @RequestBody CreatePowerCompanyRequest request
    ) {
        PowerCompany powerCompany = powerCompanyService.createPowerCompany(request);
        return powerCompanyMapper.toResponse(powerCompany);
    }


}

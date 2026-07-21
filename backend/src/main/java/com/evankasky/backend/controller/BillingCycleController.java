package com.evankasky.backend.controller;

import com.evankasky.backend.dto.billingcycle.BillingCycleResponse;
import com.evankasky.backend.mapper.BillingCycleMapper;
import com.evankasky.backend.model.BillingCycle;
import com.evankasky.backend.service.BillingCycleService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/billing")
public class BillingCycleController {

    private final BillingCycleService billingCycleService;
    private final BillingCycleMapper billingCycleMapper;

    /* *****************************************************************************************************************
     *                                              Constructors
     ***************************************************************************************************************** */

    public BillingCycleController(BillingCycleService billingCycleService, BillingCycleMapper billingCycleMapper) {
        this.billingCycleService = billingCycleService;
        this.billingCycleMapper = billingCycleMapper;
    }

    /* *****************************************************************************************************************
     *                                          Customer Controller Methods
     ***************************************************************************************************************** */

    @PostMapping("/run")
    @ResponseStatus(HttpStatus.CREATED)
    public BillingCycleResponse runBillingCycle() {
        BillingCycle billingCycle = billingCycleService.runBillingCycle();
        return billingCycleMapper.toResponse(billingCycle);
    }

}

package com.evankasky.backend.service;

import com.evankasky.backend.exception.PowerGridSimulationLogicalException;
import com.evankasky.backend.model.BillingCycle;
import com.evankasky.backend.model.Customer;
import com.evankasky.backend.repository.BillingCycleRepo;
import com.evankasky.backend.repository.CustomerRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BillingCycleService {

    private final BillingCycleRepo billingCycleRepo;
    private final CustomerRepo customerRepo;
    private final UsageRecordService usageRecordService;

    /* *****************************************************************************************************************
     *                                              Constructors
     ***************************************************************************************************************** */

    public BillingCycleService(
            BillingCycleRepo billingCycleRepo,
            CustomerRepo customerRepo,
            UsageRecordService usageRecordService
    ) {
        this.billingCycleRepo = billingCycleRepo;
        this.customerRepo = customerRepo;
        this.usageRecordService = usageRecordService;
    }

    /* *****************************************************************************************************************
     *                                        Billing Cycle Service Methods
     ***************************************************************************************************************** */

    @Transactional
    public BillingCycle runBillingCycle() {

        List<Customer> customers = customerRepo.findAll();

        if(customers.isEmpty()) {
            throw new PowerGridSimulationLogicalException("A billing cycle cannot run without customers");
        }

        int cycleNumber = getNextCycleNumber();

        BillingCycle billingCycle = billingCycleRepo.save(new BillingCycle(cycleNumber));

        for(Customer customer : customers) {

            // Generate the amount of power consumed by a customer

            // Create the usage record

            // Calculate the cost for the customer
        }

        // Calculate cost for the company

        // Mark cycle as done

        return billingCycle;

    }

    /* *****************************************************************************************************************
     *                                              Helper Methods
     ***************************************************************************************************************** */

    private int getNextCycleNumber() {
        return billingCycleRepo
                .findTopByOrderByCycleNumberDesc()
                .map(cycle -> cycle.getCycleNumber() + 1)
                .orElse(1);
    }

}

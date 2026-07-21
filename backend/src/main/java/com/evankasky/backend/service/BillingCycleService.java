package com.evankasky.backend.service;

import com.evankasky.backend.exception.PowerGridSimulationLogicalException;
import com.evankasky.backend.model.BillingCycle;
import com.evankasky.backend.model.Customer;
import com.evankasky.backend.model.PowerCompany;
import com.evankasky.backend.model.UsageRecord;
import com.evankasky.backend.repository.BillingCycleRepo;
import com.evankasky.backend.repository.CustomerRepo;
import com.evankasky.backend.simulation.UsageGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class BillingCycleService {

    private final BillingCycleRepo billingCycleRepo;
    private final CustomerRepo customerRepo;
    private final UsageRecordService usageRecordService;
    private final UsageGenerator usageGenerator;

    /* *****************************************************************************************************************
     *                                              Constructors
     ***************************************************************************************************************** */

    public BillingCycleService(
            BillingCycleRepo billingCycleRepo,
            CustomerRepo customerRepo,
            UsageRecordService usageRecordService,
            UsageGenerator usageGenerator
    ) {
        this.billingCycleRepo = billingCycleRepo;
        this.customerRepo = customerRepo;
        this.usageRecordService = usageRecordService;
        this.usageGenerator = usageGenerator;
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
            BigDecimal kwhUsed = usageGenerator.generateUsage(customer);

            // Create the usage record
            UsageRecord usageRecord = usageRecordService.createUsageRecord(customer, billingCycle, kwhUsed);

            // Calculate the cost for the customer
            BigDecimal amountCharged = usageRecord.getAmountCharged();

            // Add revenue to power company
            PowerCompany powerCompany = customer.getPowerCompany();
            powerCompany.addRevenue(amountCharged);

        }

        // Calculate cost for the company
        calculateCompanyCosts(billingCycle);

        // Mark cycle as done
        billingCycle.complete();

        return billingCycle;

    }

    /* *****************************************************************************************************************
     *                                              Helper Methods
     ***************************************************************************************************************** */

    private void calculateCompanyCosts(BillingCycle billingCycle) {
        // TODO: write method
    }

    private int getNextCycleNumber() {
        return billingCycleRepo
                .findTopByOrderByCycleNumberDesc()
                .map(cycle -> cycle.getCycleNumber() + 1)
                .orElse(1);
    }

}

package com.evankasky.backend.service;

import com.evankasky.backend.exception.PowerGridSimulationLogicalException;
import com.evankasky.backend.exception.usagerecord.UsageRecordExistsException;
import com.evankasky.backend.model.BillingCycle;
import com.evankasky.backend.model.BillingCycleStatus;
import com.evankasky.backend.model.Customer;
import com.evankasky.backend.model.UsageRecord;
import com.evankasky.backend.repository.UsageRecordRepo;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class UsageRecordService {

    private final UsageRecordRepo usageRecordRepo;

    /* *****************************************************************************************************************
     *                                              Constructors
     ***************************************************************************************************************** */

    public UsageRecordService(UsageRecordRepo usageRecordRepo) {
        this.usageRecordRepo = usageRecordRepo;
    }

    /* *****************************************************************************************************************
     *                                        Power Substation Service Methods
     ***************************************************************************************************************** */

     public UsageRecord createUsageRecord(Customer customer, BillingCycle billingCycle, BigDecimal kwhUsed) {

         if(customer == null) {
             throw new PowerGridSimulationLogicalException("Customer is required");
         }

         if(billingCycle == null) {
             throw new PowerGridSimulationLogicalException("Billing cycle is required");
         }

         if (billingCycle.getStatus() != BillingCycleStatus.OPEN) {
             throw new PowerGridSimulationLogicalException(
                     "Usage records can only be created for an open billing cycle"
             );
         }

         if(kwhUsed == null || kwhUsed.signum() < 0) {
             throw new PowerGridSimulationLogicalException("Power usage cannot be negative");
         }

         boolean alreadyExists = usageRecordRepo.existsByCustomer_IdAndBillingCycle_Id(customer.getId(), billingCycle.getId());

         if(alreadyExists) {
             throw new UsageRecordExistsException(
                     "A usage record already exists for customer '" + customer.getAccountNumber() + "' during " +
                             "billing cycle '" + billingCycle + "'"
             );
         }

         BigDecimal billingRate = customer.getEffectiveBillingRate();

         UsageRecord usageRecord = new UsageRecord(
                 billingCycle,
                 billingRate,
                 kwhUsed,
                 customer
         );

         return usageRecordRepo.save(usageRecord);

     }

    /* *****************************************************************************************************************
     *                                              Helper Methods
     ***************************************************************************************************************** */

}

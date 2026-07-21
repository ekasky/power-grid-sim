package com.evankasky.backend.service;

import com.evankasky.backend.exception.PowerGridSimulationLogicalException;
import com.evankasky.backend.exception.usagerecord.UsageRecordExistsException;
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

     public UsageRecord createUsageRecord(Customer customer, int billingCycle, BigDecimal kwhUsed) {

         if(billingCycle < 1) {
             throw new PowerGridSimulationLogicalException("Billing cycle must be greater than zero");
         }

         if(kwhUsed == null || kwhUsed.signum() < 0) {
             throw new PowerGridSimulationLogicalException("Power usage cannot be negative");
         }

         boolean alreadyExists = usageRecordRepo.existsByCustomer_IdAndBillingCycle(customer.getId(), billingCycle);

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

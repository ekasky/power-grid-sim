package com.evankasky.backend.service;

import com.evankasky.backend.dto.customer.CustomerResponse;
import com.evankasky.backend.model.Customer;
import com.evankasky.backend.repository.CustomerRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CustomerService {

    private final CustomerRepo customerRepo;

    /* *****************************************************************************************************************
     *                                              Constructors
     ***************************************************************************************************************** */

    public CustomerService(CustomerRepo customerRepo) {
        this.customerRepo = customerRepo;
    }

    /* *****************************************************************************************************************
     *                                        Customer Service Methods
     ***************************************************************************************************************** */

    @Transactional(readOnly = true)
    public List<Customer> getAllCustomers() {
        return customerRepo.findAll();
    }

    @Transactional(readOnly = true)
    public long getCustomerCount() {
        return customerRepo.count();
    }

    @Transactional(readOnly = true)
    public List<Customer> getAllPowerCompanyCustomers(UUID powerCompanyId) {
        return customerRepo.findAllByTransformerPowerSubstationPowerPlantId(powerCompanyId);
    }

    /* *****************************************************************************************************************
     *                                              Helper Methods
     ***************************************************************************************************************** */

}

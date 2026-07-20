package com.evankasky.backend.service;

import com.evankasky.backend.dto.customer.CustomerResponse;
import com.evankasky.backend.repository.CustomerRepo;
import org.springframework.stereotype.Service;

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



    /* *****************************************************************************************************************
     *                                              Helper Methods
     ***************************************************************************************************************** */

}

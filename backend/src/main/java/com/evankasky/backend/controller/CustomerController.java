package com.evankasky.backend.controller;

import com.evankasky.backend.mapper.CustomerMapper;
import com.evankasky.backend.service.CustomerService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CustomerController {

    private final CustomerService customerService;
    private final CustomerMapper customerMapper;

    /* *****************************************************************************************************************
     *                                              Constructors
     ***************************************************************************************************************** */

    public CustomerController(CustomerService customerService, CustomerMapper customerMapper) {
        this.customerService = customerService;
        this.customerMapper = customerMapper;
    }

    /* *****************************************************************************************************************
     *                                          Customer Controller Methods
     ***************************************************************************************************************** */

}

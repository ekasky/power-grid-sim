package com.evankasky.backend.controller;

import com.evankasky.backend.dto.CountResponse;
import com.evankasky.backend.dto.customer.CustomerResponse;
import com.evankasky.backend.mapper.CustomerMapper;
import com.evankasky.backend.service.CustomerService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

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

    @GetMapping("/customers")
    public List<CustomerResponse> getAllCustomers() {
        return customerService.getAllCustomers()
                .stream()
                .map(customerMapper::toResponse)
                .toList();
    }

    @GetMapping("/customers/count")
    public CountResponse getCustomerCount() {
        long count = customerService.getCustomerCount();
        return new CountResponse(count);
    }

    @GetMapping("/companies/{companyId}/customers")
    public List<CustomerResponse> getAllPowerCompaniesCustomers(
            @PathVariable UUID companyId
    ) {
        return customerService.getAllPowerCompanyCustomers(companyId)
                .stream()
                .map(customerMapper::toResponse)
                .toList();
    }

}

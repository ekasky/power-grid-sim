package com.evankasky.backend.controller;

import com.evankasky.backend.dto.CountResponse;
import com.evankasky.backend.dto.customer.CreateCustomerRequest;
import com.evankasky.backend.dto.customer.CustomerResponse;
import com.evankasky.backend.dto.customer.UpdateCustomerRequest;
import com.evankasky.backend.mapper.CustomerMapper;
import com.evankasky.backend.model.Customer;
import com.evankasky.backend.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/transformers/{transformerId}/customers")
    @ResponseStatus(HttpStatus.CREATED)
    public CustomerResponse createCustomer(
            @PathVariable UUID transformerId,
            @Valid @RequestBody CreateCustomerRequest request
    ) {
        Customer customer = customerService.createCustomer(transformerId, request);
        return customerMapper.toResponse(customer);
    }

    @PatchMapping("/customers/{customerId}")
    public CustomerResponse updateCustomer(
            @PathVariable UUID customerId,
            @Valid @RequestBody UpdateCustomerRequest request
    ) {
        Customer customer = customerService.updateCustomer(customerId, request);
        return customerMapper.toResponse(customer);
    }

    @DeleteMapping("/customers/{customerId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCustomer(
            @PathVariable UUID customerId
    ) {
        customerService.deleteCustomer(customerId);
    }

}

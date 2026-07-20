package com.evankasky.backend.service;

import com.evankasky.backend.dto.customer.CreateCustomerRequest;
import com.evankasky.backend.dto.customer.CustomerResponse;
import com.evankasky.backend.exception.customer.CustomerExistsException;
import com.evankasky.backend.exception.transformer.TransformerNotFoundException;
import com.evankasky.backend.model.*;
import com.evankasky.backend.repository.CustomerRepo;
import com.evankasky.backend.repository.TransformerRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CustomerService {

    private final TransformerRepo transformerRepo;
    private final CustomerRepo customerRepo;

    /* *****************************************************************************************************************
     *                                              Constructors
     ***************************************************************************************************************** */

    public CustomerService(TransformerRepo transformerRepo, CustomerRepo customerRepo) {
        this.transformerRepo = transformerRepo;
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

    @Transactional
    public Customer createCustomer(
            UUID transformerId,
            CreateCustomerRequest request
    ) {

        String accountNumber = request.accountNumber().trim();
        String name = request.name().trim();

        if(customerRepo.existsByAccountNumber(accountNumber)) {
            throw new CustomerExistsException(
                    "Customer with account number '" + accountNumber +
                            "' already exists"
            );
        }

        Transformer transformer = transformerRepo.findById(transformerId)
                .orElseThrow(() -> new TransformerNotFoundException(
                        "Transformer '" + transformerId + "' not found"
                )
        );

        Location location = new Location(request.location().x(), request.location().y());

        Customer customer = switch (request.customerType()) {
            case RESIDENTIAL -> new ResidentialCustomer(accountNumber, name, location);
            case COMMERCIAL -> new CommercialCustomer(accountNumber, name, location);
        };

        customer.setTransformer(transformer);
        return customerRepo.save(customer);

    }

    /* *****************************************************************************************************************
     *                                              Helper Methods
     ***************************************************************************************************************** */

}

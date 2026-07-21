package com.evankasky.backend.service;

import com.evankasky.backend.dto.customer.CreateCustomerRequest;
import com.evankasky.backend.dto.customer.CustomerResponse;
import com.evankasky.backend.dto.customer.UpdateCustomerRequest;
import com.evankasky.backend.exception.customer.CustomerExistsException;
import com.evankasky.backend.exception.customer.CustomerNotFoundException;
import com.evankasky.backend.exception.transformer.TransformerNotFoundException;
import com.evankasky.backend.exception.validation.GridCapacityExceededException;
import com.evankasky.backend.model.*;
import com.evankasky.backend.repository.CustomerRepo;
import com.evankasky.backend.repository.TransformerRepo;
import com.evankasky.backend.validation.GridRules;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CustomerService {

    private final TransformerRepo transformerRepo;
    private final CustomerRepo customerRepo;
    private final GridRules gridRules;

    /* *****************************************************************************************************************
     *                                              Constructors
     ***************************************************************************************************************** */

    public CustomerService(TransformerRepo transformerRepo, CustomerRepo customerRepo, GridRules gridRules) {
        this.transformerRepo = transformerRepo;
        this.customerRepo = customerRepo;
        this.gridRules = gridRules;
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
        return customerRepo.findAllByTransformer_PowerSubstation_PowerPlant_Company_Id(powerCompanyId);
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

        gridRules.validateDistance(
                transformer.getLocation(),
                location,
                GridRules.MAX_TRANSFORMER_TO_CUSTOMER_DISTANCE,
                "Transformer to customer"
        );

        long customerCount = customerRepo.countByTransformer_id(transformerId);

        if(customerCount >= GridRules.MAX_CUSTOMERS_PER_TRANSFORMER) {
            throw new GridCapacityExceededException(
                    "Transformer '" + transformer.getTransformerId() + "' already supports the maximum " +
                            "of 5 customers"
            );
        }

        Customer customer = switch (request.customerType()) {
            case RESIDENTIAL -> new ResidentialCustomer(accountNumber, name, location);
            case COMMERCIAL -> new CommercialCustomer(accountNumber, name, location);
        };

        customer.setTransformer(transformer);
        return customerRepo.save(customer);

    }

    @Transactional
    public Customer updateCustomer(
            UUID customerId,
            UpdateCustomerRequest request
    ) {

        Customer customer = customerRepo.findById(customerId)
                .orElseThrow(() -> new CustomerNotFoundException(
                        "Customer '" + customerId + "' not found"
                )
        );

        if(request.accountNumber() != null) {

            String accountNumber = request.accountNumber().trim();

            if(customerRepo.existsByAccountNumberAndIdNot(accountNumber, customerId)) {
                throw new CustomerExistsException(
                        "Customer with account number '" + accountNumber + "' already exists"
                );
            }

            customer.setAccountNumber(accountNumber);

        }

        if(request.name() != null) {
            customer.setName(request.name().trim());
        }

        if (request.location() != null) {
            Location currentLocation = customer.getLocation();

            int requestedX = request.location().x();
            int requestedY = request.location().y();

            boolean locationChanged =
                    currentLocation.getX() != requestedX
                            || currentLocation.getY() != requestedY;

            if (locationChanged) {
                Location requestedLocation = new Location(
                        requestedX,
                        requestedY
                );

                gridRules.validateDistance(
                        customer.getTransformer().getLocation(),
                        requestedLocation,
                        GridRules.MAX_TRANSFORMER_TO_CUSTOMER_DISTANCE,
                        "Transformer to customer"
                );

                customer.setLocation(requestedLocation);
            }
        }

        return customer;

    }

    @Transactional
    public void deleteCustomer(UUID customerId) {

        Customer customer = customerRepo.findById(customerId)
                        .orElseThrow(() -> new CustomerNotFoundException(
                                "Customer '" + customerId + "' not found"
                        )
        );

        customerRepo.delete(customer);
    }

    /* *****************************************************************************************************************
     *                                              Helper Methods
     ***************************************************************************************************************** */

}

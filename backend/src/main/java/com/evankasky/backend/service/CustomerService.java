package com.evankasky.backend.service;

import com.evankasky.backend.dto.customer.CreateCustomerRequest;
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

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
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

        // Check if account number is already in use
        String accountNumber = request.accountNumber().trim();
        String name = request.name().trim();

        if(customerRepo.existsByAccountNumber(accountNumber)) {
            throw new CustomerExistsException(
                    "Customer with account number '" + accountNumber +
                            "' already exists"
            );
        }

        // Get the transformer being connected to
        Transformer transformer = transformerRepo.findById(transformerId)
                .orElseThrow(() -> new TransformerNotFoundException(
                        "Transformer '" + transformerId + "' not found"
                )
        );

        // Validate that the customer distance is close enough to the transformer
        Location location = new Location(request.location().x(), request.location().y());

        gridRules.validateDistance(
                transformer.getLocation(),
                location,
                GridRules.MAX_TRANSFORMER_TO_CUSTOMER_DISTANCE,
                "Transformer to customer"
        );

        // Ensure  that the transformer is not at its capacity
        long customerCount = customerRepo.countByTransformer_id(transformerId);

        if(customerCount >= GridRules.MAX_CUSTOMERS_PER_TRANSFORMER) {
            throw new GridCapacityExceededException(
                    "Transformer '" + transformer.getTransformerId() + "' already supports the maximum " +
                            "of 5 customers"
            );
        }

        // Set the type of customer being created
        Customer customer = switch (request.customerType()) {
            case RESIDENTIAL -> new ResidentialCustomer(accountNumber, name, location);
            case COMMERCIAL -> new CommercialCustomer(accountNumber, name, location);
        };

        // Set the billing rate if different from standard rate

        BigDecimal requestedRate = request.customBillingRate();
        BigDecimal standardRate = transformer.getPowerSubstation().getPowerPlant().getCompany().getStandardRate();

        if(requestedRate != null && requestedRate.compareTo(standardRate) != 0) {
            customer.setCustomBillingRate(request.customBillingRate());
        } else {
            customer.setCustomBillingRate(null);
        }

        // Save the customer
        customer.setTransformer(transformer);
        return customerRepo.save(customer);

    }

    @Transactional
    public Customer updateCustomer(
            UUID customerId,
            UpdateCustomerRequest request
    ) {

        // Get customer to update
        Customer customer = customerRepo.findById(customerId)
                .orElseThrow(() -> new CustomerNotFoundException(
                        "Customer '" + customerId + "' not found"
                )
        );

        // Update account number
        if(request.accountNumber() != null) {

            String accountNumber = request.accountNumber().trim();

            if(customerRepo.existsByAccountNumberAndIdNot(accountNumber, customerId)) {
                throw new CustomerExistsException(
                        "Customer with account number '" + accountNumber + "' already exists"
                );
            }

            customer.setAccountNumber(accountNumber);

        }

        // Update name
        if(request.name() != null) {
            customer.setName(request.name().trim());
        }

        // Update custom billing rate
        if(Boolean.TRUE.equals(request.useStandardBillingRate())) {
            customer.setCustomBillingRate(null);
        } else if(request.customBillingRate() != null) {
            customer.setCustomBillingRate(request.customBillingRate());
        }

        // Update location
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

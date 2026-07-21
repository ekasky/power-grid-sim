package com.evankasky.backend.mapper;

import com.evankasky.backend.dto.customer.CustomerResponse;
import com.evankasky.backend.dto.location.LocationResponse;
import com.evankasky.backend.model.Customer;
import com.evankasky.backend.model.Location;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {

    public CustomerResponse toResponse(Customer customer) {

        Location location = customer.getLocation();
        LocationResponse locationResponse = new LocationResponse(location.getX(), location.getY());

        return new CustomerResponse(
                customer.getId(),
                customer.getAccountNumber(),
                customer.getName(),
                customer.getCustomerType(),
                customer.getEffectiveBillingRate(),
                locationResponse
        );

    }

}

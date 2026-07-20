package com.evankasky.backend.exception.customer;

import com.evankasky.backend.exception.PowerGridSimulationException;

public class CustomerNotFoundException extends PowerGridSimulationException {

    public CustomerNotFoundException(String message) {
        super(message);
    }

}

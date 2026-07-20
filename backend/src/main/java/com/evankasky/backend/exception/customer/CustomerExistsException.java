package com.evankasky.backend.exception.customer;

import com.evankasky.backend.exception.PowerGridSimulationException;

public class CustomerExistsException extends PowerGridSimulationException {

    public CustomerExistsException(String message) {
        super(message);
    }

}

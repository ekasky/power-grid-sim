package com.evankasky.backend.exception.powercompany;

import com.evankasky.backend.exception.PowerGridSimulationException;

public class PowerCompanyExistsException extends PowerGridSimulationException {

    public PowerCompanyExistsException(String message) {
        super(message);
    }

}

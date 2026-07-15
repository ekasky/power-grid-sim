package com.evankasky.backend.exception.powercompany;

import com.evankasky.backend.exception.PowerGridSimulationException;

public class PowerCompanyNotFoundException extends PowerGridSimulationException {

    public PowerCompanyNotFoundException(String message) {
        super(message);
    }

}

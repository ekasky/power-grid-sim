package com.evankasky.backend.exception.powersubstation;

import com.evankasky.backend.exception.PowerGridSimulationException;

public class PowerSubstationExistsException extends PowerGridSimulationException {

    public PowerSubstationExistsException(String message) {
        super(message);
    }

}

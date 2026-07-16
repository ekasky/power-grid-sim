package com.evankasky.backend.exception.powersubstation;

import com.evankasky.backend.exception.PowerGridSimulationException;

public class PowerSubstationNotFoundException extends PowerGridSimulationException {

    public PowerSubstationNotFoundException(String message) {
        super(message);
    }

}

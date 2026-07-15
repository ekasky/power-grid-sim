package com.evankasky.backend.exception.powerplant;

import com.evankasky.backend.exception.PowerGridSimulationException;

public class PowerPlantNotFoundException extends PowerGridSimulationException {

    public PowerPlantNotFoundException(String message) {
        super(message);
    }

}

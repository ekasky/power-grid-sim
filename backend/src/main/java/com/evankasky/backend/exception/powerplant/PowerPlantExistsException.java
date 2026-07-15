package com.evankasky.backend.exception.powerplant;

import com.evankasky.backend.exception.PowerGridSimulationException;

public class PowerPlantExistsException extends PowerGridSimulationException {

    public PowerPlantExistsException(String message) {
        super(message);
    }

}

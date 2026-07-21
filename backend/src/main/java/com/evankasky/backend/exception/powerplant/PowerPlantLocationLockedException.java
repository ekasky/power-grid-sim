package com.evankasky.backend.exception.powerplant;

import com.evankasky.backend.exception.PowerGridSimulationException;

public class PowerPlantLocationLockedException extends PowerGridSimulationException {

    public PowerPlantLocationLockedException(String message) {
        super(message);
    }

}

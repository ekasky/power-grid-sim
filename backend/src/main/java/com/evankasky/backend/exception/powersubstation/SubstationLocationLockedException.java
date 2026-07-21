package com.evankasky.backend.exception.powersubstation;

import com.evankasky.backend.exception.PowerGridSimulationException;

public class SubstationLocationLockedException extends PowerGridSimulationException {

    public SubstationLocationLockedException(String message) {
        super(message);
    }

}

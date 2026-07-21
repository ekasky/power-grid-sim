package com.evankasky.backend.exception.validation;

import com.evankasky.backend.exception.PowerGridSimulationException;

public class GridCapacityExceededException extends PowerGridSimulationException {

    public GridCapacityExceededException(String message) {
        super(message);
    }

}

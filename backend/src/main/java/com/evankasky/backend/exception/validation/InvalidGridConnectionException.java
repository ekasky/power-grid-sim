package com.evankasky.backend.exception.validation;

import com.evankasky.backend.exception.PowerGridSimulationException;

public class InvalidGridConnectionException extends PowerGridSimulationException {

    public InvalidGridConnectionException(String message) {
        super(message);
    }

}

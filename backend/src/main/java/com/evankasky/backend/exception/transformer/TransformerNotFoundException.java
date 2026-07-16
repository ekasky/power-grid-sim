package com.evankasky.backend.exception.transformer;

import com.evankasky.backend.exception.PowerGridSimulationException;

public class TransformerNotFoundException extends PowerGridSimulationException {

    public TransformerNotFoundException(String message) {
        super(message);
    }

}

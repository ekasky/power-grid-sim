package com.evankasky.backend.exception.transformer;

import com.evankasky.backend.exception.PowerGridSimulationException;

public class TransformerExistsException extends PowerGridSimulationException {

    public TransformerExistsException(String message) {
        super(message);
    }

}

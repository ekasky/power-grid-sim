package com.evankasky.backend.exception.transformer;

import com.evankasky.backend.exception.PowerGridSimulationException;

public class TransformerLocationLockedException extends PowerGridSimulationException {

    public TransformerLocationLockedException(String message) {
        super(message);
    }

}

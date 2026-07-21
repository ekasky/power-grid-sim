package com.evankasky.backend.exception.usagerecord;

import com.evankasky.backend.exception.PowerGridSimulationException;

public class UsageRecordExistsException extends PowerGridSimulationException {

    public UsageRecordExistsException(String message) {
        super(message);
    }

}

package com.evankasky.backend.validation;

import com.evankasky.backend.exception.validation.InvalidGridConnectionException;
import com.evankasky.backend.model.Location;
import org.springframework.stereotype.Component;

@Component
public class GridRules {

    public static final long MAX_SUBSTATIONS_PER_PLANT = 20;
    public static final long MAX_TRANSFORMERS_PER_SUBSTATION = 10;
    public static final long MAX_CUSTOMERS_PER_TRANSFORMER = 5;

    public static final long MAX_PLANT_TO_SUBSTATION_DISTANCE = 100;
    public static final long MAX_SUBSTATION_TO_TRANSFORMER_DISTANCE = 50;
    public static final long MAX_TRANSFORMER_TO_CUSTOMER_DISTANCE = 20;

    public void validateDistance(
            Location source,
            Location destination,
            long maximumDistance,
            String connectionName
    ) {

        long distance = source.distanceTo(destination);

        if(distance > maximumDistance) {
            throw new InvalidGridConnectionException(
                    connectionName + " distance is " + distance + ", but the maximum allowed distance is " +
                            maximumDistance
            );
        }

    }

}

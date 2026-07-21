package com.evankasky.backend.simulation;

import com.evankasky.backend.model.Customer;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class UsageGenerator {

    private static final double MIN_RESIDENTIAL_KWH = 300.0;
    private static final double MAX_RESIDENTIAL_KWH = 1_000.0;

    private static final double MIN_COMMERCIAL_KWH = 1_001.0;
    private static final double MAX_COMMERCIAL_KWH = 10_000.0;

    /* *****************************************************************************************************************
     *                                       Usage Generator Methods
     ***************************************************************************************************************** */

    public BigDecimal generateUsage(Customer customer) {

        double generatedUsage = switch (customer.getCustomerType()) {
            case RESIDENTIAL -> generateBetween(MIN_RESIDENTIAL_KWH, MAX_RESIDENTIAL_KWH);
            case COMMERCIAL -> generateBetween(MIN_COMMERCIAL_KWH, MAX_COMMERCIAL_KWH);
        }

        return BigDecimal.valueOf(generatedUsage).setScale(4, RoundingMode.HALF_UP);

    }

    /* *****************************************************************************************************************
     *                                              Helper Methods
     ***************************************************************************************************************** */

    private double generateBetween(
            double minimum,
            double maximum
    ) {
        return ThreadLocalRandom.current().nextDouble(minimum, maximum);
    }


}
